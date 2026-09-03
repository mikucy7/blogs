@echo off
chcp 65001 >nul
title 拾光集 · Pure 发布
cd /d %~dp0

echo.
echo  ^=^> [1/2] 构建站点 (Astro Theme Pure)...
call npx astro build
if errorlevel 1 goto :err

echo.
echo  ^=^> [2/2] 部署到 Cloudflare Pages...
call npx -y wrangler pages deploy dist --project-name pure-shiguang --branch main --commit-dirty=true
if errorlevel 1 goto :err

echo.
echo  ============================================
echo   发布完成！ https://pure-shiguang.pages.dev
echo  ============================================
echo.
pause
exit /b 0

:err
echo.
echo  [X] 发布失败，请检查上方报错信息
pause
exit /b 1
