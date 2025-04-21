// ==UserScript==
// @name         JI Course Select Auto Consent
// @match        https://coursesel.umji.sjtu.edu.cn/welcome.action
// @grant        none
// ==/UserScript==


(function () {
  'use strict';

  // Define the sequence of selectors to click
  const selectorsToClick = [
    '.elect-turn-name',
    '.elect-turn-detail-item-bottom-checkbox',
    '.elect-turn-detail-right-button'
  ];

  let currentIndex = 0; // Keep track of which element we are waiting for/clicking next
  let observer = null; // Variable to hold the MutationObserver instance

  // Function to attempt to click the element at the current index
  function attemptClickCurrentElement() {
    // Check if there are more elements in the sequence
    if (currentIndex < selectorsToClick.length) {
      const selector = selectorsToClick[currentIndex];
      const element = document.querySelector(selector);

      if (element) {
        console.log(`Element found: "${selector}". Attempting to click...`);
        try {
          element.click();
          console.log(`Element clicked: "${selector}".`);

          // Move to the next element in the sequence
          currentIndex++;

          // If we've clicked all elements, disconnect the observer
          if (currentIndex === selectorsToClick.length) {
            console.log('All elements in sequence clicked. Disconnecting observer.');
            if (observer) {
              observer.disconnect();
              observer = null; // Clear the reference
            }
          } else {
            // Log which element we are now waiting for
            console.log(`Successfully clicked "${selector}". Now waiting for element: "${selectorsToClick[currentIndex]}"`);
          }

          // Important: After clicking one element, the next one might appear immediately
          // without a separate mutation event. Or, the click might trigger async updates.
          // We should try to click the *next* element shortly after the current one succeeds.
          // Using a small timeout ensures the DOM has a moment to update.
          setTimeout(attemptClickCurrentElement, 100); // You might adjust this delay (milliseconds)
          // if needed for stability on the target site.

        } catch (error) {
          console.error(`Error clicking element "${selector}":`, error);
          // Decide how to handle errors - maybe stop, maybe log and continue
          // For now, we'll log and the observer will keep checking.
        }
      } else {
        // Element not yet found, the observer will continue watching for DOM changes
        // that might add this element.
        // console.log(`Element not yet found: "${selector}". Waiting...`); // Avoid spamming console
      }
    } else {
      // This case should ideally not be reached if the observer is disconnected correctly,
      // but as a fallback, if the sequence is complete, disconnect the observer.
      if (observer) {
        console.log('Sequence complete. Disconnecting observer (fallback).');
        observer.disconnect();
        observer = null;
      }
    }
  }

  // MutationObserver callback function
  const observerCallback = function (mutations, obs) {
    // We don't necessarily need to inspect the mutations themselves.
    // Any change to the DOM could potentially add the element we're waiting for.
    // So, on any mutation, we just re-attempt to click the current element in the sequence.
    attemptClickCurrentElement();
  };

  // Function to start the process
  function startSequence() {
    console.log('Starting element click sequence...');

    // Immediately attempt to click the first element. It might be present already.
    attemptClickCurrentElement();

    // If we haven't finished (meaning the first element wasn't immediately found,
    // or subsequent elements weren't instantly available after the first click),
    // start observing for changes.
    if (currentIndex < selectorsToClick.length) {
      console.log(`Sequence not complete yet. Starting MutationObserver to wait for "${selectorsToClick[currentIndex]}"...`);
      observer = new MutationObserver(observerCallback);

      // Configure the observer to watch for additions/removals of nodes
      // anywhere in the document (subtree: true)
      observer.observe(document.documentElement, {
        childList: true, // Watch for direct children being added or removed
        subtree: true    // Watch all descendants of the target node
        // You might also need attributes: true if a class/id is added dynamically
        // but childList/subtree usually covers element appearance.
      });
    } else {
      console.log('All elements found and clicked on initial check.');
    }
  }

  // Wait for the DOM to be fully loaded (or interactive) before starting the process
  // This ensures the initial page structure is ready before we start looking or observing.
  if (document.readyState === "complete" || document.readyState === "interactive") {
    startSequence();
  } else {
    document.addEventListener("DOMContentLoaded", startSequence);
  }

})();
