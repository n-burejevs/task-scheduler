export interface Task {
    id: number,
    name: string,
    dueDate: string | number,
    isCompleted: boolean,
    /*toRepeat: boolean*/
    desc?: string
  }
/*
      type Actions = 
       | {type: 'add'; payload: string}
       | {type: 'remove'; payload: number}
       | {type: 'done'; payload: number}


    function TodoReducer(state:Task[], action:Actions)
    {
        switch(action.type)
        {
            case "add":
              return [
                ...state,
                {id: Date.now(), todo: action.payload, isCompleted: false}
              ]
            case "remove":
              return state.filter((todo) => todo.id !== action.payload);
            case "done":
            return state.map( (todo) => todo.id !== action.payload ? {...todo, isDone: !todo.isCompleted})
            
        }

    }*/