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

  async sendEmail(
    subject: string,
    template: string,
    emailVars: EmailVar[],
  ): Promise<boolean> {
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
      await got.post(
        `https://api.mailgun.net/v3/${this.options.domain}/messages`,
        {
          headers: {
            Authorization: `Basic ${Buffer.from(
              `api:${this.options.apiKey}`,
            ).toString('base64')}`,
          },
          body: form,
        },
      );
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  sendVerificationEmail(email: string, code: string) {
    this.sendEmail('verify Your email', 'validation-code', [
      { key: 'code', value: code },
      { key: 'username', value: email },
    ]);
  }
}
