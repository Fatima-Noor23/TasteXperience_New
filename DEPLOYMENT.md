# TasteXperience – Step-by-Step Deployment Guide

This guide walks you through deploying **TasteXperiencePro** so the **frontend** runs on **Hostinger** and the **backend API** runs on a service that supports Node.js (e.g. **Render** or **Railway**). Hostinger shared hosting can serve static files but does **not** run Node.js, so the backend is deployed separately.

---

## Overview

| Part     | Where it runs                       | What you do                             |
| -------- | ----------------------------------- | --------------------------------------- |
| Frontend | Hostinger (static)                  | Build → upload `dist/` to `public_html` |
| Backend  | Render / Railway / etc.             | Deploy `backend/` + connect PostgreSQL  |
| Database | Hostinger DB or external PostgreSQL | Create DB + tables                      |

---

## Phase 1: Prepare on Your Computer

### Step 1.1 – Open the project

In a terminal (Git Bash, PowerShell, or CMD), go to the app folder:

```bash
cd E:\Projects\tasteXperiencePro\tasteXperience
```

(Use your actual path if different.)

---

### Step 1.2 – Install dependencies

**Frontend (current folder):**

```bash
npm install
```

**Backend:**

```bash
cd backend
npm install
cd ..
```

---

### Step 1.3 – Test the build

Build the frontend. The output will be in the `dist/` folder:

```bash
npm run build
```

- If you see errors, fix them before deploying.
- You should see a `dist` folder with `index.html` and an `assets` folder inside.

---

### Step 1.4 – Database (for backend)

The backend needs **PostgreSQL** with:

- Database name: `finalllll` (or whatever you set in env)
- Tables: `food_profiles`, `stimulation_parameters`, `feedback`

**Option A – Local PostgreSQL (for testing):**

Create the database and tables. Example structure the backend expects:

- **`food_profiles`**: columns including `food_id`, `food_name`, `ph`, `salinity`, `aroma`, `temperature`, `taste_level`
- **`stimulation_parameters`**: one row with `intensity_voltage_level`, `current_level_salty`, `frequency_type`, `duration`, `waveform`, `polarity`
- **`feedback`**: `name`, `email`, `rating`, `comments`, `created_at`, `updated_at`

