import { connectToDatabase } from '../../../../lib/mongodb';
import Task from '../../../../lib/task';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    await connectToDatabase(); 
    const tasks = await Task.find(); 
    return NextResponse.json(tasks); 
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectToDatabase(); 
    const { task } = await request.json(); 
    if (!task) {
      return NextResponse.json({ message: 'Task is required' }, { status: 400 });
    }
    const newTask = new Task({ task });
    await newTask.save(); 
    return NextResponse.json(newTask, { status: 201 }); 
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}


export async function DELETE(request) {
    try {
      await connectToDatabase(); 
      const id = request.nextUrl.searchParams.get('id'); 
  
      if (!id) {
        return NextResponse.json({ message: 'Task ID is required' }, { status: 400 });
      }
      await Task.findByIdAndDelete(id);
      return NextResponse.json({ message: 'Task deleted successfully' });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
  }
  

  export async function PUT(request) {
    try {
      await connectToDatabase(); 
      const id = request.nextUrl.searchParams.get('id');
      const { task, completed } = await request.json();
  
      if (!id || !task) {
        return NextResponse.json({ message: 'Task ID and task content are required' }, { status: 400 });
      }
      const updatedTask = await Task.findByIdAndUpdate(
        id,
        { task, completed },
        { new: true }
      );
  
      if (!updatedTask) {
        return NextResponse.json({ message: 'Task not found' }, { status: 404 });
      }
  
      return NextResponse.json(updatedTask); 
    } catch (error) {
      console.error(error);
      return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
  }
