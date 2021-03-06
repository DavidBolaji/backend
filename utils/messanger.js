const nodemailer = require('nodemailer');
const inlinecss = require('nodemailer-juice');
const pug = require('pug')
const { MAILJET_USER, MAILJET_PORT, MAILJET_PASSWORD, MAILJET_HOST, MAILJET_ADDRESS} = process.env;

exports.emailService = class Email{
    constructor(sender){
        this.from = sender || MAILJET_ADDRESS
    }
    transporter() {
        return(nodemailer.createTransport({
            host:MAILJET_HOST,
            port: MAILJET_PORT,
            auth: {
                user: MAILJET_USER,
                pass: MAILJET_PASSWORD
            }
        }));
    }

    async activate(body){
        let html = pug.renderFile("./public/email/activation_email.pug", body.data)
        const mailOptions = {
            from: this.from,
            to: body.recipient,
            subject: body.subject,
            html: html,
            priority: "high",
        };
        // Create a transport and send email
        this.transporter().use('compile', inlinecss());
        let res = await this.transporter().sendMail(mailOptions);
        return res.accepted
    }

    async reset(body){
        let html = pug.renderFile("./public/email/pwd_reset_email.pug", body.data)
        const mailOptions = {
            from: this.from,
            to: body.recipient,
            subject: body.subject,
            html: html,
            priority: "high",
        };
        // Create a transport and send email
        this.transporter().use('compile', inlinecss());
        let res = await this.transporter().sendMail(mailOptions);
        return res.accepted
    }

    async send(body){
        const mailOptions = {
            from: this.from,
            to: body.recipient,
            subject: body.subject,
            text: body.text,
            html: body.message || body.html,
            priority: body.priority || "normal",
            attachments: body.attachments
        };

        // Create a transport and send email
        this.transporter().use('compile', inlinecss());
        let res = await this.transporter().sendMail(mailOptions);
        return res.accepted
    }
}