import axios from "./axios";

export const getAreaList = () => {
    return axios.get(`/area`)
}

export const filterArea = (body) => {
    return axios.post(`/area/filter`, body)
}

export const checkDuplicateName = (body) => {
    return axios.post(`/area/check-duplicate/name`, body)
}

export const createArea = (body) => {
    return axios.post(`/area-create`, body)
}

export const getAreaDetail = (body) => {
    return axios.post(`/area-detail`, body)
}

export const updateArea = (body) => {
    return axios.put(`/area-update`, body)
}

export const checkAreaDelete = (body) => {
    return axios.post(`/area/check-delete`, body)
}

export const deleteArea = (id) => {
    return axios.delete(`/area-delete/${id}`)
}
