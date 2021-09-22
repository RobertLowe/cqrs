import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { CommandBus } from './command-bus';
import { EventBus } from './event-bus';
import { EventPublisher } from './event-publisher';
import { IEvent } from './interfaces';
import { QueryBus } from './query-bus';
import { ExplorerService } from './services/explorer.service';

@Module({
  providers: [CommandBus, QueryBus, EventBus, EventPublisher, ExplorerService],
  exports: [CommandBus, QueryBus, EventBus, EventPublisher],
})
export class CqrsModule<EventBase extends IEvent = IEvent>
  implements OnApplicationBootstrap {
  constructor(
    protected readonly explorerService: ExplorerService<EventBase>,
    protected readonly eventsBus: EventBus<EventBase>,
    protected readonly commandsBus: CommandBus,
    protected readonly queryBus: QueryBus,
  ) {}

  onApplicationBootstrap() {
    const { events, queries, sagas, commands } = this.explorerService.explore();

    this.eventsBus.register(events);
    this.commandsBus.register(commands);
    this.queryBus.register(queries);
    this.eventsBus.registerSagas(sagas);
  }
}
