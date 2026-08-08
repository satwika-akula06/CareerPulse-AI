import { useContext } from "react";
import { AuthContext } from "../auth.context";
import { login, register, logout } from "../services/auth.api";

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }

    const { user, setUser, loading } = context;

    const handleLogin = async ({ email, password }) => {
        const data = await login({ email, password });
        if (data?.user) {
            setUser(data.user);
            return data.user;
        }
    };

    const handleRegister = async ({ username, email, password }) => {
        const data = await register({ username, email, password });
        if (data?.user) {
            setUser(data.user);
            return data.user;
        }
    };

    const handleLogout = async () => {
        await logout();
        setUser(null);
    };

    return { user, loading, handleRegister, handleLogin, handleLogout };
};