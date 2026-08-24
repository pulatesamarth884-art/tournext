const nodemailer = require('nodemailer');

const sendEmail = async options => {
    
    //transporter
    const transporter = nodemailer.createTransport({
        secure: true,
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    //Define the email options
    const mailOptions = {
        from: 'samarth pulate <samarthpulatefake@gmail.com>',
        to: options.email,
        subject: options.subject,
        text: options.message,
        //html:
    }

    //actually sent the email
    await transporter.sendMail(mailOptions)
};

module.exports = sendEmail;