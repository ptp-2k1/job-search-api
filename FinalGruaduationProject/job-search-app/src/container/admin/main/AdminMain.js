import React, { useEffect, useState } from 'react'
import { Routes, Route, useLocation } from "react-router-dom";
import Header from '../header/Header';
import Menu from './Menu';
import CategoryData from './CategoryData';
import UserList from '../user/UserList';
import UserManagement from '../user/UserManagement';
import BranchManagement from '../branch/BranchManagement';
import BranchList from '../branch/BranchList';
import TitleManagement from '../title/TitleManagement';
import TitleList from '../title/TitleList';
import WorkTypeManagement from '../workType/WorkTypeManagement';
import WorkTypeList from '../workType/WorkTypeList';
import AreaManagement from '../area/AreaManagement';
import AreaList from '../area/AreaList';
import PostList from '../post/PostList';
import ChangePassword from '../personal/ChangePassword';
import PackageManagement from '../package/PackageManagement';
import PackageList from '../package/PackageList';
import CompanyList from '../company/CompanyList';
import EducationManagement from '../education/EducationManagement';
import EducationList from '../education/EducationList';
import ExperienceList from "../experience/ExperienceList";
import ExperienceManagement from "../experience/ExperienceManagement";
import PackagePurchasedList from '../package/PackagePurchasedList';
import PackageStatistics from '../statistics/PackageStatistics';
import PostStatistics from '../statistics/PostStatistics';
import PersonalInformation from "../personal/PersonalInformation";
import Authorization from "../authorization/Authorization";
import CompanyDetail from "../company/CompanyDetail";
import PackagePurchasedDetail from "../package/PackagePurchasedDetail";
import PostDetail from "../post/PostDetail";
import CategoryStatistics from "../statistics/CategoryStatistics";
import SalaryList from "../salary/SalaryList";
import SalaryManagement from "../salary/SalaryManagement";
import { verifyToken } from "../../../service/UserService";

