import React, { useEffect, useState } from 'react';
import Chart from 'chart.js/auto';
import { Bar } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Col, Row, Select } from 'antd';
import { getRevenueByYearTotal } from "../../../service/StatisticsService";
import {toast} from "react-toastify";

function PackageStatistics() {
    const years = [
        {
            value: 2023,
            label: "2023"
        },
        {
            value: 2024,
            label: "2024"
        }
    ]
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
                    text: "Tháng"
                }
            },
            y: {
                beginAtZero: true,
                grid: {
                    color: '#000000'
                },
                title: {
                    display: true,
                    text: "Doanh thu"
                },
            }
        }
    }
    let total = 0

    const getData = async () => {
        const revenueDataList = await getRevenueByYearTotal({
            year: year
        })

        let revenueStatistics = []

        if(revenueDataList && revenueDataList.status === 200) {
            revenueStatistics = Object.keys(revenueDataList.data).map((index) => revenueDataList.data[index].Total)
            setData({
                labels: [ '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12' ],
                datasets: [{
                    label: "Doanh thu (vnđ)",
                    backgroundColor: "#fb246a",
                    borderColor: "#fb246a",
                    data: revenueStatistics
                }]
            })
            setTable(revenueDataList.data)
        }
    }

    const handleOnChange = (value)=> {
        setYear(value)
    }

    const formatCurrency = (price) => {
        return new Intl.NumberFormat('vi', { style: "currency", currency: "VND" }).format(price)
    }

    useEffect(()=> {
        getData()
    },[year])

    return (
        <>
            <div className="col-12 grid-margin">
                <div className="card">
                    <Row>
                        <Col xs={12} xxl={12}>
                            <label className="mt-3 col-sm-4 col-form-label">
                                <strong>
                                    Xem theo năm:
                                </strong>
                            </label>
                            <Select
                                onChange={(value) => handleOnChange(value)}
                                defaultValue={year}
                                options={years}
                            >
                            </Select>
                        </Col>
                    </Row>
                    <div className="card-body">
                        <h4 className="card-title text-center">
                            Biểu đồ doanh thu gói dịch vụ trong một năm
                        </h4>
                        <Bar data={data} plugins={[ChartDataLabels]} options={options} type={null} />
                    </div>
                    <div className="card-body">
                        <h4 className="card-title text-center">
                            Bảng doanh thu gói dịch vụ trong năm {year}
                        </h4>
                        <div className="table-responsive pt-2">
                            <table
                                className="table table-bordered table-hover"
                                style={{ borderCollapse: "collapse" }}
                            >
                                <thead style={{ position: "sticky", top: "0", borderColor: "black" }}>
                                <tr style={{ textAlign: "center", backgroundColor: "#afcbdb" }}>
                                    <th style={{ border: "1px solid black"}} >Tháng</th>
                                    <th style={{ border: "1px solid black"}} >Doanh thu</th>
                                </tr>
                                </thead>
                                <tbody>
                                {table && table.length > 0 &&
                                table.map((item, index) => {
                                    total = total + item.Total
                                    return (
                                        <tr key={index}>
                                            <td className="text-center" >{item.Months}</td>
                                            <td className="text-center" >{formatCurrency(item.Total)}</td>
                                        </tr>
                                    )
                                })}
                                {
                                    table && table.length > 0 &&
                                    (
                                        <tr>
                                            <td className="text-center" >Tổng doanh thu</td>
                                            <td className="text-center" >{formatCurrency(total)}</td>
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
        </>
    );
}

export default PackageStatistics;