import { Test } from '@nestjs/testing';
import { CONFIG_OPTIONS } from 'src/common/common.constants';
import { MailService } from './mail.service';
import * as FormData from 'form-data';
import got from 'got';

jest.mock('got');
jest.mock('form-data');

describe('MailService', () => {
  let service: MailService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        MailService,
        {
          provide: CONFIG_OPTIONS,
          useValue: {
            apiKey: 'test-api-key',
            domain: 'test-domain',
            fromEmail: 'test-email',
          },
        },
      ],
    }).compile();
    service = module.get<MailService>(MailService);
  });

  it('should be defined', async () => {
    expect(service).toBeDefined();
  });

  it('should send verification email', () => {
    const sendVerificationArgs = {
      email: 'email',
      code: 'code',
    };
    jest.spyOn(service, 'sendEmail').mockImplementation(async () => true);
    service.sendVerificationEmail(
      sendVerificationArgs.email,
      sendVerificationArgs.code,
    );
    expect(service.sendEmail).toHaveBeenCalledTimes(1);
    expect(service.sendEmail).toHaveBeenCalledWith(
      'verify Your email',
      'validation-code',
      [
        { key: 'code', value: 'code' },
        { key: 'username', value: 'email' },
      ],
    );
  });
  describe('sendEmail', () => {
    it('should send verification email', async () => {
      const ok = await service.sendEmail('', '', []);
      const formSpy = jest.spyOn(FormData.prototype, 'append');
      expect(formSpy).toHaveBeenCalled();
      expect(got.post).toHaveBeenCalledTimes(1);
      expect(got.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Object),
      );
      expect(ok).toEqual(true);
    });
    it('fails on error', async () => {
      jest.spyOn(got, 'post').mockImplementation(() => {
        throw new Error();
      });
      const ok = await service.sendEmail('', '', []);
      expect(ok).toEqual(false);
    });
  });
});
