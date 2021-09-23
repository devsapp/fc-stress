# -*- coding: utf-8 -*-
import logging
import time, json
import email
from locust import HttpUser, task, between
from locust.contrib.fasthttp import FastHttpUser
from auth import Auth
from itertools import chain
import os

api_version = "2016-08-15"
access_key_id=os.environ.get("AK_ID")
access_key_secret=os.environ.get("AK_SECRET")
security_token=os.environ.get("AK_TOKEN")

serviceName = os.environ.get("FC_SER", "")
functionName = os.environ.get("FC_FUNC", "")
qualifier = os.environ.get("FC_QUALIFIER", "")
httpPayLoad = os.environ.get("FC_HTTP_PAYLOAD", b"")
account_id = os.environ.get("ACCOUNT_ID", "")

def build_common_headers(host, method, path, customHeaders={}, unescaped_queries=None):
    auth = Auth(access_key_id, access_key_secret, security_token)
    if host.startswith('http://'):
      host = host[7:].strip()
    elif host.startswith('https://'):
      host = host[8:].strip()
    else:
      host = host.strip()

    headers = {
        'host': host,
        'date': email.utils.formatdate(usegmt=True),
        'content-type': 'application/json',
        'content-length': '0',
        'user-agent': "aliyun-fc-sdk-locust",
        'x-fc-account-id': account_id
    }

    if auth.security_token != '':
        headers['x-fc-security-token'] = auth.security_token

    if customHeaders:
        headers.update(customHeaders)

    # Sign the request and set the signature to headers.
    headers['authorization'] = auth.sign_request(
        method, path, headers, unescaped_queries)

    return headers

class QuickstartEventUser(HttpUser):
    # wait_time = between(1, 2.5)
    @task
    def hello_world(self):
      global serviceName, functionName, qualifier, httpPayLoad
      method = 'POST'
      service = serviceName
      if qualifier:
        service += '.{0}'.format(qualifier)
      path = '/{0}/services/{1}/functions/{2}/invocations'.format(
          api_version, service, functionName)
      headers = build_common_headers(self.host, method, path, {})
      r = self.client.post(path, headers=headers, data=httpPayLoad)
      if r.headers.get('x-fc-error-type', ''):
        print("failed, headers = {}, content = {}".format(r.headers, r.content))
      # else:
      #   print("succ, resp = {}".format(r.content))

    def on_start(self):
      global serviceName, functionName, qualifier, httpPayLoad
      print("{} {} {} {} {} load test started...".format(self.host, serviceName, functionName, qualifier, httpPayLoad))

    def on_stop(self):
      global serviceName, functionName, qualifier, httpPayLoad
      print("{} {} {} {} {} load test stoped!".format(self.host, serviceName, functionName, qualifier, httpPayLoad))
