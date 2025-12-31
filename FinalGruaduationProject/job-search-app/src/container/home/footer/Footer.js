import React from 'react'

const Footer = () => {
    return (
        <>
            <footer>
                <div className="footer-bottom-area footer-bg" style={{ backgroundColor: "#a89bc2" }}>
                    <div className="container">
                        <div className="footer-border">
                            <div className="row d-flex justify-content-between align-items-center">
                                <div className="col-xl-10 col-lg-10 ">
                                    <div className="footer-copy-right">
                                        <p style={{ color: "#252b60"}}>N19DCCN139 - Phùng Tín Phong</p>
                                    </div>
                                </div>
                                <div className="col-xl-2 col-lg-2">
                                    <div className="footer-social f-right">
                                        <a href="#"><i className="fab fa-facebook-f text-white" /></a>
                                        <a href="#"><i className="fab fa-twitter text-white" /></a>
                                        <a href="#"><i className="fab fa-instagram text-white" /></a>
                                        <a href="#"><i className="fab fa-youtube text-white" /></a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    )
}

export default Footer
