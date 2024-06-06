import React from 'react';
import Column from './Column';
import { ref, update, remove } from 'firebase/database';

function Board(props) { 
  const { assignments, setAssignments, database } = props;

  // defines the statuses for the scrumboard columns
  const statuses = ['to do', 'in progress', 'done'];

  // function to update the status of an assignment
  async function updateAssignmentStatus(id, status) {
    try {
      const assignmentRef = ref(database, `assignments/${id}`); // reference to the specific assignment in the database
      await update(assignmentRef, { status });
      setAssignments(function(currentAssignments) {
        return currentAssignments.map(function(assignment) {
          if (assignment.id === id) {
            return { ...assignment, status };
          }
          return assignment;
        });
      });
    } catch (error) {
      console.error("Error updating status:", error);
    }
  }

  // function to remove an assignment
  async function deleteAssignment(id) {
    try {
      const assignmentRef = ref(database, `assignments/${id}`);
      await remove(assignmentRef);
      setAssignments(function(currentAssignments) {
        return currentAssignments.filter(function(assignment) {
          return assignment.id !== id;
        });
      });
    } catch (error) {
      console.error("Error removing assignment:", error); 
    }
  }

  // mapping through statuses to create columns
  return (
    <div className="board">
      {statuses.map(function(status) {
        return (
          <Column
            key={status} // key for each column
            status={status}
            assignments={assignments.filter(function(assignment) {
              return assignment.status === status;
            })} // assignments filtered by status
            updateAssignmentStatus={updateAssignmentStatus}
            deleteAssignment={deleteAssignment}
            database={database} // passes the database info to each Column
            setAssignments={setAssignments} // same but passes setassignments down to Columns and Cards
          />
        );
      })}
    </div>
  );
}

export default Board;
