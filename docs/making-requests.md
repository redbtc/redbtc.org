---
id: making-requests
title: Making Requests
sidebar_label: Making Requests
description: Making BTCPay API requests using BTCPay API node
---

To make requests using the `btcpay-api` node, set the `http method` and the url `path` to the API endpoint the node will call. These can be either specified in the node settings, or provided in `msg.method` (if the method is "via msg.method") and in `msg.path` (if the path is empty). The request body is the data in `msg.payload`.

After executing a request the node returns a message with the response data set to `msg.payload`.
