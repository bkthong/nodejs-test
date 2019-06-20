/* ========================= Connection to mongo db stuff ===========================   */

const mongo = require('mongodb')
//const mongourl = "mongodb://user:password@ds125892.mlab.com:25892/bkdb"
const mongourl = "mongodb://" + process.env.MONGODB_USERNAME + ":" + process.env.MONGODB_PASSWORD + "@" + process.env.MONGODB_HOST + ":" + process.env.MONGODB_PORT + "/" + process.env.MONGODB_DBNAME
const mongoclient = mongo.MongoClient

let db
mongoclient.connect(mongourl , { useNewUrlParser: true } , function(err, client) {
  if (!err) {
    console.log("connected to mongodb database") 
    db = client.db(process.env.MONGODB_DBNAME) ;
  }
  else {
    //TODO: unable to connect to database. Stop nodejs with error
    console.log("Unable to connect to mongodb")
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


/* 
 * Handle GET requests to list documents in the collection
 * Returns json string { "items" : [] }, where items is an array of documents
 *
 */
app.get('/api/notes', function (req,res) {
   //no paging support, no limits on the find
   const json = { "items" : [] } ;
   db.collection("mycollection").find({}).forEach( function(doc) {
        //this is the iterator function (as long as there are still documents)
        if (doc) {
          json.items.push(doc) ;
        }
      } , 
      
      function (error) {
        //this is the end-callback function , when there are no more documents
        //so we write the response output close the response object
        res.write(JSON.stringify(json))
        res.end()
      }
   )
}) ;

//handle post request to the url specified using a urlparser (created via body-parser) 
//now changed to use jsonParser. req.body is now the required json object
app.post('/api/notes/create', jsonParser , function (req,res) {
    //res.send('Data posted: <br/>Title: ' + req.body.title + "<br/>Details: " + req.body.details)
    /*
    let doc = {}
    doc.title = req.body.title 
    doc.details = req.body.details
    */

    const doc = req.body  //because now using jsonParser. We expect client to submit json
    db.collection("mycollection").insertOne(doc , function( err, result ) {
      if (!err) {
        res.send("Insert successful") ;
      }
      else {
        res.send("Insert failed") ;
      }
    })

  })

//temp for handling my view/createnote.html for which uses x-www-form-urlencoded
app.post('/api/notes/createurlparser', urlParser , function (req,res) {
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

  })


/* 
 * Handle delete request given a json object of _ids to delete
 * As we are using jsonParser, req.body is the json object - { "items": ["id1","id2"] }
 */
app.post("/api/notes/delete", jsonParser, function( req, res ) {

   //TODO: security checks to see whether user is allowed to delete

   const items = req.body.items ;
   let id_array = [] ;

   //construct the array of object ids for use in the filter
   for ( var i=0 ; i <  items.length ; i++ ) {
      id_array.push(new mongo.ObjectId(items[i]))
   }

   const filter = { "_id": { "$in": id_array } }  //search for documents with _ids in the id_array of object ids
   console.log(filter)
   let result = db.collection("mycollection").deleteMany(filter, function( error, result) {
      if ( result.deletedCount > 0 ) {
          res.send("delete successful. Deleted count is: " + result.deletedCount)
       }
      else {
        res.send("delete failed")
      }
    }) 
})



//send html page with interface to submit new note which posts to the /api/notes/create api
app.get("/view/createnote", function(req,res) {
  res.sendFile(__dirname + "/view/createnote.html")

})


//send html page with ajax call to /api/notes to load the notes into the interface
app.get("/view/notes", function(req,res) {
  res.sendFile( __dirname + "/view/notes.html")

})

//send default page for / with links to /view/createnote and /view/notes
app.get("/", function(req,res) {
  res.sendFile( __dirname + "/view/default.html")

})
