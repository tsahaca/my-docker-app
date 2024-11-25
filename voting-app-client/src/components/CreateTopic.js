import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const CreateTopic = () => {
    const [topic, setTopic] = useState('');
    const [description, setDescription] = useState('');
    const [message, setMessage] = useState('');
    const [votingUrl, setVotingUrl] = useState('');
    const navigate = useNavigate();
    const BACKEND_API_URL = process.env.REACT_APP_BACKEND_API_URL;

    const createTopic = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`http://${BACKEND_API_URL}:5000/api/topics`, { topic, description });
            setVotingUrl(response.data.votingUrl);
            setMessage('Topic created! Copy the voting link below.');
        } catch (error) {
            setMessage('Error creating topic');
        }
    };

    const copyToClipboard = () => {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(votingUrl)
                .then(() => alert('Link copied to clipboard!'))
                .catch(() => alert('Failed to copy link.'));
        } else {
            const textArea = document.createElement('textarea');
            textArea.value = votingUrl;
            textArea.style.position = 'fixed';
            textArea.style.opacity = '0';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            try {
                document.execCommand('copy');
                alert('Link copied to clipboard!');
            } catch {
                alert('Failed to copy link.');
            }
            document.body.removeChild(textArea);
        }
    };

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Create Voting Topic</h1>
            <form onSubmit={createTopic} className="bg-white p-6 rounded-lg shadow-md">
                <input
                    type="text"
                    className="border border-gray-300 rounded-lg p-2 mb-4 w-full"
                    placeholder="Topic"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    required
                />
                <textarea
                    className="border border-gray-300 rounded-lg p-2 mb-4 w-full"
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />
                <button type="submit" className="bg-blue-500 text-white rounded-lg p-2">Create Topic</button>
            </form>
            {message && (
                <motion.div className="mt-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                    <p className="text-green-600">{message}</p>
                    {votingUrl && (
                        <div className="mt-2">
                            <p className="text-gray-700">Voting Link: {votingUrl}</p>
                            <button
                                className="mt-2 bg-green-500 text-white rounded-lg p-2"
                                onClick={copyToClipboard}
                            >
                                Copy Link
                            </button>
                        </div>
                    )}
                </motion.div>
            )}
        </div>
    );
};

export default CreateTopic;
