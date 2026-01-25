/**
 * //somewhat inspired by: https://github.com/piyush-eon/react-typescript-taskify/blob/react-typescript-tutorial/src/components/SingleTodo.tsx
 * https://www.youtube.com/watch?v=FJDVKeh7RJI
 * Done:
 *   3* label, tooltip saying task is repeating when hover on toRepeat icon?
 * 
 * 
 * 
  1* when task is adder, start a timer, to track the time it took to complete a task
  2* new idea no need for timer -> Date.now - Date when it was added! -> mark red if deadline was missed?
  4* Clicking on task name, opens a menu with task description and a form to edit date, other fields too
  5* SingleTodo is not a reusable component, only used for pendingTasks state...
  can i pass icons for a different type of list?
  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  6* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! after search-field-container was added, input field has wrong width...
  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  7* sort the list once the task is markedCompled, when its a reacuring/its repeating once a month? 
    (the date gets updated, but it stays in the same place). And what about ferbruary(28-29 days? and some months have 30 some 31 days...)
    task in december? -> update the year too....
    and we just cant ever send it to completed list???
  8* what about weekly tasks???
  9* pressing icons (complete, delete, repeated, edit) on mobile should have a menu pop up and ask to confirm the action?
  *10 check for editMode on date span element, if true -> render input field to edit the date?
  */

import './App.css'
import React from 'react';
//import { MdDoneAll } from "react-icons/md";
//import { MdDone } from "react-icons/md";
import { MdDeleteForever } from "react-icons/md";
import { MdClear } from "react-icons/md";

//import { MdEdit } from "react-icons/md";
/*import EditMenu from './components/EditMenu';
import { MdEventRepeat } from "react-icons/md";
*/

import SingleTodo from './components/SingleTodo';
import type { Task } from './model';
//import { mergeSort } from './mergeSort';
//import {DragDropContext, } from 'react-beautiful-dnd'; 


