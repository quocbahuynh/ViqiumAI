import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
    service: 'gmail', // or use any other email service provider
    auth: {
        user: process.env.MAIL_USER, // Your email
        pass: process.env.MAIL_PASS, // Your email password
    },
});