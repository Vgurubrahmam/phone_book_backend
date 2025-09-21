const mongoose = require('mongoose')
const express = require('express');
const app = express();

app.use(express.json());

const PhoneBookSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    phone : {
        type : Number,
        required : true
    },

    email: {
        type : String,
        required : true
        },
    Dateofbirth:{
    type:String,
    required:true

}


})

const PhoneBook = mongoose.model('datas',PhoneBookSchema)

module.exports = PhoneBook

