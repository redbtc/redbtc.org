(window.webpackJsonp=window.webpackJsonp||[]).push([[11],{127:function(n,e,t){"use strict";t.r(e),e.default=t.p+"assets/images/ipn-handler-e68e53cee7415dac4e9639a145892ce8.png"},68:function(n,e,t){"use strict";t.r(e),t.d(e,"frontMatter",(function(){return o})),t.d(e,"metadata",(function(){return r})),t.d(e,"rightToc",(function(){return d})),t.d(e,"default",(function(){return l}));var a=t(2),s=t(6),i=(t(0),t(93)),o={id:"ipn-handler",title:"Handling Instant Payment Notifications",sidebar_label:"Handling Instant Payment Notifications (IPN)",hide_table_of_contents:!0},r={unversionedId:"starters/ipn-handler",id:"starters/ipn-handler",isDocsHomePage:!1,title:"Handling Instant Payment Notifications",description:'This flow implements an IPN handler. It checks if the invoice status is either "confirmed" or "complete" and outputs the invoice data to Debug window.',source:"@site/flows/starters/ipn-handler.md",slug:"/starters/ipn-handler",permalink:"/flows/starters/ipn-handler",editUrl:"https://github.com/alexk111/redbtc.org/edit/master/flows/starters/ipn-handler.md",version:"current",lastUpdatedBy:"Alex Kaul",lastUpdatedAt:1599825539,sidebar_label:"Handling Instant Payment Notifications (IPN)",sidebar:"flows",previous:{title:"Creating Invoices",permalink:"/flows/starters/invoice-creator"}},d=[{value:"Node-RED Flow",id:"node-red-flow",children:[]}],c={rightToc:d};function l(n){var e=n.components,o=Object(s.a)(n,["components"]);return Object(i.b)("wrapper",Object(a.a)({},c,o,{components:e,mdxType:"MDXLayout"}),Object(i.b)("p",null,'This flow implements an IPN handler. It checks if the invoice status is either "confirmed" or "complete" and outputs the invoice data to Debug window.'),Object(i.b)("p",null,"As the incoming data cannot be trusted, it first fetches the invoice data via API."),Object(i.b)("p",null,Object(i.b)("img",{alt:"IPN Handler Flow",src:t(127).default})),Object(i.b)("h2",{id:"node-red-flow"},"Node-RED Flow"),Object(i.b)("pre",null,Object(i.b)("code",Object(a.a)({parentName:"pre"},{className:"language-json"}),'[\n  {\n    "id": "736c229c.ab7cac",\n    "type": "http in",\n    "z": "ba32a89d.bb8058",\n    "name": "",\n    "url": "/btcpay-ipn/",\n    "method": "post",\n    "upload": false,\n    "swaggerDoc": "",\n    "x": 1310,\n    "y": 1520,\n    "wires": [["f2be4afb.00d598"]]\n  },\n  {\n    "id": "aab8090f.58f9b8",\n    "type": "http response",\n    "z": "ba32a89d.bb8058",\n    "name": "http response = ok",\n    "statusCode": "",\n    "headers": {},\n    "x": 1830,\n    "y": 1520,\n    "wires": []\n  },\n  {\n    "id": "eaa2a84a.b34c28",\n    "type": "comment",\n    "z": "ba32a89d.bb8058",\n    "name": "IPN handler",\n    "info": "",\n    "x": 1290,\n    "y": 1480,\n    "wires": []\n  },\n  {\n    "id": "f2be4afb.00d598",\n    "type": "change",\n    "z": "ba32a89d.bb8058",\n    "name": "Prepare data for API",\n    "rules": [\n      {\n        "t": "set",\n        "p": "path",\n        "pt": "msg",\n        "to": "\\"/invoices/\\" & payload.id",\n        "tot": "jsonata"\n      },\n      { "t": "delete", "p": "payload", "pt": "msg" }\n    ],\n    "action": "",\n    "property": "",\n    "from": "",\n    "to": "",\n    "reg": false,\n    "x": 1560,\n    "y": 1520,\n    "wires": [["3742ff32.f70bd"]]\n  },\n  {\n    "id": "5cebc59b.a3967c",\n    "type": "debug",\n    "z": "ba32a89d.bb8058",\n    "name": "Invoice Data",\n    "active": true,\n    "tosidebar": true,\n    "console": false,\n    "tostatus": true,\n    "complete": "payload",\n    "targetType": "msg",\n    "statusVal": "payload.status",\n    "statusType": "msg",\n    "x": 2010,\n    "y": 1560,\n    "wires": []\n  },\n  {\n    "id": "3742ff32.f70bd",\n    "type": "btcpay-api",\n    "z": "ba32a89d.bb8058",\n    "method": "GET",\n    "path": "",\n    "client": "9711e4a7.bae348",\n    "name": "Fetch Invoice",\n    "x": 1590,\n    "y": 1560,\n    "wires": [["aab8090f.58f9b8", "ab9df35f.1a20b"]]\n  },\n  {\n    "id": "ab9df35f.1a20b",\n    "type": "switch",\n    "z": "ba32a89d.bb8058",\n    "name": "check status",\n    "property": "payload.status",\n    "propertyType": "msg",\n    "rules": [\n      { "t": "eq", "v": "confirmed", "vt": "str" },\n      { "t": "eq", "v": "complete", "vt": "str" }\n    ],\n    "checkall": "false",\n    "repair": false,\n    "outputs": 2,\n    "x": 1810,\n    "y": 1560,\n    "wires": [["5cebc59b.a3967c"], ["5cebc59b.a3967c"]]\n  },\n  { "id": "9711e4a7.bae348", "type": "btcpay-api-config", "z": "", "name": "" }\n]\n')))}l.isMDXComponent=!0}}]);