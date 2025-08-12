# Auto Deploy Script for GitHub Pages
Write-Host "🚀 Starting auto deployment to GitHub Pages..." -ForegroundColor Green

# Build the application
Write-Host "📦 Building Angular application..." -ForegroundColor Yellow
ng build --base-href /mahlatji-mmetji-group-app/

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build successful!" -ForegroundColor Green
    
    # Deploy to GitHub Pages
    Write-Host "🌐 Deploying to GitHub Pages..." -ForegroundColor Yellow
    npx angular-cli-ghpages --dir=dist/mahlatji-mmetji-group/browser
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "🎉 Deployment successful!" -ForegroundColor Green
        Write-Host "🔗 Your website is live at: https://j-unior.github.io/mahlatji-mmetji-group-app/" -ForegroundColor Cyan
        
        # Commit changes to main branch
        Write-Host "💾 Committing changes to main branch..." -ForegroundColor Yellow
        git add .
        git commit -m "Auto deployment - $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
        git push origin main
        
        Write-Host "✅ All done! Changes are live!" -ForegroundColor Green
    } else {
        Write-Host "❌ Deployment failed!" -ForegroundColor Red
    }
} else {
    Write-Host "❌ Build failed!" -ForegroundColor Red
}
