import React, { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom";
import Converter from "../../../util/Converter";
import { toast, ToastContainer } from 'react-toastify';
import Multiselect from 'multiselect-react-dropdown';
import { getEducationList } from "../../../service/EducationService";
import { getTitleList } from "../../../service/TitleService";
import { getWorkTypeList } from "../../../service/WorkTypeService";
import { getSalaryList } from "../../../service/SalaryService";
import { getExperienceList } from "../../../service/ExperienceService";
import { getLatestId, getRecruiterPostDetail, createPost, updatePost } from "../../../service/PostService";
import { getBranchList } from "../../../service/BranchService";
import { getAreaList } from "../../../service/AreaService";
import { getPostPriorityList } from "../../../service/PostPriorityService";
import { getBranchRecruitmentDetail, createBranchRecruitment, updateBranchRecruitment } from "../../../service/BranchRecruitmentService";
import { getAreaRecruitmentDetail, createAreaRecruitment, updateAreaRecruitment } from "../../../service/AreaRecruitmentService";
import { getAvailable } from "../../../service/PurchasedPackageService";
import { createPostPackages } from "../../../service/PostPackagesService";
import 'react-markdown-editor-lite/lib/index.css';
import { checkCompanyStatus } from "../../../service/CompanyService";

const PostManagement = () => {
    const initialData = {
        id: null,
        title: "",
        appliedPackageId: "",
        newAppliedPackageId: "",
        postPriorityId: "",
        applyEndDate: "",
        recruitAmount: "",
        educationId: "",
        titleId: "",
        workTypeId: "",
        salaryId: "",
        experienceId: "",
        branches: [],
        areas: [],
        recruitDetail: "",
        requirement: "",
        right: "",
        address: "",
        status: null,
        uploadDate: "",
        updateAt: "",
        expiredDate: ""
    }
    const [educations, setEducations] = useState([])
    const [titles, setTitles] = useState([])
    const [workTypes, setWorkTypes] = useState([])
    const [salaries, setSalaries] = useState([])
    const [experiences, setExperiences] = useState([])
    const [branches, setBranches] = useState([])
    const [areas, setAreas] = useState([])
    const [postPriorities, setPostPriorities] = useState([])
    const [packages, setPackages] = useState([])
    const [post, setPost] = useState(initialData)
    const [branchList, setBranchList] = useState("")
    const [areaList, setAreaList] = useState("")
    const [buyPost, setBuyPost] = useState(false)
    const [hotWeight, setHotWeight] = useState("0")
    const [change, setChange] = useState(false)
    const navigate = useNavigate()
    const { id } = useParams();

    let getData = async () => {
        const educationList = await getEducationList()
        const titleList = await getTitleList()
        const workTypeList = await getWorkTypeList()
        const salaryList = await getSalaryList()
        const experienceList = await getExperienceList()
        const branchList = await getBranchList()
        const areaList = await getAreaList()
        const postPriorityList = await getPostPriorityList()
        const packageList = await getAvailable({
            id: localStorage.getItem("userId")
        })

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

        if(branchList && branchList.status === 200) {
            setBranches(branchList.data.map(item => ({["value"]: item.Id, ["label"]: item.Name})))
        }

        if(areaList && areaList.status === 200) {
            setAreas(areaList.data.map(item => ({["value"]: item.Id, ["label"]: item.Name})))
        }

        if(postPriorityList && postPriorityList.status === 200) {
            setPostPriorities(postPriorityList.data)
        }

        if(packageList && packageList.status === 200) {
            setPackages(packageList.data)
        }
    }

    const getPostDetail = async () => {
        const postDetail = await getRecruiterPostDetail({
            id: id
        })

        const branchRecruitmentDetail = await getBranchRecruitmentDetail(id)
        const areaRecruitmentDetail = await getAreaRecruitmentDetail(id)

        if(postDetail && postDetail.status === 200) {
            const branches = branchRecruitmentDetail.data.map(item => ({["value"]: item.Id, ["label"]: item.Name}))
            const areas = areaRecruitmentDetail.data.map(item => ({["value"]: item.Id, ["label"]: item.Name}))
            setPost({
                id: postDetail.data.Id,
                title: postDetail.data.Title,
                appliedPackageId: !compareDate(postDetail.data.ExpiredDate) ? String(postDetail.data.AppliedPackageId) : "",
                newAppliedPackageId: "",
                postPriorityId: String(postDetail.data.PostPriorityId),
                applyEndDate: postDetail.data.ApplyEndDate.substring(0, 10),
                recruitAmount: String(postDetail.data.RecruitAmount),
                educationId: String(postDetail.data.EducationId),
                titleId: String(postDetail.data.TitleId),
                workTypeId: String(postDetail.data.WorkTypeId),
                salaryId: String(postDetail.data.SalaryId),
                experienceId: String(postDetail.data.ExperienceId),
                branches: branches,
                areas: areas,
                recruitDetail: postDetail.data.RecruitDetail,
                requirement: postDetail.data.Requirement,
                right: postDetail.data.Right,
                address: postDetail.data.Address,
                status: postDetail.data.Status,
                uploadDate: postDetail.data.UploadDate,
                updateAt: postDetail.data.UpdateAt,
                expiredDate: postDetail.data.ExpiredDate
            })
            updateBranchList(branches)
            updateAreaList(areas)
        } else {
            toast.error("Không thể lấy thông tin bài đăng tuyển ngay lúc này ! Hãy thử lại sau", {
                position: toast.POSITION.TOP_RIGHT
            })
        }
    }

    const handleOnChange = (event) => {
        const { name, value } = event.target;
        setPost({ ...post, [name]: value });
        if(name === "newAppliedPackageId") {
            setBuyPost(value !== "")
        }
    };

    const handleOnChangeHotWeight = (event) => {
        const price = event.target.value
        setHotWeight(new Intl.NumberFormat('en-DE').format(String(price).replaceAll(",", "").replaceAll(".", "")))
    }

    const updateBranchList = (branchList) => {
        let branches = ""
        Object.keys(branchList).map((index) => {
            if(branches === "") {
                branches = branchList[index].label
            } else {
                branches = branches + ", " + branchList[index].label
            }
        })
        setBranchList(branches)
    }

    const updateAreaList = (areaList) => {
        let areas = ""
        Object.keys(areaList).map((index) => {
            if(areas === "") {
                areas = areaList[index].label
            } else {
                areas = areas + ", " + areaList[index].label
            }
        })
        setAreaList(areas)
    }

    const validate = () => {
        if(!Converter.validate(post.title, "empty")) {
            toast.warn("Tiêu đề không được rỗng", {
                position: toast.POSITION.TOP_RIGHT
            });
            return false
        }
        if(!Converter.validate(post.newAppliedPackageId, "empty") && !id) {
            toast.warn("Phải chọn gói áp dụng cho bài đăng tuyển", {
                position: toast.POSITION.TOP_RIGHT
            });
            return false
        }
        if(buyPost) {
            if(hotWeight === "0") {
                toast.warn("Số tiền áp dụng cho bài đăng phải lớn hơn 0", {
                    position: toast.POSITION.TOP_RIGHT
                });
                return false
            } else if(Number(packages.filter(item => Number(item.Id) === Number(post.newAppliedPackageId))[0].Remain) < Number(hotWeight.replaceAll(".", ""))) {
                toast.warn("Số tiền còn lại của gói không đủ để áp dụng cho bài đăng", {
                    position: toast.POSITION.TOP_RIGHT
                })
                return false
            }
        }
        if(!Date.parse(post.applyEndDate)) {
            toast.warn("Phải chọn hạn ứng tuyển", {
                position: toast.POSITION.TOP_RIGHT
            });
            return false
        }
        if(!Converter.validate(post.postPriorityId, "empty")) {
            toast.warn("Phải chọn độ ưu tiên tuyển dụng", {
                position: toast.POSITION.TOP_RIGHT
            });
            return false
        }
        if(!Converter.validate(post.recruitAmount, "empty")) {
            toast.warn("Số lượng tuyển không được rỗng", {
                position: toast.POSITION.TOP_RIGHT
            });
            return false
        }
        if(!Converter.validate(post.educationId, "empty")) {
            toast.warn("Phải chọn học vấn", {
                position: toast.POSITION.TOP_RIGHT
            });
            return false
        }
        if(!Converter.validate(post.titleId, "empty")) {
            toast.warn("Phải chọn cấp bậc", {
                position: toast.POSITION.TOP_RIGHT
            });
            return false
        }
        if(!Converter.validate(post.workTypeId, "empty")) {
            toast.warn("Phải chọn loại hình công việc", {
                position: toast.POSITION.TOP_RIGHT
            });
            return false
        }
        if(!Converter.validate(post.salaryId, "empty")) {
            toast.warn("Phải chọn mức lương", {
                position: toast.POSITION.TOP_RIGHT
            });
            return false
        }
        if(!Converter.validate(post.experienceId, "empty")) {
            toast.warn("Phải chọn kinh nghiệm", {
                position: toast.POSITION.TOP_RIGHT
            });
            return false
        }
        if(post.branches.length === 0) {
            toast.warn("Phải chọn danh sách ngành nghề tuyển dụng", {
                position: toast.POSITION.TOP_RIGHT
            });
            return false
        }
        if(post.areas.length === 0) {
            toast.warn("Phải chọn danh sách khu vực tuyển dụng", {
                position: toast.POSITION.TOP_RIGHT
            });
            return false
        }
        if(!Converter.validate(post.recruitDetail, "empty")) {
            toast.warn("Phải điền mục chi tiết tuyển dụng", {
                position: toast.POSITION.TOP_RIGHT
            });
            return false
        }
        if(!Converter.validate(post.requirement, "empty")) {
            toast.warn("Phải điền mục yêu cầu ứng viên", {
                position: toast.POSITION.TOP_RIGHT
            });
            return false
        }
        if(!Converter.validate(post.right, "empty")) {
            toast.warn("Phải điền mục quyền lợi", {
                position: toast.POSITION.TOP_RIGHT
            });
            return false
        }
        if(!Converter.validate(post.address, "empty")) {
            toast.warn("Phải điền mục địa điểm làm việc", {
                position: toast.POSITION.TOP_RIGHT
            });
            return false
        }
        if(Date.parse(post.applyEndDate) < Date.parse(new Date().toISOString().slice(0, 10))) {
            toast.warn("Hạn ứng tuyển không được nhỏ hơn hôm nay", {
                position: toast.POSITION.TOP_RIGHT
            });
            return false
        }
        return true
    }

    const handleSave = async (event) => {
        event.preventDefault()

        const result = await checkCompanyStatus({
            userId: localStorage.getItem("userId")
        })

        if(result && result.status === 200) {
            if(!result.data.Status) {
                toast.error("Công ty của bạn hiện đang chưa xác thực nên không thể đăng mới hoặc chỉnh sửa bài tuyển dụng ! Vui lòng liên hệ với nhà quản trị hệ thống", {
                    position: toast.POSITION.TOP_RIGHT
                })
                return
            }
        } else {
            toast.error("Kiểm tra thông tin thất bại ! Hãy thử lại sau", {
                position: toast.POSITION.TOP_RIGHT
            })
            return
        }

        if(!validate()) {
            return
        }

        if(post.id) {
            const postResult = await updatePost({
                title: post.title,
                recruitAmount: post.recruitAmount,
                educationId: post.educationId,
                titleId: post.titleId,
                workTypeId: post.workTypeId,
                salaryId: post.salaryId,
                experienceId: post.experienceId,
                recruitDetail: post.recruitDetail,
                requirement: post.requirement,
                right: post.right,
                address: post.address,
                applyEndDate: post.applyEndDate,
                postPriorityId: post.postPriorityId,
                id: post.id
            })
            const branchRecruitmentResult = await updateBranchRecruitment({
                postId: post.id,
                branchList: post.branches
            })
            const areaRecruitmentResult = await updateAreaRecruitment({
                postId: post.id,
                areaList: post.areas
            })

            const postPackagesResult = post.newAppliedPackageId ? await createPostPackages({
                postId: post.id,
                purchasedPackageId: packages.filter(item => Number(item.Id) === Number(post.newAppliedPackageId))[0].Id,
                hotWeight: Number(hotWeight.replaceAll(".", "")),
                postShowDayAmount: packages.filter(item => Number(item.Id) === Number(post.newAppliedPackageId))[0].PostShowDayAmount,
                purchasePostBudget: packages.filter(item => Number(item.Id) === Number(post.newAppliedPackageId))[0].PurchasePostBudget,
                expiredDate: post.expiredDate.substring(0, 10)
            }) : true

            if(postResult && postResult.status === 200 && branchRecruitmentResult && branchRecruitmentResult.status === 200 && areaRecruitmentResult && areaRecruitmentResult.status === 200) {
                if(post.newAppliedPackageId) {
                    if(postPackagesResult && postPackagesResult.status === 201) {
                        toast.success("Cập nhật bài đăng tuyển thành công", {
                            position: toast.POSITION.TOP_RIGHT
                        });
                        setChange(!change)
                    } else {
                        toast.error("Cập nhật bài đăng tuyển thất bại ! Hãy thử lại sau", {
                            position: toast.POSITION.TOP_RIGHT
                        });
                    }
                } else {
                    toast.success("Cập nhật bài đăng tuyển thành công", {
                        position: toast.POSITION.TOP_RIGHT
                    });
                    setChange(!change)
                }
            } else {
                toast.error("Cập nhật bài đăng tuyển thất bại ! Hãy thử lại sau", {
                    position: toast.POSITION.TOP_RIGHT
                });
            }
        } else {
            const postResult = await createPost({
                title: post.title,
                recruitAmount: post.recruitAmount,
                educationId: post.educationId,
                titleId: post.titleId,
                workTypeId: post.workTypeId,
                salaryId: post.salaryId,
                experienceId: post.experienceId,
                recruitDetail: post.recruitDetail,
                requirement: post.requirement,
                right: post.right,
                address: post.address,
                applyEndDate: post.applyEndDate,
                postPriorityId: post.postPriorityId,
                userId: localStorage.getItem("userId")
            })

            if(postResult && postResult.status === 201) {
                const result = await getLatestId()

                if(result && result.status === 200) {
                    const appliedPackage = packages.filter(item => Number(item.Id) === Number(post.newAppliedPackageId))[0]
                    const branchRecruitmentResult = await createBranchRecruitment({
                        postId: result.data.Id,
                        branchList: post.branches
                    })
                    const areaRecruitmentResult = await createAreaRecruitment({
                        postId: result.data.Id,
                        areaList: post.areas
                    })
                    const postPackagesResult = await createPostPackages({
                        postId: result.data.Id,
                        purchasedPackageId: appliedPackage.Id,
                        hotWeight: Math.round(Number(hotWeight.replaceAll(".", ""))),
                        postShowDayAmount: appliedPackage.PostShowDayAmount,
                        purchasePostBudget: appliedPackage.PurchasePostBudget,
                        expiredDate: null
                    })

                    if(branchRecruitmentResult && branchRecruitmentResult.status === 201 && areaRecruitmentResult && areaRecruitmentResult.status === 201 && postPackagesResult && postPackagesResult.status === 201) {
                        toast.success("Đăng bài tuyển dụng thành công", {
                            position: toast.POSITION.TOP_RIGHT
                        });
                        setPost(initialData)
                        setBuyPost(false)
                        setBranchList("")
                        setAreaList("")
                    } else {
                        toast.error("Đăng bài tuyển dụng thất bại ! Hãy thử lại sau", {
                            position: toast.POSITION.TOP_RIGHT
                        });
                    }
                }
            }
        }

    }

    const formatDate = (date) => {
        if(date) {
            let dateRaw = date.substring(0, 10).split("-");
            return dateRaw[2] + "/" + dateRaw[1] + "/" + dateRaw[0];
        }
    }

    const compareDate = (date) => {
        if(date) {
            return Date.parse(date.substring(0, 10)) <= Date.parse(new Date().toISOString().slice(0, 10))
        }
    }

    const formatCurrency = (price) => {
        return new Intl.NumberFormat('vi', { style: "currency", currency: "VND" }).format(price)
    }

    useEffect(() => {
        getData()
        if(id) {
            getPostDetail()
        }
    }, [])

    return (
        <>
            <div onClick={() => navigate(-1)}
                 style={{ cursor: "pointer", margin: "10px 30px -10px", textAlign: "left"}}>
                <i className="fa-solid fa-arrow-left mr-2"/>
                Quay lại
            </div>
            <div className="col-12 mt-20 mb-35 grid-margin" style={{backgroundColor: "#eaedff"}}>
                <div className="card" style={{backgroundColor: "#eaedff"}}>
                    <div className="card-body">
                        <h4 className="card-title">Thông tin bài đăng tuyển</h4>
                        <br/>
                        <form className="form-sample">
                            {
                                id &&
                                (
                                    <div className="row">
                                        <div className="col-md-3">
                                            <div className="form-group row">
                                                <label className="col-sm-6 col-form-label">
                                                    <strong>Ngày đăng:</strong>
                                                </label>
                                                <label className="col-sm-6 col-form-label">
                                                    {formatDate(post.uploadDate)}
                                                </label>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="form-group row">
                                                <label className="col-sm-6 col-form-label">
                                                    <strong>Ngày cập nhật:</strong>
                                                </label>
                                                <label className="col-sm-6 col-form-label">
                                                    {formatDate(post.updateAt)}
                                                </label>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="form-group row">
                                                <label className="col-sm-6 col-form-label">
                                                    <strong>Trạng thái:</strong>
                                                </label>
                                                <label
                                                    className="col-sm-6 col-form-label"
                                                    style={ !post.status ? { color: "red" } : { color: "green" }}
                                                >
                                                    {post.status !== 1 ? "Đang ẩn" : "Đang hiện"}
                                                </label>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="form-group row">
                                                <label className="col-sm-6 col-form-label">
                                                    <strong>Ngày hết hạn:</strong>
                                                </label>
                                                <label
                                                    className="col-sm-6 col-form-label"
                                                    style={ !compareDate(post.expiredDate) ? { color: "green" } : { color: "red" }}
                                                >
                                                    {formatDate(post.expiredDate)}
                                                </label>
                                            </div>
                                        </div>
                                        {
                                            compareDate(post.expiredDate) &&
                                            (
                                                <div className="col-md-12">
                                                    <div className="form-group row">
                                                        <label className="col-sm-12 col-form-label text-danger">
                                                            <strong><i>* Bài đăng này đã hết hạn tuyển dụng - vui lòng gia hạn thêm bằng cách áp các gói dịch vụ khả dụng vào bài đăng này</i></strong>
                                                        </label>
                                                    </div>
                                                </div>
                                            )
                                        }
                                    </div>
                                )
                            }
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="form-group row">
                                        <label className="col-sm-3 col-form-label">Tiêu đề:</label>
                                        <div className="col-sm-9">
                                            <input
                                                className="form-control"
                                                type="text"
                                                name="title"
                                                value={post.title}
                                                maxLength={50}
                                                onChange={handleOnChange}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {
                                post.id &&
                                (
                                    <div className="row">
                                        <div className="col-md-12">
                                            <div className="form-group row">
                                                <label className="col-sm-3 col-form-label">Gói áp dụng gần nhất:</label>
                                                <div className="col-sm-9">
                                                    <select
                                                        className="form-control"
                                                        style={{ color: "#495057", cursor: "pointer" }}
                                                        name="appliedPackageId"
                                                        value={post.appliedPackageId}
                                                        disabled={true}
                                                    >
                                                        <option value={""}>Không có</option>
                                                        {packages && packages.length > 0 &&
                                                        packages.map((item, index) => {
                                                            return (
                                                                <option key={index} value={item.Id}>
                                                                    {"Tên gói: " + item.Name + " - Tổng số ngày hiển thị bài đăng: " + item.PostShowDayAmount + " - Ngày gói hết hạn: " + formatDate(item.ExpiredDate) + " - Số tiền còn lại: " + formatCurrency(item.Remain)}
                                                                </option>
                                                            )
                                                        })}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="form-group row">
                                        <label className="col-sm-3 col-form-label">Áp dụng theo gói:</label>
                                        <div className="col-sm-9">
                                            <select
                                                className="form-control"
                                                style={{ color: "#495057", cursor: "pointer" }}
                                                name="newAppliedPackageId"
                                                value={post.newAppliedPackageId}
                                                onChange={(event) => handleOnChange(event)}
                                            >
                                                <option value={""}>Không có</option>
                                                {packages && packages.length > 0 &&
                                                packages.map((item, index) => {
                                                    if(item.Remain > 0) {
                                                        return (
                                                            <option key={index} value={item.Id}>
                                                                {"Tên gói: " + item.Name + " - Tổng số ngày hiển thị bài đăng: " + item.PostShowDayAmount + " - Ngày gói hết hạn: " + formatDate(item.ExpiredDate) + " - Số tiền còn lại: " + formatCurrency(item.Remain)}
                                                            </option>
                                                        )
                                                    }
                                                })}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                {
                                    buyPost &&
                                    (
                                        <div className="col-md-6">
                                            <div className="form-group row">
                                                <label className="col-sm-6 col-form-label">Số tiền của gói áp dụng cho bài đăng:</label>
                                                <div className="col-sm-6">
                                                    <input
                                                        className="form-control"
                                                        type="text"
                                                        value={hotWeight}
                                                        maxLength={12}
                                                        onChange={(event) => handleOnChangeHotWeight(event)}
                                                        onKeyPress={(event) => {
                                                            if (!/[0-9]/.test(event.key)) {
                                                                event.preventDefault();
                                                            }
                                                        }}
                                                        onPaste={(event) => {
                                                            event.preventDefault();
                                                            return false;
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }
                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-group row">
                                        <label className="col-sm-6 col-form-label">Độ ưu tiên tuyển dụng:</label>
                                        <div className="col-sm-6">
                                            <select
                                                className="form-control"
                                                style={{ color: "#495057", cursor: "pointer" }}
                                                name="postPriorityId"
                                                value={post.postPriorityId}
                                                onChange={(event) => handleOnChange(event)}
                                            >
                                                <option value={""}>Không có</option>
                                                {postPriorities && postPriorities.length > 0 &&
                                                postPriorities.map((item, index) => {
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
                                        <label className="col-sm-6 col-form-label">Hạn ứng tuyển:</label>
                                        <div className="col-sm-6">
                                            <input
                                                className="form-control"
                                                style={{ color: "#495057", cursor: "pointer" }}
                                                type="date"
                                                name="applyEndDate"
                                                value={post.applyEndDate}
                                                onKeyDown={false}
                                                onChange={(event) => handleOnChange(event)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-group row">
                                        <label className="col-sm-6 col-form-label">Số lượng tuyển:</label>
                                        <div className="col-sm-6">
                                            <input
                                                className="form-control"
                                                type="text"
                                                value={post.recruitAmount}
                                                name="recruitAmount"
                                                onChange={(event) => handleOnChange(event)}
                                                onKeyPress={(event) => {
                                                    if (!/[0-9]/.test(event.key)) {
                                                        event.preventDefault();
                                                    }
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group row">
                                        <label className="col-sm-6 col-form-label">Học vấn:</label>
                                        <div className="col-sm-6">
                                            <select
                                                className="form-control"
                                                style={{ color: "#495057", cursor: "pointer" }}
                                                name="educationId"
                                                value={post.educationId}
                                                onChange={(event) => handleOnChange(event)}
                                            >
                                                <option value={""}>Không có</option>
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
                                <div className="col-md-6">
                                    <div className="form-group row">
                                        <label className="col-sm-6 col-form-label">Cấp bậc:</label>
                                        <div className="col-sm-6">
                                            <select
                                                className="form-control"
                                                style={{ color: "#495057", cursor: "pointer" }}
                                                name="titleId"
                                                value={post.titleId}
                                                onChange={(event) => handleOnChange(event)}
                                            >
                                                <option value={""}>Không có</option>
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
                                        <label className="col-sm-6 col-form-label">Loại hình công việc:</label>
                                        <div className="col-sm-6">
                                            <select
                                                className="form-control"
                                                style={{ color: "#495057", cursor: "pointer" }}
                                                name="workTypeId"
                                                value={post.workTypeId}
                                                onChange={(event) => handleOnChange(event)}
                                            >
                                                <option value={""}>Không có</option>
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
                                        <label className="col-sm-6 col-form-label">Mức lương:</label>
                                        <div className="col-sm-6">
                                            <select
                                                className="form-control"
                                                style={{ color: "#495057", cursor: "pointer" }}
                                                name="salaryId"
                                                value={post.salaryId}
                                                onChange={(event) => handleOnChange(event)}
                                            >
                                                <option value={""}>Không có</option>
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
                                        <label className="col-sm-6 col-form-label">Kinh nghiệm:</label>
                                        <div className="col-sm-6">
                                            <select
                                                className="form-control"
                                                style={{ color: "#495057", cursor: "pointer" }}
                                                name="experienceId"
                                                value={post.experienceId}
                                                onChange={(event) => handleOnChange(event)}
                                            >
                                                <option value={""}>Không có</option>
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
                                <div className="col-md-12">
                                    <div className="form-group row">
                                        <label className="col-sm-3 col-form-label">Chọn ngành nghề:</label>
                                        <div className="col-sm-9" >
                                            <Multiselect
                                                style={{
                                                    searchBox: {
                                                        width: "255px",
                                                        height: "47px",
                                                        backgroundColor: "#ffffff"
                                                    },
                                                    inputField: {
                                                        marginLeft: "10px",
                                                        marginTop: "8px",
                                                        fontSize: "14px",
                                                        color: "#000000",
                                                        backgroundColor: "#ffffff"

                                                    },
                                                    option: {
                                                        color: "#000000",
                                                        backgroundColor: "#ffffff"
                                                    }
                                                }}
                                                options={branches}
                                                selectedValues={post.branches}
                                                displayValue={"label"}
                                                placeholder={"Nhập tên ngành nghề"}
                                                emptyRecordMsg={"Không tìm thấy ngành nghề này"}
                                                hideSelectedList={true}
                                                showCheckbox={true}
                                                onSelect={(selectedList) => { setPost({...post, ["branches"]: selectedList}); updateBranchList(selectedList) }}
                                                onRemove={(selectedList) => { setPost({...post, ["branches"]: selectedList}); updateBranchList(selectedList) }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="form-group row">
                                        <label className="col-sm-3 col-form-label">Danh sách ngành nghề:</label>
                                        <div className="col-sm-9">
                                            <label
                                                className="form-control"
                                                style={{ height: "fit-content", whiteSpace: "pre-wrap" }}
                                            >
                                                {branchList}
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="form-group row">
                                        <label className="col-sm-3 col-form-label">Chọn khu vực:</label>
                                        <div className="col-sm-9" >
                                            <Multiselect
                                                style={{
                                                    searchBox: {
                                                        width: "255px",
                                                        height: "47px",
                                                        backgroundColor: "#ffffff"
                                                    },
                                                    inputField: {
                                                        marginLeft: "10px",
                                                        marginTop: "8px",
                                                        fontSize: "14px",
                                                        color: "#000000",
                                                        backgroundColor: "#ffffff"

                                                    },
                                                    option: {
                                                        color: "#000000",
                                                        backgroundColor: "#ffffff"
                                                    }
                                                }}
                                                options={areas}
                                                selectedValues={post.areas}
                                                displayValue={"label"}
                                                placeholder={"Nhập tên khu vực"}
                                                emptyRecordMsg={"Không tìm thấy khu vực này"}
                                                hideSelectedList={true}
                                                showCheckbox={true}
                                                onSelect={(selectedList) => { setPost({...post, ["areas"]: selectedList}); updateAreaList(selectedList) }}
                                                onRemove={(selectedList) => { setPost({...post, ["areas"]: selectedList}); updateAreaList(selectedList) }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="form-group row">
                                        <label className="col-sm-3 col-form-label">Danh sách khu vực:</label>
                                        <div className="col-sm-9">
                                            <label
                                                className="form-control"
                                                style={{ height: "fit-content", whiteSpace: "pre-wrap" }}
                                            >
                                                {areaList}
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="form-group row">
                                        <label className="col-sm-3 col-form-label">Chi tiết tuyển dụng:</label>
                                        <div className="col-sm-9">
                                            <textarea
                                                className="form-control"
                                                name="recruitDetail"
                                                value={post.recruitDetail}
                                                maxLength={500}
                                                spellCheck={false}
                                                cols="30"
                                                rows="15"
                                                onChange={handleOnChange}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="form-group row">
                                        <label className="col-sm-3 col-form-label">Yêu cầu ứng viên:</label>
                                        <div className="col-sm-9">
                                            <textarea
                                                className="form-control"
                                                name="requirement"
                                                value={post.requirement}
                                                maxLength={500}
                                                spellCheck={false}
                                                cols="30"
                                                rows="15"
                                                onChange={handleOnChange}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="form-group row">
                                        <label className="col-sm-3 col-form-label">Quyền lợi:</label>
                                        <div className="col-sm-9">
                                            <textarea
                                                className="form-control"
                                                name="right"
                                                value={post.right}
                                                maxLength={500}
                                                spellCheck={false}
                                                cols="30"
                                                rows="15"
                                                onChange={handleOnChange}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="form-group row">
                                        <label className="col-sm-3 col-form-label">Địa điểm làm việc:</label>
                                        <div className="col-sm-9">
                                            <textarea
                                                className="form-control"
                                                name="address"
                                                value={post.address}
                                                maxLength={500}
                                                spellCheck={false}
                                                cols="30"
                                                rows="15"
                                                onChange={handleOnChange}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <br/>
                            <div className="text-center">
                                <button
                                    type="button"
                                    className="btn1 btn1-primary1 btn1-icon-text"
                                    onClick={(event) => handleSave(event)}
                                >
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

export default PostManagement
