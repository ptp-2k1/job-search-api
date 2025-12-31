import axios from "./axios";

export const getExperienceList = () => {
    return axios.get(`/experience`)
}

export const filterExperience = (body) => {
    return axios.post(`/experience/filter`, body)
}

export const checkDuplicateName = (body) => {
    return axios.post(`/experience/check-duplicate/name`, body)
}

export const createExperience = (body) => {
    return axios.post(`/experience-create`, body)
}

export const getExperienceDetail = (body) => {
    return axios.post(`/experience-detail`, body)
}

export const updateExperience = (body) => {
    return axios.put(`/experience-update`, body)
}

export const checkExperienceDelete = (body) => {
    return axios.post(`/experience/check-delete`, body)
}

export const deleteExperience = (id) => {
    return axios.delete(`/experience-delete/${id}`)
}