import React, {useState, useEffect} from "react";
import { Divider, Box, Grid } from "@mui/material";
import {faker} from '@faker-js/faker'
import axios from 'axios';


function Summary() {
  const [daily_data, setDailyData] = useState({
    case: 0,
    death: 0,
    vaccine: 0
  });
  const [date, setDate] = useState('');

  async function getData(){
    let resp = await axios.get("/api/covid_data")
    let data = resp.data.covid_summary;
    setDailyData({
      case: data.cases,
      death: data.deaths,
      vaccine: data.vaccinations,
    })
    setDate(resp.data.covid_date);
  }

  useEffect(()=>{
    getData()
  }, []);

  return (
    <div>
      <Grid>
        {date}
      </Grid>
      <Grid container spacing={1}>
        <Grid item xs>
          <div style={{ fontSize: "0.7em" }}>Daily Cases</div>
          <div>{daily_data.case}</div>
        </Grid>
        <Divider orientation="vertical" flexItem></Divider>
        <Grid item xs>
          <div style={{ fontSize: "0.7em" }}>Daily Deaths</div>
          <div>{daily_data.death}</div>
        </Grid>
        <Divider orientation="vertical" flexItem></Divider>
        <Grid item xs>
          <div style={{ fontSize: "0.7em" }}>
            Daily Vaccine Doses Administered
          </div>
          <div>{daily_data.vaccine}</div>
        </Grid>
      </Grid>
    </div>
  );
}

export default Summary;
