import React, { useEffect, useRef, useState } from 'react'
import Converter from "../../../util/Converter"
import { toast, ToastContainer } from 'react-toastify';
import {
    getCompanyDetailFile,
    getRecruiterCompanyDetail,
    createCompany,
    updateCompany,
    // getCompanyImage, createCompanyImage, updateCompanyImage
} from "../../../service/CompanyService";
import 'react-markdown-editor-lite/lib/index.css';
import '../../home/recruitment/ApplyModal.css';

const CompanyInformation = () => {
    const initialData = {
        id: null,
        cover: "",
        logo: "",
        name: "",
        address: "",
        nation: "",
        field: "",
        email: "",
        employeeAmount: "",
        website: "",
        oldFile: "",
        file: {
            name: "",
            base64: "",
            object: null
        },
        description: ""
    }

    const [nations, setNations] = useState([])
    const [company, setCompany] = useState(initialData)
    const [upLoadFileStatus, setUpLoadFileStatus] = useState(false)
    const fileStatus = useRef(false);

    const getData = async () => {
        let countries = await import("../../../countries.json")
        countries = Object.keys(countries).map((index) => countries[index].name)

        setNations(countries)

        const companyResult = await getRecruiterCompanyDetail({
            id: localStorage.getItem("userId")
        })

        if(companyResult && companyResult.status === 200) {
            if(!companyResult.data.Result) {
                const fileDetail = await getCompanyDetailFile({
                    role: 2,
                    id: companyResult.data.File,
                    userId: localStorage.getItem("userId")
                })

                // const cover = companyResult.data.Cover !== null ? await getCompanyImage({
                //     id: companyResult.data.Cover
                // }) : null
                //
                // const logo = companyResult.data.Logo !== null ? await getCompanyImage({
                //     id: companyResult.data.Logo
                // }) : null

                setCompany({
                    id: companyResult.data.Id,
                    cover: companyResult.data.Cover,
                    logo: companyResult.data.Logo,
                    name: companyResult.data.Name,
                    address: companyResult.data.Address,
                    nation: companyResult.data.Nation,
                    field: companyResult.data.Field,
                    email: companyResult.data.Email,
                    employeeAmount: companyResult.data.EmployeeAmount,
                    website: companyResult.data.Website,
                    oldFile: companyResult.data.File,
                    file: {
                        name: fileDetail.data !== null ? fileDetail.data.Name : "",
                        base64: fileDetail.data !== null ? fileDetail.data.File : "",
                        object: fileDetail.data !== null ? Converter.getFile(fileDetail.data.File, fileDetail.data.Name) : null
                    },
                    description: companyResult.data.Description
                })
                fileStatus.current = true;
            }
        } else {
            toast.error("Không thể lấy thông tin công ty ngay lúc này ! Hãy thử lại sau", {
                position: toast.POSITION.TOP_RIGHT
            })
        }
    }

    const handleOnChangeImage = (e) => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/png, image/jpeg"
        input.style.display = "none";
        input.click();
        input.addEventListener("change", async (event) => {
            const file = event.target.files[0];
            if(e.target.name === "cover") {
                setCompany({...company, cover: "/assets/img/cover.jpg" })
            } else if(e.target.name === "logo") {
                setCompany({...company, logo: "/assets/img/logo.png" })
                console.log((window.URL || window.webkitURL).createObjectURL(file))
            }
        });
    }

    let handleOnChangeFile = async (event) => {
        let file = event.target.files;
        if (file[0]) {
            if (file[0].size > 3145728) {
                toast.error("Chỉ được gửi tệp Cv với dung lượng dưới 3MB", {
                    position: toast.POSITION.TOP_RIGHT
                });
                if(!company.file.object) {
                    document.getElementById("profile").value = ""
                } else {
                    document.getElementById("profile").files = company.file.object
                }
            } else {
                const base64 = await Converter.getBase64(file[0])
                setCompany({
                    ...company,
                    file: {
                        name: file[0].name,
                        base64: String(base64).replace("data:application/pdf;base64,", ""),
                        object: file
                    }
                })
            }
        }
    }

    const handleOnChange = (event) => {
        const { name, value, checked } = event.target;
        setCompany({ ...company, [name]: name !== "isShared" ? value : checked });
    };

    const previewFile = () => {
        if(company.file.object) {
            const blobUrl = URL.createObjectURL(company.file.object[0]);
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
        if(company.file.object) {
            const linkSource = `data:application/pdf;base64,${company.file.base64}`;
            const downloadLink = document.createElement("a");
            downloadLink.href = linkSource;
            downloadLink.download = company.file.name;
            downloadLink.click();
        } else {
            toast.error("Không có tệp nào để tải xuống", {
                position: toast.POSITION.TOP_RIGHT
            });
        }
    }

    const validate = () => {
        if(!Converter.validate(company.name, "empty")) {
            toast.warn("Tên công ty không được rỗng", {
                position: toast.POSITION.TOP_RIGHT
            });
            return false
        }
        if(!Converter.validate(company.address, "empty")) {
            toast.warn("Địa chỉ không được rỗng", {
                position: toast.POSITION.TOP_RIGHT
            });
            return false
        }
        if(company.nation === "") {
            toast.warn("Quốc gia không được rỗng", {
                position: toast.POSITION.TOP_RIGHT
            });
            return false
        }
        if(!Converter.validate(company.field, "empty")) {
            toast.warn("Lĩnh vực không được rỗng", {
                position: toast.POSITION.TOP_RIGHT
            });
            return false
        }
        if(!Converter.validate(company.email, "empty")) {
            toast.warn("Email không được rỗng", {
                position: toast.POSITION.TOP_RIGHT
            });
            return false
        }
        if(!Converter.validate(String(company.employeeAmount), "empty")) {
            toast.warn("Số lượng nhân viên không được rỗng", {
                position: toast.POSITION.TOP_RIGHT
            });
            return false
        }
        if(!Converter.validate(company.website, "empty")) {
            toast.warn("Website không được rỗng", {
                position: toast.POSITION.TOP_RIGHT
            });
            return false
        }
        if(!Converter.validate(company.file.base64, "empty")) {
            toast.warn("Hãy tải lên tệp hồ sơ công ty để chúng tôi xác thực", {
                position: toast.POSITION.TOP_RIGHT
            });
            return false
        }
        if(!Converter.validate(company.description, "empty")) {
            toast.warn("Mô tả không được rỗng", {
                position: toast.POSITION.TOP_RIGHT
            });
            return false
        }
        if(!Converter.validate(company.website, "webSite")) {
            toast.warn("Website không tồn tại", {
                position: toast.POSITION.TOP_RIGHT
            });
            return false
        }

        return true
    }

    let handleSave = async () => {

        if(!validate()) {
            return
        }
        const result = company.id ? await updateCompany({
            cover: company.cover,
            logo: company.logo,
            name: company.name,
            address: company.address,
            nation: company.nation,
            field: company.field,
            email: company.email,
            employeeAmount: company.employeeAmount,
            website: company.website,
            description: company.description,
            oldFile: company.oldFile,
            fileName: company.file.name,
            file: company.file.base64,
            id: company.id,
            userId: localStorage.getItem("userId")
        }) : await createCompany({
            cover: company.cover,
            logo: company.logo,
            name: company.name,
            address: company.address,
            nation: company.nation,
            field: company.field,
            email: company.email,
            employeeAmount: company.employeeAmount,
            website: company.website,
            description: company.description,
            fileName: company.file.name,
            file: company.file.base64,
            userId: localStorage.getItem("userId")
        })

/*        if(company.cover.base64 !== "") {
            let result
            if(company.cover.id === "") {
                result = await createCompanyImage({
                    file: company.cover.base64.replace("data:image/png;base64,", "").replace("data:image/jpeg;base64,", ""),
                    id: company.id,
                    type: "cover"
                })
            }  else {
                result = await updateCompanyImage({
                    oldFile: company.cover.id,
                    file: company.cover.base64.replace("data:image/png;base64,", "").replace("data:image/jpeg;base64,", ""),
                    id: company.id,
                    type: "cover"
                })
            }
            if(!(result && result.status === 200)) {
                toast.error("Cập nhật ảnh bìa thất bại ! Hãy thử lại sau", {
                    position: toast.POSITION.TOP_RIGHT
                });
            }
        }

        if(company.logo.base64 !== "") {
            let result
            if(company.logo.id === "") {
                result = await createCompanyImage({
                    file: company.logo.base64.replace("data:image/png;base64,", "").replace("data:image/jpeg;base64,", ""),
                    id: company.id,
                    type: "logo"
                })
            }  else {
                result = await updateCompanyImage({
                    oldFile: company.logo.id,
                    file: company.logo.base64.replace("data:image/png;base64,", "").replace("data:image/jpeg;base64,", ""),
                    id: company.id,
                    type: "logo"
                })
            }
            if(!(result && result.status === 200)) {
                toast.error("Cập nhật logo thất bại ! Hãy thử lại sau", {
                    position: toast.POSITION.TOP_RIGHT
                });
            }
        }*/

        if(result && (company.id ? result.status === 200 : result.status === 201)) {
            if(company.id) {
                toast.success("Cập nhật hồ sơ công ty thành công", {
                    position: toast.POSITION.TOP_RIGHT
                });
            } else {
                toast.success("Thêm mới hồ sơ công ty thành công ! Chúng tôi sẽ xác thực công ty của bạn nhanh nhất có thể", {
                    position: toast.POSITION.TOP_RIGHT
                });
            }
            setUpLoadFileStatus(!upLoadFileStatus)
        } else {
            toast.error(`${company.id ? "Cập nhật" : "Thêm mới"} hồ sơ công ty thất bại ! Hãy thử lại sau`, {
                position: toast.POSITION.TOP_RIGHT
            });
        }
    }

    useEffect(() => {
        getData()
        if(fileStatus.current) {
            document.getElementById("profile").files = company.file.object
        }
    }, [fileStatus.current, upLoadFileStatus])

    return (
        <>
            <div className="col-12 grid-margin" style={{backgroundColor: "#eaedff"}}>
                <div className="card" style={{backgroundColor: "#eaedff"}}>
                    <div className="card-body">
                        <h4 className="card-title">Thông tin công ty</h4>
                        <form className="form-sample">
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="form-group row">
                                        <label className="col-sm-2 col-form-label">Ảnh bìa<br/>(ấn vào ảnh để thay đổi):</label>
                                        <div className="col-sm-10">
                                            <a href="#">
                                                <img
                                                    name="cover"
                                                    src={company.cover}
                                                    alt="&#160;&#160;Chọn ảnh"
                                                    style={{
                                                        width: "100%",
                                                        height: "236px",
                                                        backgroundColor: "#ffffff",
                                                        color: "#000000",
                                                        marginTop: "15px"
                                                    }}
                                                    onClick={(event) => handleOnChangeImage(event)}
                                                />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="form-group row">
                                        <label className="col-sm-2 col-form-label">Logo<br/>(ấn vào ảnh để thay đổi):</label>
                                        <div className="col-sm-10">
                                            <a href="#">
                                                <img
                                                    name="logo"
                                                    src={company.logo}
                                                    alt="&#160;&#160;Chọn ảnh"
                                                    style={{
                                                        width: "150px",
                                                        height: "150px",
                                                        backgroundColor: "#ffffff",
                                                        color: "#000000",
                                                        marginTop: "15px"
                                                    }}
                                                    onClick={(event) => handleOnChangeImage(event)}
                                                />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-group row">
                                        <label className="col-sm-4 col-form-label">Tên:</label>
                                        <div className="col-sm-8">
                                            <input
                                                className="form-control"
                                                type="text"
                                                name="name"
                                                value={company.name}
                                                maxLength={50}
                                                onChange={(event) => handleOnChange(event)}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group row">
                                        <label className="col-sm-4 col-form-label">Địa chỉ:</label>
                                        <div className="col-sm-8">
                                            <input
                                                className="form-control"
                                                type="text"
                                                name="address"
                                                value={company.address}
                                                maxLength={80}
                                                onChange={(event) => handleOnChange(event)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-group row">
                                        <label className="col-sm-4 col-form-label">Quốc gia:</label>
                                        <div className="col-sm-8">
                                            <select
                                                className="form-control"
                                                style={{ color: "#495057", cursor: "pointer" }}
                                                name="nation"
                                                value={company.nation}
                                                onChange={(event) => handleOnChange(event)}
                                            >
                                                <option value={""}>Không có</option>
                                                {nations && nations.length > 0 &&
                                                nations.map((item, index) => {
                                                    return (
                                                        <option key={index} value={index}>{item}</option>
                                                    )
                                                })}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group row">
                                        <label className="col-sm-4 col-form-label">Lĩnh vực:</label>
                                        <div className="col-sm-8">
                                            <input
                                                className="form-control"
                                                type="text"
                                                name="field"
                                                value={company.field}
                                                maxLength={50}
                                                onChange={(event) => handleOnChange(event)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-group row">
                                        <label className="col-sm-4 col-form-label">Email:</label>
                                        <div className="col-sm-8">
                                            <input
                                                className="form-control"
                                                type="email"
                                                name="email"
                                                value={company.email}
                                                maxLength={50}
                                                onChange={(event) => handleOnChange(event)}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group row">
                                        <label className="col-sm-4 col-form-label">Số lượng nhân viên:</label>
                                        <div className="col-sm-8">
                                            <input
                                                className="form-control"
                                                type="text"
                                                name="employeeAmount"
                                                value={company.employeeAmount}
                                                maxLength={10}
                                                onChange={(event) => handleOnChange(event)}
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
                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-group row">
                                        <label className="col-sm-4 col-form-label">Website:</label>
                                        <div className="col-sm-8">
                                            <input
                                                className="form-control"
                                                type="url"
                                                name="website"
                                                value={company.website}
                                                maxLength={30}
                                                onChange={(event) => handleOnChange(event)}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group row">
                                        <label className="col-sm-4">Hồ sơ xác thực (file.pdf):</label>
                                        <div className="col-sm-5">
                                            <input
                                                id="profile"
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
                                <div className="col-md-12">
                                    <div className="form-group row">
                                        <label className="col-sm-2 col-form-label">Mô tả chi tiết:</label>
                                        <div className="col-sm-10">
                                        <textarea
                                            className="form-control"
                                            style={{ backgroundColor: "#ffffff" }}
                                            name="description"
                                            value={company.description}
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
                            <div className="text-center">
                                <button
                                    type="button"
                                    className="btn1 btn1-primary1 btn1-icon-text"
                                    onClick={() => handleSave()}
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

export default CompanyInformation
