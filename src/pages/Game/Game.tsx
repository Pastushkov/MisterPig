import { useEffect, useState } from "react";
import { ICard, IHistory } from "../../types";
import { Card } from "../../components/Card/Card";
import { History } from "../../components/History/History";
import { InfoModal } from "../../components/Modals/InfoModal/InfoModal";
import { Image } from "../../components/Image/Image";
import { Tooltip } from "react-tooltip";
import infoIcon from "../../assets/info.svg";
import { useNavigate } from "@tanstack/react-location";

const cards = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
const suits = ["hearts", "diamonds", "clubs", "spades"];

const cardToText = (card: number) => {
  switch (card) {
    case 11:
      return "Jack";
    case 12:
      return "Queen";
    case 13:
      return "King";
    case 14:
      return "Ace";
    default:
      return card.toString();
  }
};

const INITIAL_CARDS_AMOUNT = 5;

const shuffleArray = (array: ICard[]): ICard[] => {
  const shuffledArray = [...array];

  const getRandomIndex = (n: number): number => Math.floor(Math.random() * n);

  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = getRandomIndex(i + 1);
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }

  return shuffledArray;
};

const generateCards = (): ICard[] => {
  const res: ICard[] = [];
  cards.forEach((card) => {
    suits.forEach((suit) => {
      res.push({
        label: cardToText(card),
        suit,
      });
    });
  });
  return shuffleArray(res);
};

