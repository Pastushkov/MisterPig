import { cn } from "../../services/cn";

interface Props {
  icon: string;
  className?: string;
  onClick?: () => void;
}

export const Image = ({ icon, className, onClick }: Props) => (
  <div
    onClick={onClick}
    className={cn("w-4 h-4 bg-black", className)}
    style={{
      WebkitMask: `url(${icon})`,
      WebkitMaskSize: "contain",
      WebkitMaskRepeat: "no-repeat",
    }}
  />
);
