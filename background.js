function clearHiddenJobStorage() {
    chrome.storage.local.set({
      hiddenJobs: {},
      hiddenJobsByCompany: {}
    }, () => {
      console.log("🧹 Cleared hiddenJobs and hiddenJobsByCompany");
    });
  }
  
  // When a LinkedIn Jobs tab is closed
  chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
    // You can't get the URL here, so just clear anyway
    clearHiddenJobStorage();
  });
  
  