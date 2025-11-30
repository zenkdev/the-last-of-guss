interface RoundDetailsActiveProps {
  timeString: string;
  myScore: number;
}

export function RoundDetailsActive({ timeString, myScore }: RoundDetailsActiveProps) {
  return (
    <div className="p-4 text-center space-y-4">
      <div className="text-lg font-bold console-glow">Раунд активен!</div>
      <div className="text-lg font-bold console-glow">До конца осталось: {timeString}</div>
      <div className="text-lg font-bold console-glow">Мои очки - {myScore}</div>
    </div>
  );
}
