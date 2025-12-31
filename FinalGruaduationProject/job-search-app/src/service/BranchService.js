import axios from "./axios";

export const getBranchList = () => {
    return axios.get(`/branch`)
}

export const filterBranch = (body) => {
    return axios.post(`/branch/filter`, body)
}

export const checkDuplicateName = (body) => {
    return axios.post(`/branch/check-duplicate/name`, body)
}

export const createBranch = (body) => {
    return axios.post(`/branch-create`, body)
}

export const getBranchDetail = (body) => {
    return axios.post(`/branch-detail`, body)
}

export const updateBranch = (body) => {
    return axios.put(`/branch-update`, body)
}

export const checkBranchDelete = (body) => {
    return axios.post(`/branch/check-delete`, body)
}

export const deleteBranch = (id) => {
    return axios.delete(`/branch-delete/${id}`)
}