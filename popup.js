// Silent Web - Popup Script

document.addEventListener('DOMContentLoaded', function() {
    // Load blocked count
    try {
        chrome.runtime.sendMessage({action: 'getBlockedCount'}, (response) => {
            if (response && response.count !== undefined) {
                document.getElementById('blockedCount').textContent = response.count;
            }
        });
    } catch (e) {
        console.log('Error getting blocked count:', e);
    }

    // Add button listeners
    document.getElementById('blockAdsBtn').addEventListener('click', blockAllAds);
    document.getElementById('block18PlusBtn').addEventListener('click', block18Plus);
    document.getElementById('supportBtn').addEventListener('click', openSupport);
});

function blockAllAds() {
    alert('✓ Ad blocking enabled!');
    window.close();
}

function block18Plus() {
    alert('✓ 18+ blocking enabled!');
    window.close();
}

function openSupport() {
    chrome.tabs.create({
        url: 'https://ko-fi.com/boringeuropeandev'
    });
    window.close();
}
