import { PAGINATION } from '../../../enums/Pagination';
import React, { useEffect, useState } from 'react'
import ReactPaginate from 'react-paginate';
import Converter from "../../../util/Converter";
import { toast, ToastContainer } from "react-toastify";
import { getBranchList } from "../../../service/BranchService";
import { getEducationList } from "../../../service/EducationService";
import { getTitleList } from "../../../service/TitleService";
import { getWorkTypeList } from "../../../service/WorkTypeService";
import { getSalaryList } from "../../../service/SalaryService";
import { getExperienceList } from "../../../service/ExperienceService";
import { getProfileSearchAmount } from "../../../service/PurchasedPackageService";
import { searchProfile } from "../../../service/JobProfileService";
import { getLatest } from "../../../service/CandidateCvService";


const FindProfile = () => {
    const initialData = {
        branch: "",
        education: "",
        title: "",
        workType: "",
        salary: "",
        experience: ""
    }
    const [searchAmount, setSearchAmount] = useState(0)
    const [branches, setBranches] = useState([])
    const [educations, setEducations] = useState([])
    const [titles, setTitles] = useState([])
    const [workTypes, setWorkTypes] = useState([])
    const [salaries, setSalaries] = useState([])
    const [experiences, setExperiences] = useState([])
    const [data, setData] = useState(initialData)
    const [profiles, setProfiles] = useState([])
    const [pageCount, setPageCount] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)

    const getData = async () => {
        const profileSearchAmount = await getProfileSearchAmount({
            id: localStorage.getItem("userId")
        })
        const branchList = await getBranchList()
        const educationList = await getEducationList()
        const titleList = await getTitleList()
        const workTypeList = await getWorkTypeList()
        const salaryList = await getSalaryList()
        const experienceList = await getExperienceList()

        if(profileSearchAmount && profileSearchAmount.status === 200) {
            setSearchAmount(profileSearchAmount.data.Total)
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
    }

    const handleOnChange = (event) => {
        const { name, value } = event.target;
        setCurrentPage(1)
        setData({ ...data, [name]: value });
    };

    const filterProfile = async () => {
        if(searchAmount) {
            const profileList = await searchProfile({
                amount: searchAmount,
                branchId: data.branch,
                educationId: data.education,
                titleId: data.title,
                workTypeId: data.workType,
                salaryId: data.salary,
                experienceId: data.experience
            })

            if(profileList && profileList.status === 200) {
                if(profileList.data) {
                    setProfiles(profileList.data.slice((currentPage-1)* PAGINATION.Row, currentPage * PAGINATION.Row))
                    setPageCount(Math.ceil(profileList.data.length / PAGINATION.Row))
                } else {
                    setProfiles([])
                    setPageCount(0)
                }
            } else {
                toast.error("Không thể lấy danh sách ứng viên ngay lúc này ! Hãy thử lại sau", {
                    position: toast.POSITION.TOP_RIGHT
                })
            }
        } else {
            setProfiles([])
            setPageCount(0)
            toast.warn("Hiện đang không có lượt tìm kiếm nào ! Hãy mua gói dịch vụ để sử dụng tính năng này", {
                position: toast.POSITION.TOP_RIGHT
            })
        }
    }

    const handleViewCv = async (userId) => {
        const file = await getLatest({
            role: 2,
            id: userId
        })

        if(file && file.status === 200) {
            if(file.data) {
                const blobUrl = URL.createObjectURL(Converter.getFile(file.data.File, file.data.Name)[0]);
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
        } else {
            toast.error("Lấy thông tin cv của ứng viên thất bại", {
                position: toast.POSITION.TOP_RIGHT
            });
        }
    }

    const handleChangePage = (page) => {
        if(page) {
            setCurrentPage(page.selected + 1)
        }
    }

    useEffect(() => {
        if(searchAmount === 0) {
            getData()
        } else {
            filterProfile()
        }
    }, [searchAmount, data.branch, data.education, data.title, data.workType, data.salary, data.experience, currentPage])

    return (
        <main>
            <div className="col-12 grid-margin" style={{backgroundColor: "#eaedff"}}>
                <div className="card" style={{backgroundColor: "#eaedff"}}>
                    <div className="card-body">
                        <div style={{ display: "flex" }}>
                            <h4 className="card-title mr-2">Tìm và tuyển ứng viên tiềm năng cho công ty</h4>
                            <p style={{ fontSize: "14px", lineHeight: "1.5em" }}>
                                <i>(* Số kết quả hiển thị tối đa khi tìm kiếm: {searchAmount ? searchAmount : 0} )</i>
                            </p>
                        </div>
                        <div className="row">
                            <div className="col-md-4">
                                <div className="form-group row">
                                    <div className="col-sm-8 mt-3">
                                        <select
                                            className="form-control"
                                            style={{ color: "#495057", cursor: "pointer" }}
                                            name="branch"
                                            value={data.branch}
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
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="form-group row">
                                    <div className="col-sm-8 mt-3">
                                        <select
                                            className="form-control"
                                            style={{ color: "#495057", cursor: "pointer" }}
                                            name="education"
                                            value={data.education}
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
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="form-group row">
                                    <div className="col-sm-8 mt-3">
                                        <select
                                            className="form-control"
                                            style={{ color: "#495057", cursor: "pointer" }}
                                            name="title"
                                            value={data.title}
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
                            </div>
                            <div className="col-md-4">
                                <div className="form-group row">
                                    <div className="col-sm-8 mt-3">
                                        <select
                                            className="form-control"
                                            style={{ color: "#495057", cursor: "pointer" }}
                                            name="workType"
                                            value={data.workType}
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
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="form-group row">
                                    <div className="col-sm-8 mt-3">
                                        <select
                                            className="form-control"
                                            style={{ color: "#495057", cursor: "pointer" }}
                                            name="salary"
                                            value={data.salary}
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
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="form-group row">
                                    <div className="col-sm-8 mt-3">
                                        <select
                                            className="form-control"
                                            style={{ color: "#495057", cursor: "pointer" }}
                                            name="experience"
                                            value={data.experience}
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
                            </div>
                        </div>
                        <div className="table-responsive pt-2 mb-3">
                            <table
                                className="table table-bordered table-hover"
                                style={{ borderCollapse: "collapse" }}
                            >
                                <thead style={{ position: "sticky", top: "0", borderColor: "black" }}>
                                    <tr style={{ textAlign: "center", backgroundColor: "#afcbdb" }}>
                                        <th style={{ border: "1px solid black"}} >STT</th>
                                        <th style={{ border: "1px solid black"}} >Họ tên ứng viên</th>
                                        <th style={{ border: "1px solid black"}} >Giới tính</th>
                                        <th style={{ border: "1px solid black"}} >Email</th>
                                        <th style={{ border: "1px solid black"}} >Số điện thoại</th>
                                        <th style={{ border: "1px solid black"}} >Xem hồ sơ</th>
                                        <th style={{ border: "1px solid black"}} >Xem Cv</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {profiles && profiles.length > 0 &&
                                    profiles.map((item, index) => {
                                        return (
                                            <tr key={index} style={{backgroundColor: "white" }}>
                                                <td className="text-center">{((currentPage-1) * PAGINATION.Row) + index+1}</td>
                                                <td>{item.FullName}</td>
                                                <td>{!item.Gender ? "Nam" : "Nữ"}</td>
                                                <td>{item.Email}</td>
                                                <td>{item.PhoneNumber}</td>
                                                <td>
                                                    <div className="text-center">
                                                        <a
                                                            style={{cursor: "pointer"}}
                                                            href={`profile-detail/${item.Id}`}
                                                        >
                                                            <span className="badge badge-primary">
                                                               <button
                                                                   style={{
                                                                       backgroundColor: "transparent",
                                                                       border: "none",
                                                                       cursor: "pointer"
                                                                   }}>
                                                                   <i
                                                                       className="fa fa-eye"
                                                                       style={{color: "black"}}
                                                                   />
                                                               </button>
                                                           </span>
                                                        </a>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="text-center">
                                                        <a
                                                            style={{cursor: "pointer"}}
                                                        >
                                                            <span className="badge badge-primary">
                                                               <button
                                                                   style={{
                                                                       backgroundColor: "transparent",
                                                                       border: "none",
                                                                       cursor: "pointer"
                                                                   }}
                                                                   onClick={() => handleViewCv(item.UserId)}
                                                               >
                                                                   <i
                                                                       className="fa fa-eye"
                                                                       style={{color: "black"}}
                                                                   />
                                                               </button>
                                                           </span>
                                                        </a>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                            {
                                (!profiles || profiles && profiles.length === 0) &&
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
                    </div>
                </div>
            </div>
            <ToastContainer/>
        </main>
    )
}

export default FindProfile