export const Game = () => {
  const navigate = useNavigate();

  const [cards, setCards] = useState<ICard[]>();
  const [playerCards, setPlayerCards] = useState<ICard[]>([]);
  const [opponentCards, setOponentCards] = useState<ICard[]>([]);
  const [playerTurn, setPlayerTurn] = useState<string | null>(null);
  const [history, setHistory] = useState<IHistory[]>([]);
  const [closedPlayerCards, setClosedPlayerCards] = useState<string[]>([]);
  const [closedOpponentCards, setClosedOpponentCards] = useState<string[]>([]);
  const [textForInfoModal, setTextForInfoModal] = useState("");

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
      const text = "Game over !";
      turnHistory.push({ text });
      setTextForInfoModal(text);
      return;
    }

    let choosenCard: ICard = { label: "", suit: "" };
    if (playerTurn) {
      turnHistory.push({ text: `Player choose ${playerTurn}`, color: "green" });
      const findInOponent = opponentCards.filter(
        ({ label }) => label === playerTurn
      );

      if (findInOponent.length > 0) {
        const text = `Player choose ${playerTurn}. Player take all ${playerTurn} from opponent.`;
        turnHistory.push({
          text,
          color: "green",
        });
        setTextForInfoModal(text);

        setPlayerCards([...playerCards, ...findInOponent]);
        setOponentCards(
          opponentCards.filter(
            (el1) =>
              !findInOponent.some(
                (el2) => el1.label === el2.label && el1.suit === el2.suit
              )
          )
        );
      } else {
        const text = `Player choose ${playerTurn}. Opponent don't have ${playerTurn}. Player take one card from desk.`;
        turnHistory.push({
          text,
          color: "green",
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
      turnHistory.push({ text: "Opponent turn.", color: "red" });
      setTimeout(() => setPlayerTurn(null), 4000);
    } else {
      const choosenCardIndex = Math.floor(Math.random() * opponentCards.length);
      choosenCard = opponentCards[choosenCardIndex];
      turnHistory.push({
        text: `Opponent choose ${choosenCard.label}.`,
        color: "red",
      });
      const findInPlayer = playerCards.filter(
        ({ label }) => label === choosenCard.label
      );

      if (findInPlayer.length > 0) {
        const text = `Opponent choose ${choosenCard.label}. Opponent take all ${choosenCard.label} from player.`;
        turnHistory.push({
          text,
          color: "red",
        });
        setTextForInfoModal(text);
        setOponentCards([...opponentCards, ...findInPlayer]);
        setPlayerCards(
          playerCards.filter(
            (el1) =>
              !findInPlayer.some(
                (el2) => el1.label === el2.label && el1.suit === el2.suit
              )
          )
        );
      } else {
        const text = `Opponent choose ${choosenCard.label}. Player don't have ${choosenCard.label}. Opponent take one card from desk.`;
        turnHistory.push({
          text,
          color: "red",
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
        turnHistory.push({ text: "Player turn", color: "green" });
      }
    }
    setHistory([...history, ...turnHistory]);
  }, [playerTurn]);

  const checkQuatro = (player: boolean) => {
    const desc = player ? playerCards : opponentCards;

    const counts: { [key: string]: number } = {};

    desc.forEach((card) => {
      counts[card.label] = (counts[card.label] || 0) + 1;
    });

    const collectedCards: string[] = [];
    for (const [label, count] of Object.entries(counts)) {
      if (count >= 4) {
        collectedCards.push(label);
      }
    }

    if (collectedCards.length > 0) {
      if (player) {
        collectedCards.forEach((card) => {
          const text = `Player collect all ${card} cards`;
          setHistory([...history, { text, color: "green" }]);
          setTextForInfoModal(text);
        });
        setClosedPlayerCards([...closedPlayerCards, ...collectedCards]);
        setPlayerCards(
          playerCards.filter((card) => !collectedCards.includes(card.label))
        );
      } else {
        collectedCards.forEach((card) => {
          const text = `Opponent collect all ${card} cards`;
          setHistory([...history, { text, color: "red" }]);
          setTextForInfoModal(text);
        });
        setClosedOpponentCards([...closedOpponentCards, ...collectedCards]);
        setOponentCards(
          opponentCards.filter((card) => !collectedCards.includes(card.label))
        );
      }
    }
  };

  const startNewGame = () => {
    const player: ICard[] = [];
    const opponent: ICard[] = [];
    let desc: ICard[] = generateCards();

    for (let i = 0; i <= INITIAL_CARDS_AMOUNT; i++) {
      const randElement = desc[Math.floor(Math.random() * desc.length)];
      opponent.push(randElement);
      desc = desc.filter(
        (card) => !player.includes(card) && !opponent.includes(card)
      );
    }

    for (let i = 0; i <= INITIAL_CARDS_AMOUNT; i++) {
      const randElement = desc[Math.floor(Math.random() * desc.length)];
      player.push(randElement);
      desc = desc.filter(
        (card) => !player.includes(card) && !opponent.includes(card)
      );
    }

    setHistory([
      { text: "Start new game" },
      { text: "Player turn", color: "green" },
    ]);

    setCards(desc);
    setOponentCards(opponent);
    setPlayerCards(player);
  };

  const countCards = (desc: ICard[]) => {
    const counts: { [key: string]: number } = {};

    desc.forEach((card) => {
      const key = card.label;
      counts[key] = (counts[key] || 0) + 1;
    });

    return counts;
  };

  return (
    <div className="bg-darkblue-5 p-6 w-full h-screen overflow-auto scrollbar">
      <div className="w-full text-center text-4xl mt-4">
        {playerTurn ? "Opponent turn" : "Player turn"}
      </div>
      <div className="w-full text-center mt-8">
        <div className="w-3/4 inline-block">
          <div>Opponent cards</div>
          <div className="flex gap-8 flex-wrap mt-8 justify-center">
            {Object.entries(countCards(opponentCards)).map(([label]) => {
              return (
                <div
                  className="bg-red-40 w-10 h-16"
                  key={`opponent-card-${label}`}
                ></div>
              );
            })}
          </div>
        </div>
        <div className="w-1/4 inline-block">
          <Card label="desc" count={cards?.length} />
        </div>
      </div>
      <div className="flex justify-between p-10">
        <div>
          <div>Player cards</div>
          <div className="flex gap-8 flex-wrap mt-8">
            {Object.entries(countCards(playerCards)).map(
              ([label, count], index) => {
                const suits = playerCards
                  .filter((item) => item.label === label)
                  .map((item) => item.suit);

                return (
                  <Card
                    disabled={!!playerTurn}
                    key={`${label}${count}${index}`}
                    onClick={() => {
                      setPlayerTurn(label);
                    }}
                    label={label}
                    suits={suits}
                  />
                );
              }
            )}
          </div>
          <div className="mt-10 flex flex-col gap-5">
            <div>
              <div>Player collect: ({closedPlayerCards.length})</div>
              <div className="flex gap-4">
                {closedPlayerCards.map((card) => (
                  <Card label={card} suits={suits} key={card} />
                ))}
              </div>
            </div>
            <div>
              <div>Opponent collect: ({closedOpponentCards.length})</div>
              <div className="flex gap-4">
                {closedOpponentCards.map((card) => (
                  <Card label={card} suits={suits} key={card} />
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-14 flex gap-10 flex-col">
          <History history={history} />
        </div>
      </div>
      <InfoModal text={textForInfoModal} />
      <div className="flex justify-center items-center gap-2">
        <button
          className="bg-darkblue-70 text-white p-2 rounded-lg"
          onClick={startNewGame}
        >
          Start new game
        </button>
        <div data-tooltip-id="info">
          <Image
            icon={infoIcon}
            className="w-8 h-8 cursor-pointer"
            onClick={() => {
              navigate({ to: "/MisterPig/how-to-play" });
            }}
          />
          <Tooltip
            id="info"
            content="How to play?"
            place="top"
            style={{
              zIndex: 1000,
              borderRadius: "8px",
              boxShadow:
                "0px 4px 6px -2px rgba(16, 24, 40, 0.03), 0px 12px 16px -4px rgba(16, 24, 40, 0.08)",
            }}
          />
        </div>
      </div>
    </div>
  );
};
