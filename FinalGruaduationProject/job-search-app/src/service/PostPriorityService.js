import axios from "./axios";

export const getPostPriorityList = () => {
    return axios.post(`/post-priority`)
}