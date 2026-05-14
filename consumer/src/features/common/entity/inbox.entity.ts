import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import OutboxEntity from "./outbox-entity";

@Entity('inbox')
export default class InboxEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => OutboxEntity, (outbox) => outbox.inboxIds)
    eventId: OutboxEntity;

    @Column({ type: "varchar" })
    handlerName: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updateAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}