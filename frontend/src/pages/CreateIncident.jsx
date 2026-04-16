import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import incidentService from '../services/incidentService';
import MediaUpload from '../utils/supabase';
import toast, { Toaster } from 'react-hot-toast';

const CreateIncident = () => {
    const [formData, setFormData] = useState({
        category: '',
        description: '',
        priority: 'MEDIUM',
        contactDetails: ''
    });
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        if (images.length + selectedFiles.length > 3) {
            toast.error('You can only upload up to 3 images in total');
            e.target.value = null;
            return;
        }
        setImages(prev => [...prev, ...selectedFiles]);
        e.target.value = null;
    };

    const removeImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // 1. Upload images to Supabase
            const uploadPromises = images.map(file => MediaUpload(file));
            const imageUrls = await Promise.all(uploadPromises);

            // 2. Prepare payload with URLs
            const payload = {
                ...formData,
                attachmentUrls: imageUrls
            };

            // 3. Submit to backend
            await incidentService.createTicket(payload);
            toast.success('Incident ticket created successfully!');
            setTimeout(() => navigate('/dashboard'), 1500); // Redirect to dashboard
        } catch (error) {
            console.error('Error creating ticket:', error);
            toast.error('Failed to create ticket: ' + (error.response?.data?.error || error.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '40px 20px', minHeight: '100vh', background: '#0d1b2e', fontFamily: 'Segoe UI, sans-serif' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto', background: '#111f38', border: '1px solid #1e2d4a', borderRadius: '16px', padding: '32px', boxShadow: '0 10px 25px rgba(0,0,0,0.3)' }}>
                <Toaster position="top-right" />
                <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: 'white', borderBottom: '1px solid #1e2d4a', paddingBottom: '16px', margin: '0 0 24px 0' }}>Report an Incident</h2>
                
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#94a3b8', marginBottom: '8px' }}>Category</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            style={{ width: '100%', padding: '12px 16px', backgroundColor: '#0a1628', border: '1px solid #1e2d4a', borderRadius: '10px', color: 'white', outline: 'none', appearance: 'auto', fontSize: '15px' }}
                            required
                        >
                            <option value="">Select Category</option>
                            <option value="PLUMBING">Plumbing</option>
                            <option value="ELECTRICAL">Electrical</option>
                            <option value="INTERNET">Internet/Wi-Fi</option>
                            <option value="HVAC">Heating/Air Conditioning</option>
                            <option value="CLEANING">Cleaning/Janitorial</option>
                            <option value="SECURITY">Security</option>
                            <option value="OTHER">Other</option>
                        </select>
                    </div>
                    
                    <div>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#94a3b8', marginBottom: '8px' }}>Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            style={{ width: '100%', padding: '12px 16px', backgroundColor: '#0a1628', border: '1px solid #1e2d4a', borderRadius: '10px', color: 'white', outline: 'none', fontSize: '15px', minHeight: '120px', resize: 'vertical' }}
                            placeholder="Please provide details about the issue..."
                            required
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#94a3b8', marginBottom: '8px' }}>Priority</label>
                            <select
                                name="priority"
                                value={formData.priority}
                                onChange={handleChange}
                                style={{ width: '100%', padding: '12px 16px', backgroundColor: '#0a1628', border: '1px solid #1e2d4a', borderRadius: '10px', color: 'white', outline: 'none', appearance: 'auto', fontSize: '15px' }}
                            >
                                <option value="LOW">Low</option>
                                <option value="MEDIUM">Medium</option>
                                <option value="HIGH">High</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#94a3b8', marginBottom: '8px' }}>Contact Details</label>
                            <input
                                type="text"
                                name="contactDetails"
                                value={formData.contactDetails}
                                onChange={handleChange}
                                style={{ width: '100%', padding: '12px 16px', backgroundColor: '#0a1628', border: '1px solid #1e2d4a', borderRadius: '10px', color: 'white', outline: 'none', fontSize: '15px' }}
                                placeholder="Phone number or room"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#94a3b8', marginBottom: '8px' }}>Attachments (Max 3 Images)</label>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '128px', border: '2px dashed #1e2d4a', borderRadius: '12px', backgroundColor: '#0a1628', cursor: 'pointer', position: 'relative' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                <span style={{ fontSize: '24px', marginBottom: '8px' }}>📁</span>
                                <p style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#94a3b8', fontWeight: '500' }}>Click to upload or drag and drop</p>
                                <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>PNG, JPG or WEBP (Max 3)</p>
                            </div>
                            <input 
                                type="file" 
                                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                                multiple 
                                accept="image/*" 
                                onChange={handleFileChange} 
                            />
                        </div>
                        
                        {images.length > 0 && (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '16px' }}>
                                {images.map((file, i) => (
                                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', backgroundColor: '#1e3a8a', color: '#bfdbfe', fontSize: '12px', fontWeight: '600', borderRadius: '20px', border: '1px solid #3b82f6' }}>
                                        <span style={{ maxWidth: '150px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{file.name}</span>
                                        <button 
                                            type="button" 
                                            onClick={() => removeImage(i)}
                                            style={{ background: 'none', border: 'none', color: '#93c5fd', cursor: 'pointer', fontSize: '14px', padding: 0 }}
                                            title="Remove image"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div style={{ paddingTop: '16px' }}>
                        <button
                            type="submit"
                            disabled={loading}
                            style={{ 
                                width: '100%', 
                                padding: '16px', 
                                backgroundColor: '#f5c400', 
                                color: '#091A2F', 
                                fontWeight: 'bold', 
                                fontSize: '16px',
                                borderRadius: '12px', 
                                border: 'none',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                opacity: loading ? 0.7 : 1,
                                transition: 'all 0.2s ease',
                                boxShadow: '0 4px 14px rgba(245, 196, 0, 0.2)'
                            }}
                        >
                            {loading ? 'Submitting...' : 'Submit Ticket'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateIncident;
