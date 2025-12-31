import React from 'react'
import { BrowserRouter as Router,  Routes, Route } from "react-router-dom";
import Header from './container/home/header/Header'
import Footer from './container/home/footer/Footer'
import HomeMain from './container/home/main/HomeMain'
import RecruitmentList from './container/home/recruitment/RecruitmentList'
import About from './container/home/about/About'
import Contact from './container/home/contact/Contact'
import AdminMain from './container/admin/main/AdminMain';
import Login from './container/home/login/Login'
import Register from './container/home/register/Register'
import ResetPassword from './container/home/resetPassword/ResetPassword'
import CandidateMain from './container/candidate/main/CandidateMain'
import CompanyList from './container/home/company/CompanyList'
import CompanyDetail from './container/home/company/CompanyDetail'
import RecruitmentDetail from "./container/home/recruitment/RecruitmentDetail";
import RecruiterMain from "./container/recruiter/main/RecruiterMain";
import Error from "./container/home/error/Error";
import ChangePassword from "./container/home/login/ChangePassword";
import 'react-toastify/dist/ReactToastify.css';
import AdminLogin from "./container/home/login/AdminLogin";
import AdminResetPassword from "./container/home/resetPassword/AdminResetPassword";
import AdminChangePassword from "./container/home/login/AdminChangePassword";

// export const TabIdContext = createContext()

function App() {
    // const tabId = localStorage.length

    return (
        // <TabIdContext.Provider value={ tabId }>
            <Router>
              <Routes >
                <Route exact path="/" element=
                    {
                      <React.Fragment>
                          <Header />
                          <HomeMain />
                          <Footer />
                      </React.Fragment>
                    }
                >
                </Route>
                <Route exact path="/about" element=
                    {
                        <React.Fragment>
                            <Header />
                            <About />
                            <Footer />
                        </React.Fragment>
                    }
                >
                </Route>
                <Route exact path="/contact" element=
                    {
                        <React.Fragment>
                            <Header />
                            <Contact />
                            <Footer />
                        </React.Fragment>
                    }
                >
                </Route>
                <Route exact path="/recruitment" element=
                    {
                        <React.Fragment>
                            <Header />
                            <RecruitmentList />
                            <Footer />
                        </React.Fragment>
                    }
                >
                </Route>
                <Route exact path="/recruitment-detail/:id" element=
                    {
                        <React.Fragment>
                            <Header />
                            <RecruitmentDetail />
                            <Footer />
                        </React.Fragment>
                    }
                >
                </Route>
                <Route exact path="/company" element=
                    {
                        <React.Fragment>
                            <Header />
                            <CompanyList />
                            <Footer />
                        </React.Fragment>
                    }
                >
                </Route>
                <Route exact path="/company-detail/:id" element=
                    {
                        <React.Fragment>
                            <Header />
                            <CompanyDetail />
                            <Footer />
                        </React.Fragment>
                    }
                >
                </Route>
                <Route exact path="/login" element=
                    {
                        <React.Fragment>
                            <Header />
                            <Login />
                            <Footer />
                        </React.Fragment>
                    }
                >
                </Route>
                <Route exact path="/admin/login" element=
                    {
                        <React.Fragment>
                            <AdminLogin />
                            <Footer />
                        </React.Fragment>
                    }
                >
                </Route>
                <Route exact path="/login/change-password" element=
                    {
                        <React.Fragment>
                            <Header />
                            <ChangePassword />
                            <Footer />
                        </React.Fragment>
                    }
                >
                </Route>
                <Route exact path="/admin/login/change-password" element=
                    {
                        <React.Fragment>
                            <AdminChangePassword />
                            <Footer />
                        </React.Fragment>
                    }
                >
                </Route>
                <Route exact path="/register" element=
                    {
                        <React.Fragment>
                            <Header />
                            <Register />
                            <Footer />
                        </React.Fragment>
                    }
                >
                </Route>
                <Route exact path="/forget-password" element=
                    {
                        <React.Fragment>
                            <Header />
                            <ResetPassword />
                            <Footer />
                        </React.Fragment>
                    }
                >
                </Route>
                <Route exact path="/admin/forget-password" element=
                    {
                        <React.Fragment>
                            <AdminResetPassword />
                            <Footer />
                        </React.Fragment>
                    }
                >
                </Route>
                <Route exact path="/admin/*" element=
                    {
                        <React.Fragment>
                            <AdminMain />
                        </React.Fragment>
                    }
                >
                </Route>
                <Route exact path="/recruiter/*" element=
                    {
                        <React.Fragment>
                            <RecruiterMain />
                        </React.Fragment>
                    }
                >
                </Route>
                <Route exact path="/candidate/*" element=
                    {
                        <React.Fragment>
                            <CandidateMain />
                        </React.Fragment>
                    }
                >
                </Route>
                <Route exact path="/error" element=
                    {
                          <React.Fragment>
                              <Error />
                          </React.Fragment>
                    }
                >
                </Route>
              </Routes >
            </Router>
        // </TabIdContext.Provider>
    );
}

export default App;