const App: React.FC = () => {

  function formatDate(date: string):string {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();
if(!d.valueOf()) {return ""}
    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}

  function parseForTs(name:string)
  {
    let savedItems = localStorage.getItem(name)
    if(savedItems !== null) return JSON.parse(savedItems)
      else return [];
  }

  //const [task, setTask] = React.useState<Task>();

  const [showActive, setShowActive] = React.useState<boolean>(true);
  const [showCompleted, setShowCompleted] = React.useState<boolean>(false);

  const [pendingTasks, setPendingTasks] = React.useState<Task[]>(localStorage.getItem("tasks") ? parseForTs("tasks") : []);
  const [completedTasks, setCompletedTasks] = React.useState<Task[]>(localStorage.getItem("completed") ? parseForTs("completed") : []);

  const [taskName, setTaskName] = React.useState<string>("");

  function addTask(e: React.FormEvent<HTMLFormElement>)
  {//https://www.epicreact.dev/how-to-type-a-react-form-on-submit-handler
    e.preventDefault()
    //should i use the taskName state?
    const form = e.currentTarget;

      const formElements = form.elements as typeof form.elements & {
      task: HTMLInputElement,
        duedate: HTMLInputElement,
       /* repeat: HTMLInputElement*/
    }
    let date = formatDate(formElements.duedate.value);
    
   // let repeat = formElements.repeat.checked ? true : false;
    
    let task = {
      id: Date.now(),
      name: formElements.task.value,
       dueDate: date, 
      // toRepeat: repeat,
       isCompleted: false };


       //update temp state, sort it and update the state with set funcion
       //need to make sure a new array is created, otherwise react wont update the state
       let tasksTemp:Array<Task> = [...pendingTasks];
      

       //sort the list? Do i need it?
       //mergeSort(tasks, 0, tasks.length-1);
      //does not update the list,
      //setPendingTasks(tasks);

    tasksTemp = putTaskInOrder(task.dueDate, task, tasksTemp);

    setPendingTasks(tasksTemp);     

   //clear the task title/name field, other fields will remain
   //because, maybe you want to add more task on the same date?
   setTaskName("");
  }
//pendingTask is supposed to be sorted asc, finding a place where to insert a new item, based on hronological order
    function putTaskInOrder(byDate :string, task:Task, tasks: Array<Task>): Array<Task>
    {

      let date = new Date(byDate).getTime();
      let instertIndex: number = 0;
      if (tasks.length === 0) return [task];
     
      for(let i=0; i<tasks.length; i++)
      {
         
        if(date >= new Date(tasks[i].dueDate).getTime())
        {
          ///console.log(byDate ,tasks[i].dueDate)
          instertIndex = i+1;
        }
        else break;
      }
     
      tasks.splice(instertIndex, 0, task)
      return tasks;
    }

   React.useEffect(()=>{
      localStorage.setItem("tasks", JSON.stringify(pendingTasks));
  }, [pendingTasks])

      React.useEffect(()=>{
      localStorage.setItem("completed", JSON.stringify(completedTasks));
  }, [completedTasks])


  function deleteTask(id:number)
  {
    setPendingTasks(pendingTasks.filter(task => task.id !== id))
  }

    function deleteTaskCompleted(id:number)
  {
     setCompletedTasks(completedTasks.filter(task => task.id !== id))
     console.log(id);
  }

  const [searchFor, setSearchFor] = React.useState<string>("")
  const [searchResult, setSearchResult] = React.useState<Task[]>([])

  function searchInCompletedTasks()
  {
    if(searchFor.length>2){
       setSearchResult(completedTasks.filter(task => !task.name.search(searchFor)))
    }
  }
     React.useEffect(()=>{

      if(searchFor=="") setSearchResult([]);
        // Set a timer to update the "real" search value after 300ms
  //const handler = setTimeout(() => {
else searchInCompletedTasks();
 // }, 300);
  // Clean up the timer if the user types again before 300ms is up
  //return () => {
  //  clearTimeout(handler);
 // };


  }, [searchFor])

  function closeSearch()
  {
    setSearchFor("");
    setSearchResult([]);
  }

  function handleChange(setState:React.Dispatch<React.SetStateAction<boolean>>)
  {
    setState(prevState => !prevState)
  }
  //cant just leave a blank page
  React.useEffect(()=>{
    if(!showActive && !showCompleted){
      setShowActive(true);
    }

  },[showActive, showCompleted])

  return (
    <> 
  <div className='main-content'>
    
    <div className='navbar'>
      <button className='show-hide-btn' onClick={()=>handleChange(setShowActive)}>{showActive ? "Hide " : "Show "}Active</button>
      <p>Task scheduler</p>
      <button className='show-hide-btn' onClick={()=>handleChange(setShowCompleted)}>{showCompleted ? "Hide " : "Show "}Completed</button></div>
    
    
    { showActive &&
    <div className='active-tasks'>
                        
     <form onSubmit={addTask} className='new-task-form'>
      <label className='form-labels'>Task title</label>
      <input type="text" id="task" placeholder="enter a new task" name="task" value={taskName} onChange={(e)=>setTaskName(e.target.value)}/>
        <label className='form-labels'>Date</label>
        <input type="date" id="duedate" name="duedate"></input>
        <div>
          { /*<label className='form-labels'>Repeats every month?</label>
             <input type="checkbox" id="repeat" name="repeat-task" value="checked" ></input>*/}
        </div>
        <button className='add-task-button'>Add</button>
      </form>
     

     <div className='active-task-list'>
      <div className='top-section'><span className='titles'>Name</span><span className='date-section'>Date</span></div>
      {pendingTasks.map((task) => (
        <SingleTodo key={task.id} task={task} completedTasks={completedTasks} setCompletedTasks={setCompletedTasks} 
                    pendingTasks={pendingTasks} deleteTask={deleteTask} setPendingTasks={setPendingTasks}
                   
                   /* taskType="pending"*//>
       )) }
     </div>
    </div> }

{ showCompleted &&
    <div className='completed-tasks'>

     <form className='completed-task-form'>
       <label className='form-labels'>Search by Task title</label>
      <div className='search-field-container'> 
        { searchFor && <MdClear onClick={closeSearch} className='cancel-search-btn'/>}
      <input type="text" name="task" value={searchFor} onChange={(e)=>setSearchFor(e.target.value)}
        className='search-input' />
       
       </div>
        {/*<button>Search</button>*/}
      </form>
     

     <div className='completed-task-list'>
       
       { //print results, which are filtered from original list, or print the whole original list(completed tasks)
       searchResult.length>0 ? 
       
        searchResult.map((task) => (

        <div key={task.id} className='completed-tasks-row'>
          <span className='task-name'> {task.name}</span> 
          <span className='date-text'> {task.dueDate} </span>
           <span> <MdDeleteForever onClick={()=>deleteTaskCompleted(task.id)} className='delete-button'/> </span>
          </div>

           )
        )
        :
         completedTasks.map((task) => (

        <div key={task.id} className='completed-tasks-row'>
          <span className='task-name'> {task.name}</span> 
          <span className='date-text'> {task.dueDate} </span>
           <span> <MdDeleteForever onClick={()=>deleteTaskCompleted(task.id)} className='delete-button'/> </span>
          </div>

           )
        )
      }
     
     </div> 

      
    </div> }
    
  </div>

     
    </>
  )
}

export default App