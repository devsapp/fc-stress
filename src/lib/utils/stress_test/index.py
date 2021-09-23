# -*- coding: utf-8 -*-
import logging
import time, json
import os
from bs4 import BeautifulSoup
from urllib.parse import urlparse

def handler(event, context):
  os.system("rm -rf /tmp/report.html")
  evt = json.loads(event)
  num_users = evt["NUM_USERS"]
  spawn_rate = evt["SPAWN_RATE"]
  runtime = evt["RUN_TIME"]
  custom_host = evt.get("CUSTOM_HOST", None)
  report_html = evt.get("REPORT_HTML", False)
  host = "{}.{}.fc.aliyuncs.com".format(context.account_id, context.region)

  host_for_request = host if custom_host is None else custom_host
  # get function type
  function_type = evt.get("functionType", "event")
  invocation_type = evt.get("INVOCATION_TYPE", "Sync")

  if function_type == "event":
    srv = evt['serviceName']
    func = evt['functionName']
    qualifier = evt.get("qualifier", "LATEST")
    payload = json.dumps(evt.get("payload", b""))
    creds = context.credentials
    access_key_id, access_key_secret, security_token, account_id = creds.access_key_id, creds.access_key_secret, creds.security_token, context.account_id
    if security_token == "undefined":
      security_token = ""
    print(creds.to_dict())
    cmd = "export AK_ID={0} && export AK_SECRET={1} && export AK_TOKEN={2} && export TZ=Asia/Shanghai &&\
            export FC_SER={3} && export FC_FUNC={4} && export FC_QUALIFIER={5} && export FC_HTTP_PAYLOAD={6} && \
           export ACCOUNT_ID={7} && export INVOCATION_TYPE={8} && \
           locust -f locustfile.py -H http://{9} -u {10} -r {11} -t {12}s --headless --html /tmp/report.html" \
          .format(access_key_id, access_key_secret, security_token, srv, func, qualifier, payload, account_id, invocation_type, host_for_request, num_users, spawn_rate, runtime)
  else: # dsp init 生成的 http trigger 函数必须是匿名可访问的
    url = evt['url']
    if host_for_request not in url:
      res = urlparse(url)
      host_for_request = res.netloc
    method = evt.get("method", "GET")
    body = json.dumps(evt.get("body", b""))
    cmd = "export FC_URL={0} && export FC_METHOD={1} && export FC_PAYLOAD={2} && export TZ=Asia/Shanghai &&\
          locust -f locustfile_http.py -H http://{3} -u {4} -r {5} -t {6}s --headless --html /tmp/report.html" \
          .format(url, method, body, host_for_request, num_users, spawn_rate, runtime)

  os.system(cmd)
  return getStatistics(report_html)

def getStatistics(report):
  # html sample: https://img.alicdn.com/imgextra/i1/O1CN01WxCQfk1N7Zs5UfU2o_!!6000000001523-2-tps-2122-926.png
  html_data = open('/tmp/report.html', 'r').read()

  index = 0
  rKeys = []
  rVals = []

  replaceLi= [(" (ms)", ""), ("Average size (bytes)", "AverageSize"), ("50%ile", "p50"), ("60%ile", "p60"), ("70%ile", "p70"),
  ("80%ile", "p90"), ("90%ile", "p90"), ("95%ile", "p95"), ("99%ile", "p99"), ("100%ile", "p100"), ("# Fails", "Fails"), ("# Requests", "Requests")]

  for row in BeautifulSoup(html_data)("tr"):
    if index == 2 or index == 5: # ignore row Aggregated
      index = index + 1
      continue
    if row("th"):
      for cell in row("th"):
        key = cell.text
        for item in replaceLi:
          key = key.replace(item[0], item[1])
        rKeys.append(key)
    if row("td"):
      for cell in row("td"):
        try:
          rVals.append(float(cell.text))
        except:
          rVals.append(cell.text)
    index = index + 1

  # print(rKeys)
  # print(rVals)

  statistics = {}

  for i in range(len(rKeys)):
    if rKeys[i] == "AverageSize" or rKeys[i] == "p100":
      continue
    statistics[rKeys[i]] = rVals[i]

  if report:
    statistics["report_html"] = html_data

  return statistics
