import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { resetPassword } from "../../../service/UserService";

const AdminResetPassword = () => {
    const [email, setEmail] = useState();

    const handleResetPassword = async () => {

        if(email === "" || email === undefined || email === null) {
            toast.warn("Email không được rỗng", {
                position: toast.POSITION.TOP_RIGHT
            });
            return;
        }

        const user = await resetPassword(email)

        if(user.status === 200) {
            toast.success("Hồi phục mật khẩu thành công ! Mật khẩu mới đã được gửi đến email của bạn", {
                position: toast.POSITION.TOP_RIGHT
            });
        } else if(user.status === 403) {
            toast.error("Email đã nhập không tồn tại !", {
                position: toast.POSITION.TOP_RIGHT
            });
        } else {
            toast.error("Hồi phục mật khẩu thất bại ! Hãy thử lại sau", {
                position: toast.POSITION.TOP_RIGHT
            });
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
                                        <img src="/assets/img/logo/logo.png" alt="logo" />
                                    </div>
                                    <h4>Bạn quên mật khẩu ?</h4>
                                    <h6 className="font-weight-light">Điền thông tin bên dưới để khôi phục nhé !</h6>
                                    <form className="pt-3">
                                        <div className="form-group">
                                            <input
                                                className="form-control form-control-lg"
                                                type="email"
                                                name="email"
                                                value={email}
                                                placeholder="Email mà bạn đã đăng ký"
                                                maxLength={50}
                                                onChange={(event) => setEmail(event.target.value.trim())}
                                            />
                                        </div>
                                        <div className="mt-3">
                                            <a
                                                className="btn1 btn1-block btn1-primary1 btn1-lg font-weight-medium auth-form-btn1"
                                                onClick={() => handleResetPassword()}
                                            >
                                                Xác nhận
                                            </a>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer/>
        </>
    )
}

export default AdminResetPassword
