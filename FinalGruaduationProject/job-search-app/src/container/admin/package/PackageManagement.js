import React, { useRef, useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import Converter from "../../../util/Converter";
import { toast, ToastContainer } from 'react-toastify';
import { checkDuplicateName, checkAppliedPackage, createPackage, getPackageDetail, updatePackage } from "../../../service/PackageService";

const PackageManagement = () => {
    const { id } = useParams()
    const initialData = {
        name: "",
        purchasePostBudget: "0",
        profileSearchAmount: "0",
        postShowDayAmount: "0",
        useDayAmount: "0"
    }
    const [data, setData] = useState(initialData)
    const firstInput = useRef()

    const getData = async () => {
        const data = await getPackageDetail({
            id: id
        })

        if(data && data.status === 200) {
            setData({
                name: data.data.Name,
                purchasePostBudget: formatCurrency(data.data.PurchasePostBudget),
                profileSearchAmount: data.data.ProfileSearchAmount,
                postShowDayAmount: data.data.PostShowDayAmount,
                useDayAmount: data.data.UseDayAmount
            })
        } else {
            toast.error("Không thể lấy thông tin gói dịch vụ ngay lúc này ! Hãy thử lại sau", {
                position: toast.POSITION.TOP_RIGHT
            });
        }
    }

    const handleOnChange = (event) => {
        const { name, value } = event.target;
        setData({ ...data, [name]: name === "purchasePostBudget" ? formatCurrency(value) : value });
    };

    const validate = async (id) => {
        if(!Converter.validate(data.name, "empty")) {
            toast.warn("Tên gói không được rỗng", {
                position: toast.POSITION.TOP_RIGHT
            });
            return false
        }
        if(!Converter.validate(data.useDayAmount, "empty")) {
            toast.warn("Số ngày sử dụng gói không được rỗng", {
                position: toast.POSITION.TOP_RIGHT
            });
            return false
        }
        if(!Converter.validate(data.postShowDayAmount, "empty")) {
            toast.warn("Tổng số ngày hiển thị bài đăng không được rỗng", {
                position: toast.POSITION.TOP_RIGHT
            });
            return false
        }
        if(!Converter.validate(data.profileSearchAmount, "empty")) {
            toast.warn("Số lượng CV không được rỗng", {
                position: toast.POSITION.TOP_RIGHT
            });
            return false
        }
        if(Number(data.purchasePostBudget) <= 0) {
            toast.warn("Giá gói phải lớn hơn 0", {
                position: toast.POSITION.TOP_RIGHT
            });
            return false
        }
        if(Number(data.useDayAmount) <= 0) {
            toast.warn("Số ngày sử dụng gói phải lớn hơn 0", {
                position: toast.POSITION.TOP_RIGHT
            });
            return false
        }
        if(Number(data.postShowDayAmount) <= 0) {
            toast.warn("Số ngày hiển thị bài đăng phải lớn hơn 0", {
                position: toast.POSITION.TOP_RIGHT
            });
            return false
        }
        if(Number(data.profileSearchAmount) <= 0) {
            toast.warn("Số lượng cv phải lớn hơn 0", {
                position: toast.POSITION.TOP_RIGHT
            });
            return false
        }

        const result = await checkDuplicateName({
            id: id,
            name: data.name
        })

        if(result && result.status === 200) {
            if(!result.data.Result) {
                toast.warn("Tên gói dịch vụ này đã tồn tại", {
                    position: toast.POSITION.TOP_RIGHT
                });
                return false
            }
        } else {
            toast.error("Kiểm tra thông tin thất bại ! Hãy thử lại sau", {
                position: toast.POSITION.TOP_RIGHT
            });
            return false
        }

        return true
    }

    let handleCreate = async () => {

        if(!await validate(-1)) {
            return
        }

        const result = await createPackage({
            name: data.name,
            purchasePostBudget: data.purchasePostBudget.replaceAll(".", ""),
            profileSearchAmount: data.profileSearchAmount,
            postShowDayAmount: data.postShowDayAmount,
            useDayAmount: data.useDayAmount,
            userId: localStorage.getItem("userId")
        })

        if(result && result.status === 201) {
            toast.success("Thêm gói dịch vụ thành công", {
                position: toast.POSITION.TOP_RIGHT
            });
            setData(initialData)
            firstInput.current.focus()
        } else {
            toast.error("Thêm gói dịch vụ thất bại ! Hãy thử lại sau", {
                position: toast.POSITION.TOP_RIGHT
            });
        }
    }

    let handleUpdate = async () => {

        if(!await validate(id)) {
            return
        }

        const result = await checkAppliedPackage({
            id: id
        })

        if(result && result.status === 200) {
            if(!result.data.Result) {
                const result = await updatePackage({
                    name: data.name,
                    purchasePostBudget: data.purchasePostBudget.replaceAll(".", ""),
                    profileSearchAmount: data.profileSearchAmount,
                    postShowDayAmount: data.postShowDayAmount,
                    useDayAmount: data.useDayAmount,
                    id: id
                })

                if(result && result.status === 200) {
                    toast.success("Cập nhật thông tin gói dịch vụ thành công", {
                        position: toast.POSITION.TOP_RIGHT
                    });
                } else {
                    toast.error("Cập nhật thông tin gói dịch vụ thất bại ! Hãy thử lại sau", {
                        position: toast.POSITION.TOP_RIGHT
                    });
                }
            } else {
                toast.warn("Không thể cập nhật vì gói dịch vụ này đã được áp dụng", {
                    position: toast.POSITION.TOP_RIGHT
                });
            }
        } else {
            toast.error("Kiểm tra thông tin thất bại ! Hãy thử lại sau", {
                position: toast.POSITION.TOP_RIGHT
            });
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
                        <h4 className="card-title">{ !id ? 'Thêm mới gói dịch vụ' : 'Cập nhật gói dịch vụ'}</h4>
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
                                            <input
                                                className="form-control"
                                                type="text"
                                                name="name"
                                                value={data.name}
                                                maxLength={50}
                                                onChange={(event) => handleOnChange(event)}
                                                ref={firstInput}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-group row">
                                        <label className="col-sm-7 col-form-label">
                                            <strong style={{ fontSize: "15px" }}>
                                                Giá gói (vnđ) :
                                            </strong>
                                        </label>
                                        <div className="col-sm-5">
                                            <input
                                                className="form-control"
                                                type="text"
                                                name="purchasePostBudget"
                                                value={data.purchasePostBudget}
                                                onChange={(event) => handleOnChange(event)}
                                                onKeyPress={(event) => {
                                                    if (!/[0-9]/.test(event.key)) {
                                                        event.preventDefault();
                                                    }
                                                }}
                                                onPaste={(event) => {
                                                    event.preventDefault();
                                                    return false;
                                                }}
                                            />
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
                                            <input
                                                className="form-control"
                                                type="text"
                                                name="useDayAmount"
                                                value={data.useDayAmount}
                                                onChange={(event) => handleOnChange(event)}
                                                onKeyPress={(event) => {
                                                    if (!/[0-9]/.test(event.key)) {
                                                        event.preventDefault();
                                                    }
                                                }}
                                                onPaste={(event) => {
                                                    event.preventDefault();
                                                    return false;
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-group row">
                                        <label className="col-sm-7 col-form-label">
                                            <strong style={{ fontSize: "15px" }}>
                                                Tổng số ngày hiện bài đăng:
                                            </strong>
                                        </label>
                                        <div className="col-sm-5">
                                            <input
                                                className="form-control"
                                                type="text"
                                                name="postShowDayAmount"
                                                value={data.postShowDayAmount}
                                                onChange={(event) => handleOnChange(event)}
                                                onKeyPress={(event) => {
                                                    if (!/[0-9]/.test(event.key)) {
                                                        event.preventDefault();
                                                    }
                                                }}
                                                onPaste={(event) => {
                                                    event.preventDefault();
                                                    return false;
                                                }}
                                            />
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
                                        <div className="col-sm-5">
                                            <input
                                                className="form-control"
                                                type="text"
                                                name="profileSearchAmount"
                                                value={data.profileSearchAmount}
                                                onChange={(event) => handleOnChange(event)}
                                                onKeyPress={(event) => {
                                                    if (!/[0-9]/.test(event.key)) {
                                                        event.preventDefault();
                                                    }
                                                }}
                                                onPaste={(event) => {
                                                    event.preventDefault();
                                                    return false;
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="text-center">
                                <button
                                    type="button"
                                    className="btn1 btn1-primary1 btn1-icon-text"
                                    onClick={() => !id ? handleCreate() : handleUpdate()}
                                >
                                    <i className="ti-file btn1-icon-prepend"/>
                                    Lưu
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <ToastContainer/>
        </>
    )
}

export default PackageManagement
