import { Role } from "../../../enums/Role";
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Converter from "../../../util/Converter";
import { toast, ToastContainer } from 'react-toastify';
import { getRoleList } from '../../../service/RoleService';
import { checkDuplicateAccount, checkDuplicateEmail, checkDuplicatePhoneNumber, create } from "../../../service/UserService";

const Register = () => {
    const initialData = {
        lastName: "",
        firstName: "",
        gender: 0,
        phoneNumber: "",
        email: "",
        account: "",
        password: "",
        confirmPassword: "",
        roleId: 2
    }
    const [roles, setRoles] = useState([])
    const [signUp, setSignUp] = useState(initialData);

    const getData = async () => {
        const roleList = await getRoleList()
        if(roleList && roleList.status === 200) {
            setRoles(roleList.data)
        }
    }

    const handleOnChange = event => {
        const { name, value } = event.target;
        setSignUp({ ...signUp, [name]: value });
    };

    const validate = async () => {
        if(!Converter.validate(signUp.lastName, "empty")) {
            toast.warn("Họ không được rỗng", {
                position: toast.POSITION.TOP_RIGHT
            });
            return false
        }
        if(!Converter.validate(signUp.firstName, "empty")) {
            toast.warn("Tên không được rỗng", {
                position: toast.POSITION.TOP_RIGHT
            });
            return false
        }
        if(!Converter.validate(signUp.phoneNumber, "empty")) {
            toast.warn("Số điện thoại không được rỗng", {
                position: toast.POSITION.TOP_RIGHT
            });
            return false
        }
        if(!Converter.validate(signUp.email, "empty")) {
            toast.warn("Email không được rỗng", {
                position: toast.POSITION.TOP_RIGHT
            });
            return false
        }
        if(!Converter.validate(signUp.account, "empty")) {
            toast.warn("Tên tài khoản không được rỗng", {
                position: toast.POSITION.TOP_RIGHT
            });
            return false
        }
        if(!Converter.validate(signUp.password, "empty")) {
            toast.warn("Mật khẩu không được rỗng", {
                position: toast.POSITION.TOP_RIGHT
            });
            return false
        }
        if(!Converter.validate(signUp.confirmPassword, "empty")) {
            toast.warn("Chưa nhập lại mật khẩu", {
                position: toast.POSITION.TOP_RIGHT
            });
            return false
        }
        if(signUp.password.trim() !== signUp.confirmPassword) {
            toast.warn("Nhập lại mật khẩu không chính xác", {
                position: toast.POSITION.TOP_RIGHT
            });
            return false
        }
        if(!Converter.validate(signUp.phoneNumber, "phoneNumber")) {
            toast.warn("Số điện thoại phải có 10 số", {
                position: toast.POSITION.TOP_RIGHT
            });
            return false
        }
        if(!Converter.validate(signUp.email, "email")) {
            toast.warn("Email không hợp lệ", {
                position: toast.POSITION.TOP_RIGHT
            });
            return false
        }
        const checkAccountResult = await checkDuplicateAccount({
            account: signUp.account
        })
        const checkPhoneNumberResult = await checkDuplicatePhoneNumber({
            id: -1,
            phoneNumber: signUp.phoneNumber
        })
        const checkEmailResult = await checkDuplicateEmail({
            id: -1,
            email: signUp.email
        })
        if(checkPhoneNumberResult && checkPhoneNumberResult.status === 200) {
            if(!checkPhoneNumberResult.data.Result) {
                toast.warn("Số điện thoại đã tồn tại", {
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
        if(checkEmailResult && checkEmailResult.status === 200) {
            if(!checkEmailResult.data.Result) {
                toast.warn("Email này đã tồn tại", {
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
        if(checkAccountResult && checkAccountResult.status === 200) {
            if(!checkAccountResult.data.Result) {
                toast.warn("Tên tài khoản này đã tồn tại", {
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

    const handleRegister = async () => {

        if(!await validate()) {
            return
        }

        const user = await create({
            lastName: signUp.lastName,
            firstName: signUp.firstName,
            gender: signUp.gender,
            phoneNumber: signUp.phoneNumber,
            email: signUp.email,
            account: signUp.account,
            password: signUp.password,
            roleId: signUp.roleId
        })

        if(user.status === 201) {
            toast.success("Tạo tài khoản thành công ! Hãy đăng nhập ngay", {
                position: toast.POSITION.TOP_RIGHT
            });
            setSignUp(initialData)
        } else {
            toast.error("Tạo tài khoản thất bại ! Hãy thử lại sau", {
                position: toast.POSITION.TOP_RIGHT
            });
        }
    }

    useEffect(() => {
        getData();
    }, [])

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
                                    <h4>Bạn là người mới ?</h4>
                                    <h6 className="font-weight-light">Nhập các thông tin bên dưới để đăng ký</h6>
                                    <form className="pt-3">
                                        <div className="form-group">
                                            <input
                                                className="form-control form-control-lg"
                                                type="text"
                                                name="lastName"
                                                value={signUp.lastName}
                                                placeholder="Họ"
                                                maxLength={50}
                                                onChange={(event) => handleOnChange(event)}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <input
                                                className="form-control form-control-lg"
                                                type="text"
                                                name="firstName"
                                                value={signUp.firstName}
                                                placeholder="Tên"
                                                maxLength={30}
                                                onChange={(event) => handleOnChange(event)}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <select
                                                className="form-control"
                                                style={{ color: "black", cursor: "pointer" }}
                                                name="gender"
                                                value={signUp.gender}
                                                onChange={(event) => handleOnChange(event)}
                                            >
                                                <option value={0} >Nam</option>
                                                <option value={1} >Nữ</option>
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <input
                                                className="form-control form-control-lg"
                                                type="text"
                                                name="phoneNumber"
                                                value={signUp.phoneNumber}
                                                placeholder="Số điện thoại"
                                                maxLength={10}
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
                                        <div className="form-group">
                                            <input
                                                className="form-control form-control-lg"
                                                type="email"
                                                name="email"
                                                value={signUp.email}
                                                placeholder="Email"
                                                maxLength={50}
                                                onChange={(event) => handleOnChange(event)}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <input
                                                className="form-control form-control-lg"
                                                type="text"
                                                name="account"
                                                value={signUp.account}
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
                                                value={signUp.password}
                                                placeholder="Mật khẩu"
                                                maxLength={12}
                                                onChange={(event) => handleOnChange(event)}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <input
                                                className="form-control form-control-lg"
                                                type="password"
                                                name="confirmPassword"
                                                value={signUp.confirmPassword}
                                                placeholder="Nhập lại mật khẩu"
                                                maxLength={12}
                                                onChange={(event) => handleOnChange(event)}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <select
                                                className="form-control"
                                                style={{ color: "black" }}
                                                name="roleId"
                                                value={signUp.roleId}
                                                onChange={(event) => handleOnChange(event)}
                                            >
                                                {roles.filter(item => item.Id !== Role.Admin )
                                                    .map((item, index) => (
                                                        <option key={index} value={item.Id}>
                                                            Bạn là {item.Name}
                                                        </option>
                                                    ))}
                                            </select>
                                        </div>
                                        <div className="mt-3">
                                            <a
                                                onClick={() => handleRegister()}
                                                className="btn1 btn1-block btn1-primary1 btn1-lg font-weight-medium auth-form-btn1" >
                                                Đăng ký
                                            </a>
                                        </div>
                                        <div className="text-center mt-4 font-weight-light">
                                            Bạn đã có tài khoản ?
                                        </div>
                                        <div className="text-center mt-4 font-weight-light">
                                            <Link to="/login" className="text-primary">
                                                Đăng nhập ngay
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

export default Register
