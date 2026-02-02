import { BullModule } from "@nestjs/bull";
import { Module } from "@nestjs/common";

import { EmailQueueProcessor } from "../bull/processors/email.processor";
import { EmailJobProducer } from "../bull/producer/email.producer";
import { emailQueue } from "../bull/queues/email.queue";

@Module({
  imports: [BullModule.registerQueue(emailQueue)],
  providers: [EmailQueueProcessor, EmailJobProducer],
  exports: [EmailJobProducer],
})
export class EmailModule {}
