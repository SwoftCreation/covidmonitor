import React, { useState, useEffect } from "react";
import "../style/Homestyle.scss";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { DatePicker, Space, Divider } from "antd";
import {
  DashboardOutlined,
  CheckOutlined,
  CloseOutlined,
  RiseOutlined,
  FallOutlined,
} from "@ant-design/icons";

export default function Home() {
  const urlDate = { startDate: "20210507", endDate: "20220720" };
  let encodeKey =
    "YYOHmEDAwZljEHlxr034spej%2FZXNQYJhtr5GbBoPnASFpzzBl2NyvXA9IEVjYYzGSavHftX9aSXQ93GgRL%2B2Ww%3D%3D";

  let url = `http://openapi.data.go.kr/openapi/service/rest/Covid19/getCovid19InfStateJson?serviceKey=${encodeKey}&pageNo=1&numOfRows=20&startCreateDt=${urlDate.startDate}&endCreateDt=${urlDate.endDate}`;

  const [data, setData] = useState({
    isLoading: true,
    urlData: "",
    covidData: [],
  });

  // axios 시작
  const getApiData = async () => {
    await axios.get(url).then((response) => {
      console.log("getApiData()");

      setData({
        ...data,
        isLoading: false,
        urlData: response.data.response.body.items.item.reverse(),
      });
    });
  };

  const dateChanged1 = (date, dateString) => {
    urlDate.startDate = dateString.replace(/\-/g, "");
    console.log(urlDate.startDate);
  };
  const dateChanged2 = (date, dateString) => {
    urlDate.endDate = dateString.replace(/\-/g, "");
    console.log(date, dateString);
    url = `http://openapi.data.go.kr/openapi/service/rest/Covid19/getCovid19InfStateJson?serviceKey=${encodeKey}&pageNo=1&numOfRows=20&startCreateDt=${urlDate.startDate}&endCreateDt=${urlDate.endDate}`;
    getApiData();
  };

  return (
    <div className="wholeContainer">
      <Divider>
        <h1>
          <DashboardOutlined />
          &nbsp;코로나 분석기
        </h1>
      </Divider>
      <p>시작 날짜 선택 후 종료 날짜 선택</p>
      <p>
        데이터 호출여부:{" "}
        {data.isLoading === true ? <CloseOutlined /> : <CheckOutlined />}
      </p>

      <div className="container">
        <Space direction="vertical">
          <DatePicker onChange={dateChanged1} placeholder="시작날짜" />
          <DatePicker onChange={dateChanged2} placeholder="종료날짜" />
        </Space>

        <br />
        <hr />
        <br />
        <h3>확진자 추이</h3>
        {data.urlData && (
          <p>
            {`${(
              (data.urlData[data.urlData.length - 1].decideCnt /
                data.urlData[0].decideCnt) *
                100 -
              100
            ).toFixed(3)} %`}
            <RiseOutlined />
          </p>
        )}
        <LineChart
          width={500}
          height={300}
          data={data.urlData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="stateDt" />
          <YAxis type="number" domain={["dataMin", "dataMax"]} />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="decideCnt"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
        </LineChart>
        <hr />
        <h3>사망자 추이</h3>
        {data.urlData && (
          <p>
            {`${(
              (data.urlData[data.urlData.length - 1].deathCnt /
                data.urlData[0].deathCnt) *
                100 -
              100
            ).toFixed(3)} %`}
            <RiseOutlined />
          </p>
        )}
        <LineChart
          width={500}
          height={300}
          data={data.urlData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="stateDt" />
          <YAxis type="number" domain={["dataMin", "dataMax"]} />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="deathCnt"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </div>

      <hr />

      <hr />
    </div>
  );
}
