# LinkedIn Job Filter Extension

A Chrome Extension that filters LinkedIn job listings based on user-defined keywords in job titles and company names. This extension hides jobs you aren't interested in (e.g., "senior", "embedded") right on the LinkedIn Jobs page to help you focus on relevant opportunities.

---

## 🚀 Features

- 🧠 Filters job cards by keywords in job titles
- 🏢 Filters job cards by company names
- ✅ Uses `chrome.storage.local` to persist user filters
- 🔁 Works with LinkedIn's dynamically loaded job cards (MutationObserver)
- 🔄 Automatically refreshes filtering logic when the user navigates between job pages (via URL changes)
- 🎛 Provides a simple popup interface to add/remove keywords and companies

---

## 🧰 How It Works

### 1. Content Script (content.js)

- Injected into pages matching `https://www.linkedin.com/jobs/search/*`
- Listens for DOM mutations (via `MutationObserver`) to detect new job cards
- Hides job cards whose titles or companies match any of the user-defined filters
- Stores hidden job IDs (so they can be shown again when a keyword is removed)
- Resets visibility when filters are cleared or modified
- Listens for navigation changes (URL changes) and reapplies filters

### 2. Popup Interface (hello.html + popup.js)

- Allows users to:
  - Add/remove filter keywords
  - Add/remove company names
- Stores filters in `chrome.storage.local`
- Sends messages to the content script to reapply or undo filters

### 3. Background Service Worker (background.js)

- Monitors tab closures
- When all LinkedIn job tabs are closed, clears `hiddenJobs` and `hiddenJobsByCompany` from storage

---

## 🧪 How to Install (Developer Mode)

1. Clone or download this repository.
2. Open Chrome and go to: `chrome://extensions/`
3. Enable **Developer mode** (top-right corner)
4. Click **"Load unpacked"**
5. Select the folder containing this extension’s files
6. Navigate to linkedin job search page and click the extension icon to open the popup

---

## 🛠️ Additional features ideas

### 1. Regex Filtering

- Allow users to enter regular expressions (e.g., `/senior|lead/i`) for more flexible matching

### 2. Filter by Location or Salary

- Parse additional DOM elements
- Add new inputs in popup for locations or salary ranges

### 3. Analytics Dashboard

- Track how many jobs were filtered per keyword
- Displaying stats in the popup UI

### 4. Toggle Visibility

- Add a global toggle switch to turn filtering on/off without deleting keywords

### 5. Sync Filters Across Devices

- Use `chrome.storage.sync` instead of `chrome.storage.local`

---

## ⚠️ Known Drawbacks / Limitations
### Refresh the linkedin job search page if you think the extension is not working.

- ❌ Content script may not run if user navigates from home page to jobs without reloading (unless background injects it)(This is hit or miss sometimes)
- ❌ Job IDs are DOM-based and can break if LinkedIn changes structure
- ❌ Filters are stored in `local` storage and not synced across devices
- ❌ Only supports title and company filtering — no location, tags, or job type (yet)
- ❌ Filtering may lag slightly due to LinkedIn’s lazy loading

---

## 🤝 Contributing

Pull requests are welcome! Please open an issue first to discuss major changes. Suggestions for new features, bug fixes, or UX improvements are highly appreciated.


---

## 🙋‍♂️ Questions?

Feel free to reach out or open an issue if you have questions, ideas, or need help extending the functionality!
