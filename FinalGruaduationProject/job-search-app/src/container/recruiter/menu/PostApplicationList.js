import { PAGINATION } from '../../../enums/Pagination';
import React, { useEffect, useState } from 'react'
import ReactPaginate from 'react-paginate';
import { useParams, useNavigate } from "react-router-dom";
import { Col, Select } from "antd";
import { toast, ToastContainer } from "react-toastify";
import { getPostApplication, changeApplicationStatus } from "../../../service/ApplyJobsService";

const PostApplicationList = () => {
    const initialData = {
        status: null,
        order: "ASC",
        fromDate: new Date().getFullYear() + "-01-01",
        toDate: new Date().getFullYear() + "-12-31"
    }
    const [filter, setFilter] = useState(initialData)
    const [applications, setApplications] = useState([])
    const [pageCount, setPageCount] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const navigate = useNavigate()
    const { id } = useParams()
    const statuses = [
        {
            value: null,
            label: "Tất cả"
        },
        {
            value : 0,
            label: "Chưa xem"
        },
        {
            value: 1,
            label: "Đã xem"
        }
    ]

    const orders = [
        {
            value : "ASC",
            label: "Tăng dần"
        },
        {
            value: "DESC",
            label: "Giảm dần"
        }
    ]

    const getData = async () => {
        const applicationList = await getPostApplication({
            id: id,
            status: filter.status,
            order: filter.order,
            fromDate: filter.fromDate,
            toDate: filter.toDate
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
            toast.error("Không thể lấy danh sách ứng tuyển việc làm ngay lúc này ! Hãy thử lại sau", {
                position: toast.POSITION.TOP_RIGHT
            })
        }
    }

    const handleOnChange = (name, value) => {
        setCurrentPage(1)
        setFilter({ ...filter, [name]: value });
    }

    const handleChangeStatus = async (userId, postId, status) => {
        const result = await changeApplicationStatus({
            userId: userId,
            postId: postId,
            isChecked: status
        })

        if(result && result.status === 200) {
            window.location.href = `/recruiter/application-detail/${userId}/${postId}`
        } else {
            toast.error("Xem Cv thất bại vui lòng thử lại !", {
                position: toast.POSITION.TOP_RIGHT
            });
        }
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
        getData()
    }, [filter.status, filter.order, filter.fromDate, filter.toDate, currentPage])

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
                        <h4 className="card-title">Danh sách ứng tuyển việc làm</h4>
                        <br/>
                        <Col justify='space-around' className='mt-3 mb-3'>
                            <label className='mr-2'>Trạng thái: </label>
                            <Select
                                style={{ width:"110px" }}
                                value={filter.status}
                                options={statuses}
                                onChange={(value)=> handleOnChange("status", value)}
                            />
                            <label className='ml-5 mr-2'>Sắp xếp ngày ứng tuyển theo: </label>
                            <Select
                                style={{ width:"110px" }}
                                value={filter.order}
                                options={orders}
                                onChange={(value)=> handleOnChange("order", value)}
                            />
                            <label className='ml-5 mr-2'>Từ ngày: </label>
                            <input
                                style={{ color: "#495057", cursor: "pointer" }}
                                type="date"
                                value={filter.fromDate}
                                onKeyDown={false}
                                onChange={(event) => handleOnChange("fromDate", event.target.value)}
                            />
                            <label className='ml-5 mr-2'>Đến ngày: </label>
                            <input
                                style={{ color: "#495057", cursor: "pointer" }}
                                type="date"
                                value={filter.toDate}
                                onKeyDown={false}
                                onChange={(event) => handleOnChange("toDate", event.target.value)}
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
                                    <th style={{ border: "1px solid black"}} >Họ tên ứng viên</th>
                                    <th style={{ border: "1px solid black"}} >Giới tính</th>
                                    <th style={{ border: "1px solid black"}} >Email</th>
                                    <th style={{ border: "1px solid black"}} >Số điện thoại</th>
                                    <th style={{ border: "1px solid black"}} >Ngày ứng tuyển</th>
                                    <th style={{ border: "1px solid black"}} >Trạng thái</th>
                                    <th style={{ border: "1px solid black"}} >Xem Cv</th>
                                </tr>
                                </thead>
                                <tbody>
                                {applications && applications.length > 0 &&
                                applications.map((item, index) => {
                                    return (
                                        <tr key={index} style={{backgroundColor: "white" }}>
                                            <td className="text-center">{((currentPage-1) * PAGINATION.Row) + index+1}</td>
                                            <td>{item.FullName}</td>
                                            <td>{!item.Gender ? "Nam" : "Nữ"}</td>
                                            <td>{item.Email}</td>
                                            <td>{item.PhoneNumber}</td>
                                            <td>{formatDate(item.ApplyDate)}</td>
                                            <td>{!item.IsChecked ? "Chưa xem" : "Đã xem"}</td>
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
                                                               onClick={() => handleChangeStatus(item.UserId, item.PostId, 1)}
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

export default PostApplicationList
