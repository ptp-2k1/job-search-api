import React, { useRef, useEffect, useState } from 'react'
import { useParams } from "react-router-dom";
import Converter from "../../../util/Converter";
import { toast, ToastContainer } from 'react-toastify';
import { getUserDetail, checkDuplicateAccount, checkDuplicatePhoneNumber, checkDuplicateEmail, create } from "../../../service/UserService";

const UserManagement = () => {
    const { id } = useParams()
    const initialData = {
        account: "",
        password: "",
        lastName: "",
        firstName: "",
        gender: 0,
        birthDate: "",
        phoneNumber: "",
        email: "",
        address: ""
    }
    const [data, setData] = useState(initialData)
    const firstInput = useRef()

    const handleOnChange = (event) => {
        const { name, value } = event.target;
        setData({ ...data, [name]: value });
    };

    const validate = async () => {
        if(!Converter.validate(data.account, "empty")) {
            toast.warn("Tên tài khoản không được rỗng", {
                position: toast.POSITION.TOP_RIGHT
            });
            return false
        }
        if(!Converter.validate(data.password, "empty")) {
            toast.warn("Mật khẩu không được rỗng", {
                position: toast.POSITION.TOP_RIGHT
            });
            return false
        }
        if(!Converter.validate(data.lastName, "empty")) {
            toast.warn("Họ không được rỗng", {
                position: toast.POSITION.TOP_RIGHT
            });
            return false
        }
        if(!Converter.validate(data.firstName, "empty")) {
            toast.warn("Tên không được rỗng", {
                position: toast.POSITION.TOP_RIGHT
            });
            return false
        }
        if(!Converter.validate(data.phoneNumber, "empty")) {
            toast.warn("Số điện thoại không được rỗng", {
                position: toast.POSITION.TOP_RIGHT
            });
            return false
        }
        if(!Converter.validate(data.email, "empty")) {
            toast.warn("Email không được rỗng", {
                position: toast.POSITION.TOP_RIGHT
            });
            return false
        }
        if(data.birthDate !== "") {
            if(!Converter.validate(data.birthDate, "birthDate")) {
                toast.warn("Ngày sinh phải nhỏ hơn ngày hiện tại", {
                    position: toast.POSITION.TOP_RIGHT
                });
                return false
            }
        }
        if(!Converter.validate(data.phoneNumber, "phoneNumber")) {
            toast.warn("Số điện thoại phải có 10 số", {
                position: toast.POSITION.TOP_RIGHT
            });
            return false
        }
        if(!Converter.validate(data.email, "email")) {
            toast.warn("Email không hợp lệ", {
                position: toast.POSITION.TOP_RIGHT
            });
            return false
        }
        const checkAccountResult = await checkDuplicateAccount({
            account: data.account
        })
        const checkPhoneNumberResult = await checkDuplicatePhoneNumber({
            id: -1,
            phoneNumber: data.phoneNumber
        })
        const checkEmailResult = await checkDuplicateEmail({
            id: -1,
            email: data.email
        })

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

        return true
    }

    let handleCreate = async () => {

        if(!await validate()) {
            return
        }

        const result = await create({
            account: data.account,
            password: data.password,
            lastName: data.lastName,
            firstName: data.firstName,
            gender: data.gender,
            birthDate: data.birthDate !== "" ? data.birthDate.substring(0, 10) : null,
            phoneNumber: data.phoneNumber,
            email: data.email,
            address: data.address,
            roleId: 1,
        })

        if(result && result.status === 201) {
            toast.success("Thêm nhân viên thành công", {
                position: toast.POSITION.TOP_RIGHT
            });
            setData(initialData)
            firstInput.current.focus()
        } else {
            toast.error("Thêm nhân viên thất bại ! Hãy thử lại sau", {
                position: toast.POSITION.TOP_RIGHT
            });
        }
    }

    const getData = async () => {
        const data = await getUserDetail({
            role: 1,
            id: id
        })

        if(data && data.status === 200) {
            setData({
                account: data.data.Account,
                lastName: data.data.LastName,
                firstName: data.data.FirstName,
                gender: data.data.Gender,
                birthDate: data.data.BirthDate !== null ? data.data.BirthDate.substring(0, 10) : "",
                phoneNumber: data.data.PhoneNumber,
                email: data.data.Email,
                address: data.data.Address
            })
        } else {
            toast.error("Không thể lấy thông tin người dùng ngay lúc này ! Hãy thử lại sau", {
                position: toast.POSITION.TOP_RIGHT
            });
        }
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
                        <h4 className="card-title">{ !id ? 'Thêm mới người dùng' : 'Thông tin người dùng'}</h4>
                        <br/>
                        <form className="form-sample">
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-group row">
                                        <label className="col-sm-4 col-form-label">
                                            <strong style={{ fontSize: "15px" }}>
                                                Tên tài khoản:
                                            </strong>
                                        </label>
                                        <div className="col-sm-10">
                                            <input
                                                className="form-control"
                                                type="text"
                                                name="account"
                                                value={data.account}
                                                maxLength={30}
                                                onChange={(event) => handleOnChange(event)}
                                                ref={firstInput}
                                                readOnly={id}
                                            />
                                        </div>
                                    </div>
                                </div>
                                {
                                    !id &&
                                    (
                                        <div className="col-md-6">
                                            <div className="form-group row">
                                                <label className="col-sm-4 col-form-label">
                                                    <strong style={{ fontSize: "15px" }}>
                                                        Mật khẩu:
                                                    </strong>
                                                </label>
                                                <div className="col-sm-10">
                                                    <input
                                                        className="form-control"
                                                        type="password"
                                                        name="password"
                                                        value={data.password}
                                                        maxLength={12}
                                                        onChange={(event) => handleOnChange(event)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }
                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-group row">
                                        <label className="col-sm-4 col-form-label">
                                            <strong style={{ fontSize: "15px" }}>
                                                Họ:
                                            </strong>
                                        </label>
                                        <div className="col-sm-10">
                                            <input
                                                className="form-control form-control-lg"
                                                type="text"
                                                name="lastName"
                                                value={data.lastName}
                                                placeholder="Họ"
                                                maxLength={50}
                                                onChange={(event) => handleOnChange(event)}
                                                readOnly={id}
                                            />
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
                                        <div className="col-sm-10">
                                            <input
                                                className="form-control form-control-lg"
                                                type="text"
                                                name="firstName"
                                                value={data.firstName}
                                                maxLength={30}
                                                onChange={(event) => handleOnChange(event)}
                                                readOnly={id}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-group row">
                                        <label className="col-sm-4 col-form-label">
                                            <strong style={{ fontSize: "15px" }}>
                                                Giới tính:
                                            </strong>
                                        </label>
                                        <div className="col-sm-10">
                                            <select
                                                className="form-control"
                                                style={{ color: "#495057", cursor: "pointer" }}
                                                name="gender"
                                                value={data.gender}
                                                onChange={(event) => handleOnChange(event)}
                                                disabled={id}
                                            >
                                                <option value={0}>Nam</option>
                                                <option value={1}>Nữ</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group row">
                                        <label className="col-sm-4 col-form-label">
                                            <strong style={{ fontSize: "15px" }}>
                                                Ngày sinh:
                                            </strong>
                                        </label>
                                        <div className="col-sm-10" >
                                            <input
                                                className="form-control"
                                                style={{ color: "#495057", cursor: "pointer" }}
                                                type="date"
                                                name="birthDate"
                                                value={data.birthDate}
                                                onKeyDown={false}
                                                onChange={(event) => handleOnChange(event)}
                                                readOnly={id}
                                            />
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
                                        <div className="col-sm-10">
                                            <input
                                                className="form-control"
                                                type="text"
                                                name="phoneNumber"
                                                value={data.phoneNumber}
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
                                                readOnly={id}
                                            />
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
                                        <div className="col-sm-10">
                                            <input
                                                className="form-control"
                                                type="email"
                                                name="email"
                                                value={data.email}
                                                maxLength={50}
                                                onChange={(event) => handleOnChange(event)}
                                                readOnly={id}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-11">
                                    <div className="form-group row">
                                        <label className="col-sm-4 col-form-label">
                                            <strong style={{ fontSize: "15px" }}>
                                                Địa chỉ:
                                            </strong>
                                        </label>
                                        <div className="col-sm-12">
                                            <input
                                                className="form-control"
                                                type="text"
                                                name="address"
                                                value={data.address}
                                                maxLength={80}
                                                onChange={(event) => handleOnChange(event)}
                                                readOnly={id}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {
                                !id &&
                                (
                                    <div className="text-center">
                                        <button
                                            type="button"
                                            className="btn1 btn1-primary1 btn1-icon-text"
                                            onClick={() => handleCreate()}
                                        >
                                            <i className="ti-file btn1-icon-prepend"/>
                                            Lưu
                                        </button>
                                    </div>
                                )
                            }
                        </form>
                    </div>
                </div>
            </div>
            <ToastContainer/>
        </>
    )
}

export default UserManagement
