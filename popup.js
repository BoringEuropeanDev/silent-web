document.addEventListener('DOMContentLoaded', function() {
  chrome.runtime.sendMessage({ action: 'getBlockedCount' }, (response) => {
    if (response && response.count !== undefined) {
      document.getElementById('blockedCount').textContent = response.count;
    }
  });

  chrome.runtime.sendMessage({ action: 'getBlockMode' }, (response) => {
    if (response && response.mode) {
      updateButtonStates(response.mode);
    }
  });

  document.getElementById('blockAdsBtn').addEventListener('click', blockAllAds);
  document.getElementById('block18PlusBtn').addEventListener('click', block18Plus);
  document.getElementById('supportBtn').addEventListener('click', openSupport);
  document.getElementById('resetBtn').addEventListener('click', resetCount);
});

function blockAllAds() {
  chrome.runtime.sendMessage({
    action: 'setBlockMode',
    mode: 'ads'
  }, (response) => {
    if (response.success) {
      updateButtonStates('ads');
      showNotification('✓ Ad blocking ENABLED!');
    }
  });
}

function block18Plus() {
  chrome.runtime.sendMessage({
    action: 'setBlockMode',
    mode: '18plus'
  }, (response) => {
    if (response.success) {
      updateButtonStates('18plus');
      showNotification('✓ 18+ blocking ENABLED!');
    }
  });
}

function resetCount() {
  chrome.runtime.sendMessage({ action: 'resetCount' }, (response) => {
    if (response.success) {
      document.getElementById('blockedCount').textContent = '0';
      showNotification('✓ Count reset!');
    }
  });
}

function openSupport() {
  chrome.tabs.create({
    url: 'https://ko-fi.com/boringeuropeandev'
  });
}

function updateButtonStates(mode) {
  const adsBtn = document.getElementById('blockAdsBtn');
  const plusBtn = document.getElementById('block18PlusBtn');
  
  if (mode === 'ads') {
    adsBtn.style.opacity = '1';
    adsBtn.style.transform = 'scale(1)';
    plusBtn.style.opacity = '0.6';
    plusBtn.style.transform = 'scale(0.95)';
  } else if (mode === '18plus') {
    plusBtn.style.opacity = '1';
    plusBtn.style.transform = 'scale(1)';
    adsBtn.style.opacity = '0.6';
    adsBtn.style.transform = 'scale(0.95)';
  } else {
    adsBtn.style.opacity = '0.6';
    adsBtn.style.transform = 'scale(0.95)';
    plusBtn.style.opacity = '0.6';
    plusBtn.style.transform = 'scale(0.95)';
  }
}

function showNotification(message) {
  const notification = document.createElement('div');
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 10px;
    left: 50%;
    transform: translateX(-50%);
    background: #22c55e;
    color: white;
    padding: 10px 20px;
    border-radius: 6px;
    font-size: 12px;
    z-index: 9999;
  `;
  document.body.appendChild(notification);
  setTimeout(() => notification.remove(), 2000);
}
