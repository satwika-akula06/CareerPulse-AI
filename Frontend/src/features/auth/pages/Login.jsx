import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import "../auth.form.scss"
import { useAuth } from '../hooks/useAuth'

const Login = () => {
    const { loading, handleLogin } = useAuth()
    const navigate = useNavigate()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")

        if (!email.trim() && !password.trim()) {
            setError("Please enter your email and password.")
            return
        }
        if (!email.trim()) {
            setError("Please enter your email address.")
            return
        }
        if (!password.trim()) {
            setError("Please enter your password.")
            return
        }

        setIsSubmitting(true)

        try {
            const loggedInUser = await handleLogin({ email, password })
            if (loggedInUser) {
                navigate('/')
            }
        } catch (err) {
            // Extract exact message from backend ("Incorrect password...", "User not found...", etc.)
            const backendMessage = err.response?.data?.message || "Login failed. Please check your network connection."
            setError(backendMessage)
        } finally {
            setIsSubmitting(false)
        }
    }

    // Initial session check loading only
    if (loading) {
        return (<main><h1>Loading...</h1></main>)
    }

    return (
        <main>
            <div className="form-container">
                <h1>Login</h1>

                {/* Error Banner */}
                {error && (
                    <div className="error-banner" style={{ 
                        backgroundColor: '#rgba(255, 77, 77, 0.1)', 
                        border: '1px solid #ff4d4d', 
                        color: '#ff4d4d', 
                        padding: '0.75rem', 
                        borderRadius: '6px', 
                        marginBottom: '1rem', 
                        fontSize: '0.9rem',
                        textAlign: 'center'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            type="email" 
                            id="email" 
                            name='email' 
                            placeholder='Enter email address' 
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            type="password" 
                            id="password" 
                            name='password' 
                            placeholder='Enter password' 
                        />
                    </div>
                    <button type="submit" disabled={isSubmitting} className='button primary-button'>
                        {isSubmitting ? "Logging in..." : "Login"}
                    </button>
                </form>
                <p>Don't have an account? <Link to={"/register"}>Register</Link></p>
            </div>
        </main>
    )
}

export default Login