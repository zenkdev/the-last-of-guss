interface RoundDetailsCompletedProps {
  totalScore: number;
  myScore: number;
  winner?: string;
  winnerScore?: number;
}

export function RoundDetailsCompleted({ totalScore, myScore, winner, winnerScore }: RoundDetailsCompletedProps) {
  return (
    <div className="p-4 flex justify-center border-t border-console-green">
      <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 p-4">
        <div className="text-lg font-bold console-glow">Всего</div>
        <div className="text-lg font-bold console-glow">{totalScore}</div>
        {winner ? (
          <>
            <div className="text-lg font-bold console-glow">Победитель - {winner}</div>
            <div className="text-lg font-bold console-glow">{winnerScore ?? 0}</div>
          </>
        ) : null}
        <div className="text-lg font-bold console-glow">Мои очки</div>
        <div className="text-lg font-bold console-glow">{myScore}</div>
      </div>
    </div>
  );
}
