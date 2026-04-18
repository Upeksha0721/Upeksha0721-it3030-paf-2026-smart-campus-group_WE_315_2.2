import React, { useState } from 'react';
import incidentService from '../services/incidentService';

const CommentSection = ({ ticketId, initialComments, currentUserEmail }) => {
    const [comments, setComments] = useState(initialComments || []);
    const [newComment, setNewComment] = useState('');
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editContent, setEditContent] = useState('');

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [commentToDelete, setCommentToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const [toast, setToast] = useState({
        show: false,
        message: '',
        type: 'success'
    });

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => {
            setToast({ show: false, message: '', type: 'success' });
        }, 2500);
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            const addedComment = await incidentService.addComment(ticketId, newComment);
            setComments([...comments, addedComment]);
            setNewComment('');
            showToast('Comment added successfully.');
        } catch (error) {
            console.error('Error adding comment:', error);
            showToast('Failed to add comment.', 'error');
        }
    };

    const openDeleteModal = (id) => {
        setCommentToDelete(id);
        setShowDeleteModal(true);
    };

    const closeDeleteModal = () => {
        if (deleting) return;
        setShowDeleteModal(false);
        setCommentToDelete(null);
    };

    const confirmDeleteComment = async () => {
        if (!commentToDelete) return;

        try {
            setDeleting(true);
            await incidentService.deleteComment(commentToDelete);
            setComments(comments.filter((c) => c.id !== commentToDelete));
            closeDeleteModal();
            showToast('Comment deleted successfully.');
        } catch (error) {
            console.error('Error deleting comment:', error);
            showToast('Failed to delete comment.', 'error');
        } finally {
            setDeleting(false);
        }
    };

    const handleEditStart = (comment) => {
        setEditingCommentId(comment.id);
        setEditContent(comment.content);
    };

    const handleUpdateComment = async (id) => {
        if (!editContent.trim()) {
            showToast('Comment cannot be empty.', 'error');
            return;
        }

        try {
            const updated = await incidentService.updateComment(id, editContent);
            setComments(comments.map((c) => (c.id === id ? updated : c)));
            setEditingCommentId(null);
            setEditContent('');
            showToast('Comment updated successfully.');
        } catch (error) {
            console.error('Error updating comment:', error);
            showToast('Failed to update comment.', 'error');
        }
    };

    return (
        <>
            <div
                style={{
                    backgroundColor: '#122A42',
                    borderRadius: '24px',
                    border: '1px solid #1A3A5A',
                    padding: '32px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                    position: 'relative'
                }}
            >
                <h3
                    style={{
                        fontSize: '20px',
                        fontWeight: 'bold',
                        color: 'white',
                        margin: '0 0 24px 0',
                        borderBottom: '1px solid #1A3A5A',
                        paddingBottom: '16px'
                    }}
                >
                    Comments ({comments.length})
                </h3>

                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '24px',
                        marginBottom: '32px'
                    }}
                >
                    {comments.map((comment) => (
                        <div
                            key={comment.id}
                            style={{
                                borderBottom: '1px solid #1A3A5A',
                                paddingBottom: '24px'
                            }}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'flex-start',
                                    marginBottom: '8px'
                                }}
                            >
                                <div>
                                    <span
                                        style={{
                                            fontWeight: '600',
                                            color: '#bfdbfe',
                                            fontSize: '15px'
                                        }}
                                    >
                                        {comment.userId}
                                    </span>
                                    <span
                                        style={{
                                            fontSize: '12px',
                                            color: '#64748b',
                                            marginLeft: '12px'
                                        }}
                                    >
                                        {new Date(comment.createdAt).toLocaleString()}
                                    </span>
                                </div>

                                {comment.userId === currentUserEmail && (
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button
                                            onClick={() => handleEditStart(comment)}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                fontSize: '13px',
                                                color: '#60a5fa',
                                                fontWeight: '500',
                                                cursor: 'pointer',
                                                padding: '4px 8px'
                                            }}
                                            onMouseEnter={(e) => (e.currentTarget.style.color = '#93c5fd')}
                                            onMouseLeave={(e) => (e.currentTarget.style.color = '#60a5fa')}
                                        >
                                            Edit
                                        </button>

                                        <button
                                            onClick={() => openDeleteModal(comment.id)}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                fontSize: '13px',
                                                color: '#f87171',
                                                fontWeight: '500',
                                                cursor: 'pointer',
                                                padding: '4px 8px'
                                            }}
                                            onMouseEnter={(e) => (e.currentTarget.style.color = '#fca5a5')}
                                            onMouseLeave={(e) => (e.currentTarget.style.color = '#f87171')}
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
                                        style={{
                                            width: '100%',
                                            padding: '12px',
                                            backgroundColor: '#0D2137',
                                            border: '1px solid #3b82f6',
                                            color: 'white',
                                            borderRadius: '8px',
                                            outline: 'none',
                                            resize: 'vertical'
                                        }}
                                        rows="2"
                                    />
                                    <div
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'flex-end',
                                            gap: '8px',
                                            marginTop: '12px'
                                        }}
                                    >
                                        <button
                                            onClick={() => {
                                                setEditingCommentId(null);
                                                setEditContent('');
                                            }}
                                            style={{
                                                padding: '6px 16px',
                                                fontSize: '14px',
                                                backgroundColor: '#1e2d4a',
                                                color: '#cbd5e1',
                                                borderRadius: '8px',
                                                border: 'none',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            Cancel
                                        </button>

                                        <button
                                            onClick={() => handleUpdateComment(comment.id)}
                                            style={{
                                                padding: '6px 16px',
                                                fontSize: '14px',
                                                backgroundColor: '#3b82f6',
                                                color: 'white',
                                                borderRadius: '8px',
                                                border: 'none',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            Save
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <p
                                    style={{
                                        margin: '4px 0 0 0',
                                        color: '#cbd5e1',
                                        whiteSpace: 'pre-wrap',
                                        lineHeight: '1.5'
                                    }}
                                >
                                    {comment.content}
                                </p>
                            )}
                        </div>
                    ))}
                </div>

                <form onSubmit={handleAddComment}>
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment..."
                        style={{
                            width: '100%',
                            padding: '16px',
                            backgroundColor: '#0D2137',
                            border: '1px solid #1A3A5A',
                            color: 'white',
                            borderRadius: '12px',
                            outline: 'none',
                            resize: 'vertical'
                        }}
                        rows="3"
                    />
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <button
                            type="submit"
                            style={{
                                marginTop: '16px',
                                padding: '10px 24px',
                                backgroundColor: '#3b82f6',
                                color: 'white',
                                fontWeight: '600',
                                borderRadius: '8px',
                                border: 'none',
                                cursor: 'pointer',
                                boxShadow: '0 4px 6px rgba(59, 130, 246, 0.2)'
                            }}
                        >
                            Post Comment
                        </button>
                    </div>
                </form>
            </div>

            {showDeleteModal && (
                <div
                    style={{
                        position: 'fixed',
                        inset: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.65)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 9999,
                        padding: '20px'
                    }}
                >
                    <div
                        style={{
                            width: '100%',
                            maxWidth: '420px',
                            backgroundColor: '#122A42',
                            border: '1px solid #1A3A5A',
                            borderRadius: '20px',
                            padding: '28px',
                            boxShadow: '0 20px 40px rgba(0,0,0,0.35)'
                        }}
                    >
                        <h3
                            style={{
                                margin: '0 0 12px 0',
                                color: 'white',
                                fontSize: '22px',
                                fontWeight: '700'
                            }}
                        >
                            Delete Comment
                        </h3>

                        <p
                            style={{
                                margin: '0 0 24px 0',
                                color: '#cbd5e1',
                                lineHeight: '1.6'
                            }}
                        >
                            Are you sure you want to delete this comment?
                        </p>

                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                                gap: '12px'
                            }}
                        >
                            <button
                                onClick={closeDeleteModal}
                                disabled={deleting}
                                style={{
                                    padding: '10px 18px',
                                    backgroundColor: '#1e2d4a',
                                    color: '#cbd5e1',
                                    border: 'none',
                                    borderRadius: '10px',
                                    cursor: 'pointer',
                                    fontWeight: '600'
                                }}
                            >
                                Cancel
                            </button>

                            <button
                                onClick={confirmDeleteComment}
                                disabled={deleting}
                                style={{
                                    padding: '10px 18px',
                                    backgroundColor: '#dc2626',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '10px',
                                    cursor: 'pointer',
                                    fontWeight: '600'
                                }}
                            >
                                {deleting ? 'Deleting...' : 'OK'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {toast.show && (
                <div
                    style={{
                        position: 'fixed',
                        top: '24px',
                        right: '24px',
                        zIndex: 10000,
                        minWidth: '260px',
                        maxWidth: '360px',
                        padding: '14px 18px',
                        borderRadius: '12px',
                        color: 'white',
                        fontWeight: '600',
                        boxShadow: '0 12px 30px rgba(0,0,0,0.25)',
                        backgroundColor: toast.type === 'error' ? '#b91c1c' : '#065f46',
                        border: toast.type === 'error' ? '1px solid #ef4444' : '1px solid #10b981'
                    }}
                >
                    {toast.message}
                </div>
            )}
        </>
    );
};

export default CommentSection;