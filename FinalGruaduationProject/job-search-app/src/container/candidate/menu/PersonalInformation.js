import React, { useRef, useEffect, useState } from 'react'
import Converter from "../../../util/Converter";
import { toast, ToastContainer } from 'react-toastify';
import { updateUser, getUserDetail, checkDuplicatePhoneNumber, checkDuplicateEmail, getUserAvatar, createUserAvatar, updateUserAvatar } from "../../../service/UserService";

const PersonalInformation = () => {
    const initialData = {
        avatar: {
            id: "",
            base64: ""
        },
        lastName: "",
        firstName: "",
        gender: 0,
        phoneNumber: "",
        email: "",
        birthDate: "",
        address: ""
    }
    const [data, setData] = useState(initialData)
    const [upLoadAvatarStatus, setUpLoadAvatarStatus] = useState(false)
    const firstInput = useRef()

    const getData = async () => {
        const data = await getUserDetail({
            role: 3,
            id: localStorage.getItem("userId")
        })

        if(data && data.status === 200) {
            const avatar = data.data.Avatar ? await getUserAvatar({
                role: 3,
                id: data.data.Avatar
            }) : null

            setData({
                avatar: {
                    id: data.data.Avatar,
                    base64: avatar !== null && avatar.data !== null ? "data:image/png;base64," + avatar.data.File : null
                },
                lastName: data.data.LastName,
                firstName: data.data.FirstName,
                gender: data.data.Gender,
                birthDate: data.data.BirthDate !== null ? data.data.BirthDate.substring(0, 10) : "",
                phoneNumber: data.data.PhoneNumber,
                email: data.data.Email,
                address: data.data.Address
            })
        } else {
            toast.error("Không thể lấy thông tin cá nhân ngay lúc này ! Hãy thử lại sau", {
                position: toast.POSITION.TOP_RIGHT
            })
        }
    }

    const handleOnChangeAvatar = () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/png, image/jpeg"
        input.style.display = "none";
        input.click();
        input.addEventListener("change", async (event) => {
            const file = event.target.files[0];
            const base64 = await Converter.getBase64(file)
            let result
            if(!data.avatar.base64) {
                result = await createUserAvatar({
                    role: 3,
                    id: localStorage.getItem("userId"),
                    file: String(base64).replace("data:image/png;base64,", "").replace("data:image/jpeg;base64,", "")
                })
            } else {
                result = await updateUserAvatar({
                    role: 3,
                    id: localStorage.getItem("userId"),
                    oldFile: data.avatar.id,
                    file: String(base64).replace("data:image/png;base64,", "").replace("data:image/jpeg;base64,", "")
                })
            }
            if(result && (!data.avatar.base64 ? result.status === 201 : result.status === 200 )) {
                setUpLoadAvatarStatus(!upLoadAvatarStatus)
            } else {
                toast.error("Cập nhật ảnh đại diện thất bại ! Hãy thử lại sau", {
                    position: toast.POSITION.TOP_RIGHT
                });
            }
        });
    }

    const handleOnChange = (event) => {
        const { name, value } = event.target;
        setData({ ...data, [name]: value });
    };

    const validate = async () => {
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

        const checkPhoneNumberResult = await checkDuplicatePhoneNumber({
            id: localStorage.getItem("userId"),
            phoneNumber: data.phoneNumber
        })
        const checkEmailResult = await checkDuplicateEmail({
            id: localStorage.getItem("userId"),
            email: data.email
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

        return true
    }

    let handleUpdate = async () => {

        if(!await validate()) {
            return
        }

        const result = await updateUser({
            role: 3,
            lastName: data.lastName,
            firstName: data.firstName,
            gender: data.gender,
            phoneNumber: data.phoneNumber,
            email: data.email,
            birthDate: data.birthDate !== "" ? data.birthDate.substring(0, 10) : null,
            address: data.address,
            id: localStorage.getItem("userId")
        })

        if(result && result.status === 200) {
            toast.success("Cập nhật thông tin cá nhân thành công", {
                position: toast.POSITION.TOP_RIGHT
            });
        } else {
            toast.error("Cập nhật thông tin cá nhân thất bại ! Hãy thử lại sau", {
                position: toast.POSITION.TOP_RIGHT
            });
        }
    }

    useEffect(() => {
        getData()
    }, [upLoadAvatarStatus])

    return (
        <>
            <div className="col-12 grid-margin" style={{ backgroundColor: "#eaedff"}}>
                <div className="card" style={{ backgroundColor: "#eaedff"}}>
                    <div className="card-body">
                        <h4 className="card-title">Thông tin cá nhân của bạn</h4>
                        <br/>
                        <form className="form-sample">
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-group row">
                                        <label className="col-sm-4 col-form-label">Ảnh đại diện:</label>
                                        <div className="col-sm-8">
                                            <a href="#">
                                                <img
                                                    src={data.avatar.base64}
                                                    alt="&#160;&#160;Chọn ảnh"
                                                    style={{
                                                        width: "150px",
                                                        height: "100px",
                                                        backgroundColor: "#ffffff",
                                                        color: "#000000",
                                                        marginTop: "15px",
                                                    }}
                                                    onClick={handleOnChangeAvatar}
                                                />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-group row">
                                        <label className="col-sm-4 col-form-label">Họ:</label>
                                        <div className="col-sm-10">
                                            <input
                                                className="form-control"
                                                type="text"
                                                name="lastName"
                                                value={data.lastName}
                                                maxLength={50}
                                                onChange={(event) => handleOnChange(event)}
                                                ref={firstInput}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group row">
                                        <label className="col-sm-4 col-form-label">Tên:</label>
                                        <div className="col-sm-10">
                                            <input
                                                className="form-control"
                                                type="text"
                                                name="firstName"
                                                value={data.firstName}
                                                maxLength={30}
                                                onChange={(event) => handleOnChange(event)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-group row">
                                        <label className="col-sm-4 col-form-label">Giới tính:</label>
                                        <div className="col-sm-10">
                                            <select
                                                className="form-control"
                                                style={{ color: "#495057", cursor: "pointer" }}
                                                name="gender"
                                                value={data.gender}
                                                onChange={(event) => handleOnChange(event)}
                                            >
                                                <option value={0}>Nam</option>
                                                <option value={1}>Nữ</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group row">
                                        <label className="col-sm-4 col-form-label">Ngày sinh:</label>
                                        <div className="col-sm-10" >
                                            <input
                                                className="form-control"
                                                style={{ color: "#495057", cursor: "pointer" }}
                                                type="date"
                                                name="birthDate"
                                                value={data.birthDate}
                                                onKeyDown={false}
                                                onChange={(event) => handleOnChange(event)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-group row">
                                        <label className="col-sm-4 col-form-label">Số điện thoại:</label>
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
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group row">
                                        <label className="col-sm-4 col-form-label">Email:</label>
                                        <div className="col-sm-10">
                                            <input
                                                className="form-control"
                                                type="email"
                                                name="email"
                                                value={data.email}
                                                maxLength={50}
                                                onChange={(event) => handleOnChange(event)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-11">
                                    <div className="form-group row">
                                        <label className="col-sm-4 col-form-label">Địa chỉ:</label>
                                        <div className="col-sm-12">
                                            <input
                                                className="form-control"
                                                type="text"
                                                name="address"
                                                value={data.address}
                                                maxLength={80}
                                                onChange={(event) => handleOnChange(event)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="text-center">
                                <button
                                    type="button"
                                    className="btn1 btn1-primary1 btn1-icon-text"
                                    onClick={() => handleUpdate()}
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

export default PersonalInformation
