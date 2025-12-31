import { PAGINATION } from "../../../enums/Pagination";
import React, { useEffect, useState } from 'react';
import ReactPaginate from "react-paginate";
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from "react-toastify";
import { Input } from 'antd'
import { getCompanyList } from "../../../service/CompanyService"
import './CompanyList.scss';

const CompanyList = () => {
    const [company, setCompany] = useState([])
    const [pageCount, setPageCount] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [search, setSearch] = useState("")
    const [amount,setAmount] = useState(0)

    const handleSearch = async (value) => {
        setCurrentPage(1)
        setSearch(value === "" || value === undefined || value === null ? "" : value)
    }

    const getData = async () => {
        const companyList = await getCompanyList({
            info: search
        })

        if(companyList && companyList.status === 200) {
            if(companyList.data) {
                setCompany(companyList.data.slice((currentPage-1)* PAGINATION.Item, currentPage * PAGINATION.Item))
                setPageCount(Math.ceil(companyList.data.length / PAGINATION.Item))
                setAmount(companyList.data.length)
            } else {
                setCompany([])
                setPageCount(0)
            }
        } else {
            toast.error("Không thể lấy danh sách công ty ngay lúc này ! Hãy thử lại sau", {
                position: toast.POSITION.TOP_RIGHT
            })
        }
    }

    const handleChangePage = (page) => {
        if(page) {
            setCurrentPage(page.selected + 1)
        }
    }

    useEffect(() => {
        getData();
    }, [search, currentPage])

    return (
        <>
            <div className='container-recruitment'>
                <Input.Search
                    style={{ width: "430px", marginLeft: "830px", marginTop: "15px"}}
                    placeholder="Nhập tên công ty"
                    allowClear
                    enterButton="Tìm kiếm"
                    onSearch={handleSearch}
                />
                <h3 className='title text-center'>DANH SÁCH CÁC CÔNG TY</h3>
                <span style={{ width: "100%", display: "flex", justifyContent: "center" }}>
            </span>
                <br/>
                <div className='row list-company'>
                    {company && company.length > 0 && company.map((item, index) => {
                        return (
                            <div key={index} className='col-md-4 col-sm-6 '>
                                <div className='box-item-company'>
                                    <div className='company-banner'>
                                        <Link to={`/company-detail/${item.Id}`}>
                                            <div className='cover-wrapper'>
                                                <img
                                                    src={item.Cover}
                                                    alt="Ảnh bìa"
                                                />
                                            </div>
                                        </Link>
                                        <div className='company-logo'>
                                            <Link to={`/company-detail/${item.Id}`}>
                                                <img
                                                    className="img-fluid"
                                                    src={item.Logo}
                                                    alt="Logo"
                                                />
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="company-info" style={{ whiteSpace: "pre-wrap" }}>
                                        <h3>
                                            <Link class="company-name" to={`/company-detail/${item.Id}`}>
                                                {item.Name}
                                            </Link>
                                        </h3>
                                        <div className="company-description">
                                            {item.Description}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
                {
                    (!company || company && company.length === 0) &&
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
            <ToastContainer />
        </>
    )
}

export default CompanyList
