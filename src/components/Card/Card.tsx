interface Props {
  label?: string;
  count?: string | number;
  onClick?: () => void;
  disabled?: boolean;
}

export const Card = ({ label, count, onClick, disabled }: Props) => {
  return (
    <button
      disabled={disabled}
      key={label}
      onClick={onClick}
      className='disabled:border border-lightblue-120 disabled:bg-red-5 flex text-center rounded-lg h-36 w-30 justify-center items-center bg-white p-6 cursor-pointer hover:shadow-lg transition-all duration-75'
    >
      {label} <br />
      {count && `count: ${count}`}
    </button>
  );
};
