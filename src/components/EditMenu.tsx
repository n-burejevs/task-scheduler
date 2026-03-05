import React from "react";
import { MdClear } from "react-icons/md";
import type { Task } from '../model';

//get object which i need to eddit and put it as default values for form elements!
//alse check what he has to say next: https://youtu.be/FJDVKeh7RJI?t=1686


interface Props{
    /*id:number,*/
    pendingTasks: Task[],
    task: Task,
    setPendingTasks: React.Dispatch<React.SetStateAction<Task[]>>,
    //setEditMode: React.Dispatch<React.SetStateAction<boolean>>
    setOpenDetails: React.Dispatch<React.SetStateAction<boolean>>
    openDetails: boolean;
}

export default function EditMenu({/*id,*/ task, pendingTasks,  setPendingTasks, setOpenDetails, openDetails}: Props )
{

      const inputRef = React.useRef<HTMLTextAreaElement>(null) 
  
      React.useEffect(()=>{
          inputRef.current?.focus();
      },[openDetails])

   // const [edit, setEdit] = React.useState<Task>();

  /*React.useEffect(()=>{
    

  }, [])*/


    /*function editTask(e: React.FormEvent)
    {   
        e.preventDefault();
        

    }*/

    function appendTask(value:string)
    {
      console.log(value);
     //  if (!value) value = "";
      //task.desc = value;
     
      let activeTasks = [...pendingTasks];

      for(let i=0; i<activeTasks.length; i++)
      {
        if(activeTasks[i].id === task.id)
        {
          activeTasks[i].desc = value;
        }
      }

    /* let activeTasks =  pendingTasks.map(updatedTask =>{
        updatedTask.id == task.id ? updatedTask.desc = value : updatedTask
      })*/
     
    setPendingTasks(activeTasks);

    }
    
    /*
    function closeMenu()
    {
        setEditMode(false);
    }*/
    const [name, setName] = React.useState<string>(task.name);
    const [date, setDate] = React.useState<string | number>(task.dueDate);

         /* function handleEdit(e:React.FormEvent, id:number)
          {
            e.preventDefault();
            console.log(e);

   
          }*/

          function handleSubmit(e:React.FormEvent, id:number)
          {
            e.preventDefault();

         setPendingTasks(pendingTasks.map( (todo)=> (
                todo.id === id?{...todo, name: name, dueDate: date} : todo
            )))
          }

    return(
     <div className="edit-menu-container">
      <form className="task-details" onSubmit={(e)=>handleSubmit(e, task.id)}>

       <input type="text" value={name} onChange={(e)=>setName(e.target.value)}></input>
          <input type="date" value={date} onChange={(e)=>setDate(e.target.value)}></input>
          <button className="save-btn">Save</button>
          
      </form>

         <MdClear onClick={()=>setOpenDetails(false)} className='cancel-search-btn' id='closeEdit-btn'/>
          <label>Task description</label>
          <textarea className="desc-field" name="Text1" cols={40} rows={5} value= {task.desc} ref={inputRef}
            onChange={(event)=>appendTask(event.target.value)}
          > </textarea>
 
    </div>
    )
}