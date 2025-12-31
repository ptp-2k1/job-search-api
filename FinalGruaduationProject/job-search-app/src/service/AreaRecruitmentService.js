import axios from "./axios";

export const getAreaRecruitmentDetail = (id) => {
    return axios.get(`/area-recruitment/detail/${id}`)
}

export const createAreaRecruitment = (body) => {
    return axios.post(`/area-recruitment-create`, body)
}

export const updateAreaRecruitment = (body) => {
    return axios.put(`/area-recruitment-update`, body)
}