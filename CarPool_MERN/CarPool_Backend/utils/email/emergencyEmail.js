import nodeMailer from 'nodemailer';
import {customError} from './../../middlewares/errorhandler.middleware.js'
import dotenv from 'dotenv';
dotenv.config();
const senderEmail = process.env.SENDER_EMAIL_ID;
const senderPass = process.env.SENDER_EMAIL_PASS;

export const sendEmail = async (receiver, subject, message)=>{
    console.log("Mail Config", receiver);
    
    const transport = nodeMailer.createTransport({
        service: 'gmail',
        auth: {
            user: senderEmail,
            pass: senderPass
        }
    });

    const mailOptions = {
        from: `Car Buddy ${senderEmail}` ,
        to: receiver,
        subject: subject,
        text: message
    };

    try {
        const result = await transport.sendMail(mailOptions);
        return result;
    } catch (error) {
        throw new customError(500, error.message || 'Error while sending email');
    }
}
