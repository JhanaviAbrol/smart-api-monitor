import api from "../services/api";

// Calls the real backend to create an account.
// Throws an error (with a readable message) if it fails, e.g. duplicate email.
export async function registerUser({ name, email, password }) {
  try {
    const response = await api.post("/auth/register", { name, email, password });
    return response.data; // { token, name, email }
  } catch (err) {
    // err.response.data.message is the error text our backend sent back
    throw new Error(err.response?.data?.message || "Registration failed.");
  }
}

// Calls the real backend to log in. On success, saves the JWT token
// to localStorage so future requests are authenticated.
export async function loginUser({ email, password }) {
  try {
    const response = await api.post("/auth/login", { email, password });
    localStorage.setItem("monitoriq_token", response.data.token);
    localStorage.setItem("monitoriq_name", response.data.name);
    return response.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Login failed.");
  }
}

export function logout() {
  localStorage.removeItem("monitoriq_token");
  localStorage.removeItem("monitoriq_name");
}

export function isLoggedIn() {
  return Boolean(localStorage.getItem("monitoriq_token"));
}
