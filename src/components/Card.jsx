import React, { useState } from 'react';
import { ref, update } from 'firebase/database';

function Card(props) {
  const { assignment, updateAssignmentStatus, deleteAssignment, database, setAssignments } = props;
  const [assignedTo, setAssignedTo] = useState("");

  function handleAssign(event, id) {
    event.preventDefault();

    if (assignedTo.trim() === "") {
      return;
    }

    const assignmentRef = ref(database, `assignments/${id}`);

    update(assignmentRef, { assigned: assignedTo }).then(() => {
      setAssignments(function(prevAssignments) {
        return prevAssignments.map(function(item) {
          if (item.id === id) {
            return { ...item, assigned: assignedTo };
          }
          return item;
        });
      });

      setAssignedTo("");
    }).catch(function(error) {
      console.error("Error updating assignment:", error);
    });
  }

  return (
    <div className="card">
      <h3>{assignment.assignment}</h3>
      <p>Category: {assignment.category}</p>
      {assignment.assigned && <p>Assigned to: {assignment.assigned}</p>}
      {assignment.status === 'to do' && (
        <>
          <form onSubmit={function(e) { handleAssign(e, assignment.id); }}>
            <input
              type="text"
              placeholder="Assign to"
              value={assignedTo}
              onChange={function(e) { setAssignedTo(e.target.value); }}
            />
            <button type="submit">Assign</button>
          </form>
          <button onClick={function() { updateAssignmentStatus(assignment.id, 'in progress'); }}>
            Start
          </button>
        </>
      )}
      {assignment.status === 'in progress' && (
        <button onClick={function() { updateAssignmentStatus(assignment.id, 'done'); }}>
          Mark as Done
        </button>
      )}
      {assignment.status === 'done' && (
        <button onClick={function() { deleteAssignment(assignment.id); }}>
          Remove
        </button>
      )}
    </div>
  );
}

export default Card;
