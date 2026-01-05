'use strict';

// Comprehensive list of ad-related selectors
const AD_SELECTORS = [
    // Google Ads
    'ins[class*="adsbygoogle"]',
    '[data-ad-slot]',
    '[data-ad-region]',
    '[data-ad-container]',
    
    // Common ad patterns
    '[class*="advertisement"]',
    '[class*="ad-banner"]',
    '[class*="ad-box"]',
    '[class*="ad-container"]',
    '[class*="ad-header"]',
    '[class*="ad-wrapper"]',
    '[class*="advert"]',
    '[class*="ads"]',
    '[class*="ad-space"]',
    '[class*="ad-slot"]',
    '[class*="sponsored"]',
    '[class*="promoted-content"]',
    '[class*="native-ad"]',
    '[class*="native_ad"]',
    '[class*="paid-content"]',
    
    // ID-based patterns
    '[id*="advertisement"]',
    '[id*="ad-"]',
    '[id*="ads"]',
    '[id*="advert"]',
    '[id*="banner"]',
    
    // Iframe ads
    'iframe[src*="ads"]',
    'iframe[src*="googleads"]',
    'iframe[src*="doubleclick"]',
    'iframe[src*="facebook.com"]',
    'iframe[src*="criteo"]',
    
    // Banner patterns
    '[class*="banner"]',
    '[class*="billboard"]',
    '[class*="sidebar-ad"]',
    '[class*="sticky-ad"]',
    '[class*="floating-ad"]',
    '[class*="interstitial"]',
    '[class*="modal-ad"]',
    '[class*="popup-ad"]',
    '[class*="text-ad"]',
    '[class*="image-ad"]',
    '[class*="video-ad"]',
    
    // Media-based
    'img[src*="ads"]',
    'img[src*="advert"]',
    'script[src*="ads"]',
    'script[src*="googleads"]',
    'script[src*="facebook"]',
    
    // Semantic patterns
    'div[role="complementary"]',
    '[data-ad-type]',
    '[data-advert]',
    
    // Publisher networks
    '[class*="mpu"]', // Medium rectangle
    '[class*="leaderboard"]',
    '[class*="skyscraper"]',
    '[class*="wide-skyscraper"]',
    '[class*="half-page"]',
];

// List of NSFW/restricted domains
const NSFW_DOMAINS = [
    // Adult content
    'porn', 'pornhub', 'xvideos', 'xnxx', 'redtube', 'spankbang',
    'xhamster', 'youporn', 'tube8', 'brazzers', 'bangbros',
    'xxx', 'adult', 'sex', 'nude', 'cam', 'onlyfans', 'chaturbate',
    'livejasmine', 'cam4', 'bongacams', 'camsoda',
    
    // Gambling
    'casino', 'poker', 'betting', 'gambling', 'bet365', 'draftkings',
    'fanduel', 'betway', 'unibet', 'slots', 'roulette', 'blackjack',
    'bookmaker', 'sportsbet', 'betfair', 'bwin', 'pokerstars',
];

// Initialize
init();

function init() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startBlocking);
    } else {
        startBlocking();
    }
}

function startBlocking() {
    chrome.storage.local.get(['blockAllAds', 'blockNsfw'], (result) => {
        const blockAllAds = result.blockAllAds !== false;
        const blockNsfw = result.blockNsfw || false;

        // Check NSFW blocking first
        if (blockNsfw && isNsfwDomain()) {
            blockPage();
            return;
        }

        // Apply ad blocking
        if (blockAllAds) {
            removeAds();
            setupMutationObserver();
            setupPeriodicCheck();
        }
    });
}

/**
 * Check if current domain is in NSFW list
 */
function isNsfwDomain() {
    try {
        const hostname = window.location.hostname.toLowerCase();
        return NSFW_DOMAINS.some(domain => hostname.includes(domain));
    } catch (error) {
        console.warn('Silent Web - Error checking NSFW domain:', error);
        return false;
    }
}

/**
 * Block the entire page with a warning
 */
