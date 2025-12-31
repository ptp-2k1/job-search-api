import React, { useEffect, useRef, useState } from 'react'
import { Link, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { getAdminCompanyDetail } from "../../../service/CompanyService";
import { getCompanyPost } from "../../../service/PostService";
import { getAreaRecruitmentDetail } from "../../../service/AreaRecruitmentService";
import './CompanyDetail.scss';

const CompanyDetail = () => {
    const [nations, setNations] = useState("")
    const [company, setCompany] = useState({})
    const [companyPosts, setCompanyPosts] = useState({})
    const [top, setTop] = useState(10)
    const [isMore, setIsMore] = useState(false)
    const [areaRecruitmentDetail, setAreaRecruitmentDetail] = useState([])
    const [areaStatus, setAreaStatus] = useState(false);
    const areaRecruitmentDetailStatus = useRef(false);
    const { id } = useParams();

    const getData = async () => {
        let countries = await import("../../../countries.json")
        const companyDetail = await getAdminCompanyDetail(id)
        const companyPostList = await getCompanyPost(id)

        setNations(Object.keys(countries).map((index) => countries[index].name))

        if(companyDetail && companyDetail.status === 200) {
            setCompany(companyDetail.data)
        } else {
            toast.error("Không thể lấy thông tin công ty ngay lúc này ! Hãy thử lại sau", {
                position: toast.POSITION.TOP_RIGHT
            })
        }

        if(companyPostList && companyPostList.status === 200) {
            if(companyPostList.data) {
                setCompanyPosts(companyPostList.data.length > top ? companyPostList.data.slice(0, top) : companyPostList.data)
                areaRecruitmentDetailStatus.current = true;
                if(companyPostList.data.length > top) {
                    setIsMore(true)
                } else {
                    setIsMore(false)
                }
            } else {
                setCompanyPosts([])
            }
        } else {
            toast.error("Không thể lấy danh sách bài tuyển dụng nổi bật của công ty ngay lúc này ! Hãy thử lại sau", {
                position: toast.POSITION.TOP_RIGHT
            })
        }
    }

    const getAreaRecruitmentList = async () => {
        if(companyPosts) {
            const oldAreaRecruitmentDetail = areaRecruitmentDetail
            for (const item of companyPosts) {
                const areaRecruitmentList = await getAreaRecruitmentDetail(item.Id)
                if(areaRecruitmentList && areaRecruitmentList.status === 200) {
                    oldAreaRecruitmentDetail.push(Object.keys(areaRecruitmentList.data).map((index) => areaRecruitmentList.data[index].Name))
                } else {
                    setAreaRecruitmentDetail([])
                }
            }
            setAreaRecruitmentDetail(oldAreaRecruitmentDetail)
            setAreaStatus(!areaStatus)
        }
    }

    const formatDate = (date) => {
        if(date) {
            let dateRaw = date.substring(0, 10).split("-");
            return dateRaw[2] + "/" + dateRaw[1] + "/" + dateRaw[0];
        }
    }

    const copyLink = () => {
        let copyText = document.getElementById("mylink");
        copyText.select();
        copyText.setSelectionRange(0, 99999);
        navigator.clipboard.writeText(copyText.value);
    }

    useEffect(() => {
        if(id) {
            getData()
        }
    }, [top])

    useEffect(() => {
        if(id) {
            if(areaRecruitmentDetailStatus.current && !areaStatus) {
                getAreaRecruitmentList()
            }
        }
    }, [areaRecruitmentDetailStatus.current, areaStatus])

    return (
        <>
            <div className='container-detail-company'>
                <div className="company-cover">
                    <div className="container">
                        <div className="cover-wrapper">
                            <img
                                className="img-responsive cover-img"
                                style={{width: "100%", height: "236px"}}
                                src={company.Cover}
                                alt="Ảnh bìa"
                            />
                        </div>
                        <div className="company-detail-overview">
                            <div id="company-logo">
                                <div className="company-image-logo">
                                    <img
                                        className="img-responsive"
                                        style={{width: '100%', height: '100%'}}
                                        src={company.Logo}
                                        alt="Logo"
                                    />
                                </div>
                            </div>
                            <div className="company-info">
                                <h1 className="company-detail-name text-highlight">{company.Name}</h1>
                                <div className="d-flex">
                                    <p className="company-info">
                                        <i className="fas fa-globe-americas"/>
                                        <a href={company.Website} target="_blank">{company.Website}</a>
                                    </p>
                                    <p className="company-info">
                                        <i className="far fa-building"/>
                                        {company.EmployeeAmount} nhân viên
                                    </p>
                                    <p className="company-info">
                                        <i className="far fa-edit"/>
                                        {company.Field}
                                    </p>
                                    <p className="company-info">
                                        <i className="far fa-flag"/>
                                        {nations[company.Nation]}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="detail">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-8">
                                <div className="company-info box-white">
                                    <h4 className="title">Giới thiệu công ty</h4>
                                    <div className="box-body">
                                        <p>{company.Description}</p>
                                    </div>
                                </div>
                                <div className="job-listing box-white">
                                    <h4 className="title">Tuyển dụng</h4>
                                    <div>
                                        {companyPosts && companyPosts.length > 0 &&
                                        companyPosts.map((item, index) => {
                                            return (
                                                <Link key={index} to={`/recruitment-detail/${item.Id}`}>
                                                    <div className="single-job-items" style={{ marginTop: "25px", backgroundColor: "#eaedff" }}>
                                                        <div>
                                                            <div className="job-items" style={{ display: "inline-block" }}>
                                                                <div className="company-img">
                                                                    <a href="#">
                                                                        <img src={item.Logo}
                                                                             alt=""
                                                                             style={{ width: "125px", height: "130px", border: "1px solid black" }}
                                                                        />
                                                                    </a>
                                                                </div>
                                                                <div className="job-tittle" style={{ marginTop: "-22px" }}>
                                                                    <br/>
                                                                    <h2 style={{ font: "normal normal 700 14px/20px Helvetica", fontSize: "17px" }}>
                                                                        {item.Title}
                                                                    </h2>
                                                                    <ul className="my-font">
                                                                        <li style={{ color: "black" }}>
                                                                            <i className="fas fa-dollar text-dark"/>
                                                                            {item.Salary}
                                                                        </li>
                                                                        <br/>
                                                                        <li style={{ color: "black", right: "800" }}>
                                                                            <i className="fas fa-briefcase text-dark"/>
                                                                            {item.Experience}
                                                                        </li>
                                                                        <li style={{ color: "black" }}>
                                                                            <i className="fas fa-map-marker-alt text-dark"/>
                                                                            {areaRecruitmentDetail[index] && areaRecruitmentDetail[index].length > 0
                                                                            && areaRecruitmentDetail[index].slice(0, 1).map((item, pos) => {
                                                                                return pos < areaRecruitmentDetail[index].slice(0, 1).length-1 ?
                                                                                    ( item + ", " ) : (item)
                                                                            })} {
                                                                            areaRecruitmentDetail[index] && (
                                                                                areaRecruitmentDetail[index].length > 1 && (
                                                                                    ` và ${areaRecruitmentDetail[index].length-1} nơi khác`
                                                                                )
                                                                            )
                                                                        }
                                                                        </li>
                                                                        <li style={{ color: "black" }}>
                                                                            <i className="fas fa-clock text-dark"/>
                                                                            Hạn ứng tuyển: {formatDate(item.ApplyEndDate)}
                                                                        </li>
                                                                    </ul>
                                                                    <ul className='my-font' style={{ display: "flex" }}>
                                                                        <div className="items-link items-link2" style={{ marginLeft: "auto", marginRight: "0" }}>
                                                                            <a className="my-font"><i className="fas fa-angle-double-right"/> Ứng tuyển ngay</a>
                                                                        </div>
                                                                    </ul>
                                                                    <div className="items-link items-link2">
                                                                        <span style={{ position: 'absolute', left: "70px", color: "black" }}>
                                                                            Ngày đăng: {formatDate(item.UploadDate)}
                                                                        </span>
                                                                        <span style={{ position: 'absolute', right: "70px", color: "black" }}>
                                                                            Thời điểm cập nhật: {formatDate(item.UpdateAt) + " - "}
                                                                            {String(item.UpdateAt).substring(11, 19)}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Link>
                                            )
                                        })
                                        }
                                        {
                                            companyPosts && companyPosts.length > 0 && isMore &&
                                            (
                                                <div
                                                    className="items-link mt-3"
                                                    style={{ width: "100px", margin: "auto", cursor: "pointer" }}
                                                    onClick={() => setTop(top + 10)}
                                                >
                                                    <a className='my-font' style={{ color: "#252b60" }}>
                                                        <i className="fas fa-arrow-down"/>
                                                    </a>
                                                </div>
                                            )
                                        }
                                        {
                                            (!companyPosts || companyPosts && companyPosts.length === 0) &&
                                            (
                                                <div style={{ textAlign: 'center', marginTop: "20px" }}>
                                                    Không tìm thấy bài tuyển dụng nào
                                                </div>
                                            )

                                        }
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="box-address box-white">
                                    <div className="box-body">
                                        <p className="text-dark-gray"
                                           style={{
                                               color: "#212f3f",
                                               fontSize: "22px",
                                               fontWeight: "500",
                                               fontFamily: "Monospaced"
                                           }}>
                                            <i className="fas fa-map-marker-alt"
                                               style={{ marginRight: "10px", color: "#a89bc2" }}
                                            />
                                            Địa chỉ công ty
                                        </p>
                                        <p
                                            style={{
                                                color: "#4d5965",
                                                fontSize: "15px",
                                                fontWeight: "400",
                                                fontFamily: "Arial"
                                            }}>
                                            {company.Address}
                                        </p>
                                        <p className="text-dark-gray"
                                           style={{
                                               color: "#212f3f",
                                               fontSize: "22px",
                                               fontWeight: "500",
                                               fontFamily: "Monospaced"
                                           }}>
                                            <i className="fas fa-at"
                                               style={{ marginRight: "10px", color: "#a89bc2" }}
                                            />
                                            Email liên hệ
                                        </p>
                                        <p
                                            style={{
                                                color: "#4d5965",
                                                fontSize: "15px",
                                                fontWeight: "400",
                                                fontFamily: "Arial"
                                            }}>
                                            {company.Email}
                                        </p>
                                    </div>
                                </div>
                                <div className="box-sharing box-white">
                                    <h4 className="title">Chia sẻ công ty tới bạn bè</h4>
                                    <div className="box-body">
                                        <p>Sao chép đường dẫn</p>
                                        <div className="box-copy">
                                            <input id='mylink' type="text" defaultValue={window.location.href} className="url-copy" readOnly />
                                            <div className="btn-copy">
                                                <button onClick={copyLink} className="btn-copy-url">
                                                    <i className="fa-regular fa-copy" style={{ color: "#a89bc2" }} />
                                                </button>
                                            </div>
                                        </div>
                                        <p>Chia sẻ qua mạng xã hội</p>
                                        <div className="box-share">
                                            <a href="http://www.facebook.com/sharer/sharer.php?u=https://www.topcv.vn/cong-ty/cong-ty-co-phan-tap-doan-hoa-sen/8734.html" target="_blank"><img src="https://www.topcv.vn/v4/image/job-detail/share/facebook.png" alt="" /></a>
                                            <a href="https://twitter.com/intent/tweet?url=https://www.topcv.vn/cong-ty/cong-ty-co-phan-tap-doan-hoa-sen/8734.html" target="_blank"><img src="https://www.topcv.vn/v4/image/job-detail/share/twitter.png" alt="" /></a>
                                            <a href="https://www.linkedin.com/cws/share?url=https://www.topcv.vn/cong-ty/cong-ty-co-phan-tap-doan-hoa-sen/8734.html" target="_blank"><img src="https://www.topcv.vn/v4/image/job-detail/share/linkedin.png" alt="" /></a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer/>
        </>
    )


}

export default CompanyDetail
