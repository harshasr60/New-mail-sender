import { useAuth } from "../context/AuthContext";
import { LogIn } from "lucide-react";
import { Navigate } from "react-router-dom";

export default function Login() {
    const { user, login, demoLogin } = useAuth();

    if (user) {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="flex items-center justify-center h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 relative overflow-hidden">
            {/* Abstract Background Shapes */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full mix-blend-overlay filter blur-3xl -translate-x-1/2 -translate-y-1/2 animate-blob"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full mix-blend-overlay filter blur-3xl translate-x-1/2 translate-y-1/2 animate-blob animation-delay-2000"></div>

            <div className="bg-white/90 backdrop-blur-xl p-8 rounded-2xl shadow-2xl w-full max-w-md text-center border border-white/20 relative z-10 transition-all duration-300 hover:shadow-3xl transform hover:-translate-y-1">
                <div className="flex justify-center mb-8">
                    <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 p-4 rounded-2xl shadow-lg transform rotate-3 hover:rotate-6 transition-transform duration-300">
                        <LogIn className="w-8 h-8 text-white" />
                    </div>
                </div>
                <h1 className="text-3xl font-extrabold mb-3 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Welcome Back</h1>
                <p className="text-gray-500 mb-8 font-medium">Sign in to orchestrate your email campaigns</p>

                <button
                    onClick={() => login()}
                    className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3.5 px-4 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg transform active:scale-[0.98] font-semibold group"
                >
                    <span>Sign in with Google</span>
                    <span className="bg-white/20 px-2 py-0.5 rounded text-xs font-normal group-hover:bg-white/30 transition-colors">Firebase</span>
                </button>

                <div className="my-6 flex items-center gap-4">
                    <div className="h-px bg-gray-200 flex-1"></div>
                    <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">or</span>
                    <div className="h-px bg-gray-200 flex-1"></div>
                </div>

                <button
                    onClick={() => demoLogin()}
                    className="w-full flex items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 py-3.5 px-4 rounded-xl transition-all duration-200 hover:border-gray-300 transform active:scale-[0.98]"
                >
                    <span className="font-semibold">Demo Login</span>
                    <span className="text-xs text-gray-400">(Skip Auth)</span>
                </button>
            </div>

            <style>{`
                @keyframes blob {
                    0% { transform: translate(0px, 0px) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                    100% { transform: translate(0px, 0px) scale(1); }
                }
                .animate-blob {
                    animation: blob 7s infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
            `}</style>
        </div>
    );
}
