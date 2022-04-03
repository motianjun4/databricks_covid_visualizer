import * as React from "react";
import { Divider, Box, Grid } from "@mui/material";
import {faker} from '@faker-js/faker'

function Summary() {
    let total_people = 10000000000;
    let daily_data = {
      case: faker.datatype.number(total_people * 0.001),
      death: faker.datatype.number(total_people * 0.001 * 0.0001),
      vaccine: faker.datatype.number(total_people * 0.001),
    };

  return (
    <div>
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
