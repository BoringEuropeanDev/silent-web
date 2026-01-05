'use strict';

// Initialize extension settings on install
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({
        blockAllAds: true,
        blockNsfw: false,
        blockedCount: 0,
        installDate: new Date().toISOString(),
        version: '1.0.0'
    });
    
    console.log('Silent Web - Extension installed and initialized');
});

// Clear blocked count daily
chrome.alarms.create('resetDailyCount', { periodInMinutes: 1440 });

chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'resetDailyCount') {
        chrome.storage.local.set({ blockedCount: 0 });
        console.log('Silent Web - Daily ad count reset');
    }
});

// Handle tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'loading') {
        // Apply rules automatically for loading tabs
    }
});

// Handle errors gracefully
chrome.runtime.onError = (error) => {
    console.error('Silent Web - Runtime error:', error);
};

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'blockAd') {
        chrome.storage.local.get(['blockedCount'], (result) => {
            const newCount = (result.blockedCount || 0) + 1;
            chrome.storage.local.set({ blockedCount: newCount });
            sendResponse({ success: true, count: newCount });
        });
        return true; // Keep channel open for async response
    }
});

console.log('Silent Web - Background service worker loaded');
