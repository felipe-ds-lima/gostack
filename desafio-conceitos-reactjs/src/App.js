import React, { useEffect, useState } from 'react';
import api from './services/api';

import './styles.css';

function App() {
  const [repositories, setRepositories] = useState([])

  async function handleAddRepository() {
    const repository = {
      title: 'Teste ' + Date.now(),
      url: 'http://teste.test/ ' + Date.now(),
      techs: ['Teste 1', 'Teste 2'],
    }

    const {data} = await api.post('repositories', repository)

    setRepositories([...repositories, data])
  }

  async function handleRemoveRepository(id) {
    await api.delete('repositories/' + id)

    setRepositories(repositories.filter(repository => repository.id !== id))
  }

  useEffect(() => {
    api.get('repositories').then(({data})=>{
      setRepositories(data)
    })
  }, []);

  return (
    <div>
      <ul data-testid="repository-list">
        {repositories.map(repository => (
          <li key={repository.id}>
            {repository.title}
            <button onClick={() => handleRemoveRepository(repository.id)}>Remover</button>
          </li>
        ))}
      </ul>

      <button onClick={handleAddRepository}>Adicionar</button>
    </div>
  );
}

export default App;
