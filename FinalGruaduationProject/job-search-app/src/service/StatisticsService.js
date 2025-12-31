import axios from "./axios";

export const getCategoryData = () => {
    return axios.post(`/statistics/category-data`)
}

export const getRevenueByYearTotal = (body) => {
    return axios.post(`/statistics/revenue-by-year-total`, body)
}

export const getPostsByYearTotal = (body) => {
    return axios.post(`/statistics/posts-by-year-total`, body)
}

export const getApplicationsByYearTotal = (body) => {
    return axios.post(`/statistics/applications-by-year-total`, body)
}

export const getTopRecruitmentBranch = (body) => {
    return axios.post(`/statistics/top-recruitment-branch`, body)
}

export const getTopRecruitmentCompany = (body) => {
    return axios.post(`/statistics/top-recruitment-company`, body)
}

export const getTopApplicationCompany = (body) => {
    return axios.post(`/statistics/top-application-company`, body)
}

export const getTopPurchaseCompany = (body) => {
    return axios.post(`/statistics/top-purchase-company`, body)
}

export const getTopPurchasedPackage = (body) => {
    return axios.post(`/statistics/top-purchased-package`, body)
}

export const getPaymentByCompany = (body) => {
    return axios.post(`/statistics/payment-by-company`, body)
}

export const getApplicationsByCompany = (body) => {
    return axios.post(`/statistics/applications-by-company`, body)
}

export const getPostsByCompany = (body) => {
    return axios.post(`/statistics/posts-by-company`, body)
}

export const getTopAppliedPostByCompany = (body) => {
    return axios.post(`/statistics/top-applied-post-by-company`, body)
}
