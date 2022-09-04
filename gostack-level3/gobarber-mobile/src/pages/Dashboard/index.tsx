import React from 'react';

import { Button, Text } from 'react-native';
import { useAuth } from '../../hooks/auth';

import { Container } from './styles';

const Dashboard: React.FC = () => {
  const { signOut } = useAuth();

  return (
    <Container
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
    >
      <Text>Dashboard</Text>
      <Button title="Sair" onPress={signOut} />
    </Container>
  );
};

export default Dashboard;
