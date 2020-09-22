---
id: handling-ipn
title: Handling Instant Payment Notifications
sidebar_label: Handling Instant Payment Notifications
description: Handling Instant Payment Notifications from BTCPay Server using BTCPay IPN node
---

To receive Instant Payment Notifications with the `btcpay-ipn` node, set the url `path` the IPN listener will listen to notifications on.

When BTCPay Server sends a notification to the IPN listener url, it will trigger the node output with the invoice object set to `msg.payload`. _Note_: as the incoming data cannot be trusted, the node fetches the actual invoice data via API before triggering the output.