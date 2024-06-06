import React from 'react';
import Card from './Card';

function Column({ status, assignments, updateAssignmentStatus, deleteAssignment, database, setAssignments }) { 
  return (
    <div className="column">
      <h2>{status.charAt(0).toUpperCase() + status.slice(1)}</h2>
      {assignments.map(assignment => (
        <Card 
          key={assignment.id}
          assignment={assignment}
          updateAssignmentStatus={updateAssignmentStatus}
          deleteAssignment={deleteAssignment}
          database={database} 
          setAssignments={setAssignments} 
        />
      ))}
    </div>
  );
}

export default Column;
