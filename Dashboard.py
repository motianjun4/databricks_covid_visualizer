from databricks_api import DatabricksAPI
import os
from dotenv import load_dotenv

class Dashboard:
    def __init__(self, host:str, token:str) -> None:
        self.db = DatabricksAPI(
            host=host,
            token=token
        )
    
    def get_latest_job_dashboard(self, job_id) -> str:
        runs_resp = self.db.jobs.list_runs(job_id, completed_only=True, limit=1)
        latest_run_id = runs_resp['runs'][0]['run_id']
        resp = self.db.jobs.export_run(latest_run_id, "DASHBOARDS")
        return resp['views'][0]['content']


if __name__ == "__main__":
    load_dotenv("secret.env")
    token = os.environ.get("DATABRICKS_TOKEN")
    host=os.environ.get("DATABRICKS_HOST")
    job_id = os.environ.get("DATABRICKS_JOB_ID")
    d = Dashboard(host, token)
    resp = d.get_latest_job_dashboard(job_id)
    print(resp)