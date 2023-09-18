import configparser
import sys
import schedule
import pytz
import time
from datetime import timedelta
from datetime import datetime, date
from elasticsearch import Elasticsearch, helpers
import pandas as pd
from retry import retry
from elasticsearch.helpers import parallel_bulk

# from zoneinfo import ZoneInfo


import pandas as pd
import numpy as np


gconfig = configparser.ConfigParser()
gconfig.read("./conf/conf.ini")

# gconfig['ES']['host']

env = "PRD"
# env = "STG"

if env == "STG":
    client = Elasticsearch(
        [gconfig["ES"]["host"], gconfig["ES"]["host2"]],
        http_auth=(gconfig["ES"]["user"], gconfig["ES"]["password"]),
        verify_certs=False,
        # ssl_show_warn=False,
    )
else:
    client = Elasticsearch(
        [gconfig["ES"]["host"], gconfig["ES"]["host2"]],
        http_auth=(gconfig["ES"]["user"], gconfig["ES"]["password"]),
        verify_certs=False,
        # ssl_show_warn=False,
    )


def main():
    utc = pytz.timezone("UTC")
    # tz_pst = pytz.timezone("America/Los_Angeles")
    # localtz = ZoneInfo("America/Los_Angeles")
    timeFormat = "%Y-%m-%dT%H:%M:%SZ"
    # 30 분 전 end 그리고 90 전 start total 1 hour
    thirty_before = datetime.today() - timedelta(minutes=30)
    ninety_before = datetime.today() - timedelta(minutes=90)

    dt_start = ninety_before.astimezone(utc).strftime(timeFormat)
    dt_end = thirty_before.astimezone(utc).strftime(timeFormat)

    # 90 minutes before current pacifit time, it goes into ELK timestamp
    ninety_before_pacific_to_utc = ninety_before.astimezone(
        utc).strftime("%Y%m%d%H%M")
    print("from main", ninety_before_pacific_to_utc)
    print("proccessor starts")
    proccessor(dt_start, dt_end, ninety_before_pacific_to_utc, client)
    print("proccessor finish check elk")


@retry(tries=2, delay=2)
def proccessor(dt_start, dt_end, ninety_before_pacific_to_utc, client):
    print("delete start before putting data in")
    deleteTargetPeriod(dt_start, dt_end)
    print("process getting data")
    ev_df = get_data(dt_start, dt_end, "hma", client)
    print("process looping data")
    ev = final_data(ev_df)
    ev.to_csv("ev.csv")

    finalDf = combineDf(ev)

    print(finalDf)
    print("inserting data into elk")

    index_name = "dashboard_test"

    toElastic(finalDf, index_name, ninety_before_pacific_to_utc)
    print("data to ELK completed")


@retry(tries=2, delay=2)
def get_data(dt_start, dt_end, cbu, client):
    evQuery = ev_query(dt_start, dt_end, cbu)
    ev_df = get_elk_Result_Query(evQuery, client)

    return ev_df


@retry(tries=2, delay=2)
def final_data(ev_df):
    ev = ev_df
    # ice = ice_df

    ev["serviceName"] = ev["scenario"]
    ev["channel"] = ev["scenario"]
    # ev["fuelKindCode"] = "E"

    for item in serviceNames.items():
        ev["serviceName"] = ev.apply(
            lambda row: f"{item[0].upper()}"
            if row["serviceName"] in item[1]
            else row["serviceName"],
            axis=1,
        )
    for item in channelNames.items():
        ev["channel"] = ev.apply(
            lambda row: f"{item[0].upper()}"
            if row["channel"] in item[1]
            else row["channel"],
            axis=1,
        )
    return ev


# channel App, CWP, IOT, etc
# need a scenario with channel


@retry(tries=2, delay=2)
def combineDf(ev):
    # start_time === timestamptime 90 minute before eastern time
    result = {
        "@timestamp": [],
        "tid": [],
        # "vin": [],
        "scenario": [],
        "errorCode": [],
        "fuelKindCode": [],
        # "modelCode": [],
        # "isIQS": [],
        "second": [],
        "ServiceName": [],
        "Channel": [],
    }
    for index, row in ev.iterrows():
        result["@timestamp"].append(str(row["@timestamp"]))
        result["tid"].append(str(row["tid"]))
        # result["vin"].append(str(row["vin"]))
        result["scenario"].append(str(row["scenario"]))
        result["errorCode"].append(str(row["errorCode"]))
        result["fuelKindCode"].append(str(row["fuelKindCode"]))
        # result["modelCode"].append(str(row["modelCode"]))
        # result["isIQS"].append(str(row["isIQS"]))
        result["second"].append(float(row["second"]))
        result["ServiceName"].append(str(row["serviceName"]))
        result["Channel"].append(str(row["channel"]))

    df = pd.DataFrame(data=result)
    df.to_csv("loopingData.csv", index=False)
    return df


