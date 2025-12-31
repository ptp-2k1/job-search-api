import React, { useState, useEffect, useRef } from 'react'
import Converter from "../../../util/Converter";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import { checkDuplicateName, createSalary, getSalaryDetail, updateSalary } from "../../../service/SalaryService";

const SalaryManagement = () => {
    const { id } = useParams()
    const [name, setName] = useState("")
    const firstInput = useRef()

    const getData = async () => {
        const name = await getSalaryDetail({
            id: id
        })

        if(name && name.status === 200) {
            setName(name.data.Name)
        } else {
            toast.error("Không thể lấy thông tin mức lương ngay lúc này ! Hãy thử lại sau", {
                position: toast.POSITION.TOP_RIGHT
            });
        }
    }

    const validate = async (id) => {
        if(!Converter.validate(name, "empty")) {
            toast.warn("Tên mức lương không được rỗng", {
                position: toast.POSITION.TOP_RIGHT
            });
            return false
        }

        const result = await checkDuplicateName({
            id: id,
            name: name
        })

        if(result && result.status === 200) {
            if(!result.data.Result) {
                toast.warn("Tên mức lương này đã tồn tại", {
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

        if(! await validate(-1)) {
            return
        }

        const today = new Date()

        const result = await createSalary({
            name: name,
            userId: localStorage.getItem("userId")
        })

        if(result && result.status === 201) {
            toast.success("Thêm mức lương thành công", {
                position: toast.POSITION.TOP_RIGHT
            });
            setName("")
            firstInput.current.focus()
        } else {
            toast.error("Thêm mức lương thất bại ! Hãy thử lại sau", {
                position: toast.POSITION.TOP_RIGHT
            });
        }
    }

    let handleUpdate = async () => {

        if(! await validate(id)) {
            return
        }

        const result = await updateSalary({
            name: name,
            id: id
        })

        if(result && result.status === 200) {
            toast.success("Cập nhật thông tin mức lương thành công", {
                position: toast.POSITION.TOP_RIGHT
            });
        } else {
            toast.error("Cập nhật thông tin mức lương thất bại ! Hãy thử lại sau", {
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
                        <h4 className="card-title">{ !id ? 'Thêm mới mức lương' : 'Cập nhật mức lương'}</h4>
                        <br/>
                        <form className="form-sample">
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="form-group row">
                                        <label className="col-sm-3 col-form-label">
                                            <strong style={{ fontSize: "15px" }}>
                                                Tên mức lương:
                                            </strong>
                                        </label>
                                        <div className="col-sm-7">
                                            <input
                                                className="form-control"
                                                type="text"
                                                name="name"
                                                value={name}
                                                maxLength={50}
                                                onChange={(event) => setName(event.target.value)}
                                                ref={firstInput}
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

export default SalaryManagement
