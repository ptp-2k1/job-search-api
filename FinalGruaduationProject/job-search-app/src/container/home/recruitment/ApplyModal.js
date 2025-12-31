import React, { useEffect, useState } from 'react';
import Converter from "../../../util/Converter";
import { toast, ToastContainer } from 'react-toastify';
import { Modal, ModalHeader, ModalFooter, ModalBody } from 'reactstrap';
import { uploadCv } from "../../../service/ApplyJobsService";
import './ApplyModal.css'

function ApplyModal(props) {
    const [application, setApplication] = useState({
        selfIntroduction: "",
        file: {
            name: "",
            base64: ""
        }
    })

    const handleOnChange = (event) => {
        const { name, value } = event.target
        setApplication({
            ...application,
            [name]: value
        })
    }

    const handleOnChangeFile = () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".pdf"
        input.style.display = "none";
        input.click();
        input.addEventListener("change", async (event) => {
            const file = event.target.files[0];
            const base64 = await Converter.getBase64(file)
            setApplication({
                ...application,
                file: {
                    name: file.name,
                    base64: String(base64).replace("data:application/pdf;base64,", "")
                }
            })
        });
    }

    const handleSendCv = async () => {
        if(application.file.base64) {
            const result = await uploadCv({
                userId: localStorage.getItem("userId"),
                postId: props.postId,
                name: application.file.name,
                file: application.file.base64,
                selfIntroduction: application.selfIntroduction
            })

            if(result && result.status === 201) {
                props.onHide()
                toast.success("Ứng tuyển thành công ! Nhà tuyển dụng sẽ sớm nhìn thấy cv của bạn", {
                    position: toast.POSITION.TOP_RIGHT
                });
            } else {
                toast.error("Ứng tuyển thất bại ! Hãy thử lại sau", {
                    position: toast.POSITION.TOP_RIGHT
                });
            }
        } else {
            toast.warn("Bạn chưa tải lên cv ứng tuyển của mình !", {
                position: toast.POSITION.TOP_RIGHT
            });
        }
    }

    useEffect(() => {}, [])

    return (
        <div>
            <Modal isOpen={props.isOpen} className={'booking-modal-container'} size="md" centered >
                <ModalHeader style={{ backgroundColor: "#a89bc2" }}>
                   <strong style={{ color: "#252b60", fontSize: "16px", marginLeft: "10px" }}>
                       NỘP CV CHO NHÀ TUYỂN DỤNG ĐỂ ỨNG TUYỂN NGAY
                   </strong>
                </ModalHeader>
                <ModalBody style={{ backgroundColor: "#eaedff" }}>
                    <strong>Thư giới thiệu bản thân</strong>
                    <div>
                        <textarea
                            className="mt-2"
                            style={{ width: "100%", padding: "5px", border: "1px solid #1F1F1F" }}
                            name="selfIntroduction"
                            placeholder="Giới thiệu ngắn gọn về bản thân và nêu rõ mong muốn, lý do làm việc tại công ty này. Đây là cách gây ấn tượng với nhà tuyển dụng nếu bạn chưa có kinh nghiệm làm việc hoặc CV chưa tốt"
                            rows="5"
                            onChange={(event) => handleOnChange(event)}
                        >
                            {application.selfIntroduction}
                        </textarea>
                        <div
                            style={{
                                textAlign: "center",
                                border: "1px solid #1F1F1F",
                                borderRadius: "4px",
                                height: "32px",
                                fontSize: "16px",
                                lineHeight: "2",
                                color: "#1F1F1F",
                                backgroundColor: "#dcdedd",
                                marginTop: "15px",
                                marginBottom: "-17px",
                                cursor: "pointer"
                            }}
                            onClick={() => handleOnChangeFile()}
                        >
                            <i className="fa fa-upload"/>
                            &nbsp;
                            { application.file.name ? application.file.name : "Tải lên CV của bạn" }
                        </div>
                    </div>
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
                            cursor: "pointer"
                        }}
                         onClick={() => handleSendCv()}>
                        <i className="fa fa-save"/>
                        &nbsp;
                        Nộp
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
                         onClick={() => {
                             setApplication({
                                 ...application
                             })
                             props.onHide()
                         }}>
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

export default ApplyModal;