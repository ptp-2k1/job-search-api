import React from 'react'
import { NavLink } from 'react-router-dom'

const Header = () => {

    let handleLogout = () => {
        localStorage.removeItem("userId")
        localStorage.removeItem("token")
        window.location.href = "/"
    }

    let scrollHeader = () => {
        window.addEventListener("scroll", function () {
            const header = document.querySelector(".header-area");
            if (header) {
                header.classList.toggle("sticky", window.scrollY > 0)
            }
        })
    }

    scrollHeader()

    return (
        <header>
            <div className="header-area header-transparrent" style={{ backgroundColor: "#a89bc2" }}>
                <div className="headder-top header-sticky">
                    <div className="container">
                        <div className="row align-items-center">
                            <div>
                                <div className="menu-wrapper">
                                    <div className="main-menu">
                                        <nav className="d-none d-lg-block">
                                            <ul id="navigation">
                                                <li><a href={"/candidate/"}><img src="/assets/img/logo/logo.png" alt="logo" style={{ width: "110px", height: "40px", marginLeft: "-50px", marginRight: "50px" }} /></a></li>
                                                <li><a href={"/company"}>Công ty</a></li>
                                                <li><a href={"/recruitment"}>Việc làm</a></li>
                                                <li><NavLink to="/candidate/personal-information" isActive={() => window.scrollTo(0, 0)}>Thông tin cá nhân</NavLink></li>
                                                <li><NavLink to="/candidate/job-profile" isActive={() => window.scrollTo(0, 0)}>Quản lý hồ sơ</NavLink></li>
                                                <li><NavLink to="/candidate/cv-list" isActive={() => window.scrollTo(0, 0)}>Quản lý CV</NavLink></li>
                                                <li><NavLink to="/candidate/application-list" isActive={() => window.scrollTo(0, 0)}>Việc làm đã nộp</NavLink></li>
                                                <li><NavLink to="/candidate/change-password" isActive={() => window.scrollTo(0, 0)}>Đổi mật khẩu</NavLink></li>
                                                <li><a style={{ cursor: "pointer" }} onClick={() => handleLogout()}>Đăng xuất</a></li>
                                            </ul>
                                        </nav>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12">
                                <div className="mobile_menu d-block d-lg-none"/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header
