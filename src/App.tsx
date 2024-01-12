import { useEffect, useRef, useState } from 'react';
import { Card } from './components/Card/Card';

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
  // Копіюємо масив, щоб не змінювати оригінал
  const shuffledArray = [...array];

  // Функція для генерації випадкового числа в межах від 0 до n (не включно)
  const getRandomIndex = (n: number): number => Math.floor(Math.random() * n);

  // Перемішуємо масив за допомогою алгоритму Фішера-Йетса
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
  const [oponentCards, setOponentCards] = useState<Card[]>([]);
  const [playerTurn, setPlayerTurn] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);

  const historyContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    checkQuatro(true);
  }, [playerCards]);

  useEffect(() => {
    checkQuatro(false);
  }, [oponentCards]);

  useEffect(() => {
    if (!cards) return;
    const turnHistory: string[] = [];
    let choosenCard: Card = { label: '', mast: '' };
    if (playerTurn) {
      turnHistory.push('Player turn');
      turnHistory.push(`Player choose ${playerTurn}`);
      const findInOponent = oponentCards.filter(
        ({ label }) => label === playerTurn
      );

      if (findInOponent.length > 0) {
        turnHistory.push(`Player take all ${playerTurn} from opponent.`);
        setPlayerCards([...playerCards, ...findInOponent]);
        setOponentCards(
          oponentCards.filter(
            (el1) =>
              !findInOponent.some(
                (el2) => el1.label === el2.label && el1.mast === el2.mast
              )
          )
        );
      } else {
        turnHistory.push(
          `Opponent don't have ${playerTurn}. Player take one card from desk.`
        );
        const newCard = cards[Math.floor(Math.random() * cards.length)];
        setPlayerCards([...playerCards, newCard]);
        setCards(
          cards?.filter(
            (item) => JSON.stringify(item) !== JSON.stringify(newCard)
          )
        );
      }

      setTimeout(() => setPlayerTurn(null), 2000);
    } else {
      turnHistory.push('Opponent turn.');
      const choosenCardIndex = Math.floor(Math.random() * oponentCards.length);
      choosenCard = oponentCards[choosenCardIndex];
      turnHistory.push(`Opponent choose ${choosenCard.label}.`);
      const findInPlayer = playerCards.filter(
        ({ label }) => label === choosenCard.label
      );

      if (findInPlayer.length > 0) {
        turnHistory.push(`Opponent take all ${choosenCard.label} from player.`);
        setOponentCards([...oponentCards, ...findInPlayer]);
        setPlayerCards(
          playerCards.filter(
            (el1) =>
              !findInPlayer.some(
                (el2) => el1.label === el2.label && el1.mast === el2.mast
              )
          )
        );
      } else {
        turnHistory.push(
          `Player don't have ${choosenCard.label}. Opponent take one card from desk.`
        );
        const newCard = cards[Math.floor(Math.random() * cards.length)];

        setOponentCards([...oponentCards, newCard]);
        setCards(
          cards?.filter(
            (item) => JSON.stringify(item) !== JSON.stringify(newCard)
          )
        );
      }
    }
    setHistory([...history, ...turnHistory]);
  }, [playerTurn]);

  useEffect(() => {
    if (historyContainerRef.current) {
      historyContainerRef.current.scrollTop =
        historyContainerRef.current.scrollHeight;
    }
  }, [history]);

  const checkQuatro = (player: boolean) => {
    const coloda = player ? playerCards : oponentCards;

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
      player
        ? setPlayerCards(
            playerCards.filter((card) => !fourOfAKind.includes(card.label))
          )
        : setOponentCards(
            oponentCards.filter((card) => !fourOfAKind.includes(card.label))
          );
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

    setHistory([...history, 'Start new game']);
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
    <div className='bg-darkblue-5 p-6 w-full h-screen'>
      <div className='bg-white border border-neutral-30 w-full h-20 p-4'>
        <button
          className='bg-darkblue-70 text-white p-2 rounded-lg'
          onClick={startNewGame}
        >
          Start new game
        </button>
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
        </div>
        <div className='mt-14 flex gap-20 flex-col'>
          <div>
            <Card label='desc' count={cards?.length} />
          </div>
          <div className='overflow-y-auto w-64 h-52' ref={historyContainerRef}>
            {history.map((turn) => {
              return (
                <div>
                  <div>{turn}</div> -------------------------------------
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
