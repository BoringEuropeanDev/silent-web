// Silent Web - Content Script - FIXED VERSION
// Only removes actual ads, doesn't break page structure

function getBlockMode() {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({ action: 'getBlockMode' }, (response) => {
      resolve(response?.mode || 'none');
    });
  });
}

// IMPROVED selectors - much more specific to avoid breaking page layout
const adSelectors = [
  // Google Ads specific
  'iframe[id*="google_ads"]',
  'iframe[title*="Advertisement"]',
  'div[id*="google_ads"]',
  '[data-google-query-id]',
  '.google-auto-placed',
  
  // General ad container patterns (very specific)
  'div.ad-container',
  'div.ads-container',
  'div.advertisement-wrapper',
  'div.ad-slot',
  'div.ad-space',
  'div[data-ad-region]',
  'div[data-ad-slot]',
  'div[data-ad-unit]',
  'aside.ad',
  'aside[class*="ad-"]',
  
  // Ad network iframes
  'iframe[src*="doubleclick"]',
  'iframe[src*="google"]',
  'iframe[src*="amazon-adsystem"]',
  'iframe[src*="facebook"]',
  'iframe[src*="advertising"]',
  
  // Sponsored content
  '[class*="sponsored"]',
  '[data-sponsored]',
  '.promoted-post',
  '.promoted-content',
  
  // Very specific brand patterns
  '[class*="banner-ad"]',
  '[id*="banner-ad"]',
  '[class*="popup-ad"]',
  '[id*="popup-ad"]'
];

async function removeAds() {
  const mode = await getBlockMode();
  
  if (mode === 'ads' || mode === 'both') {
    let removedCount = 0;
    
    adSelectors.forEach(selector => {
      try {
        document.querySelectorAll(selector).forEach(el => {
          // Safety check: make sure we're not removing structural elements
          const tag = el.tagName.toLowerCase();
          const classList = Array.from(el.classList);
          const id = el.id;
          
          // Don't remove main structural elements
          if (['main', 'article', 'nav', 'header', 'footer', 'body', 'html'].includes(tag)) {
            return; // Skip this element
          }
          
          // Additional safety: if it's a common utility class, skip
          if (classList.some(c => ['container', 'wrapper', 'content', 'section', 'row', 'col'].includes(c))) {
            return; // Skip
          }
          
          // Only hide, don't remove (safer)
          el.style.display = 'none !important';
          el.style.visibility = 'hidden !important';
          removedCount++;
        });
      } catch (e) {
        // Selector error or permission issue, skip
        console.debug('Content selector error:', selector, e.message);
      }
    });
    
    if (removedCount > 0) {
      chrome.runtime.sendMessage({ action: 'adBlocked' }).catch(() => {
        // Extension may not be available, ignore
      });
    }
  }
}

// Run on page load - with proper timing
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', removeAds);
} else {
  removeAds();
}

// Also run on full load
window.addEventListener('load', removeAds);

// Handle dynamically added ads (optimized MutationObserver)
const observer = new MutationObserver(async () => {
  const mode = await getBlockMode();
  if (mode === 'ads' || mode === 'both') {
    // Only check for iframes and actual ad containers
    document.querySelectorAll('iframe[id*="google_ads"], div[data-ad-region], div.ad-container').forEach(el => {
      if (el.style.display !== 'none') {
        el.style.display = 'none !important';
      }
    });
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
  attributes: false
});

console.log('Silent Web - Content script loaded (SAFE MODE)');
