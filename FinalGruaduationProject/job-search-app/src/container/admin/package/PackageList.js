import { PAGINATION } from '../../../enums/Pagination';
import React, { useEffect, useState } from 'react'
import ReactPaginate from 'react-paginate';
import { toast, ToastContainer } from 'react-toastify';
import { Col, Input, Modal, Select } from 'antd';
import { InfoCircleTwoTone } from "@ant-design/icons";
import Switch from "react-switch";
import { filterPackage, changePackageStatus, checkAppliedPackage, deletePackage } from "../../../service/PackageService";

const PackageList = () => {
    const [packages, setPackages] = useState([])
    const [pageCount, setPageCount] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [search, setSearch] = useState("")
    const [dateFilter, setDateFilter] = useState({
        fromDate: "",
        toDate: ""
    })
    const [status, setStatus] = useState(null)
    const [changeStatus, setChangeStatus] = useState(false)
    const [change, setChange] = useState(false)

    const statusList = [
        {
            value: null,
            label: "Tất cả"
        },
        {
            value: 0,
            label: "Đang ẩn"
        },
        {
            value: 1,
            label: "Đang hiện"
        }
    ]

    const handleSearch = (value) => {
        setCurrentPage(1)
        setSearch(value === "" || value === undefined || value === null ? "" : value)
    }

    const handleOnChange = (event) => {
        const { name, value } = event.target;
        setCurrentPage(1)
        setDateFilter({ ...dateFilter, [name]: value });
    }

    const handleFilter = (value) => {
        setCurrentPage(1)
        setStatus(value)
    }

    const handleDelete = async (id) => {
        const result = await checkAppliedPackage({
            id: id
        })

        if(result && result.status === 200) {
            Modal.confirm({
                title: "Chắc chắn xóa gói dịch vụ này ?",
                icon: <InfoCircleTwoTone />,
                async onOk() {
                    if(!result.data.Result) {
                        const result = await deletePackage(id)

                        if(result && result.status === 200) {
                            toast.success("Xóa gói dịch vụ thành công", {
                                position: toast.POSITION.TOP_RIGHT
                            });
                            setCurrentPage(1)
                            setChange(!change)
                        } else {
                            toast.error("Xóa gói dịch vụ thất bại ! Hãy thử lại sau", {
                                position: toast.POSITION.TOP_RIGHT
                            });
                        }
                    } else {
                        toast.warn("Không thể xóa vì gói dịch vụ này đã được áp dụng", {
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
        const packageList = await filterPackage({
            info: search,
            fromDate: dateFilter.fromDate,
            toDate: dateFilter.toDate,
            status: status
        })

        if(packageList && packageList.status === 200) {
            if(packageList.data) {
                setPackages(packageList.data.slice((currentPage-1)* PAGINATION.Row, currentPage * PAGINATION.Row))
                setPageCount(Math.ceil(packageList.data.length / PAGINATION.Row))
            } else {
                setPackages([])
                setPageCount(0)
            }
        } else {
            toast.error("Không thể lấy danh sách gói dịch vụ ngay lúc này ! Hãy thử lại sau", {
                position: toast.POSITION.TOP_RIGHT
            })
        }
    }

    const confirmChangeStatus = async (id, status) => {
        if(status) {
            Modal.confirm({
                title: "Chắc chắn ẩn gói dịch vụ này ?",
                icon: <InfoCircleTwoTone />,
                async onOk() {
                    await handleChangeStatus(id, status)
                },
                onCancel() {},
            });
        } else {
            await handleChangeStatus(id, status)
        }
    }

    const handleChangeStatus = async (id, status) => {
        const result = await changePackageStatus({
            id: id,
            status: !status
        })

        if(result && result.status === 200) {
            toast.success("Thay đổi trạng thái gói dịch vụ thành công", {
                position: toast.POSITION.TOP_RIGHT
            });
        } else {
            toast.error("Thay đổi trạng thái gói dịch vụ thất bại ! Hãy thử lại sau", {
                position: toast.POSITION.TOP_RIGHT
            });
        }
        setCurrentPage(1)
        setChangeStatus(!changeStatus)
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
        getData();
    }, [search, dateFilter, status, changeStatus, change, currentPage])

    return (
        <>
            <div className="col-12 grid-margin">
                <div className="card">
                    <div className="card-body">
                        <h4 className="card-title">Danh sách gói dịch vụ</h4>
                        <Input.Search
                            className='mt-3 mb-3'
                            placeholder="Nhập tên gói dịch vụ"
                            allowClear
                            enterButton="Tìm kiếm"
                            onSearch={handleSearch}
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
                        <Col justify='space-around' className='mt-3 mb-3'>
                            <label className='mr-2'>Trạng thái: </label>
                            <Select
                                onChange={(value)=> handleFilter(value)}
                                style={{width:'110px'}}
                                value={status}
                                options={statusList}
                            />
                        </Col>
                        <div className="table-responsive pt-2 mb-3">
                            <table
                                className="table table-bordered table-hover"
                                style={{ borderCollapse: "collapse" }}
                            >
                                <thead style={{ position: "sticky", top: "0", borderColor: "black" }}>
                                <tr style={{ textAlign: "center", backgroundColor: "#afcbdb" }}>
                                    <th style={{ border: "1px solid black"}} >STT</th>
                                    <th style={{ border: "1px solid black"}} >Tên gói dịch vụ</th>
                                    <th style={{ border: "1px solid black"}} >Ngày tạo</th>
                                    <th style={{ border: "1px solid black"}} >Trạng thái</th>
                                    <th style={{ border: "1px solid black"}} >Sửa / Xóa</th>
                                </tr>
                                </thead>
                                <tbody>
                                {packages && packages.length > 0 &&
                                packages.map((item, index) => {
                                    return (
                                        <tr key={index}>
                                            <td className="text-center">{((currentPage-1) * PAGINATION.Row) + index+1}</td>
                                            <td>{item.Name}</td>
                                            <td>{formatDate(item.CreateDate)}</td>
                                            <td>
                                                <div className="text-center">
                                                    <Switch
                                                        onColor={"#55c44d"}
                                                        offColor={"#6C7383"}
                                                        checked={item.Status}
                                                        onChange={() => confirmChangeStatus(item.Id, item.Status)}
                                                    />
                                                </div>
                                            </td>
                                            <td>
                                                <div className="text-center">
                                                    <a
                                                        style={{ cursor: "pointer" }}
                                                        href={`package-management/${item.Id}`}
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
                                (!packages || packages && packages.length === 0) &&
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
        </>
    )
}

export default PackageList
