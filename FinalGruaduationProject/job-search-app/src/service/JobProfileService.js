import axios from "./axios";

export const getJobProfile = (body) => {
    return axios.post(`/job-profile`, body)
}

export const createJobProfile = (body) => {
    return axios.post(`/job-profile-create`, body)
}

export const updateJobProfile = (body) => {
    return axios.put(`/job-profile-update`, body)
}

export const searchProfile = (body) => {
    return axios.post(`/job-profile/search-profile`, body)
}

export const viewProfile = (body) => {
    return axios.post(`/job-profile/view-profile`, body)
}

export const offSharedProfile = (body) => {
    return axios.put(`/job-profile/off-shared`, body)
}