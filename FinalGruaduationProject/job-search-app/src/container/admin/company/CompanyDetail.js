import React, { useEffect, useState } from 'react'
import { useParams } from "react-router-dom";
import Converter from "../../../util/Converter";
import { toast, ToastContainer } from 'react-toastify';
import { getAdminCompanyDetail, getCompanyDetailFile } from "../../../service/CompanyService";

const CompanyDetail = () => {
    const [company, setCompany] = useState({})
    const [nations, setNations] = useState("")
    const [file, setFile] = useState({})
    const { id } = useParams();

    const getData = async () => {
        let countries = await import("../../../countries.json")
        const companyDetail = await getAdminCompanyDetail(id)

        setNations(Object.keys(countries).map((index) => countries[index].name))

        if (companyDetail && companyDetail.status === 200) {
            setCompany(companyDetail.data)
            const fileDetail = await getCompanyDetailFile({
                role: 1,
                id: companyDetail.data.File,
                userId: companyDetail.data.UserId
            })

            if (fileDetail && fileDetail.status === 200) {
                setFile(fileDetail.data)
            } else {
                toast.error("Lấy thông tin tệp xác thực công ty thất bại ! Hãy thử lại sau", {
                    position: toast.POSITION.TOP_RIGHT
                })
            }
        } else {
            toast.error("Lấy thông tin công ty thất bại ! Hãy thử lại sau", {
                position: toast.POSITION.TOP_RIGHT
            });
        }
    }

    const previewFile = async () => {
        if(file.File) {
            const preview = Converter.getFile(file.File, file.Name)[0]
            const blobUrl = URL.createObjectURL(preview);
            const anchorElement = document.createElement("a");
            anchorElement.href = blobUrl;
            anchorElement.target = "_blank";
            anchorElement.click();
            URL.revokeObjectURL(blobUrl);
        } else {
            toast.error("Không có tệp nào để xem trước", {
                position: toast.POSITION.TOP_RIGHT
            });
        }
    }

    const downloadFile = async () => {
        if(file.File) {
            const linkSource = `data:application/pdf;base64,${file.File}`;
            const downloadLink = document.createElement("a");
            downloadLink.href = linkSource;
            downloadLink.download = file.Name;
            downloadLink.click();
        } else {
            toast.error("Không có tệp nào để tải xuống", {
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
                        <h4 className="card-title">Thông tin công ty</h4>
                        <br/>
                        <form className="form-sample">
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="form-group row">
                                        <label className="col-sm-12 col-form-label">
                                            <strong style={{ fontSize: "15px" }}>
                                                Ảnh bìa:
                                            </strong>
                                        </label>
                                        <div className="col-sm-12">
                                            <img
                                                className="img-responsive cover-img"
                                                style={{ width: "100%", height: "236px" }}
                                                src={company.Cover}
                                                alt="Ảnh bìa"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="form-group row">
                                        <label className="col-sm-12 col-form-label">
                                            <strong style={{ fontSize: "15px" }}>
                                                Logo:
                                            </strong>
                                        </label>
                                        <div className="col-sm-12">
                                            <img
                                                className="img-responsive"
                                                style={{ width: "150px", height: "150px" }}
                                                src={company.Logo}
                                                alt="Logo"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="form-group row">
                                        <label className="col-sm-12 col-form-label">
                                            <strong style={{ fontSize: "15px" }}>
                                                Tên công ty:
                                            </strong>
                                        </label>
                                        <div className="col-sm-12">
                                            <label
                                                className="form-control">
                                                {company.Name}
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="form-group row">
                                        <label className="col-sm-12 col-form-label">
                                            <strong style={{ fontSize: "15px" }}>
                                                Địa chỉ:
                                            </strong>
                                        </label>
                                        <div className="col-sm-12">
                                            <label
                                                className="form-control">
                                                {company.Address}
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="form-group row">
                                        <label className="col-sm-12 col-form-label">
                                            <strong style={{ fontSize: "15px" }}>
                                                Quốc gia:
                                            </strong>
                                        </label>
                                        <div className="col-sm-12">
                                            <label
                                                className="form-control">
                                                {nations[company.Nation]}
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-12">
                                    <div className="form-group row">
                                        <label className="col-sm-12 col-form-label">
                                            <strong style={{ fontSize: "15px" }}>
                                                Lĩnh vực:
                                            </strong>
                                        </label>
                                        <div className="col-sm-12" >
                                            <label
                                                className="form-control">
                                                {company.Field}
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="form-group row">
                                        <label className="col-sm-12 col-form-label">
                                            <strong style={{ fontSize: "15px" }}>
                                                Email:
                                            </strong>
                                        </label>
                                        <div className="col-sm-12">
                                            <label
                                                className="form-control">
                                                {company.Email}
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="form-group row">
                                        <label className="col-sm-12 col-form-label">
                                            <strong style={{ fontSize: "15px" }}>
                                                Mô tả:
                                            </strong>
                                        </label>
                                        <div className="col-sm-12">
                                            <label
                                                className="form-control"
                                                style={{ height: "fit-content", whiteSpace: "pre-wrap" }}
                                            >
                                                {company.Description}
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="form-group row">
                                        <label className="col-sm-12 col-form-label">
                                            <strong style={{ fontSize: "15px" }}>
                                                Số lượng nhân viên:
                                            </strong>
                                        </label>
                                        <div className="col-sm-12">
                                            <label
                                                className="form-control">
                                                {company.EmployeeAmount}
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="form-group row">
                                        <label className="col-sm-12 col-form-label">
                                            <strong style={{ fontSize: "15px" }}>
                                                Trang web:
                                            </strong>
                                        </label>
                                        <div className="col-sm-12">
                                            <label
                                                className="form-control">
                                                {company.Website}
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="form-group row">
                                        <label className="col-sm-12 col-form-label">
                                            <strong style={{ fontSize: "15px" }}>
                                                Hồ sơ xác thực:
                                            </strong>
                                        </label>
                                        <div className="col-sm-12">
                                            <label
                                                className="form-control">
                                                {file.Name}
                                                <button
                                                    style={{
                                                        marginLeft: "5px",
                                                        float: "right",
                                                        textAlign: "center",
                                                        border: "1px solid #1F1F1F",
                                                        borderRadius: "4px",
                                                        height: "25px",
                                                        fontSize: "13px",
                                                        color: "#1F1F1F",
                                                        backgroundColor: "#dcdedd",
                                                        cursor: "pointer"
                                                    }}
                                                    type="button"
                                                    onClick={() => downloadFile()}
                                                >
                                                    <i className="fa fa-download"/>
                                                    &nbsp;Tải xuống
                                                </button>
                                                <button
                                                    style={{
                                                        float: "right",
                                                        textAlign: "center",
                                                        border: "1px solid #1F1F1F",
                                                        borderRadius: "4px",
                                                        height: "25px",
                                                        fontSize: "13px",
                                                        color: "#1F1F1F",
                                                        backgroundColor: "#dcdedd",
                                                        cursor: "pointer"
                                                    }}
                                                    type="button"
                                                    onClick={() => previewFile()}
                                                >
                                                    <i className="fa fa-eye"/>
                                                    &nbsp;Xem trước
                                                </button>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="form-group row">
                                        <label className="col-sm-12 col-form-label">
                                            <strong style={{ fontSize: "15px" }}>
                                                Nhà tuyển dụng:
                                            </strong>
                                        </label>
                                        <div className="col-sm-12">
                                            <label
                                                className="form-control">
                                                {company.Recruiter}
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <ToastContainer/>
        </>
    )
}

export default CompanyDetail
