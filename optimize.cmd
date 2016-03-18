@echo off
set CURRENT_DIR=%~dp0
rem optipng -o7 -clobber -strip all "%CURRENT_DIR%!img\*.png" -dir %CURRENT_DIR%www\img\assets\
TruePNG -o4 "%CURRENT_DIR%!img\*.png" /dir %CURRENT_DIR%www\img\assets\
pause