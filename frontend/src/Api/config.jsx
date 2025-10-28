export const baseURL = "http://127.0.0.1:8000";
// export const baseURL = "http://192.168.0.103:8000";

const config = {
  baseURL: baseURL,
  apiBaseURL: `${baseURL}/api/v1`,
  staticBaseURL: `${baseURL}/static/`,
  apiTimeout: 500000,
};

export default config;
