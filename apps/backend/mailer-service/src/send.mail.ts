import postmark from 'postmark';
import getTemplate from './read.template';
import { env } from './validations/env';

export const sendEmail = async (email: string) => {
    const postmarkClient = new postmark.ServerClient(env.POSTMARK_SECRET);
    const emailTemplate = getTemplate(); 

    try {
        await postmarkClient.sendEmail({
            From: env.EMAIL,
            To: email,
            Subject: 'New Subscription',
            HtmlBody: emailTemplate
        });
        console.log(`Email sent to ${email}`);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};
