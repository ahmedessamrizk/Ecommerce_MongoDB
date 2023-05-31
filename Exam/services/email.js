import nodeoutlook from 'nodejs-nodemailer-outlook'
import dotenv from 'dotenv'
dotenv.config()

export function myEmail(email, subject, message) {
    nodeoutlook.sendEmail({
        auth: {
            user: process.env.senderEmail,
            pass: process.env.senderEmailPassword
        },
        from: process.env.senderEmail,
        to: email,
        subject: subject,
        html: message,
        onError: (e) => console.log(e),
        onSuccess: (i) => console.log(i),
        tls:{
            rejectUnauthorized: false
        }
    }
    
    );
}