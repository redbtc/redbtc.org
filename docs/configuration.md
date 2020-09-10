---
id: configuration
title: Configuration
sidebar_label: Configuration
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
6. Open the client configuration in BTCPay API node on your Node-RED
7. Enter the https URL to your BTCPay Server instance
8. Paste the pairing code
9. Click on `Pair client` - the private key and token fields will be automatically filled with your api credentials
10. Push `Update`
