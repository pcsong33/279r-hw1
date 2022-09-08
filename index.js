// Require front-end framework Express and Mongoose to access MongoDB
const express = require("express");
const mongoose = require("mongoose");
const app = express();

// Require and configure dotenv for .env credentials information
const dotenv = require("dotenv");
dotenv.config();

// Use TodoTask model schema
const TodoTask = require("./models/TodoTask");
app.use("/static", express.static("public"));

app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, () => {
    console.log("Connected to db!");
    app.listen(6000, () => console.log("Server Up and running"));
});

// Set engine configuration
app.set("view engine", "ejs");

// GET Method
app.get("/", (req, res) => {
    TodoTask.find({}, (err, tasks) => {
        res.render("todo.ejs", { todoTasks: tasks });
    });
});


// POST Method
app.post('/',async (req, res) => {
    const todoTask = new TodoTask({
        content: req.body.content
    });
    try {
        await todoTask.save();
        res.redirect("/");
    } 
    catch (err) {
        res.redirect("/");
    }
});

// Handle updating for editing tasks
app
    .route("/edit/:id")
    .get((req, res) => {
        const id = req.params.id;
        TodoTask.find({}, (err, tasks) => {
            // Render the to-do list with the updated task
            res.render("todoEdit.ejs", { todoTasks: tasks, idTask: id });
        });
    })
    .post((req, res) => {
        const id = req.params.id;
        // Update MongoDB task with the new content
        TodoTask.findByIdAndUpdate(id, { content: req.body.content }, err => {
            if (err) return res.send(500, err);
            res.redirect("/");
        });
    });

// Handle Deletion of tasks
app.route("/remove/:id")
    .get((req, res) => {
        const id = req.params.id;
        TodoTask.findByIdAndRemove(id, err => {
            if (err) return res.send(500, err);
            res.redirect("/");
        });
    });
