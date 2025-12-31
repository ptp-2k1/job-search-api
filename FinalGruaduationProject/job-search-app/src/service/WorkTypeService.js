import axios from "./axios";

export const getWorkTypeList = () => {
    return axios.get(`/work-type`)
}

export const filterWorkType = (body) => {
    return axios.post(`/work-type/filter`, body)
}

export const checkDuplicateName = (body) => {
    return axios.post(`/work-type/check-duplicate/name`, body)
}

export const createWorkType = (body) => {
    return axios.post(`/work-type-create`, body)
}

export const getWorkTypeDetail = (body) => {
    return axios.post(`/work-type-detail`, body)
}

export const updateWorkType = (body) => {
    return axios.put(`/work-type-update`, body)
}

export const checkWorkTypeDelete = (body) => {
    return axios.post(`/work-type/check-delete`, body)
}

export const deleteWorkType = (id) => {
    return axios.delete(`/work-type-delete/${id}`)
}
