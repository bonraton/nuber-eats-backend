import { Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { EmailVar, MailModuleOptions } from './mail.interfaces';
import { CONFIG_OPTIONS } from 'src/common/common.constants';
import got from 'got';
import * as FormData from 'form-data';

@Injectable()
export class MailService {
  constructor(
    @Inject(CONFIG_OPTIONS) private readonly options: MailModuleOptions,
  ) {}

  private async sendEmail(
    subject: string,
    template: string,
    emailVars: EmailVar[],
  ) {
    const form = new FormData();
    form.append(
      'from',
      `Oleg from Nuber Eats <mailgun@${this.options.domain}>`,
    );
    form.append('to', `bonraton@gmail.com`);
    form.append('template', template);
    form.append('subject', subject);
    emailVars.forEach((eVar) => form.append(`v:${eVar.key}`, eVar.value));
    try {
      await got(`https://api.mailgun.net/v3/${this.options.domain}/messages`, {
        method: 'POST',
        headers: {
          Authorization: `Basic ${Buffer.from(
            `api:${this.options.apiKey}`,
          ).toString('base64')}`,
        },
        body: form,
      });
    } catch (e) {
      console.log(e);
    }
  }

  sendVerificationEmail(email: string, code: string) {
    this.sendEmail('verify Your email', 'validation-code', [
      { key: 'code', value: code },
      { key: 'username', value: email },
    ]);
  }
}
