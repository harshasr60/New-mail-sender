import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';
import { getSentEmails } from '../../services/api';
import { CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';

export default function SentEmails() {
    const { user } = useAuth();

    // Auto-refresh every 5 seconds
    const { data: emails, isLoading, error } = useQuery({
        queryKey: ['sent', user?.email],
        queryFn: () => getSentEmails(user?.email || ''),
        enabled: !!user?.email,
        refetchInterval: 5000
    });

    if (isLoading) return (
        <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
    );

    if (error) return (
        <div className="text-center py-10 bg-red-50 rounded-xl border border-red-100 mx-4">
            <p className="text-red-600 font-medium">Unable to load sent history</p>
        </div>
    );

    if (!emails || emails.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="bg-gray-50 p-6 rounded-full mb-4">
                    <CheckCircle2 className="w-10 h-10 text-gray-300" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">No sent emails yet</h3>
                <p className="text-gray-500 mt-1 max-w-sm">When you send or schedule emails, they will appear here in your history.</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b border-gray-100">
                        <th className="px-6 py-5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Recipient</th>
                        <th className="px-6 py-5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Subject</th>
                        <th className="px-6 py-5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Date Sent</th>
                        <th className="px-6 py-5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {emails.map((email) => (
                        <tr key={email.id} className="group hover:bg-gray-50/50 transition-colors duration-200">
                            <td className="px-6 py-4">
                                <span className="text-sm font-medium text-gray-900 block">{email.to}</span>
                            </td>
                            <td className="px-6 py-4">
                                <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">{email.subject}</span>
                            </td>
                            <td className="px-6 py-4">
                                <span className="text-sm text-gray-500 font-medium">
                                    {email.sentAt ? format(new Date(email.sentAt), 'MMM d, yyyy • h:mm a') : '-'}
                                </span>
                            </td>
                            <td className="px-6 py-4">
                                {email.status === 'PENDING' ? (
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100">
                                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2 animate-pulse"></span>
                                        Sending...
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-200 shadow-sm">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2"></span>
                                        Successfully Sent
                                    </span>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
