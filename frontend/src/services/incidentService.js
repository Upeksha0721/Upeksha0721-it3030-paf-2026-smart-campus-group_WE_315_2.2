import axios from 'axios';

const API_URL = 'http://localhost:8085/api/tickets';

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

const incidentService = {
    createTicket: async (ticketData) => {
        const response = await axios.post(API_URL, ticketData, {
            headers: {
                ...getAuthHeader(),
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    },

    getTickets: async () => {
        const response = await axios.get(API_URL, { headers: getAuthHeader() });
        return response.data;
    },

    getTicketById: async (id) => {
        const response = await axios.get(`${API_URL}/${id}`, { headers: getAuthHeader() });
        return response.data;
    },

    updateStatus: async (id, statusData) => {
        const response = await axios.put(`${API_URL}/${id}/status`, statusData, { headers: getAuthHeader() });
        return response.data;
    },

    assignTechnician: async (id, technicianId) => {
        const response = await axios.put(`${API_URL}/${id}/assign`, { technicianId }, { headers: getAuthHeader() });
        return response.data;
    },

    addComment: async (ticketId, content) => {
        const response = await axios.post(`${API_URL}/${ticketId}/comments`, { content }, { headers: getAuthHeader() });
        return response.data;
    },

    updateComment: async (commentId, content) => {
        const response = await axios.put(`${API_URL}/comments/${commentId}`, { content }, { headers: getAuthHeader() });
        return response.data;
    },

    deleteComment: async (commentId) => {
        await axios.delete(`${API_URL}/comments/${commentId}`, { headers: getAuthHeader() });
    },
};

export default incidentService;