**Option B – Production:**  
Use Hostinger’s PostgreSQL (if your plan has it) or a free PostgreSQL service (e.g. [Neon](https://neon.tech), [Supabase](https://supabase.com), or the one provided by Render/Railway). Create the same tables there and note the connection details (host, database, user, password, port).

---

## Phase 2: Deploy the Backend (API)

Because Hostinger shared hosting does **not** run Node.js, deploy the backend to a Node-friendly host. Two simple options:

### Option A – Deploy backend on Render (free tier)

1. Go to [render.com](https://render.com) and sign up.
2. **New → Web Service**.
3. Connect your GitHub repo (e.g. `KHRM82/tasteXperiencePro`).
4. Configure:
   - **Root Directory:** `tasteXperience/backend`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.cjs`
   - **Instance Type:** Free
5. **Environment** (in Render dashboard):
   - Add variables: `PGUSER`, `PGHOST`, `PGDATABASE`, `PGPASSWORD`, `PGPORT` (and `PORT` if Render requires it).
   - Use the PostgreSQL URL or host/database/user/password/port from your DB provider.
6. If Render gives you a PostgreSQL database, use its connection info. Otherwise use Hostinger PostgreSQL or Neon/Supabase.
7. Deploy. Note the service URL, e.g. `https://tastexperience-api.onrender.com`.

---

### Option B – Deploy backend on Railway

1. Go to [railway.app](https://railway.app) and sign up.
2. **New Project → Deploy from GitHub** → select your repo.
3. Set **Root Directory** to `tasteXperience/backend`.
4. Add a **PostgreSQL** plugin (Railway will set `PGHOST`, `PGDATABASE`, etc. for you).
5. Add variable: `PORT=5000` (or the port Railway assigns).
6. Deploy. Note the public URL, e.g. `https://your-app.up.railway.app`.

---

### Backend env vars (summary)

Your backend uses these (see `backend/.env.example`):

| Variable   | Description     | Example      |
| ---------- | --------------- | ------------ |
| PGUSER     | PostgreSQL user | postgres     |
| PGHOST     | DB host         | your-db-host |
| PGDATABASE | Database name   | finalllll    |
| PGPASSWORD | DB password     | (secret)     |
| PGPORT     | DB port         | 5432         |
| PORT       | Server port     | 5000         |

Set them in Render/Railway (or in `.env` on a VPS). **Do not** commit real passwords to Git.

---

## Phase 3: Deploy the Frontend to Hostinger

### Step 3.1 – Set your live backend URL (hardcoded – demo version)

Open **`src/config.js`** and set `API_BASE_URL` to your live backend URL (no trailing slash):

```js
export const API_BASE_URL = "https://your-backend.onrender.com"; // or your Railway URL
```

- For **local testing** only, keep: `'http://localhost:5000'`
- For **Hostinger (live)**, use the URL from Render/Railway, e.g. `https://tastexperience-api.onrender.com`

No `.env` files needed – just this one line.

---

### Step 3.2 – Build

From `tasteXperience`:

```bash
npm run build
```

The built app will call the URL you set in `src/config.js`.

---

### Step 3.3 – Upload to Hostinger

1. Log in to **Hostinger** → **hPanel**.
2. Open **File Manager** (or use FTP).
3. Go to **public_html** (or the folder where your site should run).
4. **Upload the contents of the `dist` folder** (not the `dist` folder itself):
   - Upload `index.html` at the root of `public_html`.
   - Upload the whole `assets` folder (with all JS/CSS files) into `public_html`.

So after upload you should see something like:

```
public_html/
  index.html
  assets/
    index-xxxxx.js
    index-xxxxx.css
    ...
```

5. If your site is in a **subfolder** (e.g. `public_html/tastexperience/`):
   - In `tasteXperience/vite.config.js` add: `base: '/tastexperience/'`
   - Run `npm run build` again.
   - Upload the new `dist` contents into `public_html/tastexperience/`.

---

### Step 3.4 – Point your domain (optional)

In Hostinger, make sure your domain is pointed to the same `public_html` (or the folder where you uploaded the files). No extra config is needed for a static site.

---

## Phase 4: Check That Everything Works

1. **Frontend:** Open your site URL (e.g. `https://yourdomain.com`). You should see the TasteXperience home page.
2. **Menu:** Go to the menu, open an item, click **Taste It**. The app should call your deployed API; if the DB has data for that `food_id`, you get a response (and the “tasty” message).
3. **Feedback:** Submit the feedback form. It should POST to your backend; check the `feedback` table in PostgreSQL to confirm the row was inserted.
4. **CORS:** If the browser shows CORS errors, ensure your backend allows your frontend origin (your Hostinger domain). The backend already uses `cors()`; on Render/Railway you usually don’t need to change anything if both are HTTPS.

---

## Quick Checklist

- [ ] `npm install` in `tasteXperience` and in `tasteXperience/backend`
- [ ] `npm run build` succeeds
- [ ] PostgreSQL database created with tables `food_profiles`, `stimulation_parameters`, `feedback`
- [ ] Backend deployed (Render/Railway) with DB env vars set
- [ ] Backend URL works (e.g. open `https://your-api.onrender.com/api/finalllll/1` in browser – may return 404 if no data, but not a connection error)
- [ ] `src/config.js` has `API_BASE_URL` set to your live backend URL
- [ ] `npm run build` after changing `API_BASE_URL`
- [ ] Contents of `dist/` uploaded to Hostinger `public_html` (or subfolder with `base` set)
- [ ] Site loads; Menu → Taste It and Feedback form work

---

## If You Use Hostinger VPS (Advanced)

If you have a **Hostinger VPS** (not shared hosting), you can run both frontend and backend on the same server:

1. On the VPS: install Node.js and PostgreSQL.
2. Clone the repo, then in `tasteXperience/backend`: set env vars (or `.env`), run `npm install` and `node server.cjs`. Use a process manager (e.g. PM2) and keep the backend behind Nginx/Apache (reverse proxy).
3. Build the frontend (`npm run build`), serve the `dist/` folder via Nginx/Apache (e.g. as static files).
4. Set `API_BASE_URL` in `src/config.js` to your VPS API URL (e.g. `https://api.yourdomain.com`) and rebuild before uploading or serving `dist/`.

---

## Troubleshooting

| Problem                      | What to check                                                                                                                 |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Blank page on Hostinger      | Ensure `index.html` and `assets/` are in the root of `public_html` (or correct subfolder). Check browser console for 404s.    |
| “Failed to fetch taste data” | `API_BASE_URL` in `src/config.js` correct? Backend running? CORS allowing your domain?                                        |
| Feedback not saving          | Backend env vars (PG\* ) correct? Table `feedback` exists with columns name, email, rating, comments, created_at, updated_at? |
| 404 on refresh (subfolder)   | You must set `base: '/yoursubfolder/'` in `vite.config.js` and rebuild if the app is in a subfolder.                          |

---

## File Reference

- **Frontend API URL (hardcoded for demo):** `tasteXperience/src/config.js` → `API_BASE_URL`
- **Backend env:** `tasteXperience/backend/.env` or platform env (Render/Railway) → `PGUSER`, `PGHOST`, `PGDATABASE`, `PGPASSWORD`, `PGPORT`, `PORT`
- **Examples:** `tasteXperience/backend/.env.example`

You’re done. Your TasteXperience app should be live on Hostinger with the API running on Render or Railway.
