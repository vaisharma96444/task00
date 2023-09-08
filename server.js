require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Task = require('./schema');

const app = express();
const port = process.env.PORT || 3000;
const mongodbUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/taskdb';



app.use(bodyParser.json());
mongoose.connect(mongodbUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});



//post request for task
app.post('/task', async (req, res) => {
  try {
    const { title, description, status } = req.body;
    const task = new Task({
         title:title,
          description:description,
         status:status });
    await task.save();
    res.status(200).send(task);
  } catch (error) {
    res.status(500).json({ error: 'Error creating a task' });
  }
});

// get to get all data 
app.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching tasks' });
  }
});

// Update the status of a task
app.put('/task/:id', async (req, res) => {
  try {
    const taskId = req.params.id;
    const { status } = req.body;
    const updatedTask = await Task.findByIdAndUpdate(taskId, { status }, { new: true });
    if (!updatedTask) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: 'Error updating the task status' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
