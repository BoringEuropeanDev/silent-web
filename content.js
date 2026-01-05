function getBlockMode() {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({ action: 'getBlockMode' }, (response) => {
      resolve(response?.mode || 'none');
    });
  });
}

const adSelectors = [
  'iframe[id*="google_ads"]',
  'div[id*="google_ads"]',
  'div[id*="gpt-ad"]',
  'div.ad-container',
  'div.ads-container',
  'div[data-ad-region]',
  'div[data-ad-slot]',
  'iframe[src*="doubleclick.net"]',
  'iframe[src*="pagead"]',
];

async function removeAds() {
  const mode = await getBlockMode();
  
  if (mode === 'ads' || mode === 'both') {
    adSelectors.forEach(selector => {
      try {
        document.querySelectorAll(selector).forEach(el => {
          el.style.display = 'none !important';
        });
      } catch (e) {
        // Ignore selector errors
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

observer.observe(document.body, { childList: true, subtree: true });

console.log('Content script loaded');
