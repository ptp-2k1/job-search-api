import React, { useEffect, useState } from 'react';
import Converter from "../../../util/Converter";
import { toast, ToastContainer } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";
import { getCandidateDetail } from "../../../service/ApplyJobsService";

const ApplicationDetail = () => {
    const initialData = {
        selfIntroduction: "",
        file: null
    }
    const [applicationDetail, setApplicationDetail] = useState(initialData)
    const navigate = useNavigate()
    const { userId, postId } = useParams();

    const getData = async () => {
        const candidateDetail = await getCandidateDetail({
            role: 3,
            userId: userId,
            postId: postId
        })

        if(candidateDetail && candidateDetail.status === 200) {
            setApplicationDetail({
                selfIntroduction: candidateDetail.data.SelfIntroduction,
                file: URL.createObjectURL(Converter.getFile(candidateDetail.data.File, "haa")[0])
            })
        } else {
            toast.error("Không thể lấy thông tin ứng tuyển ngay lúc này ! Hãy thử lại sau", {
                position: toast.POSITION.TOP_RIGHT
            })
        }
    }

    useEffect(() => {
        if (userId && postId) {
            getData()
        }
    }, [])

    return (
        <>
            <div onClick={() => navigate(-1)}
                 style={{ cursor: "pointer", margin: "10px 30px -10px", textAlign: "left"}}>
                <i className="fa-solid fa-arrow-left mr-2"/>
                Quay lại
            </div>
            <div className="col-12 mt-20 mb-35 grid-margin">
                <div className="card" style={{ backgroundColor: "#eaedff"}}>
                    <div className="card-body">
                        <h4 className="card-title">Thư giới thiệu bản thân</h4>
                        <br/>
                        <blockquote
                            className="blockquote blockquote-primary"
                            style={{
                                borderWidth: "2px",
                                borderImageSource: "linear-gradient(to right, #a89bc2, #fb246a)",
                                borderImageSlice: "1",
                                backgroundColor: "#ffffff"
                            }}>
                            {applicationDetail.selfIntroduction}
                        </blockquote>
                    </div>
                    <div className="card-body">
                        <h4 className="card-title">CV của tôi</h4>
                        <br/>
                        <iframe
                            style={{
                                width: "100%",
                                height: "700px",
                                borderColor: "#4B49AC",
                                borderImageSource: "linear-gradient(to right, #a89bc2, #fb246a)",
                                borderImageSlice: "1",
                                backgroundColor: "#ffffff"
                            }}
                            src={applicationDetail.file}
                        />
                    </div>
                </div>
            </div>
            <ToastContainer/>
        </>
    )
};

export default ApplicationDetail
