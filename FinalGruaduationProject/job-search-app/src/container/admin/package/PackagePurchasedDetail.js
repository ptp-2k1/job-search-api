import React, { useEffect, useState } from 'react'
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import { getPurchasePackageDetail } from "../../../service/PurchasedPackageService";

const PurchasedPackageDetail = () => {
    const [purchasedPackage, setPurchasedPackage] = useState({})
    const { id } = useParams();

    const getData = async () => {
        const purchasedPackageDetail = await getPurchasePackageDetail({
            id: id
        })

        if (purchasedPackageDetail && purchasedPackageDetail.status === 200) {
            setPurchasedPackage(purchasedPackageDetail.data)
        } else {
            toast.error("Không thể lấy thông tin giao dịch ngay lúc này ! Hãy thử lại sau", {
                position: toast.POSITION.TOP_RIGHT
            });
        }
    }

    const formatDate = (date) => {
        if(date) {
            let dateRaw = date.substring(0, 10).split("-");
            return dateRaw[2] + "/" + dateRaw[1] + "/" + dateRaw[0];
        } else {
            return ""
        }
    }

    const formatCurrency = (price) => {
        return new Intl.NumberFormat('en-DE').format(String(price).replaceAll(",", "").replaceAll(".", ""))
    }

    useEffect(() => {
        if(id) {
            getData()
        }
    }, [])

    return (
        <>
            <div className="col-12 grid-margin">
                <div className="card">
                    <div className="card-body">
                        <h4 className="card-title">Thông tin khách hàng</h4>
                        <br/>
                        <form className="form-sample">
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-group row">
                                        <label className="col-sm-4 col-form-label">
                                            <strong style={{ fontSize: "15px" }}>
                                                Họ:
                                            </strong>
                                        </label>
                                        <div className="col-sm-8">
                                            <label
                                                className="form-control">
                                                {purchasedPackage.LastName}
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group row">
                                        <label className="col-sm-4 col-form-label">
                                            <strong style={{ fontSize: "15px" }}>
                                                Tên:
                                            </strong>
                                        </label>
                                        <div className="col-sm-8">
                                            <label
                                                className="form-control">
                                                {purchasedPackage.FirstName}
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-group row">
                                        <label className="col-sm-4 col-form-label">
                                            <strong style={{ fontSize: "15px" }}>
                                                Số điện thoại:
                                            </strong>
                                        </label>
                                        <div className="col-sm-8">
                                            <label
                                                className="form-control">
                                                {purchasedPackage.PhoneNumber}
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group row">
                                        <label className="col-sm-4 col-form-label">
                                            <strong style={{ fontSize: "15px" }}>
                                                Email:
                                            </strong>
                                        </label>
                                        <div className="col-sm-8" >
                                            <label
                                                className="form-control">
                                                {purchasedPackage.Email}
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className="card-body">
                        <h4 className="card-title">Thông tin gói dịch vụ</h4>
                        <br/>
                        <form className="form-sample">
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-group row">
                                        <label className="col-sm-7 col-form-label">
                                            <strong style={{ fontSize: "15px" }}>
                                                Tên gói:
                                            </strong>
                                        </label>
                                        <div className="col-sm-5">
                                            <label
                                                className="form-control">
                                                {purchasedPackage.Name}
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-group row">
                                        <label className="col-sm-7 col-form-label">
                                            <strong style={{ fontSize: "15px" }}>
                                                Giá gói (vnđ):
                                            </strong>
                                        </label>
                                        <div className="col-sm-5">
                                            <label
                                                className="form-control">
                                                {formatCurrency(purchasedPackage.PurchasePostBudget)}
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group row">
                                        <label className="col-sm-7 col-form-label">
                                            <strong style={{ fontSize: "15px" }}>
                                                Số ngày sử dụng gói:
                                            </strong>
                                        </label>
                                        <div className="col-sm-5">
                                            <label
                                                className="form-control">
                                                {purchasedPackage.UseDayAmount}
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-group row">
                                        <label className="col-sm-7 col-form-label">
                                            <strong style={{ fontSize: "15px" }}>
                                                Tổng số ngày hiển thị bài đăng:
                                            </strong>
                                        </label>
                                        <div className="col-sm-5">
                                            <label
                                                className="form-control">
                                                {purchasedPackage.PostShowDayAmount}
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group row">
                                        <label className="col-sm-7 col-form-label">
                                            <strong style={{ fontSize: "15px" }}>
                                                Số lượng CV hiển thị:
                                            </strong>
                                        </label>
                                        <div className="col-sm-5" >
                                            <label
                                                className="form-control">
                                                {purchasedPackage.ProfileSearchAmount}
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className="card-body">
                        <h4 className="card-title">Thông tin giao dịch</h4>
                        <br/>
                        <form className="form-sample">
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-group row">
                                        <label className="col-sm-6 col-form-label">
                                            <strong style={{ fontSize: "15px" }}>
                                                Mã giao dịch:
                                            </strong>
                                        </label>
                                        <div className="col-sm-6">
                                            <label
                                                className="form-control">
                                                {id}{formatDate(purchasedPackage.PurchasedDate).replaceAll("/", "")}
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group row">
                                        <label className="col-sm-6 col-form-label">
                                            <strong style={{ fontSize: "15px" }}>
                                                Ngày mua gói:
                                            </strong>
                                        </label>
                                        <div className="col-sm-6">
                                            <label
                                                className="form-control">
                                                {formatDate(purchasedPackage.PurchasedDate)}
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-group row">
                                        <label className="col-sm-6 col-form-label">
                                            <strong style={{ fontSize: "15px" }}>
                                                Ngày gói có hiệu lực:
                                            </strong>
                                        </label>
                                        <div className="col-sm-6">
                                            <label
                                                className="form-control">
                                                {
                                                    purchasedPackage.StartDate !== null
                                                    ? formatDate(purchasedPackage.StartDate)
                                                    : "Chưa có"
                                                }
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group row">
                                        <label className="col-sm-6 col-form-label">
                                            <strong style={{ fontSize: "15px" }}>
                                                Ngày gói hết hạn:
                                            </strong>
                                        </label>
                                        <div className="col-sm-6" >
                                            <label
                                                className="form-control">
                                                {
                                                    purchasedPackage.ExpiredDate !== null
                                                    ? formatDate(purchasedPackage.ExpiredDate)
                                                    : "Chưa có"
                                                }
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-group row">
                                        <label className="col-sm-6 col-form-label">
                                            <strong style={{ fontSize: "15px" }}>
                                                Trạng thái:
                                            </strong>
                                        </label>
                                        <div className="col-sm-6">
                                            <label
                                                className="form-control">
                                                {!purchasedPackage.Status ? "Chờ xác nhận" : "Đã xác nhận"}
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <ToastContainer/>
        </>
    )
}

export default PurchasedPackageDetail
