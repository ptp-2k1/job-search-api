import React from 'react'

const Error = () => {
    return (
        <>
            <h1 className="notfound-ttl">404</h1>
            <p className="notfound-tag-1">Không tìm thấy trang!!! Trang bạn đang tìm kiếm hiện không hoạt động hoặc không tồn tại...</p>
            <div className="notfound-link">
                <a href="/" className="button-icon text-primary">
                    <span>Quay lại trang chủ</span>
                    &nbsp;
                    <i className="fa fa-home"/>
                </a>
            </div>
        </>
    )
}

export default Error
