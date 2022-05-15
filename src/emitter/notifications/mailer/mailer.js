import dotenv from "dotenv";
import nodemailer from "nodemailer";
import { google } from "googleapis";
dotenv.config();

const OAuth2 = google.auth.OAuth2;

const createTransporter = async () => {
    const oauth2Client = new OAuth2(
        process.env.CLIENT_ID,
        process.env.CLIENT_SECRET
    );

    oauth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

    const accessToken = oauth2Client.getAccessToken();

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            type: "OAuth2",
            user: process.env.EMAIL,
            accessToken: accessToken,
            clientId: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            refreshToken: process.env.REFRESH_TOKEN,
        },
    });

    return transporter;
};

const sendEmailReminder = async (reminder) => {
    const emailOptions = {
        subject: `REMINDER: ${reminder.title}`,
        text: `REMINDER FROM REMINDER APP\n${reminder.content}`,
        to: reminder.email,
        bcc: process.env.EMAIL,
    };

    let transporter = await createTransporter();
    await transporter.sendMail(emailOptions);
};

const sendRegistrationEmail = async (username, email, hash) => {
    const emailBody = `
    Hi ${username}, 


    Please use this activation code to activate your account: 


    ${hash}


    Thank you!
    - Mr. Reminder
    `;

    const emailOptions = {
        subject: "Activate your account to use the Reminders App!",
        text: emailBody,
        to: email,
        bcc: process.env.EMAIL,
    };

    let transporter = await createTransporter();
    await transporter.sendMail(emailOptions);
};

const sendTempPassword = async (username, email, tempPass) => {
    const emailBody = `
    Hi ${username}, 


    This is your temporary password to log into your account. You will be asked to change your password after logging in.  


    ${tempPass}


    Thank you!
    - Mr. Reminder
    `;

    const emailOptions = {
        subject: "Temporary Password for the Reminders App!",
        text: emailBody,
        to: email,
        bcc: process.env.EMAIL,
    };

    let transporter = await createTransporter();
    await transporter.sendMail(emailOptions);
};

export { sendEmailReminder, sendRegistrationEmail, sendTempPassword };
