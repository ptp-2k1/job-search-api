import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from "react-toastify";
import { Modal, ModalHeader, ModalFooter, ModalBody } from 'reactstrap';
import { assignAuthorizationRoles } from "../../../service/AuthorizationService";
import './AuthorizingModal.css'

function AuthorizingModal(props) {
    const [roles, setRoles] = useState([])
    const [change, setChange] = useState(false)

    const handleOnChange = (event, index) => {
        const { checked } = event.target
        const roleList = roles
        roleList[index] = checked
        setRoles(roleList)
        setChange(!change)
    }

    const handleSaveRoles = async () => {
        const finalRoles = roles.map((value, index) => [index+1, value]).
            filter(value => value[1] !== false).map(value => value[0])

        const result = await assignAuthorizationRoles({
            id: props.userId,
            roleList: finalRoles
        })

        if(result && result.status === 200) {
            toast.success("Phân quyền thành công", {
                position: toast.POSITION.TOP_RIGHT
            });
        } else {
            toast.error("Phân quyền thất bại ! Hãy thử lại sau", {
                position: toast.POSITION.TOP_RIGHT
            });
        }

        props.onHide()
    }

    useEffect(() => {
        setRoles(props.roles)
    }, [props.activeModal])

    useEffect(() => {}, [change])

    return (
        <div>
            <Modal isOpen={props.activeModal} className={'booking-modal-container'} size="md" centered >
                <ModalHeader style={{ backgroundColor: "#a89bc2" }}>
                   <strong style={{ color: "#252b60", fontSize: "16px", marginLeft: "100px" }}>
                       PHÂN QUYỀN CHO NHÂN VIÊN
                   </strong>
                </ModalHeader>
                <ModalBody style={{ backgroundColor: "#eaedff" }}>
                    <strong>Lựa chọn các danh mục mà nhân viên được phép truy cập</strong>
                    <div className="row mt-2 mr-18">
                        {props.pageLayouts && props.pageLayouts.length > 0 &&
                        props.pageLayouts.map((item, index) => {
                            return (
                                <div className="checkbox text-left ml-4 col-lg-5">
                                    <label
                                        key={index}
                                        className="form-check-label text-nowrap"
                                        style={{ fontSize: "14px" }}
                                    >
                                        <input
                                            className="form-check-input"
                                            style={{cursor: "pointer"}}
                                            type="checkbox"
                                            name={item.Name}
                                            value={item.Id}
                                            checked={roles[index]}
                                            onChange={(event) => handleOnChange(event, index)}
                                        />
                                        {item.Name}
                                    </label>
                                </div>
                            )
                        })}
                    </div>
                    {
                        (!props.pageLayouts || props.pageLayouts && props.pageLayouts.length === 0) &&
                        (
                            <div style={{ textAlign: 'center', marginTop: "20px" }}>
                                Không có dữ liệu
                            </div>
                        )
                    }
                </ModalBody>
                <ModalFooter style={{ justifyContent: 'space-between' }}>
                    <div style={{
                            width: "100px",
                            textAlign: "center",
                            border: "1px solid #1F1F1F",
                            borderRadius: "4px",
                            height: "32px",
                            fontSize: "16px",
                            lineHeight: "2",
                            color: "#1F1F1F",
                            backgroundColor: "lightgreen",
                            cursor: "pointer",
                        }}
                         onClick={() => handleSaveRoles()}
                    >
                        <i className="fa fa-database"/>
                        &nbsp;
                        Lưu
                    </div>
                    <div style={{
                            width: "100px",
                            textAlign: "center",
                            border: "1px solid #1F1F1F",
                            borderRadius: "4px",
                            height: "32px",
                            fontSize: "16px",
                            lineHeight: "2",
                            color: "#1F1F1F",
                            backgroundColor: "red",
                            cursor: "pointer"
                        }}
                         onClick={() => props.onHide()}
                    >
                        <i className="fa fa-close"/>
                        &nbsp;
                        Hủy
                    </div>
                </ModalFooter>
            </Modal>
            <ToastContainer/>
        </div>
    );
}

export default AuthorizingModal;