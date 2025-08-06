import nodeMailer, { Transporter } from 'nodemailer';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';
import ejs from 'ejs';
import path from 'path';

interface IEmailOptions {
  email: string;
  subject: string;
  template: string;
  data: {[key: string]: any}
}

export const sendEmail = async (options: IEmailOptions): Promise<void> => {
  const transporter: Transporter = nodeMailer.createTransport({
    host: process.env.SMTP_HOST as string,
    service: process.env.SMTP_SERVICE,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  } as SMTPTransport.Options);

  const { email, subject, template, data} = options;

  // get the path to the email template file
  const __dirname = path.resolve();
  const templatePath = path.join(__dirname, '/src/mails', template);

  // Render the email template with EJS
  const html: string = await ejs.renderFile(templatePath, data);

  const mailOptions = {
    from: process.env.SMTP_MAIL,
    to: email,
    subject,
    html,
  };
  await transporter.sendMail(mailOptions);
};
