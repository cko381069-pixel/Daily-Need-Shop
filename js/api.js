// Dayli Need Shop - API Connection

const API_BASE_URL = "http://localhost:5000";

// Common API request function
async function apiRequest(endpoint, options = {}) {
    try {
        const response = await fetch(API_BASE_URL + endpoint, {
            headers: {
                "Content-Type": "application/json",
                ...(options.headers || {})
            },
            ...options
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "API request failed");
        }

        return data;

    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
}

// GET request
async function apiGet(endpoint) {
    return await apiRequest(endpoint, {
        method: "GET"
    });
}

// POST request
async function apiPost(endpoint, data) {
    return await apiRequest(endpoint, {
        method: "POST",
        body: JSON.stringify(data)
    });
}

// PUT request
async function apiPut(endpoint, data) {
    return await apiRequest(endpoint, {
        method: "PUT",
        body: JSON.stringify(data)
    });
}

// DELETE request
async function apiDelete(endpoint) {
    return await apiRequest(endpoint, {
        method: "DELETE"
    });
}