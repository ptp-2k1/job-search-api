import { Role } from "../../../enums/Role"
import React, { useState, useContext } from "react";
import Converter from "../../../util/Converter";
import { ToastContainer, toast } from 'react-toastify';
import { Link } from "react-router-dom";
import { login } from "../../../service/UserService";
import 'react-toastify/dist/ReactToastify.css';

const AdminLogin = () => {
    const [signIn, setSignIn] = useState({
        account: "",
        password: ""
    });

    const handleOnChange = event => {
        const { name, value } = event.target
        setSignIn({ ...signIn, [name]: value })
    };

    const validate = () => {
        if(!Converter.validate(signIn.account, "empty")) {
            toast.warn("Tên tài khoản không được rỗng", {
                position: toast.POSITION.TOP_RIGHT
            });
            return false
        }
        if(!Converter.validate(signIn.password, "empty")) {
            toast.warn("Mật khẩu không được rỗng", {
                position: toast.POSITION.TOP_RIGHT
            });
            return false
        }
        return true
    }

    const handleLogin = async () => {
        if(!validate()) {
            return
        }

        const user = await login({
            account: signIn.account,
            password: signIn.password
        })

        if (user && user.status === 200) {
            if(signIn.password.length <= 12) {
                localStorage.setItem("userId", user.data.id)
                localStorage.setItem("token", user.data.token)
                if (user.data.role === Role.Admin) {
                    window.location.href = "/admin/"
                } else {
                    toast.error("Tên tài khoản không tồn tại", {
                        position: toast.POSITION.TOP_RIGHT
                    });
                }
            } else {
                localStorage.setItem("changePassword", "true")
                localStorage.setItem("changePasswordRole", String(user.data.role))
                localStorage.setItem("changePasswordUserId", user.data.id)
                localStorage.setItem("changePasswordToken", user.data.token)
                window.location.href = "/admin/login/change-password"
            }
        }
        else {
            if(user.status === 401) {
                if(user.data.category === "account") {
                    toast.error("Tên tài khoản không tồn tại", {
                        position: toast.POSITION.TOP_RIGHT
                    });
                } else {
                    toast.error("Mật khẩu không chính xác", {
                        position: toast.POSITION.TOP_RIGHT
                    });
                }
            } else if(user.status === 403) {
                toast.error("Tài khoản này hiện đang bị khóa", {
                    position: toast.POSITION.TOP_RIGHT
                });
            } else {
                toast.error("Bạn không thể đăng nhập vào hệ thống ngay lúc này ! Hãy thử lại sau", {
                    position: toast.POSITION.TOP_RIGHT
                });
            }
        }
    }

    return (
        <>
            <div className="container-scroller">
                <div className="container-fluid page-body-wrapper full-page-wrapper">
                    <div className="content-wrapper d-flex align-items-center auth px-0" style={{ backgroundColor: "#eaedff"}}>
                        <div className="row w-100 mx-0">
                            <div className="col-lg-4 mx-auto">
                                <div className="auth-form-light text-left py-5 px-4 px-sm-5">
                                    <div className="brand-logo">
                                        <img src='/assets/img/logo/logo.png' alt="logo" />
                                    </div>
                                    <h4>Cùng nhau trở lại với công việc !</h4>
                                    <h6 className="font-weight-light">Hãy đăng nhập để tiếp tục</h6>
                                    <form className="pt-3">
                                        <div className="form-group">
                                            <input
                                                className="form-control form-control-lg"
                                                type="text"
                                                name="account"
                                                value={signIn.account}
                                                placeholder="Tên tài khoản"
                                                maxLength={30}
                                                onChange={(event) => handleOnChange(event)}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <input
                                                className="form-control form-control-lg"
                                                type="password"
                                                name="password"
                                                value={signIn.password}
                                                placeholder="Mật khẩu"
                                                maxLength={20}
                                                onChange={(event) => handleOnChange(event)}
                                            />
                                        </div>
                                        <div className="mt-3">
                                            <a
                                                onClick={() => handleLogin()}
                                                className="btn1 btn1-block btn1-primary1 btn1-lg font-weight-medium auth-form-btn1"
                                            >
                                                Đăng nhập
                                            </a>
                                        </div>
                                        <div className="my-2 d-flex justify-content-between align-items-center">
                                            <Link to="/admin/forget-password" className="auth-link text-black" style={{ color: 'blue' }}>
                                                Tôi đã quên mật khẩu
                                            </Link>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </>
    )
}

export default AdminLogin
