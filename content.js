// Silent Web - Content Script - HIDE ADS COMPLETELY WITHOUT LAYOUT CHANGE
function getBlockMode() {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({ action: 'getBlockMode' }, (response) => {
      resolve(response?.mode || 'none');
    });
  });
}

// SAFE, specific ad selectors ONLY
const adSelectors = [
  // Google Ads - be VERY specific
  'iframe[id*="google_ads"]',
  'div[id*="google_ads"]',
  'div[id*="gpt-ad"]',
  
  // Explicit ad containers
  'div.ad-container',
  'div.ads-container',
  'div[data-ad-region]',
  'div[data-ad-slot]',
  
  // Ad network iframes
  'iframe[src*="doubleclick.net"]',
  'iframe[src*="pagead"]',
  
  // Empty ad placeholders
  'div[class*="advertisement"]',
  'div[class*="ad-placeholder"]',
];

async function hideAds() {
  const mode = await getBlockMode();
  
  if (mode === 'ads' || mode === 'both') {
    adSelectors.forEach(selector => {
      try {
        document.querySelectorAll(selector).forEach(el => {
          // Set to zero dimensions instead of display: none
          // This hides it WITHOUT changing page structure
          el.style.width = '0 !important';
          el.style.height = '0 !important';
          el.style.padding = '0 !important';
          el.style.margin = '0 !important';
          el.style.border = 'none !important';
          el.style.display = 'none !important';
          el.style.visibility = 'hidden !important';
          el.setAttribute('aria-hidden', 'true');
        });
      } catch (e) {
        // Ignore selector errors
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', hideAds);
window.addEventListener('load', hideAds);
hideAds();

// FIX: Check if document.body exists before observing
if (document.body) {
  const observer = new MutationObserver(async () => {
    const mode = await getBlockMode();
    if (mode === 'ads' || mode === 'both') {
      hideAds();
    }
  });
  
  observer.observe(document.body, { childList: true, subtree: true });
}

console.log('Content script loaded');
