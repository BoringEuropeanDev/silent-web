// Silent Web - Background Service Worker
console.log('Silent Web - Extension installed and initialized');

// Track blocked ads count
let blockedCount = 0;

// Listen for messages from content.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'adBlocked') {
    blockedCount++;
    console.log(`Ad blocked! Total: ${blockedCount}`);
    
    // Update badge with blocked count
    chrome.action.setBadgeText({ text: blockedCount.toString() });
    chrome.action.setBadgeBackgroundColor({ color: '#f59e0b' });
  }
  
  if (request.action === 'getBlockedCount') {
    sendResponse({ count: blockedCount });
  }
});

// Listen for alarm to reset daily count
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'resetDailyCount') {
    blockedCount = 0;
    chrome.action.setBadgeText({ text: '' });
    console.log('Silent Web - Daily ad count reset');
  }
});

// Create alarm to reset daily (at midnight)
try {
  chrome.alarms.create('resetDailyCount', { periodInMinutes: 1440 });
} catch (e) {
  console.log('Alarms not available in this context');
}
