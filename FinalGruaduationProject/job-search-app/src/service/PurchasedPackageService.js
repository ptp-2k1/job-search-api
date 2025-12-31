import axios from "./axios";

export const filterPurchasePackageAdmin = (body) => {
    return axios.post(`/purchased-package/admin-filter`, body)
}

export const changePurchasePackageStatus = (body) => {
    return axios.put(`/purchased-package/change-status`, body)
}

export const getPurchasePackageDetail = (body) => {
    return axios.post(`/purchased-package/detail`, body)
}

export const filterPurchasePackageRecruiter = (body) => {
    return axios.post(`/purchased-package/recruiter-filter`, body)
}

export const createPurchasePackage = (body) => {
    return axios.post(`/purchased-package-create`, body)
}

export const getProfileSearchAmount = (body) => {
    return axios.post(`/purchased-package/profile-search-amount`, body)
}

export const getAvailable = (body) => {
    return axios.post(`/purchased-package/available`, body)
}

export const getPurchasedPackageImage = (body) => {
    return axios.post(`/purchased-package/image`, body)
}