import React, { useEffect, useState } from 'react'
import { Routes, Route, useLocation } from "react-router-dom";
import Header from "../header/Header";
import PersonalInformation from "../menu/PersonalInformation";
import JobProfile from "../menu/JobProfile";
import ApplicationList from "../menu/ApplicationList";
import ChangePassword from "../menu/ChangePassword";
import ApplicationDetail from "../menu/ApplicationDetail";
import CvList from "../menu/CvList";
import RecommendJobList from "./RecommendJobList";
import {verifyToken} from "../../../service/UserService";

const CandidateMain = () => {
    const [authenticated, setAuthenticated] = useState(false);
    const location = useLocation();
    const { pathname } = location;

    const verify = async () => {
        const data = await verifyToken({
            role: 3
        })

        if(data && data.status === 200) {
            setAuthenticated(true)
        } else {
            setAuthenticated(false)
            window.location.href = "/error"
        }
    }

    useEffect(() => {
        verify()
    }, [pathname])

    return (
        authenticated &&
        (
            <div className="container-scroller">
                <Header />
                <div className="container-fluid page-body-wrapper">
                    <div className="main-panel" style={{ width: "100%" }}>
                        <div className="content-wrapper" style={{ backgroundColor: "#eaedff" }} >
                            <Routes>
                                <Route exact path="/" element=
                                    {
                                        <React.Fragment>
                                            <RecommendJobList />
                                        </React.Fragment>
                                    }
                                >
                                </Route>
                                <Route exact path="personal-information" element=
                                    {
                                        <React.Fragment>
                                            <PersonalInformation />
                                        </React.Fragment>
                                    }
                                >
                                </Route>
                                <Route exact path="job-profile" element=
                                    {
                                        <React.Fragment>
                                            <JobProfile />
                                        </React.Fragment>
                                    }
                                >
                                </Route>
                                <Route exact path="cv-list" element=
                                    {
                                        <React.Fragment>
                                            <CvList />
                                        </React.Fragment>
                                    }
                                >
                                </Route>
                                <Route exact path="application-list" element=
                                    {
                                        <React.Fragment>
                                            <ApplicationList />
                                        </React.Fragment>
                                    }
                                >
                                </Route>
                                <Route exact path="application-detail/:userId/:postId" element=
                                    {
                                        <React.Fragment>
                                            <ApplicationDetail />
                                        </React.Fragment>
                                    }
                                >
                                </Route>
                                <Route exact path="change-password" element=
                                    {
                                        <React.Fragment>
                                            <ChangePassword />
                                        </React.Fragment>
                                    }
                                >
                                </Route>
                            </Routes>
                        </div>
                    </div>
                </div>
            </div>
        )
    )
}

export default CandidateMain
