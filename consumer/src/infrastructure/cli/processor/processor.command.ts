import { Command, CommandRunner } from 'nest-commander';
import ProcessorService from '../../rabbitmq/processor/processor.service';

@Command({
  name: 'consume:events',
  description: 'Get messages from queue and consume them',
})
export default class ProcessorCommand extends CommandRunner {
  constructor(private readonly processorService: ProcessorService) {
    super();
  }

  async run(): Promise<void> {
    await this.processorService.getRabbitMqServerForProcessor();
  }
}
