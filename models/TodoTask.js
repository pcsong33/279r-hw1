// Use mongoose library to connect MongoDB in express.js
const mongoose = require('mongoose');

// Organize schema of to-do tasks in MongoDB database
const todoTaskSchema = new mongoose.Schema({
    content: {
        type: String,required: true
    },
    date: {
        type: Date,default: Date.now
    }
})

module.exports = mongoose.model('TodoTask',todoTaskSchema);