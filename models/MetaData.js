const mongoose = require("mongoose");

const metaDataSchema = new mongoose.Schema({
    url:{
        type:String,
        required:true,
    },
    title:{
        type:String,
    },
    description:{
        type:String,
    },
    keywords:{
        type:String,
    },
    createdAt:{
        type:Date,
        default:Date.now(),
    }
})

module.exports = mongoose.model("Metadata",metaDataSchema);