import React, { useState, useRef } from 'react'
import { toast, ToastContainer } from 'react-toastify';
import { checkUserPassword, changeUserPassword } from "../../../service/UserService";

const ChangePassword = () => {

    const initialData = {
        oldPassword: "",
        newPassword: "",
        confirmNewPassword: ""
    }
    const [data, setData] = useState(initialData)
    const firstInput = useRef()

    const handleOnChange = (event) => {
        const { name, value } = event.target;
        setData({ ...data, [name]: value });
    };

    let handleChangePassword = async () => {

        if(data.oldPassword === "" || data.newPassword === "" || data.confirmNewPassword === "") {
            toast.warn("Hãy nhập đầy đủ thông tin để đổi mật khẩu mới", {
                position: toast.POSITION.TOP_RIGHT
            });
            return
        }

        const result = await checkUserPassword({
            role: 3,
            id: localStorage.getItem("userId"),
            password: data.oldPassword
        })

        if(result && result.status === 200) {
            if(result.data) {
                if(data.newPassword !== data.confirmNewPassword) {
                    toast.warn("Xác nhận mật khẩu mới không khớp", {
                        position: toast.POSITION.TOP_RIGHT
                    });
                    return
                }

                const result = await changeUserPassword({
                    role: 3,
                    id: localStorage.getItem("userId"),
                    password: data.newPassword
                })

                if(result && result.status === 200) {
                    toast.success("Đổi mật khẩu thành công ! Hãy đăng nhập lại để vào hệ thống", {
                        position: toast.POSITION.TOP_RIGHT
                    });
                    setTimeout(function () {
                        window.location.href = "/"
                    }, 2000)
                } else {
                    toast.error("Đổi mật khẩu thất bại ! Hãy thử lại sau", {
                        position: toast.POSITION.TOP_RIGHT
                    });
                }
            }else {
                toast.error("Mật khẩu hiện tại đã nhập sai", {
                    position: toast.POSITION.TOP_RIGHT
                });
            }
        } else {
            toast.error("Xác thực mật khẩu thất bại ! Hãy thử lại sau", {
                position: toast.POSITION.TOP_RIGHT
            });
        }
    }

    return (
        <>
            <div className="col-12 grid-margin" style={{backgroundColor: "#eaedff"}}>
                <div className="card" style={{backgroundColor: "#eaedff"}}>
                    <div className="card-body">
                        <h4 className="card-title">Đổi mật khẩu tài khoản</h4>
                        <br/>
                        <form className="form-sample">
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="form-group row">
                                        <label className="col-sm-3 col-form-label">Mật khẩu hiện tại:</label>
                                        <div className="col-sm-5">
                                            <input
                                                className="form-control"
                                                type="password"
                                                name="oldPassword"
                                                value={data.oldPassword}
                                                maxLength={20}
                                                onChange={(event) => handleOnChange(event)}
                                                ref={firstInput}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="form-group row">
                                        <label className="col-sm-3 col-form-label">Mật khẩu mới:</label>
                                        <div className="col-sm-5">
                                            <input
                                                className="form-control"
                                                type="password"
                                                name="newPassword"
                                                value={data.newPassword}
                                                maxLength={20}
                                                onChange={(event) => handleOnChange(event)}
                                                ref={firstInput}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="form-group row">
                                        <label className="col-sm-3 col-form-label">Xác nhận mật khẩu mới:</label>
                                        <div className="col-sm-5">
                                            <input
                                                className="form-control"
                                                type="password"
                                                name="confirmNewPassword"
                                                value={data.confirmNewPassword}
                                                maxLength={20}
                                                onChange={(event) => handleOnChange(event)}
                                                ref={firstInput}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="text-center">
                                <button
                                    type="button" className="btn1 btn1-primary1 btn1-icon-text"
                                    onClick={() => handleChangePassword()}
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

export default ChangePassword
