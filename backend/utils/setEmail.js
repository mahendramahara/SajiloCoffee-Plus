import nodemailer from "nodemailer";

export const sentEmail = options => {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });

    const mailOptions = {
        from: options.from || "no-reply@sajilocoffee.shop",
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
        
    };

    return transporter.sendMail(mailOptions);
}