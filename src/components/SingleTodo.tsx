import React from "react";
import { MdDone } from "react-icons/md";
import { MdDeleteForever } from "react-icons/md";
import { MdEdit } from "react-icons/md";
//import { MdOutlineSave } from "react-icons/md";
//import EditMenu from './EditMenu';
//import { MdEventRepeat } from "react-icons/md";
import type { Task } from '../model';
import EditMenu from "./EditMenu";
//import { Draggable } from "react-beautiful-dnd";
import { Draggable } from "@hello-pangea/dnd";


interface Props{
    task: Task
    index: number
    completedTasks: Task[]
    setCompletedTasks: React.Dispatch<React.SetStateAction<Task[]>>
    pendingTasks: Task[]
    deleteTask: (id:number) => void
    setPendingTasks: React.Dispatch<React.SetStateAction<Task[]>>
}

export default function SingleTodo({task, index, completedTasks, setCompletedTasks, 
    pendingTasks, deleteTask, setPendingTasks}: Props)
{

  const [openDetails, setOpenDetails] =  React.useState<boolean>(false);

  function markComplete(item:Task)
  {
        setCompletedTasks(completedTasks.concat(pendingTasks.filter(task => item.id === task.id)))
        deleteTask(item.id);
  }


  function handleOpenDetails()
  {
    setOpenDetails(prevState => !prevState);
  }



   const listRef = React.createRef<HTMLFormElement>();

    /*React.useEffect(()=>{
        listRef.current?.addEventListener("dblclick", ()=> {setOpenDetails(prevState =>!prevState); console.log("click 1")})
        
         return () => {
             listRef.current?.removeEventListener("dblclick", ()=> {setOpenDetails(prevState =>!prevState); console.log("click 2")})
          }
      }, [])*/

    return(
           <Draggable draggableId={task.id.toString()} index={index}>
      {(provided) => (
        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
        
            {openDetails ? 
            
        (<EditMenu /*id={task.id}*/ task={task} setOpenDetails={setOpenDetails} 
                                           pendingTasks={pendingTasks} setPendingTasks={setPendingTasks}
                                           openDetails={openDetails}/>)
        :

        <form key={task.id} className='active-tasks-row' ref={listRef}>
            

       <span className='task-name' id="prevent-select"  onClick={handleOpenDetails}  > {task.name}</span>
                 
                 
                    <div className='icons-block'> 
       
                       { <span className="date-text" id="prevent-select"> {task.dueDate} </span>}
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
                  

                <div className="span-tooltip-container"> 
                 <span>  
                    <MdEdit className='edit-button' 
                    onClick={handleOpenDetails}/> 
                 </span> 
                    <label>Edit</label>
                   </div>
                         
                           
                </div>
                  </form>



     

        }    
                   {/*openDetails && (<EditMenu task={task} setOpenDetails={setOpenDetails} 
                                           pendingTasks={pendingTasks} setPendingTasks={setPendingTasks}
                                           openDetails={openDetails}/>)*/}
           </div>
      )}
    </Draggable>
    )
}
/*      */