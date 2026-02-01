import Clarity from '@microsoft/clarity';

// Your Microsoft Clarity Project ID - get this from https://clarity.microsoft.com
const CLARITY_PROJECT_ID = import.meta.env.VITE_CLARITY_PROJECT_ID || '';

// Track if Clarity has been initialized
let isInitialized = false;

/**
 * Initialize Microsoft Clarity tracking
 * Call this once when the app starts
 */
export const initClarity = () => {
  if (isInitialized || !CLARITY_PROJECT_ID) {
    if (!CLARITY_PROJECT_ID) {
      console.warn('Microsoft Clarity: Project ID not configured. Set VITE_CLARITY_PROJECT_ID in your .env file.');
    }
    return;
  }

  try {
    Clarity.init(CLARITY_PROJECT_ID);
    isInitialized = true;
    console.log('Microsoft Clarity initialized successfully');
  } catch (error) {
    console.error('Failed to initialize Microsoft Clarity:', error);
  }
};

/**
 * Track custom events
 * Note: @microsoft/clarity event() only accepts event name, value is passed via setTag
 */
export const trackEvent = (eventName: string, eventValue?: string) => {
  if (!isInitialized) {
    console.warn('Clarity not initialized. Call initClarity() first.');
    return;
  }

  try {
    // If there's a value, set it as a tag first
    if (eventValue) {
      Clarity.setTag(eventName, eventValue);
    }
    Clarity.event(eventName);
    console.log(`Clarity Event: ${eventName}`, eventValue || '');
  } catch (error) {
    console.error('Failed to track event:', error);
  }
};

/**
 * Identify a user (optional - for logged-in users)
 */
export const identifyUser = (userId: string, sessionId?: string, pageId?: string, friendlyName?: string) => {
  if (!isInitialized) return;

  try {
    Clarity.identify(userId, sessionId, pageId, friendlyName);
    console.log('Clarity User Identified:', userId);
  } catch (error) {
    console.error('Failed to identify user:', error);
  }
};

/**
 * Set custom session variables (tags)
 */
export const setVariable = (key: string, value: string | string[]) => {
  if (!isInitialized) return;

  try {
    Clarity.setTag(key, value);
    console.log(`Clarity Variable Set: ${key}`, value);
  } catch (error) {
    console.error('Failed to set variable:', error);
  }
};

// ============================================
// Pre-defined event tracking functions
// ============================================

/**
 * Track when a user starts creating a Valentine page
 */
export const trackPageCreationStarted = () => {
  trackEvent('page_creation_started');
};

/**
 * Track when a user successfully creates a Valentine page
 */
export const trackPageCreated = (recipientName: string) => {
  trackEvent('page_created', recipientName);
};

/**
 * Track when a user copies the generated link
 */
export const trackLinkCopied = () => {
  trackEvent('link_copied');
};

/**
 * Track when a user views a shared Valentine page
 */
export const trackSharedPageViewed = (recipientName: string) => {
  trackEvent('shared_page_viewed', recipientName);
};

/**
 * Track when user clicks "Yes" on the Valentine page
 */
export const trackYesClicked = () => {
  trackEvent('yes_clicked');
};

/**
 * Track when user tries to click "No" (attempts to avoid)
 */
export const trackNoAttempted = () => {
  trackEvent('no_attempted');
};

/**
 * Track social share button clicks
 */
export const trackSocialShare = (platform: string) => {
  trackEvent('social_share', platform);
};

/**
 * Track when user clicks "Create Your Own" button
 */
export const trackCreateYourOwn = () => {
  trackEvent('create_your_own_clicked');
};

/**
 * Track image upload started
 */
export const trackImageUploadStarted = () => {
  trackEvent('image_upload_started');
};

/**
 * Track image upload completed
 */
export const trackImageUploadCompleted = () => {
  trackEvent('image_upload_completed');
};

/**
 * Track image upload failed
 */
export const trackImageUploadFailed = (error: string) => {
  trackEvent('image_upload_failed', error);
};
