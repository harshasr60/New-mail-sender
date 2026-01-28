import { Request, Response } from "express";
import { EmailService } from "../services/emailService";

const emailService = new EmailService();

export class EmailController {
    static async schedule(req: Request, res: Response) {
        try {
            const { to, subject, body, scheduledAt, sender, idempotencyKey, smtpUser, smtpPass } = req.body;

            if (!to || !subject || !body || !scheduledAt || !sender || !idempotencyKey) {
                return res.status(400).json({ error: "Missing required fields" });
            }

            const email = await emailService.scheduleEmail({
                to,
                subject,
                body,
                scheduledAt: new Date(scheduledAt),
                sender,
                smtpUser,
                smtpPass,
                idempotencyKey
            });

            res.status(201).json(email);
        } catch (error: any) {
            if (error.code === '23505') { // Postgres duplicate key error
                res.status(409).json({ error: "Duplicate idempotency key" });
            } else {
                res.status(500).json({ error: error.message });
            }
        }
    }

    static async getScheduled(req: Request, res: Response) {
        try {
            const sender = req.query.sender as string;
            const emails = await emailService.getScheduledEmails(sender);
            res.json(emails);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getSent(req: Request, res: Response) {
        try {
            const sender = req.query.sender as string;
            const emails = await emailService.getSentEmails(sender);
            res.json(emails);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}
