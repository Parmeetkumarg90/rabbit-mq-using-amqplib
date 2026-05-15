import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import InboxEntity from '../../features/common/entity/inbox.entity';
import OutboxEntity from '../../features/common/entity/outbox-entity';
import ProductEntity from '../../features/common/entity/product-entity';

dotenv.config();

const dataSource = new DataSource({
  type: process.env.DB_TYPE as any,
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT ?? '5432'),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [ProductEntity, OutboxEntity, InboxEntity],
  migrationsTableName: 'migrations',
  migrations: ['dist/infrastructure/database/migrations/*{.ts,.js}'],
  synchronize: false,
});

export default dataSource;
