import { useEffect, useRef } from 'react';
import { IHistory } from '../../types';
import { cn } from '../../services/cn';
import '../../style.css';

interface Props {
  history: IHistory[];
}

export const History = ({ history }: Props) => {
  const historyContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (historyContainerRef.current) {
      historyContainerRef.current.scrollTop =
        historyContainerRef.current.scrollHeight;
    }
  }, [history]);

  return (
    <div
      className='overflow-y-auto w-64 h-60 bg-white rounded-xl p-6 scrollbar'
      ref={historyContainerRef}
    >
      {history.map(({ text, color }) => (
        <div
          className={cn('text-black', {
            'text-green-100': color === 'green',
            'text-red-100': color === 'red',
          })}
        >
          {text} <br />
          ---------------------------
        </div>
      ))}
    </div>
  );
};
