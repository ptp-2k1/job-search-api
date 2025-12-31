import React, { useEffect, useState } from 'react'
import { toast, ToastContainer} from "react-toastify";
import { Link } from "react-router-dom"
import { getAuthorizationRoles } from "../../../service/AuthorizationService";

const Menu = () => {
    const [roles, setRoles] = useState([])
    const getData = async () => {
        const roleList = await getAuthorizationRoles(localStorage.getItem("userId"))
        if(roleList && roleList.status === 200) {
            if(roleList.data !== null) {
                setRoles(Object.keys(roleList.data).map((index) => roleList.data[index].PageLayoutId))
            }
        } else {
            toast.error("Không thể lấy danh sách các danh mục của bạn ngay lúc này ! Hãy thử lại sau", {
                position: toast.POSITION.TOP_RIGHT
            })
        }
    }

    useEffect(() => {
        getData();
    }, [])

    return (
        <>
            <nav className="sidebar sidebar-offcanvas" id="sidebar" style={{ backgroundColor: "#d8cce3" }}>
                <ul className="nav">
                    {
                        roles.includes(1) &&
                        (
                            <li className="nav-item relative">
                                <Link className="nav-link" to="/admin/authorization">
                                    <i className="fa fa-wrench menu-icon" />
                                    <span className="menu-title">Phân quyền</span>
                                </Link>
                            </li>
                        )
                    }
                    {
                        roles.includes(2) &&
                        (
                            <li className="nav-item relative">
                                <Link className="nav-link" to="/admin/company">
                                    <i className="fa fa-building menu-icon" />
                                    <span className="menu-title">Công ty</span>
                                </Link>
                            </li>
                        )
                    }
                    {
                        roles.includes(3) &&
                        (
                            <li className="nav-item relative">
                                <Link className="nav-link" to="/admin/post">
                                    <i className="fa fa-edit menu-icon" />
                                    <span className="menu-title">Bài tuyển dụng</span>
                                </Link>
                            </li>
                        )
                    }
                    {
                        (roles.includes(4) || roles.includes(5)) &&
                        (
                            <li className="nav-item relative">
                                <a className="nav-link" data-toggle="collapse" href="#user" aria-expanded="false"
                                   aria-controls="user">
                                    <i className="fa fa-user menu-icon" />
                                    <span className="menu-title">Người dùng</span>
                                    <i className="menu-arrow" />
                                </a>
                                <div className="collapse" id="user">
                                    <ul className="nav flex-column sub-menu" >
                                        {
                                            roles.includes(4) &&
                                            (
                                                <li className="nav-item relative">
                                                    <Link className="nav-link" to="/admin/user">
                                                        Danh sách
                                                    </Link>
                                                </li>
                                            )
                                        }
                                        {
                                            roles.includes(5) &&
                                            (
                                                <li className="nav-item relative">
                                                    <Link className="nav-link" to="/admin/user-management">
                                                        Thêm nhân viên mới
                                                    </Link>
                                                </li>
                                            )
                                        }
                                    </ul>
                                </div>
                            </li>
                        )
                    }
                    {
                        (roles.includes(6) || roles.includes(7)) &&
                        (
                            <li className="nav-item relative">
                                <a className="nav-link" data-toggle="collapse" href="#branch" aria-expanded="false"
                                   aria-controls="branch">
                                    <i className="fa fa-laptop menu-icon"/>
                                    <span className="menu-title">Ngành nghề</span>
                                    <i className="menu-arrow"/>
                                </a>
                                <div className="collapse" id="branch">
                                    <ul className="nav flex-column sub-menu">
                                        {
                                            roles.includes(6) &&
                                            (
                                                <li className="nav-item relative">
                                                    <Link className="nav-link" to="/admin/branch">
                                                        Danh sách
                                                    </Link>
                                                </li>
                                            )
                                        }
                                        {
                                            roles.includes(7) &&
                                            (
                                                <li className="nav-item relative">
                                                    <Link className="nav-link" to="/admin/branch-management">
                                                        Thêm mới
                                                    </Link>
                                                </li>
                                            )
                                        }
                                    </ul>
                                </div>
                            </li>
                        )
                    }
                    {
                        (roles.includes(8) || roles.includes(9)) &&
                        (
                            <li className="nav-item relative">
                                <a className="nav-link" data-toggle="collapse" href="#title" aria-expanded="false"
                                   aria-controls="title">
                                    <i className="fa fa-briefcase menu-icon"/>
                                    <span className="menu-title">Chức danh</span>
                                    <i className="menu-arrow"/>
                                </a>
                                <div className="collapse" id="title">
                                    <ul className="nav flex-column sub-menu">
                                        {
                                            roles.includes(8) &&
                                            (
                                                <li className="nav-item relative">
                                                    <Link className="nav-link" to="/admin/title">
                                                        Danh sách
                                                    </Link>
                                                </li>
                                            )
                                        }
                                        {
                                            roles.includes(9) &&
                                            (
                                                <li className="nav-item relative">
                                                    <Link className="nav-link" to="/admin/title-management">
                                                        Thêm mới
                                                    </Link>
                                                </li>
                                            )
                                        }
                                    </ul>
                                </div>
                            </li>
                        )
                    }
                    {
                        (roles.includes(10) || roles.includes(11)) &&
                        (
                            <li className="nav-item relative">
                                <a className="nav-link" data-toggle="collapse" href="#work-type" aria-expanded="false"
                                   aria-controls="work-type">
                                    <i className="fa fa-clock menu-icon"/>
                                    <span className="menu-title">Loại hình công việc</span>
                                    <i className="menu-arrow"/>
                                </a>
                                <div className="collapse" id="work-type">
                                    <ul className="nav flex-column sub-menu" >
                                        {
                                            roles.includes(10) &&
                                            (
                                                <li className="nav-item relative">
                                                    <Link className="nav-link" to="/admin/work-type">
                                                        Danh sách
                                                    </Link>
                                                </li>
                                            )
                                        }
                                        {
                                            roles.includes(11) &&
                                            (
                                                <li className="nav-item relative">
                                                    <Link className="nav-link" to="/admin/work-type-management">
                                                        Thêm mới
                                                    </Link>
                                                </li>
                                            )
                                        }
                                    </ul>
                                </div>
                            </li>
                        )
                    }
                    {
                        (roles.includes(12) || roles.includes(13)) &&
                        (
                            <li className="nav-item relative">
                                <a className="nav-link" data-toggle="collapse" href="#education" aria-expanded="false"
                                   aria-controls="education">
                                    <i className="fa fa-graduation-cap menu-icon"/>
                                    <span className="menu-title">Học vấn</span>
                                    <i className="menu-arrow"/>
                                </a>
                                <div className="collapse" id="education">
                                    <ul className="nav flex-column sub-menu">
                                        {
                                            roles.includes(12) &&
                                            (
                                                <li className="nav-item relative">
                                                    <Link className="nav-link" to="/admin/education">
                                                        Danh sách
                                                    </Link>
                                                </li>
                                            )
                                        }
                                        {
                                            roles.includes(13) &&
                                            (
                                                <li className="nav-item relative">
                                                    <Link className="nav-link" to="/admin/education-management">
                                                        Thêm mới
                                                    </Link>
                                                </li>
                                            )
                                        }
                                    </ul>
                                </div>
                            </li>
                        )
                    }
                    {
                        (roles.includes(14) || roles.includes(15)) &&
                        (
                            <li className="nav-item relative">
                                <a className="nav-link" data-toggle="collapse" href="#area" aria-expanded="false"
                                   aria-controls="area">
                                    <i className="fa fa-location-arrow menu-icon"/>
                                    <span className="menu-title">Khu vực</span>
                                    <i className="menu-arrow"/>
                                </a>
                                <div className="collapse" id="area">
                                    <ul className="nav flex-column sub-menu">
                                        {
                                            roles.includes(14) &&
                                            (
                                                <li className="nav-item relative">
                                                    <Link className="nav-link" to="/admin/area">
                                                        Danh sách
                                                    </Link>
                                                </li>
                                            )
                                        }
                                        {
                                            roles.includes(15) &&
                                            (
                                                <li className="nav-item relative">
                                                    <Link className="nav-link" to="/admin/area-management">
                                                        Thêm mới
                                                    </Link>
                                                </li>
                                            )
                                        }
                                    </ul>
                                </div>
                            </li>
                        )
                    }
                    {
                        (roles.includes(16) || roles.includes(17)) &&
                        (
                            <li className="nav-item relative">
                                <a className="nav-link" data-toggle="collapse" href="#salary" aria-expanded="false"
                                   aria-controls="salary">
                                    <i className="fa fa-money-bill-alt menu-icon"/>
                                    <span className="menu-title">Mức lương</span>
                                    <i className="menu-arrow"/>
                                </a>
                                <div className="collapse" id="salary">
                                    <ul className="nav flex-column sub-menu" >
                                        {
                                            roles.includes(16) &&
                                            (
                                                <li className="nav-item relative">
                                                    <Link className="nav-link" to="/admin/salary">
                                                        Danh sách
                                                    </Link>
                                                </li>
                                            )
                                        }
                                        {
                                            roles.includes(17) &&
                                            (
                                                <li className="nav-item relative">
                                                    <Link className="nav-link" to="/admin/salary-management">
                                                        Thêm mới
                                                    </Link>
                                                </li>
                                            )
                                        }
                                    </ul>
                                </div>
                            </li>
                        )
                    }
                    {
                        (roles.includes(18) || roles.includes(19)) &&
                        (
                            <li className="nav-item relative">
                                <a className="nav-link" data-toggle="collapse" href="#experience" aria-expanded="false"
                                   aria-controls="experience">
                                    <i className="fa fa-key menu-icon"/>
                                    <span className="menu-title">Kinh nghiệm</span>
                                    <i className="menu-arrow"/>
                                </a>
                                <div className="collapse" id="experience">
                                    <ul className="nav flex-column sub-menu" >
                                        {
                                            roles.includes(18) &&
                                            (
                                                <li className="nav-item relative">
                                                    <Link className="nav-link" to="/admin/experience">
                                                        Danh sách
                                                    </Link>
                                                </li>
                                            )
                                        }
                                        {
                                            roles.includes(19) &&
                                            (
                                                <li className="nav-item relative">
                                                    <Link className="nav-link" to="/admin/experience-management">
                                                        Thêm mới
                                                    </Link>
                                                </li>
                                            )
                                        }
                                    </ul>
                                </div>
                            </li>
                        )
                    }
                    {
                        (roles.includes(20) || roles.includes(21) || roles.includes(22)) &&
                        (
                            <li className="nav-item relative">
                                <a className="nav-link" data-toggle="collapse" href="#package" aria-expanded="false"
                                   aria-controls="package">
                                    <i className="fa fa-dollar menu-icon"/>
                                    <span className="menu-title">Gói dịch vụ</span>
                                    <i className="menu-arrow"/>
                                </a>
                                <div className="collapse" id="package">
                                    <ul className="nav flex-column sub-menu" >
                                        {
                                            roles.includes(20) &&
                                            (
                                                <li className="nav-item relative">
                                                    <Link className="nav-link" to="/admin/package">
                                                        Danh sách
                                                    </Link>
                                                </li>
                                            )
                                        }
                                        {
                                            roles.includes(21) &&
                                            (
                                                <li className="nav-item relative">
                                                    <Link className="nav-link" to="/admin/package-management">
                                                        Thêm mới
                                                    </Link>
                                                </li>
                                            )
                                        }
                                        {
                                            roles.includes(22) &&
                                            (
                                                <li className="nav-item relative">
                                                    <Link className="nav-link" to="/admin/package-purchase">
                                                        Giao dịch
                                                    </Link>
                                                </li>
                                            )
                                        }
                                    </ul>
                                </div>
                            </li>
                        )
                    }
                    {
                        (roles.includes(23) || roles.includes(24) || roles.includes(25)) &&
                        (
                            <li className="nav-item relative">
                                <a className="nav-link" data-toggle="collapse" href="#statistics" aria-expanded="false"
                                   aria-controls="statistics">
                                    <i className="fa fa-chart-line menu-icon"/>
                                    <span className="menu-title">Thống kê</span>
                                    <i className="menu-arrow"/>
                                </a>
                                <div className="collapse" id="statistics">
                                    <ul className="nav flex-column sub-menu">
                                        {
                                            roles.includes(23) &&
                                            (
                                                <li className="nav-item relative">
                                                    <Link className="nav-link" to="/admin/statistics-package">
                                                        Gói dịch vụ
                                                    </Link>
                                                </li>
                                            )
                                        }
                                        {
                                            roles.includes(24) &&
                                            (
                                                <li className="nav-item relative">
                                                    <Link className="nav-link" to="/admin/statistics-post">
                                                        Tuyển dụng
                                                    </Link>
                                                </li>
                                            )
                                        }
                                        {
                                            roles.includes(25) &&
                                            (
                                                <li className="nav-item relative">
                                                    <Link className="nav-link" to="/admin/statistics-category">
                                                        Hạng mục
                                                    </Link>
                                                </li>
                                            )
                                        }
                                    </ul>
                                </div>
                            </li>
                        )
                    }
                </ul>
            </nav>
            <ToastContainer/>
        </>
    )
}

export default Menu