function blockPage() {
    try {
        const html = document.documentElement;
        html.innerHTML = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Content Blocked</title>
                <style>
                    * {
                        margin: 0;
                        padding: 0;
                        box-sizing: border-box;
                    }
                    
                    body {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        height: 100vh;
                        background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                        color: white;
                        overflow: hidden;
                    }
                    
                    .blocker {
                        text-align: center;
                        padding: 40px;
                        max-width: 500px;
                    }
                    
                    h1 {
                        font-size: 48px;
                        margin-bottom: 20px;
                        font-weight: 700;
                    }
                    
                    p {
                        font-size: 18px;
                        opacity: 0.95;
                        margin-bottom: 30px;
                        line-height: 1.6;
                    }
                    
                    .reason {
                        background: rgba(255, 255, 255, 0.15);
                        padding: 20px;
                        border-radius: 10px;
                        margin-top: 20px;
                        backdrop-filter: blur(10px);
                        border: 1px solid rgba(255, 255, 255, 0.2);
                    }
                    
                    .icon {
                        font-size: 64px;
                        margin-bottom: 20px;
                    }
                </style>
            </head>
            <body>
                <div class="blocker">
                    <div class="icon">🔞</div>
                    <h1>BLOCKED</h1>
                    <p>This site is restricted by Silent Web</p>
                    <div class="reason">
                        <p>18+ content is blocked by your settings</p>
                    </div>
                </div>
            </body>
            </html>
        `;
    } catch (error) {
        console.error('Silent Web - Error blocking page:', error);
    }
}

/**
 * Remove ads from DOM
 */
function removeAds() {
    try {
        AD_SELECTORS.forEach(selector => {
            try {
                document.querySelectorAll(selector).forEach(element => {
                    if (isLikelyAd(element)) {
                        removeElement(element);
                    }
                });
            } catch (error) {
                // Invalid selector, skip
            }
        });
    } catch (error) {
        console.warn('Silent Web - Error removing ads:', error);
    }
}

/**
 * Verify element is likely an ad
 */
function isLikelyAd(element) {
    try {
        const text = (element.textContent || '').toLowerCase();
        const html = (element.outerHTML || '').toLowerCase();
        const className = (element.className || '').toLowerCase();
        const id = (element.id || '').toLowerCase();

        const adKeywords = [
            'advertisement', 'sponsored', 'promoted', 'ad', 'advert',
            'ads by', 'advertisement block', 'google ads'
        ];

        // Check if any keyword matches
        return adKeywords.some(keyword =>
            className.includes(keyword) ||
            id.includes(keyword) ||
            html.includes(keyword) ||
            (text.length < 200 && text.includes(keyword))
        );
    } catch (error) {
        return false;
    }
}

/**
 * Safely remove element
 */
function removeElement(element) {
    try {
        if (element && element.parentNode) {
            element.remove();
            notifyBlockedAd();
        }
    } catch (error) {
        console.warn('Silent Web - Error removing element:', error);
    }
}

/**
 * Notify background script of blocked ad
 */
function notifyBlockedAd() {
    try {
        chrome.runtime.sendMessage(
            { action: 'blockAd' },
            (response) => {
                if (chrome.runtime.lastError) {
                    console.warn('Silent Web - Message error:', chrome.runtime.lastError);
                }
            }
        );
    } catch (error) {
        console.warn('Silent Web - Error notifying blocked ad:', error);
    }
}

/**
 * Setup mutation observer for dynamically injected ads
 */
function setupMutationObserver() {
    try {
        const observer = new MutationObserver(() => {
            removeAds();
        });

        observer.observe(document.body || document.documentElement, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['class', 'id', 'data-ad-region', 'data-ad-slot'],
            attributeOldValue: false,
            characterData: false,
            subtreeModified: true
        });
    } catch (error) {
        console.warn('Silent Web - Error setting up mutation observer:', error);
    }
}

/**
 * Periodic check for stubborn ads
 */
function setupPeriodicCheck() {
    try {
        // Run every 2 seconds
        setInterval(() => {
            try {
                removeAds();
            } catch (error) {
                console.warn('Silent Web - Error in periodic check:', error);
            }
        }, 2000);
    } catch (error) {
        console.warn('Silent Web - Error setting up periodic check:', error);
    }
}

console.log('Silent Web - Content script loaded and initialized');
