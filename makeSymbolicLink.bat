@echo OFF

set screepsDir=%localappdata%\Screeps\scripts\

echo This will delete all the scripts of the target directory. If not sure, press ctrl+c
echo .

echo Available folders are:
dir /B "%screepsDir%"

echo .
set /p folder="Enter the folder you want to link: "

rmdir /S /Q "%screepsDir%%folder%"
SET currentDir=%~dp0
mklink /D "%screepsDir%%folder%" "%currentDir%src"
