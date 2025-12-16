# CI/CD Workflow Documentation

## Overview
This project uses GitHub Actions for continuous integration (CI) to automatically test and validate code changes on every push and pull request.

## Workflow Jobs

### 1. Backend Tests (`backend-test`)
- **Node Versions**: Tests run on Node.js 18.x and 20.x
- **Steps**:
  - Checks out the code
  - Sets up Node.js environment
  - Installs backend dependencies
  - Validates JavaScript syntax
  - Runs linter (if configured)

### 2. Frontend Tests (`frontend-test`)
- **Node Versions**: Tests run on Node.js 18.x and 20.x
- **Steps**:
  - Checks out the code
  - Sets up Node.js environment
  - Installs frontend dependencies
  - Runs React tests with coverage
  - Builds the production bundle
  - Uploads coverage reports to Codecov (optional)

### 3. Integration Tests (`integration-test`)
- **Dependencies**: Runs only after backend and frontend tests pass
- **Services**: Spins up a MongoDB container for testing
- **Steps**:
  - Sets up the full environment
  - Starts the backend server
  - Waits for server to be ready
  - Runs integration tests (backend/test.js)
  - Cleans up resources

### 4. Code Quality Checks (`code-quality`)
- **Steps**:
  - Checks for security vulnerabilities with `npm audit`
  - Identifies outdated dependencies

## Configuration

### Environment Variables (for local testing)
Create a `.env` file in the backend directory:
```env
MONGODB_URI=mongodb://localhost:27017/vezeeta
PORT=5000
JWT_SECRET=your_secret_key_here
```

### Required Secrets (GitHub Repository)
For enhanced CI functionality, add these secrets in your GitHub repository settings:
- `CODECOV_TOKEN` (optional): For coverage reporting

## Trigger Events
The CI workflow runs automatically on:
- **Push** to `main` or `develop` branches
- **Pull Requests** targeting `main` or `develop` branches

## Local Testing

### Run Backend Tests
```bash
cd backend
npm install
npm test
```

### Run Frontend Tests
```bash
cd frontend
npm install
npm test
```

### Run Integration Tests
1. Start MongoDB locally
2. Start the backend server:
   ```bash
   cd backend
   npm start
   ```
3. In another terminal, run tests:
   ```bash
   cd backend
   node test.js
   ```

## Adding More Tests

### Backend
Add test scripts to `backend/package.json`:
```json
{
  "scripts": {
    "test": "node test.js",
    "test:unit": "jest",
    "test:integration": "node test.js"
  }
}
```

### Frontend
Frontend already has testing configured via `react-scripts`. Add test files:
- Place tests next to components: `Component.test.js`
- Or in `__tests__` directories

## Continuous Improvement

### Add Linting
Install ESLint for backend:
```bash
cd backend
npm install --save-dev eslint
npx eslint --init
```

Add lint script to `package.json`:
```json
{
  "scripts": {
    "lint": "eslint ."
  }
}
```

### Add Code Coverage Thresholds
Update frontend `package.json`:
```json
{
  "jest": {
    "coverageThreshold": {
      "global": {
        "branches": 70,
        "functions": 70,
        "lines": 70,
        "statements": 70
      }
    }
  }
}
```

## Troubleshooting

### CI Failing on Dependencies
- Ensure `package-lock.json` files are committed
- Run `npm ci` locally to verify clean installs work

### Integration Tests Timeout
- Increase wait time in the workflow
- Check MongoDB connection in CI logs
- Verify server starts correctly

### Coverage Upload Fails
- This is optional and set to continue on error
- Add `CODECOV_TOKEN` secret if you want coverage reports

## Status Badge
Add this to your main README.md to show CI status:
```markdown
![CI Status](https://github.com/YOUR_USERNAME/YOUR_REPO/workflows/CI/badge.svg)
```

Replace `YOUR_USERNAME` and `YOUR_REPO` with your actual GitHub repository details.
