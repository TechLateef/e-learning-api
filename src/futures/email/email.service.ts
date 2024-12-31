import * as nodeM from 'nodemailer';
import * as pug from 'pug';
import * as path from 'path';
import { join } from 'path';
import { convert } from 'html-to-text';
import { User } from '../users/entities/user.entity';

export class EmailService {
  private user: User;
  private to: string;
  private firstName: string;
  private from: string;
  private url: string;
  private moduleDir: string;
  private otp: string;

  constructor(user: User, url: string, to?: string, otp?: string) {
    this.user = user;
    this.to = to || user?.email;
    this.firstName = user?.fullName?.split(' ')[0];
    this.from = process.env.EMAIL_FROM || '';
    this.url = url || process.env.WEB_APP_URL || '';
    this.otp = otp || user?.otp;

    this.moduleDir = path.dirname(__filename);
  }

  private mailer(): nodeM.Transporter {
    return nodeM.createTransport({
      host: 'smtp-relay.brevo.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.BREVO_USERNAME || '',
        pass: process.env.BREVO_PASSWORD || '',
      },
    });
  }
  private async send(
    template: string,
    subject: string,
    params: any = {},
    attachment: [] = [],
  ): Promise<void> {
    const welcomePugFilePath = join(
      process.cwd(),
      'src/modules/email/',
      `${template.toLowerCase()}.pug`,
    );
    const html = pug.renderFile(welcomePugFilePath, {
      firstName: this.firstName,
      url: this.url,
      otp: this.otp,
      subject,
      ...params,
    });
    const mailOptions = {
      from: this.from,
      to: this.to,
      fromName: 'Educational team',
      subject,
      html,
      text: convert(html, { wordwrap: 130 }),
      attachments: attachment,
    };
    // console.log(mailOptions)
    try {
      this.mailer().sendMail(mailOptions);
    } catch (ex) {
      delete (mailOptions as { html?: string }).html;
      console.error('Error sending Email', mailOptions, ex);
      console.error(ex); // Log the error properly
    }
  }

  public async EmailVerification(): Promise<void> {
    await this.send('Welcome', `Welcome`);
  }

  public async sendPasswordReset(): Promise<void> {
    await this.send('resetPassword', `Reset Password`);
  }

  public async sendTwoFactorCode(): Promise<void> {
    await this.send('2fa', `Two Factor Authentication`);
  }
}
