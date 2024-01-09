Remove-Item -Path .\dist\ -Recurse -ErrorAction SilentlyContinue
Set-Location .\client\
npm run build
Move-Item -Path .\dist\ -Destination "..\"
Set-Location ..
