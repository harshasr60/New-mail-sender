import React, { createContext, useContext, useState, useEffect } from "react";
import { auth } from "../firebase"; // Import initialized auth
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User as FirebaseUser } from "firebase/auth";

interface User {
    name: string;
    email: string;
    picture: string;
    access_token: string;
}

interface AuthContextType {
    user: User | null;
    login: () => void;
    demoLogin: () => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        // Listen to Firebase Auth state changes
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
            if (firebaseUser) {
                const userData: User = {
                    name: firebaseUser.displayName || "User",
                    email: firebaseUser.email || "",
                    picture: firebaseUser.photoURL || "https://ui-avatars.com/api/?name=User",
                    access_token: await firebaseUser.getIdToken() // Get JWT token
                };
                setUser(userData);
                localStorage.setItem("user", JSON.stringify(userData));
            } else {
                setUser(null);
                localStorage.removeItem("user");
            }
        });

        return () => unsubscribe();
    }, []);

    const login = async () => {
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
            // State update handled by onAuthStateChanged
        } catch (error) {
            console.error("Firebase Login Failed", error);
        }
    };

    const demoLogin = () => {
        const demoUser: User = {
            name: "Demo User",
            email: "demo@example.com",
            picture: "https://ui-avatars.com/api/?name=Demo+User",
            access_token: "demo_token"
        };
        setUser(demoUser);
        localStorage.setItem("user", JSON.stringify(demoUser));
    };

    const logout = async () => {
        try {
            await signOut(auth);
            setUser(null);
            localStorage.removeItem("user");
        } catch (error) {
            console.error("Logout Failed", error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, demoLogin, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
