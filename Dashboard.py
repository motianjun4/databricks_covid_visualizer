import base64
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

    def get_DBFS_data(self, path: str) -> str:
        resp = self.db.dbfs.read(path)
        b64 = resp['data']
        text = base64.b64decode(b64).decode('utf-8')
        return text

    def load_json_list(self, json_text: str) -> dict:
        import json
        json_text = f"""[{",".join(json_text.splitlines())}]"""
        d = json.loads(json_text)
        return d
    
    def load_json_obj(self, json_text: str) -> dict:
        import json
        d = json.loads(json_text)
        return d
    
    def get_data(self) -> dict:
        text = self.get_DBFS_data("/FileStore/covid_date.json")
        covid_date = self.load_json_obj(text)
        text = self.get_DBFS_data("/FileStore/covid_summary.json")
        covid_summary = self.load_json_obj(text)
        text = self.get_DBFS_data("/FileStore/covid_by_region.json")
        covid_by_region = self.load_json_list(text)
        return {
            "covid_date": covid_date['date'],
            "covid_summary": covid_summary,
            "covid_by_region": covid_by_region,
        }

if __name__ == "__main__":
    load_dotenv("secret.env")
    token = os.environ.get("DATABRICKS_TOKEN")
    host=os.environ.get("DATABRICKS_HOST")
    job_id = os.environ.get("DATABRICKS_JOB_ID")
    d = Dashboard(host, token)
    a = d.get_data()
    print(a)