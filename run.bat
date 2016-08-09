@echo *****************************************************************************************************************************************
@echo Wellcom to PockaDailyAds.
@echo Requirements:
@echo      1. mongoDB
@echo      2. NodeJS
@echo      3. Google Chrome
@echo
@echo - All executables are in directories defined in %PATH%.
@echo - Path to Running Dir must not include hebrew letters.
@echo
@echo running on port 8080
@echo *****************************************************************************************************************************************
@echo
@echo Initializing mongod process
@echo
start cmd /k mongod --dbpath server/data --logpath server/log/db.elg
ping -n 6 127.0.0.1 >nul

@echo ... 25%
@echo
@echo Injecting data.json file to mongoDB using mongoimport process
@echo
mongoimport --db ads --collection messages --file server/messages.json --jsonArray
mongoimport --db ads --collection admins --file server/admins.json
ping -n 6 127.0.0.1 >nul

@echo ... 50%
@echo
@echo Initializing nodeJS server/main.js
@echo 
start cmd /K node server/main.js
ping -n 6 127.0.0.1 >nul

@echo ... 75%
@echo
@echo Running chrome with screen parameter equals to 1,2,3
@echo 
start chrome http://localhost:8080/screen=1
start chrome http://localhost:8080/screen=2
start chrome http://localhost:8080/screen=3
start chrome http://localhost:8080/admin

@echo ... 100%
@echo