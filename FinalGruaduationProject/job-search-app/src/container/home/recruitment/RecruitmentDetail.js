import React, { useEffect, useRef, useState } from 'react'
import { Link, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { Modal } from "antd";
import { InfoCircleTwoTone } from "@ant-design/icons";
import { getPostDetail } from "../../../service/PostService";
import { getBranchRecruitmentDetail } from "../../../service/BranchRecruitmentService";
import { getAreaRecruitmentDetail } from "../../../service/AreaRecruitmentService";
import { getAdminCompanyDetail } from "../../../service/CompanyService";
import { checkDuplicate } from "../../../service/ApplyJobsService";
import ApplyModal from './ApplyModal'

const RecruitmentDetail = () => {
    const [recruitment, setRecruitment] = useState({})
    const [branchRecruitments, setBranchRecruitments] = useState([])
    const [areaRecruitments, setAreaRecruitments] = useState([])
    const [company, setCompany] = useState([])
    const [activeModal, setActiveModal] = useState(false)
    const recruiterIdStatus = useRef(false);
    const { id } = useParams();

    const getRecruitmentData = async () => {
        const recruitmentDetail = await getPostDetail(id)
        const branchRecruitmentDetail = await getBranchRecruitmentDetail(id)
        const areaRecruitmentDetail = await getAreaRecruitmentDetail(id)

        if(recruitmentDetail && recruitmentDetail.status === 200) {
            setRecruitment(recruitmentDetail.data)
            recruiterIdStatus.current = true
        } else {
            toast.error("Không thể lấy thông tin bài đăng tuyển ngay lúc này ! Hãy thử lại sau", {
                position: toast.POSITION.TOP_RIGHT
            })
        }

        if(branchRecruitmentDetail && branchRecruitmentDetail.status === 200) {
            setBranchRecruitments(branchRecruitmentDetail.data)
        }

        if(areaRecruitmentDetail && areaRecruitmentDetail.status === 200) {
            setAreaRecruitments(areaRecruitmentDetail.data)
        }
    }

    const getCompanyData = async () => {
        const companyDetail = await getAdminCompanyDetail(recruitment.CompanyId)

        if(companyDetail && companyDetail.status === 200) {
            setCompany(companyDetail.data)
        } else {
            toast.error("Không thể lấy thông tin công ty đăng tuyển ngay lúc này ! Hãy thử lại sau", {
                position: toast.POSITION.TOP_RIGHT
            })
        }
    }

    const formatDate = (date) => {
        if(date) {
            let dateRaw = date.substring(0, 10).split("-");
            return dateRaw[2] + "/" + dateRaw[1] + "/" + dateRaw[0];
        }
    }

    useEffect(() => {
        if(id) {
            getRecruitmentData()
        }
        if(recruiterIdStatus.current) {
           getCompanyData()
        }
    }, [recruiterIdStatus.current])

    const handleOpenModal = async () => {
        if(localStorage.getItem("userId") !== null) {
            const userId = localStorage.getItem("userId")
            const result = await checkDuplicate({
                userId: userId,
                postId: id
            })
            if(result && result.status === 200) {
                if(result.data.Result) {
                    Modal.confirm({
                        title: "Bạn đã ứng tuyển việc làm này rồi ! Bạn có muốn xem lại Cv đã nộp không ?",
                        icon: <InfoCircleTwoTone />,
                        onOk() {
                            window.location.href = `/candidate/application-detail/${userId}/${id}`
                        },
                        onCancel() {},
                    });
                } else {
                    setActiveModal(true)
                }
            }
        } else {
            toast.error("Bạn cần đăng nhập trước khi ứng tuyển", {
                position: toast.POSITION.TOP_RIGHT
            });
        }
    }

    return (
        <main>
            <div className="job-post-company">
                <div className="container">
                    <div className="row justify-content-between">
                        <div className="col-xl-8 col-lg-10">
                            <div className="mt-20 mb-10 pl-20 pt-20" style={{ backgroundColor: "#ffffff" }}>
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <h1 style={{
                                        width: "450px",
                                        color: "#263a4d",
                                        display: "-webkit-box",
                                        fontSize: "22px",
                                        fontStyle: "normal",
                                        fontWeight: "800",
                                        letterSpacing: "-.2px",
                                        lineHeight: "28px",
                                        margin: "0",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis"
                                    }}>
                                        {recruitment.Title}
                                    </h1>
                                    <div className="items-link items-link2"
                                         style={{ marginRight: "22px", cursor: "pointer" }}
                                         onClick={() => handleOpenModal()} >
                                        <a className='my-font'>
                                            <i className="fas fa-file"/> Nộp CV
                                        </a>
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className="mt-25 mb-15 col-md-4 col-sm-6" style={{ display:"flex" }}>
                                        <div style={{
                                            marginRight: "10px",
                                            alignItems: "center",
                                            background: "linear-gradient(90deg, #a89bc2, #fb246a)",
                                            borderRadius: "30px",
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: "10px",
                                            height: "40px",
                                            justifyContent: "center",
                                            padding: "10px",
                                            width: "40px"
                                        }}>
                                            <i className="fas fa-dollar"/>
                                        </div>
                                        <div>
                                            <div><strong>Mức lương</strong></div>
                                            <div>{recruitment.SalaryName}</div>
                                        </div>
                                    </div>
                                    <div className="mt-25 mb-15 col-md-4 col-sm-6" style={{ display:"flex" }}>
                                        <div style={{
                                            marginRight: "10px",
                                            alignItems: "center",
                                            background: "linear-gradient(90deg, #a89bc2, #fb246a)",
                                            borderRadius: "30px",
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: "10px",
                                            height: "40px",
                                            justifyContent: "center",
                                            padding: "10px",
                                            width: "40px"
                                        }}>
                                            <i className="fas fa-briefcase"/>
                                        </div>
                                        <div>
                                            <div><strong>Cấp bậc</strong></div>
                                            <div>{recruitment.TitleName}</div>
                                        </div>
                                    </div>
                                    <div className="mt-25 mb-15 col-md-4 col-sm-6" style={{ display:"flex" }}>
                                        <div style={{
                                            marginRight: "10px",
                                            alignItems: "center",
                                            background: "linear-gradient(90deg, #a89bc2, #fb246a)",
                                            borderRadius: "30px",
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: "10px",
                                            height: "40px",
                                            justifyContent: "center",
                                            padding: "10px",
                                            width: "40px"
                                        }}>
                                            <i className="fas fa-edit"/>
                                        </div>
                                        <div>
                                            <div><strong>Loại công việc</strong></div>
                                            <div>{recruitment.WorkTypeName}</div>
                                        </div>
                                    </div>
                                    <div className="mt-25 mb-15 col-md-4 col-sm-6" style={{ display:"flex" }}>
                                        <div style={{
                                            marginRight: "10px",
                                            alignItems: "center",
                                            background: "linear-gradient(90deg, #a89bc2, #fb246a)",
                                            borderRadius: "30px",
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: "10px",
                                            height: "40px",
                                            justifyContent: "center",
                                            padding: "10px",
                                            width: "40px"
                                        }}>
                                            <i className="fas fa-laptop"/>
                                        </div>
                                        <div>
                                            <div><strong>Kinh nghiệm</strong></div>
                                            <div>{recruitment.ExperienceName}</div>
                                        </div>
                                    </div>
                                    <div className="mt-25 mb-15 col-md-4 col-sm-6" style={{ display:"flex" }}>
                                        <div style={{
                                            marginRight: "10px",
                                            alignItems: "center",
                                            background: "linear-gradient(90deg, #a89bc2, #fb246a)",
                                            borderRadius: "30px",
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: "10px",
                                            height: "40px",
                                            justifyContent: "center",
                                            padding: "10px",
                                            width: "40px"
                                        }}>
                                            <i className="fas fa-graduation-cap"/>
                                        </div>
                                        <div>
                                            <div><strong>Học vấn</strong></div>
                                            <div>{recruitment.EducationName}</div>
                                        </div>
                                    </div>
                                    <div className="mt-25 mb-15 col-md-4 col-sm-6" style={{ display:"flex" }}>
                                        <div style={{
                                            marginRight: "10px",
                                            alignItems: "center",
                                            background: "linear-gradient(90deg, #a89bc2, #fb246a)",
                                            borderRadius: "30px",
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: "10px",
                                            height: "40px",
                                            justifyContent: "center",
                                            padding: "10px",
                                            width: "40px"
                                        }}>
                                            <i className="fas fa-users"/>
                                        </div>
                                        <div>
                                            <div><strong>Số lượng tuyển</strong></div>
                                            <div>{recruitment.RecruitAmount}</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-3" style={{ display: "block" }}>
                                    <div style={{
                                        marginBottom: "10px",
                                        alignItems: "center",
                                        background: "#dcdedd",
                                        borderRadius: "4px",
                                        color: "#263a4d",
                                        display: "flex",
                                        fontSize: "14px",
                                        fontStyle: "normal",
                                        fontWeight: "400",
                                        gap: "6px",
                                        letterSpacing: ".14px",
                                        lineHeight: "22px",
                                        padding: "2px 8px 2px 4px",
                                        width: "fit-content",
                                    }}>
                                        <span>
                                            <i className="fa-solid fa-clock"/>
                                        </span>
                                        Hạn nộp hồ sơ: {formatDate(recruitment.ApplyEndDate)}
                                    </div>
                                    <div style={{
                                        marginBottom: "10px",
                                        alignItems: "center",
                                        background: "#dcdedd",
                                        borderRadius: "4px",
                                        color: "#263a4d",
                                        display: "flex",
                                        fontSize: "14px",
                                        fontStyle: "normal",
                                        fontWeight: "400",
                                        gap: "6px",
                                        letterSpacing: ".14px",
                                        lineHeight: "22px",
                                        padding: "2px 8px 2px 4px",
                                        width: "fit-content",
                                    }}>
                                        <span>
                                            <i className="fa-solid fa-calendar"/>
                                        </span>
                                        Ngày đăng: {formatDate(recruitment.UploadDate)}
                                    </div>
                                    <div style={{
                                        marginRight: "15px",
                                        alignItems: "center",
                                        background: "#dcdedd",
                                        borderRadius: "4px",
                                        color: "#263a4d",
                                        display: "flex",
                                        fontSize: "14px",
                                        fontStyle: "normal",
                                        fontWeight: "400",
                                        gap: "6px",
                                        letterSpacing: ".14px",
                                        lineHeight: "22px",
                                        padding: "2px 8px 2px 4px",
                                        width: "fit-content",
                                    }}>
                                        <span>
                                            <i className="fa-solid fa-edit"/>
                                        </span>
                                        Thời điểm cập nhật: {formatDate(recruitment.UpdateAt) + " - "}
                                        {String(recruitment.UpdateAt).substring(11, 19)}
                                    </div>
                                </div>
                                <br/>
                            </div>
                        </div>
                        <div className="col-xl-4 col-lg-4">
                            <div className="mt-20 mb-10 pl-20 pt-20" style={{ backgroundColor: "#ffffff" }}>
                                <div style={{ display: "flex", justifyContent: "space-between" }} >
                                    <Link>
                                        <img
                                            className="img-fluid"
                                            style={{
                                                width: "100px",
                                                height: "100px",
                                                border: "1px solid",
                                                borderRadius: "8px"
                                            }}
                                            src={company.Logo}
                                            alt="Logo"
                                        />
                                    </Link>
                                    <h3 style={{
                                        width: "calc(100% - 106px)",
                                        textTransform: "uppercase",
                                        fontSize: "17px",
                                        lineHeight: "2em"
                                    }}>
                                        <strong>{company.Name}</strong>
                                    </h3>
                                </div>
                                <div style={{ display: "block", margin: "10px"}}>
                                    <ul className='my-font'>
                                        <li style={{
                                            color: "#7f878f",
                                            fontSize: "14px",
                                            fontStyle: "normal",
                                            fontWeight: "400",
                                            width: "100%",
                                            margin: "10px",
                                            display: "flex"
                                        }}>
                                            <i className="fas fa-flag" style={{lineHeight: "2em"}} />
                                            &nbsp;Quốc gia:&nbsp;&nbsp;
                                            <div style={{
                                                color: "#212f3f",
                                                fontSize: "14px",
                                                fontStyle: "normal",
                                                fontWeight: "500",
                                                letterSpacing: ".14px",
                                                width: "calc(100% - 104px)"
                                            }}>{company.Nation}</div>
                                        </li>
                                        <li style={{
                                            color: "#7f878f",
                                            fontSize: "14px",
                                            fontStyle: "normal",
                                            fontWeight: "400",
                                            width: "100%",
                                            margin: "10px",
                                            display: "flex"
                                        }}>
                                            <i className="fas fa-map-marker-alt" style={{lineHeight: "2em"}} />
                                            &nbsp;Địa chỉ:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                            <div style={{
                                                color: "#212f3f",
                                                fontSize: "14px",
                                                fontStyle: "normal",
                                                fontWeight: "500",
                                                letterSpacing: ".14px",
                                                width: "calc(100% - 104px)"
                                            }}>{company.Address}</div>
                                        </li>
                                        <li style={{
                                            color: "#7f878f",
                                            fontSize: "14px",
                                            fontStyle: "normal",
                                            fontWeight: "400",
                                            width: "100%",
                                            margin: "10px",
                                            display: "flex"
                                        }}>
                                            <i className="fas fa-building" style={{lineHeight: "2em"}} />
                                            &nbsp;Quy mô:&nbsp;&nbsp;&nbsp;&nbsp;
                                            <div style={{
                                                color: "#212f3f",
                                                fontSize: "14px",
                                                fontStyle: "normal",
                                                fontWeight: "500",
                                                letterSpacing: ".14px",
                                                width: "calc(100% - 104px)"
                                            }}>{company.EmployeeAmount} nhân viên</div>
                                        </li>
                                    </ul>
                                </div>
                                <div style={{
                                    alignItems: "center",
                                    display: "flex",
                                    gap: "10px",
                                    justifyContent: "center",
                                    width: "100%",
                                    color: "#fb246a",
                                    cursor: "pointer",
                                    textDecoration: "underline",
                                    marginTop: "-5px"
                                }}>
                                    <a href={`/company-detail/${company.Id}`} style={{ color: "#fb246a" }}>
                                        <strong>Xem trang công ty</strong>
                                    </a>
                                    <i className="fa-solid fa-arrow-up-right-from-square"/>
                                </div>
                                <br/>
                            </div>
                        </div>
                    </div>
                    <div className="mt-10 mb-10 pl-20 pt-20 pr-20 " style={{ backgroundColor: "#ffffff" }}>
                        <h1 style={{
                            color: "#263a4d",
                            display: "-webkit-box",
                            fontSize: "22px",
                            fontStyle: "normal",
                            fontWeight: "800",
                            letterSpacing: "-.2px",
                            lineHeight: "28px",
                            margin: "0",
                            overflow: "hidden",
                            textOverflow: "ellipsis"
                        }}>
                            Ngành nghề
                        </h1>
                        <div className='row' style={{ alignItems: "center", display: "flex" }}>
                            {
                                branchRecruitments && branchRecruitments.length > 0 &&
                                branchRecruitments.map((item, index) => {
                                    return (
                                        <div key={index} className="mt-15 mb-15 col-md-2">
                                            <div style={{
                                                textAlign: "center",
                                                background: "#dcdedd",
                                                borderRadius: "4px",
                                                color: "#263a4d",
                                                fontSize: "12px",
                                                fontStyle: "normal",
                                                fontWeight: "400",
                                                padding: "5px",
                                            }}>
                                                {item.Name}
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                        <h1 style={{
                            color: "#263a4d",
                            display: "-webkit-box",
                            fontSize: "22px",
                            fontStyle: "normal",
                            fontWeight: "800",
                            letterSpacing: "-.2px",
                            lineHeight: "28px",
                            margin: "0",
                            overflow: "hidden",
                            textOverflow: "ellipsis"
                        }}>
                            Khu vực
                        </h1>
                        <div className='row'
                             style={{
                                 alignItems: "center",
                                 display: "flex",
                                 flexWrap: "wrap",
                                 gap: "1px"
                             }}>
                            {
                                areaRecruitments && areaRecruitments.length > 0 &&
                                areaRecruitments.map((item, index) => {
                                    return (
                                        <div key={index} className="mt-15 mb-15 col-md-2">
                                            <div style={{
                                                textAlign: "center",
                                                background: "#dcdedd",
                                                borderRadius: "4px",
                                                color: "#263a4d",
                                                fontSize: "12px",
                                                fontStyle: "normal",
                                                fontWeight: "400",
                                                padding: "5px",
                                            }}>
                                                {item.Name}
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                    <div className="mt-10 mb-10 pl-20 pt-20 pr-20 " style={{ backgroundColor: "#ffffff" }}>
                        <h1 style={{
                            color: "#263a4d",
                            display: "-webkit-box",
                            fontSize: "22px",
                            fontStyle: "normal",
                            fontWeight: "800",
                            letterSpacing: "-.2px",
                            lineHeight: "28px",
                            margin: "0",
                            overflow: "hidden",
                            textOverflow: "ellipsis"
                        }}>
                            Chi tiết tuyển dụng
                        </h1>
                        <h5 style={{ margin: "15px 0 10px 0" }}><strong>Mô tả công việc</strong></h5>
                        <label style={{ width: "100%", height: "fit-content", border: "none" }}>
                            {recruitment.RecruitDetail}
                        </label>
                        <h5 style={{ margin: "15px 0 10px 0" }}><strong>Yêu cầu ứng viên</strong></h5>
                        <label style={{ width: "100%", height: "fit-content", border: "none" }}>
                            {recruitment.Requirement}
                        </label>
                        <h5 style={{ margin: "15px 0 10px 0" }}><strong>Quyền lợi</strong></h5>
                        <label style={{ width: "100%", height: "fit-content", border: "none", resize: "none" }}>
                            {recruitment.Right}
                        </label>
                        <h5 style={{ margin: "15px 0 10px 0" }}><strong>Địa điểm làm việc</strong></h5>
                        <label style={{ width: "100%", height: "fit-content", border: "none", resize: "none" }}>
                            {recruitment.Address}
                        </label>
                    </div>
                </div>
            </div>
            <ToastContainer/>
            <ApplyModal
                isOpen={activeModal}
                postId={id}
                onHide={() => setActiveModal(false)} />
        </main>
    )
}

export default RecruitmentDetail
