// Get blocked count from background
document.addEventListener('DOMContentLoaded', function() {
    chrome.runtime.sendMessage({action: 'getBlockedCount'}, (response) => {
        if (response && response.count) {
            document.getElementById('blockedCount').textContent = response.count;
        }
    });
});

// Block All Ads Button
function blockAllAds() {
    console.log('BLOCK ALL ADS clicked');
    alert('Ad blocking enabled for this session!');
    window.close();
}

// Block 18+ Sites Button
function block18Plus() {
    console.log('BLOCK 18+ SITES clicked');
    alert('18+ content blocking enabled!');
    window.close();
}

// Support Button
function openSupport() {
    console.log('SUPPORT clicked');
    chrome.tabs.create({
        url: 'https://ko-fi.com/boringeuropeandev'
    });
    window.close();
}
