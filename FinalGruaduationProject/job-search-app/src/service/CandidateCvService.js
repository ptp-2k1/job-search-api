import axios from "./axios";

export const getLatest = (body) => {
    return axios.post(`/candidate-cv/latest`, body)
}

export const filterCv = (body) => {
    return axios.post(`/candidate-cv/filter`, body)
}

export const getContent = (body) => {
    return axios.post(`/candidate-cv-content`, body)
}

export const uploadFile = (body) => {
    return axios.post(`/candidate-cv-upload`, body)
}

export const deleteContent = (id) => {
    return axios.delete(`/candidate-cv-delete/${id}`)
}

export const checkDuplicateName = (body) => {
    return axios.post(`/candidate-cv/check-duplicate/name`, body)
}