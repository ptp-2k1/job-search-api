import React, { useEffect, useState } from 'react'
import { toast, ToastContainer } from 'react-toastify';
import { getPackageList } from "../../../service/PackageService";
import PurchaseConfirmModal from "./PurchaseConfirmModal";

const PurchasePackage = () => {
    const [packages, setPackages] = useState([])
    const [selectedPackage, setSelectedPackage] = useState([])
    const [isActiveModal, setActiveModal] = useState(false)

    const getData = async () => {
        const packageList = await getPackageList()

        if(packageList && packageList.status === 200) {
            if(packageList.data) {
                setPackages(packageList.data)
            } else {
                setPackages([])
            }
        } else {
            toast.error("Không thể lấy danh sách gói dịch vụ ngay lúc này ! Hãy thử lại sau", {
                position: toast.POSITION.TOP_RIGHT
            })
        }
    }

    const handleOpenModal = async (id) => {
        setSelectedPackage(packages.filter(item => item.Id === id)[0])
        setActiveModal(true)
    }

    const formatCurrency = (price) => {
        return new Intl.NumberFormat('en-DE').format(price)
    }

    useEffect(() => {
        getData()
    }, [])

    return (
        <main>
            <div className="col-12 grid-margin" style={{backgroundColor: "#eaedff"}}>
                <div className="card" style={{backgroundColor: "#eaedff"}}>
                    <div className="card-body">
                        <h4 className="card-title">
                            Chúng tôi cung cấp các gói dịch vụ
                            để phục vụ nhu cầu của nhà tuyển dụng
                        </h4>
                        <div
                            className='mb-2 hover-pointer text-right'
                            style={{color: 'red'}}
                            onClick={() => window.location.href = "./purchase-history"}
                        >
                            Xem lịch sử mua gói&nbsp;&nbsp;
                            <i className="fa-solid fa-arrow-right mr-2"/>
                        </div>
                        <br/>
                        <form className="form-sample">
                            <div className="row">
                                {packages && packages.length > 0 &&
                                packages.map((item, index) => {
                                    return (
                                        <div key={index} className="col-12 col-md-6 col-lg-4">
                                            <div style={{
                                                display: "flex",
                                                flexDirection: "column",
                                                justifyContent: "flex-start",
                                                alignItems: "flex-start",
                                                padding: "20px 15px",
                                                backgroundColor: "#2b2b31",
                                                boxShadow: "0 0 20px 0 rgba(0,0,0,0.3)",
                                                margin: "15px 0",
                                                position: "relative",
                                                borderRadius: "10%"
                                            }}>
                                                <div style={{
                                                    display: "flex",
                                                    flexDirection: "row",
                                                    justifyContent: "space-between",
                                                    alignItems: "center",
                                                    width: "100%",
                                                    borderTop: "1px solid rgba(255,255,255,0.05)",
                                                    position: "relative",
                                                    fontFamily: "'Open Sans', sans-serif",
                                                    fontSize: "24px",
                                                    fontWeight: "400",
                                                    marginBottom: "5px",
                                                    marginTop: "0",
                                                    paddingTop: "0",
                                                    border: "none",
                                                    color: "#fff",
                                                    paddingLeft: "15px"
                                                }}>
                                                    <span>{item.Name}</span>
                                                    <span
                                                        style={{
                                                            fontSize: "18px",
                                                            background: "linear-gradient(90deg, #ff55a5 0%, #ff5860 100%)",
                                                            webkitBackgroundClip: "text",
                                                            WebkitTextFillColor: "transparent"
                                                        }}
                                                    >
                                                        {formatCurrency(item.PurchasePostBudget)} VNĐ
                                                    </span>
                                                </div>
                                                <div style={{
                                                    display: "flex",
                                                    flexDirection: "row",
                                                    justifyContent: "space-between",
                                                    alignItems: "center",
                                                    width: "100%",
                                                    fontSize: "15px",
                                                    color: "rgba(255,255,255,0.7)",
                                                    marginTop: "10px",
                                                    paddingTop: "10px",
                                                    borderTop: "1px solid rgba(255,255,255,0.05)",
                                                    position: "relative",
                                                    paddingLeft: "15px",
                                                    fontFamily: "'Open Sans', sans-serif"
                                                }}>
                                                    <span>
                                                        <i className="fa fa-dollar" />
                                                        &nbsp;&nbsp;Khoản tiền mua bài đăng: {formatCurrency(item.PurchasePostBudget)} vnđ
                                                    </span>
                                                </div>
                                                <div style={{
                                                    display: "flex",
                                                    flexDirection: "row",
                                                    justifyContent: "space-between",
                                                    alignItems: "center",
                                                    width: "100%",
                                                    fontSize: "15px",
                                                    color: "rgba(255,255,255,0.7)",
                                                    marginTop: "10px",
                                                    paddingTop: "10px",
                                                    borderTop: "1px solid rgba(255,255,255,0.05)",
                                                    position: "relative",
                                                    paddingLeft: "15px",
                                                    fontFamily: "'Open Sans', sans-serif"
                                                }}>
                                                    <span>
                                                        <i className="fa fa-list-alt" />
                                                        &nbsp;&nbsp;Tổng số ngày hiển thị bài đăng: {item.PostShowDayAmount} ngày
                                                    </span>
                                                </div>
                                                <div style={{
                                                    display: "flex",
                                                    flexDirection: "row",
                                                    justifyContent: "space-between",
                                                    alignItems: "center",
                                                    width: "100%",
                                                    fontSize: "15px",
                                                    color: "rgba(255,255,255,0.7)",
                                                    marginTop: "10px",
                                                    paddingTop: "10px",
                                                    borderTop: "1px solid rgba(255,255,255,0.05)",
                                                    position: "relative",
                                                    paddingLeft: "15px",
                                                    fontFamily: "'Open Sans', sans-serif"
                                                }}>
                                                    <span>
                                                        <i className="fa fa-search" />
                                                        &nbsp;&nbsp;Tìm kiếm CV: {item.ProfileSearchAmount} kết quả / lượt
                                                    </span>
                                                </div>
                                                <div style={{
                                                    display: "flex",
                                                    flexDirection: "row",
                                                    justifyContent: "space-between",
                                                    alignItems: "center",
                                                    width: "100%",
                                                    fontSize: "15px",
                                                    color: "rgba(255,255,255,0.7)",
                                                    marginTop: "10px",
                                                    paddingTop: "10px",
                                                    borderTop: "1px solid rgba(255,255,255,0.05)",
                                                    position: "relative",
                                                    paddingLeft: "15px",
                                                    fontFamily: "'Open Sans', sans-serif"
                                                }}>
                                                    <span>
                                                        <i className="fa fa-calendar-alt" />
                                                        &nbsp;&nbsp;Thời gian sử dụng: {item.UseDayAmount} ngày
                                                    </span>
                                                </div>
                                                <a href="#"
                                                   style= {{
                                                       display: "flex",
                                                        justifyContent: "center",
                                                        alignItems: "center",
                                                        height: "50px",
                                                        width: "100%",
                                                        borderRadius: "4px",
                                                        backgroundImage: "linear-gradient(90deg, #a89bc2 0%, #fb246a 100%)",
                                                        boxShadow: "0 0 20px 0 rgba(255,88,96,0.5)",
                                                        opacity: "0.85",
                                                        fontSize: "13px",
                                                        color: "#252b60",
                                                        textTransform: "uppercase",
                                                        fontWeight: "500",
                                                        letterSpacing: "1px",
                                                        marginTop: "20px"
                                                }}
                                                   onClick={() => handleOpenModal(item.Id)}
                                                >
                                                    Chọn mua
                                                </a>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                            {
                                (!packages || packages && packages.length === 0) &&
                                (
                                    <div style={{ textAlign: 'center', marginTop: "20px" }}>
                                        Không có dữ liệu
                                    </div>
                                )
                            }
                        </form>
                    </div>
                </div>
            </div>
            <ToastContainer/>
            <PurchaseConfirmModal package={selectedPackage} isOpen={isActiveModal} onHide={() => setActiveModal(false)} />
        </main>
    )
}

export default PurchasePackage
