@echo off
set APP_HOME=%~dp0www
java -jar "%DROPBOX%\other\~cmd\yuicompressor.jar" --type css --charset utf-8 "%APP_HOME%\css\styles.css" -o "%APP_HOME%\css\styles-min.css"
java -jar "%DROPBOX%\other\~cmd\compiler.jar" --js "%APP_HOME%\js\avatar.js" --compilation_level SIMPLE_OPTIMIZATIONS > "%APP_HOME%\js\avatar-min.js"
pause