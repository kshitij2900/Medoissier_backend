const express = require('express') ;
const app = express() ;
const port = 8000 ;

//set view template view as ejs
app.set('views' , 'views') ;


//use express router
app.use('/' , require('./routes/index')) ;


app.listen(port , function(err){
    if(err){
       
        console.log(`Error : ${err}`) ;
    }
    else{
        console.log(`Server is up at ${port}`) ;
    }
}) ;


