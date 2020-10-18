const imp = require('../import.js');
const nodemailer = imp.nodemailer();
const fs = imp.fs();
const cst = imp.cst();
const property = imp.prop();
const mailProperties = JSON.parse(fs.readFileSync(cst.PATH_CONF_MAIL));

let transporter = nodemailer.createTransport({
    service: mailProperties.email_service,
    auth: {
        user: mailProperties.email_adress,
        pass: mailProperties.email_password
    }
});

/**
 * Send mail to confirm new user
 *
 * @param {*} mail the user mail
 * @param {*} token the user token
 */
async function sendMail(mail, token){

    const url_to_confirm = cst.URL + property.url_utilisateur + "/confirmMail/" + token;

    let info = await transporter.sendMail({
        from: '"Trasho" <'+ mailProperties.email_adress+ '>',
        to: mail,
        subject: "Trasho - Confirmez votre adresse mail",
        text: "Bienvenue chez Trasho - Cliquez votre email ici : " + url_to_confirm, // plain text body
        html: "<h1>Bienvenue chez Trasho</h1><br/>"+
            "Confirmez votre mail en suivant <a href=" + url_to_confirm +">ce lien</a>" // html body
    });

    console.log("Message sent: %s", info.messageId);

    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}

/**
 * Send user data by mail
 *
 * @param {*} mail the user mail
 * @param {*} content the user data
 */
async function sendMailDataUser(mail, content){
    
    let info = await transporter.sendMail({
        from: '"Trasho" <'+ mailProperties.email_adress+ '>',
        to: mail,
        subject: "Trasho - Données utilisateur",
        text: "Vous trouverez en pièce jointe vos données utilisateurs stockés par Trasho. Bonne journée, Équipe Trasho", // plain text body
        html: "<p>Vous trouverez en pièce jointe vos données utilisateurs stockés par Trasho.</p><br/>"+
            "Bonne journée,<br/> Équipe Trasho", // html body
        attachments: [
            {   // utf-8 string as an attachment
                filename: 'user_data_trasho.txt',
                content: content
            }
        ]
    });

    console.log("Message sent: %s", info.messageId);

    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

}

module.exports = {sendMail, sendMailDataUser};