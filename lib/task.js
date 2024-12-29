import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  task: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

const Task = mongoose.models.Task || mongoose.model('Task', taskSchema);

export default Task;
