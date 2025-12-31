import { PAGINATION } from '../../../enums/Pagination';
import React, { useEffect, useState, useRef } from 'react'
import ReactPaginate from 'react-paginate';
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { getRecommended } from "../../../service/PostService";
import { getPostList } from "../../../service/PostService";
import { getAreaRecruitmentDetail } from "../../../service/AreaRecruitmentService";

const RecommendJobList = () => {

    const [recommendedJobs, setRecommendedJobs] = useState([])
    const [pageCount, setPageCount] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [changePage, setChangePage] = useState(false)
    const [areaRecruitmentDetail, setAreaRecruitmentDetail] = useState([])
    const [areaStatus, setAreaStatus] = useState(false);
    const areaRecruitmentDetailStatus = useRef(false);

    const getData = async () => {
        const recommendedJobList = await getRecommended({
            id: localStorage.getItem("userId"),

        })

        if(recommendedJobList && recommendedJobList.status === 200) {
            if(recommendedJobList.data) {
                setRecommendedJobs(recommendedJobList.data.slice((currentPage-1)* PAGINATION.Item, currentPage * PAGINATION.Item))
                setPageCount(Math.ceil(recommendedJobList.data.length / PAGINATION.Item))
                areaRecruitmentDetailStatus.current = true;
                setChangePage(true)
            } else {
                const postList = await getPostList({
                    info: "",
                    areaId: "",
                    branchId: "",
                    educationId: "",
                    titleId: "",
                    workTypeId: "",
                    salaryId: "",
                    experienceId: ""
                })

                if(postList && postList.status === 200) {
                    if(postList.data) {
                        setRecommendedJobs(postList.data.slice((currentPage-1)* PAGINATION.Item, currentPage * PAGINATION.Item))
                        setPageCount(Math.ceil(postList.data.length / PAGINATION.Item))
                        areaRecruitmentDetailStatus.current = true;
                    } else {
                        setRecommendedJobs([])
                        setPageCount(0)
                    }
                    setChangePage(true)
                } else {
                    toast.error("Không thể lấy danh sách việc làm gợi ý ngay lúc này ! Hãy thử lại sau", {
                        position: toast.POSITION.TOP_RIGHT
                    })
                }
            }
        } else {
            toast.error("Không thể lấy danh sách việc làm gợi ý ngay lúc này ! Hãy thử lại sau", {
                position: toast.POSITION.TOP_RIGHT
            })
        }
    }

    const getAreaRecruitmentList = async () => {
        if(recommendedJobs) {
            let oldAreaRecruitmentDetail = []
            for (const item of recommendedJobs) {
                const areaRecruitmentList = await getAreaRecruitmentDetail(item.Id)
                if(areaRecruitmentList && areaRecruitmentList.status === 200) {
                    oldAreaRecruitmentDetail.push(Object.keys(areaRecruitmentList.data).map((index) => areaRecruitmentList.data[index].Name))
                } else {
                    setAreaRecruitmentDetail([])
                }
            }
            setAreaRecruitmentDetail(oldAreaRecruitmentDetail)
            setAreaStatus(!areaStatus)
            setChangePage(false)
        }
    }

    const handleChangePage = (page) => {
        if(page) {
            setCurrentPage(page.selected + 1)
        }
    }

    const formatDate = (date) => {
        if(date) {
            let dateRaw = date.substring(0, 10).split("-");
            return dateRaw[2] + "/" + dateRaw[1] + "/" + dateRaw[0];
        }
    }

    useEffect(() => {
        getData()
    }, [currentPage])

    useEffect(() => {
        if((areaRecruitmentDetailStatus.current && !areaStatus) || changePage) {
            getAreaRecruitmentList()
        }
    }, [areaRecruitmentDetailStatus.current, areaStatus, changePage])

    return (
        <>
            <div className='container-recruitment mb-3'>
                <h3 className='title text-center'>GỢI Ý CÁC VIỆC LÀM PHÙ HỢP VỚI HỒ SƠ CỦA BẠN</h3>
                <div
                    className='mb-2 hover-pointer text-right'
                    style={{color: 'red'}}
                    onClick={() => window.location.href = "/recruitment"}
                >
                    Chưa tìm được việc làm ưng ý ? Tìm việc ngay &nbsp;&nbsp;
                    <i className="fa-solid fa-arrow-right mr-2"/>
                </div>
                <br/>
                <div className="card-deck">
                    {recommendedJobs && recommendedJobs.length > 0 &&
                    recommendedJobs.map((item, index) => {
                        return (
                            <div key={index} className="col-md-4 rounded-0 mt-5">
                                <div className="card">
                                    <section className="featured-job-area">
                                        <div className="container" style={{ backgroundColor: "#ffffff" }}>
                                            <Link to={`/recruitment-detail/${item.Id}`}>
                                                <div className="single-job-items mb-30" style={{ border: "none" }}>
                                                    <div>
                                                        <div className="job-items">
                                                            <div className="company-img">
                                                                <a href="#">
                                                                    <img src={item.Logo}
                                                                         alt=""
                                                                         style={{ width: "85px", height: "85px" }}
                                                                    />
                                                                </a>
                                                            </div>
                                                            <div className="job-tittle job-title2">
                                                                <br/>
                                                                <h2 style={{ font: "normal normal 700 14px/20px Helvetica", fontSize: "17px" }}>
                                                                    {item.Title}
                                                                </h2>
                                                                <ul className='my-font' style={{ display: "block" }}>
                                                                    <li style={{ width: "100%" }}>
                                                                        <i className="fas fa-map-marker-alt"/>
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
                                                                    <br/>
                                                                    <li>
                                                                        <i className="fas fa-dollar"/>
                                                                        {item.Salary}
                                                                    </li>
                                                                    <br/>
                                                                    <li>
                                                                        <i className="fas fa-briefcase"/>
                                                                        {item.Experience}
                                                                    </li>
                                                                    <br/>
                                                                    <li>
                                                                        <i className="fas fa-clock"/>
                                                                        Hạn ứng tuyển: {formatDate(item.ApplyEndDate)}
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                        </div>
                                                        <div className="items-link items-link2 f-right">
                                                            <a className='my-font'><i className="fas fa-angle-double-right"/> Ứng tuyển ngay</a>
                                                            <span style={{ position: 'absolute', left: '60px' }}>
                                                            Ngày đăng: {formatDate(item.UploadDate)}
                                                        </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        </div>
                                    </section>
                                </div>
                            </div>
                        )
                    })}
                </div>
                {
                    (!recommendedJobs || recommendedJobs && recommendedJobs.length === 0) &&
                    (
                        <div style={{ textAlign: 'center', marginTop: "20px" }}>
                            Không có dữ liệu
                        </div>
                    )
                }
            </div>
            <ReactPaginate
                forcePage={currentPage-1}
                previousLabel={'<'}
                nextLabel={'>'}
                breakLabel={'...'}
                pageCount={pageCount}
                marginPagesDisplayed={5}
                containerClassName={"pagination justify-content-center pb-3"}
                pageClassName={"page-item"}
                pageLinkClassName={"page-link"}
                previousLinkClassName={"page-link"}
                previousClassName={"page-item"}
                nextClassName={"page-item"}
                nextLinkClassName={"page-link"}
                breakLinkClassName={"page-link"}
                breakClassName={"page-item"}
                activeClassName={"active"}
                onPageChange={ handleChangePage }
            />
            <ToastContainer/>
        </>
    )
}

export default RecommendJobList
