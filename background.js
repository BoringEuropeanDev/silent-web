// Silent Web - Background Service Worker
console.log('Silent Web - Extension initialized');

let blockedCount = 0;
let blockMode = 'none'; // 'none', 'ads', '18plus', or 'both'

// Listen for messages
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'adBlocked') {
    blockedCount++;
    chrome.action.setBadgeText({ text: blockedCount.toString() });
    chrome.action.setBadgeBackgroundColor({ color: '#ef4444' });
  }
  
  if (request.action === 'getBlockedCount') {
    sendResponse({ count: blockedCount });
  }
  
  if (request.action === 'getBlockMode') {
    sendResponse({ mode: blockMode });
  }
  
  if (request.action === 'setBlockMode') {
    blockMode = request.mode;
    chrome.storage.local.set({ blockMode: blockMode });
    applyBlockingRules();
    sendResponse({ success: true });
  }
  
  if (request.action === 'resetCount') {
    blockedCount = 0;
    chrome.action.setBadgeText({ text: '0' });
    sendResponse({ success: true });
  }
});

// Load saved settings on startup
chrome.storage.local.get(['blockMode'], (result) => {
  if (result.blockMode) {
    blockMode = result.blockMode;
    applyBlockingRules();
  }
});

function applyBlockingRules() {
  if (blockMode === 'none') {
    chrome.declarativeNetRequest.updateEnabledRulesets({ disableRulesetIds: ['ads_rules', 'adult_rules'] });
  } else if (blockMode === 'ads') {
    chrome.declarativeNetRequest.updateEnabledRulesets({ 
      enableRulesetIds: ['ads_rules'],
      disableRulesetIds: ['adult_rules']
    });
  } else if (blockMode === '18plus') {
    chrome.declarativeNetRequest.updateEnabledRulesets({ 
      enableRulesetIds: ['adult_rules'],
      disableRulesetIds: ['ads_rules']
    });
  } else if (blockMode === 'both') {
    chrome.declarativeNetRequest.updateEnabledRulesets({ 
      enableRulesetIds: ['ads_rules', 'adult_rules']
    });
  }
}

console.log('Silent Web - Background worker ready');
