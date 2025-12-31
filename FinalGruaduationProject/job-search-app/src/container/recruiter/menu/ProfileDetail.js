import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import Converter from "../../../util/Converter";
import { toast, ToastContainer } from "react-toastify";
import { viewProfile } from "../../../service/JobProfileService";
import { getLatest } from "../../../service/CandidateCvService";

const ProfileDetail = () => {
    const initialData = {
        name: "",
        base64: "",
        object: null
    }
    const [profile, setProfile] = useState({})
    const [file, setFile] = useState(initialData)
    const navigate = useNavigate()
    const { id } = useParams();

    const getData = async () => {
        const profileDetail = await viewProfile({
            id: id
        })

        if(profileDetail && profileDetail.status === 200) {
            setProfile(profileDetail.data)

            const fileResult = await getLatest({
                role: 2,
                id: profileDetail.data.UserId
            })

            setFile({
                name: fileResult.data !== null ? fileResult.data.Name : "",
                base64: fileResult.data !== null ? fileResult.data.File: "",
                object: fileResult.data !== null ? Converter.getFile(fileResult.data.File, fileResult.data.Name) : null
            })

        } else {
            toast.error("Không thể lấy thông tin hồ sơ tìm việc của ứng viên ngay lúc này ! Hãy thử lại sau", {
                position: toast.POSITION.TOP_RIGHT
            })
        }
    }

    const previewFile = () => {
        if(file.object) {
            const blobUrl = URL.createObjectURL(file.object[0]);
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
        if(file.base64) {
            const linkSource = `data:application/pdf;base64,${file.base64}`;
            const downloadLink = document.createElement("a");
            downloadLink.href = linkSource;
            downloadLink.download = file.name;
            downloadLink.click();
        } else {
            toast.error("Không có tệp nào để tải xuống", {
                position: toast.POSITION.TOP_RIGHT
            });
        }
    }

    useEffect(() => {
        getData();
    }, [])

    return (
        <>
            <div onClick={() => navigate(-1)}
                 style={{ cursor: "pointer", margin: "10px 30px -10px", textAlign: "left"}}>
                <i className="fa-solid fa-arrow-left mr-2"/>
                Quay lại
            </div>
            <div className="col-12 mt-20 mb-35 grid-margin">
                <div className="card" style={{ backgroundColor: "#eaedff"}}>
                    <div className="card-body">
                        <h4 className="card-title">
                            Hồ sơ của ứng viên
                        </h4>
                        <br/>
                        <form className="form-sample">
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-group row">
                                        <label className="col-sm-4 col-form-label">
                                            <strong style={{ fontSize: "15px" }}>
                                                Ngành nghề:
                                            </strong>
                                        </label>
                                        <div className="col-sm-8">
                                            <label className="form-control">
                                                {profile.Branch}
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group row">
                                        <label className="col-sm-4 col-form-label">
                                            <strong style={{ fontSize: "15px" }}>
                                                Học vấn:
                                            </strong>
                                        </label>
                                        <div className="col-sm-8">
                                            <label className="form-control">
                                                {profile.Education}
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-group row">
                                        <label className="col-sm-4 col-form-label">
                                            <strong style={{ fontSize: "15px" }}>
                                                Cấp bậc:
                                            </strong>
                                        </label>
                                        <div className="col-sm-8">
                                            <label className="form-control">
                                                {profile.Title}
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group row">
                                        <label className="col-sm-4 col-form-label">
                                            <strong style={{ fontSize: "15px" }}>
                                                Loại hình công việc:
                                            </strong>
                                        </label>
                                        <div className="col-sm-8">
                                            <label className="form-control">
                                                {profile.WorkType}
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-group row">
                                        <label className="col-sm-4 col-form-label">
                                            <strong style={{ fontSize: "15px" }}>
                                                Mức lương:
                                            </strong>
                                        </label>
                                        <div className="col-sm-8">
                                            <label className="form-control">
                                                {profile.Salary}
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group row">
                                        <label className="col-sm-4 col-form-label">
                                            <strong style={{ fontSize: "15px" }}>
                                                Kinh nghiệm:
                                            </strong>
                                        </label>
                                        <div className="col-sm-8">
                                            <label className="form-control">
                                                {profile.Experience}
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-group row">
                                        <label className="col-sm-4 col-form-label">
                                            <strong style={{ fontSize: "15px" }}>
                                                Cv của ứng viên:
                                            </strong>
                                        </label>
                                        <div className="col-sm-5">
                                            <label className="form-control">
                                                {file.name}
                                            </label>
                                        </div>
                                        <label className="col-sm-3">
                                            <button
                                                style={{
                                                    float: "right",
                                                    textAlign: "center",
                                                    border: "none",
                                                    height: "25px",
                                                    fontSize: "13px",
                                                    color: "#1F1F1F",
                                                    backgroundColor: "transparent",
                                                    cursor: "pointer"
                                                }}
                                                type="button"
                                                onClick={() => previewFile()}
                                            >
                                                <i className="fa fa-eye"/>
                                                &nbsp;Xem trước
                                            </button>
                                            <button
                                                style={{
                                                    float: "right",
                                                    textAlign: "center",
                                                    border: "none",
                                                    height: "25px",
                                                    fontSize: "13px",
                                                    color: "#1F1F1F",
                                                    backgroundColor: "transparent",
                                                    cursor: "pointer"
                                                }}
                                                type="button"
                                                onClick={() => downloadFile()}
                                            >
                                                <i className="fa fa-download"/>
                                                &nbsp;Tải xuống
                                            </button>
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="form-group row">
                                        <label className="col-sm-12 col-form-label">
                                            <strong style={{ fontSize: "15px" }}>
                                                Mô tả kỹ năng:
                                            </strong>
                                        </label>
                                        <div className="col-sm-12">
                                            <label
                                                className="form-control"
                                                style={{ height: "fit-content", whiteSpace: "pre-wrap" }}
                                            >
                                                {profile.SkillDescription}
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
                                                Mong muốn về công việc:
                                            </strong>
                                        </label>
                                        <div className="col-sm-12">
                                            <label
                                                className="form-control"
                                                style={{ height: "fit-content", whiteSpace: "pre-wrap" }}
                                            >
                                                {profile.JobWish}
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

export default ProfileDetail
