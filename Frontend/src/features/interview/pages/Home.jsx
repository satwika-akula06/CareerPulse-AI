import React, { useState, useRef } from 'react'
import "../style/home.scss"
import { useInterview } from '../hooks/useInterview.js'
import { useAuth } from '../../auth/hooks/useAuth.js'
import { useNavigate } from 'react-router'

const Home = () => {
    const { loading, generateReport, reports } = useInterview()
    const { user, handleLogout } = useAuth()
    
    const [jobDescription, setJobDescription] = useState("")
    const [selfDescription, setSelfDescription] = useState("")
    const [selectedFile, setSelectedFile] = useState(null)
    const [error, setError] = useState("")
    const [showProfileMenu, setShowProfileMenu] = useState(false)

    const resumeInputRef = useRef()
    const navigate = useNavigate()

    const handleFileChange = (e) => {
        const file = e.target.files?.[0]
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setError("File size exceeds the 5MB limit.")
                return
            }
            setSelectedFile(file)
            setError("")
        }
    }

    const handleRemoveFile = () => {
        setSelectedFile(null)
        if (resumeInputRef.current) {
            resumeInputRef.current.value = ""
        }
    }

    // UPDATED FUNCTION WITH TRY...CATCH
    const handleGenerateReport = async () => {
    setError("")

    if (!jobDescription.trim()) {
        setError("Please enter a target job description.");
        return;
    }

    // Check minimum character/word length
    if (jobDescription.trim().length < 50) {
        setError("Please enter a complete job description (at least 50 characters).");
        return;
    }

    // Detect system prompts or code snippets
    const invalidKeywords = ["You are an expert", "ATS Resume Writer", "SYSTEM PROMPT:", "const ", "import React"];
    const containsPromptCode = invalidKeywords.some(keyword => 
        jobDescription.toLowerCase().includes(keyword.toLowerCase())
    );

    if (containsPromptCode) {
        setError("The text entered appears to be system instructions or code, not a valid job description.");
        return;
    }

    if (!selectedFile && !selfDescription.trim()) {
        setError("Either a Resume or a Self Description is required.");
        return;
    }

    try {
        const reportData = await generateReport({ 
            jobDescription, 
            selfDescription, 
            resumeFile: selectedFile 
        });

        if (reportData?._id) {
            navigate(`/interview/${reportData._id}`);
        }
    } catch (err) {
        setError(err.message || "Failed to generate report. Please try again.");
    }
}

    if (loading) {
        return (
            <main className='loading-screen'>
                <h1>Loading your interview plan...</h1>
            </main>
        )
    }

    return (
        <div className='home-page'>

            {/* Top Navigation Bar */}
            <nav className='navbar'>
                <div className='navbar__brand'>CareerPulse AI  </div>
                <p className='navbar__tagline'>Career Readiness & Skill Analysis</p>
                <div className='navbar__user'>
                    {user ? (
                        <div className='profile-dropdown'>
                            <button 
                                className='profile-btn' 
                                onClick={() => setShowProfileMenu(!showProfileMenu)}
                            >
                                <span className='profile-avatar'>{user?.name ? user.name[0].toUpperCase() : 'U'}</span>
                                <span className='profile-name'>{user?.name || user?.email}</span>
                            </button>
                            {showProfileMenu && (
                                <div className='profile-menu'>
                                    <div className='menu-header'>
                                        <p className='user-title'>{user?.name}</p>
                                        <p className='user-email'>{user?.email}</p>
                                    </div>
                                    <div className='menu-divider' />
                                    <button className='logout-btn' onClick={handleLogout}>
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <button className='login-btn' onClick={() => navigate('/login')}>
                            Login
                        </button>
                    )}
                </div>
            </nav>

            {/* Page Header */}
            <header className='page-header'>
                <h1>Create Your Custom <span className='highlight'>Interview Plan</span></h1>
                <p>Let our AI analyze the job requirements and your unique profile to build a winning strategy.</p>
            </header>

            {/* Main Card */}
            <div className='interview-card'>
                <div className='interview-card__body'>

                    {/* Left Panel - Job Description */}
                    <div className='panel panel--left'>
                        <div className='panel__header'>
                            <span className='panel__icon'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
                            </span>
                            <h2>Target Job Description</h2>
                            <span className='badge badge--required'>Required</span>
                        </div>
                        <textarea
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                            className={`panel__textarea ${error && !jobDescription.trim() ? 'input-error' : ''}`}
                            placeholder={`Paste the full job description here...\ne.g. 'Senior Frontend Engineer at Google requires proficiency in React, TypeScript, and large-scale system design...'`}
                            maxLength={5000}
                        />
                        <div className='char-counter'>{jobDescription.length} / 5000 chars</div>
                    </div>

                    {/* Vertical Divider */}
                    <div className='panel-divider' />

                    {/* Right Panel - Profile */}
                    <div className='panel panel--right'>
                        <div className='panel__header'>
                            <span className='panel__icon'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                            </span>
                            <h2>Your Profile</h2>
                        </div>

                        {/* Upload Resume Section */}
                        <div className='upload-section'>
                            <label className='section-label'>
                                Upload Resume
                                <span className='badge badge--best'>Best Results</span>
                            </label>

                            {selectedFile ? (
                                <div className='uploaded-file-card'>
                                    <div className='file-details'>
                                        <span className='file-icon'>📄</span>
                                        <div className='file-text'>
                                            <p className='file-name'>{selectedFile.name}</p>
                                            <span className='file-size'>{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</span>
                                        </div>
                                    </div>
                                    <button type="button" className='remove-btn' onClick={handleRemoveFile}>
                                        Remove
                                    </button>
                                </div>
                            ) : (
                                <label className='dropzone' htmlFor='resume'>
                                    <span className='dropzone__icon'>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" /><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" /></svg>
                                    </span>
                                    <p className='dropzone__title'>Click to upload or drag &amp; drop</p>
                                    <p className='dropzone__subtitle'>PDF or DOCX (Max 5MB)</p>
                                    <input 
                                        ref={resumeInputRef} 
                                        onChange={handleFileChange} 
                                        hidden 
                                        type='file' 
                                        id='resume' 
                                        name='resume' 
                                        accept='.pdf,.docx' 
                                    />
                                </label>
                            )}
                        </div>

                        <div className='or-divider'><span>OR</span></div>

                        <div className='self-description'>
                            <label className='section-label' htmlFor='selfDescription'>Quick Self-Description</label>
                            <textarea
                                value={selfDescription}
                                onChange={(e) => setSelfDescription(e.target.value)}
                                id='selfDescription'
                                name='selfDescription'
                                className='panel__textarea panel__textarea--short'
                                placeholder="Briefly describe your experience, key skills, and years of experience if you don't have a resume handy..."
                            />
                        </div>

                        <div className='info-box'>
                            <span className='info-box__icon'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" stroke="#1a1f27" strokeWidth="2" /><line x1="12" y1="16" x2="12.01" y2="16" stroke="#1a1f27" strokeWidth="2" /></svg>
                            </span>
                            <p>Either a <strong>Resume</strong> or a <strong>Self Description</strong> is required to generate a personalized plan.</p>
                        </div>
                    </div>
                </div>

                {/* Footer section updated to show Error Box directly above button */}
                <div className='interview-card__footer'>
                    {error && (
                        <div className='custom-error-box'>
                            <div className='error-content'>
                                <span className='error-icon'>⚠️</span>
                                <p>{error}</p>
                            </div>
                            <button className='close-btn' onClick={() => setError("")}>✕</button>
                        </div>
                    )}

                    <div className='footer-action-row'>
                        <span className='footer-info'>AI-Powered Strategy Generation &bull; Approx 30s</span>
                        <button
                            onClick={handleGenerateReport}
                            className='generate-btn'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" /></svg>
                            Generate My Interview Strategy
                        </button>
                    </div>
                </div>
            </div>

            {/* Recent Reports Section */}
            {reports?.length > 0 && (
                <section className='recent-reports'>
                    <h2>My Recent Interview Plans</h2>
                    <ul className='reports-list'>
                        {reports.map(report => (
                            <li key={report._id} className='report-item' onClick={() => navigate(`/interview/${report._id}`)}>
                                <h3>{report.title || 'Untitled Position'}</h3>
                                <p className='report-meta'>Generated on {new Date(report.createdAt).toLocaleDateString()}</p>
                                <p className={`match-score ${report.matchScore >= 80 ? 'score--high' : report.matchScore >= 60 ? 'score--mid' : 'score--low'}`}>Match Score: {report.matchScore}%</p>
                            </li>
                        ))}
                    </ul>
                </section>
            )}

            <footer className='page-footer'>
                <a href='#'>Privacy Policy</a>
                <a href='#'>Terms of Service</a>
                <a href='#'>Help Center</a>
            </footer>
        </div>
    )
}

export default Home