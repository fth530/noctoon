@echo off
echo Deploying popular manga section...
git add client/src/components/popular-manga-section.tsx
git add client/src/pages/home.tsx
git add client/src/index.css
git add client/tailwind.config.js
git status
git commit -m "feat: add popular manga section with filtering tabs"
git push origin main
echo Done! Check Netlify for deployment.
pause