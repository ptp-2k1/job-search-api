import axios from "./axios";

export const getCandidate = (body) => {
    return axios.post(`/apply-jobs/candidate`, body)
}

export const search = (info) => {
    return axios.post(`/candidate-cv/${info}`)
}

export const getCandidateDetail = (body) => {
    return axios.post(`/apply-jobs/candidate-detail`, body)
}

export const checkDuplicate = (body) => {
    return axios.post(`/apply-jobs/check-duplicate`, body)
}

export const uploadCv = (body) => {
    return axios.post(`/apply-jobs-create`, body)
}

export const getLatestApplication = (body) => {
    return axios.post(`/apply-jobs/latest-application`, body)
}

export const getPostApplication = (body) => {
    return axios.post(`/apply-jobs/post-application`, body)
}

export const changeApplicationStatus = (body) => {
    return axios.put(`/apply-jobs/change-status`, body)
}