import { Architects_Daughter } from "next/font/google";

const architectsDaughter = Architects_Daughter({
  subsets: ["latin"],
  weight: ["400"],
});

export function Footer() {
  return (
    <div
      className={`${architectsDaughter.className} text-muted-foreground flex w-full items-center justify-center gap-2 py-2 mb-5 text-sm`}
    >
      by
    
        Adil Nawaz
      
    </div>
  );
}
