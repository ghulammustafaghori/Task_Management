const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'Gmail', // or your SMTP service
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendOtpEmail = async (toEmail, otp) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: toEmail,
        subject: 'Your OTP for Email Verification',
        text: `Your OTP is: ${otp}. It will expire in 5 minutes.`
    };

    await transporter.sendMail(mailOptions);
};

module.exports = sendOtpEmail;