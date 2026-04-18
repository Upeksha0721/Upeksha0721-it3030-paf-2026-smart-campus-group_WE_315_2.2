import React, { useState } from 'react';
import incidentService from '../services/incidentService';

const CommentSection = ({ ticketId, initialComments, currentUserEmail }) => {
    const [comments, setComments] = useState(initialComments || []);
    const [newComment, setNewComment] = useState('');
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editContent, setEditContent] = useState('');

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            const addedComment = await incidentService.addComment(ticketId, newComment);
            setComments([...comments, addedComment]);
            setNewComment('');
        } catch (error) {
            console.error('Error adding comment:', error);
            alert('Failed to add comment');
        }
    };

    const handleDeleteComment = async (id) => {
        if (!window.confirm('Are you sure you want to delete this comment?')) return;

        try {
            await incidentService.deleteComment(id);
            setComments(comments.filter(c => c.id !== id));
        } catch (error) {
            console.error('Error deleting comment:', error);
            alert('Failed to delete comment');
        }
    };

    const handleEditStart = (comment) => {
        setEditingCommentId(comment.id);
        setEditContent(comment.content);
    };

    const handleUpdateComment = async (id) => {
        try {
            const updated = await incidentService.updateComment(id, editContent);
            setComments(comments.map(c => c.id === id ? updated : c));
            setEditingCommentId(null);
        } catch (error) {
            console.error('Error updating comment:', error);
            alert('Failed to update comment');
        }
    };

    return (
        <div style={{ backgroundColor: '#122A42', borderRadius: '24px', border: '1px solid #1A3A5A', padding: '32px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: 'white', margin: '0 0 24px 0', borderBottom: '1px solid #1A3A5A', paddingBottom: '16px' }}>Comments ({comments.length})</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '32px' }}>
                {comments.map((comment) => (
                    <div key={comment.id} style={{ borderBottom: '1px solid #1A3A5A', paddingBottom: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                            <div>
                                <span style={{ fontWeight: '600', color: '#bfdbfe', fontSize: '15px' }}>{comment.userId}</span>
                                <span style={{ fontSize: '12px', color: '#64748b', marginLeft: '12px' }}>
                                    {new Date(comment.createdAt).toLocaleString()}
                                </span>
                            </div>
                            {comment.userId === currentUserEmail && (
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button 
                                        onClick={() => handleEditStart(comment)}
                                        style={{ background: 'none', border: 'none', fontSize: '13px', color: '#60a5fa', fontWeight: '500', cursor: 'pointer', padding: '4px 8px' }}
                                        onMouseEnter={(e) => e.currentTarget.style.color = '#93c5fd'}
                                        onMouseLeave={(e) => e.currentTarget.style.color = '#60a5fa'}
                                    >
                                        Edit
                                    </button>
                                    <button 
                                        onClick={() => handleDeleteComment(comment.id)}
                                        style={{ background: 'none', border: 'none', fontSize: '13px', color: '#f87171', fontWeight: '500', cursor: 'pointer', padding: '4px 8px' }}
                                        onMouseEnter={(e) => e.currentTarget.style.color = '#fca5a5'}
                                        onMouseLeave={(e) => e.currentTarget.style.color = '#f87171'}
                                    >
                                        Delete
                                    </button>
                                </div>
                            )}
                        </div>
                        
                        {editingCommentId === comment.id ? (
                            <div style={{ marginTop: '12px' }}>
                                <textarea
                                    value={editContent}
                                    onChange={(e) => setEditContent(e.target.value)}
                                    style={{ width: '100%', padding: '12px', backgroundColor: '#0D2137', border: '1px solid #3b82f6', color: 'white', borderRadius: '8px', outline: 'none', resize: 'vertical' }}
                                    rows="2"
                                />
                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '12px' }}>
                                    <button 
                                        onClick={() => setEditingCommentId(null)}
                                        style={{ padding: '6px 16px', fontSize: '14px', backgroundColor: '#1e2d4a', color: '#cbd5e1', borderRadius: '8px', border: 'none', cursor: 'pointer' }}
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        onClick={() => handleUpdateComment(comment.id)}
                                        style={{ padding: '6px 16px', fontSize: '14px', backgroundColor: '#3b82f6', color: 'white', borderRadius: '8px', border: 'none', cursor: 'pointer' }}
                                    >
                                        Save
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <p style={{ margin: '4px 0 0 0', color: '#cbd5e1', whiteSpace: 'pre-wrap', lineHeight: '1.5' }}>{comment.content}</p>
                        )}
                    </div>
                ))}
            </div>

            <form onSubmit={handleAddComment}>
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    style={{ width: '100%', padding: '16px', backgroundColor: '#0D2137', border: '1px solid #1A3A5A', color: 'white', borderRadius: '12px', outline: 'none', resize: 'vertical' }}
                    rows="3"
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                        type="submit"
                        style={{ marginTop: '16px', padding: '10px 24px', backgroundColor: '#3b82f6', color: 'white', fontWeight: '600', borderRadius: '8px', border: 'none', cursor: 'pointer', boxShadow: '0 4px 6px rgba(59, 130, 246, 0.2)' }}
                    >
                        Post Comment
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CommentSection;
