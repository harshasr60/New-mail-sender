import { Worker, Job } from "bullmq";
import { redisConnection } from "../config/redis";
import { AppDataSource } from "../config/data-source";
import { ScheduledEmail, EmailStatus } from "../models/ScheduledEmail";
import { RateLimiter } from "../utils/rateLimiter";
import { createTransporter } from "../config/email";
import nodemailer from "nodemailer";

export const emailWorker = new Worker(
    "email-queue",
    async (job: Job) => {
        const { emailId } = job.data;

        console.log(`Processing job ${job.id} for email ${emailId}`);

        const emailRepo = AppDataSource.getRepository(ScheduledEmail);
        const email = await emailRepo.findOneBy({ id: emailId });

        if (!email) {
            console.error(`Email not found: ${emailId}`);
            return;
        }

        // Check Rate Limit
        const canSend = await RateLimiter.checkRateLimit(email.sender);

        if (!canSend) {
            console.warn(`Rate limit exceeded for sender ${email.sender}. Rescheduling...`);

            // Calculate delay until next hour
            const delayInSeconds = RateLimiter.getSecondsUntilNextHour();
            const nextAttempt = new Date(Date.now() + delayInSeconds * 1000);

            // Update DB status
            email.status = EmailStatus.RESCHEDULED;
            email.scheduledAt = nextAttempt;
            await emailRepo.save(email);

            // Move job to delayed (throw error with special handling or use delay feature)
            // BullMQ approach: we can throw a special error or add a new delayed job.
            // Best approach here: add a NEW job with delay and finish this one.
            // OR use job.moveToDelayed (requires moving logic).

            // Simplest: throw an error to retry, but that uses retries.
            // Better: Re-queue with delay.
            await job.moveToDelayed(Date.now() + delayInSeconds * 1000, job.token);
            return;
        }

        // Send Email
        try {
            let transporter;

            // USE DYNAMIC CREDENTIALS IF PROVIDED
            if (email.smtpUser && email.smtpPass) {
                console.log(`Using custom SMTP for ${email.smtpUser}`);
                transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: email.smtpUser,
                        pass: email.smtpPass,
                    },
                });
            } else {
                // Fallback to global config
                const config = await createTransporter();
                transporter = config.transporter;
            }

            const info = await transporter.sendMail({
                from: email.smtpUser ? `"${email.smtpUser}" <${email.smtpUser}>` : '"Allocator Service" <allocator@example.com>',
                to: email.to,
                subject: email.subject,
                text: email.body,
            });

            console.log(`Message sent: ${info.messageId}`);
            console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);

            // Update DB
            email.status = EmailStatus.SENT;
            email.sentAt = new Date();
            await emailRepo.save(email);

            // Increment Rate Limit
            await RateLimiter.increment(email.sender);

        } catch (error: any) {
            console.error("Failed to send email:", error);

            // Handle "Too many login attempts" or temporary auth errors
            if (error.responseCode === 454 || error.code === 'EAUTH') {
                console.warn(`Temporary Auth Error (${error.responseCode}). Rescheduling for 1 hour later.`);

                const delayInSeconds = 3600; // 1 Hour
                const nextAttempt = new Date(Date.now() + delayInSeconds * 1000);

                email.status = EmailStatus.RESCHEDULED;
                email.scheduledAt = nextAttempt;
                email.failureReason = `Temporary Auth Error (454/EAUTH). Retrying at ${nextAttempt.toLocaleTimeString()}`;

                await emailRepo.save(email);
                await job.moveToDelayed(Date.now() + delayInSeconds * 1000, job.token);
                return;
            }

            email.status = EmailStatus.FAILED;
            email.failureReason = error.message || "Unknown error";
            await emailRepo.save(email);
            throw error;
        }
    },
    {
        connection: redisConnection,
        concurrency: parseInt(process.env.WORKER_CONCURRENCY || "1"),
        limiter: {
            // Internal BullMQ limiter could be used here too, but we implemented custom Redis one per requirements
            max: 100,
            duration: 1000
        }
    }
);
