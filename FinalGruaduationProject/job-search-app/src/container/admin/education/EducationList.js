import { PAGINATION } from '../../../enums/Pagination';
import React, { useEffect, useState } from 'react'
import ReactPaginate from 'react-paginate';
import { toast, ToastContainer } from 'react-toastify';
import { Input, Modal } from 'antd'
import { InfoCircleTwoTone } from "@ant-design/icons";
import { filterEducation, checkEducationDelete, deleteEducation } from "../../../service/EducationService";

const EducationList = () => {
    const [education, setEducation] = useState([])
    const [pageCount, setPageCount] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [search, setSearch] = useState("")
    const [dateFilter, setDateFilter] = useState({
        fromDate: "",
        toDate: ""
    })
    const [change, setChange] = useState(false)

    const handleSearch = (value) => {
        setCurrentPage(1)
        setSearch(value === "" || value === undefined || value === null ? "" : value)
    }

    const handleOnChange = (event) => {
        const { name, value } = event.target;
        setCurrentPage(1)
        setDateFilter({ ...dateFilter, [name]: value });
    }

    const handleDelete = async (id) => {
        const result = await checkEducationDelete({
            id: id
        })

        if(result && result.status === 200) {
            Modal.confirm({
                title: "Chắc chắn xóa học vấn này ?",
                icon: <InfoCircleTwoTone />,
                async onOk() {
                    if(!result.data.Result) {
                        const result = await deleteEducation(id)

                        if(result && result.status === 200) {
                            toast.success("Xóa học vấn thành công", {
                                position: toast.POSITION.TOP_RIGHT
                            });
                            setCurrentPage(1)
                            setChange(!change)
                        } else {
                            toast.error("Xóa học vấn thất bại ! Hãy thử lại sau", {
                                position: toast.POSITION.TOP_RIGHT
                            });
                        }
                    } else {
                        toast.warn("Không thể xóa vì học vấn này đã được áp dụng", {
                            position: toast.POSITION.TOP_RIGHT
                        });
                    }
                },
                onCancel() {},
            });
        } else {
            toast.error("Kiểm tra thông tin thất bại ! Hãy thử lại sau", {
                position: toast.POSITION.TOP_RIGHT
            });
        }
    }

    const getData = async () => {
        const educationList = await filterEducation({
            info: search,
            fromDate: dateFilter.fromDate,
            toDate: dateFilter.toDate
        })

        if(educationList && educationList.status === 200) {
            if(educationList.data) {
                setEducation(educationList.data.slice((currentPage-1)* PAGINATION.Row, currentPage * PAGINATION.Row))
                setPageCount(Math.ceil(educationList.data.length / PAGINATION.Row))
            } else {
                setEducation([])
                setPageCount(0)
            }
        } else {
            toast.error("Không thể lấy danh sách học vấn ngay lúc này ! Hãy thử lại sau", {
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

    const handleChangePage = (page) => {
        if(page) {
            setCurrentPage(page.selected + 1)
        }
    }

    useEffect(() => {
        getData();
    }, [search, dateFilter, change, currentPage])

    return (
        <>
            <div>
                <div className="col-12 grid-margin">
                    <div className="card">
                        <div className="card-body">
                            <h4 className="card-title">Danh sách học vấn</h4>
                            <Input.Search
                                onSearch={handleSearch}
                                className='mt-3 mb-3'
                                placeholder="Nhập tên học vấn"
                                allowClear
                                enterButton="Tìm kiếm"
                            />
                            <label
                                style={{ marginLeft: "-15px" }}
                                className="col-sm-4 col-form-label"
                            >
                                Lọc theo khoảng thời gian:
                            </label>
                            <input
                                style={{ color: "#495057", cursor: "pointer" }}
                                type="date"
                                name="fromDate"
                                value={dateFilter.fromDate}
                                onKeyDown={false}
                                onChange={(event) => handleOnChange(event)}
                            />
                            &nbsp;&nbsp;&nbsp;
                            <> - </>
                            &nbsp;&nbsp;&nbsp;
                            <input
                                style={{ color: "#495057", cursor: "pointer" }}
                                type="date"
                                name="toDate"
                                value={dateFilter.toDate}
                                onKeyDown={false}
                                onChange={(event) => handleOnChange(event)}
                            />
                            <div className="table-responsive pt-2  mb-3">
                                <table
                                    className="table table-bordered table-hover"
                                    style={{ borderCollapse: "collapse" }}
                                >
                                    <thead style={{ position: "sticky", top: "0", borderColor: "black" }}>
                                        <tr style={{ textAlign: "center", backgroundColor: "#afcbdb" }}>
                                            <th style={{ border: "1px solid black"}} >STT</th>
                                            <th style={{ border: "1px solid black"}} >Tên học vấn</th>
                                            <th style={{ border: "1px solid black"}} >Ngày tạo</th>
                                            <th style={{ border: "1px solid black"}} >Sửa / Xóa</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {education && education.length > 0 &&
                                        education.map((item, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td className="text-center">{((currentPage-1) * PAGINATION.Row) + index+1}</td>
                                                    <td>{item.Name}</td>
                                                    <td>{formatDate(item.CreateDate)}</td>
                                                    <td>
                                                        <div className="text-center">
                                                            <a
                                                                style={{ cursor: "pointer" }}
                                                                href={`education-management/${item.Id}`}
                                                            >
                                                                <span className="badge badge-warning">
                                                                   <button
                                                                       style={{
                                                                           backgroundColor: "transparent",
                                                                           border: "none",
                                                                           cursor: "pointer"
                                                                       }}>
                                                                       <i
                                                                           className="fa fa-edit"
                                                                           style={{ color: "black" }}
                                                                       />
                                                                   </button>
                                                               </span>
                                                            </a>
                                                            &nbsp;
                                                            <a style={{ cursor: "pointer" }}>
                                                                <span className="badge badge-danger">
                                                                   <button
                                                                       style={{
                                                                           backgroundColor: "transparent",
                                                                           border: "none",
                                                                           cursor: "pointer"
                                                                       }}
                                                                       onClick={() => handleDelete(item.Id)}
                                                                   >
                                                                       <i
                                                                           className="fa fa-trash"
                                                                           style={{ color: "black" }}
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
                                    (!education || education && education.length === 0) &&
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
            </div>
            <ToastContainer/>
        </>
    )
}

export default EducationList
