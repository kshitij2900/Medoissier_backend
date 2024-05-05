const mongoose=require('mongoose');
const {Schema}=mongoose;
const PatientSchema = new Schema({
    first_name:{
        type: String,
        require: true
    },
    last_name:{
        type: String,
        require: true
    },
    email:{
        type: String,
        require: true,
        unique: true      
    },
    password:{
        type: String,
        require: true
    },
    phone_number:{
        type: String,
        require: true,
        unique: true        

    },
    street:{
        type: String,
        require: true
    },
    city:{
        type: String,
        require: true
    },
    postal:{
        type: String,
        require: true
    },
    state:{
        type: String,
        require: true
    },
    country:{
        type: String,
        require: true
    },
    age:{
        type: String,
        require: true
    },
    sex:{
        type: String,
        require: true
    },
    blood_group:{
        type: String,
        require: true
    },
    date:{
        type: Date,
        default: Date.now
    },
    });
    const Patient=mongoose.model('Patient',PatientSchema);
    module.exports= Patient