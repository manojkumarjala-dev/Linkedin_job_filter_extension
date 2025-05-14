// popup.js
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("filterForm");
    const filterList = document.getElementById("filterList");

    const companyForm = document.getElementById("companyForm");
    const companyList = document.getElementById("companyList");
  


    // Load and render saved filter words
    chrome.storage.local.get(["filterWords"], (result) => {
      const words = result.filterWords || [];
      words.forEach(word => addFilterToDOM(word));
    });
  
    // Load and render saved company names  
    chrome.storage.local.get(["filterCompanies"], (result) => {
      const companies = result.filterCompanies || [];
      companies.forEach(company => addFilterToDOM(company, "company-item"));
    });


    // Handle adding a new filter word
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = form.elements["filter"];
      const newWord = input.value.trim().toLowerCase();
  
      if (!newWord) return;
  
      chrome.storage.local.get(["filterWords"], (result) => {
        const current = result.filterWords || [];
        if (!current.includes(newWord)) {
          current.push(newWord);
          chrome.storage.local.set({ filterWords: current }, () => {
            addFilterToDOM(newWord);
          });
          chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
            chrome.tabs.sendMessage(tab.id, {
              type: "refreshFilters"
            });
          });          
        }
      });
  
      input.value = "";
    });

    companyForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = companyForm.elements["company"];
      const newCompany = input.value.trim().toLowerCase();
  
      if (!newCompany) return;
  
      chrome.storage.local.get(["filterCompanies"], (result) => {
        const current = result.filterCompanies || [];
        if (!current.includes(newCompany)) {
          current.push(newCompany);
          chrome.storage.local.set({ filterCompanies: current }, () => {
            addFilterToDOM(newCompany, "company-item");
          });
          chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
            chrome.tabs.sendMessage(tab.id, {
              type: "refreshFilters"
            });
          });          
        }
      });
  
      input.value = "";
    }
    );
  


    // Helper to add a keyword to the UI
    function addFilterToDOM(word, className) {
      const li = document.createElement("li");
      li.textContent = word;
  
      const btn = document.createElement("button");
      btn.textContent = "×";
      btn.className = "remove-btn";
      btn.addEventListener("click", () => {
        if(li.className=="company-item") {
          chrome.storage.local.get(["filterCompanies"], (result) => {
            const updated = (result.filterCompanies || []).filter(w => w !== word);
            chrome.storage.local.set({ filterCompanies: updated });
          });

          chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
            chrome.tabs.sendMessage(tab.id, {
              type: "removeCompany",
              keyword: word
            });
          });
        }
        else {
            removeKeyword(word);
        }
        
        li.remove();
      });
  
      li.appendChild(btn);
      if(className=="company-item") {
        li.className = className;
        companyList.appendChild(li);
      } 
      else {
        li.className = "filter-item";   
        filterList.appendChild(li);
      }
    }
  
    // Remove keyword from storage and notify content script
    function removeKeyword(word) {
      chrome.storage.local.get(["filterWords"], (result) => {
        const updated = (result.filterWords || []).filter(w => w !== word);
        chrome.storage.local.set({ filterWords: updated });
  
        // Tell the content script to show jobs again
        chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
          chrome.tabs.sendMessage(tab.id, {
            type: "removeKeyword",
            keyword: word
          });
        });
      });
    }
  });
  


  // This script handles the popup UI for adding and removing filter words
  // It listens for form submissions to add new filter words and
  // displays the current list of filter words stored in local storage.
  // It also allows users to remove filter words from the list.
  // When a filter word is added or removed, it sends a message to the content script
  // to refresh the job listings based on the updated filter words.
  // It uses the Chrome Storage API to persist filter words across sessions.
  // The script also includes a function to add filter words to the DOM
  // and a function to remove them from both the DOM and local storage.
document.addEventListener('DOMContentLoaded', () => {
    const filterForm = document.getElementById('filterForm');
    const companyForm = document.getElementById('companyForm');

    // Load and display existing filter words
    filterForm.addEventListener('submit', function (event) {
      event.preventDefault();
      const filterWord = filterForm.elements['filter'].value;
      if (filterWord) {
        chrome.storage.local.get(['filterWords'], function (result) {
          const filterWords = result.filterWords || [];
          filterWords.push(filterWord);
          chrome.storage.local.set({ filterWords: filterWords }, function () {
          });
        });
        filterForm.reset();
      }
    });

    // Load and display existing company names
    companyForm.addEventListener('submit', function (event) {
      event.preventDefault();
      const companyName = companyForm.elements['company'].value;
      if (companyName) {
        chrome.storage.local.get(['filterCompanies'], function (result) {
          const filterCompanies = result.filterCompanies || [];
          filterCompanies.push(companyName);
          chrome.storage.local.set({ filterCompanies: filterCompanies }, function () {
          });
        });
        companyForm.reset();
      }
    });
  });
  