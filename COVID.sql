-- Databricks notebook source
-- MAGIC %python
-- MAGIC from pyspark import SparkFiles
-- MAGIC sc.addFile("https://github.com/owid/covid-19-data/raw/master/public/data/owid-covid-data.csv")
-- MAGIC data = spark.read.csv("file://" +SparkFiles.get("owid-covid-data.csv"), header="true", inferSchema="true")
-- MAGIC # data.take(10)
-- MAGIC data.createOrReplaceTempView("covid")
-- MAGIC # data.write.format("delta").mode("overwrite").save("/delta/covid")

-- COMMAND ----------

-- MAGIC %python
-- MAGIC df = spark.sql('''
-- MAGIC SELECT * from covid
-- MAGIC limit 1000
-- MAGIC ''')
-- MAGIC df.coalesce(1).write.format('json').mode("overwrite").save('dbfs:/FileStore/covid')

-- COMMAND ----------

-- MAGIC %sh
-- MAGIC cd /dbfs/FileStore
-- MAGIC find . -name "*.json" | xargs -i cp {} ../covid.json

-- COMMAND ----------

-- MAGIC %sh
-- MAGIC ls /dbfs/FileStore
-- MAGIC cat /dbfs/FileStore/covid.json

-- COMMAND ----------

-- MAGIC %python
-- MAGIC df = spark.sql('''
-- MAGIC SELECT max(date) as date from covid
-- MAGIC ''')
-- MAGIC df.coalesce(1).write.format('json').mode("overwrite").save('dbfs:/FileStore/covid_date')
-- MAGIC display(df)

-- COMMAND ----------

SELECT * from covid
limit 1000

-- COMMAND ----------

CREATE OR REPLACE TEMP VIEW daily
    AS 
SELECT iso_code, location as region, new_cases as daily_new_cases, new_deaths as daily_new_deaths, new_vaccinations as daily_new_vaccinations from covid
where date IN (
  select max(date) from covid
) and iso_code not like "OWID%"
order by new_cases desc;

-- COMMAND ----------

-- MAGIC %python
-- MAGIC df = spark.sql('''
-- MAGIC select * from daily
-- MAGIC ''')
-- MAGIC df.coalesce(1).write.format('json').mode("overwrite").save('dbfs:/FileStore/covid_by_region')
-- MAGIC display(df)

-- COMMAND ----------

-- MAGIC %python
-- MAGIC df = spark.sql('''
-- MAGIC select sum(daily_new_cases) as cases, sum(daily_new_deaths) as deaths, sum(daily_new_vaccinations) as vaccinations
-- MAGIC from daily
-- MAGIC ''')
-- MAGIC df.coalesce(1).write.format('json').mode("overwrite").save('dbfs:/FileStore/covid_summary')
-- MAGIC display(df)

-- COMMAND ----------

-- MAGIC %sh
-- MAGIC cd /dbfs/FileStore
-- MAGIC ls ./
-- MAGIC #find . -name "*.json" | xargs -i cp {} ../covid.json
-- MAGIC find ./covid_date -name "*.json" | xargs -i cp {} ./covid_date.json
-- MAGIC find ./covid_by_region -name "*.json" | xargs -i cp {} ./covid_by_region.json
-- MAGIC find ./covid_summary -name "*.json" | xargs -i cp {} ./covid_summary.json

-- COMMAND ----------

SELECT sum(new_cases) as daily_new_cases, date from covid
group by date
having daily_new_cases >=0
order by date asc
