import React from "react";
import { MdDone } from "react-icons/md";
import { MdDeleteForever } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import { MdOutlineSave } from "react-icons/md";
//import EditMenu from './EditMenu';
//import { MdEventRepeat } from "react-icons/md";
import type { Task } from '../model';
import EditMenu from "./EditMenu";
//import { Draggable } from "react-beautiful-dnd";


interface Props{
    task: Task
    completedTasks: Task[]
    setCompletedTasks: React.Dispatch<React.SetStateAction<Task[]>>
    pendingTasks: Task[]
    deleteTask: (id:number) => void
    setPendingTasks: React.Dispatch<React.SetStateAction<Task[]>>
    
   /* mEdit: any*/ //thats the icon you can pass
    /*taskType: string*/
}

export default function SingleTodo({task, completedTasks, setCompletedTasks, 
    pendingTasks, deleteTask, setPendingTasks}: Props)
{
  const [editMode, setEditMode] = React.useState<boolean>(false);
  const [editTodo, setEditTodo] = React.useState<string>(task.name);

  const [openDetails, setOpenDetails] =  React.useState<boolean>(false);

  function markComplete(item:Task)
  {
        setCompletedTasks(completedTasks.concat(pendingTasks.filter(task => item.id === task.id)))
        deleteTask(item.id);
  }

  function handleEdit(e:React.FormEvent, id:number)
  {
    e.preventDefault();

    setPendingTasks(pendingTasks.map( (todo)=> (
        todo.id === id?{...todo, name: editTodo} : todo
    )))

    setEditMode(false);
  }

  function handleOpenDetails()
  {
    setOpenDetails(prevState => !prevState);
  }

    const inputRef = React.useRef<HTMLInputElement>(null) 

    React.useEffect(()=>{
        inputRef.current?.focus();
    },[editMode])

   // const [state, dispatch] = React.useReducer(TodoReducer, [""])

    return(
        <>
                <form key={task.id} className='active-tasks-row' onSubmit={(e)=>handleEdit(e, task.id )}>
            
        {
            editMode? (/*<div className="container-for-container">*/<div className="edit-input-container"><input type="text" value={editTodo} ref={inputRef}
                        onChange={(event)=>setEditTodo(event.target.value)} className="todo-single-text"/>
                        
                        </div>/*</div>*/) 
            :
             ( <span className='task-name' onClick={handleOpenDetails}> {task.name}</span>
               
              )
        }
       
                 
                 
                    <div className='icons-block'> 
                        <span className="date-text"> {task.dueDate} </span>
                        <div className="span-tooltip-container">
                            <span> <MdDone className='completed-btn' onClick={()=>markComplete(task)}/> </span>
                            <label>Complete</label>
                        </div>

                    <div className="span-tooltip-container">
                        <span> <MdDeleteForever onClick={()=>deleteTask(task.id)} className='delete-button'/> </span>
                        <label>Delete</label>
                    </div>
                   { /* <div className="span-tooltip-container">
                        <span> {task.toRepeat ? <MdEventRepeat /> : ""} </span>
                        <label>Repeating task</label>
                     </div>*/}
                  


                { !editMode ?  <div className="span-tooltip-container">  <span>
                   
                 <MdEdit className='edit-button' onClick={()=> 
                {    setEditMode(!editMode);
                    
                    
                    /*if(!editMode && !task.isCompleted) 
                        {
                            setEditMode(!editMode)
                        }*/
                }
                   }/> </span> 
                    <label>Edit</label>
                   </div>
                   
                  : 
                    <div className="span-tooltip-container">
                    <span>
                        <button type='submit' className="save-edit-btn"><MdOutlineSave/></button>
                        </span>
                            <label>Save</label>
                    </div>}
                         
                           
                   </div>
                   
        
                  </form>
                   {openDetails && (<EditMenu id={task.id} task={task} setOpenDetails={setOpenDetails} 
                                           pendingTasks={pendingTasks} setPendingTasks={setPendingTasks}/>)}
        </>
    )
}
/*      */