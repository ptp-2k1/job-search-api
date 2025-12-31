import React from 'react'
import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom'

const Header = () => {

    const [user, setUser] = useState({})

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('userData'));
        setUser(userData)
    }, [])

    let handleLogout = () => {
        localStorage.removeItem("userId");
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
                                                <li><NavLink to="/recruiter/"><img src="/assets/img/logo/logo.png" alt="logo" style={{ width: "110px", height: "40px", marginLeft: "-50px", marginRight: "50px" }} /></NavLink></li>
                                                <li><NavLink to="/recruiter/personal-information" isActive={() => window.scrollTo(0, 0)}>Thông tin cá nhân</NavLink></li>
                                                <li><NavLink to="/recruiter/company" isActive={() => window.scrollTo(0, 0)}>Công ty</NavLink></li>
                                                <li><NavLink to="/recruiter/post-list" isActive={() => window.scrollTo(0, 0)}>Bài tuyển dụng</NavLink></li>
                                                <li><NavLink to="/recruiter/find-profile" isActive={() => window.scrollTo(0, 0)}>Tìm ứng viên</NavLink></li>
                                                <li><NavLink to="/recruiter/purchase-package" isActive={() => window.scrollTo(0, 0)}>Gói dịch vụ</NavLink></li>
                                                <li><NavLink to="/recruiter/change-password" isActive={() => window.scrollTo(0, 0)}>Đổi mật khẩu</NavLink></li>
                                                <li><NavLink to="/recruiter/statistics" isActive={() => window.scrollTo(0, 0)}>Thống kê</NavLink></li>
                                                <li><a style={{ cursor: "pointer" }} onClick={()=> handleLogout()}>Đăng xuất</a></li>
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
