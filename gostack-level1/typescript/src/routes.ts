import { Request, Response } from 'express';
import createUser from './services/CreateUser';

export function helloWorld(request: Request, response: Response) {
  const user = createUser({
    name: 'Felipe',
    email: 'contato@felipedslima.com.br',
    password: '123123123',
    techs: [
      'Node.js',
      'ReactJs',
      'React Native',
      { title: 'JavaScript', experience: 100 },
    ],
  });

  return response.json({ message: 'Hello World', user });
}
