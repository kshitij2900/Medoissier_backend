const mongoose = require('mongoose')
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

// const db=process.env.MONGODB_URI
const connectToMongo = async () => {
    try {
        mongoose.set('strictQuery', false)
        mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
        console.log('Mongo connected')
        // console.log(process.env.MONGODB_URI)

    } catch(error) {
        console.log(error)
        process.exit()
    }
}

module.exports = connectToMongo;