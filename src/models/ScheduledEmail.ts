import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from "typeorm";

export enum EmailStatus {
    PENDING = "PENDING",
    SENT = "SENT",
    FAILED = "FAILED",
    RESCHEDULED = "RESCHEDULED"
}

@Entity()
@Index(["sender", "status"]) // Optimize querying pending emails for a sender
export class ScheduledEmail {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    to!: string;

    @Column()
    subject!: string;

    @Column("text")
    body!: string;

    @Column()
    scheduledAt!: Date;

    @Column({ nullable: true })
    sentAt!: Date;

    @Column({ nullable: true, type: "text" })
    failureReason?: string;

    @Column({
        type: "enum",
        enum: EmailStatus,
        default: EmailStatus.PENDING
    })
    status!: EmailStatus;

    @Column()
    sender!: string;

    @Column({ nullable: true })
    smtpUser?: string;

    @Column({ nullable: true })
    smtpPass?: string;

    @Column({ unique: true })
    idempotencyKey!: string;

    @CreateDateColumn()
    createdAt!: Date;
}
