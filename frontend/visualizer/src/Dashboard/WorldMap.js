import React, { useState, useEffect } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
  Sphere,
  Graticule,
} from "react-simple-maps";
import { scaleLinear } from "d3-scale";
import faker from "@faker-js/faker";
import ReactTooltip from "react-tooltip";
import axios from "axios";

const geoUrl =
  "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json";



const WorldMap = () => {
  const [content, setContent] = useState("");
  const [caseData, setCaseData] = useState({});
  const [maxCases, setMaxCases] = useState(100000);

  const colorScale = scaleLinear()
    .domain([0, maxCases])
    .range(["#ffedea", "#ff5233"]);

  const getRegionNames = async () => {
    let resp = await axios.get("/api/covid_data");
    let data = resp.data.covid_by_region;
    let maxCases = 0;
    var dataObj = {}
    data.forEach(element => {
      // console.log(element)
      dataObj[element.iso_code] = element.daily_new_cases;
      maxCases = Math.max(maxCases, element.daily_new_cases? element.daily_new_cases: 0);
    })
    // console.log(maxCases)
    setMaxCases(maxCases);
    setCaseData(dataObj);
  };

  useEffect(()=>{
    getRegionNames()
  }, [])

  return (
    <div>
      <ComposableMap
        projectionConfig={{
          rotate: [-10, 0, 0],
          scale: 147,
        }}
        data-tip=""
        height={350}
      >
        <ZoomableGroup zoom={1}>
          <Sphere stroke="#E4E5E6" strokeWidth={0.5} />
          <Graticule stroke="#E4E5E6" strokeWidth={0.5} />
          <Geographies geography={geoUrl}>
            {({ geographies }) => {
              // console.log(geographies, "geogra");
              return geographies.map((geo) => {
                const d = caseData[geo.properties.ISO_A3];
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    style={{
                      default: {
                        fill: d ? colorScale(d) : "#F5F4F6",
                        outline: "none",
                      },
                      hover: {
                        fill: "#88F",
                        outline: "none",
                      },
                    }}
                    onMouseEnter={() => {
                      const { NAME } = geo.properties;
                      setContent(`${NAME} — ${d ? d : "Unknown"}`);
                    }}
                    onMouseLeave={() => {
                      setContent("");
                    }}
                  />
                );
              });
            }}
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>
      <ReactTooltip>{content}</ReactTooltip>
    </div>
  );
};

export default WorldMap;
