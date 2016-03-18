@echo off
set APP_HOME=%~dp0www
rem appcfg.py rollback "%APP_HOME%"
appcfg.py -A avatar-generator update "%APP_HOME%\app.yaml"
pause