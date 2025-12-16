# CI/CD Quick Reference

## What Gets Tested?

### ✅ Every Push & Pull Request
- Backend syntax validation
- Frontend unit tests  
- Production build verification
- Security vulnerability scanning
- Integration tests with MongoDB

## Workflow Status

Check the status of your CI runs:
1. Go to the "Actions" tab in your GitHub repository
2. Click on the latest workflow run
3. View detailed logs for each job

## Before Pushing Code

Run these commands locally to catch issues early:

```bash
# Backend checks
cd backend
npm install
npm test
node -c server.js

# Frontend checks  
cd frontend
npm install
npm test -- --watchAll=false
npm run build
```

## Common Issues & Fixes

### ❌ "npm ci can only install packages when your package.json and package-lock.json are in sync"
**Fix**: Delete `node_modules` and run `npm install` to regenerate `package-lock.json`, then commit it.

### ❌ Frontend tests fail in CI but pass locally
**Fix**: Ensure `CI=true` environment variable is set, tests run with `--watchAll=false`.

### ❌ Integration tests timeout
**Fix**: 
- Check MongoDB connection string
- Increase timeout in workflow file
- Verify backend starts properly

### ❌ Security audit failures
**Fix**: Run `npm audit fix` locally, test, then commit changes.

## Skipping CI (Emergency Only)

Add `[skip ci]` to your commit message:
```bash
git commit -m "docs: update README [skip ci]"
```

⚠️ Use sparingly - CI helps catch bugs early!

## Adding New Tests

### Backend
1. Add test files to `backend/`
2. Update test script in `backend/package.json`
3. Run locally: `npm test`

### Frontend  
1. Create `*.test.js` files next to components
2. Use Jest and React Testing Library
3. Run locally: `npm test`

## Monitoring

### View Test Coverage
- Frontend coverage reports generated in `frontend/coverage/`
- Open `frontend/coverage/lcov-report/index.html` in browser

### Check Dependencies
```bash
# Security vulnerabilities
npm audit

# Outdated packages
npm outdated
```

## Need Help?

1. Check [.github/workflows/README.md](.github/workflows/README.md) for detailed docs
2. Review workflow file: [.github/workflows/ci.yml](.github/workflows/ci.yml)
3. Check CI logs in GitHub Actions tab
4. Ask in PR comments - tag reviewers

---

**Remember**: Green CI ✅ = Safe to merge!
