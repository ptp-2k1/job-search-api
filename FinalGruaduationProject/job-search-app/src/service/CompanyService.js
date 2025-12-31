import axios from "./axios";

export const getCompanyList = (body) => {
    return axios.post(`/company`, body)
}

export const getAdminCompanyDetail = (id) => {
    return axios.get(`/company-admin-detail/${id}`)
}

export const getRecruiterCompanyDetail = (body) => {
    return axios.post(`/company-recruiter-detail`, body)
}

export const getCompanyDetailFile = (body) => {
    return axios.post(`/company-detail/file`, body)
}

export const filterCompanyList = (body) => {
    return axios.post(`/company/filter`, body)
}

export const changeCompanyStatus = (body) => {
    return axios.put(`/company/change-status`, body)
}

export const createCompany = (body) => {
    return axios.post(`/company-create`, body)
}

export const updateCompany = (body) => {
    return axios.put(`/company-update`, body)
}

export const checkCompanyStatus = (body) => {
    return axios.post(`/company/check-status`, body)
}

export const createCompanyImage = (body) => {
    return axios.post(`/company/create-image`, body)
}

export const updateCompanyImage = (body) => {
    return axios.put(`/company/update-image`, body)
}

export const getCompanyImage = (body) => {
    return axios.post(`/company/get-image`, body)
}