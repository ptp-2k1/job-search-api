import axios from "./axios";

export const getPageLayoutList = () => {
    return axios.post(`/page-layout`)
}
