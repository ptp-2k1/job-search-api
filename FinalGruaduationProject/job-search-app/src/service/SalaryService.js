import axios from "./axios";

export const getSalaryList = () => {
    return axios.get(`/salary`)
}

export const filterSalary = (body) => {
    return axios.post(`/salary/filter`, body)
}

export const checkDuplicateName = (body) => {
    return axios.post(`/salary/check-duplicate/name`, body)
}

export const createSalary = (body) => {
    return axios.post(`/salary-create`, body)
}

export const getSalaryDetail = (body) => {
    return axios.post(`/salary-detail`, body)
}

export const updateSalary = (body) => {
    return axios.put(`/salary-update`, body)
}

export const checkSalaryDelete = (body) => {
    return axios.post(`/salary/check-delete`, body)
}

export const deleteSalary = (id) => {
    return axios.delete(`/salary-delete/${id}`)
}