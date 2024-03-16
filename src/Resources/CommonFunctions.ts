import axios from "axios";

function createCustomAxiosInstance(baseURL: string, headers = {}) {
  return axios.create({
    baseURL,
    headers: {
      ...headers,
      accept: "application/json",
      "content-type": "application/json",
    },
  });
}

export { createCustomAxiosInstance };
