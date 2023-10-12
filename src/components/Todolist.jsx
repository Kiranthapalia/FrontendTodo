import React, { useState, useRef } from "react";
import { AgGridReact } from 'ag-grid-react'; // the AG Grid React Component
import 'ag-grid-community/styles/ag-theme-alpine.css'; // Import the Alpine theme CSS for row animation
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers';


import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-material.css'; // Optional theme CSS

function Todolist(){
const [todo, setTodo] = React.useState({description: '', date: '', priority: ''});
const [todos, setTodos] = useState([]);

const gridRef = useRef();
const [columnDefs] = useState([
    { field: 'description', sortable: true, filter: true, floatingFilter : true },
    {
      field: 'priority',
      sortable: true,
      filter: true,
      floatingFilter : true,
      cellStyle: params =>
        params.value === 'High' || params.value === 'high'  ? { color: 'red' } : { color: 'black' },
    }, 
    { field: 'date', sortable: true, filter: true, floatingFilter : true, valueFormatter: (params) => {
      return new Date(params.value).toLocaleDateString();}},
  ]);
  
  const gridOptions = {
    animateRows: true, // Enable row animation
    getRowNodeId: data => data.id, // Provide a unique key for each row
  };
  

  const handleClick = () => {
    if (todo.description.trim() === '' && todo.priority.trim() === '' && todo.date.trim() === '') {
        alert('Please fill in at least one field.');
        return; // Prevent adding a blank todo
      }

    const newTodo = { ...todo, id: Date.now() }; // Assign a unique id using Date.now()
    setTodos([...todos, newTodo]);
    setTodo({ description: '', date: '', priority: '' });
  };
  

  const handleDelete = () => {
    const selectedNodes = gridRef.current.getSelectedNodes();
    if (selectedNodes.length > 0) {
      const selectedId = selectedNodes[0].data.id;
      setTodos(todos.filter(todo => todo.id !== selectedId));
    } else {
      alert('Please select a row first.');
    }
  };

  const handleDateChange = (date) => {
    setTodo({ ...todo, date: date.toISOString() });
  };
  
 
  

    return(
        // instead of <React.fragment> we can use <>.
        <>
      
        <Stack direction="row" spacing={2} justifyContent="center" alignItems="center">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            value={todo.date}
            onChange={handleDateChange}
            renderInput={(params) => (
              <TextField {...params} label="Date" variant="standard" />
            )}format="YYYY/MM/DD"
          />
        </LocalizationProvider>
        <TextField
            label='Description'
            variant='standard'
            value = {todo.description}
            onChange={e => setTodo({...todo, description: e.target.value})}
        />
        <TextField
            label='Priority'
            variant='standard'
            value = {todo.priority}
            onChange={e => setTodo({...todo, priority: e.target.value})}
        />
        <Button variant="contained" onClick={handleClick}>Add Todo</Button>
        <Button variant="contained" color="error" onClick={handleDelete}>Delete</Button>
        </Stack>
        <Stack alignItems="center" justifyContent="center">
       <div className="ag-theme-material" style={{width:'50%', height:800, margin: 'auto'}}>
       <AgGridReact
            ref={gridRef}
            onGridReady={params => (gridRef.current = params.api)}
            rowSelection='single'
            rowData={todos}
            columnDefs={columnDefs}
            gridOptions={gridOptions} // Include the gridOptions here
        />

       </div>
       </Stack>
        </>
    );
}

export default Todolist;