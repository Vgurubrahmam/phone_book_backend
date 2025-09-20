const express = require("express");
const cors = require("cors");
const app = express();
require('dotenv').config();
const mongoose = require("mongoose");

// const PhoneBook = require('./model/phonebook')
const PhoneBook = require('./model/book');
app.use(express.json());
app.use(cors());
const PORT = 8000;

const DB = process.env.MongoDB_URI
if (!process.env.MongoDB_URI) {
  console.error("MongoDB URI is not defined. Please set it in the .env file.");
}

mongoose.connect(DB).then(() => {
  console.log("Database connected..");
}).catch((err) => {
  console.error("Database connection failed:", err);
});

// Add logging to debug raw request body
app.post("/add-phone", async (req, res) => {
    console.log("Raw request body:");
    const details = req.body;
    console.log(details);
    const phoneNumber = new PhoneBook(req.body);
    try {
      await phoneNumber.save();
      res.status(201).json({
        status: "Success",
        data: {
          phoneNumber,
        },
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        status: "Failed",
        message: err,
      });
    }
  });


  app.get('/get-phone', async (req,res) => {
    console.log("first")
    const phoneNumbers = await PhoneBook.find({})
    try{
        res.status(200).json({
            status : 'Success',
            data : {
                phoneNumbers
            }
        })
    }catch(err){
        res.status(500).json({
            status: 'Failed',
            message : err
        })
    }
})


app.patch('/update-phone/:id', async (req,res) => {
  const updatedPhone = await PhoneBook.findByIdAndUpdate(req.params.id,req.body,{
      new : true,
      runValidators : true
    })
  try{
      res.status(200).json({
          status : 'Success',
          data : {
            updatedPhone
          }
        })
  }catch(err){
      console.log(err)
  }
})


app.delete('/delete-phone/:id', async(req,res) => {
  await PhoneBook.findByIdAndDelete(req.params.id)
  
  try{
    res.status(204).json({
        status : 'Success',
        data : {}
    })
  }catch(err){
      res.status(500).json({
          status: 'Failed',
          message : err
      })
  }
})

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    console.error('Invalid JSON:', err.message);
    return res.status(400).json({
      status: 'Failed',
      message: 'Invalid JSON payload',
    });
  }
  next();
});

app.listen(PORT, () => {
    console.log('Ready on http://localhost:' + PORT)
})