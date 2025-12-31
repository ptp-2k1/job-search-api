import axios from "./axios";

export const verifyToken = (body) => {
    return axios.post(`/user/verify-token`, body)
}

export const login = (body) => {
    return axios.post(`/user/login`, body)
}

export const checkDuplicateAccount = (body) => {
    return axios.post(`/user/check-duplicate/account`, body)
}

export const checkDuplicatePhoneNumber = (body) => {
    return axios.post(`/user/check-duplicate/phone-number`, body)
}

export const checkDuplicateEmail = (body) => {
    return axios.post(`/user/check-duplicate/email`, body)
}

export const create = (body) => {
    return axios.post(`/user/create`, body)
}

export const resetPassword = (email) => {
    return axios.post(`/user/reset-password/${email}`)
}

export const filterStaff = (body) => {
    return axios.post(`/user/filter-staff`, body)
}

export const filterUser = (body) => {
    return axios.post(`/user/filter-user`, body)
}

export const changeUserStatus = (user) => {
    return axios.put(`/user/change-status`, user)
}

export const getUserDetail = (body) => {
    return axios.post(`/user-detail`, body)
}

export const updateUser = (body) => {
    return axios.put(`/user-update`, body)
}

export const checkUserPassword = (body) => {
    return axios.post(`/user/check-password`, body)
}

export const changeUserPassword = (body) => {
    return axios.put(`/user/change-password`, body)
}

export const createUserAvatar = (body) => {
    return axios.post(`/user/create-avatar`, body)
}

export const updateUserAvatar = (body) => {
    return axios.put(`/user/update-avatar`, body)
}

export const getUserAvatar = (body) => {
    return axios.post(`/user/get-avatar`, body)
}