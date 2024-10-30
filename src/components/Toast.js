import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled, { keyframes } from 'styled-components';
import { hideToast } from '../features/ui/uiSlice';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const fadeOut = keyframes`
  from { opacity: 1; transform: translateY(0); }
  to { opacity: 0; transform: translateY(-20px); }
`;

const ToastContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 10px 20px;
  background-color: #333;
  color: white;
  border-radius: 5px;
  animation: ${props => props.isShowing ? fadeIn : fadeOut} 0.3s ease-in-out;
  z-index: 1000;
`;

export function Toast() {
  const dispatch = useDispatch();
  const { message, isShowing } = useSelector(state => state.ui.toast);

  useEffect(() => {
    if (isShowing) {
      const timer = setTimeout(() => {
        dispatch(hideToast());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isShowing, dispatch]);

  if (!message) return null;

  return (
    <ToastContainer isShowing={isShowing}>
      {message}
    </ToastContainer>
  );
}