const AdminMain = () => {
    const [authenticated, setAuthenticated] = useState(false);
    const location = useLocation();
    const { pathname } = location;

    const verify = async () => {
        const data = await verifyToken({
            role: 1
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
                    <Menu/>
                    <div className="main-panel">
                        <div className="content-wrapper" style={{ backgroundColor: "#eaedff" }} >
                            <Routes>
                                <Route exact path="" element=
                                    {
                                        <React.Fragment>
                                            <CategoryData />
                                        </React.Fragment>
                                    }
                                >
                                </Route>
                                <Route exact path="authorization" element=
                                    {
                                        <React.Fragment>
                                            <Authorization />
                                        </React.Fragment>
                                    }
                                >
                                </Route>
                                <Route exact path="company" element=
                                    {
                                        <React.Fragment>
                                            <CompanyList />
                                        </React.Fragment>
                                    }
                                >
                                </Route>
                                <Route exact path="company-detail/:id" element=
                                    {
                                        <React.Fragment>
                                            <CompanyDetail />
                                        </React.Fragment>
                                    }
                                >
                                </Route>
                                <Route exact path="post" element=
                                    {
                                        <React.Fragment>
                                            <PostList />
                                        </React.Fragment>
                                    }
                                >
                                </Route>
                                <Route exact path="post-detail/:id" element=
                                    {
                                        <React.Fragment>
                                            <PostDetail />
                                        </React.Fragment>
                                    }
                                >
                                </Route>
                                <Route exact path="user" element=
                                    {
                                        <React.Fragment>
                                            <UserList />
                                        </React.Fragment>
                                    }
                                >
                                </Route>
                                <Route exact path="user-management" element=
                                    {
                                        <React.Fragment>
                                            <UserManagement />
                                        </React.Fragment>
                                    }
                                >
                                </Route>
                                <Route exact path="user-management/:id" element=
                                    {
                                        <React.Fragment>
                                            <UserManagement />
                                        </React.Fragment>
                                    }
                                >
                                </Route>
                                <Route exact path="branch" element=
                                    {
                                        <React.Fragment>
                                            <BranchList />
                                        </React.Fragment>
                                    }
                                >
                                </Route>
                                <Route exact path="branch-management" element=
                                    {
                                        <React.Fragment>
                                            <BranchManagement />
                                        </React.Fragment>
                                    }
                                >
                                </Route>
                                <Route exact path="branch-management/:id" element=
                                    {
                                        <React.Fragment>
                                            <BranchManagement />
                                        </React.Fragment>
                                    }
                                >
                                </Route>
                                <Route exact path="title" element=
                                    {
                                        <React.Fragment>
                                            <TitleList />
                                        </React.Fragment>
                                    }
                                >
                                </Route>
                                <Route exact path="title-management" element=
                                    {
                                        <React.Fragment>
                                            <TitleManagement />
                                        </React.Fragment>
                                    }
                                >
                                </Route>
                                <Route exact path="title-management/:id" element=
                                    {
                                        <React.Fragment>
                                            <TitleManagement />
                                        </React.Fragment>
                                    }
                                >
                                </Route>
                                <Route exact path="work-type" element=
                                    {
                                        <React.Fragment>
                                            <WorkTypeList />
                                        </React.Fragment>
                                    }
                                >
                                </Route>
                                <Route exact path="work-type-management" element=
                                    {
                                        <React.Fragment>
                                            <WorkTypeManagement />
                                        </React.Fragment>
                                    }
                                >
                                </Route>
                                <Route exact path="work-type-management/:id" element=
                                    {
                                        <React.Fragment>
                                            <WorkTypeManagement />
                                        </React.Fragment>
                                    }
                                >
                                </Route>
                                <Route exact path="education" element=
                                    {
                                        <React.Fragment>
                                            <EducationList />
                                        </React.Fragment>
                                    }
                                >
                                </Route>
                                <Route exact path="education-management" element=
                                    {
                                        <React.Fragment>
                                            <EducationManagement />
                                        </React.Fragment>
                                    }
                                >
                                </Route>
                                <Route exact path="education-management/:id" element=
                                    {
                                        <React.Fragment>
                                            <EducationManagement />
                                        </React.Fragment>
                                    }
                                >
                                </Route>
                                <Route exact path="area" element=
                                    {
                                        <React.Fragment>
                                            <AreaList />
                                        </React.Fragment>
                                    }
                                >
                                </Route>
                                <Route exact path="area-management" element=
                                    {
                                        <React.Fragment>
                                            <AreaManagement />
                                        </React.Fragment>
                                    }
                                >
                                </Route>
                                <Route exact path="area-management/:id" element=
                                    {
                                        <React.Fragment>
                                            <AreaManagement />
                                        </React.Fragment>
                                    }
                                >
                                </Route>
                                <Route exact path="salary" element=
                                    {
                                        <React.Fragment>
                                            <SalaryList />
                                        </React.Fragment>
                                    }
                                >
                                </Route>
                                <Route exact path="salary-management" element=
                                    {
                                        <React.Fragment>
                                            <SalaryManagement />
                                        </React.Fragment>
                                    }
                                >
                                </Route>
                                <Route exact path="salary-management/:id" element=
                                    {
                                        <React.Fragment>
                                            <SalaryManagement />
                                        </React.Fragment>
                                    }
                                >
                                </Route>
                                <Route exact path="experience" element=
                                    {
                                        <React.Fragment>
                                            <ExperienceList />
                                        </React.Fragment>
                                    }
                                >
                                </Route>
                                <Route exact path="experience-management" element=
                                    {
                                        <React.Fragment>
                                            <ExperienceManagement />
                                        </React.Fragment>
                                    }
                                >
                                </Route>
                                <Route exact path="experience-management/:id" element=
                                    {
                                        <React.Fragment>
                                            <ExperienceManagement />
                                        </React.Fragment>
                                    }
                                >
                                </Route>
                                <Route exact path="package" element=
                                    {
                                        <React.Fragment>
                                            <PackageList />
                                        </React.Fragment>
                                    }
                                >
                                </Route>
                                <Route exact path="package-management" element=
                                    {
                                        <React.Fragment>
                                            <PackageManagement />
                                        </React.Fragment>
                                    }
                                >
                                </Route>
                                <Route exact path="package-management/:id" element=
                                    {
                                        <React.Fragment>
                                            <PackageManagement />
                                        </React.Fragment>
                                    }
                                >
                                </Route>
                                <Route exact path="package-purchase" element=
                                    {
                                        <React.Fragment>
                                            <PackagePurchasedList />
                                        </React.Fragment>
                                    }
                                >
                                </Route>
                                <Route exact path="package-purchase/:id" element=
                                    {
                                        <React.Fragment>
                                            <PackagePurchasedDetail />
                                        </React.Fragment>
                                    }
                                >
                                </Route>
                                <Route exact path="statistics-package" element=
                                    {
                                        <React.Fragment>
                                            <PackageStatistics />
                                        </React.Fragment>
                                    }
                                >
                                </Route>
                                <Route exact path="statistics-post" element=
                                    {
                                        <React.Fragment>
                                            <PostStatistics />
                                        </React.Fragment>
                                    }
                                >
                                </Route>
                                <Route exact path="statistics-category" element=
                                    {
                                        <React.Fragment>
                                            <CategoryStatistics />
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

export default AdminMain
