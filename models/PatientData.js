const mongoose=require('mongoose');
const {Schema}=mongoose;
const DossierSchema = new Schema({
    Patient:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Patient'
    },   
    doctor_name:{
        type: String,
        require: true
    },
    venue:{
        type: String,
        require: true
    },
    docuuid:{
        type: String,
        // require: true,
        // unique: true        
    },
    specialization:{
        type: String,
        require: true
    },
    prescription:{
        type: String,
        // require: true,
        // unique: true        
    },
    report:{
        type: String,
        // require: true,
        // unique: true        
    },
    scan:{
        type: String,
        // require: true,
        // unique: true        
    },
    date:{
        type: Date,
        default: Date.now
    },
    });
    const Dossier=mongoose.model('Dossier',DossierSchema);
    module.exports= Dossier