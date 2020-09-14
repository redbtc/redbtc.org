(window.webpackJsonp=window.webpackJsonp||[]).push([[18],{75:function(e,t,n){"use strict";n.r(t),n.d(t,"frontMatter",(function(){return r})),n.d(t,"metadata",(function(){return l})),n.d(t,"rightToc",(function(){return c})),n.d(t,"default",(function(){return s}));var i=n(2),a=n(6),o=(n(0),n(93)),r={id:"configuration",title:"Configuration",sidebar_label:"Configuration",description:"Creating a BTCPay store and pairing a BTCPay client in Node-RED with it"},l={unversionedId:"configuration",id:"configuration",isDocsHomePage:!1,title:"Configuration",description:"Creating a BTCPay store and pairing a BTCPay client in Node-RED with it",source:"@site/docs/configuration.md",slug:"/configuration",permalink:"/docs/configuration",editUrl:"https://github.com/alexk111/redbtc.org/edit/master/docs/configuration.md",version:"current",sidebar_label:"Configuration",sidebar:"docs",previous:{title:"Installation",permalink:"/docs/"},next:{title:"Making Requests",permalink:"/docs/making-requests"}},c=[],b={rightToc:c};function s(e){var t=e.components,n=Object(a.a)(e,["components"]);return Object(o.b)("wrapper",Object(i.a)({},b,n,{components:t,mdxType:"MDXLayout"}),Object(o.b)("p",null,"You first need to create a new BTCPay store:"),Object(o.b)("ol",null,Object(o.b)("li",{parentName:"ol"},"Log in to your BTCPay Server instance"),Object(o.b)("li",{parentName:"ol"},"Go to Stores menu"),Object(o.b)("li",{parentName:"ol"},"Click on ",Object(o.b)("inlineCode",{parentName:"li"},"Create a new store")),Object(o.b)("li",{parentName:"ol"},"Enter a name"),Object(o.b)("li",{parentName:"ol"},"Push ",Object(o.b)("inlineCode",{parentName:"li"},"Create"))),Object(o.b)("p",null,"Now you need to pair the BTCPay client in Node-RED with the BTCPay store:"),Object(o.b)("ol",null,Object(o.b)("li",{parentName:"ol"},"Navigate to ",Object(o.b)("inlineCode",{parentName:"li"},"Stores > Settings > Access Tokens")," on your BTCPay Server"),Object(o.b)("li",{parentName:"ol"},"Create a new token"),Object(o.b)("li",{parentName:"ol"},"Leave PublicKey blank"),Object(o.b)("li",{parentName:"ol"},"Request pairing"),Object(o.b)("li",{parentName:"ol"},"Copy pairing code"),Object(o.b)("li",{parentName:"ol"},"Open the client configuration in BTCPay API node on your Node-RED"),Object(o.b)("li",{parentName:"ol"},"Enter the https URL to your BTCPay Server instance"),Object(o.b)("li",{parentName:"ol"},"Paste the pairing code"),Object(o.b)("li",{parentName:"ol"},"Click on ",Object(o.b)("inlineCode",{parentName:"li"},"Pair client")," - the private key and token fields will be automatically filled with your api credentials"),Object(o.b)("li",{parentName:"ol"},"Push ",Object(o.b)("inlineCode",{parentName:"li"},"Update"))))}s.isMDXComponent=!0}}]);