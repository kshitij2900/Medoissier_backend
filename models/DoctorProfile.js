const mongoose=require('mongoose');
const {Schema}=mongoose;
const DoctorSchema = new Schema({
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
    imr_number:{
        type: String,
        require: true,
        unique: true        
    },
    date:{
        type: Date,
        default: Date.now
    },
    });
    const Doctor=mongoose.model('Doctor',DoctorSchema);
    module.exports= Doctor