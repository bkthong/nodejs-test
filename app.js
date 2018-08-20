const express = require('express')
const bodyParser = require('body-parser')

const app = express() ;

let port = 8080 ;

app.listen(port, () => {
  console.log('Server is up and listening on port '+ port) ;
  }
)


jsonParser = bodyParser.json() ;
urlParser = bodyParser.urlencoded({ extended: false }) ;

app.get('/api/notes', function (req,res) {
    res.send('List of notes here .. with paging support')
    //TODO: connect to mongodb collection and get a list of notes .. and need to provide paging support
  }

) ;

//handle post request to the url specified using a urlparser (created via body-parser) 
app.post('/api/notes/create', urlParser , function (req,res) {
    res.send('Data posted: <br/>Title: ' + req.body.title + "<br/>Details: " + req.body.details)
    //TODO: create a document in mongodb collection based on the data submitted
  }

) ;


