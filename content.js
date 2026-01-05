// Silent Web - Content Script
// Handles ad removal and page cleanup

function getBlockMode() {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({ action: 'getBlockMode' }, (response) => {
      resolve(response?.mode || 'none');
    });
  });
}

// Ad selectors to hide (for display:none blocking)
const adSelectors = [
  '[class*="ad"]',
  '[id*="ad"]',
  '[class*="banner"]',
  '[id*="banner"]',
  '[class*="advertisement"]',
  '[id*="advertisement"]',
  '.advert',
  '#advert',
  '.ads-container',
  '.ad-container',
  'aside[class*="ad"]',
  'div[data-ad-region]',
  'div[data-google-query-id]',
  'iframe[id*="google_ads"]',
  'iframe[title*="Advertisement"]',
  '.google-auto-placed',
  '[id^="google_ads_"]',
  '.advertisement-wrapper',
  '.ad-slot',
  '.ad-space',
  '[class*="sponsor"]'
];

async function removeAds() {
  const mode = await getBlockMode();
  
  if (mode === 'ads' || mode === 'both') {
    // Hide ad elements
    adSelectors.forEach(selector => {
      try {
        document.querySelectorAll(selector).forEach(el => {
          el.style.display = 'none';
          el.style.visibility = 'hidden';
        });
      } catch (e) {
        // Selector error, skip
      }
    });
  }
}

// Run on page load
document.addEventListener('DOMContentLoaded', removeAds);
window.addEventListener('load', removeAds);

// Also run immediately for dynamic pages
removeAds();

// Handle dynamically added ads (MutationObserver)
const observer = new MutationObserver(async () => {
  const mode = await getBlockMode();
  if (mode === 'ads' || mode === 'both') {
    removeAds();
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
  attributes: false
});

console.log('Silent Web - Content script loaded');
