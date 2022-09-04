import { shade } from 'polished';
import styled from 'styled-components';

export const Container = styled.button`
  background-color: #ff9000;
  height: 56px;
  border-radius: 10px;
  padding: 0 16px;
  color: #312e38;
  border: 0;
  width: 100%;
  font-weight: 500;
  margin-top: 16px;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${shade(0.2, '#ff9000')};
  }
`;
