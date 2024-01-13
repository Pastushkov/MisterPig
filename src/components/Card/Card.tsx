import { cn } from '../../services/cn';

interface Props {
  label?: string;
  count?: string | number;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export const Card = ({ label, count, onClick, disabled, className }: Props) => {
  return (
    <button
      disabled={disabled}
      key={label}
      onClick={onClick}
      className={cn(
        'border border-lightblue-120 disabled:bg-red-5 flex text-center rounded-lg h-36 w-30 justify-center items-center bg-white p-6 cursor-pointer hover:shadow-lg transition-all duration-75',
        className
      )}
    >
      {label} <br />
      {count && `count: ${count}`}
    </button>
  );
};
