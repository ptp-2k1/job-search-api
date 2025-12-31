import axios from "./axios";

export const getTopHotPost = () => {
    return axios.get(`/post/top-hot`)
}

export const getLatestPost = () => {
    return axios.get(`/post/latest`)
}

export const getCompanyPost = (id) => {
    return axios.get(`/post/company/${id}`)
}

export const getPostList = (body) => {
    return axios.post(`/post`, body)
}

export const getPostDetail = (id) => {
    return axios.get(`/post/detail/${id}`)
}

export const adminFilterPost = (body) => {
    return axios.post(`/post/staff-filter`, body)
}

export const changePostStatus = (body) => {
    return axios.put(`/post/change-status`, body)
}

export const getRecommended = (body) => {
    return axios.post(`/post/recommended`, body)
}

export const recruiterFilterPost = (body) => {
    return axios.post(`/post/recruiter-filter`, body)
}

export const getRecruiterPostDetail = (body) => {
    return axios.post(`/post/recruiter-detail`, body)
}

export const createPost = (body) => {
    return axios.post(`/post-create`, body)
}

export const getLatestId = () => {
    return axios.post(`/post/latest-id`)
}

export const updatePost = (body) => {
    return axios.put(`/post-update`, body)
}
