import axios from "./axios";

export const getTitleList = () => {
    return axios.get(`/title`)
}

export const filterTitle = (body) => {
    return axios.post(`/title/filter`, body)
}

export const checkDuplicateName = (body) => {
    return axios.post(`/title/check-duplicate/name`, body)
}

export const createTitle = (body) => {
    return axios.post(`/title-create`, body)
}

export const getTitleDetail = (body) => {
    return axios.post(`/title-detail`, body)
}

export const updateTitle = (body) => {
    return axios.put(`/title-update`, body)
}

export const checkTitleDelete = (body) => {
    return axios.post(`/title/check-delete`, body)
}

export const deleteTitle = (id) => {
    return axios.delete(`/title-delete/${id}`)
}
