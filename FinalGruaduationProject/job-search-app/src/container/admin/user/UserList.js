import { PAGINATION } from '../../../enums/Pagination';
import React, { useEffect, useState } from 'react'
import ReactPaginate from 'react-paginate';
import { toast, ToastContainer } from 'react-toastify';
import { InfoCircleTwoTone } from "@ant-design/icons";
import { Col, Input, Modal, Select } from 'antd'
import Switch from "react-switch";
import { filterUser, changeUserStatus } from "../../../service/UserService";

const UserList = () => {
    const [users, setUsers] = useState([])
    const [pageCount, setPageCount] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [search, setSearch] = useState("")
    const [role, setRole] = useState(0)
    const [changeStatus, setChangeStatus] = useState(false)

    const roleLists = [
        {
            value: 0,
            label: "Tất cả"
        },
        {
            value : 1,
            label: "Quản trị viên"
        },
        {
            value: 2,
            label: "Nhà tuyển dụng"
        },
        {
            value: 3,
            label: "Ứng viên"
        }
    ]

    const handleSearch = (value) => {
        setCurrentPage(1)
        setSearch(value === "" || value === undefined || value === null ? "" : value)
    }

    const handleFilter = (value) => {
        setCurrentPage(1)
        setRole(value)
    }

    const getData = async () => {
        const userList = await filterUser({
            info: search,
            role: role,
            id: localStorage.getItem("userId")
        })

        if(userList && userList.status === 200) {
            if(userList.data) {
                setUsers(userList.data.slice((currentPage-1)* PAGINATION.Row, currentPage * PAGINATION.Row))
                setPageCount(Math.ceil(userList.data.length / PAGINATION.Row))
            } else {
                setUsers([])
                setPageCount(0)
            }
        } else {
            toast.error("Không thể lấy danh sách người dùng ngay lúc này ! Hãy thử lại sau", {
                position: toast.POSITION.TOP_RIGHT
            })
        }
    }

    const confirmChangeStatus = async (id, status) => {
        if(status) {
            Modal.confirm({
                title: "Chắc chắn khóa tài khoản này ?",
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
        const result = await changeUserStatus({
            id: id,
            status: !status
        })

        if(result && result.status === 200) {
            toast.success("Thay đổi trạng thái người dùng thành công", {
                position: toast.POSITION.TOP_RIGHT
            });
        } else {
            toast.error("Thay đổi trạng thái người dùng thất bại ! Hãy thử lại sau", {
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
    }, [search, role, changeStatus, currentPage])

    return (
        <>
            <div className="col-12 grid-margin">
                <div className="card">
                    <div className="card-body">
                        <h4 className="card-title">Danh sách người dùng</h4>
                        <Input.Search
                            onSearch={handleSearch}
                            className='mt-3 mb-3'
                            placeholder="Nhập họ và tên người dùng"
                            allowClear
                            enterButton="Tìm kiếm"
                        />
                        <Col justify='space-around' className='mt-3 mb-3'>
                            <label className='mr-2'>Đối tượng: </label>
                            <Select
                                onChange={(value)=> handleFilter(value)}
                                style={{width:'150px'}}
                                value={role}
                                options={roleLists}
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
                                        <th style={{ border: "1px solid black"}} >Họ và tên</th>
                                        <th style={{ border: "1px solid black"}} >Email</th>
                                        <th style={{ border: "1px solid black"}} >Số điện thoại</th>
                                        <th style={{ border: "1px solid black"}} >Trạng thái</th>
                                        <th style={{ border: "1px solid black"}} >Chi tiết</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users && users.length > 0 &&
                                    users.map((item, index) => {
                                        return (
                                            <tr key={index}>
                                                <td className="text-center">{((currentPage-1) * PAGINATION.Row) + index+1}</td>
                                                <td>{item.Name}</td>
                                                <td>{item.Email}</td>
                                                <td>{item.PhoneNumber}</td>
                                                <td>
                                                    <div className="text-center ml-20" style={{ display: "flex" }}>
                                                        &nbsp;&nbsp;&nbsp;
                                                        {
                                                            item.Status !== null &&
                                                            (
                                                                <Switch
                                                                    onColor={"#55c44d"}
                                                                    offColor={"#6C7383"}
                                                                    checked={item.Status}
                                                                    onChange={() => confirmChangeStatus(item.Id, item.Status)}
                                                                />
                                                            )
                                                        }
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="text-center">
                                                        <a
                                                            style={{cursor: "pointer"}}
                                                            href={`user-management/${item.Id}`}
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
                                (!users || users && users.length === 0) &&
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

export default UserList
