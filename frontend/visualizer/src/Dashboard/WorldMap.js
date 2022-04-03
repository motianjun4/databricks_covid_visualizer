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

const geoUrl =
  "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json";

const colorScale = scaleLinear()
  .domain([0, 10000])
  .range(["#ffedea", "#ff5233"]);

const WorldMap = () => {
  const [content, setContent] = useState("");
  const [caseData, setCaseData] = useState({});

  const getRegionNames = async () => {
    try {
      const res = await fetch(geoUrl);
      if (!res.ok) {
        throw Error(res.statusText);
      }
      let j = await res.json();
      let keys = j.objects.ne_110m_admin_0_countries.geometries.map(
        (item) => item.properties.ISO_A3
      );
      let caseData = {};
      keys.forEach((item) => {
        caseData[item] = faker.datatype.number(10000);
      });
      setCaseData(caseData);
    } catch (error) {
      console.log("There was a problem when fetching the data: ", error);
    }
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
      >
        <ZoomableGroup zoom={1}>
          <Sphere stroke="#E4E5E6" strokeWidth={0.5} />
          <Graticule stroke="#E4E5E6" strokeWidth={0.5} />
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
            {
              console.log(geographies, "geogra")
              return geographies.map((geo) => {
                // console.log(geo.properties.ISO_A3);
                const d = caseData[geo.properties.ISO_A3];
                // console.log(d)
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    style={{
                      default: {
                        fill:d ? colorScale(d) : "#F5F4F6",
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
              })
            }
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>
      <ReactTooltip>{content}</ReactTooltip>
    </div>
  );
};

export default WorldMap;