@retry(tries=2, delay=2)
def generator(df, index_name):
    for index, row in df.iterrows():
        document = {}
        try:
            document = {
                "@timestamp": getTimeStamp(str(row["@timestamp"])),
                "tid": str(row["tid"]) or "null",
                # "vin": str(row["vin"]) or "null",
                "scenario": str(row["scenario"]) or "null",
                "errorCode": str(row["errorCode"]) or "null",
                "fuelKindCode": str(row["fuelKindCode"]) or "null",
                # "modelCode": str(row["modelCode"]) or "null",
                # "isIQS": str(row["isIQS"]) or 0,
                "second": float(row["second"]) or 0,
                "serviceName": str(row["ServiceName"]) or "null",
                "channel": str(row["Channel"]) or "null",
            }
        except Exception as e:
            print(e)
        yield {"_op_type": "create", "_index": index_name, "_source": document}


@retry(tries=2, delay=2)
def toElastic(df, index_name, ninety_before_pacific_to_utc):

    errCnt = 0
    print(f"Prcoessing Elastic index:{index_name}")
    try:
        for ok, info in parallel_bulk(
            client,
            generator(df, index_name),
            raise_on_error=True,
        ):
            if not ok:
                errCnt += 1
    except Exception as e:
        print(e)
        print(f"An Error Occured {ninety_before_pacific_to_utc}")
    if errCnt > 1:
        print(f"Error Count: {errCnt}")


@retry(tries=2, delay=2)
# def deleteTargetPeriod(client, dt_start):
def deleteTargetPeriod(dt_start, dt_end):
    indexName = "dashboard_test"
    query = {
        "bool": {
            "must": [
                {
                    "range": {
                        "@timestamp": {
                            "gte": dt_start,
                            "lt": dt_end
                        }
                    }
                }
            ]
        }
    }
    # client.delete_by_query(index=indexName, query=query,
    #                        conflicts='proceed', wait_for_completion=False)
    client.delete_by_query(index=indexName, body={"query": query},
                           conflicts='proceed', wait_for_completion=False)
    # if res:
    #     print(f"Deleted: {res['deleted']}/{res['deleted']}")
    return


def getTimeStamp(tmval):
    iso_timestamp = tmval[:-1]
    dt_object = datetime.strptime(iso_timestamp, "%Y-%m-%dT%H:%M:%S.%f")
    converted_timestamp = dt_object.strftime("%Y%m%d%H%M")
    tz_pst = pytz.timezone("America/Los_Angeles")
    tz_est = pytz.timezone("America/New_York")
    tz_utc = pytz.timezone("UTC")
    datetime_fmt = "%Y%m%d%H%M"

    utc_fmt = "%Y-%m-%dT%H:%M:%S.%fZ"
    datetime_obj = datetime.strptime(
        converted_timestamp, datetime_fmt).astimezone(tz_pst)
    # datetime_obj = datetime_obj - timedelta(days=1)
    returnVal = datetime_obj.strftime(utc_fmt)
    return returnVal


@retry(tries=2, delay=2)
def get_elk_Result_Query(query, client):

    running = False
    qty = 1
    columns = []
    if env == "STG":
        initialResult = client.sql.query(query=query)
    else:
        initialResult = client.sql.query(body={"query": query})
    for item in initialResult["columns"]:
        columns.append(item["name"])
    data = initialResult["rows"]
    if "cursor" in initialResult:
        cursor = initialResult["cursor"]
        running = True
    while running:
        if env == "STG":
            nextResult = client.sql.query(cursor=cursor)
        else:
            nextResult = client.sql.query(body={"cursor": cursor})
        if len(nextResult["rows"]) == 0:
            running = False
        else:
            for item in nextResult["rows"]:
                data.append(item)
            if "cursor" in nextResult:
                cursor = nextResult["cursor"]
            else:
                running = False
            qty += 1

    finalData = getResultIntoDf(columns, data)
    print("df length:", len(data))
    # print(finalData)
    return finalData


def getResultIntoDf(columns, data):
    df = pd.DataFrame(data, columns=columns)
    return df


