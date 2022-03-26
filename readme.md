# Databricks COVID Visualizer
In this project, I utilized Databricks to process the COVID dataset. A Spark job has been set up to process the data periodically to generate a dashboard to show the daily COVID cases.

Demo link: https://covid.tinchun.top/

For the data processing code, you can check out [notebook.sql](./notebook.sql) for more detail.

I used Databricks REST API to retrieve the generated dashboard to get the latest run for the Spark job and export the generated result as HTML. Then, I set up a service to serve the HTML. I also configured a GCP Cloud Run CI/CD workflow to automate the development and deployment process.