import React, { useState, useEffect, useRef } from 'react'
import { toast, ToastContainer } from 'react-toastify';
import { useParams } from "react-router-dom";
import { checkDuplicateName, createTitle, getTitleDetail, updateTitle } from "../../../service/TitleService";
import Converter from "../../../util/Converter";

const TitleManagement = () => {

    const { id } = useParams()
    const [name, setName] = useState("")
    const nameInput = useRef()

    const getData = async () => {
        const name = await getTitleDetail({
            id: id
        })

        if(name && name.status === 200) {
            setName(name.data.Name)
        } else {
            toast.error("Không thể lấy thông tin chức danh ngay lúc này ! Hãy thử lại sau", {
                position: toast.POSITION.TOP_RIGHT
            });
        }
    }

    const validate = async (id) => {
        if(!Converter.validate(name, "empty")) {
            toast.warn("Tên chức danh không được rỗng", {
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
                toast.warn("Tên chức danh này đã tồn tại", {
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

        const result = await createTitle({
            name: name,
            userId: localStorage.getItem("userId")
        })

        if(result && result.status === 201) {
            toast.success("Thêm chức danh thành công", {
                position: toast.POSITION.TOP_RIGHT
            });
            setName("")
            nameInput.current.focus()
        } else {
            toast.error("Thêm chức danh thất bại ! Hãy thử lại sau", {
                position: toast.POSITION.TOP_RIGHT
            });
        }
    }

    let handleUpdate = async () => {
        if(! await validate(id)) {
            return
        }

        const result = await updateTitle({
            name: name,
            id: id
        })

        if(result && result.status === 200) {
            toast.success("Cập nhật thông tin chức danh thành công", {
                position: toast.POSITION.TOP_RIGHT
            });
        } else {
            toast.error("Cập nhật thông tin chức danh thất bại ! Hãy thử lại sau", {
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
                        <h4 className="card-title">{ !id ? 'Thêm mới chức danh' : 'Cập nhật chức danh'}</h4>
                        <br/>
                        <form className="form-sample">
                            <div className="row">
                                <div className="col-md-8">
                                    <div className="form-group row">
                                        <label className="col-sm-4 col-form-label">
                                            <strong style={{ fontSize: "15px" }}>
                                                Tên chức danh:
                                            </strong>
                                        </label>
                                        <div className="col-sm-9">
                                            <input
                                                className="form-control"
                                                type="text"
                                                name="name"
                                                value={name}
                                                maxLength={50}
                                                onChange={(event) => setName(event.target.value)}
                                                ref={nameInput}
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

export default TitleManagement
