import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import { useAuth } from '../hooks/useAuth'

const Register = () => {
    const navigate = useNavigate()
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")

    const { loading, handleRegister } = useAuth()
    
    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")

        // Frontend validation
        if (!username.trim() || !email.trim() || !password.trim()) {
            setError("All fields are required.")
            return
        }

        try {
            await handleRegister({ username, email, password })
            navigate("/")
        } catch (err) {
            const message = err.response?.data?.message || err.message || "Registration failed. Please try again."
            setError(message)
        }
    }

    if (loading) {
        return (<main><h1>Loading...</h1></main>)
    }

    return (
        <main>
            <div className="form-container">
                <h1>Register</h1>

                {error && (
                    <div className="error-banner" style={{ color: '#ff4d4d', marginBottom: '1rem', fontSize: '0.9rem' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="username">Username</label>
                        <input
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            type="text" 
                            id="username" 
                            name='username' 
                            placeholder='Enter username' 
                        />
                    </div>
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

                    <button type="submit" className='button primary-button'>Register</button>
                </form>

                <p>Already have an account? <Link to={"/login"}>Login</Link></p>
            </div>
        </main>
    )
}

export default Register