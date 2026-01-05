// Silent Web - Content Script
function getBlockMode() {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({ action: 'getBlockMode' }, (response) => {
      resolve(response?.mode || 'none');
    });
  });
}

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

document.addEventListener('DOMContentLoaded', removeAds);
window.addEventListener('load', removeAds);
removeAds();

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
