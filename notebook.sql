-- Databricks notebook source
-- MAGIC %python
-- MAGIC from pyspark import SparkFiles
-- MAGIC sc.addFile("https://github.com/owid/covid-19-data/raw/master/public/data/owid-covid-data.csv")
-- MAGIC data = spark.read.csv("file://" +SparkFiles.get("owid-covid-data.csv"), header="true", inferSchema="true")
-- MAGIC data.write.format("delta").mode("overwrite").save("/delta/covid")

-- COMMAND ----------

DROP TABLE IF EXISTS covid;
CREATE TABLE covid USING DELTA LOCATION '/delta/covid/'

-- COMMAND ----------


SELECT * from covid
limit 1000

-- COMMAND ----------

SELECT max(date) as date from covid

-- COMMAND ----------

SELECT location as region, new_cases as daily_new_cases from covid
where date IN (
  select max(date) from covid
) and iso_code not like "OWID%"
order by new_cases desc
limit 100

-- COMMAND ----------

SELECT sum(new_cases) as daily_new_cases, date from covid
group by date
having daily_new_cases >=0
order by date asc
