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
  const [comparePer, setPer] = useState({
    deathCnt: 0,
    decideCnt: 0,
  });

  useEffect(() => {
    console.log("data changed");
    if (covidArray.length !== 0) {
      setPer({
        decideCnt:
          (covidArray[covidArray.length - 1].decideCnt /
            covidArray[0].decideCnt) *
            100 -
          100,
        deathCnt:
          (covidArray[covidArray.length - 1].deathCnt /
            covidArray[0].deathCnt) *
            100 -
          100,
      });
    }
  });

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
    <div className="wholeContainer">
      <Divider>
        <h1>코로나 분석기</h1>
      </Divider>
      <p>시작 날짜 선택 후 종료 날짜 선택</p>
      <p>데이터 로드: {data.isLoading === true ? "미완료" : "완료"}</p>

      <div className="container">
        <Space direction="vertical">
          <DatePicker onChange={dateChanged1} placeholder="시작날짜" />
          <DatePicker onChange={dateChanged2} placeholder="종료날짜" />
        </Space>

        <br />
        <hr />
        <br />
        <h3>확진자 추이</h3>
        {comparePer && (
          <p>{`시작날짜 대비 ${comparePer.decideCnt.toFixed(
            3
          )}% 증가하였습니다`}</p>
        )}
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
        {comparePer && (
          <p>{`시작날짜 대비 ${comparePer.deathCnt.toFixed(
            3
          )}% 증가하였습니다`}</p>
        )}
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
