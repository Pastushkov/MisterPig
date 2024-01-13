import clsx, { ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * cn (classnames) - Utility to include twMerge into clsx
 * note: order of classes declaration matters in the case of 2 similar classes is present in the end string
 * @param inputs
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
