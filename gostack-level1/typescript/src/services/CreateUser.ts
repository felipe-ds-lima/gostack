interface TechObject {
  title: string;
  experience: number;
}

interface CreateUserData {
  name?: string;
  email: string;
  password: string;
  techs: Array<string | TechObject>;
}

export default function createUser({
  name = '',
  email,
  techs,
  password,
}: CreateUserData) {
  const user = {
    name,
    email,
    password,
    techs,
  };

  return user;
}
