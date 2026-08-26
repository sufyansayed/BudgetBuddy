# BudgetBuddy - Local Setup & Execution Guide

This document contains complete, step-by-step instructions to clone, run, test, and build **BudgetBuddy** on your local machine.

---

## 1. Prerequisites

Before getting started, make sure you have the following installed on your computer:
- **Node.js**: Version 18.x, 20.x, or 22.x (Download from https://nodejs.org)
- **npm**: (Included automatically with Node.js)
- **Git**: (Download from https://git-scm.com)

Check your installed versions in your terminal:
```bash
node -v
npm -v
git --version
```

---

## 2. Clone the Repository

Clone your synced GitHub repository to your local computer:

```bash
git clone <YOUR_GITHUB_REPO_URL>
cd <YOUR_REPO_FOLDER_NAME>
```

*(Replace `<YOUR_GITHUB_REPO_URL>` with your actual GitHub repository URL, e.g., `git clone https://github.com/your-username/budgetbuddy.git`)*

---

## 3. Environment Configuration

Copy the example environment configuration into a `.env` file:

```bash
# On Linux / macOS / Git Bash:
cp .env.example .env

# On Windows PowerShell:
Copy-Item .env.example .env

# On Windows Command Prompt (cmd):
copy .env.example .env
```

*(Note: BudgetBuddy works completely client-side for budgeting calculations and storage. If you enable Gemini AI server features, add your `GEMINI_API_KEY` into `.env`)*

---

## 4. Install Dependencies

Install all required npm packages:

```bash
npm install
```

---

## 5. Running the Application Locally (Dev Server)

Start the local Vite development server:

```bash
npm run dev
```

Your terminal will display a local URL, typically:
```text
  VITE v6.2.3  ready in ~200 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

Open **`http://localhost:5173`** in your browser (Chrome, Edge, Safari, or Firefox).

---

## 6. Testing & Quality Checks

Run the following commands to test execution and check code integrity:

### A. TypeScript Type Check (Linter)
Verifies that all TypeScript types and imports are valid:
```bash
npm run lint
```
*Expected output: No errors reported (`tsc --noEmit` succeeds).*

### B. Production Build Test
Verifies that the project bundles and builds cleanly for production:
```bash
npm run build
```
*Expected output: Creates optimized static assets in the `dist/` directory.*

### C. Preview the Production Build
Test the production-ready bundle locally on a local server:
```bash
npm run preview
```
Open the provided URL (usually `http://localhost:4173`) to test the built version.

---

## 7. Project Architecture & Tech Stack

- **Framework**: React 19 + TypeScript
- **Bundler & Dev Server**: Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide-React
- **Animations / FX**: Motion & Canvas-Confetti
- **State & Storage**: LocalStorage engine with JSON export/backup support

---

## 8. Common Troubleshooting

| Issue | Solution |
|---|---|
| `command not found: node` / `npm` | Install Node.js from [nodejs.org](https://nodejs.org) and restart your terminal. |
| `Port 5173 is already in use` | Vite will automatically select the next available port (e.g. `5174`), or you can specify: `npm run dev -- --port 3000` |
| Node modules cache issues | Delete `node_modules` and `package-lock.json`, then run `npm install` again. |
