import React from 'react'

const Contact = () => {
    return (
        <>
            <div className="slider-area ">
                <div className="single-slider section-overly slider-height2 d-flex align-items-center"
                     style={{ backgroundImage: `url("assets/img/hero/about.jpg")` }}>
                    <div className="container">
                        <div className="row">
                            <div className="col-xl-12">
                                <div className="hero-cap text-center">
                                    <h2>Liên hệ chúng tôi</h2>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <section className="contact-section" style={{ backgroundColor: "#eaedff"}}>
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <h2 className="contact-title">Cùng kết nối</h2>
                        </div>
                        <div className="col-lg-8">
                            <form className="form-contact contact_form" method="post" id="contactForm" noValidate="novalidate">
                                <div className="row">
                                    <div className="col-12">
                                        <div className="form-group">
                                            <input
                                                className="form-control"
                                                name="subject" id="subject"
                                                type="text"
                                                onFocus="this.placeholder = ''"
                                                onBlur="this.placeholder = 'Chủ đề'"
                                                placeholder="Chủ đề"
                                                style={{ backgroundColor: "#ffffff" }}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="form-group">
                                            <textarea
                                                className="form-control w-100"
                                                name="message"
                                                id="message"
                                                cols="30" rows="9"
                                                onFocus="this.placeholder = ''"
                                                onBlur="this.placeholder = 'Suy nghĩ của bạn'"
                                                placeholder="Suy nghĩ của bạn"
                                                style={{ backgroundColor: "#ffffff" }}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <input className="form-control valid"
                                                   name="name"
                                                   id="name"
                                                   type="text"
                                                   onFocus="this.placeholder = ''"
                                                   onBlur="this.placeholder = 'Họ tên của bạn'"
                                                   placeholder="Họ tên của bạn"
                                                   style={{ backgroundColor: "#ffffff" }}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <input
                                                className="form-control valid"
                                                name="email"
                                                id="email"
                                                type="email"
                                                onFocus="this.placeholder = ''"
                                                onBlur="this.placeholder = 'Email của bạn'"
                                                placeholder="Email của bạn"
                                                style={{ backgroundColor: "#ffffff" }}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group mt-3">
                                    <button
                                        type="submit"
                                        className="btn head-btn1">
                                        Gửi
                                    </button>
                                </div>
                            </form>
                        </div>
                        <div className="col-lg-3 offset-lg-1">
                            <div className="media contact-info">
                                <span className="contact-info__icon">
                                    <i className="ti-home"/>
                                </span>
                                <div className="media-body">
                                    <h3>97 Man Thiện</h3>
                                    <p>Khoa CNTT, Ngành CNPM</p>
                                </div>
                            </div>
                            <div className="media contact-info">
                                <span className="contact-info__icon">
                                    <i className="ti-tablet"/>
                                </span>
                                <div className="media-body">
                                    <h3>0912345678</h3>
                                    <p>Thứ 2 - 6, 7:00 - 17:00</p>
                                </div>
                            </div>
                            <div className="media contact-info">
                                <span className="contact-info__icon">
                                    <i className="ti-email"/>
                                </span>
                                <div className="media-body">
                                    <h3>phungtinphong@gmail.com</h3>
                                    <p>Gửi ngay cho chúng tôi</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Contact
