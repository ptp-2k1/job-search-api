import React, { useState, useEffect, useRef } from 'react'
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { Input } from "antd";
import { getAreaList } from "../../../service/AreaService";
import { getBranchList } from "../../../service/BranchService";
import { getEducationList } from "../../../service/EducationService";
import { getTitleList } from "../../../service/TitleService";
import { getWorkTypeList } from "../../../service/WorkTypeService";
import { getSalaryList } from "../../../service/SalaryService";
import { getExperienceList } from "../../../service/ExperienceService";
import { getPostList } from "../../../service/PostService";
import { getAreaRecruitmentDetail } from "../../../service/AreaRecruitmentService";
import {PAGINATION} from "../../../enums/Pagination";
import ReactPaginate from "react-paginate";

const RecruitmentList = () => {
    const initialData = {
        areaId: "",
        branchId: "",
        educationId: "",
        titleId: "",
        workTypeId: "",
        salaryId: "",
        experienceId: ""
    }
    const [data, setData] = useState(initialData)
    const [search, setSearch] = useState("")
    const [areas, setAreas] = useState([])
    const [branches, setBranches] = useState([])
    const [educations, setEducations] = useState([])
    const [titles, setTitles] = useState([])
    const [workTypes, setWorkTypes] = useState([])
    const [salaries, setSalaries] = useState([])
    const [experiences, setExperiences] = useState([])
    const [posts, setPosts] = useState([])
    const [pageCount, setPageCount] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [changePage, setChangePage] = useState(false)
    const [areaRecruitmentDetail, setAreaRecruitmentDetail] = useState([])
    const [areaStatus, setAreaStatus] = useState(false);
    const areaRecruitmentDetailStatus = useRef(false);

    const handleSearch = (value) => {
        setCurrentPage(1)
        setSearch(value === "" || value === undefined || value === null ? "" : value)
    }

    const getData = async () => {
        const areaList = await getAreaList()
        const branchList = await getBranchList()
        const educationList = await getEducationList()
        const titleList = await getTitleList()
        const workTypeList = await getWorkTypeList()
        const salaryList = await getSalaryList()
        const experienceList = await getExperienceList()
        const postList = await getPostList({
            info: search,
            areaId: data.areaId,
            branchId: data.branchId,
            educationId: data.educationId,
            titleId: data.titleId,
            workTypeId: data.workTypeId,
            salaryId: data.salaryId,
            experienceId: data.experienceId
        })

        if(areaList && areaList.status === 200) {
            setAreas(areaList.data)
        }

        if(branchList && branchList.status === 200) {
            setBranches(branchList.data)
        }

        if(educationList && educationList.status === 200) {
            setEducations(educationList.data)
        }

        if(titleList && titleList.status === 200) {
            setTitles(titleList.data)
        }

        if(workTypeList && workTypeList.status === 200) {
            setWorkTypes(workTypeList.data)
        }

        if(salaryList && salaryList.status === 200) {
            setSalaries(salaryList.data)
        }

        if(experienceList && experienceList.status === 200) {
            setExperiences(experienceList.data)
        }

        if(postList && postList.status === 200) {
            if(postList.data) {
                setPosts(postList.data.slice((currentPage-1)* PAGINATION.Item, currentPage * PAGINATION.Item))
                setPageCount(Math.ceil(postList.data.length / PAGINATION.Item))
                areaRecruitmentDetailStatus.current = true;
            } else {
                setPosts([])
                setPageCount(0)
            }
            setChangePage(true)
        } else {
            toast.error("Không thể lấy danh sách bài đăng tuyển ngay lúc này ! Hãy thử lại sau", {
                position: toast.POSITION.TOP_RIGHT
            })
        }
    }

    const getAreaRecruitmentList = async () => {
        if(posts) {
            let oldAreaRecruitmentDetail = []
            for (const item of posts) {
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

    const handleOnChange = (event) => {
        const { name, value } = event.target;
        setCurrentPage(1)
        setData({ ...data, [name]: value });
    };

    const formatDate = (date) => {
        if(date) {
            let dateRaw = date.substring(0, 10).split("-");
            return dateRaw[2] + "/" + dateRaw[1] + "/" + dateRaw[0];
        }
    }

    const handleChangePage = (page) => {
        if(page) {
            setCurrentPage(page.selected + 1)
        }
    }

    useEffect(() => {
        getData()
    }, [search, data.areaId, data.branchId, data.educationId, data.titleId, data.workTypeId, data.salaryId, data.experienceId, currentPage])

    useEffect(() => {
        if((areaRecruitmentDetailStatus.current && !areaStatus) || changePage) {
            getAreaRecruitmentList()
        }
    }, [areaRecruitmentDetailStatus.current, areaStatus, changePage])

    return (
        <>
            <div className='container-recruitment'>
                <Input.Search
                    style={{ width: "430px", marginLeft: "830px", marginTop: "15px" }}
                    placeholder="Nhập tên việc làm"
                    allowClear
                    enterButton="Tìm kiếm"
                    onSearch={handleSearch}
                />
                <div className="small-section-tittle2 ml-25 mb-45">
                    <div className="ion">
                        <svg  xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="20px" height="12px">
                            <path fillRule="evenodd" fill="black" d="M7.778,12.000 L12.222,12.000 L12.222,10.000 L7.778,10.000 L7.778,12.000 ZM-0.000,-0.000 L-0.000,2.000 L20.000,2.000 L20.000,-0.000 L-0.000,-0.000 ZM3.333,7.000 L16.667,7.000 L16.667,5.000 L3.333,5.000 L3.333,7.000 Z" />
                        </svg>
                    </div>
                    <h4 style={{ color: "black" }}>Lọc việc làm</h4>
                </div>
                <div className="row ml-1" style={{ width: "100%", display: "flex", justifyContent: "center" }}>
                    <div className="col-md-3 mb-3">
                        <select
                            className="form-control"
                            style={{ border: "1px solid #000000", color: "#000000", cursor: "pointer" }}
                            name="areaId"
                            value={data.areaId}
                            onChange={(event) => handleOnChange(event)}
                        >
                            <option value={""}>Tất cả khu vực</option>
                            {areas && areas.length > 0 &&
                            areas.map((item, index) => {
                                return (
                                    <option key={index} value={item.Id}>{item.Name}</option>
                                )
                            })}
                        </select>
                    </div>
                    <div className="col-md-3 mb-3">
                        <select
                            className="form-control"
                            style={{ border: "1px solid #000000", color: "#000000", cursor: "pointer" }}
                            name="branchId"
                            value={data.branchId}
                            onChange={(event) => handleOnChange(event)}
                        >
                            <option value={""}>Tất cả ngành nghề</option>
                            {branches && branches.length > 0 &&
                            branches.map((item, index) => {
                                return (
                                    <option key={index} value={item.Id}>{item.Name}</option>
                                )
                            })}
                        </select>
                    </div>
                    <div className="col-md-3 mb-3">
                        <select
                            className="form-control"
                            style={{ border: "1px solid #000000", color: "#000000", cursor: "pointer" }}
                            name="educationId"
                            value={data.educationId}
                            onChange={(event) => handleOnChange(event)}
                        >
                            <option value={""}>Tất cả học vấn</option>
                            {educations && educations.length > 0 &&
                            educations.map((item, index) => {
                                return (
                                    <option key={index} value={item.Id}>{item.Name}</option>
                                )
                            })}
                        </select>
                    </div>
                    <div className="col-md-3 mb-3">
                        <select
                            className="form-control"
                            style={{ border: "1px solid #000000", color: "#000000", cursor: "pointer" }}
                            name="titleId"
                            value={data.titleId}
                            onChange={(event) => handleOnChange(event)}
                        >
                            <option value={""}>Tất cả cấp bậc</option>
                            {titles && titles.length > 0 &&
                            titles.map((item, index) => {
                                return (
                                    <option key={index} value={item.Id}>{item.Name}</option>
                                )
                            })}
                        </select>
                    </div>
                </div>
                <div className="row ml-1" style={{ width: "100%", display: "flex", justifyContent: "center" }}>
                    <div className="col-md-3 mb-3">
                        <select
                            className="form-control"
                            style={{ border: "1px solid #000000", color: "#000000", cursor: "pointer" }}
                            name="workTypeId"
                            value={data.workTypeId}
                            onChange={(event) => handleOnChange(event)}
                        >
                            <option value={""}>Tất cả loại hình công việc</option>
                            {workTypes && workTypes.length > 0 &&
                            workTypes.map((item, index) => {
                                return (
                                    <option key={index} value={item.Id}>{item.Name}</option>
                                )
                            })}
                        </select>
                    </div>
                    <div className="col-md-3 mb-3">
                        <select
                            className="form-control"
                            style={{ border: "1px solid #000000", color: "#000000", cursor: "pointer" }}
                            name="salaryId"
                            value={data.salaryId}
                            onChange={(event) => handleOnChange(event)}
                        >
                            <option value={""}>Tất cả mức lương</option>
                            {salaries && salaries.length > 0 &&
                            salaries.map((item, index) => {
                                return (
                                    <option key={index} value={item.Id}>{item.Name}</option>
                                )
                            })}
                        </select>
                    </div>
                    <div className="col-md-3 mb-3">
                        <select
                            className="form-control"
                            style={{ border: "1px solid #000000", color: "#000000", cursor: "pointer" }}
                            name="experienceId"
                            value={data.experienceId}
                            onChange={(event) => handleOnChange(event)}
                        >
                            <option value={""}>Tất cả kinh nghiệm</option>
                            {experiences && experiences.length > 0 &&
                            experiences.map((item, index) => {
                                return (
                                    <option key={index} value={item.Id}>{item.Name}</option>
                                )
                            })}
                        </select>
                    </div>
                </div>
                <h3 className='title text-center'>DANH SÁCH CÁC BÀI ĐĂNG TUYỂN DỤNG</h3>
                <span style={{ width: "100%", display: "flex", justifyContent: "center" }}>
            </span>
                <br/>
                <div className="card-deck m-3 mb-5">
                    {posts && posts.length > 0 &&
                    posts.map((item, index) => {
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
                    (!posts || posts && posts.length === 0) &&
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

export default RecruitmentList
