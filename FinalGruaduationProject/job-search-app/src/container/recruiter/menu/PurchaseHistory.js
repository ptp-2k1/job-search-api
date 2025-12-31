import { PAGINATION } from '../../../enums/Pagination';
import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom"
import ReactPaginate from 'react-paginate';
import { toast, ToastContainer } from "react-toastify";
import { Col, Input, Select } from 'antd'
import { filterPurchasePackageRecruiter } from "../../../service/PurchasedPackageService";

const PurchaseHistory = () => {
    const [purchasedPackages, setPurchasedPackages] = useState([])
    const [pageCount, setPageCount] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [search, setSearch] = useState("")
    const [status, setStatus] = useState(null)
    const navigate = useNavigate()

    const statusList = [
        {
            value: null,
            label: "Tất cả"
        },
        {
            value: 0,
            label: "Chờ xác nhận"
        },
        {
            value: 1,
            label: "Đã xác nhận"
        }
    ]

    const handleSearch = (value) => {
        setCurrentPage(1)
        setSearch(value === "" || value === undefined || value === null ? "" : value)
    }

    const handleFilter = (value) => {
        setCurrentPage(1)
        setStatus(value)
    }

    const getData = async () => {
        const purchasedPackageList = await filterPurchasePackageRecruiter({
            info: search,
            status: status,
            id: localStorage.getItem("userId")
        })

        if(purchasedPackageList && purchasedPackageList.status === 200) {
            if(purchasedPackageList.data) {
                setPurchasedPackages(purchasedPackageList.data.slice((currentPage-1)* PAGINATION.Row, currentPage * PAGINATION.Row))
                setPageCount(Math.ceil(purchasedPackageList.data.length / PAGINATION.Row))
            } else {
                setPurchasedPackages([])
                setPageCount(0)
            }
        } else {
            toast.error("Không thể lấy danh sách lịch sử giao dịch ngay lúc này ! Hãy thử lại sau", {
                position: toast.POSITION.TOP_RIGHT
            })
        }
    }

    const handleChangePage = (page) => {
        if(page) {
            setCurrentPage(page.selected + 1)
        }
    }

    const formatDate = (date) => {
        let dateRaw = date.substring(0, 10).split("-");
        return dateRaw[2] + "/" + dateRaw[1] + "/" + dateRaw[0];
    }

    const formatCurrency = (price) => {
        return new Intl.NumberFormat('vi', { style: "currency", currency: "VND" }).format(price)
    }

    useEffect(() => {
        getData();
    }, [search, status, currentPage])

    return (
        <>
            <div onClick={() => navigate(-1)}
                 style={{ cursor: "pointer", margin: "10px 30px -10px", textAlign: "left"}}>
                <i className="fa-solid fa-arrow-left mr-2"/>
                Quay lại
            </div>
            <div className="col-12 mt-20 mb-35 grid-margin">
                <div className="card" style={{ backgroundColor: "#eaedff"}}>
                    <div className="card-body">
                        <h4 className="card-title">
                            Lịch sử giao dịch
                        </h4>
                        <Input.Search
                            onSearch={handleSearch}
                            className='mt-3 mb-3'
                            placeholder="Nhập tên gói dịch vụ"
                            allowClear
                            enterButton="Tìm kiếm"
                        />
                        <Col justify='space-around' className='mt-3 mb-3'>
                            <label className='mr-2'>Trạng thái: </label>
                            <Select
                                onChange={(value)=> handleFilter(value)}
                                style={{width:'130px'}}
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
                                    <th style={{ border: "1px solid black"}} >Mã giao dịch</th>
                                    <th style={{ border: "1px solid black"}} >Tên gói</th>
                                    <th style={{ border: "1px solid black"}} >Giá gói</th>
                                    <th style={{ border: "1px solid black"}} >Ngày mua</th>
                                    <th style={{ border: "1px solid black"}} >Ngày có hiệu lực</th>
                                    <th style={{ border: "1px solid black"}} >Ngày hết hạn</th>
                                    <th style={{ border: "1px solid black"}} >Trạng thái</th>
                                </tr>
                                </thead>
                                <tbody>
                                {purchasedPackages && purchasedPackages.length > 0 &&
                                purchasedPackages.map((item, index) => {
                                    return (
                                        <tr key={index} style={{backgroundColor: "white" }}>
                                            <td className="text-center">{((currentPage-1) * PAGINATION.Row) + index+1}</td>
                                            <td>{item.Id}{formatDate(item.PurchasedDate).replaceAll("/", "")}</td>
                                            <td>{item.Name}</td>
                                            <td>{formatCurrency(item.PurchasePostBudget)}</td>
                                            <td>{formatDate(item.PurchasedDate)}</td>
                                            <td>{item.StartDate ? formatDate(item.StartDate) : "Chưa có"}</td>
                                            <td>{item.ExpiredDate ? formatDate(item.ExpiredDate) : "Chưa có"}</td>
                                            <td>
                                                {!item.Status
                                                    ?  (<>
                                                            Chờ xác nhận&nbsp;&nbsp;&nbsp;&nbsp;
                                                            <i className="fa fa-hourglass" style={{ color: "orange" }}/>
                                                        </>)
                                                    :   (<>
                                                            Đã xác nhận&nbsp;&nbsp;
                                                            <i className="fa fa-check-circle" style={{ color: "green" }}/>
                                                        </>)
                                                }
                                            </td>
                                        </tr>
                                    )
                                })}
                                </tbody>
                            </table>
                            {
                                (!purchasedPackages || purchasedPackages && purchasedPackages.length === 0) &&
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

export default PurchaseHistory
