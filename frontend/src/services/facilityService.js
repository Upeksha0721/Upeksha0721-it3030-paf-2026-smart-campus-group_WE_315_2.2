const BASE_URL = "http://localhost:8083/api/facilities";

export const getAllFacilities = async () => {
  const response = await fetch(BASE_URL);
  if (!response.ok) {
    throw new Error("Failed to fetch facilities");
  }
  return response.json();
};

export const getFacilityById = async (id) => {
  const response = await fetch(`${BASE_URL}/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch facility");
  }
  return response.json();
};

export const createFacility = async (facilityData) => {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(facilityData),
  });

  if (!response.ok) {
    throw new Error("Failed to create facility");
  }

  return response.json();
};

export const updateFacility = async (id, facilityData) => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(facilityData),
  });

  if (!response.ok) {
    throw new Error("Failed to update facility");
  }

  return response.json();
};

export const deleteFacility = async (id) => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete facility");
  }

  return response.text();
};

export const searchFacilities = async (filters) => {
  const params = new URLSearchParams();

  if (filters.type) params.append("type", filters.type);
  if (filters.minCapacity) params.append("minCapacity", filters.minCapacity);
  if (filters.location) params.append("location", filters.location);

  const response = await fetch(`${BASE_URL}/search?${params.toString()}`);

  if (!response.ok) {
    throw new Error("Failed to search facilities");
  }

  return response.json();
};