import React, { ButtonHTMLAttributes } from 'react';

import { Container } from './styles';

interface OwnProps {
  loading?: boolean;
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & OwnProps;

const Button: React.FC<ButtonProps> = ({ children, loading, ...rest }) => (
  <Container type="button" {...rest}>
    {loading ? 'Carregando...' : children}
  </Container>
);

export default Button;
