const variosDias = (item, element, user) => `    
    <h3>Olá ${item.name}, tudo bem?</h3>
    <h3>Lembrete amigável:</h3>
    <h3>Estamos lhe encaminhando o boleto bancário da ${user.company} com vencimento em ${element.vencimento}.</h3>
    <h3>Qualquer dúvida favor entrar em contato com o financeiro da ${user.company} pelo e-mail ${user.email}.</h3>
    <h3>Att. ${user.name}.</h3>`
;

const amanha = (item, element, user) => `
    <h3>Olá ${item.name}, tudo bem?</h3>
    <h3>Lembrete amigável: o vencimento do seu boleto é <strong>Amanhã<strong>. Pague a tempo e evite taxas extras.</h3>
    <h3>Estamos lhe encaminhando o boleto bancário da ${user.company} com vencimento em ${element.vencimento}.</h3>
    <h3>Qualquer dúvida favor entrar em contato com o financeiro da ${user.company} pelo e-mail ${user.email}.</h3>
    <h3><strong>Se você já efetuou o pagamento, por favor desconsidere este e-mail.<strong></h3>
    <h3>Att. ${user.name}.</h3>`
;

const hoje = (item, element, user) => `
    <h3>Olá ${item.name}, tudo bem?</h3>
    <h3>Lembrete amigável: o vencimento do seu boleto é <strong>Hoje<strong>. Pague a tempo e evite taxas extras.</h3>
    <h3>Estamos lhe encaminhando o boleto bancário da ${user.company} com vencimento em ${element.vencimento}.</h3>
    <h3>Qualquer dúvida favor entrar em contato com o financeiro da ${user.company} pelo e-mail ${user.email}.</h3>
    <h3><strong>Se você já efetuou o pagamento, por favor desconsidere este e-mail.<strong></h3>
    <h3>Att. ${user.name}.</h3>`
;

module.exports = { 
    variosDias, 
    amanha, 
    hoje 
};