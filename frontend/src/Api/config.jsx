// export const baseURL = "http://127.0.0.1:8000";
export const baseURL = "https://cloudarex.onrender.com";

const config = {
  baseURL: baseURL,
  apiBaseURL: `${baseURL}/api/v1`,
  staticBaseURL: `${baseURL}/static/`,
  apiTimeout: 500000,
};

export default config;
