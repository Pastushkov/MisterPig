import { useEffect, useState } from 'react';
import { HistoryColor } from '../../../types';

interface Props {
  text: string;
  color?: HistoryColor;
}

export const InfoModal = ({ text }: Props) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      setTimeout(() => setOpen(false), 3000);
    }
  }, [open]);

  useEffect(() => {
    if (text?.length > 0) {
      setOpen(true);
    }
  }, [text]);

  return (
    open && (
      <div className='bg-lightblue-10 text-black text-lg fixed right-5 top-10 rounded-lg border border-neutral-50 p-6 text-center w-72'>
        {text}
      </div>
    )
  );
};
