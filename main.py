from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
from dotenv import load_dotenv
from Dashboard import Dashboard
import os

app = FastAPI()

load_dotenv("secret.env")
token = os.environ.get("DATABRICKS_TOKEN")
host=os.environ.get("DATABRICKS_HOST")
job_id = os.environ.get("DATABRICKS_JOB_ID")
d = Dashboard(host, token)

@app.get("/dashboard", response_class=HTMLResponse)
async def read_items():
    return d.get_latest_job_dashboard(job_id=job_id)

app.mount("/", StaticFiles(directory="frontend/visualizer/build", html=True), name="static")