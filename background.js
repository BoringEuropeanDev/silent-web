// Silent Web - Background Service Worker
console.log('Silent Web - Extension installed and initialized');

// Track blocked ads count
let blockedCount = 0;

// Listen for messages from content.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'adBlocked') {
    blockedCount++;
    
    // Update badge with blocked count
    chrome.action.setBadgeText({ text: blockedCount.toString() });
    chrome.action.setBadgeBackgroundColor({ color: '#f59e0b' });
  }
  
  if (request.action === 'getBlockedCount') {
    sendResponse({ count: blockedCount });
  }
});

console.log('Silent Web - Background worker ready');
