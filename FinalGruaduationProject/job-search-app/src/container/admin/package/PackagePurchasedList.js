import { PAGINATION } from '../../../enums/Pagination';
import React, { useEffect, useState } from 'react'
import ReactPaginate from 'react-paginate';
import Converter from "../../../util/Converter";
import { toast, ToastContainer } from 'react-toastify';
import { Col, Input, Select, Modal } from 'antd'
import { InfoCircleTwoTone } from "@ant-design/icons";
import { changePurchasePackageStatus, filterPurchasePackageAdmin, getPurchasedPackageImage } from "../../../service/PurchasedPackageService";

const PackagePurchasedList = () => {
    const [purchasedPackages, setPurchasedPackages] = useState([])
    const [pageCount, setPageCount] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [search, setSearch] = useState("")
    const [status, setStatus] = useState(null)
    const [changeStatus, setChangeStatus] = useState(false)

    const statusList = [
        {
            value: null,
            label: "Tất cả"
        },
        {
            value: 0,
            label: "Chờ xác nhận"
        },
        {
            value: 1,
            label: "Đã xác nhận"
        }
    ]

    const handleSearch = (value) => {
        setCurrentPage(1)
        setSearch(value === "" || value === undefined || value === null ? "" : value)
    }

    const handleFilter = (value) => {
        setCurrentPage(1)
        setStatus(value)
    }

    const getData = async () => {
        const purchasedPackageList = await filterPurchasePackageAdmin({
            info: search,
            status: status
        })

        if(purchasedPackageList && purchasedPackageList.status === 200) {
            if(purchasedPackageList.data) {
                setPurchasedPackages(purchasedPackageList.data.slice((currentPage-1)* PAGINATION.Row, currentPage * PAGINATION.Row))
                setPageCount(Math.ceil(purchasedPackageList.data.length / PAGINATION.Row))
            } else {
                setPurchasedPackages([])
                setPageCount(0)
            }
        } else {
            toast.error("Không thể lấy danh sách giao dịch nga lúc này ! Hãy thử lại sau", {
                position: toast.POSITION.TOP_RIGHT
            })
        }
    }

    const handleChangeStatus = async (id, status) => {
        Modal.confirm({
            title: "Đồng ý xác nhận giao dịch này ?",
            icon: <InfoCircleTwoTone />,
            async onOk() {
                const result = await changePurchasePackageStatus({
                    id: id,
                    status: status
                })

                if(result && result.status === 200) {
                    toast.success("Xác nhận giao dịch thành công", {
                        position: toast.POSITION.TOP_RIGHT
                    });
                } else {
                    toast.error("Xác nhận giao dịch thất bại ! Hãy thử lại sau", {
                        position: toast.POSITION.TOP_RIGHT
                    });
                }
                setCurrentPage(1)
                setChangeStatus(!changeStatus)
            },
            onCancel() {},
        });
    }

    const previewImage = async (id) => {
        const image = await getPurchasedPackageImage({
            role: 1,
            id: id
        })

        if(image && image.status === 200 && image.data) {
            const preview = Converter.getImage(image.data.File, image.data.Name)[0]
            const blobUrl = URL.createObjectURL(preview);
            const anchorElement = document.createElement("a");
            anchorElement.href = blobUrl;
            anchorElement.target = "_blank";
            anchorElement.click();
            URL.revokeObjectURL(blobUrl);
        } else {
            toast.error("Không có ảnh nào để xem trước", {
                position: toast.POSITION.TOP_RIGHT
            });
        }
    }

    const handleChangePage = (page) => {
        if(page) {
            setCurrentPage(page.selected + 1)
        }
    }

    const formatDate = (date) => {
        if(date) {
            let dateRaw = date.substring(0, 10).split("-");
            return dateRaw[2] + "/" + dateRaw[1] + "/" + dateRaw[0];
        } else {
            return "Chưa có"
        }
    }

    useEffect(() => {
        getData();
    }, [search, status, changeStatus, currentPage])

    return (
        <>
            <div className="col-12 grid-margin">
                <div className="card">
                    <div className="card-body">
                        <h4 className="card-title">Danh sách giao dịch</h4>
                        <Input.Search
                            className='mt-3 mb-3'
                            placeholder="Nhập họ tên người mua"
                            allowClear
                            enterButton="Tìm kiếm"
                            onSearch={handleSearch}
                        />
                        <Col justify='space-around' className='mt-3 mb-3'>
                            <label className='mr-2'>Trạng thái: </label>
                            <Select
                                onChange={ (value) => handleFilter(value) }
                                style= {{ width: "160px" }}
                                value= { status }
                                options= { statusList }
                            />
                        </Col>
                        <div className="table-responsive pt-2 mb-3">
                            <table
                                className="table table-bordered table-hover"
                                style={{ borderCollapse: "collapse" }}
                            >
                                <thead style={{ position: "sticky", top: "0", borderColor: "black" }}>
                                <tr style={{ textAlign: "center", backgroundColor: "#afcbdb" }}>
                                    <th style={{ border: "1px solid black"}} >STT</th>
                                    <th style={{ border: "1px solid black"}} >Mã giao dịch</th>
                                    <th style={{ border: "1px solid black"}} >Người mua</th>
                                    <th style={{ border: "1px solid black"}} >Tên gói dịch vụ</th>
                                    <th style={{ border: "1px solid black"}} >Ngày mua</th>
                                    <th style={{ border: "1px solid black"}} >Ngày hiệu lực</th>
                                    <th style={{ border: "1px solid black"}} >Ngày hết hạn</th>
                                    {
                                        status === 0 && <th style={{ border: "1px solid black"}} >Xác nhận</th>
                                    }
                                    <th style={{ border: "1px solid black"}} >Chi tiết</th>
                                    <th style={{ border: "1px solid black"}} >Xem ảnh chuyển khoản</th>
                                </tr>
                                </thead>
                                <tbody>
                                {purchasedPackages && purchasedPackages.length > 0 &&
                                purchasedPackages.map((item, index) => {
                                    return (
                                        <tr key={index}>
                                            <td className="text-center">{((currentPage-1) * PAGINATION.Row) + index+1}</td>
                                            <td>{item.Id}{formatDate(item.PurchasedDate).replaceAll("/", "")}</td>
                                            <td>{item.Recruiter}</td>
                                            <td>{item.Name}</td>
                                            <td>{formatDate(item.PurchasedDate)}</td>
                                            <td>{formatDate(item.StartDate)}</td>
                                            <td>{formatDate(item.ExpiredDate)}</td>
                                            {
                                                status === 0 &&
                                                (
                                                    <td>
                                                        <div className="text-center">
                                                            <a style={{cursor: "pointer"}}>
                                                                <span className="badge badge-success">
                                                                   <button
                                                                       style={{
                                                                           backgroundColor: "transparent",
                                                                           border: "none",
                                                                           cursor: "pointer"
                                                                       }}
                                                                       onClick={() => handleChangeStatus(item.Id, 1)}
                                                                   >
                                                                       <i
                                                                           className="fa fa-check"
                                                                           style={{color: "black"}}
                                                                       />
                                                                   </button>
                                                               </span>
                                                            </a>
                                                        </div>
                                                    </td>
                                                )
                                            }
                                            <td>
                                                <div className="text-center">
                                                    <a
                                                        style={{cursor: "pointer"}}
                                                        href={`package-purchase/${item.Id}`}
                                                    >
                                                        <span className="badge badge-primary">
                                                           <button
                                                               style={{
                                                                   backgroundColor: "transparent",
                                                                   border: "none",
                                                                   cursor: "pointer"
                                                               }}>
                                                               <i
                                                                   className="fa fa-eye"
                                                                   style={{color: "black"}}
                                                               />
                                                           </button>
                                                       </span>
                                                    </a>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="text-center">
                                                    <a style={{cursor: "pointer"}}>
                                                        <span className="badge badge-info">
                                                           <button
                                                               style={{
                                                                   backgroundColor: "transparent",
                                                                   border: "none",
                                                                   cursor: "pointer"
                                                               }}
                                                               onClick={() => previewImage(item.Image)}
                                                           >
                                                               <i
                                                                   className="fa fa-image"
                                                                   style={{color: "black"}}
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
                                (!purchasedPackages || purchasedPackages && purchasedPackages.length === 0) &&
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
            <ToastContainer/>
        </>
    )
}

export default PackagePurchasedList
