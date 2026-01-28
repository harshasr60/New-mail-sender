import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, LogOut, Send, Clock, Plus } from 'lucide-react';
import ComposeEmail from '../components/dashboard/ComposeEmail';
import ScheduledEmails from '../components/dashboard/ScheduledEmails';
import SentEmails from '../components/dashboard/SentEmails';

export default function Dashboard() {
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState<'compose' | 'scheduled' | 'sent'>('compose');

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
            {/* Sidebar */}
            <aside className="w-72 bg-white border-r border-gray-100 flex flex-col shadow-2xl z-20">
                <div className="p-8 border-b border-gray-100 bg-gradient-to-br from-indigo-50 to-white">
                    <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg shadow-sm">
                            <LayoutDashboard className="w-6 h-6 text-blue-600" />
                        </div>
                        MailScheduler
                    </h1>
                </div>

                <nav className="p-6 space-y-3 flex-1 overflow-y-auto">
                    <button
                        onClick={() => setActiveTab('compose')}
                        className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 font-medium group relative overflow-hidden ${activeTab === 'compose'
                                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg transform scale-[1.02]'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'
                            }`}
                    >
                        <Plus className={`w-5 h-5 transition-transform ${activeTab === 'compose' ? 'rotate-90' : 'group-hover:rotate-90'}`} />
                        <span className="relative z-10">Compose New</span>
                        {activeTab !== 'compose' && <div className="absolute inset-0 bg-blue-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />}
                    </button>

                    <div className="pt-6 pb-2">
                        <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Campaigns</p>
                    </div>

                    <button
                        onClick={() => setActiveTab('scheduled')}
                        className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 font-medium group ${activeTab === 'scheduled'
                                ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-lg transform scale-[1.02]'
                                : 'text-gray-600 hover:bg-orange-50 hover:text-orange-600'
                            }`}
                    >
                        <Clock className="w-5 h-5" />
                        <span>Scheduled</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('sent')}
                        className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 font-medium group ${activeTab === 'sent'
                                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg transform scale-[1.02]'
                                : 'text-gray-600 hover:bg-emerald-50 hover:text-emerald-600'
                            }`}
                    >
                        <Send className="w-5 h-5" />
                        <span>Sent History</span>
                    </button>
                </nav>

                <div className="p-6 border-t border-gray-100 bg-gray-50/50">
                    <div className="flex items-center gap-4 mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                        <img src={user?.picture} alt={user?.name} className="w-12 h-12 rounded-full border-2 border-indigo-100" />
                        <div className="overflow-hidden">
                            <p className="font-bold text-gray-800 text-sm truncate">{user?.name}</p>
                            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="w-full flex items-center justify-center gap-2 text-red-500 hover:bg-red-50 py-3 rounded-xl transition-colors text-sm font-semibold group border border-transparent hover:border-red-100"
                    >
                        <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto bg-[#F3F4F6] relative">
                {/* Decorative background blobs */}
                <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-100 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 animate-blob"></div>
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-pink-100 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 animate-blob animation-delay-2000"></div>

                <header className="px-10 py-8 sticky top-0 z-10 transition-all duration-200 bg-[#F3F4F6]/80 backdrop-blur-sm">
                    <div className="flex justify-between items-end">
                        <div>
                            <h2 className="text-4xl font-black text-gray-800 tracking-tight">
                                {activeTab === 'compose' ? 'New Campaign' :
                                    activeTab === 'scheduled' ? 'Scheduled Jobs' : 'Sent History'}
                            </h2>
                            <p className="text-gray-500 mt-2 font-medium text-lg">
                                {activeTab === 'compose' ? 'Create and schedule your next big email blast.' :
                                    activeTab === 'scheduled' ? 'View and manage your upcoming email deliveries.' :
                                        'Track the performance of your sent emails.'}
                            </p>
                        </div>
                    </div>
                </header>

                <div className="max-w-[1600px] mx-auto px-10 pb-10 h-[calc(100vh-140px)] relative z-0">
                    <div className="bg-white/70 backdrop-blur-md rounded-[2.5rem] shadow-xl border border-white/50 h-full overflow-hidden flex flex-col transition-all duration-300">
                        {/* Content Area */}
                        <div className="flex-1 overflow-y-auto p-12 custom-scrollbar">
                            {activeTab === 'compose' && <ComposeEmail />}
                            {activeTab === 'scheduled' && <ScheduledEmails />}
                            {activeTab === 'sent' && <SentEmails />}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
