# nodejs-test
To test nodejs with mongodb
Environment variables for connecting to mongodb used in this app:
ANOTHER CHANGE!!
MONGODB_USERNAME 
MONGODB_PASSWORD
MONGODB_HOST
MONGODB_PORTMONGODB_DBNAME

Starting the app:

$ MONGODB_USERNAME=user1 MONGODB_PASSWORD=123 ENV_VAR=VALUE...  node app.js

I've currently set the application startup to be app.js

From browser:

http://xxxx/view/createnote
http://xxxx//view/notes

*The collection name is hardcoded at the moment. "mycollection"
