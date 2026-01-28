import nodemailer from "nodemailer";

export const createTransporter = async () => {
    // Check if we have real credentials
    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASS;

    if (user && pass && user !== 'your_email@gmail.com') {
        // Use Real Gmail/SMTP
        const transporter = nodemailer.createTransport({
            service: 'gmail', // Simplest for Gmail. For others use host/port.
            auth: {
                user: user,
                pass: pass,
            },
        });
        return { transporter };
    } else {
        // Fallback to Ethereal if no real credentials provided
        const testAccount = await nodemailer.createTestAccount();
        const transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass,
            },
        });
        return { transporter, testAccount };
    }
};
