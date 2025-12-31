import { Role } from "../../../enums/Role";
import React, { useState, useRef, useEffect } from 'react'
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
            role: localStorage.getItem("changePasswordRole"),
            id: localStorage.getItem("changePasswordUserId"),
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
                    role: localStorage.getItem("changePasswordRole"),
                    id: localStorage.getItem("changePasswordUserId"),
                    password: data.newPassword
                })

                if(result && result.status === 200) {
                    if (localStorage.getItem("changePasswordRole") === String(Role.Recruiter)) {
                        window.location.href = "/recruiter/"
                    } else if (localStorage.getItem("changePasswordRole") === String(Role.Candidate)) {
                        window.location.href = "/candidate/"
                    }
                    localStorage.setItem("userId", localStorage.getItem("changePasswordUserId"))
                    localStorage.setItem("token", localStorage.getItem("changePasswordToken"))
                    localStorage.setItem("changePassword", "false")
                    localStorage.setItem("changePasswordRole", null)
                    localStorage.setItem("changePasswordUserId", null)
                    localStorage.setItem("changePasswordToken", null)
                } else {
                toast.error("Đổi mật khẩu thất bại ! Hãy thử lại sau", {
                        position: toast.POSITION.TOP_RIGHT
                    });
                }
            }else {
                toast.error("Mật khẩu được tạo mới đã nhập sai", {
                    position: toast.POSITION.TOP_RIGHT
                });
            }
        } else {
            toast.error("Xác thực mật khẩu thất bại ! Hãy thử lại sau", {
                position: toast.POSITION.TOP_RIGHT
            });
        }
    }

    useEffect(() => {
        if(localStorage.getItem("changePassword")) {
            if(localStorage.getItem("changePassword") === "false") {
                window.location.href = "/error"
            }
        } else {
            window.location.href = "/error"
        }
    }, [])

    return (
        <>
            <div className="col-12 grid-margin" style={{backgroundColor: "#eaedff"}}>
                <div className="card" style={{backgroundColor: "#eaedff"}}>
                    <div className="card-body">
                        <h4 className="card-title">Bạn cần đổi lại mật khẩu sau khi chúng tôi tạo mới cho bạn</h4>
                        <br/>
                        <form className="form-sample">
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="form-group row">
                                        <label className="col-sm-4 col-form-label">Mật khẩu được tạo mới và gửi về mail của bạn:</label>
                                        <div className="col-sm-6">
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
                                        <label className="col-sm-4 col-form-label">Mật khẩu mới:</label>
                                        <div className="col-sm-6">
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
                                        <label className="col-sm-4 col-form-label">Xác nhận mật khẩu mới:</label>
                                        <div className="col-sm-6">
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
