import { PAGINATION } from '../../../enums/Pagination';
import React, { useEffect, useState } from 'react'
import ReactPaginate from 'react-paginate';
import { toast, ToastContainer } from "react-toastify";
import { Input } from "antd";
import { filterStaff } from "../../../service/UserService";
import { getPageLayoutList } from "../../../service/PageLayoutService";
import { getAuthorizationRoles } from "../../../service/AuthorizationService";
import AuthorizingModal from "./AuthorizingModal";

const Authorization = () => {
    const [staffs, setStaffs] = useState([])
    const [pageCount, setPageCount] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [search, setSearch] = useState("")
    const [pageLayouts, setPageLayouts] = useState([])
    const [userId, setUserId] = useState("")
    const [roles, setRoles] = useState([])
    const [activeModal, setActiveModal] = useState(false)

    const handleSearch = async (value) => {
        setCurrentPage(1)
        setSearch(value === "" || value === undefined || value === null ? "" : value)
    }

    const getData = async () => {
        const staffList = await filterStaff({
            info: search,
            id: localStorage.getItem("userId")
        })
        const pageLayoutList = await getPageLayoutList()

        if(staffList && staffList.status === 200) {
            if(staffList.data) {
                setStaffs(staffList.data.slice((currentPage-1)* PAGINATION.Row, currentPage * PAGINATION.Row))
                setPageCount(Math.ceil(staffList.data.length / PAGINATION.Row))
            } else {
                setStaffs([])
                setPageCount(0)
            }
        } else {
            toast.error("Không thể lấy danh sách nhân viên ngay lúc này ! Hãy thử lại sau", {
                position: toast.POSITION.TOP_RIGHT
            })
        }

        if(pageLayoutList && pageLayoutList.status === 200) {
            if(pageLayoutList.data) {
                setPageLayouts(pageLayoutList.data)
            } else {
                setPageLayouts([])
            }
        } else {
            toast.error("Không thể lấy danh sách phân quyền ngay lúc này ! Hãy thử lại sau", {
                position: toast.POSITION.TOP_RIGHT
            })
        }
    }

    const handleChangePage = (page) => {
        if(page) {
            setCurrentPage(page.selected + 1)
        }
    }

    const handleOpenModal = async (id) => {
        const roleList = await getAuthorizationRoles(id)

        if(roleList && roleList.status === 200) {
            if(roleList.data) {
                const temp =  Object.keys(roleList.data).map((index) => roleList.data[index].PageLayoutId)
                const roles  = []
                Object.keys(pageLayouts).map((index) => {
                    roles.push(temp.includes(pageLayouts[index].Id))
                })
                setRoles(roles)
            } else {
                setRoles([])
            }
            setUserId(id)
            setActiveModal(true)
        } else {
            toast.error("Không thể lấy thông tin quyền của nhân viên ngay lúc này ! Hãy thử lại sau", {
                position: toast.POSITION.TOP_RIGHT
            });
        }
    }

    useEffect(() => {
        getData();
    }, [search, currentPage])

    return (
        <main>
            <div>
                <div className="col-12 grid-margin">
                    <div className="card">
                        <div className="card-body">
                            <h4 className="card-title">Danh sách nhân viên</h4>
                            <Input.Search
                                onSearch={handleSearch}
                                className='mt-3 mb-3'
                                placeholder="Nhập họ và tên nhân viên"
                                allowClear
                                enterButton="Tìm kiếm">
                            </Input.Search>
                            <div className="table-responsive pt-2 mb-3">
                                <table
                                    className="table table-bordered table-hover"
                                    style={{ borderCollapse: "collapse" }}
                                >
                                    <thead style={{ position: "sticky", top: "0", borderColor: "black" }}>
                                    <tr style={{ textAlign: "center", backgroundColor: "#afcbdb" }}>
                                        <th style={{ border: "1px solid black"}} >STT</th>
                                        <th style={{ border: "1px solid black"}} >Tên tài khoản</th>
                                        <th style={{ border: "1px solid black"}} >Họ và tên</th>
                                        <th style={{ border: "1px solid black"}} >Phân quyền</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {staffs && staffs.length > 0 &&
                                    staffs.map((item, index) => {
                                        return (
                                            <tr key={index}>
                                                <td className="text-center">{((currentPage-1) * PAGINATION.Row) + index+1}</td>
                                                <td>{item.Account}</td>
                                                <td>{item.Name}</td>
                                                <td>
                                                    <div className="text-center">
                                                        <a style={{ cursor: "pointer" }}>
                                                            <span className="badge badge-info">
                                                               <button
                                                                   style={{
                                                                       backgroundColor: "transparent",
                                                                       border: "none",
                                                                       cursor: "pointer"
                                                                   }}
                                                                   onClick={() => handleOpenModal(item.Id)}
                                                               >
                                                                   <i
                                                                       className="fa fa-wrench"
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
                                    (!staffs || staffs && staffs.length === 0) &&
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
            </div >
            <AuthorizingModal
                activeModal = {activeModal}
                pageLayouts = {pageLayouts}
                userId={userId}
                roles = {roles}
                toast = {toast}
                onHide={() => setActiveModal(false)}
            />
            <ToastContainer/>
        </main>
    )
}

export default Authorization
