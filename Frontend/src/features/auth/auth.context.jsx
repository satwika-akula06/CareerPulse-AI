/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useEffect } from 'react';
import { getMe } from './services/auth.api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const data = await getMe();
                if (data?.user) {
                    setUser(data.user);
                }
            } catch (err) {
                console.log(err);
                // Silence 401 errors for logged-out guests
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []); // Runs ONLY once on app mount

    return (
        <AuthContext.Provider value={{ user, setUser, loading, setLoading }}>
            {children}
        </AuthContext.Provider>
    );
};
    
