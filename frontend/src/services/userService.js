const BASE_URL = "http://localhost:8081/api/users";

export const getUserByEmail = async (email) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${BASE_URL}/email/${encodeURIComponent(email)}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) {
    throw new Error("Failed to fetch user by email");
  }
  return response.json();
};

export const updateUser = async (id, userData) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(userData)
  });
  if (!response.ok) {
    throw new Error("Failed to update user");
  }
  return response.json();
};
