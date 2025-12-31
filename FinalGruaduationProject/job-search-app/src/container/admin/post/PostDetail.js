import React, { useEffect, useState } from 'react'
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import { getPostDetail } from "../../../service/PostService";
import { getBranchRecruitmentDetail } from "../../../service/BranchRecruitmentService";
import { getAreaRecruitmentDetail } from "../../../service/AreaRecruitmentService";

const PostDetail = () => {
    const [post, setPost] = useState({})
    const [branchRecruitments, setBranchRecruitments] = useState([])
    const [areaRecruitments, setAreaRecruitments] = useState([])
    const { id } = useParams();

    const getData = async () => {
        const postDetail = await getPostDetail(id)
        const branchRecruitmentDetail = await getBranchRecruitmentDetail(id)
        const areaRecruitmentDetail = await getAreaRecruitmentDetail(id)

        if(postDetail && postDetail.status === 200) {
            setPost(postDetail.data)
        } else {
            toast.error("Không thể lấy thông tin bài đăng tuyển ngay lúc này ! Hãy thử lại sau", {
                position: toast.POSITION.TOP_RIGHT
            });
        }

        if(branchRecruitmentDetail && branchRecruitmentDetail.status === 200) {
            setBranchRecruitments(branchRecruitmentDetail.data)
        } else {
            toast.error("Không thể lấy danh sách ngành nghề tuyển dụng ngay lúc này ! Hãy thử lại sau", {
                position: toast.POSITION.TOP_RIGHT
            });
        }

        if (areaRecruitmentDetail && areaRecruitmentDetail.status === 200) {
            setAreaRecruitments(areaRecruitmentDetail.data)
        } else {
            toast.error("Không thể lấy danh sách khu vực tuyển dụng ngay lúc này ! Hãy thử lại sau", {
                position: toast.POSITION.TOP_RIGHT
            });
        }
    }

    const formatDate = (date) => {
        if(date) {
            let dateRaw = date.substring(0, 10).split("-");
            return dateRaw[2] + "/" + dateRaw[1] + "/" + dateRaw[0];
        }
    }

    const formatDateTime = (dateTime) => {
        if(dateTime) {
            let dateRaw = dateTime.substring(0, 10).split("-");
            let dateTimeRaw = dateTime.substring(11, 19);
            return dateRaw[2] + "/" + dateRaw[1] + "/" + dateRaw[0] + " - " + dateTimeRaw;
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
                        <h4 className="card-title">Thông tin bài tuyển dụng</h4>
                        <br/>
                        <form className="form-sample">
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
                                                {post.CompanyName}
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
                                                {post.Recruiter}
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
                                                Tiêu đề:
                                            </strong>
                                        </label>
                                        <div className="col-sm-12">
                                            <label
                                                className="form-control">
                                                {post.Title}
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-group row">
                                        <label className="col-sm-5 col-form-label">
                                            <strong style={{ fontSize: "15px" }}>
                                                Mức lương:
                                            </strong>
                                        </label>
                                        <div className="col-sm-7">
                                            <label
                                                className="form-control">
                                                {post.SalaryName}
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group row">
                                        <label className="col-sm-5 col-form-label">
                                            <strong style={{ fontSize: "15px" }}>
                                                Kinh nghiệm:
                                            </strong>
                                        </label>
                                        <div className="col-sm-7" >
                                            <label
                                                className="form-control">
                                                {post.ExperienceName}
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-group row">
                                        <label className="col-sm-5 col-form-label">
                                            <strong style={{ fontSize: "15px" }}>
                                                Số lượng tuyển:
                                            </strong>
                                        </label>
                                        <div className="col-sm-7" >
                                            <label
                                                className="form-control">
                                                {post.RecruitAmount}
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group row">
                                        <label className="col-sm-5 col-form-label">
                                            <strong style={{ fontSize: "15px" }}>
                                                Học vấn:
                                            </strong>
                                            </label>
                                        <div className="col-sm-7">
                                            <label
                                                className="form-control">
                                                {post.EducationName}
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-group row">
                                        <label className="col-sm-5 col-form-label">
                                            <strong style={{ fontSize: "15px" }}>
                                                Chức danh:
                                            </strong>
                                        </label>
                                        <div className="col-sm-7" >
                                            <label
                                                className="form-control">
                                                {post.TitleName}
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group row">
                                        <label className="col-sm-5 col-form-label">
                                            <strong style={{ fontSize: "15px" }}>
                                                Loại hình công việc:
                                            </strong>
                                        </label>
                                        <div className="col-sm-7" >
                                            <label
                                                className="form-control">
                                                {post.WorkTypeName}
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
                                                Ngành nghề tuyển dụng:
                                            </strong>
                                        </label>
                                        <div className="col-sm-12" >
                                            <label
                                                className="form-control"
                                                style={{ height: "fit-content" }}
                                            >
                                                {branchRecruitments && branchRecruitments.length > 0
                                                    && branchRecruitments.map((item, index) => {
                                                    return index < branchRecruitments.length-1 ?
                                                        ( item.Name + ", " ) : ( item.Name )
                                                })}
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-12">
                                    <div className="form-group row">
                                        <label className="col-sm-12 col-form-label">
                                            <strong style={{ fontSize: "15px" }}>
                                                Khu vực tuyển dụng:
                                            </strong>
                                        </label>
                                        <div className="col-sm-12" >
                                            <label
                                                className="form-control"
                                                style={{ height: "fit-content" }}
                                            >
                                                {areaRecruitments && areaRecruitments.length > 0
                                                && areaRecruitments.map((item, index) => {
                                                    return index < areaRecruitments.length-1 ?
                                                        ( item.Name + ", " ) : ( item.Name )
                                                })
                                                }
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
                                                Chi tiết tuyển dụng:
                                            </strong>
                                        </label>
                                        <div className="col-sm-12">
                                            <label
                                                className="form-control"
                                                style={{ height: "fit-content", whiteSpace: "pre-wrap" }}
                                            >
                                                {post.RecruitDetail}
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
                                                Yêu cầu ứng viên:
                                            </strong>
                                        </label>
                                        <div className="col-sm-12">
                                            <label
                                                className="form-control"
                                                style={{ height: "fit-content", whiteSpace: "pre-wrap" }}
                                            >
                                                {post.Requirement}
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
                                                Quyền lợi:
                                            </strong>
                                        </label>
                                        <div className="col-sm-12">
                                            <label
                                                className="form-control"
                                                style={{ height: "fit-content", whiteSpace: "pre-wrap" }}
                                            >
                                                {post.Right}
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
                                                Địa điểm làm việc:
                                            </strong>
                                        </label>
                                        <div className="col-sm-12">
                                            <label
                                                className="form-control"
                                                style={{ height: "fit-content", whiteSpace: "pre-wrap" }}
                                            >
                                                {post.Address}
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-group row">
                                        <label className="col-sm-5 col-form-label">
                                            <strong style={{ fontSize: "15px" }}>
                                                Hạn ứng tuyển:
                                            </strong>
                                        </label>
                                        <div className="col-sm-7" >
                                            <label
                                                className="form-control">
                                                {formatDate(post.ApplyEndDate)}
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group row">
                                        <label className="col-sm-5 col-form-label">
                                            <strong style={{ fontSize: "15px" }}>
                                                Ngày đăng:
                                            </strong>
                                        </label>
                                        <div className="col-sm-7" >
                                            <label
                                                className="form-control">
                                                {formatDate(post.UploadDate)}
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-group row">
                                        <label className="col-sm-5 col-form-label">
                                            <strong style={{ fontSize: "15px" }}>
                                                Ngày hết hạn:
                                            </strong>
                                        </label>
                                        <div className="col-sm-7" >
                                            <label
                                                className="form-control">
                                                {formatDate(post.ExpiredDate)}
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group row">
                                        <label className="col-sm-5 col-form-label">
                                            <strong style={{ fontSize: "15px" }}>
                                                Thời gian cập nhật:
                                            </strong>
                                        </label>
                                        <div className="col-sm-7" >
                                            <label
                                                className="form-control">
                                                {formatDateTime(post.UpdateAt)}
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-group row">
                                        <label className="col-sm-5 col-form-label">
                                            <strong style={{ fontSize: "15px" }}>
                                                Mức độ ưu tiên:
                                            </strong>
                                        </label>
                                        <div className="col-sm-7" >
                                            <label
                                                className="form-control">
                                                {post.PostPriorityName}
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group row">
                                        <label className="col-sm-5 col-form-label">
                                            <strong style={{ fontSize: "15px" }}>
                                                Trạng thái:
                                            </strong>
                                        </label>
                                        <div className="col-sm-7" >
                                            <label
                                                className="form-control">
                                                {post.Status === 1 ? "Đang hiện" : "Đang ẩn"}
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

export default PostDetail
