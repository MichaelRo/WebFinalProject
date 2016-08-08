@echo We are about to setup the enviornment so you could check this exercise.
@echo Please verify that all executables from mongoDB, NodeJS and Google Chrome are in direcories defined in your PATH enviornment variable.
@echo Also make sure that the path to the directory running this bat file doesn't contain hebrew letters nor spaces.
@echo Please notice that the server is running on port 8080
@echo --------------------------------------------------------------------------------------------------------------------------------------
@echo
@echo Starting mongod process 
@echo
start cmd /k mongod --dbpath server/data --logpath server/log/db.elg
ping -n 6 127.0.0.1 >nul

@echo
@echo Injecting data.json file to mongoDB using mongoimport process
@echo
mongoimport --db ads --collection msgs --file server/messages.json --jsonArray
mongoimport --db ads --collection admins --file server/admins.json
ping -n 6 127.0.0.1 >nul

@echo
@echo Starting nodeJS server/main.js
@echo 
start cmd /K node server/main.js
ping -n 6 127.0.0.1 >nul

@echo
@echo Running chrome with screen parameter equals to 1,2,3
@echo 
start chrome http://localhost:8080/screen=1
start chrome http://localhost:8080/screen=2
start chrome http://localhost:8080/screen=3
start chrome http://localhost:8080/admin