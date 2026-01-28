import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { scheduleEmail } from '../../services/api';
import Papa from 'papaparse';
import { Upload, Calendar, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

export default function ComposeEmail() {
    const { user } = useAuth();
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const [csvFile, setCsvFile] = useState<File | null>(null);
    const [recipientCount, setRecipientCount] = useState(0);
    const [scheduledTime, setScheduledTime] = useState('');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setCsvFile(file);
            Papa.parse(file, {
                complete: (results) => {
                    // Assume first column contains emails
                    const emails = results.data.map((row: any) => row[0]).filter((email: string) => email && email.includes('@'));
                    setRecipientCount(emails.length);
                },
                header: false
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!csvFile || !scheduledTime) return;

        setLoading(true);
        setStatus(null);

        Papa.parse(csvFile, {
            complete: async (results) => {
                const emails = results.data.map((row: any) => row[0]).filter((email: string) => email && email.includes('@'));
                if (emails.length === 0) {
                    setStatus({ type: 'error', message: 'No valid emails found in CSV' });
                    setLoading(false);
                    return;
                }

                try {
                    let successes = 0;
                    for (const email of emails) {
                        await scheduleEmail({
                            to: email,
                            subject,
                            body,
                            scheduledAt: new Date(scheduledTime).toISOString(),
                            sender: user?.email,
                            // Use system defaults
                            idempotencyKey: uuidv4() // Generate unique ID for each email job
                        });
                        successes++;
                    }
                    setStatus({ type: 'success', message: `Successfully scheduled ${successes} emails` });
                    setSubject('');
                    setBody('');
                    setCsvFile(null);
                    setRecipientCount(0);
                    setScheduledTime('');
                } catch (error) {
                    setStatus({ type: 'error', message: 'Failed to schedule some emails. Please try again.' });
                } finally {
                    setLoading(false);
                }
            },
            header: false
        });
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <div className="text-center mb-10">
                <h3 className="text-2xl font-bold text-gray-900">Create New Campaign</h3>
                <p className="text-gray-500 mt-2">Upload your recipients and schedule your message</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Subject Field */}
                <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">Subject Line</label>
                    <input
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-400 font-medium"
                        placeholder="e.g., exciting updates for our premium users..."
                        required
                    />
                </div>

                {/* Message Body */}
                <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">Email Content</label>
                    <textarea
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-400 font-medium min-h-[200px] resize-y"
                        placeholder="Write your personalized message here..."
                        required
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* File Upload */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">Recipients List</label>
                        <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 group cursor-pointer relative ${csvFile ? 'border-green-300 bg-green-50/30' : 'border-gray-200 hover:border-blue-400 hover:bg-blue-50/30'}`}>
                            <input
                                type="file"
                                accept=".csv"
                                onChange={handleFileUpload}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                required={!csvFile}
                            />
                            <div className="flex flex-col items-center gap-3">
                                <div className={`p-3 rounded-full ${csvFile ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500 group-hover:scale-110 transition-transform'}`}>
                                    {csvFile ? <CheckCircle className="w-6 h-6" /> : <Upload className="w-6 h-6" />}
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-900">
                                        {csvFile ? csvFile.name : 'Drop CSV file here'}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {csvFile ? `${(csvFile.size / 1024).toFixed(1)} KB` : 'or click to browse'}
                                    </p>
                                </div>
                                {recipientCount > 0 && (
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 mt-2">
                                        {recipientCount} emails found
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Schedule Time */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">Schedule Delivery</label>
                        <div className="relative group">
                            <input
                                type="datetime-local"
                                value={scheduledTime}
                                onChange={(e) => setScheduledTime(e.target.value)}
                                className="w-full px-6 py-4 pl-12 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-gray-900 font-medium"
                                required
                            />
                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                        </div>
                        <p className="text-xs text-gray-500 mt-3 flex items-center gap-1.5 ml-1">
                            <Clock className="w-3.5 h-3.5" />
                            Smart scheduling optimizes delivery rates
                        </p>
                    </div>
                </div>

                {status && (
                    <div className={`p-4 rounded-xl flex items-center gap-3 ${status.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
                        } animate-in fade-in slide-in-from-top-2`}>
                        {status.type === 'success' ? <CheckCircle className="w-5 h-5 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 flex-shrink-0" />}
                        <p className="font-medium text-sm">{status.message}</p>
                    </div>
                )}

                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                <span>Scheduling Campaign...</span>
                            </>
                        ) : (
                            <>
                                <span>Schedule Campaign</span>
                                <div className="w-px h-4 bg-white/20 mx-1" />
                                <span className="opacity-80 font-normal">Ready to send</span>
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
