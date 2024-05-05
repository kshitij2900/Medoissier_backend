const express=require('express');
const { dossierdetail, addDossier } = require('../controllers/PatientDossier');
const router= express.Router();


router.get('/alldossiers',dossierdetail)
router.post('/addDossier',addDossier)
module.exports=router