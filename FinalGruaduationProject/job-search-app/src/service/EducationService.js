import axios from "./axios";

export const getEducationList = () => {
    return axios.get(`/education`)
}

export const filterEducation = (body) => {
    return axios.post(`/education/filter`, body)
}

export const checkDuplicateName = (body) => {
    return axios.post(`/education/check-duplicate/name`, body)
}

export const createEducation = (body) => {
    return axios.post(`/education-create`, body)
}

export const getEducationDetail = (body) => {
    return axios.post(`/education-detail`, body)
}

export const updateEducation = (body) => {
    return axios.put(`/education-update`, body)
}

export const checkEducationDelete = (body) => {
    return axios.post(`/education/check-delete`, body)
}

export const deleteEducation = (id) => {
    return axios.delete(`/education-delete/${id}`)
}