import React, { useEffect, useState } from 'react'
import { toast, ToastContainer } from "react-toastify";
import { getCategoryData } from "../../../service/StatisticsService";

const CategoryData = () => {
    const [userAmount, setUserAmount] = useState(0);
    const [packageAmount, setPackageAmount] = useState(0);
    const [companyAmount, setCompanyAmount] = useState(0);
    const [postAmount, setPostAmount] = useState(0);

    const getData = async () => {
        const categoryData = await getCategoryData()
        if(categoryData && categoryData.status === 200) {
            setUserAmount(Number(categoryData.data[0].Users))
            setPackageAmount(Number(categoryData.data[0].Packages))
            setCompanyAmount(Number(categoryData.data[0].Companies))
            setPostAmount(Number(categoryData.data[0].Posts))

        } else {
            toast.error("Không thể lấy thông tin các danh mục trong hện thống ngay lúc này ! Hãy thử lại sau", {
                position: toast.POSITION.TOP_RIGHT
            })
        }
    }

    useEffect(() => {
        getData();
    }, [])

    return (
        <>
            <div>
                <div className="col-12 grid-margin">
                    <div className="card">
                        <div className="card-body">
                            <div className="row">
                                <div className="col-lg-3 col-md-6">
                                    <div className="card" style={{ backgroundColor: "#62ffb0" }} >
                                        <div className="card-body">
                                            <div className="stat-widget-five">
                                                <div className="stat-content">
                                                    <div className="text-left dib">
                                                        <div id="users" className="stat-text" style={{ color: "black" }}>{userAmount}</div>
                                                        <div className="stat-heading" style={{ width: "100%", color: "black" }}>
                                                            <i className="fa fa-user"/>
                                                            &nbsp;
                                                            Người dùng
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-3 col-md-6">
                                    <div className="card" style={{ backgroundColor: "#d6334c" }} >
                                        <div className="card-body">
                                            <div className="stat-widget-five">
                                                <div className="stat-content">
                                                    <div className="text-left dib">
                                                        <div id="package" className="stat-text" style={{ color: "black" }}>{packageAmount}</div>
                                                        <div className="stat-heading" style={{ width: "100%", color: "black" }}>
                                                            <i className="fa fa-dollar"/>
                                                            &nbsp;
                                                            Gói dịch vụ
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-3 col-md-6">
                                    <div className="card" style={{ backgroundColor: "#6094c4" }} >
                                        <div className="card-body">
                                            <div className="stat-widget-five">
                                                <div className="stat-icon dib flat-color-12">
                                                    <i className="pe-7s-note2"/>
                                                </div>
                                                <div className="stat-content">
                                                    <div className="text-left dib">
                                                        <div id="company" className="stat-text" style={{ color: "black" }}>{companyAmount}</div>
                                                        <div className="stat-heading" style={{ width: "100%", color: "black" }}>
                                                            <i className="fa fa-building"/>
                                                            &nbsp;
                                                            Công ty
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-3 col-md-6">
                                    <div className="card" style={{ backgroundColor: "#f0b54f" }} >
                                        <div className="card-body" >
                                            <div className="stat-widget-five">
                                                <div className="stat-icon dib flat-color-12">
                                                    <i className="pe-7s-users"/>
                                                </div>
                                                <div className="stat-content">
                                                    <div className="text-left dib">
                                                        <div id="schedule" className="stat-text" style={{ color: "black" }}>{postAmount}</div>
                                                        <div className="stat-heading" style={{ width: "100%", color: "black" }}>
                                                            <i className="fa fa-edit"/>
                                                            &nbsp;
                                                            Bài tuyển dụng
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
            <ToastContainer/>
        </>
    )
}

export default CategoryData
