import React, { useEffect, useState } from 'react';
import Chart from 'chart.js/auto';
import { Bar } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Col, Row, Select } from 'antd';
import { getPostsByYearTotal, getApplicationsByYearTotal } from '../../../service/StatisticsService';
import {toast} from "react-toastify";

function PostStatistics() {
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
    const [year, setYear] = useState(new Date().getFullYear())
    const [data, setData] = useState({
        labels: [],
        datasets: []
    })
    const [status, setStatus] = useState(false)
    const [table, setTable] = useState([])
    const options = {
        plugins: {
            datalabels: {
                display: true,
                color: "#000000",
                formatter: (value) => value === 0 ? "" : value,
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
                    text: 'Tháng'
                }
            },
            y: {
                beginAtZero: true,
                grid: {
                    color: '#000000'
                },
                title: {
                    display: true,
                    text: 'Số lượt'
                },
                ticks: {
                    stepSize: 1,
                },
            }
        }
    }
    let postTotal = 0
    let applicationTotal = 0

    const getData = async () => {
        const applicationDataList = await getApplicationsByYearTotal({
            year: year
        })
        const postDataList = await getPostsByYearTotal({
            year: year
        })

        if(postDataList && postDataList.status === 200 && applicationDataList && applicationDataList.status === 200) {
            const postStatistics = Object.keys(postDataList.data).map((index) => postDataList.data[index].Amount)
            const applicationStatistics = Object.keys(applicationDataList.data).map((index) => applicationDataList.data[index].Amount)
            const tableStatistics = Object.keys(postDataList.data).map((index) => [postDataList.data[index].Amount, applicationDataList.data[index].Amount])
            setData({
                labels: [ '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12' ],
                datasets: [{
                    label: 'Đăng tuyển',
                    backgroundColor: "#fb246a",
                    data: postStatistics
                },
                    {
                        label: 'Ứng tuyển',
                        backgroundColor: "#27367f",
                        data: applicationStatistics
                    }]
            })
            setTable(tableStatistics)
        }
    }

    let handleOnChange = (value)=> {
        setYear(value)
    }

    useEffect(()=> {
        getData()
    },[year, status])

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
                            Biểu đồ số lượt đăng tuyển và ứng tuyển trong một năm
                        </h4>
                        <Bar data={data} plugins={[ChartDataLabels]} options={options} type={null} />
                    </div>
                    <div className="card-body">
                        <h4 className="card-title text-center">
                            Bảng số lượt đăng tuyển và ứng tuyển trong năm {year}
                        </h4>
                        <div className="table-responsive pt-2">
                            <table
                                className="table table-bordered table-hover"
                                style={{ borderCollapse: "collapse" }}
                            >
                                <thead style={{ position: "sticky", top: "0", borderColor: "black" }}>
                                <tr style={{ textAlign: "center", backgroundColor: "#afcbdb" }}>
                                    <th style={{ border: "1px solid black"}} >Tháng</th>
                                    <th style={{ border: "1px solid black"}} >Lượt đăng tuyển</th>
                                    <th style={{ border: "1px solid black"}} >Lượt ứng tuyển</th>
                                </tr>
                                </thead>
                                <tbody>
                                {table && table.length > 0 &&
                                table.map((item, index) => {
                                    postTotal = postTotal + item[0]
                                    applicationTotal = applicationTotal + item[1]
                                    return (
                                        <tr key={index}>
                                            <td className="text-center" >{index+1}</td>
                                            <td className="text-center" >{item[0]}</td>
                                            <td className="text-center" >{item[1]}</td>
                                        </tr>
                                    )
                                })}
                                {
                                    table && table.length > 0 &&
                                    (
                                        <tr>
                                            <td className="text-center" >Tổng lượt</td>
                                            <td className="text-center" >{postTotal}</td>
                                            <td className="text-center" >{applicationTotal}</td>
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

export default PostStatistics;