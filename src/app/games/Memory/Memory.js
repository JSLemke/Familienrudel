import React, { useState, useEffect } from 'react';
import './Memory.css'; // Importiere das zugehörige CSS

export default function Memory() {
  const [cards, setCards] = useState([]);
  const [firstChoice, setFirstChoice] = useState(null);
  const [secondChoice, setSecondChoice] = useState(null);
  const [disabled, setDisabled] = useState(false);

  const cardImages = [
    { framework: 'cat-1', src: 'ai-generated-8746802_640.jpg' },
    { framework: 'cat-2', src: 'duck-5381071_640.jpg' },
    { framework: 'cat-3', src: 'french-bulldog-2427629_640.jpg' },
    { framework: 'cat-4', src: 'hippo-3554044_640.jpg' },
    { framework: 'cat-5', src: 'horse-1334002_640.jpg' },
    { framework: 'cat-6', src: 'fantasy-4927931_640.jpg' },
    { framework: 'cat-7', src: 'tongue-out-3480889_640.jpg' },
    { framework: 'cat-8', src: 'tree-trunk-1091112_640.jpg' },
  ];

  const shuffleCards = () => {
    const shuffledCards = [...cardImages, ...cardImages]
      .sort(() => Math.random() - 0.5)
      .map((card) => ({ ...card, id: Math.random(), revealed: true }));
    setFirstChoice(null);
    setSecondChoice(null);
    setCards(shuffledCards);
    setDisabled(true);

    setTimeout(() => {
      setCards((prevCards) =>
        prevCards.map((card) => ({ ...card, revealed: false }))
      );
      setDisabled(false);
    }, 3000);
  };

  useEffect(() => {
    shuffleCards();
  }, []);

  const handleChoice = (card) => {
    if (disabled) return;
    if (!card.revealed && !card.matched) {
      setCards((prevCards) =>
        prevCards.map((c) =>
          c.id === card.id ? { ...c, revealed: true } : c
        )
      );
      firstChoice ? setSecondChoice(card) : setFirstChoice(card);
    }
  };

  useEffect(() => {
    if (firstChoice && secondChoice) {
      setDisabled(true);
      if (firstChoice.framework === secondChoice.framework) {
        setCards((prevCards) =>
          prevCards.map((card) =>
            card.framework === firstChoice.framework
              ? { ...card, matched: true, revealed: true }
              : card
          )
        );
        resetTurn();
      } else {
        setTimeout(() => {
          setCards((prevCards) =>
            prevCards.map((card) =>
              card.id === firstChoice.id || card.id === secondChoice.id
                ? { ...card, revealed: false }
                : card
            )
          );
          resetTurn();
        }, 1000);
      }
    }
  }, [firstChoice, secondChoice]);

  const resetTurn = () => {
    setFirstChoice(null);
    setSecondChoice(null);
    setDisabled(false);
  };

  return (
    <div className="memory">
      <h1>Memory</h1>
      <button onClick={shuffleCards}>Neues Spiel</button>
      <div className="memory-game">
        {cards.map((card) => (
          <div
            key={card.id}
            className={`memory-card ${card.revealed || card.matched ? 'flip' : ''}`}
            onClick={() => handleChoice(card)}
          >
            <img className="front-face" src={card.src} alt={card.framework} />
            <img className="back-face" src="Memorie.png" alt="Memory card back" />
          </div>
        ))}
      </div>
    </div>
  );
}
