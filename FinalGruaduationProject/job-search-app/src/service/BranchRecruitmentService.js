import axios from "./axios";

export const getBranchRecruitmentDetail = (id) => {
    return axios.get(`/branch-recruitment/detail/${id}`)
}

export const createBranchRecruitment = (body) => {
    return axios.post(`/branch-recruitment-create`, body)
}

export const updateBranchRecruitment = (body) => {
    return axios.put(`/branch-recruitment-update`, body)
}