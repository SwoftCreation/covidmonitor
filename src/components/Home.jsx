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

import { useCustomEffect } from "../js/CustomHook";

export default function Home() {
  const covidArray = [];
  const urlDate = { startDate: "20210507", endDate: "20220720" };
  let encodeKey =
    "YYOHmEDAwZljEHlxr034spej%2FZXNQYJhtr5GbBoPnASFpzzBl2NyvXA9IEVjYYzGSavHftX9aSXQ93GgRL%2B2Ww%3D%3D";

  let url = `http://openapi.data.go.kr/openapi/service/rest/Covid19/getCovid19InfStateJson?serviceKey=${encodeKey}&pageNo=1&numOfRows=20&startCreateDt=${urlDate.startDate}&endCreateDt=${urlDate.endDate}`;

  const [data, setData] = useState({
    isLoading: true,
    urlData: "",
    covidData: [],
  });

  useCustomEffect(() => {
    console.log("********** covidArray changed--!");

    console.log(covidArray);
  }, [covidArray]);

  // axios 시작
  const getApiData = async () => {
    await axios.get(url).then((response) => {
      console.log("getApiData()");

      setData({
        ...data,
        isLoading: false,
        urlData: response.data.response.body.items.item,
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
    <div>
      <Divider>코로나 확진자 정보</Divider>
      <h1>공공데이터포털</h1>
      <p>데이터 로드: {data.isLoading === true ? "미완료" : "완료"}</p>

      <div className="container">
        <Space direction="vertical">
          <DatePicker onChange={dateChanged1} />
          <DatePicker onChange={dateChanged2} />
        </Space>

        <br />
        <hr />
        <br />
        <h3>확진자 추이</h3>
        <LineChart
          width={500}
          height={300}
          data={covidArray}
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
        <LineChart
          width={500}
          height={300}
          data={covidArray}
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

      {data.urlData &&
        data.urlData.map((element, index) => {
          covidArray.unshift(element);
          console.log("pushed into array");

          // return (
          //   <p
          //     key={index}
          //   >{`날짜 ${element.createDt} --- 사망자 ${element.deathCnt}명`}</p>
          // );
        })}
    </div>
  );
}
