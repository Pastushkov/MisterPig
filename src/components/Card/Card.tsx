import { cn } from "../../services/cn";
import clubsSuitIcon from "./assets/clubs.svg";
import diamondSuitIcon from "./assets/diamonds.svg";
import spadesSuitIcon from "./assets/spades.svg";
import heartsSuitIcon from "./assets/hearts.svg";
import { Image } from "../Image/Image";

interface Props {
  label?: string;
  count?: string | number;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  suits?: string[];
}

const suitToImage: { [key: string]: string } = {
  hearts: heartsSuitIcon,
  diamonds: diamondSuitIcon,
  clubs: clubsSuitIcon,
  spades: spadesSuitIcon,
};

export const Card = ({
  label,
  count,
  onClick,
  disabled,
  className,
  suits,
}: Props) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "border border-lightblue-120 flex flex-col gap-2 text-center rounded-lg h-36 w-30 justify-center items-center bg-white p-6 cursor-pointer hover:shadow-lg transition-all duration-300 disabled:bg-red-5 disabled:cursor-not-allowed",
        className
      )}
    >
      <div>
        <div>{label} </div>
        <div>{count && `count: ${count}`}</div>
      </div>
      {suits && (
        <div className="flex gap-2">
          {suits.map((suit) => (
            <Image
              key={`${label}-${suit}`}
              icon={suitToImage[suit]}
              className={cn({
                "bg-red-100": suit === "hearts" || suit === "diamonds",
                "bg-black": suit === "clubs" || suit === "spades",
              })}
            />
          ))}
        </div>
      )}
    </button>
  );
};
