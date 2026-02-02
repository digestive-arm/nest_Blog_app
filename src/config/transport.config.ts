import { type MailerOptions } from "@nestjs-modules/mailer";

import { secretConfig } from "./env.config";

const transportConfig: MailerOptions = {
  transport: {
    host: secretConfig.mailerServiceHost,
    port: Number(secretConfig.mailerServicePort),
    secure: false,
    auth: {
      user: secretConfig.mailerServiceUser,
      pass: secretConfig.mailerServicePassword,
    },
  },
  defaults: {
    from: '"No Reply" <noreply@example.com>',
  },
};
export default transportConfig;
