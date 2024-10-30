import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { getRandomVerse } from '../../features/verse/verseSlice';
import { copyVerse, showToast } from '../../features/ui/uiSlice';
import { LoadingSpinner } from '../LoadingSpinner';

const ControlsContainer = styled.div`
  margin: 1rem 0;
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
`;

const Button = styled.button`
  background-color: ${props => props.variant === 'copy' ? '#2196F3' : '#4caf50'};
  border: none;
  color: white;
  padding: 12px 24px;
  text-align: center;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  font-size: 16px;
  margin: 4px 2px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  border-radius: 5px;
  transition: background-color 0.3s;
  opacity: ${props => props.disabled ? 0.7 : 1};

  &:hover:not(:disabled) {
    background-color: ${props => props.variant === 'copy' ? '#1976D2' : '#45a049'};
  }
`;

export function Controls() {
  const dispatch = useDispatch();
  const { status, currentVerse } = useSelector(state => state.verse);
  const isLoading = status === 'loading';

  const handleCopy = async () => {
    try {
      const textToCopy = `${currentVerse.content} - ${currentVerse.reference}`;
      await navigator.clipboard.writeText(textToCopy);
      dispatch(showToast('Verse copied to clipboard!'));
    } catch (err) {
      dispatch(showToast('Failed to copy verse'));
    }
  };

  return (
    <ControlsContainer>
      <Button 
        onClick={() => dispatch(getRandomVerse())} 
        disabled={isLoading}
      >
        {isLoading && <LoadingSpinner />}
        Get Random Verse
      </Button>
      {currentVerse.content !== 'Click the button to get a verse' && (
        <Button 
          variant="copy" 
          onClick={handleCopy}
          disabled={isLoading}
        >
          Copy Verse
        </Button>
      )}
    </ControlsContainer>
  );
}