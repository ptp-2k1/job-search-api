import React from 'react'
import { Link } from 'react-router-dom'

const Header = () => {
    let handleLogout = () => {
        localStorage.removeItem("userId")
        localStorage.removeItem("token")
        window.location.href = "/admin/login"
    }

    return (
        <nav className="navbar col-lg-12 col-12 p-0 fixed-top d-flex flex-row">
            <div className="navbar-menu-wrapper d-flex align-items-center justify-content-end"
                 style={{ width: "100%", backgroundColor: "#a89bc2" }}>
                <div className="text-center navbar-brand-wrapper d-flex align-items-center justify-content-center" style={{ backgroundColor: "#a89bc2" }}>
                    <Link className="navbar-brand brand-logo mr-5" to={"/admin/"}><img src="/assets/img/logo/logo.png" className="mr-2" alt="logo" /></Link>
                </div>
                <ul className="navbar-nav navbar-nav-right">
                    <li className="nav-item nav-profile dropdown">
                        <a className="nav-link dropdown-toggle" href="#" data-toggle="dropdown" id="profileDropdown">
                            <img style={{ objectFit: 'cover' }} src={"https://www.simplilearn.com/ice9/free_resources_article_thumb/what_is_image_Processing.jpg"} alt="profile" />
                        </a>
                        <div className="dropdown-menu dropdown-menu-right navbar-dropdown" aria-labelledby="profileDropdown">
                            <Link to={'/admin/'} className="dropdown-item">
                                <i className="fa fa-home text-primary"/>
                                Trang chính
                            </Link>
                            <Link to={'/admin/personal-information/'} className="dropdown-item">
                                <i className="fa fa-user text-primary"/>
                                Thông tin cá nhân
                            </Link>
                            <Link to={'/admin/change-password/'} className="dropdown-item">
                                <i className="fa fa-lock text-primary" />
                                Đổi mật khẩu
                            </Link>
                            <a onClick={() => handleLogout()} className="dropdown-item">
                                <i className="fa fa-sign-out text-primary" />
                                Đăng xuất
                            </a>
                        </div>
                    </li>
                </ul>
                <button className="navbar-toggler navbar-toggler-right d-lg-none align-self-center" type="button" data-toggle="offcanvas">
                    <span className="icon-menu" />
                </button>
            </div>
        </nav>
    )
}

export default Header
