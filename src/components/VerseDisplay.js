import React, { useEffect, useRef, useState } from 'react'; // Added useState
import { useSelector } from 'react-redux';
import styled from 'styled-components';

const VerseContainer = styled.div`
    margin: 20px 0;
    padding: 20px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    background-color: #fafafa;
    min-height: 33vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    overflow-y: auto;
`;

const VerseText = styled.p`
    font-family: 'Dancing Script', cursive;
    font-size: 1.8rem;
    margin-bottom: 1rem;
    line-height: 1.6;
    color: #2c3e50;
    opacity: ${props => props.isAnimating ? 0 : 1};
    transition: opacity 0.5s;
    padding: 1rem;
`;

const Reference = styled.p`
    font-family: 'Great Vibes', cursive;
    font-size: 1.5rem;
    color: #666;
    margin-top: 1rem;
    opacity: ${props => props.isAnimating ? 0 : 1};
    transition: opacity 0.5s;
    padding: 0.5rem;
`;

export function VerseDisplay() {
    const { currentVerse, status } = useSelector((state) => state.verse);
    const verseRef = useRef(null);
    const [isAnimating, setIsAnimating] = useState(false);

    const animateVerse = React.useCallback(() => {
        setIsAnimating(true);
        setTimeout(() => {
            if (verseRef.current) {
                const text = currentVerse.content;
                verseRef.current.textContent = '';
                
                text.split('').forEach((char, index) => {
                    setTimeout(() => {
                        verseRef.current.textContent += char;
                        if (index === text.length - 1) {
                            setIsAnimating(false);
                        }
                    }, index * 50);
                });
            }
        }, 100);
    }, [currentVerse.content]); // Add currentVerse.content as dependency

    useEffect(() => {
        if (currentVerse.content && currentVerse.content !== 'Click the button to get a verse') {
            animateVerse();
        }
    }, [currentVerse, animateVerse]); // Add animateVerse to dependencies

    return (
        <VerseContainer>
            <VerseText ref={verseRef} isAnimating={isAnimating}>
                {status === 'loading' ? 'Loading...' : currentVerse.content}
            </VerseText>
            <Reference isAnimating={isAnimating}>
                {currentVerse.reference}
            </Reference>
        </VerseContainer>
    );
}