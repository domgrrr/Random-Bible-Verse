import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { selectHistoryVerse } from '../../features/verse/verseSlice';

const HistoryContainer = styled.div`
  margin-top: 20px;
  text-align: left;
  max-height: 33vh;
  overflow-y: auto;
  border-top: 1px solid #e0e0e0;
  padding-top: 20px;
  flex-grow: 1;
`;

const HistoryTitle = styled.h3`
  margin-top: 0;
  padding: 0 10px;
  color: #2c3e50;
`;

const HistoryItem = styled(motion.div)`
  padding: 10px;
  border-bottom: 1px solid #e0e0e0;
  cursor: pointer;
  font-family: 'Dancing Script', cursive;
  font-size: 1.2rem;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f5f5f5;
  }
`;

export function History() {
  const dispatch = useDispatch();
  const history = useSelector(state => state.verse.history);

  return (
    <HistoryContainer>
      <HistoryTitle>History</HistoryTitle>
      <AnimatePresence>
        {history.map((item, index) => (
          <HistoryItem
            key={index}
            onClick={() => dispatch(selectHistoryVerse(index))}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <strong>{item.reference}</strong><br />
            {item.content.substring(0, 50)}...
          </HistoryItem>
        ))}
      </AnimatePresence>
    </HistoryContainer>
  );
}