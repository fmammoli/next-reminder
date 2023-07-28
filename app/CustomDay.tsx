import { DayContent, DayContentProps } from "react-day-picker";

const dotsColors = [
  "text-fuchsia-500",
  "text-lime-500",
  "text-teal-500",
  "text-amber-500",
];

export default function CustomDay({
  remindersCount,
  props,
}: {
  remindersCount: number;
  props: DayContentProps;
}) {
  const count = Array.from(Array(remindersCount).keys()).map((value, index) => (
    <span key={index} className={`font-bold text-lg ${dotsColors[index]}`}>
      .
    </span>
  ));
  const yearValue = props.date.toLocaleDateString("pt-Br", {
    year: "numeric",
  });
  const monthValue = props.date.toLocaleDateString("pt-Br", {
    month: "2-digit",
  });
  const dayValue = props.date.toLocaleDateString("pt-Br", { day: "2-digit" });
  return (
    <div className="relative w-full">
      <DayContent {...props}></DayContent>
      <div className="absolute top-1/4 w-full flex gap-[2px] justify-center">
        {count.length === 0 ? null : count}
      </div>
    </div>
  );
}
