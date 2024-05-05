const mongoose = require('mongoose')
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

// const db=process.env.MONGODB_URI
const connectToMongo = async () => {
    try {
        mongoose.set('strictQuery', false)
        mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
        console.log('Mongo connected')
        let bucket;
        mongoose.connection.on("connected", () => {
            var db = mongoose.connections[0].db;
            bucket = new mongoose.mongo.GridFSBucket(db, {
                bucketName: "newBucket"
            });
            // console.log(bucket);
        });

        // console.log(process.env.MONGODB_URI)

    } catch (error) {
        console.log(error)
        process.exit()
    }
}

module.exports = connectToMongo;