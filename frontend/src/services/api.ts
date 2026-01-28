import axios from "axios";

const api = axios.create({
    baseURL: "/api", // Proxy will handle this in Vite
    headers: {
        "Content-Type": "application/json",
    },
});

export default api;

export interface ScheduledEmail {
    id: string;
    to: string;
    subject: string;
    body: string;
    scheduledAt: string;
    sentAt?: string;
    status: 'PENDING' | 'SENT' | 'FAILED' | 'RESCHEDULED';
    sender: string;
    failureReason?: string;
}

export const scheduleEmail = async (data: any) => {
    const response = await api.post<ScheduledEmail>("/schedule", data);
    return response.data;
};

export const getScheduledEmails = async (sender: string) => {
    const response = await api.get<ScheduledEmail[]>(`/scheduled?sender=${sender}`);
    return response.data;
};

export const getSentEmails = async (sender: string) => {
    const response = await api.get<ScheduledEmail[]>(`/sent?sender=${sender}`);
    return response.data;
};
