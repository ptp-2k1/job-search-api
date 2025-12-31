import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getTopRecruitmentBranch } from '../../../service/StatisticsService'
import { getLatestPost, getTopHotPost } from "../../../service/PostService";

const HomeMain = () => {
    const [hotBranches, setHotBranches] = useState([])
    const [hotJobs, setHotJobs] = useState([])
    const [latestJobs, setLatestJobs] = useState([])

    const getData = async () => {
        const hotBranchList = await getTopRecruitmentBranch({
            fromDate: "2023-01-01",
            toDate: "2024-12-31"
        })
        const hotJobList = await getTopHotPost()
        const latestJobList = await getLatestPost()


        if(hotBranchList && hotBranchList.status === 200) {
            setHotBranches(hotBranchList.data)
        }

        if(hotJobList && hotJobList.status === 200) {
            setHotJobs(hotJobList.data)
        }

        if(latestJobList && latestJobList.status === 200) {
            setLatestJobs(latestJobList.data)
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
    }, [])

    return (
        <>
            <main>
                <div className="slider-area ">
                    <div className="slider-active">
                        <div className="single-slider slider-height d-flex align-items-center"
                             style={{ backgroundImage: `url("./assets/img/hero/h1_hero.jpg")` }}>
                            <div className="container">
                                <div className="row">
                                    <div className="col-xl-6 col-lg-9 col-md-10">
                                        <div className="hero__caption">
                                            <h1>Hãy tìm việc làm phù hợp với bạn nào</h1>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="our-services section-pad-t30" style={{ backgroundColor: "#eaedff"}}>
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="section-tittle text-center">
                                    <span>Các danh mục việc làm mà bạn quan tâm ở đây</span>
                                    <h2>Ngành nghề nổi bật</h2>
                                </div>
                            </div>
                        </div>
                        <div className="row d-flex justify-contnet-center">
                            {hotBranches && hotBranches.length > 0 && hotBranches.slice(0, 8)
                                .map((item, index) => {
                                    return (
                                        <div key={index} className="col-xl-3 col-lg-3 col-md-4 col-sm-6">
                                            <div className="single-services text-center mb-30" style={{ backgroundColor: "#e2dfed" }} >
                                                <div className="services-cap">
                                                    <h3 className='title text-center' style={{ color: "#252b60" }}>
                                                        {item.Name}
                                                    </h3>
                                                    <span style={{ fontSize: "15px" }}>
                                                    {item.Amount} việc làm
                                                </span>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                        </div>
                        {
                            (!hotBranches || hotBranches && hotBranches.length === 0) &&
                            (
                                <div style={{ textAlign: 'center', marginTop: "20px" }}>
                                    Không có dữ liệu
                                </div>
                            )
                        }
                    </div>
                </div>
                <div className="online-cv cv-bg section-overly pt-90 pb-120"
                     style={{ backgroundImage: `url("assets/img/gallery/cv_bg.jpg")`}}>
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-xl-10">
                                <div className="cv-caption text-center">
                                    <p className="pera1">Nhiều việc làm đang chờ bạn</p>
                                    <p className="pera2"> Bạn đã hứng thú để tìm việc chưa ?</p>
                                    <Link to='/recruitment' class="border-btn2 border-btn4">Tìm việc ngay</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <section className="featured-job-area feature-padding" style={{ backgroundColor: "#eaedff"}}>
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="section-tittle text-center">
                                    <h2>Việc làm nổi bật</h2>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            {hotJobs && hotJobs.length > 0 && hotJobs.map((item, index) => {
                                return (
                                    <div key={index} className="col-md-6 col-lg-6">
                                        <section className="featured-job-area">
                                            <div className="container" style={{ backgroundColor: "#ffffff" }}>
                                                <Link to={`/recruitment-detail/${item.Id}`}>
                                                    <div className="single-job-items mb-30" style={{ border: "none" }}>
                                                        <div>
                                                            <div className="job-items" style={{ display: "inline-block" }}>
                                                                <div className="company-img">
                                                                    <a href="#">
                                                                        <img src={item.Logo}
                                                                             alt=""
                                                                             style={{ width: "85px", height: "85px", border: "1px solid black" }}
                                                                        />
                                                                        <h2 style={{ font: "normal normal 700 Arial", fontSize: "20px" }}>
                                                                            {item.Title}
                                                                        </h2>
                                                                        <h2 style={{ font: "normal normal 500 Muli", fontSize: "14px", color: "#808080" }}>
                                                                            {item.Name}
                                                                        </h2>
                                                                        <h2 style={{ font: "normal normal 500 Muli", fontSize: "14px", color: "#808080" }}>
                                                                            {item.HotWeight}
                                                                        </h2>
                                                                    </a>
                                                                </div>
                                                            </div>
                                                            <div className="items-link items-link2 f-right">
                                                                <a className='my-font'>
                                                                    <i className="fas fa-angle-double-right"/> Ứng tuyển ngay
                                                                </a>
                                                            </div>
                                                            <div className="job-tittle job-title2">
                                                                <ul className="my-font mt-30" >
                                                                    <li style={{ color: "black" }} >
                                                                        <i className="fas fa-clock text-dark"/>
                                                                        Hạn ứng tuyển: {formatDate(item.ApplyEndDate)}
                                                                    </li>
                                                                    <li style={{ color: "black" }} >
                                                                        <i className="fas fa-calendar-plus text-dark"/>
                                                                        Ngày đăng: {formatDate(item.UploadDate)}
                                                                    </li>
                                                                    <li style={{ color: "black" }} >
                                                                        <i className="fas fa-edit text-dark"/>
                                                                        Thời điểm cập nhật: {formatDate(item.UpdateAt) + " - "}
                                                                        {String(item.UpdateAt).substring(11, 19)}
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Link>
                                            </div>
                                        </section>
                                    </div>
                                )
                            })}
                        </div>
                        {
                            (!hotJobs || hotJobs && hotJobs.length === 0) &&
                            (
                                <div style={{ textAlign: 'center', marginTop: "20px" }}>
                                    Không có dữ liệu
                                </div>
                            )
                        }
                    </div>
                </section>
                <section className="featured-job-area feature-padding" style={{ backgroundColor: "#eaedff"}}>
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="section-tittle text-center">
                                    <h2>Việc làm mới đăng</h2>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            {latestJobs && latestJobs.length > 0 && latestJobs.map((item, index) => {
                                return (
                                    <div key={index} className="col-md-6 col-lg-6">
                                        <section className="featured-job-area">
                                            <div className="container" style={{ backgroundColor: "#ffffff" }}>
                                                <Link to={`/recruitment-detail/${item.Id}`}>
                                                    <div className="single-job-items mb-30" style={{ border: "none" }}>
                                                        <div>
                                                            <div className="job-items" style={{ display: "inline-block" }}>
                                                                <div className="company-img">
                                                                    <a href="#">
                                                                        <img src={item.Logo}
                                                                             alt=""
                                                                             style={{ width: "85px", height: "85px", border: "1px solid black" }}
                                                                        />
                                                                        <h2 style={{ font: "normal normal 700 Arial", fontSize: "20px" }}>
                                                                            {item.Title}
                                                                        </h2>
                                                                        <h2 style={{ font: "normal normal 500 Muli", fontSize: "14px", color: "#808080" }}>
                                                                            {item.Name}
                                                                        </h2>
                                                                    </a>
                                                                </div>
                                                            </div>
                                                            <div className="items-link items-link2 f-right">
                                                                <a className='my-font'>
                                                                    <i className="fas fa-angle-double-right"/> Ứng tuyển ngay
                                                                </a>
                                                            </div>
                                                            <div className="job-tittle job-title2">
                                                                <ul className="my-font mt-30">
                                                                    <li style={{ color: "black" }} >
                                                                        <i className="fas fa-clock text-dark"/>
                                                                        Hạn ứng tuyển: {formatDate(item.ApplyEndDate)}
                                                                    </li>
                                                                    <li style={{ color: "black" }} >
                                                                        <i className="fas fa-calendar-plus text-dark"/>
                                                                        Ngày đăng: {formatDate(item.UploadDate)}
                                                                    </li>
                                                                    <li style={{ color: "black" }} >
                                                                        <i className="fas fa-edit text-dark"/>
                                                                        Thời điểm cập nhật: {formatDate(item.UpdateAt) + " - "}
                                                                        {String(item.UpdateAt).substring(11, 19)}
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Link>
                                            </div>
                                        </section>
                                    </div>
                                )
                            })}
                        </div>
                        {
                            (!latestJobs || latestJobs && latestJobs.length === 0) &&
                            (
                                <div style={{ textAlign: 'center', marginTop: "20px" }}>
                                    Không có dữ liệu
                                </div>
                            )
                        }
                    </div>
                </section>
                <div className="apply-process-area apply-bg pt-150 pb-150"
                     style={{ backgroundImage: `url("assets/img/gallery/how-applybg.png")` }}>
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="section-tittle white-text text-center">
                                    <span>Quy trình tìm việc</span>
                                    <h2> Thực hiện như thế nào ?</h2>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-4 col-md-6">
                                <div className="single-process text-center mb-30">
                                    <div className="process-ion">
                                        <span className="flaticon-search"/>
                                    </div>
                                    <div className="process-cap">
                                        <h5>1. Tìm kiếm công việc</h5>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-4 col-md-6">
                                <div className="single-process text-center mb-30">
                                    <div className="process-ion">
                                        <span className="flaticon-curriculum-vitae"/>
                                    </div>
                                    <div className="process-cap">
                                        <h5>2. Ứng tuyển công việc</h5>

                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-4 col-md-6">
                                <div className="single-process text-center mb-30">
                                    <div className="process-ion">
                                        <span className="flaticon-tour"/>
                                    </div>
                                    <div className="process-cap">
                                        <h5>3. Nhận công việc</h5>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}

export default HomeMain
