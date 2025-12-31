import axios from "./axios";

export const createPostPackages = (body) => {
    return axios.post(`/post-packages-create`, body)
}