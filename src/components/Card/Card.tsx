import { cn } from "../../services/cn";
import clubsSuitIcon from "../../assets/clubs.svg";
import diamondSuitIcon from "../../assets/diamonds.svg";
import spadesSuitIcon from "../../assets/spades.svg";
import heartsSuitIcon from "../../assets/hearts.svg";

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
            <img
              key={`${label}-${suit}`}
              src={suitToImage[suit]}
              className={cn("h-4 w-4")}
            />
          ))}
        </div>
      )}
    </button>
  );
};
