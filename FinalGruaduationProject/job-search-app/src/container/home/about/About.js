import React from 'react'
import { Link } from 'react-router-dom'

const About = () => {
    return (
        <>
            <main>
                <div className="slider-area ">
                    <div className="single-slider section-overly slider-height2 d-flex align-items-center"
                         style={{ backgroundImage: `url("assets/img/hero/about.jpg")` }}>
                        <div className="container">
                            <div className="row">
                                <div className="col-xl-12">
                                    <div className="hero-cap text-center">
                                        <h2>Giới thiệu về chúng tôi</h2>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="support-company-area fix section-padding2" style={{ backgroundColor: "#eaedff"}}>
                    <div className="container">
                        <div className="row align-items-center">
                            <div className="col-xl-12 col-lg-12">
                                <div className="right-caption">
                                    <div className="section-tittle section-tittle2">
                                        <span>Chúng ta đang nói về điều gì ?</span>
                                        <h2>Đó là 24 ngàn người tài năng đã có việc làm</h2>
                                    </div>
                                    <div className="support-caption">
                                        <p className="pera-top">
                                            Tìm kiếm việc làm là một bước quan trọng trong việc xây dựng sự nghiệp và đạt được thành công trong cuộc sống. Dưới đây là lý do vì sao bạn nên tìm việc ngay lập tức và lợi ích mà nó mang lại:
                                        </p>
                                        <p>
                                            Khám phá và tìm kiếm việc làm là một hành trình quan trọng mà mỗi người chúng ta nên trải qua. Tìm việc không chỉ đơn thuần là một cách để kiếm sống, mà còn mang lại nhiều lợi ích và triển vọng cho tương lai sự nghiệp của chúng ta.
                                            Một trong những lợi ích chính của việc tìm kiếm việc làm là khám phá tiềm năng của chính bạn. Khi bạn tìm kiếm các cơ hội việc làm mới, bạn có cơ hội tìm hiểu về những ngành nghề, lĩnh vực cụ thể mà bạn quan tâm. Điều này giúp bạn mở rộng kiến thức và trải nghiệm, và từ đó phát triển kỹ năng và khám phá mục tiêu nghề nghiệp của mình.
                                            Không chỉ có thế, việc tìm kiếm việc làm cũng giúp bạn xây dựng mạng lưới quan hệ xã hội và chuyên môn đáng giá. Bằng cách gặp gỡ và tương tác với các nhà tuyển dụng, đồng nghiệp và chuyên gia trong ngành, bạn có thể học hỏi từ kinh nghiệm và kiến thức của họ. Đồng thời, điều này cũng tạo ra cơ hội tạo quan hệ và kết nối làm việc trong tương lai. Mạng lưới mở rộng này có thể trở thành nguồn cảm hứng, hỗ trợ và cơ hội phát triển cho bạn trong suốt sự nghiệp của mình.
                                            Hơn nữa, việc tìm kiếm việc làm cung cấp cho bạn một cơ hội để thể hiện và phát huy tài năng của mình. Các công việc mới giúp bạn thử thách bản thân, phát triển kỹ năng và đưa ra những ý tưởng sáng tạo. Bạn có thể học cách làm việc trong một môi trường mới, rèn kỹ năng quản lý thời gian và giải quyết vấn đề. Điều này không chỉ giúp bạn trở thành một ứng viên đáng chú ý, mà còn xây dựng lòng tự tin và tạo điểm nhấn cho sự phát triển cá nhân của bạn.
                                            Cuối cùng, tìm kiếm việc làm cũng mang lại lợi ích tài chính và ổn định. Công việc cho phép bạn kiếm lương và thu nhập, cung cấp sự ổn định tài chính và đảm bảo cho cuộc sống hàng ngày của bạn.
                                        </p>
                                        <div className="text-center">
                                            <Link to={'/login'} class="btn post-btn">Tham gia ngay</Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="apply-process-area apply-bg pt-150 pb-150"
                     style={{ backgroundImage: `url("assets/img/gallery/how-applybg.png")` }}>
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="section-tittle white-text text-center">
                                    <span>Quy trình tìm việc</span>
                                    <h2> Thực hiện như thế nào ?</h2>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-4 col-md-6">
                                <div className="single-process text-center mb-30">
                                    <div className="process-ion">
                                        <span className="flaticon-search"/>
                                    </div>
                                    <div className="process-cap">
                                        <h5>1. Tìm kiếm công việc</h5>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-4 col-md-6">
                                <div className="single-process text-center mb-30">
                                    <div className="process-ion">
                                        <span className="flaticon-curriculum-vitae"/>
                                    </div>
                                    <div className="process-cap">
                                        <h5>2. Ứng tuyển công việc</h5>

                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-4 col-md-6">
                                <div className="single-process text-center mb-30">
                                    <div className="process-ion">
                                        <span className="flaticon-tour"/>
                                    </div>
                                    <div className="process-cap">
                                        <h5>3. Nhận công việc</h5>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}

export default About
