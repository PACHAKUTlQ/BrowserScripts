// ==UserScript==
// @name         Hide Email Addresses
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Replace email addresses with "email@protected.com"
// @author       Pachakutiq
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Regular expression to match email addresses
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b/g;

    // Function to replace email addresses with "email@protected.com"
    function maskEmail(email) {
        return email.replace(emailRegex, 'email@protected.com');
    }

    // Function to traverse and mask email addresses in text nodes
    function traverseAndMaskEmails(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            node.textContent = maskEmail(node.textContent);
        } else {
            node.childNodes.forEach(traverseAndMaskEmails);
        }
    }

    // Function to observe mutations and mask email addresses
    function observeEmailMutations() {
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    traverseAndMaskEmails(node);
                });
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Mask existing email addresses in the document
    traverseAndMaskEmails(document.body);

    // Observe and mask future mutations
    observeEmailMutations();

})();
