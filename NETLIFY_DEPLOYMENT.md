# Frontend Deployment to Netlify - Setup Complete ✅

## Step 1: API Configuration (Completed)

### 1.1 API URL Config File
Created [frontend/src/config/api.js](frontend/src/config/api.js) to centralize API URL configuration:
```javascript
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';
export default API_URL;
```

### 1.2 Updated All API Calls
Updated the following files to use the centralized API configuration:
- ✅ [frontend/src/pages/Login.js](frontend/src/pages/Login.js)
- ✅ [frontend/src/pages/Register.js](frontend/src/pages/Register.js)
- ✅ [frontend/src/pages/DoctorDashboard.js](frontend/src/pages/DoctorDashboard.js)
- ✅ [frontend/src/pages/PatientDashboard.js](frontend/src/pages/PatientDashboard.js)
- ✅ [frontend/src/pages/AppointmentHistory.js](frontend/src/pages/AppointmentHistory.js)

All hardcoded `http://localhost:5001` URLs have been replaced with `${API_URL}` template literals.

## Step 2: Environment Files (Completed)

### 2.1 Local Development
Created [frontend/.env.local](frontend/.env.local):
```
REACT_APP_API_URL=http://localhost:5001
```
Use this for local development. This file is in `.gitignore` and won't be committed.

### 2.2 Production (Netlify)
Created [frontend/.env.production](frontend/.env.production):
```
REACT_APP_API_URL=https://your-railway-backend-url.up.railway.app
```
⚠️ **Important:** Replace `your-railway-backend-url` with your actual Railway backend URL after deployment.

### 2.3 Git Protection
[frontend/.gitignore](frontend/.gitignore) already includes:
- `.env.local`
- `.env.development.local`
- `.env.test.local`
- `.env.production.local`

## Step 3: Netlify Configuration (Completed)

Created [netlify.toml](netlify.toml) at the project root:
```toml
[build]
  base = "frontend"
  command = "npm run build"
  publish = "build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

This configuration:
- Sets build directory to `frontend/`
- Runs `npm run build` to create production bundle
- Publishes the `build/` folder
- Redirects all routes to `index.html` for React Router to handle client-side routing

## Step 4: Verification (Completed)

✅ **Frontend compiles successfully** with no errors or warnings related to API imports.

## Deployment Steps to Netlify

### Option 1: Connect via GitHub (Recommended)
1. Push your code to GitHub
2. Go to [Netlify](https://netlify.com)
3. Click "New site from Git"
4. Select GitHub and authorize
5. Choose your repository
6. Configure build settings:
   - **Base directory:** `frontend` (Netlify should auto-detect from `netlify.toml`)
   - **Build command:** `npm run build`
   - **Publish directory:** `build`
7. Scroll to "Environment" → Add environment variables:
   - Key: `REACT_APP_API_URL`
   - Value: Your Railway backend URL (e.g., `https://project-prod-abc123.up.railway.app`)
8. Click "Deploy"

### Option 2: Deploy via Netlify CLI
```bash
npm install -g netlify-cli
cd Project_sw
netlify deploy --prod
```

## Environment Variables to Configure on Netlify

After connecting your repository to Netlify, add this environment variable:

| Key | Value | Notes |
|-----|-------|-------|
| `REACT_APP_API_URL` | `https://your-railway-backend-url.up.railway.app` | Replace with your Railway backend URL |

## Testing Deployment

1. **Local Development:**
   ```bash
   npm start
   # or
   npm run dev-all
   ```
   Should use `http://localhost:5001` for API

2. **Production Build:**
   ```bash
   npm run build --prefix frontend
   # or from frontend directory
   cd frontend && npm run build
   ```

3. **After Netlify Deployment:**
   - Visit your Netlify site URL
   - Test login/registration
   - Check browser console for API errors (Network tab)
   - Ensure all API calls go to your Railway backend

## Common Issues & Troubleshooting

### API calls still go to localhost:5001
- Verify `REACT_APP_API_URL` is set in Netlify environment variables
- Check that the environment variable name is exactly `REACT_APP_API_URL` (React only exposes variables starting with `REACT_APP_`)
- Rebuild/redeploy the site after adding environment variables

### CORS errors from Railway
- Ensure your [backend/server.js](backend/server.js) has CORS configured properly:
  ```javascript
  app.use(cors()); // or specify allowed origins
  ```
- Configure your Railway backend to allow requests from your Netlify domain

### 404 on page refresh
- Verify `netlify.toml` redirect rules are in place
- This ensures all routes redirect to `index.html` for React Router

## Related Files

**Backend Configuration:**
- [backend/server.js](backend/server.js) - Uses `process.env.PORT` and `process.env.MONGODB_URI`
- [backend/railway.json](backend/railway.json) - Railway deployment config
- [backend/.env](backend/.env) - Local environment variables (not committed)

**Frontend Configuration:**
- [frontend/.env.local](frontend/.env.local) - Local development (not committed)
- [frontend/.env.production](frontend/.env.production) - Production (not committed)
- [netlify.toml](netlify.toml) - Netlify build & deployment config

**GitHub Actions:**
- [.github/workflows/deploy-backend-railway.yml](.github/workflows/deploy-backend-railway.yml) - Auto-deploy backend to Railway on push
