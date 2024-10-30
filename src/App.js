import React from 'react';
import { VerseDisplay } from './components/VerseDisplay';
import { Controls } from './components/Controls';
import { History } from './components/History';
import { Toast } from './components/Toast';
import styled from 'styled-components';

const AppContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
  background-color: #f0f0f0;
`;

const ContentContainer = styled.div`
  text-align: center;
  background-color: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
  max-width: 600px;
  width: 100%;
  min-height: 90vh;
  display: flex;
  flex-direction: column;
`;

const Title = styled.h1`
  margin-bottom: 2rem;
  color: #2c3e50;
`;

function App() {
  return (
    <AppContainer>
      <ContentContainer>
        <Title>Random Bible Verse</Title>
        <VerseDisplay />
        <Controls />
        <History />
        <Toast />
      </ContentContainer>
    </AppContainer>
  );
}

export default App;