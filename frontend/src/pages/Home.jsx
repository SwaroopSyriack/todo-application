// src/pages/Home.js
import { useState, useEffect } from "react";
import api from "../api";
import Project from "../components/Project";
import "../styles/Home.css";


function Home() {
    const [projects, setProjects] = useState([]);
    const [title, setTitle] = useState("");

    useEffect(() => {
        getProjects();
    }, []);

    const getProjects = () => {
        api
            .get("api/projects/")
            .then((res) => res.data)
            .then((data) => {
                setProjects(data);
                console.log(data);
            })
            .catch((err) => alert(err));
    };


    const createProject = (e) => {
        e.preventDefault();
        api
            .post("/api/projects/", {title})
            .then((res) => {
                if (res.status === 201) alert("Project created!");
                else alert("Failed to create project.");
                getProjects();
            })
            .catch((err) => alert(err));
    };

    return (
        <div className="container">
            <div>
                <h2>Projects</h2>
                {projects.map((project) => (
                    <Project project={project}  key={project.id} />
                ))}
            </div>
            <h2>Create a Project</h2>
            <form onSubmit={createProject}>
                <label htmlFor="title">Title:</label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    required
                    onChange={(e) => setTitle(e.target.value)}
                    value={title}
                />
                <input type="submit" value="Submit" />
            </form>
        </div>
    );
}

export default Home;
