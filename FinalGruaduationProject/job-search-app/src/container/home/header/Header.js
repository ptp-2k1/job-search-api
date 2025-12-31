import React from 'react'
import { Link, NavLink } from 'react-router-dom'

const Header = () => {

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
        <>
            <header>
                <div className="header-area header-transparrent" style={{ backgroundColor: "#a89bc2" }}>
                    <div className="headder-top header-sticky">
                        <div className="container">
                            <div className="row align-items-center">
                                <div>
                                    <div className="menu-wrapper">
                                        <div className="main-menu" style={{ marginRight: "160px" }}>
                                            <nav className="d-none d-lg-block">
                                                <ul id="navigation">
                                                    <li><NavLink to="/"><img src="/assets/img/logo/logo.png" alt="logo" style={{ width: "110px", height: "40px", marginLeft: "-50px", marginRight: "50px" }} /></NavLink></li>
                                                    <li><NavLink to="/" isActive={() => window.scrollTo(0, 0)}>Trang chủ</NavLink></li>
                                                    <li><NavLink to="/company" isActive={() => window.scrollTo(0, 0)}>Công ty </NavLink></li>
                                                    <li><NavLink to="/recruitment" isActive={() => window.scrollTo(0, 0)}>Việc làm </NavLink></li>
                                                    <li><NavLink to="/about" isActive={() => window.scrollTo(0, 0)}>Giới thiệu</NavLink></li>
                                                    <li><NavLink to="/contact" isActive={() => window.scrollTo(0, 0)}>Liên hệ</NavLink></li>
                                                </ul>
                                            </nav>
                                        </div>
                                        <div className="header-btn d-none f-right d-lg-block">
                                            <Link to="/register" className="btn head-btn1">Đăng kí</Link>
                                            <Link to="/login" className="btn">Đăng nhập</Link>
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
            </header >
        </>
    )
}

export default Header
