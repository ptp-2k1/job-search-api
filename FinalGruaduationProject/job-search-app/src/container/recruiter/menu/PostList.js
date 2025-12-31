import { PAGINATION } from '../../../enums/Pagination';
import React, { useEffect, useState } from 'react'
import ReactPaginate from 'react-paginate';
import { toast, ToastContainer} from "react-toastify";
import { InfoCircleTwoTone } from "@ant-design/icons";
import { Col, Input, Modal, Select } from 'antd'
import Switch from "react-switch";
import { recruiterFilterPost, changePostStatus } from "../../../service/PostService";

const PostList = () => {
    const [posts, setPosts] = useState([])
    const [pageCount, setPageCount] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [search,setSearch] = useState('')
    const [status, setStatus] = useState(null)
    const [priority, setPriority] = useState(null)
    const [changeStatus, setChangeStatus] = useState(false)
    const statuses = [
        {
            value: null,
            label: "Tất cả"
        },
        {
            value : 0,
            label: "Đang ẩn"
        },
        {
            value: 1,
            label: "Đang hiện"
        }
    ]
    const priorities = [
        {
            value: null,
            label: "Tất cả"
        },
        {
            value : 1,
            label: "Thông thường"
        },
        {
            value: 2,
            label: "Nổi bật"
        },
        {
            value: 3,
            label: "Gấp"
        }
    ]

    const handleSearch = (value) => {
        setCurrentPage(1)
        setSearch(value)
    }

    const handleChangeStatus = (value) => {
        setCurrentPage(1)
        setStatus(value)
    }

    const handleChangePriority = (value) => {
        setCurrentPage(1)
        setPriority(value)
    }

    const getData = async () => {
        const postList = await recruiterFilterPost({
            info: search,
            status: status,
            priority: priority,
            id: localStorage.getItem("userId")
        })

        if(postList && postList.status === 200) {
            if(postList.data) {
                setPosts(postList.data.slice((currentPage-1)* PAGINATION.Row, currentPage * PAGINATION.Row))
                setPageCount(Math.ceil(postList.data.length / PAGINATION.Row))
            } else {
                setPosts([])
                setPageCount(0)
            }
        } else {
            toast.error("Không thể lấy danh sách bài đăng tuyển ngay lúc này ! Hãy thử lại sau", {
                position: toast.POSITION.TOP_RIGHT
            })
        }
    }

    const confirmChangePostStatus = async (id, status) => {
        if(status === 1) {
            Modal.confirm({
                title: "Chắc chắn ẩn bài đăng tuyển này ?",
                icon: <InfoCircleTwoTone />,
                async onOk() {
                    await handleChangePostStatus(id, status)
                },
                onCancel() {},
            });
        } else {
            if(status === 2) {
                await handleChangePostStatus(id, status)
            } else if(status === 3) {
                toast.warn("Bài đăng tuyển này hiện đã bị gỡ nên không thể hiện lên hệ thống ! Vui lòng liên hệ quản trị viên để biết thêm", {
                    position: toast.POSITION.TOP_RIGHT
                });
            }
        }
    }

    const handleChangePostStatus = async (id, status) => {
        const result = await changePostStatus({
            role: 2,
            id: id,
            status: status === 1 ? 2 : 1
        })

        if(result && result.status === 200) {
            toast.success("Thay đổi trạng thái bài đăng tuyển thành công", {
                position: toast.POSITION.TOP_RIGHT
            });
        } else {
            toast.error("Thay đổi trạng thái bài đăng tuyển thất bại ! Hãy thử lại sau", {
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
        getData()
    }, [search, status, priority, changeStatus, currentPage])

    return (
        <>
            <div className="col-12 grid-margin" style={{backgroundColor: "#eaedff"}}>
                <div className="card" style={{backgroundColor: "#eaedff"}}>
                    <div className="card-body">
                        <h4 className="card-title">Danh sách bài đăng tuyển của công ty</h4>
                        <div
                            className='mb-2 hover-pointer text-right'
                            style={{color: 'red'}}
                            onClick={() => window.location.href = "./post-management"}
                        >
                            Đăng bài mới&nbsp;&nbsp;
                            <i className="fa-solid fa-arrow-right mr-2"/>
                        </div>
                        <br/>
                        <Input.Search
                            className='mt-3 mb-3'
                            placeholder="Nhập tên bài đăng tuyển"
                            allowClear
                            enterButton="Tìm kiếm"
                            onSearch={handleSearch}
                        />
                        <div className='mt-3 mb-3' style={{ display: "flex" }}>
                            <Col justify='space-around' className='mr-5'>
                                <label className='mr-2'>Trạng thái: </label>
                                <Select
                                    style={{ width:"110px" }}
                                    value={status}
                                    options={statuses}
                                    onChange={(value)=> handleChangeStatus(value)}
                                />
                            </Col>
                            <Col justify='space-around' className='mr-5'>
                                <label className='mr-2'>Độ ưu tiên tuyển dụng: </label>
                                <Select
                                    style={{ width:"150px" }}
                                    value={priority}
                                    options={priorities}
                                    onChange={(value)=> handleChangePriority(value)}
                                />
                            </Col>
                        </div>
                        <div className="table-responsive pt-2 mb-3">
                            <table
                                className="table table-bordered table-hover"
                                style={{ borderCollapse: "collapse" }}
                            >
                                <thead style={{ position: "sticky", top: "0", borderColor: "black" }}>
                                <tr style={{ textAlign: "center", backgroundColor: "#afcbdb" }}>
                                    <th style={{ border: "1px solid black"}} >STT</th>
                                    <th style={{ border: "1px solid black"}} >Tên bài đăng</th>
                                    <th style={{ border: "1px solid black"}} >Ngày đăng</th>
                                    <th style={{ border: "1px solid black"}} >Ngày hết hạn</th>
                                    <th style={{ border: "1px solid black"}} >Số lượng ứng tuyển</th>
                                    <th style={{ border: "1px solid black"}} >Trạng thái</th>
                                    <th style={{ border: "1px solid black"}} >Sửa / Xem ứng tuyển</th>
                                </tr>
                                </thead>
                                <tbody>
                                {posts && posts.length > 0 &&
                                posts.map((item, index) => {
                                    return (
                                        <tr key={index} style={{backgroundColor: "white" }}>
                                            <td className="text-center">{((currentPage-1) * PAGINATION.Row) + index+1}</td>
                                            <td>{item.Title}</td>
                                            <td>{formatDate(item.UploadDate)}</td>
                                            <td>{formatDate(item.ExpiredDate)}</td>
                                            <td>{item.Amount}</td>
                                            <td>
                                                <div className="text-center">
                                                    <Switch
                                                        onColor={"#55c44d"}
                                                        offColor={"#6C7383"}
                                                        checked={item.Status === 1}
                                                        onChange={() => confirmChangePostStatus(item.Id, item.Status)}
                                                    />
                                                </div>
                                            </td>
                                            <td>
                                                <div className="text-center">
                                                    <a
                                                        style={{ cursor: "pointer" }}
                                                        href={`post-management/${item.Id}`}
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
                                                    <a
                                                        style={{cursor: "pointer"}}
                                                        href={`post-application-list/${item.Id}`}
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
                                (!posts || posts && posts.length === 0) &&
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

export default PostList
