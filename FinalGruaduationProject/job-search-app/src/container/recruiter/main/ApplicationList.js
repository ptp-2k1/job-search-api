import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { getLatestApplication, changeApplicationStatus } from "../../../service/ApplyJobsService";

const ApplicationList = () => {
    const [applications, setApplications] = useState([])

    const getData = async () => {
        const applicationList = await getLatestApplication({
            id: localStorage.getItem("userId")
        })

        if(applicationList && applicationList.status === 200) {
            if(applicationList.data) {
                setApplications(applicationList.data)
            } else {
                setApplications([])
            }
        } else {
            toast.error("Không thể lấy danh sách ứng tuyển mới nhất ngay lúc này ! Hãy thử lại sau", {
                position: toast.POSITION.TOP_RIGHT
            })
        }
    }

    const handleChangeStatus = async (userId, postId, status) => {
        const result = await changeApplicationStatus({
            userId: userId,
            postId: postId,
            isChecked: status
        })

        if(result && result.status === 200) {
            window.location.href = `/recruiter/application-detail/${userId}/${postId}`
        } else {
            toast.error("Xem cv thất bại ! Hãy thử lại sau", {
                position: toast.POSITION.TOP_RIGHT
            });
        }
    }

    const formatDate = (date) => {
        if(date) {
            let dateRaw = date.substring(0, 10).split("-");
            return dateRaw[2] + "/" + dateRaw[1] + "/" + dateRaw[0];
        }
    }

    useEffect(() => {
        getData()
    }, [])

    return (
        <>
            <div className="col-12 grid-margin" style={{backgroundColor: "#eaedff"}}>
                <div className="card" style={{backgroundColor: "#eaedff"}}>
                    <div className="card-body">
                        <h4 className="card-title">Danh sách ứng tuyển mới nhất vào công ty</h4>
                        <div className="table-responsive pt-2">
                            <table
                                className="table table-bordered table-hover"
                                style={{ borderCollapse: "collapse" }}
                            >
                                <thead style={{ position: "sticky", top: "0", borderColor: "black" }}>
                                <tr style={{ textAlign: "center", backgroundColor: "#afcbdb" }}>
                                    <th style={{ border: "1px solid black"}} >STT</th>
                                    <th style={{ border: "1px solid black"}} >Tên bài đăng</th>
                                    <th style={{ border: "1px solid black"}} >Họ tên ứng viên</th>
                                    <th style={{ border: "1px solid black"}} >Giới tính</th>
                                    <th style={{ border: "1px solid black"}} >Email</th>
                                    <th style={{ border: "1px solid black"}} >Số điện thoại</th>
                                    <th style={{ border: "1px solid black"}} >Ngày ứng tuyển</th>
                                    <th style={{ border: "1px solid black"}} >Trạng thái</th>
                                    <th style={{ border: "1px solid black"}} >Xem Cv / Xem bài đăng</th>
                                </tr>
                                </thead>
                                <tbody>
                                {applications && applications.length > 0 &&
                                applications.map((item, index) => {
                                    return (
                                        <tr key={index} style={{backgroundColor: "white" }}>
                                            <td className="text-center">{index + 1}</td>
                                            <td>{item.Title}</td>
                                            <td>{item.FullName}</td>
                                            <td>{!item.Gender ? "Nam" : "Nữ"}</td>
                                            <td>{item.Email}</td>
                                            <td>{item.PhoneNumber}</td>
                                            <td>{formatDate(item.ApplyDate)}</td>
                                            <td>{!item.IsChecked ? "Chưa xem" : "Đã xem"}</td>
                                            <td>
                                                <div className="text-center">
                                                    <a
                                                        style={{cursor: "pointer"}}
                                                    >
                                                        <span className="badge badge-primary">
                                                           <button
                                                               style={{
                                                                   backgroundColor: "transparent",
                                                                   border: "none",
                                                                   cursor: "pointer"
                                                               }}
                                                               onClick={() => handleChangeStatus(item.UserId, item.PostId, 1)}
                                                           >
                                                               <i
                                                                   className="fa fa-file"
                                                                   style={{color: "black"}}
                                                               />
                                                           </button>
                                                       </span>
                                                    </a>
                                                    &nbsp;
                                                    <a
                                                        style={{cursor: "pointer"}}
                                                        href={`/recruiter/post-management/${item.PostId}`}
                                                    >
                                                        <span className="badge badge-primary">
                                                           <button
                                                               style={{
                                                                   backgroundColor: "transparent",
                                                                   border: "none",
                                                                   cursor: "pointer"
                                                               }}
                                                               onClick={() => handleChangeStatus(item.UserId, item.PostId, 1)}
                                                           >
                                                               <i
                                                                   className="fa fa-edit"
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
                                (!applications || applications && applications.length === 0) &&
                                (
                                    <div style={{ textAlign: 'center', marginTop: "20px" }}>
                                        Không có dữ liệu
                                    </div>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer/>
        </>
    )
}

export default ApplicationList
