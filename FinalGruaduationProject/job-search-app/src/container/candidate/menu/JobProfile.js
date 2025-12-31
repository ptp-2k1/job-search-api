import React, { useEffect, useRef, useState } from 'react'
import Converter from '../../../util/Converter';
import { toast, ToastContainer } from 'react-toastify';
import { getBranchList } from "../../../service/BranchService";
import { getEducationList } from "../../../service/EducationService";
import { getTitleList } from "../../../service/TitleService";
import { getWorkTypeList } from "../../../service/WorkTypeService";
import { getSalaryList } from "../../../service/SalaryService";
import { getExperienceList } from "../../../service/ExperienceService";
import { getJobProfile, createJobProfile, updateJobProfile } from "../../../service/JobProfileService";
import { checkDuplicateName, getLatest, uploadFile } from "../../../service/CandidateCvService";

const JobProfile = () => {
    const initialData = {
        id: null,
        branch: null,
        education: null,
        title: null,
        workType: null,
        salary: null,
        experience: null,
        isShared: 0,
        file: {
            name: "",
            base64: "",
            object: null
        },
        skillDescription: "",
        jobWish: ""
    }
    const [profile, setProfile] = useState(initialData)
    const [branches, setBranches] = useState([])
    const [educations, setEducations] = useState([])
    const [titles, setTitles] = useState([])
    const [workTypes, setWorkTypes] = useState([])
    const [salaries, setSalaries] = useState([])
    const [experiences, setExperiences] = useState([])
    const fileStatus = useRef(false);

    const getData = async () => {
        const branchList = await getBranchList()
        const educationList = await getEducationList()
        const titleList = await getTitleList()
        const workTypeList = await getWorkTypeList()
        const salaryList = await getSalaryList()
        const experienceList = await getExperienceList()

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

        const profileResult = await getJobProfile({
            id: localStorage.getItem("userId")
        })

        if(profileResult && profileResult.status === 200) {
            if(!profileResult.data.Result) {
                const fileResult = await getLatest({
                    role: 3,
                    id: localStorage.getItem("userId")
                })

                setProfile({
                    id: profileResult.data.Id,
                    branch: profileResult.data.BranchId,
                    education: profileResult.data.EducationId,
                    title: profileResult.data.TitleId,
                    workType: profileResult.data.WorkTypeId,
                    salary: profileResult.data.SalaryId,
                    experience: profileResult.data.ExperienceId,
                    file: {
                        name: fileResult.data !== null ? fileResult.data.Name : "",
                        base64: fileResult.data !== null ? fileResult.data.File : "",
                        object: fileResult.data !== null ? Converter.getFile(fileResult.data.File, fileResult.data.Name) : null
                    },
                    skillDescription: profileResult.data.SkillDescription,
                    jobWish: profileResult.data.JobWish,
                    isShared:fileResult.data !== null ? profileResult.data.IsShared : 0
                })
                fileStatus.current = true;
            }
        } else {
            toast.error("Không thể lấy thông tin hồ sơ tìm việc ngay lúc này ! Hãy thử lại sau", {
                position: toast.POSITION.TOP_RIGHT
            })
        }
    }

    let handleOnChangeFile = async (event) => {
        let file = event.target.files;
        if (file[0]) {
            if (file[0].size > 3145728) {
                toast.error("Chỉ được gửi tệp Cv với dung lượng dưới 3MB", {
                    position: toast.POSITION.TOP_RIGHT
                });
                document.getElementById("cv").files = profile.file.object
                return
            }
            const checkResult = await checkDuplicateName({
                name: file[0].name,
                id: localStorage.getItem("userId")
            })
            if(checkResult && checkResult.status === 200) {
                if(!checkResult.data.Result) {
                    const base64 = await Converter.getBase64(file[0])
                    const result = await uploadFile({
                        file: String(base64).replace("data:application/pdf;base64,", ""),
                        name: file[0].name,
                        userId: localStorage.getItem("userId"),

                    })
                    if(result && result.status === 201) {
                        setProfile({
                            ...profile,
                            file: {
                                name: file[0].name,
                                base64: String(base64).replace("data:application/pdf;base64,", ""),
                                object: file
                            }
                        })
                    } else {
                        document.getElementById("cv").files = profile.file.object
                        toast.error("Tải cv lên hệ thống thất bại ! Hãy thử lại sau", {
                            position: toast.POSITION.TOP_RIGHT
                        });
                    }
                } else {
                    document.getElementById("cv").files = profile.file.object
                    toast.warn("Tên cv này đã bị trùng với cv khác mà bạn đã tải lên hệ thống ! Vui lòng đặt tên khác", {
                        position: toast.POSITION.TOP_RIGHT
                    });
                }
            } else {
                document.getElementById("cv").files = profile.file.object
                toast.error("Kiểm tra thông tin thất bại ! Hãy thử lại sau", {
                    position: toast.POSITION.TOP_RIGHT
                });
            }
        }
    }

    const handleOnChange = (event) => {
        const { name, value, checked } = event.target;
        if(name !== "isShared") {
            setProfile({ ...profile, [name]: value });
        } else {
            if(checked && !profile.file.object) {
                toast.warn("Bạn cần có cv tìm việc trên hệ thống để chia sẻ đến nhà tuyển dụng ! Hãy tải cv lên ngay", {
                    position: toast.POSITION.TOP_RIGHT
                });
            } else {
                setProfile({ ...profile, [name]: checked })
            }
        }
    };

    const previewFile = () => {
        if(profile.file.object) {
            const blobUrl = URL.createObjectURL(profile.file.object[0]);
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
        if(profile.file.base64) {
            const linkSource = `data:application/pdf;base64,${profile.file.base64}`;
            const downloadLink = document.createElement("a");
            downloadLink.href = linkSource;
            downloadLink.download = profile.file.name;
            downloadLink.click();
        } else {
            toast.error("Không có tệp nào để tải xuống", {
                position: toast.POSITION.TOP_RIGHT
            });
        }
    }

    let handleSave = async () => {
        const result = profile.id ? await updateJobProfile({
            id: profile.id,
            branchId: profile.branch,
            educationId: profile.education,
            titleId: profile.title,
            workTypeId: profile.workType,
            salaryId: profile.salary,
            experienceId: profile.experience,
            isShared: profile.isShared,
            skillDescription: profile.skillDescription,
            jobWish: profile.jobWish,
        }) : await createJobProfile({
            branchId: profile.branch,
            educationId: profile.education,
            titleId: profile.title,
            workTypeId: profile.workType,
            salaryId: profile.salary,
            experienceId: profile.experience,
            isShared: profile.isShared,
            skillDescription: profile.skillDescription,
            jobWish: profile.jobWish,
            userId: localStorage.getItem("userId")
        })

        if(result && (profile.id ? result.status === 200 : result.status === 201)) {
            if(profile.id) {
                toast.success("Cập nhật hồ sơ tìm việc thành công", {
                    position: toast.POSITION.TOP_RIGHT
                });
            } else {
                toast.success("Thêm mới hồ sơ tìm việc thành công", {
                    position: toast.POSITION.TOP_RIGHT
                });
            }
        } else {
            toast.error(`${profile.id ? "Cập nhật" : "Thêm mới"} hồ sơ tìm việc thất bại ! Hãy thử lại sau`, {
                position: toast.POSITION.TOP_RIGHT
            });
        }
    }

    useEffect(() => {
        getData()
        if(fileStatus.current) {
            document.getElementById("cv").files = profile.file.object
        }
    }, [fileStatus.current])

    return (
        <>
            <div className="col-12 grid-margin" style={{ backgroundColor: "#eaedff"}}>
                <div className="card" style={{ backgroundColor: "#eaedff"}}>
                    <div className="card-body" >
                        <h4 className="card-title">Quản lý hồ sơ tìm việc</h4>
                        <form className="form-sample">
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-group row">
                                        <label className="col-sm-4 col-form-label">Ngành nghề:</label>
                                        <div className="col-sm-8 mt-3">
                                            <select
                                                className="form-control"
                                                style={{ color: "#495057", cursor: "pointer" }}
                                                name="branch"
                                                value={profile.branch}
                                                onChange={(event) => handleOnChange(event)}
                                            >
                                                <option value={null}>Không có</option>
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
                                <div className="col-md-6">
                                    <div className="form-group row">
                                        <label className="col-sm-4 col-form-label">Học vấn:</label>
                                        <div className="col-sm-8 mt-3">
                                            <select
                                                className="form-control"
                                                style={{ color: "#495057", cursor: "pointer" }}
                                                name="education"
                                                value={profile.education}
                                                onChange={(event) => handleOnChange(event)}
                                            >
                                                <option value={null}>Không có</option>
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
                            </div>
                            <div className='row'>
                                <div className="col-md-6">
                                    <div className="form-group row">
                                        <label className="col-sm-4 col-form-label">Cấp bậc:</label>
                                        <div className="col-sm-8 mt-3">
                                            <select
                                                className="form-control"
                                                style={{ color: "#495057", cursor: "pointer" }}
                                                name="title"
                                                value={profile.title}
                                                onChange={(event) => handleOnChange(event)}
                                            >
                                                <option value={null}>Không có</option>
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
                                <div className="col-md-6">
                                    <div className="form-group row">
                                        <label className="col-sm-4 col-form-label">Hình thức làm việc:</label>
                                        <div className="col-sm-8 mt-3">
                                            <select
                                                className="form-control"
                                                style={{ color: "#495057", cursor: "pointer" }}
                                                name="workType"
                                                value={profile.workType}
                                                onChange={(event) => handleOnChange(event)}
                                            >
                                                <option value={null}>Không có</option>
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
                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-group row">
                                        <label className="col-sm-4 col-form-label">Mức lương:</label>
                                        <div className="col-sm-8 mt-3">
                                            <select
                                                className="form-control"
                                                style={{ color: "#495057", cursor: "pointer" }}
                                                name="salary"
                                                value={profile.salary}
                                                onChange={(event) => handleOnChange(event)}
                                            >
                                                <option value={null}>Không có</option>
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
                                <div className="col-md-6">
                                    <div className="form-group row">
                                        <label className="col-sm-4 col-form-label">Kinh nghiệm làm việc:</label>
                                        <div className="col-sm-8 mt-3">
                                            <select
                                                className="form-control"
                                                style={{ color: "#495057", cursor: "pointer" }}
                                                name="experience"
                                                value={profile.experience}
                                                onChange={(event) => handleOnChange(event)}
                                            >
                                                <option value={null}>Không có</option>
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
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-group row">
                                        <label className="no-space-break col-md-5 required">
                                            Chia sẻ đến nhà tuyển dụng:
                                        </label>
                                        <div>
                                            <input
                                                style={{ cursor: "pointer" }}
                                                name="isShared"
                                                type="checkbox"
                                                checked={profile.isShared}
                                                onChange={handleOnChange}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group row">
                                        <label className="col-sm-4">CV của bạn (file.pdf):</label>
                                        <div className="col-sm-5">
                                            <input
                                                id="cv"
                                                className="form-control form-file"
                                                type="file"
                                                accept='.pdf'
                                                onChange={(event) => handleOnChangeFile(event)}
                                            />
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
                                <div className="col-12">
                                    <div className="form-group">
                                    <label className="col-sm-12 col-form-label">Mô tả kỹ năng, kinh nghiệm làm việc của bạn cho nhà tuyển dụng:</label>
                                    <textarea
                                        className="form-control w-100"
                                        style={{ backgroundColor: "#ffffff" }}
                                        name="skillDescription"
                                        value={profile.skillDescription}
                                        maxLength={500}
                                        spellCheck={false}
                                        cols="30"
                                        rows="15"
                                        onChange={handleOnChange}
                                    />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-12">
                                    <div className="form-group">
                                    <label className="col-sm-12 col-form-label">Chia sẻ mong muốn, nhu cầu về việc làm mà bạn đang tìm kiếm với nhà tuyển dụng:</label>
                                    <textarea
                                        className="form-control w-100"
                                        style={{ backgroundColor: "#ffffff" }}
                                        name="jobWish"
                                        value={profile.jobWish}
                                        maxLength={500}
                                        spellCheck={false}
                                        cols="30"
                                        rows="15"
                                        onChange={handleOnChange}
                                    />
                                    </div>
                                </div>
                            </div>
                            <div className="text-center">
                                <button type="button" onClick={() => handleSave()} className="btn1 btn1-primary1 btn1-icon-text">
                                    <i className="ti-file btn1-icon-prepend"/>
                                    Lưu
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <ToastContainer/>
        </>
    )
}

export default JobProfile
