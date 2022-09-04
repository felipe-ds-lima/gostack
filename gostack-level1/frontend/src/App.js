import React, { useState, useEffect } from 'react'
import Header from './components/Header'
import './App.css'
import api from './services/api'

function App() {
  const [projects, setProjects] = useState([]);

  async function handleAddProject() {

    const {data} = await api.post('projects', {
      title: `Novo projeto ${Date.now()}`,
      owner: 'Felipe Lima'
    })

    setProjects([...projects, data]);
  }

  useEffect(()=>{
    api.get('projects').then(({data}) => {
      setProjects(data)
    })
  }, [])

  return (
    <>
      <Header title="Homepage" />

      <ul>
        {projects.map(project => (
          <li key={project.id}>{project.title}</li>
        ))}
      </ul>

      <button type="button" onClick={handleAddProject}>Adicionar projeto</button>
    </>
  )
}

export default App