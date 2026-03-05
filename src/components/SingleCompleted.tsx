   import React from "react";
   import type {Task} from "../model";
   import { MdDeleteForever } from "react-icons/md";
   import { Draggable } from "@hello-pangea/dnd";
import EditMenu from "./EditMenu";

       interface Props{
       /* searchResult:Task[],*/
        setCompletedTasks: React.Dispatch<React.SetStateAction<Task[]>>,
        completedTasks: Task[],
        task: Task,
        index: number
    }
   
  function SingleCompleted({/*searchResult,*/index, setCompletedTasks, completedTasks, task}:Props)
   {
    const [openDetails, setOpenDetails] =  React.useState<boolean>(false);

    function handleOpenDetails()
    {
      setOpenDetails(prevState => !prevState);
    }

    function deleteTaskCompleted(id:number)
      {
         setCompletedTasks(completedTasks.filter(task => task.id !== id))
         //console.log(id);
      }

    return(
        
   <>
       
        {/*<div key={task.id} className='completed-tasks-row'>
          <span className='task-name' onClick={handleOpenDetails}> {task.name}</span> 
          <span className='date-text'> {task.dueDate} </span>
           <span> <MdDeleteForever onClick={()=>deleteTaskCompleted(task.id)} className='delete-button'/> </span>
          </div>*/}

           <Draggable draggableId={task.id.toString()} index={index}>
              {(provided) => (
               <div key={task.id} ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>

                {openDetails ? 
                        (<EditMenu task={task} setOpenDetails={setOpenDetails} 
                          pendingTasks={completedTasks} setPendingTasks={setCompletedTasks}
                          openDetails={openDetails}/>)
                        : 
                  <div className='completed-tasks-row'>
                  <span className='task-name' onClick={handleOpenDetails}> {task.name}</span> 
                  <span className='date-text'> {task.dueDate} </span>

                  <div className="span-tooltip-container">
                    <span> <MdDeleteForever onClick={()=>deleteTaskCompleted(task.id)} className='delete-button'/> </span>
                    <label>Delete</label>
                  </div>
                  
                  </div>}

               </div>
               )}
           </Draggable>
      
     </> 
    )
   }
   export default React.memo(SingleCompleted)