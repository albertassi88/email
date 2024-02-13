require("dotenv").config();
const sendGrid = require("@sendgrid/mail");
sendGrid.setApiKey(process.env.SENDGRID);
const fs = require('fs');

const sendEmail = (to, from, subject, htmlContent, attachmentPath) => {
    try {
        if (!fs.existsSync(attachmentPath)) {
            throw new Error(`Arquivo não encontrado: ${attachmentPath}`);
        }

        const message = {
            to, 
            from, 
            subject, 
            html: htmlContent,
            attachments: [
                {
                    content: fs.readFileSync(attachmentPath, { encoding: 'base64' }),
                    filename: 'boleto.pdf',
                    type: 'application/pdf',
                    disposition: 'attachment',
                },
            ],
        };

        sendGrid.send(message, (err, result) => {
            if (err) {
                console.log("Email não enviado!");
            } else {
                console.log("Email enviado com sucesso!");
            }
        });
    } catch (error) {
        console.error(error.message);
    }
};

module.exports = sendEmail;
