import nodemailer from 'nodemailer';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { email, message } = req.body;

        // Konfigurieren Sie hier Ihre E-Mail-Server-Details
        const transporter = nodemailer.createTransport({
            service: 'Gmail', // Zum Beispiel Gmail, aber Sie können jeden SMTP-Server verwenden
            auth: {
                user: process.env.EMAIL_USER, // Ihre E-Mail-Adresse
                pass: process.env.EMAIL_PASS, // Ihr E-Mail-Passwort
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Group Invite',
            text: message,
        };

        try {
            await transporter.sendMail(mailOptions);
            res.status(200).json({ success: true });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error sending email' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
