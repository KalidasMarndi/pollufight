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
pip install -r src-backend/requirements.txt
```
Run the backend and frontend servers
```bash
# Python Backend
python src-backend/main.py
# React Frontend
npm run dev
```
