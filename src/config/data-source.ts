import "reflect-metadata";
import { DataSource } from "typeorm";
import { ScheduledEmail } from "../models/ScheduledEmail";
import dotenv from "dotenv";

dotenv.config();

export const AppDataSource = new DataSource({
    type: "postgres",
    url: process.env.DATABASE_URL,
    synchronize: true, // Auto-create tables (dev only) - in prod, use migrations
    logging: false,
    entities: [ScheduledEmail],
    migrations: [],
    subscribers: [],
});
