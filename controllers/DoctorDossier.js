const Dossier = require('../models/PatientData')
const jwt = require("jsonwebtoken");

exports.dossierdetail = async (req, res) => {
    try {
        const token = req.header('auth-token')
        const JWT_secret = process.env.JWT_SECRET;
        const data = jwt.verify(token, JWT_secret)
        let userId = data.patient._id;
        console.log(userId)
        const dossier = await Dossier.find({userId});
        // console.log(dossier);
        res.send(dossier);
    }
    catch (error) {
        console.error(error.message)
        res.status(500).send(" internal server error ");
    }
}