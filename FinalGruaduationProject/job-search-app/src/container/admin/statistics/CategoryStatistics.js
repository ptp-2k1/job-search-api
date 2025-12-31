import React, { useEffect, useState } from 'react';
import Chart from 'chart.js/auto';
import { Bar } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Col, Row, Select } from 'antd';
import { getTopRecruitmentCompany, getTopApplicationCompany, getTopPurchaseCompany, getTopRecruitmentBranch, getTopPurchasedPackage } from "../../../service/StatisticsService";
import {toast, ToastContainer} from "react-toastify";

function PackageStatistics() {
    const today = new Date().getFullYear() + "-" + (new Date().getMonth()+1) + "-" + new Date().getDate()
    const categories = [
        {
            value: 0,
            label: 'Ngành nghề'
        },
        {
            value: 1,
            label: 'Đăng tuyển'
        },
        {
            value: 2,
            label: 'Ứng tuyển'
        },
        {
            value: 3,
            label: 'Doanh thu'
        },
        {
            value: 4,
            label: 'Gói dịch vụ'
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
            title: "các ngành nghề được tuyển dụng nhiều nhất",
            label: "Tuyển dụng"
        },
        {
            title: "các công ty đăng tuyển nhiều nhất",
            label: "Đăng tuyển"
        },
        {
            title: "các công ty được ứng tuyển nhiều nhất",
            label: "Ứng tuyển"
        },
        {
            title: "các công ty mang lại doanh thu cao nhất",
            label: "Doanh thu (vnđ)"
        },
        {
            title: "các gói dịch vụ mang lại doanh thu cao nhất",
            label: "Doanh thu (vnđ)"
        }
    ]

    const [title, setTitle] = useState(detailList[0].title)
    const [label, setLabel] = useState(detailList[0].label)
    const [category, setCategory] = useState(0)
    const [filterOption, setFilterOption] = useState("year")
    const [year, setYear] = useState(new Date().getFullYear())
    const [range, setRange] = useState({
        fromDate: today,
        toDate: today
    })
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
                    text: category === 0 ? "Ngành nghề" : ( category === 4 ? "Gói dịch vụ" : "Công ty" )
                }
            },
            y: {
                beginAtZero: true,
                grid: {
                    color: '#000000'
                },
                title: {
                    display: true,
                    text: category === 3 || category === 4 ? "Doanh thu" : "Số lượt"
                },
                ticks: {
                    stepSize:  category === 3 || category === 4 ? null : 1,
                },
            }
        }
    }
    let total = 0

    const getData = async () => {
        let categoryDataList

        switch (category)
        {
            case 0:
                categoryDataList = await getTopRecruitmentBranch({
                    fromDate: filterOption === "year" ? `${String(year)}-01-01` : range.fromDate,
                    toDate: filterOption === "year" ? `${String(year)}-12-31` : range.toDate
                })
                break
            case 1:
                categoryDataList = await getTopRecruitmentCompany({
                    fromDate: filterOption === "year" ? `${String(year)}-01-01` : range.fromDate,
                    toDate: filterOption === "year" ? `${String(year)}-12-31` : range.toDate
                })
                break
            case 2:
                categoryDataList = await getTopApplicationCompany({
                    fromDate: filterOption === "year" ? `${String(year)}-01-01` : range.fromDate,
                    toDate: filterOption === "year" ? `${String(year)}-12-31` : range.toDate
                })
                break
            case 3:
                categoryDataList = await getTopPurchaseCompany({
                    fromDate: filterOption === "year" ? `${String(year)}-01-01` : range.fromDate,
                    toDate: filterOption === "year" ? `${String(year)}-12-31` : range.toDate
                })
                break
            case 4:
                categoryDataList = await getTopPurchasedPackage({
                    fromDate: filterOption === "year" ? `${String(year)}-01-01` : range.fromDate,
                    toDate: filterOption === "year" ? `${String(year)}-12-31` : range.toDate
                })
                break
            default:
                break
        }

        let revenueLabels = []
        let revenueStatistics = []
        if(categoryDataList && categoryDataList.status === 200) {
            if(categoryDataList.data) {
                revenueLabels = Object.keys(categoryDataList.data).map((index) => categoryDataList.data[index].Name)
                revenueStatistics = Object.keys(categoryDataList.data)
                    .map((index) => ( category !== 3 && category !==4 ? categoryDataList.data[index].Amount : categoryDataList.data[index].Total))
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

    const handleChangeFilter = (event) => {
        setFilterOption(event.target.value)
    }

    const handleOnChangeYear = (year) => {
        setYear(year)
    }

    const handleOnChangeRange = (event) => {
        const { name, value } = event.target;
        setRange({ ...range, [name]: value });
    }

    const formatCurrency = (price) => {
        return new Intl.NumberFormat('vi', { style: "currency", currency: "VND" }).format(price)
    }

    useEffect(()=> {
        getData()
    },[category, year, filterOption, range])

    return (
        <>
            <div className="col-12 grid-margin">
                <div className="card">
                    <Row>
                        <Col xs={15} xxl={15}>
                            <label className="mt-3 col-sm-5 col-form-label">
                                <strong>
                                    Xem theo hạng mục:
                                </strong>
                            </label>
                            &nbsp;
                            <Select
                                className="ml-4"
                                style={{ width: "120px" }}
                                onChange={(value) => handleOnChange(value)}
                                defaultValue={category}
                                options={categories}
                            >
                            </Select>
                        </Col>
                        <Col xs={15} xxl={15}>
                            <input
                                style={{ cursor: "pointer" }}
                                className="ml-3"
                                type="radio"
                                name="filter"
                                value="year"
                                checked={filterOption === "year"}
                                onChange={(value) => handleChangeFilter(value)}
                            />
                            <label className="mt-3 col-sm-5 col-form-label">
                                Xem theo năm:
                            </label>
                            <Select
                                style={{ width: "120px" }}
                                onChange={(event) => handleOnChangeYear(event)}
                                defaultValue={year}
                                options={years}
                            >
                            </Select>
                        </Col>
                        <Col xs={15} xxl={15}>
                            <input
                                style={{ cursor: "pointer" }}
                                className="ml-3"
                                type="radio"
                                name="filter"
                                value="range"
                                checked={filterOption === "range"}
                                onChange={(event) => handleChangeFilter(event)}
                            />
                            <label className="mt-3 col-sm-5 col-form-label">
                                Xem theo khoảng thời gian:
                            </label>
                            <input
                                style={{ color: "#495057", cursor: "pointer" }}
                                type="date"
                                name="fromDate"
                                value={range.fromDate}
                                onKeyDown={false}
                                onChange={(event) => handleOnChangeRange(event)}
                            />
                            &nbsp;&nbsp;&nbsp;
                            <> - </>
                            &nbsp;&nbsp;&nbsp;
                            <input
                                style={{ color: "#495057", cursor: "pointer" }}
                                type="date"
                                name="toDate"
                                value={range.toDate}
                                onKeyDown={false}
                                onChange={(event) => handleOnChangeRange(event)}
                            />
                        </Col>
                    </Row>
                    <div className="card-body">
                        <h4 className="card-title text-center">Biểu đồ {title}</h4>
                        <Bar data={data} plugins={[ChartDataLabels]} options={options} type={null} />
                    </div>
                    <div className="card-body">
                        <h4 className="card-title text-center">
                            Bảng {title}
                        </h4>
                        <div className="table-responsive pt-2">
                            <table
                                className="table table-bordered table-hover"
                                style={{ borderCollapse: "collapse",  backgroundColor: "#ffffff" }}
                            >
                                <thead style={{ position: "sticky", top: "0", borderColor: "black" }}>
                                <tr style={{ textAlign: "center", backgroundColor: "#afcbdb" }}>
                                    <th style={{ border: "1px solid black"}} >{category === 0 ? "Ngành nghề" : (category !== 4 ? "Công ty" : "Gói dịch vụ")}</th>
                                    <th style={{ border: "1px solid black"}} >{category === 0 || category === 1 ? "Lượt đăng tuyển" : (category !== 2 ? "Doanh thu" : "Lượt ứng tuyển")}</th>
                                </tr>
                                </thead>
                                <tbody>
                                {table && table.length > 0 &&
                                table.map((item, index) => {
                                    total = total + (category !== 3 && category !== 4 ? item.Amount : item.Total)
                                    return (
                                        <tr key={index}>
                                            <td className="text-center" >{item.Name}</td>
                                            <td className="text-center" >{category !== 3 && category !== 4 ? item.Amount : formatCurrency(item.Total)}</td>
                                        </tr>
                                    )
                                })}
                                {
                                    table && table.length > 0 &&
                                    (
                                        <tr>
                                            <td className="text-center" >Tổng {category === 0 || category === 1 ? "lượt đăng tuyển" : (category !== 2 ? "doanh thu" : "lượt ứng tuyển")}</td>
                                            <td className="text-center" >{category !== 3 && category !== 4 ? total : formatCurrency(total)}</td>
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