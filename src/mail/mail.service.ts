import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;
  
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: 'josie.gerlach@ethereal.email',
        pass: 'qJYjbPVESkE6TMnAyP'
      },
    });
  }
  
  async sendResetLink(email: string, token: string) {
    const resetLink = `http://localhost:3000/reset-password?token=${token}`;
    const mailOptions = {
      from: 'Auth-backend service',
      to: email,
      subject: 'Reset password',
      html: `<p>Please click on the link to reset your password: <a href="${resetLink}">Reset password</a></p>`,
    };
    await this.transporter.sendMail(mailOptions);
  }
}
