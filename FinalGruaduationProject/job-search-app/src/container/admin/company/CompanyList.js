import { PAGINATION } from '../../../enums/Pagination';
import React, { useEffect, useState } from 'react'
import ReactPaginate from 'react-paginate';
import { toast, ToastContainer } from 'react-toastify';
import { Input, Col, Select, Modal } from 'antd';
import { InfoCircleTwoTone } from "@ant-design/icons";
import Switch from "react-switch";
import { changeCompanyStatus, filterCompanyList } from "../../../service/CompanyService";

const CompanyList = () => {
    const [companies, setCompanies] = useState([])
    const [pageCount, setPageCount] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [search, setSearch] = useState("")
    const [status, setStatus] = useState(null)
    const [changeStatus, setChangeStatus] = useState(false)

    const statusList = [
        {
            value: null,
            label: "Tất cả"
        },
        {
            value: 0,
            label: "Chưa xác thực"
        },
        {
            value: 1,
            label: "Đã xác thực"
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
        const companyList = await filterCompanyList({
            info: search,
            status: status
        })

        if(companyList && companyList.status === 200) {
            if(companyList.data) {
                setCompanies(companyList.data.slice((currentPage-1)* PAGINATION.Row, currentPage * PAGINATION.Row))
                setPageCount(Math.ceil(companyList.data.length / PAGINATION.Row))
            } else {
                setCompanies([])
                setPageCount(0)
            }
        } else {
            toast.error("Không thể lấy danh sách công ty ngay lúc này ! Hãy thử lại sau", {
                position: toast.POSITION.TOP_RIGHT
            })
        }
    }

    const confirmChangeStatus = async (id, status) => {
        if(status) {
            Modal.confirm({
                title: "Chắc chắn hủy xác thực công ty này ?",
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

        const result = await changeCompanyStatus({
            id: id,
            status: !status
        })

        if(result && result.status === 200) {
            toast.success("Thay đổi trạng thái của công ty thành công !", {
                position: toast.POSITION.TOP_RIGHT
            });
        } else {
            toast.error("Thay đổi trạng thái của công ty thất bại ! Hãy thử lại sau", {
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

    useEffect(() => {
        getData();
    }, [search, status, changeStatus, currentPage])

    return (
        <>
            <div className="col-12 grid-margin">
                <div className="card">
                    <div className="card-body">
                        <h4 className="card-title">Danh sách công ty</h4>
                        <Input.Search
                            onSearch={handleSearch}
                            className='mt-3 mb-3'
                            placeholder="Nhập tên công ty"
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
                                    <th style={{ border: "1px solid black"}} >Tên công ty</th>
                                    <th style={{ border: "1px solid black"}} >Trạng thái</th>
                                    <th style={{ border: "1px solid black"}} >Chi tiết</th>
                                </tr>
                                </thead>
                                <tbody>
                                {companies && companies.length > 0 &&
                                companies.map((item, index) => {
                                    return (
                                        <tr key={index}>
                                            <td className="text-center">{((currentPage-1) * PAGINATION.Row) + index+1}</td>
                                            <td>{item.Name}</td>
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
                                                        style={{cursor: "pointer"}}
                                                        href={`company-detail/${item.Id}`}
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
                                        </tr>
                                    )
                                })}
                                </tbody>
                            </table>
                            {
                                (!companies || companies && companies.length === 0) &&
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

export default CompanyList
