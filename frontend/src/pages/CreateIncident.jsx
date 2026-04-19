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
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    // Validation functions
    const validateDescription = (value) => {
        if (value.length < 20) {
            return 'Description must be at least 20 characters';
        }
        if (value.length > 200) {
            return 'Description must not exceed 200 characters';
        }
        return '';
    };

    const validateContactDetails = (value) => {
        if (!value) return 'Contact details are required';

        // Check if it's a phone number (all digits)
        const isPhoneNumber = /^\d+$/.test(value);
        
        if (isPhoneNumber) {
            // Phone number must be exactly 10 digits
            if (value.length !== 10) {
                return 'Phone number must be exactly 10 digits';
            }
        } else {
            // Room number - can contain letters, digits, and symbols
            // Just check if it's not empty and has some valid characters
            if (!/^[a-zA-Z0-9\-_#.,\s]+$/.test(value)) {
                return 'Room number contains invalid characters';
            }
        }
        return '';
    };

    const handleChange = (e) => {
        let { name, value } = e.target;
        
        // Special handling for contact details - limit phone number to 10 digits
        if (name === 'contactDetails') {
            const isPhoneNumber = /^\d+$/.test(value);
            
            // If it's a phone number and exceeds 10 digits, truncate it
            if (isPhoneNumber && value.length > 10) {
                value = value.slice(0, 10);
            }
        }
        
        setFormData({ ...formData, [name]: value });
        
        // Validate field on change
        if (name === 'description') {
            const error = validateDescription(value);
            setErrors(prev => ({ ...prev, description: error }));
        } else if (name === 'contactDetails') {
            const error = validateContactDetails(value);
            setErrors(prev => ({ ...prev, contactDetails: error }));
        }
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
        
        // Validate all fields before submission
        const descriptionError = validateDescription(formData.description);
        const contactError = validateContactDetails(formData.contactDetails);
        
        if (descriptionError || contactError) {
            setErrors({
                description: descriptionError,
                contactDetails: contactError
            });
            toast.error('Please fix validation errors before submitting');
            return;
        }

        // Validate category
        if (!formData.category) {
            toast.error('Please select a category');
            return;
        }

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
                            style={{ 
                                width: '100%', 
                                padding: '12px 16px', 
                                backgroundColor: '#0a1628', 
                                border: errors.description ? '2px solid #ef4444' : '1px solid #1e2d4a', 
                                borderRadius: '10px', 
                                color: 'white', 
                                outline: 'none', 
                                fontSize: '15px', 
                                minHeight: '120px', 
                                resize: 'vertical' 
                            }}
                            placeholder="Please provide details about the issue..."
                            required
                        />
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                            <span style={{ 
                                fontSize: '12px', 
                                color: errors.description ? '#ef4444' : '#64748b'
                            }}>
                                {errors.description ? errors.description : `${formData.description.length}/200 characters`}
                            </span>
                            <span style={{ 
                                fontSize: '12px', 
                                color: formData.description.length >= 20 ? '#22c55e' : '#64748b'
                            }}>
                                {formData.description.length >= 20 ? '✓ Valid length' : 'Min 20 characters'}
                            </span>
                        </div>
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
                                style={{ 
                                    width: '100%', 
                                    padding: '12px 16px', 
                                    backgroundColor: '#0a1628', 
                                    border: errors.contactDetails ? '2px solid #ef4444' : '1px solid #1e2d4a', 
                                    borderRadius: '10px', 
                                    color: 'white', 
                                    outline: 'none', 
                                    fontSize: '15px' 
                                }}
                                placeholder="Phone number (10 digits) or room number"
                                required
                            />
                            {errors.contactDetails && (
                                <span style={{ fontSize: '12px', color: '#ef4444', marginTop: '4px', display: 'block' }}>
                                    {errors.contactDetails}
                                </span>
                            )}
                            {!errors.contactDetails && formData.contactDetails && (
                                <span style={{ fontSize: '12px', color: '#22c55e', marginTop: '4px', display: 'block' }}>
                                    ✓ Valid contact details
                                </span>
                            )}
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
                            disabled={loading || errors.description || errors.contactDetails || !formData.category}
                            style={{ 
                                width: '100%', 
                                padding: '16px', 
                                backgroundColor: (loading || errors.description || errors.contactDetails || !formData.category) ? '#a89300' : '#f5c400', 
                                color: '#091A2F', 
                                fontWeight: 'bold', 
                                fontSize: '16px',
                                borderRadius: '12px', 
                                border: 'none',
                                cursor: (loading || errors.description || errors.contactDetails || !formData.category) ? 'not-allowed' : 'pointer',
                                opacity: (loading || errors.description || errors.contactDetails || !formData.category) ? 0.7 : 1,
                                transition: 'all 0.2s ease',
                                boxShadow: (loading || errors.description || errors.contactDetails || !formData.category) ? 'none' : '0 4px 14px rgba(245, 196, 0, 0.2)'
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
