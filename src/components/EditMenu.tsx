import React from "react";
import { MdClear, MdClose } from "react-icons/md";
import type { Task } from '../model';

//get object which i need to eddit and put it as default values for form elements!
//alse check what he has to say next: https://youtu.be/FJDVKeh7RJI?t=1686


interface Props{
    id:number,
    pendingTasks: Task[],
    task: Task,
    setPendingTasks: React.Dispatch<React.SetStateAction<Task[]>>,
    //setEditMode: React.Dispatch<React.SetStateAction<boolean>>
    setOpenDetails: React.Dispatch<React.SetStateAction<boolean>>
}

export default function EditMenu({id, task, pendingTasks,  setPendingTasks, setOpenDetails}: Props )
{

   // const [edit, setEdit] = React.useState<Task>();

 /* React.useEffect(()=>{

    setEdit(pendingTasks.find((task:Task) => task.id === id))

  }, [id])*/


    function editTask(e: React.FormEvent)
    {   
        e.preventDefault();
        

    }

    function appendTask(value:string)
    {
      //task.desc = value;
     // setPendingTasks(pendingTasks.map(updatedTask =>{
      //  updatedTask === task.id ? updatedTask.desc = value : updatedTask
     // }))
    }
    
    /*
    function closeMenu()
    {
        setEditMode(false);
    }*/
    return(
     <div className="edit-menu-container">
      <div className="task-details">
       <span>{task.name}</span>
          <span>{task.dueDate}</span>
      </div>

         <MdClear onClick={()=>setOpenDetails(false)} className='cancel-search-btn' id='closeEdit-btn'/>

          <textarea className="desc-field" name="Text1" cols={40} rows={5} value= {task.desc} 
            onChange={(event)=>appendTask(event.target.value)}
          > </textarea>
 
    </div>
    )
}