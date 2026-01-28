import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';
import { getScheduledEmails } from '../../services/api';
import { Clock } from 'lucide-react';
import { format } from 'date-fns';

export default function ScheduledEmails() {
    const { user } = useAuth();

    // Auto-refresh every 5 seconds
    const { data: emails, isLoading, error } = useQuery({
        queryKey: ['scheduled', user?.email],
        queryFn: () => getScheduledEmails(user?.email || ''),
        enabled: !!user?.email,
        refetchInterval: 5000
    });

    if (isLoading) return <div className="text-center py-10">Loading...</div>;
    if (error) return <div className="text-center py-10 text-red-500">Failed to load emails</div>;

    if (!emails || emails.length === 0) {
        return (
            <div className="text-center py-20 bg-white rounded-xl border border-gray-200">
                <div className="flex justify-center mb-4">
                    <div className="bg-gray-100 p-4 rounded-full">
                        <Clock className="w-8 h-8 text-gray-400" />
                    </div>
                </div>
                <h3 className="text-lg font-medium text-gray-900">No scheduled emails</h3>
                <p className="text-gray-500">Scheduled emails will appear here.</p>
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
                        <th className="px-6 py-5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Scheduled For</th>
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
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Clock className="w-4 h-4 text-gray-400" />
                                    <span>{format(new Date(email.scheduledAt), 'MMM d, yyyy • h:mm a')}</span>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-100">
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5 animate-pulse"></span>
                                    {email.status}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