def ev_query(dt_start, dt_end, cbu):
    if cbu == "hma":
        company = "01"
    elif cbu == "kus":
        company = "02"
    elif cbu == "hacc":
        company = "14"
    elif cbu == "kca":
        company = "15"

    query = f"""
        select  "@timestamp",tid, scenario, errorCode, fuelKindCode, second
        from "lms_tms_tran_{company}*"
        WHERE "@timestamp" >= CAST('{dt_start}' AS DATETIME)
        AND "@timestamp" < CAST('{dt_end}' AS DATETIME)
        and scenario.keyword in ('EVC-B',	'EVC-C',	'EVC-D',	'EVC-E',	'EVC-F',	'EVC-G',	'EVC-S',
                                 'EVC-T',   'RDO-A',	'RDO-B',	'RDO-C',	'RDO-D',	'RDO-E',    'RDO-F',	
                                 'RDO-G',	'RDO-I',	'RSC-A',	'RSC-B',	'RSC-C',	'RSC-D',    'RSC-E',
                                 'RSC-H',	'RSC-I',	'RSC-J',	'RSC-K',	'RSC-L',	'RSC-M',    'RSC-O',
                                 'RSC-P',	'RVS-A',	'RVS-B',	'RVS-D',	'RVS-E',	'RVS-G')
        group by  "@timestamp",tid, scenario, errorCode, fuelKindCode,second
        """
    return query


serviceNames = {
    "Cancel Remote Immediate Charge": ["EVC-E", "EVC-F", "EVC-G", "EVC-T"],
    "Climate Start": ["RSC-O", "RSC-L", "RSC-M", "RSC-A", "RSC-B", "RSC-C", "RSC-D"],
    "Climate Stop": ["RSC-H", "RSC-I", "RSC-J", "RSC-K", "RSC-E"],
    "Door Lock": ["RSC-P", "RDO-E", "RDO-F", "RDO-G", "RDO-I"],
    "Door Unlock": ["RDO-A", "RDO-B", "RDO-C", "RDO-D"],
    "Remote Charge": ["EVC-B", "EVC-C", "EVC-D", "EVC-S"],
    "Vehicle Status": ["RVS-A", "RVS-B", "RVS-D", "RVS-E", "RVS-G"],
}

channelNames = {
    "Call Center": ["EVC-G", "RSC-A", "RSC-H", "RDO-F", "RDO-A", "EVC-D", "RVS-A"],
    "CWP": [
        "EVC-E",
        "RSC-M",
        "EVC-B",
        "RVS-E",
        "RSC-D",
        "RSC-K",
        "RDO-I",
        "RDO-D",
        "RVS-D",
    ],
    "IOT": ["EVC-T", "RSC-C", "RSC-J", "RDO-E", "RDO-C", "EVC-S"],
    "ISS": ["RSC-O", "RSC-P"],
    "SPA": [
        "EVC-F",
        "RSC-L",
        "RSC-B",
        "RSC-I",
        "RDO-G",
        "RDO-B",
        "EVC-C",
        "RVS-B",
        "RVS-G",
    ],
    "TMU": ["RSC-E"],
}


if __name__ == "__main__":
    # main()
    # for hour in range(24):
    #     schedule.every().day.at(f"{hour:02}:30").do(main)
    schedule.every().day.at("00:30").do(main)
    schedule.every().day.at("01:30").do(main)
    schedule.every().day.at("02:30").do(main)
    schedule.every().day.at("03:30").do(main)
    schedule.every().day.at("04:30").do(main)
    schedule.every().day.at("05:30").do(main)
    schedule.every().day.at("06:30").do(main)
    schedule.every().day.at("07:30").do(main)
    schedule.every().day.at("08:30").do(main)
    schedule.every().day.at("09:30").do(main)
    schedule.every().day.at("10:30").do(main)
    schedule.every().day.at("11:30").do(main)
    schedule.every().day.at("12:30").do(main)
    schedule.every().day.at("13:30").do(main)
    schedule.every().day.at("14:30").do(main)
    schedule.every().day.at("15:30").do(main)
    schedule.every().day.at("16:30").do(main)
    schedule.every().day.at("17:30").do(main)
    schedule.every().day.at("18:30").do(main)
    schedule.every().day.at("19:30").do(main)
    schedule.every().day.at("20:30").do(main)
    schedule.every().day.at("21:30").do(main)
    schedule.every().day.at("22:30").do(main)
    schedule.every().day.at("23:30").do(main)
    while True:
        schedule.run_pending()
        time.sleep(1)
