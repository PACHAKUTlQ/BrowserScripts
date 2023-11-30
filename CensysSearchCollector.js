// ==UserScript==
// @name         IP and Host Collector
// @namespace    Pachakutiq
// @version      1
// @description  Collect all IPs and Hosts from Censys search result pages and copy them to clipboard
// @match        https://search.censys.io/*
// @grant        GM_setClipboard
// ==/UserScript==
 (function() {
    'use strict';
     function collectIPs() {
        let strongTags = document.getElementsByTagName("strong");
        let ips = "";
        for(let i=0; i<strongTags.length; i++) {
            let text = strongTags[i].innerText;
            if(text.match(/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/)) {
                ips += text + "\n";
            }
        }
        if(ips.length > 0) {
            GM_setClipboard(ips.substring(0, ips.length-2));
            alert("IPs and Hosts copied to clipboard:\n" + ips.substring(0, ips.length-2));
        } else {
            alert("No IPs or Hosts found on this page");
        }
    }
     let button = document.createElement("button");
    button.innerHTML = "Collect IPs and Hosts";
    button.style.position = "fixed";
    button.style.bottom = "10px";
    button.style.right = "10px";
    button.style.zIndex = "9999";
    button.onclick = collectIPs;
     document.body.appendChild(button);
})();
