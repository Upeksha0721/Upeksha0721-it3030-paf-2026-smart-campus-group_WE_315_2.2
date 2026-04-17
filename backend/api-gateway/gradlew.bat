@echo off
setlocal

set "SCRIPT_DIR=%~dp0"
set "PROJECT_DIR=%SCRIPT_DIR:~0,-1%"
set "WRAPPER_JAR=%PROJECT_DIR%\..\auth-service\gradle\wrapper\gradle-wrapper.jar"

if not defined JAVA_HOME (
  set "JAVA_EXE=java.exe"
) else (
  set "JAVA_EXE=%JAVA_HOME%\bin\java.exe"
)

"%JAVA_EXE%" -version >nul 2>&1
if errorlevel 1 (
  echo ERROR: JAVA_HOME is not set correctly or java.exe is unavailable.
  exit /b 1
)

"%JAVA_EXE%" -Dorg.gradle.appname=gradlew -jar "%WRAPPER_JAR%" -p "%PROJECT_DIR%" %*
exit /b %ERRORLEVEL%
