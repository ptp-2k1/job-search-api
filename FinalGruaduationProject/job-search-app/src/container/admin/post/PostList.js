import { PAGINATION } from '../../../enums/Pagination';
import React, { useEffect, useState } from 'react'
import ReactPaginate from 'react-paginate';
import { toast, ToastContainer } from 'react-toastify';
import { Col, Modal, Select } from 'antd';
import { InfoCircleTwoTone } from "@ant-design/icons";
import { Input } from 'antd'
import Switch from "react-switch";
import { changePostStatus, adminFilterPost } from "../../../service/PostService";

const PostList = () => {
    const [posts, setPosts] = useState([])
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

    const handleFilter = (value) => {
        setCurrentPage(1)
        setStatus(value)
    }

    const getData = async () => {
        const postList = await adminFilterPost({
            info: search,
            status: status
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

    const confirmChangeStatus = async (id, status) => {
        if(status === 1) {
            Modal.confirm({
                title: "Chắc chắn ẩn bài đăng tuyển này ?",
                icon: <InfoCircleTwoTone />,
                async onOk() {
                    await handleChangeStatus(id, status)
                },
                onCancel() {}
            });
        } else {
            await handleChangeStatus(id, status)
        }
    }

    const handleChangeStatus = async (id, status) => {
        const result = await changePostStatus({
            role: 1,
            id: id,
            status: status === 1 ? 3 : 1
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
        let dateRaw = date.substring(0, 10).split("-");
        return dateRaw[2] + "/" + dateRaw[1] + "/" + dateRaw[0];
    }

    useEffect(() => {
        getData()
    }, [search, status, changeStatus, currentPage])

    return (
        <>
            <div className="col-12 grid-margin">
                <div className="card">
                    <div className="card-body">
                        <h4 className="card-title">Danh sách bài tuyển dụng</h4>
                        <Input.Search
                            onSearch={handleSearch}
                            className='mt-3 mb-3'
                            placeholder={"Nhập tên bài tuyển dụng"}
                            allowClear
                            enterButton="Tìm kiếm">
                        </Input.Search>
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
                                    <th style={{ border: "1px solid black"}} >Tên bài tuyển dụng</th>
                                    <th style={{ border: "1px solid black"}} >Ngày đăng</th>
                                    <th style={{ border: "1px solid black"}} >Tên công ty</th>
                                    <th style={{ border: "1px solid black"}} >Trạng thái</th>
                                    <th style={{ border: "1px solid black"}} >Chi tiết</th>
                                </tr>
                                </thead>
                                <tbody>
                                {posts && posts.length > 0 &&
                                posts.map((item, index) => {
                                    return (
                                        <tr key={index}>
                                            <td className="text-center">{((currentPage-1) * PAGINATION.Row) + index+1}</td>
                                            <td>{item.Title}</td>
                                            <td>{formatDate(item.UploadDate)}</td>
                                            <td>{item.Name}</td>
                                            <td>
                                                <div className="text-center">
                                                    <Switch
                                                        onColor={"#55c44d"}
                                                        offColor={"#6C7383"}
                                                        checked={item.Status === 1}
                                                        onChange={() => confirmChangeStatus(item.Id, item.Status)}
                                                    />
                                                </div>
                                            </td>
                                            <td>
                                                <div className="text-center">
                                                    <a
                                                        style={{cursor: "pointer"}}
                                                        href={`post-detail/${item.Id}`}
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
