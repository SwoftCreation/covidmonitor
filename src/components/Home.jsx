import React, { useState, useEffect } from "react";
import "../style/Homestyle.scss";
import axios from "axios";

export default function Home() {
  const [state, setState] = useState({
    isLoading: false,
    data: "nothing",
  });
  const contentStyle = {
    height: "160px",
    color: "#fff",
    lineHeight: "160px",
    textAlign: "center",
    background: "#364d79",
  };
  useEffect(() => {
    console.log("state changed");
  }, [state]);
  let encodeKey =
    "YYOHmEDAwZljEHlxr034spej%2FZXNQYJhtr5GbBoPnASFpzzBl2NyvXA9IEVjYYzGSavHftX9aSXQ93GgRL%2B2Ww%3D%3D";

  const url = `http://openapi.data.go.kr/openapi/service/rest/Covid19/getCovid19InfStateJson?serviceKey=${encodeKey}&pageNo=1&numOfRows=10&startCreateDt=20200310&endCreateDt=20200315`;
  console.log(url);

  axios.get(url).then((response) => {
    const data = response.data.list;
    console.log(data);

    this.setState({
      isLoading: false,
      data: data,
    });
  });
  const onChange = (currentSlide) => {
    console.log(currentSlide);
  };
  return (
    <div>
      <h1>코로나 확진 정보</h1>
      <p>발급키: {encodeKey}</p>
      <p>로딩중: {state.isLoading === true ? "예" : "아니요"}</p>
      <Carousel afterChange={onChange}>
        <div>
          <h3 style={contentStyle}>1</h3>
        </div>
        <div>
          <h3 style={contentStyle}>2</h3>
        </div>
        <div>
          <h3 style={contentStyle}>3</h3>
        </div>
        <div>
          <h3 style={contentStyle}>4</h3>
        </div>
      </Carousel>
    </div>
  );
}
