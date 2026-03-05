/**
 * //somewhat inspired by: https://github.com/piyush-eon/react-typescript-taskify/blob/react-typescript-tutorial/src/components/SingleTodo.tsx
 * https://www.youtube.com/watch?v=FJDVKeh7RJI
 * To do:
 * double click event does not open the task menu?
  1* when task is adder, start a timer, to track the time it took to complete a task
  2* new idea no need for timer -> Date.now - Date when it was added! -> mark red if deadline was missed?
  5* SingleTodo is not a reusable component, only used for pendingTasks state...
  */

import './App.css'
import React from 'react';
//import { MdDoneAll } from "react-icons/md";
//import { MdDone } from "react-icons/md";

import { MdClear } from "react-icons/md";

//import { MdEdit } from "react-icons/md";
/*import EditMenu from './components/EditMenu';
import { MdEventRepeat } from "react-icons/md";
*/

import SingleTodo from './components/SingleTodo';
import type { Task } from './model';
//import { mergeSort } from './mergeSort';
//import {DragDropContext, } from 'react-beautiful-dnd'; 
import SingleCompleted from './components/SingleCompleted';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import type {DropResult} from '@hello-pangea/dnd';

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

    if(!formElements.task.value) {
      setTitlePlaceHolder("You forgot to type a title!")
    }
    else{
 // let repeat = formElements.repeat.checked ? true : false;
    
    let task = {
      id: Date.now(),
      name: formElements.task.value,
       dueDate: formatDate(formElements.duedate.value), 
      // toRepeat: repeat,
       isCompleted: false };


       //update temp state, sort it and update the state with set funcion
       //need to make sure a new array is created, otherwise react wont update the state
       let tasksTemp:Array<Task> = [...pendingTasks];
      

       //sort the list? Do i need it?
       //mergeSort(tasks, 0, tasks.length-1);
      //does not update the list, need to [...],
      //setPendingTasks(tasks);

    tasksTemp = putTaskInOrder(task.dueDate, task, tasksTemp);

    setPendingTasks(tasksTemp);     

   //clear the task title/name field, other fields will remain
   //because, maybe you want to add more task on the same date?
   setTaskName("");
   setTitlePlaceHolder("enter a new task");
      
    }
    
  
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



  const [searchFor, setSearchFor] = React.useState<string>("")
  const [searchResult, setSearchResult] = React.useState<Task[]>([])

  const [titlePlaceholder, setTitlePlaceHolder] = React.useState<string>("enter a new task")

  function searchInCompletedTasks()
  {
    if(searchFor.length>2){
     //  setSearchResult(completedTasks.filter(task => !task.name.search(searchFor)))
     setSearchResult(completedTasks.filter((task) => task.name.includes(searchFor)))
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
   // if(showCompleted){
    //}

    setState(prevState => !prevState)
  }
  //cant just leave a blank page
  React.useEffect(()=>{
    if(!showActive && !showCompleted){
      setShowActive(true);
    }

  },[showActive, showCompleted])



  const onDragEnd = (result: DropResult) => {
  const { source, destination } = result;

  // If dropped outside the list or in the same spot
  if (!destination || destination.index === source.index) return;

  const items = [...pendingTasks];
  const [reorderedItem] = items.splice(source.index, 1);
  items.splice(destination.index, 0, reorderedItem);

  setPendingTasks(items);
};

const onDragEndTasksDone = (result: DropResult) => {
  const { source, destination } = result;

  // If dropped outside the list or in the same spot
  if (!destination || destination.index === source.index) return;

  const items = [...completedTasks];
  const [reorderedItem] = items.splice(source.index, 1);
  items.splice(destination.index, 0, reorderedItem);

  setCompletedTasks(items);
}

  return (
    <> 
  <div className='main-content'>
    
    <div className='navbar'>
      <button className='show-hide-btn' onClick={()=>handleChange(setShowActive)}>{showActive ? "Hide " : "Show "}Active</button>
      <p>Task scheduler</p>
      <button className='show-hide-btn' onClick={()=>handleChange(setShowCompleted)}>{showCompleted ? "Hide " : "Show "}Completed</button></div>
    
    <button className='mobile-show-hide-btn' onClick={()=>handleChange(setShowActive)}>{showActive ? "Hide " : "Show "}Active</button>
    { showActive &&
    <div className='active-tasks'>
                        
     <form onSubmit={addTask} className='new-task-form'>


      <label className='form-labels'>Task title</label>
      <input type="text" id="task" placeholder={titlePlaceholder} name="task" value={taskName} onChange={(e)=>setTaskName(e.target.value)}/>
        <label className='form-labels'>Date</label>
        <input type="date" id="duedate" name="duedate"></input>
        <div>
          { /*<label className='form-labels'>Repeats every month?</label>
             <input type="checkbox" id="repeat" name="repeat-task" value="checked" ></input>*/}
        </div>
        <button type="submit" className='add-task-button'>Add</button>
      </form>
     

     <div className='active-task-list'>
      <div className='top-section'><span className='titles'>Name</span><span className='date-section'>Date</span></div>

      {/*pendingTasks.map((task) => (
        <SingleTodo key={task.id} task={task} completedTasks={completedTasks} setCompletedTasks={setCompletedTasks} 
                    pendingTasks={pendingTasks} deleteTask={deleteTask} setPendingTasks={setPendingTasks}
                   
                   />
       )) */}

<DragDropContext onDragEnd={onDragEnd}>
    <Droppable droppableId="tasks-list">
      {(provided) => (
        <div {...provided.droppableProps} ref={provided.innerRef}>
          
          {pendingTasks.map((task, index) => (
            <SingleTodo 
              key={task.id}
              index={index} // MUST pass index
              task={task} completedTasks={completedTasks} setCompletedTasks={setCompletedTasks} 
                    pendingTasks={pendingTasks} deleteTask={deleteTask} setPendingTasks={setPendingTasks}
            />
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  </DragDropContext>



     </div>
    </div> }
<button className='mobile-show-hide-btn' onClick={()=>handleChange(setShowCompleted)}>{showCompleted ? "Hide " : "Show "}Completed</button>
{ showCompleted &&
    <div className='completed-tasks'>
      
     <div className='completed-task-form'>
       <label className='form-labels'>Search by Task title</label>
      <div className='search-field-container'> 
        { searchFor && <MdClear onClick={closeSearch} className='cancel-search-btn'/>}
      <input type="text" name="task" value={searchFor} onChange={(e)=>setSearchFor(e.target.value)}
        className='search-input' />
       
       </div>
        {/*<button>Search</button>*/}
      </div>
     
    {/*<SingleCompleted searchResult={searchResult} setCompletedTasks={setCompletedTasks} completedTasks={completedTasks}/>*/}

  <DragDropContext onDragEnd={onDragEndTasksDone}>
    <Droppable droppableId="tasks-list">
      {(provided) => (
        <div {...provided.droppableProps} ref={provided.innerRef}>
         <div className='completed-task-list' >
           <div className='top-section'><span className='titles'>Name</span><span className='completed-date-section'>Date</span></div>
          { //print results, which are filtered from original list, or print the whole original list(completed tasks)
           searchResult.length>0 ? 
           
            searchResult.map((task, index) => (<SingleCompleted task={task} key={task.id} index={index} 
            setCompletedTasks={setCompletedTasks} completedTasks={completedTasks}/>))
            :
             completedTasks.map((task, index) => (<SingleCompleted task={task} key={task.id} index={index} 
              setCompletedTasks={setCompletedTasks} completedTasks={completedTasks}/>))
          }
          {provided.placeholder}
        </div>
        </div>

      )}
    </Droppable>
  </DragDropContext>

      
    </div> }
    
  </div>

     
    </>
  )
}

export default App