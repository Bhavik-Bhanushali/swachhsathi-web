import React, { useState } from 'react';
import { useAuth } from '../../firebase/hooks/useAuth';
import { useWorker } from '../../firebase/hooks/useWorker';
import './CreateWorkerForm.css';

const CreateWorkerForm = () => {
    const { user } = useAuth();
    const { createWorker, isCreatingWorker, createWorkerError } = useWorker();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user types
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!user || !user.uid) {
            setError('You must be logged in to create a worker.');
            return;
        }

        try {
            await createWorker({
                ...formData,
                ngoId: user.uid,
                role: 'worker'
            });

            setSuccess('Worker created successfully!');
            setFormData({
                name: '',
                email: '',
                password: '',
                phone: ''
            });
        } catch (err) {
            console.error(err);
            // Use local error state fallback or the hook error (hook error might not be set immediately in catch block)
            setError(err.message || 'Failed to create worker. Please try again.');
        }
    };

    return (
        <div className="create-worker-container">
            <h2 className="create-worker-title">Add New Worker</h2>
            <form className="create-worker-form" onSubmit={handleSubmit}>

                <div className="form-group">
                    <label className="form-label" htmlFor="name">Full Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        className="form-input"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="e.g. John Doe"
                    />
                </div>

                <div className="form-group">
                    <label className="form-label" htmlFor="email">Email Address</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        className="form-input"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="worker@example.com"
                    />
                </div>

                <div className="form-group">
                    <label className="form-label" htmlFor="phone">Phone Number</label>
                    <input
                        type="tel"
                        id="phone"
                        name="phone"
                        className="form-input"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        placeholder="+91 98765 43210"
                    />
                </div>

                <div className="form-group">
                    <label className="form-label" htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        className="form-input"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        placeholder="Set a password for the worker"
                        minLength={6}
                    />
                </div>


                {error && <div className="error-message">{error}</div>}
                {createWorkerError && <div className="error-message">Error: {createWorkerError.message}</div>}
                {success && <div className="success-message">{success}</div>}

                <button type="submit" className="submit-btn" disabled={isCreatingWorker}>
                    {isCreatingWorker ? 'Creating Worker...' : 'Create Worker Account'}
                </button>
            </form>
        </div>
    );
};

export default CreateWorkerForm;
