require("dotenv").config();
const sendGrid = require("@sendgrid/mail");
sendGrid.setApiKey(process.env.SENDGRID);

const sendForgetEmail = async (to, from, subject, htmlContent) => {
    try {
            await sendGrid.send({
            to,
            from,
            subject,
            html: htmlContent,
        });    
        console.log("Email enviado com sucesso!");
    } catch (error) {
        console.error("Erro ao enviar o e-mail:", error);
        throw error; 
    }
};

module.exports = sendForgetEmail;