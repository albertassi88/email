const AuthUserModel = require('../schemas');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const extractTextFromPDF = require('../../../services/pdf'); 
const sendEmail = require("../../../services/sendEmail");
const sendForgetEmail = require("../../../services/sendEmail/forgetEmail");
const mensagens = require("../utils/message");
const { differenceInDays, parse } = require('date-fns');
const fs = require('fs');
const crypto = require('crypto');

require('dotenv').config();

const getUser = async (req, res) => {
  try {
    const nameQuery = req.query.name; 
    
    let query = {}; 
    
    if (nameQuery) {
      query.name = nameQuery;
    }

    const people = await AuthUserModel.find(query).select('-password -passwordRepeat');
    res.status(200).json(people)
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

const getUserId = async(req, res) => {
  const id = req.params.id;
  try {
      const result = await AuthUserModel.findOne({_id: id}).select('-password -passwordRepeat');
      if (!result) {
          return res.status(422).json({ message: 'Usuário não encontrado!' });
      }

      // Ordenar os dados de uploads pelo campo "vencimento"
      result.clients.forEach((client) => {
        client.upload.sort((a, b) => {
          return a.vencimento.split('/').reverse().join() < b.vencimento.split('/').reverse().join() ? -1 : 1;
        });
      });
      
      res.status(200).json(result);
  } catch (error) {
      res.status(500).json({message: error.message});
  }
};

postUser = async (req, res) => {
  const { name, company, cnpjCpf, email, password, passwordRepeat, status, dateRegister } = req.body;

  const userExists = await AuthUserModel.findOne({email: email});

  if (userExists) {
    return res.status(422).json({ message: "Por favor utilize outro e-mail!" })
  }

  //criar senha
  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(password, salt);

  const user = new AuthUserModel ({
    name,
    company,
    cnpjCpf,
    email,
    password: passwordHash,
    passwordRepeat: passwordHash,
    status,
    dateRegister
  });  
  
  try {
    await AuthUserModel.create(user);
    res.status(201).json({message: "Usuário inserido no sistema com sucesso!"});
  } catch (err) {
    console.log(err)
    res.status(400).json({ message: err.message });
  }
};

//Autenticar Login
postAuthUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    return res.status(422).json({ message: "O email é obrigatório!" })
  }

  if (!password) {
      return res.status(422).json({ message: "A senha é obrigatória!" })
  } 

  const user = await AuthUserModel.findOne({email: email});
  if (!user) {
    return res.status(404).json({ message: "Usuário não encontrado!" })
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(422).json({ message: "Senha inválida!" })
  }

  try {
    const secret = process.env.JWT_SECRET;
    const token = jwt.sign({id: user._id}, secret);

    const { email, name, company, cnpjCpf, status, dateRegister, _id } = user;
    
    const usuario = {
      _id,
      email, 
      name, 
      company, 
      cnpjCpf, 
      status, 
      dateRegister
    }

    res.status(200).json({message: "Autenticação realizada com sucesso!", token, usuario});
  } catch (error) {
      res.status(500).json({ message: error });
  }
}

