import nodemailer from 'nodemailer';

const host = process.env.SMTP_HOST;
const port = process.env.SMTP_PORT;
const secure = process.env.SMTP_SECURE === 'true';
const user = process.env.SMTP_USER;
const pass = process.env.SMTP_PASS;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';

if (!host || !port || !user || !pass) {
    throw new Error('SMTP configuration is missing. Please check your environment variables.');
}
const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
        user,
        pass,
    },

});

export const sendVerificationEmail = async (email, token) => {
    transporter.sendMail({
        from: `"Your App" <${user}>`,
        to: email, 
        subject: 'Email Verification',
        html: `<b>Please verify your email by clicking the link: <a href="${CLIENT_URL}/verify/${token}">Verify Email</a></b>`, 
    })
}