
import React, { useEffect, useState } from 'react';
import Board from './components/Board'; 
import { database, ref, get, set, push, child } from './firebaseConfig'; 
import './style.css';


function App() {
  // state variables
  const [assignments, setAssignments] = useState([]); 
  const [newTask, setNewTask] = useState(""); 
  const [newCategory, setNewCategory] = useState("ux"); 
  const [assignedTo, setAssignedTo] = useState(""); 
  const [errorMessage, setErrorMessage] = useState("");
  const [isOnline, setIsOnline] = useState(navigator.onLine); 

  // effect hook to fetch the data 
  useEffect(() => {
    async function fetchData() {
      try {
        const databaseRef = ref(database); 
        const snapshot = await get(child(databaseRef, 'assignments')); 
        if (snapshot.exists()) { // checks so that the data exists
          const data = snapshot.val(); // getting data from the snapshot
          const fetchedAssignments = []; // array to store the assignment temporarily
          for (let key in data) {
            fetchedAssignments.push({ ...data[key], id: key }); 
          }
          setAssignments(fetchedAssignments); // updates state with the fetched assignments
        } else {
          console.log("No data available"); 
        }
      } catch (error) {
        setErrorMessage("Couldn't fetch data, try again later.");
      }
    }
    fetchData(); 
  }, []); // runs once after the initial render

  // effect hook to handle online/offline status for the error message
  useEffect(() => {
    function userIsOnline() {
      setIsOnline(true); // update state to online
    }

    function userIsOffline() {
      setIsOnline(false); // updates state to offline
    }

    window.addEventListener('online', userIsOnline); 
    window.addEventListener('offline', userIsOffline); 

    return () => {
      window.removeEventListener('online', userIsOnline); 
      window.removeEventListener('offline', userIsOffline); 
    };
  }, []); // same as before, runs once after the initial render

  // function to add a new task
  async function addTask(event) {
    event.preventDefault();
    if (newTask.trim() === "") {
      setErrorMessage("Task field needs to be filled");
      return;
    }
    if (!isOnline) {
      setErrorMessage("Network connection offline, reconnect or try again later");
      return;
    }
    try {
      const newAssignment = {
        assignment: newTask, 
        category: newCategory,
        status: "to do", 
        assigned: ""
      };
      const newAssignmentRef = push(ref(database, 'assignments')); // generates a new reference in firebase
      await set(newAssignmentRef, newAssignment);  // sets the new assignment data
      setAssignments([...assignments, { ...newAssignment, id: newAssignmentRef.key }]); // updates state with the new assignment
      setNewTask("");
      setErrorMessage("");
    } catch (error) {
      setErrorMessage("Couldn't add task, try again later.");
    }
  }

  return (
    <div className="App">
      <h1>Scrum Board</h1>
      <form onSubmit={addTask} className="taskForm">
        <input type="text" placeholder="Enter task" value={newTask} onChange={e => setNewTask(e.target.value)} />
        <select value={newCategory} onChange={e => setNewCategory(e.target.value)}>
          <option value="ux">UX</option>
          <option value="dev frontend">Dev Frontend</option>
          <option value="dev backend">Dev Backend</option>
        </select>
        <button type="submit">Add Task</button>
      </form>
      {errorMessage && <p className="errorMessage">{errorMessage}</p>}
      <Board assignments={assignments} setAssignments={setAssignments} database={database} />
    </div>
  );
}

export default App; 
