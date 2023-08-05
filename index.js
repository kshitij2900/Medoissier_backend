const connectToMongo=require('./utils/database')
const express = require('express');
var cors = require('cors')
const http = require('http');

connectToMongo();

const app = express();
const port = 8000 ;
const server= http.createServer(app);
server.listen(port,()=>{console.log('server setup working '+port)});


app.use(cors())
app.use(express.json())
require('dotenv').config();

app.get('/', (req, res) => {
    res.send('Hello World!')
})
// app.use('/' , require('./routes/index')) ;
//set view template view as ejs
//use express router
// app.set('views' , 'views') ;
// app.listen(port , function(err){
//     if(err){
//         console.log(`Error : ${err}`) ;
//     }
//     else{
//         console.log(`Server is up at ${port}`) ;
//     }
// }) ;


