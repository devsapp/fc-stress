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
  report_html = evt.get("REPORT_HTML", False)
  host = "{}.{}.fc.aliyuncs.com".format(context.account_id, context.region)
  # get function type
  funcType = evt.get("functionType", "event")
  if funcType == "event":
    srv = evt['serviceName']
    func = evt['functionName']
    qualifier = evt.get("qualifier", "LATEST")
    payload = json.dumps(evt.get("payload", b""))
    creds = context.credentials
    access_key_id, access_key_secret, security_token = creds.access_key_id, creds.access_key_secret, creds.security_token
    if security_token == "undefined":
      security_token = ""
    print(creds.to_dict())
    cmd = "export AK_ID={0} && export AK_SECRET={1} && export AK_TOKEN={2} && \
          export FC_SER={3} && export FC_FUNC={4} && export FC_QUALIFIER={5} && export FC_HTTP_PAYLOAD={6} && \
          locust -f locustfile.py -H http://{7} -u {8} -r {9} -t {10}s --headless --html /tmp/report.html" \
          .format(access_key_id, access_key_secret, security_token, srv, func, qualifier, payload, host,
          num_users, spawn_rate, runtime)
  else: # dsp init 生成的 http trigger 函数必须是匿名可访问的
    url = evt['url']
    if host not in url:
      res = urlparse(url)
      host = res.netloc
    method = evt.get("method", "GET")
    body = json.dumps(evt.get("body", b""))
    cmd = "export FC_URL={0} && export FC_METHOD={1} && export FC_PAYLOAD={2} && \
          locust -f locustfile_http.py -H http://{3} -u {4} -r {5} -t {6}s --headless --html /tmp/report.html" \
          .format(url, method, body, host, num_users, spawn_rate, runtime)

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