# VPN Reseller & Expense Tracker

A fast, responsive web application to track monthly VPN server bills (such as Leaseweb Singapore @ LKR 2,150/mo, 4 vCPU, 6G RAM, 100G NVMe, 30 TB bandwidth pool), record client data bandwidth sales in GB, manage payments in Sri Lankan Rupees (LKR), and automatically calculate profit/loss, break-even targets, and cloud synchronization with Firebase.

---

## 🚀 How to Host on GitHub Pages (Free)

Follow these steps to host this web application directly on GitHub Pages for free:

### Step 1: Initialize Git and Push to GitHub

In your project folder (or terminal):

```bash
# 1. Initialize git (if not already done)
git init

# 2. Stage all files
git add .

# 3. Create initial commit
git commit -m "Initial commit of VPN Reseller Tracker"

# 4. Set default branch to main
git branch -M main

# 5. Add your GitHub repository URL (replace with your repo link)
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/YOUR_REPOSITORY_NAME.git

# 6. Push your code to GitHub
git push -u origin main
```

---

### Step 2: Enable GitHub Pages in your GitHub Repository

1. Go to your repository on [GitHub.com](https://github.com).
2. Click **Settings** (gear icon near top-right).
3. In the left sidebar, click **Pages** (under the "Code and automation" section).
4. Under **Build and deployment** > **Source**, select **GitHub Actions**.
5. That's it! The workflow in `.github/workflows/deploy.yml` will automatically build and publish your site.
6. Once the build finishes (about 1–2 minutes), your live website URL will appear at:
   `https://YOUR_GITHUB_USERNAME.github.io/YOUR_REPOSITORY_NAME/`

---

### Step 3: Custom Domain Setup (e.g. vpncost.nvderttf56.pp.ua)

If using a custom domain:
1. In your GitHub repository, go to **Settings** > **Pages** > **Custom domain** and enter `vpncost.nvderttf56.pp.ua`.
2. Ensure DNS records for your domain point to GitHub Pages (`185.199.108.153`, `185.199.109.153`, etc., or CNAME to `<username>.github.io`).
3. Check the **Enforce HTTPS** box once DNS propagates.
4. In [Firebase Console](https://console.firebase.google.com/) > **Authentication** > **Settings** > **Authorized domains**, add `vpncost.nvderttf56.pp.ua`.

---

### Step 4: Authorize your Domain in Firebase

To allow Google Sign-In to work on your new GitHub Pages website:

1. Open the [Firebase Console](https://console.firebase.google.com/).
2. Select your project (`waking-advice-kxjsq`).
3. In the left menu, click **Authentication** > **Settings** tab.
4. Scroll to **Authorized domains**.
5. Click **Add domain** and enter your GitHub Pages domain:
   `YOUR_GITHUB_USERNAME.github.io`
6. Click **Save**. Google Sign-In and Firestore synchronization will now work on your GitHub Pages site!

---

## 🛠️ Local Development

To run the application locally on your machine:

```bash
# Install dependencies
npm install

# Start local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📋 Features

- **Server Bill Tracking**: Pre-configured with Leaseweb Singapore (LKR 2,150/mo, 4 vCPU, 6G RAM, 100G NVMe, 30 TB Bandwidth pool).
- **Client Bandwidth Ledger**: Enter client names, data sold (GB), and payments received (LKR).
- **Break-Even Simulator**: Interactive simulator calculating GB and clients needed to cover server bills.
- **WhatsApp / Telegram Slip Generator**: 1-click formatted receipt generator for clients.
- **Cloud Sync**: Firebase Firestore integration for real-time cloud storage and cross-device sync.
- **Data Export & Backup**: Download CSV files for Excel/Sheets and full JSON backups.
