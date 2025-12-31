import axios from "./axios";

export const filterPackage = (body) => {
    return axios.post(`/package/filter`, body)
}

export const getPackageList = () => {
    return axios.post(`/package`)
}

export const changePackageStatus = (body) => {
    return axios.put(`/package/change-status`, body)
}

export const checkDuplicateName = (body) => {
    return axios.post(`/package/check-duplicate/name`, body)
}

export const createPackage = (body) => {
    return axios.post(`/package-create`, body)
}

export const getPackageDetail = (body) => {
    return axios.post(`/package-detail`, body)
}

export const checkAppliedPackage = (body) => {
    return axios.post(`/package/check-applied-package`, body)
}

export const updatePackage = (body) => {
    return axios.put(`/package-update`, body)
}

export const deletePackage = (id) => {
    return axios.delete(`/package-delete/${id}`)
}