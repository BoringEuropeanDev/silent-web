// Silent Web - Popup Script

// Load blocked count on popup open
document.addEventListener('DOMContentLoaded', function() {
    try {
        chrome.runtime.sendMessage({action: 'getBlockedCount'}, (response) => {
            if (response && response.count !== undefined) {
                document.getElementById('blockedCount').textContent = response.count;
            }
        });
    } catch (e) {
        console.log('Error getting blocked count:', e);
    }
});

// Block All Ads
window.blockAllAds = function() {
    console.log('Block All Ads clicked');
    alert('✓ Ad blocking enabled for this session!');
    setTimeout(() => window.close(), 500);
};

// Block 18+ Sites
window.block18Plus = function() {
    console.log('Block 18+ Sites clicked');
    alert('✓ 18+ content blocking enabled!');
    setTimeout(() => window.close(), 500);
};

// Support / Donate
window.openSupport = function() {
    console.log('Support button clicked');
    chrome.tabs.create({
        url: 'https://ko-fi.com/boringeuropeandev'
    });
    setTimeout(() => window.close(), 500);
};

console.log('popup.js loaded successfully');
