import React, { useEffect, useState } from 'react';
import Chart from 'chart.js/auto';
import { Bar } from 'react-chartjs-2';
import ChartDataLabels from "chartjs-plugin-datalabels";
import { toast, ToastContainer } from "react-toastify";
import { Col, Row, Select } from 'antd';
import { getPostsByCompany, getApplicationsByCompany, getPaymentByCompany, getTopAppliedPostByCompany } from "../../../service/StatisticsService";

function PackageStatistics() {

    const categories = [
        {
            value: 0,
            label: 'Đăng tuyển'
        },
        {
            value: 1,
            label: 'Ứng tuyển'
        },
        {
            value: 2,
            label: 'Bài tuyển dụng'
        },
        {
            value: 3,
            label: 'Phí thanh toán gói dịch vụ'
        }
    ]

    const years = [
        {
            value: 2023,
            label: '2023'
        },
        {
            value: 2024,
            label: '2024'
        }
    ]

    const detailList = [
        {
            title: "số lượt đăng tuyển của công ty",
            label: "Đăng tuyển"
        },
        {
            title: "số lượt ứng tuyển vào công ty",
            label: "Ứng tuyển"
        },
        {
            title: "các bài tuyển dụng của công ty được ứng tuyển nhiều nhất",
            label: "Ứng tuyển"
        },
        {
            title: "phí thanh toán gói dịch vụ",
            label: "Phí thanh toán (vnđ)"
        }
    ]

    const [title, setTitle] = useState(detailList[0].title)
    const [label, setLabel] = useState(detailList[0].label)
    const [category, setCategory] = useState(0)
    const [year, setYear] = useState(new Date().getFullYear())

    const [data, setData] = useState({
        labels: [],
        datasets: []
    })
    const [table, setTable] = useState([])

    const options = {
        plugins: {
            datalabels: {
                display: true,
                color: "#000000",
                formatter: (value) => value === 0 ? "" : new Intl.NumberFormat('vi', { style: "currency", currency: "VND" }).format(value).slice(0, -1),
                anchor: "end",
                offset: -25,
                align: "start"
            }
        },
        legend: { display: false },
        scales: {
            x: {
                offset: true,
                grid: {
                    display: false
                },
                title: {
                    display: true,
                    text:  category === 2 ? "Bài tuyển dụng" : "Tháng"
                }
            },
            y: {
                beginAtZero: true,
                grid: {
                    color: '#000000'
                },
                title: {
                    display: true,
                    text: category === 3 ? "Phí thanh toán" : "Số lượt"
                },
                ticks: {
                    stepSize:  category === 3 ? null : 1,
                },
            }
        }
    }
    let total = 0

    let getData = async ()=> {
        let categoryDataList
        switch (category)
        {
            case 0:
                categoryDataList = await getPostsByCompany({
                    id: localStorage.getItem("userId"),
                    year: year
                })
                break
            case 1:
                categoryDataList = await getApplicationsByCompany({
                    id: localStorage.getItem("userId"),
                    year: year
                })
                break
            case 2:
                categoryDataList = await getTopAppliedPostByCompany({
                    id: localStorage.getItem("userId"),
                    year: year
                })
                break
            case 3:
                categoryDataList = await getPaymentByCompany({
                    id: localStorage.getItem("userId"),
                    year: year
                })
                break
            default:
                break
        }

        let revenueLabels = []
        let revenueStatistics = []
        if(categoryDataList && categoryDataList.status === 200) {
            if(categoryDataList.data) {
                revenueLabels = category === 2 ? Object.keys(categoryDataList.data).map((index) => categoryDataList.data[index].Title) : [ '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12' ]
                revenueStatistics = Object.keys(categoryDataList.data)
                    .map((index) => ( category !== 3 ? categoryDataList.data[index].Amount : categoryDataList.data[index].Total))
                setData({
                    labels: revenueLabels,
                    datasets: [{
                        label: label,
                        backgroundColor: "#fb246a",
                        borderColor: "#fb246a",
                        data: revenueStatistics
                    }]
                })
                setTable(categoryDataList.data)
            } else {
                setData({
                    labels: revenueLabels,
                    datasets: [{
                        label: label,
                        backgroundColor: "#fb246a",
                        borderColor: "#fb246a",
                        data: []
                    }]
                })
                setTable([])
            }
        }
    }

    const handleOnChange = (value) => {
        setCategory(value)
        setTitle(detailList[value].title)
        setLabel(detailList[value].label)
    }

    const handleOnChangeYear = (year) => {
        setYear(year)
    }

    const formatCurrency = (price) => {
        return new Intl.NumberFormat('vi', { style: "currency", currency: "VND" }).format(price)
    }

    useEffect(()=> {
        getData()
    },[category, year])

    return (
        <>
            <div className="col-12 grid-margin" style={{backgroundColor: "#eaedff"}}>
                <div className="card" style={{backgroundColor: "#eaedff"}}>
                    <h4 className="card-title">Xem tổng quan báo cáo - thống kê</h4>
                    <div className="card-body">
                        <Row>
                            <Col xs={13} xxl={13}>
                                <label className="mt-3 col-sm-5 col-form-label">
                                    <strong>
                                        Xem theo hạng mục:
                                    </strong>
                                </label>
                                &nbsp;
                                <Select
                                    style={{ width: "210px" }}
                                    onChange={(value) => handleOnChange(value)}
                                    defaultValue={category}
                                    options={categories}
                                >
                                </Select>
                            </Col>
                            <Col xs={13} xxl={13}>
                                <label className="mt-3 col-sm-5 col-form-label">
                                    <strong>
                                        Xem theo năm:
                                    </strong>
                                </label>
                                &nbsp;
                                <Select
                                    style={{ width: "210px" }}
                                    onChange={(event) => handleOnChangeYear(event)}
                                    defaultValue={year}
                                    options={years}
                                >
                                </Select>
                            </Col>
                        </Row>
                        <br/>
                        <h4 className="card-title text-center">Biểu đồ {title} trong năm {year}</h4>
                        <Bar data={data} plugins={[ChartDataLabels]} options={options} type={null} />
                    </div>
                    <div className="card-body">
                        <h4 className="card-title text-center">
                            Bảng {title} trong năm {year}
                        </h4>
                        <div className="table-responsive pt-2">
                            <table
                                className="table table-bordered table-hover"
                                style={{ borderCollapse: "collapse",  backgroundColor: "#ffffff" }}
                            >
                                <thead style={{ position: "sticky", top: "0", borderColor: "black" }}>
                                <tr style={{ textAlign: "center", backgroundColor: "#afcbdb" }}>
                                    <th style={{ border: "1px solid black"}} >{category !== 2 ? "Tháng" : "Bài tuyển dụng" }</th>
                                    <th style={{ border: "1px solid black"}} >{category === 0 ? "Lượt đăng tuyển" : (category !== 3 ? "Lượt ứng tuyển" : "Phí thanh toán") }</th>
                                </tr>
                                </thead>
                                <tbody>
                                {table && table.length > 0 &&
                                table.map((item, index) => {
                                    total = total + (category !== 3 ? item.Amount : item.Total)
                                    return (
                                        <tr key={index}>
                                            <td className="text-center" >{category !== 2 ? item.Months : item.Title}</td>
                                            <td className="text-center" >{category !== 3 ? item.Amount : formatCurrency(item.Total)}</td>
                                        </tr>
                                    )
                                })}
                                {
                                    table && table.length > 0 &&
                                    (
                                        <tr>
                                            <td className="text-center" >Tổng {category === 0 ? "lượt đăng tuyển" : (category !== 3 ? "lượt ứng tuyển" : "phí thanh toán")}</td>
                                            <td className="text-center" >{category !== 3 ? total : formatCurrency(total)}</td>
                                        </tr>
                                    )
                                }
                                </tbody>
                            </table>
                            {
                                (!table || table && table.length === 0) &&
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
    );
}

export default PackageStatistics;