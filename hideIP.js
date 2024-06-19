// ==UserScript==
// @name         Hide IPv4
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Hide three parts of IPv4 addresses with "*"
// @author       Pachakutiq
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Regular expression to match IPv4 addresses
    const ipv4Regex = /\b(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})\b/g;

    // Function to replace middle two octets of IPv4 addresses with "*"
    function maskIPv4(ipv4) {
        return ipv4.replace(ipv4Regex, (match, p1, p2, p3, p4) => {
            return `${p1}.**.**.**`;
        });
    }

    // Function to traverse and mask IPv4 in text nodes
    function traverseAndMask(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            node.textContent = maskIPv4(node.textContent);
        } else {
            node.childNodes.forEach(traverseAndMask);
        }
    }

    // Function to observe mutations and mask IPv4 addresses
    function observeMutations() {
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    traverseAndMask(node);
                });
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Mask existing IPv4 addresses in the document
    traverseAndMask(document.body);

    // Observe and mask future mutations
    observeMutations();

})();
