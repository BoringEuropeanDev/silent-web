'use strict';

let blockedCount = 0;
let blockAllAdsEnabled = true;
let blockNsfwEnabled = false;

// Initialize on first load
document.addEventListener('DOMContentLoaded', initializePopup);

function initializePopup() {
    loadSettings();
    setupEventListeners();
    updateUI();
}

// Load settings from Chrome storage
function loadSettings() {
    chrome.storage.local.get(
        ['blockedCount', 'blockAllAds', 'blockNsfw'],
        (result) => {
            blockedCount = result.blockedCount || 0;
            blockAllAdsEnabled = result.blockAllAds !== false;
            blockNsfwEnabled = result.blockNsfw || false;

            updateBlockCount();
        }
    );
}

// Setup event listeners with error handling
function setupEventListeners() {
    const blockAllBtn = document.getElementById('blockAllBtn');
    const blockNsfwBtn = document.getElementById('blockNsfwBtn');
    const donateBtn = document.getElementById('donateBtn');

    if (blockAllBtn) {
        blockAllBtn.addEventListener('click', handleBlockAllClick);
        blockAllBtn.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                handleBlockAllClick();
            }
        });
    }

    if (blockNsfwBtn) {
        blockNsfwBtn.addEventListener('click', handleBlockNsfwClick);
        blockNsfwBtn.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                handleBlockNsfwClick();
            }
        });
    }

    if (donateBtn) {
        donateBtn.addEventListener('click', handleDonateClick);
        donateBtn.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                handleDonateClick();
            }
        });
    }
}

// Handle Block All Ads button
function handleBlockAllClick() {
    blockAllAdsEnabled = true;
    blockNsfwEnabled = false;

    chrome.storage.local.set({
        blockAllAds: true,
        blockNsfw: false
    }, () => {
        showFeedback('✓ All ads blocking enabled!');
        reloadAllTabs();
    });
}

// Handle Block 18+ Sites button
function handleBlockNsfwClick() {
    blockAllAdsEnabled = false;
    blockNsfwEnabled = true;

    chrome.storage.local.set({
        blockAllAds: false,
        blockNsfw: true
    }, () => {
        showFeedback('✓ 18+ blocking enabled!');
        reloadAllTabs();
    });
}

// Handle Donate button
function handleDonateClick() {
    chrome.tabs.create({
        url: 'https://ko-fi.com/boringeuropeandev',
        active: true
    }).catch((error) => {
        console.error('Error opening donation link:', error);
        alert('Unable to open donation link. Please visit: https://ko-fi.com/boringeuropeandev');
    });
}

// Reload all tabs to apply new settings
function reloadAllTabs() {
    chrome.tabs.query({}, (tabs) => {
        tabs.forEach((tab) => {
            if (tab.url && !tab.url.startsWith('chrome://')) {
                chrome.tabs.reload(tab.id).catch((error) => {
                    console.error(`Error reloading tab ${tab.id}:`, error);
                });
            }
        });
    });
}

// Show visual feedback
function showFeedback(message) {
    const statusEl = document.getElementById('status');
    if (!statusEl) return;

    const originalText = statusEl.textContent;
    const originalClass = statusEl.className;

    statusEl.textContent = message;
    statusEl.className = 'status-active';

    setTimeout(() => {
        statusEl.textContent = originalText;
        statusEl.className = originalClass;
    }, 2000);
}

// Update blocked count display
function updateBlockCount() {
    const countElement = document.getElementById('blockedCount');
    if (countElement) {
        countElement.textContent = blockedCount.toString();
    }
}

// Listen for blocked count updates from content script
chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === 'local' && changes.blockedCount) {
        blockedCount = changes.blockedCount.newValue || 0;
        updateBlockCount();
    }
});

// Update UI based on settings
function updateUI() {
    const blockAllBtn = document.getElementById('blockAllBtn');
    const blockNsfwBtn = document.getElementById('blockNsfwBtn');

    if (blockAllBtn && blockNsfwBtn) {
        if (blockAllAdsEnabled) {
            blockAllBtn.style.opacity = '1';
            blockAllBtn.style.fontWeight = '700';
            blockNsfwBtn.style.opacity = '0.6';
        } else if (blockNsfwEnabled) {
            blockNsfwBtn.style.opacity = '1';
            blockNsfwBtn.style.fontWeight = '700';
            blockAllBtn.style.opacity = '0.6';
        }
    }
}
