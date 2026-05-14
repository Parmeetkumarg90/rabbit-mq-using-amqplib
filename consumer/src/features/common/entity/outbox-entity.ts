import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import InboxEntity from "./inbox.entity";

@Entity('outbox')
export default class OutboxEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "jsonb" })
    event: object;

    @Column({ type: "bool", default: false })
    status: boolean;

    @OneToMany(() => InboxEntity, (inbox) => inbox.eventId)
    inboxIds: InboxEntity[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updateAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}