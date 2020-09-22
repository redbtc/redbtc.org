---
id: configuration
title: Configuration
sidebar_label: Configuration
description: Creating a BTCPay store and pairing a BTCPay client in Node-RED with it
---

You first need to create a new BTCPay store:

1. Log in to your BTCPay Server instance
2. Go to Stores menu
3. Click on `Create a new store`
4. Enter a name
5. Push `Create`

Now you need to pair the BTCPay client in Node-RED with the BTCPay store:

1. Navigate to `Stores > Settings > Access Tokens` on your BTCPay Server
2. Create a new token
3. Leave PublicKey blank
4. Request pairing
5. Copy pairing code
6. Open your Node-RED instance
7. Drag & drop the `btcpay api` node from the palette to the workspace and double-click on it, to open the node editor
8. In the `Client` dropdown menu pick the `Add New btcpay-api-config` option and press the pencil button at the right to add a new API configuration
9. Enter the https URL to your BTCPay Server instance
10. Paste the pairing code you copied on step 5
11. Click the `Pair client` button - the private key and token fields will be automatically filled with your api credentials
12. Push `Update`
