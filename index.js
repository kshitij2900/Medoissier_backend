const connectToMongo=require('./utils/database')
const express = require('express');
const patientRoutes=require("./routes/patient")
const doctorRoutes=require("./routes/doctor")
const dossierdetails=require('./routes/dossier')
var cors = require('cors')
const http = require('http');const multer = require("multer");
const {
  GridFsStorage
} = require("multer-gridfs-storage");

connectToMongo();

const app = express();
const port = 3001 ;
const server= http.createServer(app);
server.listen(port,()=>{console.log('server setup working '+port)});


app.use(cors())
app.use(express.json())
require('dotenv').config();


app.get('/', (req, res) => {
    res.send('Server is up and running....')
})

//authentication 
app.use("/api/v1/patientauth",patientRoutes);
app.use("/api/v1/doctorauth",doctorRoutes);

//patientDetails
app.use("/api/v1/pdetails",patientRoutes);
app.use("/api/v1/ddetails",doctorRoutes);

//dossiers
app.use("/api/v1/pdossiers",dossierdetails);
app.use("/api/v1/ddossiers",dossierdetails);

//otp
// app.use("/api/v1/ddossiers",dossierdetails);



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

// create dossier (pdf,image,)->

