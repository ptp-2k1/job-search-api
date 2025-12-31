import { PAGINATION } from '../../../enums/Pagination';
import React, { useEffect, useState } from 'react'
import ReactPaginate from 'react-paginate';
import { Col, Select } from "antd";
import { toast, ToastContainer } from 'react-toastify';
import { getCandidate } from "../../../service/ApplyJobsService";

const ApplicationList = () => {
    const [applications, setApplications] = useState([])
    const [pageCount, setPageCount] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [status, setStatus] = useState(null)

    const statusList = [
        {
            value: null,
            label: "Tất cả"
        },
        {
            value: 0,
            label: "Chưa xem"
        },
        {
            value: 1,
            label: "Đã xem"
        }
    ]

    const getData = async () => {
        const applicationList = await getCandidate({
            id: localStorage.getItem("userId"),
            status: status
        })

        if(applicationList && applicationList.status === 200) {
            if(applicationList.data) {
                setApplications(applicationList.data.slice((currentPage-1)* PAGINATION.Row, currentPage * PAGINATION.Row))
                setPageCount(Math.ceil(applicationList.data.length / PAGINATION.Row))
            } else {
                setApplications([])
                setPageCount(0)
            }
        } else {
            toast.error("Không thể lấy danh sách việc làm đã nộp ngay lúc này ! Hãy thử lại sau", {
                position: toast.POSITION.TOP_RIGHT
            })
        }
    }

    const handleFilter = (value) => {
        setCurrentPage(1)
        setStatus(value)
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
    }, [status, currentPage])

    return (
        <>
            <div className="col-12 grid-margin">
                <div className="card" style={{ backgroundColor: "#eaedff"}}>
                    <div className="card-body">
                        <h4 className="card-title">Danh sách việc làm đã nộp</h4>
                        <Col justify='space-around' className='mt-3 mb-3'>
                            <label className='mr-2'>Xem theo trạng thái: </label>
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
                                        <th style={{ border: "1px solid black"}} >Tên việc làm</th>
                                        <th style={{ border: "1px solid black"}} >Ngày ứng tuyển</th>
                                        <th style={{ border: "1px solid black"}} >Trạng thái</th>
                                        <th style={{ border: "1px solid black"}} >Chi tiết / Xem Cv</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {applications && applications.length > 0 &&
                                applications.map((item, index) => {
                                    return (
                                        <tr key={index} style={{backgroundColor: "white" }}>
                                            <td className="text-center">{((currentPage-1) * PAGINATION.Row) + index+1}</td>
                                            <td>{item.Title}</td>
                                            <td>{formatDate(item.ApplyDate)}</td>
                                            <td>{!item.IsChecked ? "Chưa xem" : "Đã xem"}</td>
                                            <td>
                                                <div className="text-center">
                                                    <a
                                                        style={{ cursor: "pointer" }}
                                                        href={`/recruitment-detail/${item.PostId}`}
                                                    >
                                                            <span className="badge badge-primary">
                                                               <button
                                                                   style={{
                                                                       backgroundColor: "transparent",
                                                                       border: "none",
                                                                       cursor: "pointer"
                                                                   }}
                                                               >
                                                                   <i
                                                                       className="fa fa-paperclip"
                                                                       style={{ color: "black" }}
                                                                   />
                                                               </button>
                                                           </span>
                                                    </a>
                                                    &nbsp;
                                                    <a
                                                        style={{ cursor: "pointer" }}
                                                        href={`application-detail/${item.UserId}/${item.PostId}`}
                                                    >
                                                            <span className="badge badge-primary">
                                                               <button
                                                                   style={{
                                                                       backgroundColor: "transparent",
                                                                       border: "none",
                                                                       cursor: "pointer"
                                                                   }}
                                                               >
                                                                   <i
                                                                       className="fa fa-file"
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
                                (!applications || applications && applications.length === 0) &&
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

export default ApplicationList
