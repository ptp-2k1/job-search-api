import React, { useEffect, useState } from 'react'
import { Routes, Route, useLocation } from "react-router-dom";
import Header from "../../recruiter/header/Header";
import PersonalInformation from "../menu/PersonalInformation";
import ChangePassword from "../menu/ChangePassword";
import CompanyInformation from "../menu/CompanyInformation";
import PurchasePackage from "../menu/PurchasePackage";
import Statistics from "../menu/Statistics";
import FindProfile from "../menu/FindProfile";
import PurchaseHistory from "../menu/PurchaseHistory";
import PostList from "../menu/PostList";
import PostManagement from "../menu/PostManagement";
import ApplicationList from "./ApplicationList";
import ProfileDetail from "../menu/ProfileDetail";
import PostApplicationList from "../menu/PostApplicationList";
import ApplicationDetail from "../menu/ApplicationDetail";
import {verifyToken} from "../../../service/UserService";

const RecruiterMain = () => {
    const [authenticated, setAuthenticated] = useState(false);
    const location = useLocation();
    const { pathname } = location;

    const verify = async () => {
        const data = await verifyToken({
            role: 2
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
                                <Route exact path="" element=
                                    {
                                        <React.Fragment>
                                            <ApplicationList />
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
                                <Route exact path="company" element=
                                    {
                                        <React.Fragment>
                                            <CompanyInformation />
                                        </React.Fragment>
                                    }
                                >
                                </Route>
                                <Route exact path="post-list" element=
                                    {
                                        <React.Fragment>
                                            <PostList />
                                        </React.Fragment>
                                    }
                                >
                                </Route>
                                <Route exact path="post-management" element=
                                    {
                                        <React.Fragment>
                                            <PostManagement />
                                        </React.Fragment>
                                    }
                                >
                                </Route>
                                <Route exact path="post-management/:id" element=
                                    {
                                        <React.Fragment>
                                            <PostManagement />
                                        </React.Fragment>
                                    }
                                >
                                </Route>
                                <Route exact path="post-application-list/:id" element=
                                    {
                                        <React.Fragment>
                                            <PostApplicationList />
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
                                <Route exact path="find-profile" element=
                                    {
                                        <React.Fragment>
                                            <FindProfile />
                                        </React.Fragment>
                                    }
                                >
                                </Route>
                                <Route exact path="profile-detail/:id" element=
                                    {
                                        <React.Fragment>
                                            <ProfileDetail />
                                        </React.Fragment>
                                    }
                                >
                                </Route>
                                <Route exact path="purchase-package" element=
                                    {
                                        <React.Fragment>
                                            <PurchasePackage />
                                        </React.Fragment>
                                    }
                                >
                                </Route>
                                <Route exact path="purchase-history" element=
                                    {
                                        <React.Fragment>
                                            <PurchaseHistory />
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
                                <Route exact path="statistics" element=
                                    {
                                        <React.Fragment>
                                            <Statistics />
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

export default RecruiterMain
