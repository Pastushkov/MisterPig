import { useEffect, useState } from 'react';
import { Card } from './components/Card/Card';
import { History } from './components/History/History';
import { IHistory } from './types';
import { InfoModal } from './components/Modals/InfoModal/InfoModal';

import './style.css';

interface Card {
  label: string;
  mast: string;
}

const cards = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
const masti = ['cherv', 'bub', 'krest', 'pika'];

const cardToText = (card: number) => {
  switch (card) {
    case 11:
      return 'Valet';
    case 12:
      return 'Dama';
    case 13:
      return 'Korol';
    case 14:
      return 'Tyx';
    default:
      return card.toString();
  }
};

const shuffleArray = (array: Card[]): Card[] => {
  const shuffledArray = [...array];

  const getRandomIndex = (n: number): number => Math.floor(Math.random() * n);

  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = getRandomIndex(i + 1);
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }

  return shuffledArray;
};

const generateCards = (): Card[] => {
  const res: Card[] = [];
  cards.forEach((card) => {
    masti.forEach((mast) => {
      res.push({
        label: cardToText(card),
        mast,
      });
    });
  });
  return shuffleArray(res);
};

const App = () => {
  const [cards, setCards] = useState<Card[]>();
  const [playerCards, setPlayerCards] = useState<Card[]>([]);
  const [opponentCards, setOponentCards] = useState<Card[]>([]);
  const [playerTurn, setPlayerTurn] = useState<string | null>(null);
  const [history, setHistory] = useState<IHistory[]>([]);
  const [closedPlayerCards, setClosedPlayerCards] = useState<string[]>([]);
  const [closedOpponentCards, setClosedOpponentCards] = useState<string[]>([]);
  const [textForInfoModal, setTextForInfoModal] = useState('');

  useEffect(() => {
    checkQuatro(true);
  }, [playerCards]);

  useEffect(() => {
    checkQuatro(false);
  }, [opponentCards]);

  useEffect(() => {
    if (!cards) return;
    const turnHistory: IHistory[] = [];

    if (
      cards.length === 0 ||
      playerCards.length === 0 ||
      opponentCards.length === 0
    ) {
      const text = 'Game over !';
      turnHistory.push({ text });
      setTextForInfoModal(text);
      return;
    }

    let choosenCard: Card = { label: '', mast: '' };
    if (playerTurn) {
      turnHistory.push({ text: `Player choose ${playerTurn}`, color: 'green' });
      const findInOponent = opponentCards.filter(
        ({ label }) => label === playerTurn
      );

      if (findInOponent.length > 0) {
        const text = `Player take all ${playerTurn} from opponent.`;
        turnHistory.push({
          text,
          color: 'green',
        });
        setTextForInfoModal(text);
        setPlayerCards([...playerCards, ...findInOponent]);
        setOponentCards(
          opponentCards.filter(
            (el1) =>
              !findInOponent.some(
                (el2) => el1.label === el2.label && el1.mast === el2.mast
              )
          )
        );
      } else {
        const text = `Opponent don't have ${playerTurn}. Player take one card from desk.`;
        turnHistory.push({
          text,
          color: 'green',
        });
        setTextForInfoModal(text);
        if (cards.length > 0) {
          const newCard = cards[Math.floor(Math.random() * cards.length)];
          setPlayerCards([...playerCards, newCard]);
          setCards(
            cards?.filter(
              (item) => JSON.stringify(item) !== JSON.stringify(newCard)
            )
          );
        }
      }
      turnHistory.push({ text: 'Opponent turn.', color: 'red' });
      setTimeout(() => setPlayerTurn(null), 4000);
    } else {
      const choosenCardIndex = Math.floor(Math.random() * opponentCards.length);
      choosenCard = opponentCards[choosenCardIndex];
      turnHistory.push({
        text: `Opponent choose ${choosenCard.label}.`,
        color: 'red',
      });
      const findInPlayer = playerCards.filter(
        ({ label }) => label === choosenCard.label
      );

      if (findInPlayer.length > 0) {
        const text = `Opponent take all ${choosenCard.label} from player.`;
        turnHistory.push({
          text,
          color: 'red',
        });
        setTextForInfoModal(text);
        setOponentCards([...opponentCards, ...findInPlayer]);
        setPlayerCards(
          playerCards.filter(
            (el1) =>
              !findInPlayer.some(
                (el2) => el1.label === el2.label && el1.mast === el2.mast
              )
          )
        );
      } else {
        const text = `Player don't have ${choosenCard.label}. Opponent take one card from desk.`;
        turnHistory.push({
          text,
          color: 'red',
        });
        setTextForInfoModal(text);
        if (cards.length > 0) {
          const newCard = cards[Math.floor(Math.random() * cards.length)];

          setOponentCards([...opponentCards, newCard]);
          setCards(
            cards?.filter(
              (item) => JSON.stringify(item) !== JSON.stringify(newCard)
            )
          );
        }
        turnHistory.push({ text: 'Player turn', color: 'green' });
      }
    }
    setHistory([...history, ...turnHistory]);
  }, [playerTurn]);

  const checkQuatro = (player: boolean) => {
    const coloda = player ? playerCards : opponentCards;

    const counts: { [key: string]: number } = {};

    coloda.forEach((card) => {
      counts[card.label] = (counts[card.label] || 0) + 1;
    });

    const fourOfAKind: string[] = [];
    for (const [label, count] of Object.entries(counts)) {
      if (count >= 4) {
        fourOfAKind.push(label);
      }
    }

    if (fourOfAKind.length > 0) {
      if (player) {
        fourOfAKind.forEach((card) => {
          const text = `Player collect all ${card} cards`;
          setHistory([...history, { text, color: 'green' }]);
          setTextForInfoModal(text);
        });
        setClosedPlayerCards([...closedPlayerCards, ...fourOfAKind]);
        setPlayerCards(
          playerCards.filter((card) => !fourOfAKind.includes(card.label))
        );
      } else {
        fourOfAKind.forEach((card) => {
          const text = `Opponent collect all ${card} cards`;
          setHistory([...history, { text, color: 'red' }]);
          setTextForInfoModal(text);
        });
        setClosedOpponentCards([...closedOpponentCards, ...fourOfAKind]);
        setOponentCards(
          opponentCards.filter((card) => !fourOfAKind.includes(card.label))
        );
      }
    }
  };

  const startNewGame = () => {
    setOponentCards([]);
    setPlayerCards([]);
    setHistory([]);

    const initialCards = 5;

    const player: Card[] = [];
    const opponent: Card[] = [];
    let coloda: Card[] = generateCards();

    for (let i = 0; i <= initialCards; i++) {
      const randElement = coloda[Math.floor(Math.random() * coloda.length)];
      opponent.push(randElement);
      coloda = coloda.filter(
        (card) => !player.includes(card) && !opponent.includes(card)
      );
    }

    for (let i = 0; i <= initialCards; i++) {
      const randElement = coloda[Math.floor(Math.random() * coloda.length)];
      player.push(randElement);
      coloda = coloda.filter(
        (card) => !player.includes(card) && !opponent.includes(card)
      );
    }

    setHistory([
      ...history,
      { text: 'Start new game' },
      { text: 'Player turn', color: 'green' },
    ]);
    setCards(coloda);
    setOponentCards(opponent);
    setPlayerCards(player);
  };

  const countCards = (coloda: Card[]) => {
    const counts: { [key: string]: number } = {};

    coloda.forEach((card) => {
      const key = card.label;
      counts[key] = (counts[key] || 0) + 1;
    });

    return counts;
  };

  return (
    <div className='bg-darkblue-5 p-6 w-full h-full scrollbar'>
      <div className='bg-white border border-neutral-30 w-full h-20 p-4'>
        <button
          className='bg-darkblue-70 text-white p-2 rounded-lg'
          onClick={startNewGame}
        >
          Start new game
        </button>
      </div>
      <div className='w-full text-center text-4xl mt-4'>
        {playerTurn ? 'Opponent turn' : 'Player turn'}
      </div>
      <div className='w-full text-center mt-8'>
        <div className='w-3/4 inline-block'>
          <div>Opponent cards</div>
          <div className='flex gap-8 flex-wrap mt-8 justify-center'>
            {Object.entries(countCards(opponentCards)).map(() => {
              return <div className='bg-red-40 w-10 h-16'></div>;
            })}
          </div>
        </div>
        <div className='w-1/4 inline-block'>
          <Card label='desc' count={cards?.length} />
        </div>
      </div>
      <div className='flex justify-between p-10'>
        <div>
          <div>Player cards</div>
          <div className='flex gap-8 flex-wrap mt-8'>
            {Object.entries(countCards(playerCards)).map(([label, count]) => {
              return (
                <Card
                  disabled={!!playerTurn}
                  key={label}
                  onClick={() => {
                    setPlayerTurn(label);
                  }}
                  label={label}
                  count={count}
                />
              );
            })}
          </div>
          <div className='mt-10 flex flex-col gap-5'>
            <div>
              <div>Player collect: ({closedPlayerCards.length})</div>
              <div className='flex gap-4'>
                {closedPlayerCards.map((card) => (
                  <div>{card}</div>
                ))}
              </div>
            </div>
            <div>
              <div>Opponent collect: ({closedOpponentCards.length})</div>
              <div className='flex gap-4'>
                {closedOpponentCards.map((card) => (
                  <div>{card}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className='mt-14 flex gap-10 flex-col'>
          <History history={history} />
        </div>
      </div>
      <InfoModal text={textForInfoModal} />
    </div>
  );
};

export default App;
