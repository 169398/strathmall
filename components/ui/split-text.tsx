import { useRef, useState } from "react";


import { cn } from "@/lib/utils";

export default function SplitText({
  text = "Every celebration deserves a cake",
  className,
}: {
  text: string;
  className?: string;
}) {
  const [activeIndex, setIndex] = useState<number>();
  // eslint-disable-next-line no-undef
  const timer = useRef<NodeJS.Timeout>();

  const letterClassName =
    "inline h-1/2 select-none overflow-y-hidden leading-none transition-all duration-300 ease-out whitespace-pre";

  return (
    <div
      className={cn(
        "relative mx-auto cursor-sword text-2xl font-black  text-white md:text-5xl lg:text-3xl",
        className
      )}
    >
      {/** add hidden text so that we maintain the size for any text */}
      <div className="invisible leading-none">{text}</div>
      <div className="absolute top-0 flex h-full">
        {text.split("").map((letter, index) => (
          <div
            onMouseEnter={() => {
              if (timer.current) {
                clearTimeout(timer.current);
              }
              setIndex(index);
            }}
            onMouseLeave={() => {
              timer.current = setTimeout(() => {
                setIndex(undefined);
              });
            }}
            key={index}
            className="relative inline-flex h-full cursor-sword flex-col leading-none"
          >
            {/** top half */}
            <span
              className={cn(letterClassName, {
                "-translate-y-5": index === activeIndex,
                "-translate-y-3":
                  activeIndex !== undefined &&
                  (index === activeIndex - 1 || index === activeIndex + 1),
                "-translate-y-1":
                  activeIndex !== undefined &&
                  (index === activeIndex - 2 || index === activeIndex + 2),
              })}
            >
              {letter}
            </span>

            {/** bottom half */}
            <span
              className={cn(letterClassName, {
                "translate-y-5": index === activeIndex,
                "translate-y-3":
                  activeIndex !== undefined &&
                  (index === activeIndex - 1 || index === activeIndex + 1),
                "translate-y-1":
                  activeIndex !== undefined &&
                  (index === activeIndex - 2 || index === activeIndex + 2),
              })}
            >
              <span className="absolute -translate-y-1/2 leading-none">
                {letter}
              </span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
