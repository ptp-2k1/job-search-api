import React, { useEffect, useState } from 'react'
import QRCode from 'react-qr-code';
import Converter from "../../../util/Converter";
import { toast, ToastContainer } from 'react-toastify';
import { Modal, ModalHeader, ModalFooter, ModalBody } from 'reactstrap';
import { getUserDetail } from "../../../service/UserService";
import { createPurchasePackage } from "../../../service/PurchasedPackageService";
import './PurchaseConfirmModal.css'

function PurchaseConfirmModal(props) {
    const initialData = {
        lastName: "",
        firstName: "",
        phoneNumber: ""
    }
    const [recruiter, setRecruiter] = useState(initialData)
    const [amount, setAmount] = useState("1")
    const [total, setTotal] = useState("0")
    const [showPaymentInformation, setShowPaymentInformation] = useState(true)
    const [showQrCode, setShowQrCode] = useState(false)
    const [hideConfirm, setHideConfirm] = useState(false)
    const [image, setImage] = useState({
        name: "",
        file: ""
    })

    const getData = async () => {
        const user = await getUserDetail({
            role: 2,
            id: localStorage.getItem("userId")
        })

        if(user && user.status === 200) {
            setRecruiter({
                lastName: user.data.LastName,
                firstName: user.data.FirstName,
                phoneNumber: user.data.PhoneNumber
            })
        } else {
            toast.error("Không thể lấy thông tin khách hàng ngay lúc này ! Hãy thử lại sau", {
                position: toast.POSITION.TOP_RIGHT
            })
        }
        setTotal(String(formatCurrency((props.package.PurchasePostBudget))))
    }

    const handleOnChange = (event) => {
        const value = event.target.value
        setAmount(value)
        setTotal(String(formatCurrency((value * props.package.PurchasePostBudget))))
    };

    const handleOnChangeImage = () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/png, image/jpeg"
        input.style.display = "none";
        input.click();
        input.addEventListener("change", async (event) => {
            const file = event.target.files[0];
            const base64 = await Converter.getBase64(file)
            setImage({
                name: file.name,
                file: String(base64).replace("data:image/png;base64,", "").replace("data:image/jpeg;base64,", "")
            })
        });
    }

    const validate = () => {
        if(!Converter.validate(amount, "empty")) {
            toast.warn("Số lượng mua không được rỗng", {
                position: toast.POSITION.TOP_RIGHT
            });
            return false
        }
        if(amount === "0") {
            toast.warn("Số lượng mua phải lớn hơn 0", {
                position: toast.POSITION.TOP_RIGHT
            });
            return false
        }
        if(Number(amount) > 10) {
            toast.warn("Số lượng mua tối đa là 10", {
                position: toast.POSITION.TOP_RIGHT
            });
            return false
        }
        return true
    }

    const handleProceedPurchase = () => {

        if(!validate()) {
            return
        }

        setShowPaymentInformation(false)
        setShowQrCode(true)
        setHideConfirm(true)
    }

    const handleConfirmPurchase = async () => {

        if(!Converter.validate(image.file, "empty")) {
            toast.warn("Bạn phải tải lên hình ảnh đã chuyển khoản trước khi xác nhận thanh toán !", {
                position: toast.POSITION.TOP_RIGHT
            });
            return false
        }

        const result = await createPurchasePackage({
            packageId: props.package.Id,
            amount: Number(amount),
            fileName: image.name,
            file: image.file,
            id: localStorage.getItem("userId")
        })

        if(result && result.status === 201) {
            handleClose()
            toast.success("Xác nhận thanh toán thành công ! Giao dịch của bạn đã được ghi lại và xin hãy chờ chúng tôi xác nhận, cảm ơn bạn đã chọn dịch vụ mua gói của chúng tôi", {
                position: toast.POSITION.TOP_RIGHT
            });
        } else {
            toast.error("Xác nhận thanh toán thất bại ! Hãy thử lại sau", {
                position: toast.POSITION.TOP_RIGHT
            });
        }
    }

    const handleClose = () => {
        setAmount("1")
        setTotal("0")
        setRecruiter(initialData)
        setShowPaymentInformation(true)
        setShowQrCode(false)
        setHideConfirm(false)
        setImage({
            name: "",
            file: ""
        })
        props.onHide()
    }

    const formatCurrency = (price) => {
        return new Intl.NumberFormat('en-DE').format(price)
    }

    useEffect(() => {
        getData()
    }, [props.isOpen])


    return (
        <div>
            <Modal isOpen={props.isOpen} className={'booking-modal-container'} size="md" centered >
                <ModalHeader style={{ backgroundColor: "#a89bc2" }}>
                   <strong style={{ color: "#252b60", fontSize: "16px", marginLeft: "112px" }}>
                       THANH TOÁN GÓI DỊCH VỤ
                   </strong>
                </ModalHeader>
                <ModalBody style={{ backgroundColor: "#eaedff" }}>
                    {
                        showPaymentInformation &&
                        (
                            <>
                                <ul className="my font" style={{ display: "flex" }}>
                                    <li style={{ fontSize: "14px" }}>Tên gói:</li>
                                    <li style={{ marginLeft: "10px", fontSize: "16px", lineHeight: "1.6em" }}>
                                        <strong>{props.package.Name}</strong>
                                    </li>
                                </ul>
                                <ul className='my-font' style={{ display: "flex" }}>
                                    <li style={{ fontSize: "14px" }}>Giá gói:</li>
                                    <li style={{ marginLeft: "10px", fontSize: "16px", lineHeight: "1.6em" }}>
                                        <strong>{formatCurrency(props.package.PurchasePostBudget)} vnđ</strong>
                                    </li>
                                </ul>
                                <ul className="my font" style={{ display: "flex" }}>
                                    <li style={{ fontSize: "14px" }}>Họ tên khách hàng:</li>
                                    <li style={{ marginLeft: "10px", fontSize: "16px", lineHeight: "1.6em" }}>
                                        <strong>{recruiter.lastName + " " + recruiter.firstName}</strong>
                                    </li>
                                </ul>
                                <ul className="my font" style={{ display: "flex" }}>
                                    <li style={{ fontSize: "14px" }}>Số điện thoại:</li>
                                    <li style={{ marginLeft: "10px", fontSize: "16px", lineHeight: "1.6em" }}>
                                        <strong>{recruiter.phoneNumber}</strong>
                                    </li>
                                </ul>
                                <ul className='my-font' style={{ display: "flex" }}>
                                    <li style={{ fontSize: "14px" }}>Tổng giá tiền thanh toán:</li>
                                    <li style={{ marginLeft: "10px", fontSize: "16px", lineHeight: "1.6em" }}>
                                        <strong>{total} vnđ</strong>
                                    </li>
                                </ul>
                                <ul className="my font" style={{ display: "flex", marginLeft: "auto", marginRight: "0px" }}>
                                    <li style={{ fontSize: "14px" }}>Số lượng mua (tối đa 10 gói 1 lần):</li>
                                    <li style={{ marginLeft: "10px", fontSize: "16px", lineHeight: "1.6em" }}>
                                        <input
                                            style={{ width: "50px", border: "1px solid black" }}
                                            type="text"
                                            name="amount"
                                            value={amount}
                                            maxLength={2}
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
                                    </li>
                                </ul>
                            </>
                        )
                    }
                    {
                        showQrCode &&
                        (
                            <div className="text-center">
                                <ul className='my-font' style={{ display: "inline-block" }}>
                                    <li style={{ fontSize: "14px" }}>
                                        Hãy thanh toán cho chúng tôi qua momo bằng cách quét mã QR và nhập nội dung chuyển khoản trên momo theo đúng như bên dưới:
                                        <p style={{ fontSize: "15px", color: "firebrick" }}>
                                            <strong>
                                                ({recruiter.phoneNumber} - {props.package.Name} - {amount} - {new Date().toLocaleDateString()})
                                            </strong>
                                        </p>
                                        Sau khi đã quét mã QR và chuyển khoản thành công thì bạn phải tải lên hình ảnh xác nhận đã chuyển khoản trên momo và nhấn nút xác nhận thanh toán để hoàn thành giao dịch.
                                    </li>
                                </ul>
                                <QRCode
                                    value={"2|99|0933511609|Phung Tin Phong||0|0|0||transfer_myqr"}
                                    size={100}
                                />
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
                                    onClick={() => handleOnChangeImage()}
                                >
                                    <i className="fa fa-upload"/>
                                    &nbsp;
                                    { image.name ? image.name : "Tải lên hình ảnh chuyển khoản" }
                                </div>
                            </div>
                        )
                    }
                </ModalBody>
                <ModalFooter style={{ justifyContent: 'space-between' }}>
                    <button
                        style={{
                            marginLeft: "0px",
                            marginRight: "auto",
                            width: "230px",
                            textAlign: "center",
                            border: "1px solid #1F1F1F",
                            borderRadius: "4px",
                            height: "32px",
                            fontSize: "16px",
                            lineHeight: "2",
                            color: "#1F1F1F",
                            backgroundColor: "mediumpurple",
                            cursor: "pointer",
                        }}
                        hidden={hideConfirm}
                        onClick={() => handleProceedPurchase()}
                    >
                        <i className="fa fa-cart-plus"/>
                        &nbsp;
                        Tiến hành thanh toán
                    </button>
                    <button
                        style={{
                            marginLeft: "0px",
                            marginRight: "auto",
                            width: "230px",
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
                        hidden={!hideConfirm}
                        onClick={() => handleConfirmPurchase()}
                    >
                        <i className="fa fa-check"/>
                        &nbsp;
                        Xác nhận thanh toán
                    </button>
                    <button
                        style={{
                            marginLeft: "auto",
                            marginRight: "0px",
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
                        onClick={() => handleClose()}
                    >
                        <i className="fa fa-close"/>
                        &nbsp;
                        Thoát
                    </button>
                </ModalFooter>
            </Modal>
            <ToastContainer/>
        </div>
    );
}

export default PurchaseConfirmModal;