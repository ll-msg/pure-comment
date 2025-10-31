# 🛡️ PureComment - A Better Online Experience :)

**PureComment** is a Chrome extension that automatically filters comments for you.

> Currently we only support **Reddit**, but we are always working on new things!

---

## 🛠️ Features

- **AI-driven Comment Filtering**  
  Automatically detects and filters out **toxic** or **irrelevant** comments by blurring them. (Of course click to reveal anytime!)

- **Adjustable Sensitivity**  
  Adjust the detection level (**Low → High**) to control how strictly comments are filtered.

- **Keyword Blocklist**  
  Add your own **custom blocked words** to hide specific terms or phrases.

- **Flexible Mode Control**  
  Combine all filters or enable only the ones you need.

---

## 🧩 Prerequisites

### Google Chrome Version
- Install **Chrome Dev** channel (or **Canary** channel)
- Version must be **≥ 128.0.6545.0**

---

## 💾 System Requirements

- Minimum **22 GB** of free storage space  
- **Note:** If available storage falls below **10 GB** after download, the model will be automatically deleted  
- For **macOS users**: Use **Disk Utility** to check accurate free disk space

---

## 💡Getting Started

### Enable Gemini Nano and Prompt API

Before installing, make sure **Gemini Nano** and **Prompt API** are enabled in your Chrome Dev or Canary build.

---

### Install the Extension

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/pure-comment.git
   cd pure-comment
2. **Build the project**
   ```bash
   npm run build

3. **Prepare the build directory**

   - Create a folder named `content` inside the `dist` directory.  
   - Move `content.js` into the `dist/content` folder.  
   - Copy `manifest.json` into the `dist` folder.


4. **Load the Extension in Chrome**

   - Open **Chrome Dev** or **Chrome Canary**.  
   - Navigate to `chrome://extensions/`.  
   - Enable **Developer mode**.  
   - Click **“Load unpacked”** and select your `dist` folder.

---

## 📜 License

Licensed under the **MIT License**
