# How to Contribute

To keep the main code stable, we use a **Fork & Pull Request** workflow.

### 1. Initial Setup
* **Fork** this repository to your own GitHub account.
* **Clone** your fork: `git clone https://github.com/YOUR-USERNAME/repo-name.git`
* **Add Upstream**: `git remote add upstream https://github.com/ORIGINAL-OWNER/repo-name.git`

### 2. Working on a Task
1. **Sync:** `git checkout main` && `git pull upstream main`
2. **Create Feature Branch:** `git checkout -b feature-name`
3. **Commit:** `git add .` && `git commit -m "Description of work"`
4. **Push:** `git push origin feature-name`

### 3. Submit Your Work
* Go to the **original repository** on GitHub.
* Click **"Compare & pull request"**.
* Describe your changes and submit for review!

# Project Setup
Clone your fork of the repo
```bash
git clone https://github.com/YOUR-USERNAME/pollufight.git
cd pollufight
```
Install dependencies
```bash
npm install
```

## Environment Configuration

Create a `.env` file in the root directory with the following variables:

```env
# Cloudinary Configuration
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset

# Firebase Configuration
# Get these values from your Firebase project settings (https://console.firebase.google.com)
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### Firebase Setup Steps:
1. Create a Firebase project at https://console.firebase.google.com
2. Enable Firestore Database (start in test mode for prototype)
3. Go to Project Settings > General > Your apps > Web app
4. Copy the configuration values to your `.env` file
5. Set Firestore security rules (for prototype, use test mode or the rules from the plan)

Run the development server
```bash
npm run dev
```
