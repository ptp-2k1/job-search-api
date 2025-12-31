import axios from "./axios";

export const getAuthorizationRoles = (id) => {
    return axios.post(`/authorization/get-roles/${id}`)
}

export const checkAuthorizationRoute = (body) => {
    return axios.post(`/authorization/check-route`, body)
}

export const assignAuthorizationRoles = (body) => {
    return axios.post(`/authorization/assign-roles`, body)
}