const putUser = async (req, res) => {
  const userId = req.params.id;
  const newBody = req.body //o body que vai vir na rota
  
  const pdfPath = req?.files?.map(item => item.originalname); //arquivos recebidos pelo usuário
  for (let i = 0; i < pdfPath?.length; i++) {
    pdfPath[i] = `/home/rubens/Documentos/pdfs/${pdfPath[i]}`; //adicionar o caminho em cada arquivo
  } 
  
  try {
    const user = await AuthUserModel.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }    
    let correspondencias;
    user.clients.push(newBody);
    for (const file of pdfPath) {
      await extractTextFromPDF(file).then(data => {
        const tiraEspaco = data.text.replace(/\s+/g, '');
        const padrao = /Vencimento.*?(\d{2}\/\d{2}\/\d{4})/;
        correspondencias = tiraEspaco.match(padrao);   
        const clientIndex = user.clients.length - 1; // Último cliente adicionado
        user.clients[clientIndex].upload.push(
          { 
            vencimento: correspondencias ? correspondencias[1] : '', 
            path: file, 
            status: false,
            statusVarios: false, 
            statusAmanha: false, 
            statusHoje: false
          }
        ); 
      });
    }    

    if (!correspondencias) {
      return res.status(404).json({ message: 'Erro ao enviar boleto!' });
    }

    // Salva as alterações no banco de dados
    await AuthUserModel.create(user);

    res.status(200).json({ message: 'Dados adicionados com sucesso.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

postSendEmail = async (req, res) => {
  const userId = req.params.id;
  const from = "naoresponder@verbtech.com.br";

  try {
      const user = await AuthUserModel.findById(userId);

      if (!user) {
          return res.status(404).json({ message: 'Usuário não encontrado.' });
      }

      const subject = `Boleto Bancário ${user.company}`;

      const formattedDate = new Date().toLocaleDateString('pt-BR');
      const dataAtual = parse(formattedDate, 'dd/MM/yyyy', new Date());
      let statusSend = false;

      user.clients.forEach(item => {
        
        item.upload.forEach(element => {
          const dataVencimento = parse(element.vencimento, 'dd/MM/yyyy', new Date());     
          const diferencaEmDias = differenceInDays(dataVencimento, dataAtual);          
          const to = item.email;
          const attachmentPath = element.path; 
          let output;

          switch (true) {
            case (diferencaEmDias <= 31 && diferencaEmDias >= 2) && !element.statusVarios:
              output = mensagens.variosDias(item, element, user);     
              element.statusVarios = true;
              element.status = true;
              statusSend = true;
              sendEmail(to, from, subject, output, attachmentPath);
              break;
            case diferencaEmDias === 1 && !element.statusAmanha:
              output = mensagens.amanha(item, element, user);
              element.statusAmanha = true;
              element.status = true;
              statusSend = true;
              sendEmail(to, from, subject, output, attachmentPath);
              break;
            case diferencaEmDias === 0 && !element.statusHoje:
              output = mensagens.hoje(item, element, user);
              element.statusHoje = true;
              element.status = true;
              statusSend = true;
              sendEmail(to, from, subject, output, attachmentPath);
              break;
            default:
          }          
        });
      });

      await AuthUserModel.create(user);

      res.status(200).json({ message: statusSend ? 'E-mail(s) enviado(s) com sucesso!.' : 'Não tem e-mail para ser enviado!.' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error! E-mail não enviado!' });
  }
};

//Deletar Cliente
const deleteClient = async (req, res) => {
  const userId = req.params.userId;
  const clientId = req.query.clientId;

  try {
    // Encontrar o usuário pelo ID e remover o cliente diretamente no banco de dados
    const result = await AuthUserModel.updateOne(
      { _id: userId },
      { $pull: { clients: { _id: clientId } } }
    );

    // Verificar se o usuário foi encontrado
    if (result.nModified === 0) {
      return res.status(404).json({ message: 'Cliente não encontrado para remoção' });
    }

    res.status(200).json({ message: 'Cliente removido com sucesso' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const atualizarClient = async (req, res) => {
  const userId = req.params.userId;
  const clientId = req.query.clientId;
  const { name, company, cnpjCpf, email } = req.body;

  try {
    const result = await AuthUserModel.updateOne(
      { _id: userId, 'clients._id': clientId },
      {
        $set: {
          'clients.$.name': name,
          'clients.$.company': company,
          'clients.$.cnpjCpf': cnpjCpf,
          'clients.$.email': email
        }
      }
    );

    if (result.nModified === 0) {
      return res.status(404).json({ message: 'Cliente não encontrado!' });
    }

    res.status(200).json({ message: 'Dados do cliente atualizados com sucesso!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const atualizarUser = async (req, res) => {
  const userId = req.params.id;
  const { name, company, cnpjCpf, email } = req.body;

  try {
    const result = await AuthUserModel.updateOne(
      { _id: userId },
      { $set: { name, company, cnpjCpf, email } }
    );

    if (result.nModified === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado!' });
    }

    res.status(200).json({ message: 'Dados do usuário atualizados com sucesso!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Deletar boleto
const deleteTicket = async (req, res) => {
  const userId = req.params.id;
  const clientId = req.query.clientId;
  const ticketId = req.query.ticketId;

  try {
    const result = await AuthUserModel.updateOne(
      { _id: userId, 'clients._id': clientId },
      { $pull: { 'clients.$.upload': { _id: ticketId } } }
    );

    if (result.nModified === 0) {
      return res.status(404).json({ message: 'Boleto não encontrado para remoção' });
    }

    res.status(200).json({ message: 'Boleto removido com sucesso' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Adicionar boleto
const putAddTicket = async (req, res) => {
  const userId = req.params.id; 
  const clientId = req.query.clientId; 

  try {
    const user = await AuthUserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    const client = user.clients.find(c => c._id == clientId);

    if (!client) {
      return res.status(404).json({ message: 'Cliente não encontrado.' });
    }

    const pdfPath = req?.files?.map(item => item.originalname) || [];

    const pdfPaths = pdfPath.map(item => `/home/rubens/Documentos/pdfs/${item}`);

    for (const file of pdfPaths) {
      try {
        const data = await extractTextFromPDF(file);
        const tiraEspaco = data.text.replace(/\s+/g, '');
        const padrao = /Vencimento.*?(\d{2}\/\d{2}\/\d{4})/;
        const correspondencias = tiraEspaco.match(padrao);

        client.upload.push({
          vencimento: correspondencias ? correspondencias[1] : '',
          path: file,
          status: false,
          statusVarios: false,
          statusAmanha: false,
          statusHoje: false,
        });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erro ao processar o PDF.' });
      }
    }

    if (pdfPaths.length === 0) {
      return res.status(404).json({ message: 'Nenhum boleto enviado.' });
    }

    await user.save();

    res.status(200).json({ message: 'Boleto(s) adicionado(s) com sucesso.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};


//Esqueceu a senha
const postForgetEmail = async (req, res) => {
  const from = "naoresponder@verbtech.com.br";
  const email = req.body.email;  
  try {
    const resetPasswordLink = `http://localhost:4200/alterar-senha/${email}`; // Substitua pelo link real
    const subject = 'Recuperar a senha';
    const to = req.body.email; //para a pessoa
    const output = `
      <h3>Pedido de alteração de senha!</h3>
      <h3>Alguém solicitou a alteração da sua senha da plataforma Verb Tech.</h3>
      <h3>Se foi você, clique no link abaixo para redefini-la.</h3>
      <button style="border: none; background-color: rgb(253, 140, 2); border-radius: 4px;">
        <p style="color: white; font-weight: bold; text-decoration:none"><a href="${resetPasswordLink}" target="_blank">Redefinir Senha</a></p>      
      </button>
      <h3>Se não foi você, por favor, ignore esta mensagem.</h3>`;     
    await sendForgetEmail(to, from, subject, output);   

    res.status(200).json({ message: 'E-mail para recuperar a senha enviado com sucesso!.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro! E-mail para recuperar a senha não enviado!' });
  }
};

//Alterar senha
const postNewPassword = async (req, res) => {
  const { email, senha, novaSenha } = req.body;

  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(senha, salt);

  try {
    const user = await AuthUserModel.findOne({ email });  

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    } 

    user.password = passwordHash;
    user.passwordRepeat = passwordHash; 

    await user.save();

    res.status(200).json({ message: 'Nova senha criada com sucesso!.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao criar a nova senha!' });
  }
};

module.exports = { 
  postUser, 
  getUser, 
  postAuthUser, 
  getUserId, 
  putUser, 
  postSendEmail,
  deleteClient,
  atualizarClient,
  atualizarUser,
  deleteTicket,
  postForgetEmail,
  postNewPassword,
  putAddTicket
};
