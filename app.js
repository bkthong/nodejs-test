/* ========================= Connection to mongo db stuff ===========================   */

const mongo = require('mongodb')
//const mongourl = "mongodb://user:password@ds125892.mlab.com:25892/bkdb"
const mongourl = "mongodb://" + process.env.MONGODB_USERNAME + ":" + process.env.MONGODB_PASSWORD + "@" + process.env.MONGODB_HOST + ":" + process.env.MONGODB_PORT + "/" + process.env.MONGODB_DBNAME
var mongoclient = mongo.MongoClient

var db
mongoclient.connect(mongourl , { useNewUrlParser: true } , function(err, client) {
  if (!err) {
    console.log("connected to mongodb database") 
    db = client.db(process.env.MONGODB_DBNAME) ;
  }
  else {
    //TODO: unable to connect to database. Stop nodejs with error
  }
 }
)
/* ========================= END         to mongo db stuff ===========================   */

const express = require('express')
const bodyParser = require('body-parser')
const app = express() ;
const port = 8080 ;

app.listen(port, () => {
  console.log('Server is up and listening on port '+ port) ;
  }
)


jsonParser = bodyParser.json() ;
urlParser = bodyParser.urlencoded({ extended: false }) ;


//handle GET requests to list documents in the collection
app.get('/api/notes', function (req,res) {
   //no paging support
   db.collection("mycollection").find({}).forEach( function(doc) {
        //this is the iterator function (as long as there are still documents)
        if (doc) {
          res.write(JSON.stringify(doc))
        }
      } , 
      
      function (error) {
        //this is the end-callback function , when there are no more documents
        //so we close the response object
        res.end()
      }
   )
}) ;

//handle post request to the url specified using a urlparser (created via body-parser) 
app.post('/api/notes/create', urlParser , function (req,res) {
    //res.send('Data posted: <br/>Title: ' + req.body.title + "<br/>Details: " + req.body.details)

    let doc = {}
    doc.title = req.body.title 
    doc.details = req.body.details
    db.collection("mycollection").insertOne(doc , function( err, result ) {
      if (!err) {
        res.send("Insert successful") ;
      }
      else {
        res.send("Insert failed") ;
      }
    })

  }

) ;


