// import React from "react";


// function Project({project}) {
//     const formattedDate = new Date(project.created_at).toLocaleDateString("en-US")
    

//     return (
//         <div className="note-container">
//             <p className="note-title">{project.title}</p>
//             <p className="note-date">{formattedDate}</p>
//         </div>
//     );
// }

// export default Project



import React from "react";
import { Link } from "react-router-dom";
import "../styles/Project.css" // Import the CSS file

function Project({ project }) {
  const formattedDate = new Date(project.created_at).toLocaleDateString("en-US");

  return (
    <Link to={`/projects/${project.id}`} className="note-container">
      <p className="note-title">{project.title}</p>
      <p className="note-date">Created: {formattedDate}</p>
      <p className="note-stats">
        Todos Completed: {project.todos_stats?.completed || 0} / {project.todos_stats?.total || 0}
      </p>
    </Link>
  );
}

export default Project;

