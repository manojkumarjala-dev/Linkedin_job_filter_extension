function hideJobLinks() {
  const jobLinks = document.querySelectorAll('a.job-card-container__link');
  console.log(`🔍 Found ${jobLinks.length} job links.`);

  chrome.storage.local.get(['filterWords', 'hiddenJobs'], function (result) {
    const blockedKeywords = (result.filterWords || []).map(word => word.toLowerCase());
    const hiddenJobs = result.hiddenJobs || {};
    console.log(`🔍 Found ${blockedKeywords.length} filter words:`, blockedKeywords);

    let hiddenCount = 0;

    jobLinks.forEach(link => {
      const text = link.innerText.toLowerCase();
      const matchedKeyword = blockedKeywords.find(keyword => text.includes(keyword));

      if (matchedKeyword) {
        const listItem = link.closest('li');
        if (!listItem) return;

        const jobId = listItem.getAttribute('data-occludable-job-id');
        if (!jobId) return;

        if (listItem.style.display !== "none") {
          listItem.style.display = "none";
          hiddenCount++;
          console.log(`⛔️ Hiding job [${jobId}] for keyword "${matchedKeyword}"`);

          // Store jobId under the matched keyword
          if (!hiddenJobs[matchedKeyword]) hiddenJobs[matchedKeyword] = [];
          if (!hiddenJobs[matchedKeyword].includes(jobId)) {
            hiddenJobs[matchedKeyword].push(jobId);
          }
        }
      }
    });

    chrome.storage.local.set({ hiddenJobs }, () => {
      console.log(`✅ Hidden ${hiddenCount} jobs this round.`);
    });
  });
}

function hideJobLinksByCompany() {
    const jobLinks = document.querySelectorAll('div.artdeco-entity-lockup__subtitle > span');
    console.log(`🔍 Found ${jobLinks.length} company job links.`);
  
    chrome.storage.local.get(['filterCompanies', 'hiddenJobsByCompany'], function (result) {
      const filterCompanies = (result.filterCompanies || []).map(company => company.toLowerCase());
      const hiddenJobsByCompany = result.hiddenJobsByCompany || {};
      console.log(`🔍 Found ${filterCompanies.length} filter companies:`, filterCompanies);
  
      let hiddenCount = 0;
  
      jobLinks.forEach(link => {
        const text = link.innerText.toLowerCase();
        const matchedCompany = filterCompanies.find(company => text.includes(company));
  
        if (matchedCompany) {
          const listItem = link.closest('li');
          if (!listItem) return;
  
          const jobId = listItem.getAttribute('data-occludable-job-id');
          if (!jobId) return;
  
          if (listItem.style.display !== "none") {
            listItem.style.display = "none";
            hiddenCount++;
            console.log(`⛔️ Hiding job [${jobId}] for company "${matchedCompany}"`);
  
            // Store jobId under the matched keyword
            if (!hiddenJobsByCompany[matchedCompany]) hiddenJobsByCompany[matchedCompany] = [];
            if (!hiddenJobsByCompany[matchedCompany].includes(jobId)) {
                hiddenJobsByCompany[matchedCompany].push(jobId);
            }
          }
        }
      });
  
      chrome.storage.local.set({ hiddenJobsByCompany }, () => {
        console.log(`✅ Hidden ${hiddenCount} jobs this round.`);
      });
    });
  }
  
function showJobsForRemovedKeyword(removedKeyword) {
    chrome.storage.local.get(['hiddenJobs'], (result) => {
      const hiddenJobs = result.hiddenJobs || {};
      const jobIds = hiddenJobs[removedKeyword] || [];
  
      jobIds.forEach(jobId => {
        const li = document.querySelector(`li[data-occludable-job-id="${jobId}"]`);
        if (li) {
          li.style.display = ""; // unhide
          console.log(`🔄 Unhid job ${jobId}`);
        }
      });
  
      // Remove stored job IDs for this keyword
      delete hiddenJobs[removedKeyword];
      chrome.storage.local.set({ hiddenJobs });
    });
  }

function showJobsForRemovedCompany(removedCompany) {
    
    chrome.storage.local.get(['hiddenJobsByCompany'], (result) => {
      const hiddenJobsByCompany = result.hiddenJobsByCompany || {};
      const jobIds = hiddenJobsByCompany[removedCompany] || [];
  
      jobIds.forEach(jobId => {
        const li = document.querySelector(`li[data-occludable-job-id="${jobId}"]`);
        if (li) {
          li.style.display = ""; // unhide
          console.log(`🔄 Unhid job ${jobId}`);
        }
      });
  
      // Remove stored job IDs for this keyword
      delete hiddenJobsByCompany[removedCompany];
      chrome.storage.local.set({ hiddenJobsByCompany });
    });
  }
  

const observer = new MutationObserver(hideJobLinks);
observer.observe(document.body, { childList: true, subtree: true });

const companyObserver = new MutationObserver(hideJobLinksByCompany);
companyObserver.observe(document.body, { childList: true, subtree: true });

// initial run
hideJobLinks(); 
hideJobLinksByCompany()

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.type === "refreshFilters") {
        hideJobLinks();
      hideJobLinksByCompany();
    }
  });

chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type === 'removeKeyword') {
      showJobsForRemovedKeyword(msg.keyword);
    }
    
  });
chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type === 'removeCompany') {
      showJobsForRemovedCompany(msg.keyword);
    }

  });
  
