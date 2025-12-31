import { PAGINATION } from '../../../enums/Pagination';
import React, { useEffect, useState } from 'react'
import ReactPaginate from 'react-paginate';
import Converter from "../../../util/Converter";
import { toast, ToastContainer } from 'react-toastify';
import { Input, Modal } from 'antd'
import { InfoCircleTwoTone } from "@ant-design/icons";
import { filterCv, getContent, deleteContent } from "../../../service/CandidateCvService";
import { offSharedProfile } from "../../../service/JobProfileService";

const CvList = () => {
    const [cvs, setCvs] = useState([])
    const [pageCount, setPageCount] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [search, setSearch] = useState("")
    const [change, setChange] = useState(false)

    const handleSearch = (value) => {
        setCurrentPage(1)
        setSearch(value === "" || value === undefined || value === null ? "" : value)
    }

    const handleDelete = async (id) => {
        Modal.confirm({
            title: "Chắc chắn xóa tệp CV này ? Sẽ không thể hồi phục lại sau khi xóa",
            icon: <InfoCircleTwoTone />,
            async onOk() {
                const result = await deleteContent(id)

                if(result && result.status === 200) {
                    toast.success("Xóa tệp Cv thành công", {
                        position: toast.POSITION.TOP_RIGHT
                    });
                    if(cvs.length === 1) {
                        const result = await offSharedProfile({
                            id: localStorage.getItem("userId")
                        })

                        if(result && result.status === 200) {
                            toast.warn("Vì bạn không còn cv tìm việc nào trong hệ thống nên chế độ chia sẻ hồ sơ tìm việc của bạn hiện đã tắt !", {
                                position: toast.POSITION.TOP_RIGHT
                            })
                        }
                    }
                    setCurrentPage(1)
                    setChange(!change)
                } else {
                    toast.error("Xóa tệp Cv thất bại ! Hãy thử lại sau", {
                        position: toast.POSITION.TOP_RIGHT
                    });
                }
            },
            onCancel() {},
        });
    }

    const getData = async () => {
        const cvList = await filterCv({
            info: search,
            id: localStorage.getItem("userId")
        })

        if(cvList && cvList.status === 200) {
            if(cvList.data) {
                setCvs(cvList.data.slice((currentPage-1)* PAGINATION.Row, currentPage * PAGINATION.Row))
                setPageCount(Math.ceil(cvList.data.length / PAGINATION.Row))
            } else {
                setCvs([])
                setPageCount(0)
            }
        } else {
            toast.error("Không thể lấy danh sách cv của bạn ngay lúc này ! Hãy thử lại sau", {
                position: toast.POSITION.TOP_RIGHT
            })
        }
    }

    const previewFile = async (fileId, fileName) => {
        const file = await getContent({
            id: fileId
        })
        if(file.data) {
            const preview = Converter.getFile(file.data.File, fileName)[0]
            const blobUrl = URL.createObjectURL(preview);
            const anchorElement = document.createElement("a");
            anchorElement.href = blobUrl;
            anchorElement.target = "_blank";
            anchorElement.click();
            URL.revokeObjectURL(blobUrl);
        } else {
            toast.error("Không thể xem CV lúc này ! Hãy thử lại sau", {
                position: toast.POSITION.TOP_RIGHT
            });
        }
    }

    const downloadFile = async (fileId, fileName) => {
        const file = await getContent({
            id: fileId
        })
        if(file.data) {
            const linkSource = `data:application/pdf;base64,${file.data.File}`;
            const downloadLink = document.createElement("a");
            downloadLink.href = linkSource;
            downloadLink.download = fileName;
            downloadLink.click();
        } else {
            toast.error("Không thể tải CV lúc này ! Hãy thử lại sau", {
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
        }
    }

    useEffect(() => {
        getData();
    }, [search, change, currentPage])

    return (
        <>
            <div className="col-12 grid-margin">
                <div className="card" style={{ backgroundColor: "#eaedff"}}>
                    <div className="card-body">
                        <h4 className="card-title">Danh sách CV của tôi</h4>
                        <Input.Search
                            className='mt-3 mb-3'
                            placeholder="Nhập tên cv"
                            allowClear
                            enterButton="Tìm kiếm"
                            onSearch={handleSearch}
                        />
                        <div className="table-responsive pt-2 mb-3">
                            <table
                                className="table table-bordered table-hover"
                                style={{ borderCollapse: "collapse" }}
                            >
                                <thead style={{ position: "sticky", top: "0", borderColor: "black" }}>
                                <tr style={{ textAlign: "center", backgroundColor: "#afcbdb" }}>
                                    <th style={{ border: "1px solid black"}} >STT</th>
                                    <th style={{ border: "1px solid black"}} >Tên tệp CV</th>
                                    <th style={{ border: "1px solid black"}} >Ngày tải lên</th>
                                    <th style={{ border: "1px solid black"}} >Xem / Tải về / Xóa</th>
                                </tr>
                                </thead>
                                <tbody>
                                {cvs && cvs.length > 0 &&
                                cvs.map((item, index) => {
                                    return (
                                        <tr key={index} style={{backgroundColor: "white" }}>
                                            <td className="text-center">{((currentPage-1) * PAGINATION.Row) + index+1}</td>
                                            <td>{item.Name}</td>
                                            <td>{formatDate(item.UploadDate)}</td>
                                            <td>
                                                <div className="text-center">
                                                    <a style={{ cursor: "pointer" }}>
                                                            <span className="badge badge-primary">
                                                               <button
                                                                   style={{
                                                                       backgroundColor: "transparent",
                                                                       border: "none",
                                                                       cursor: "pointer"
                                                                   }}
                                                                   onClick={() => previewFile(item.File, item.Name)}
                                                               >
                                                                   <i
                                                                       className="fa fa-eye"
                                                                       style={{ color: "black" }}
                                                                   />
                                                               </button>
                                                           </span>
                                                    </a>
                                                    &nbsp;
                                                    <a style={{ cursor: "pointer" }}>
                                                            <span className="badge badge-info">
                                                               <button
                                                                   style={{
                                                                       backgroundColor: "transparent",
                                                                       border: "none",
                                                                       cursor: "pointer"
                                                                   }}
                                                                   onClick={() => downloadFile(item.File, item.Name)}
                                                               >
                                                                   <i
                                                                       className="fa fa-download"
                                                                       style={{ color: "black" }}
                                                                   />
                                                               </button>
                                                           </span>
                                                    </a>
                                                    &nbsp;
                                                    <a style={{ cursor: "pointer" }}>
                                                            <span className="badge badge-danger">
                                                               <button
                                                                   style={{
                                                                       backgroundColor: "transparent",
                                                                       border: "none",
                                                                       cursor: "pointer"
                                                                   }}
                                                                   onClick={() => handleDelete(item.File)}
                                                               >
                                                                   <i
                                                                       className="fa fa-trash"
                                                                       style={{ color: "black" }}
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
                                (!cvs || cvs && cvs.length === 0) &&
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

export default CvList
