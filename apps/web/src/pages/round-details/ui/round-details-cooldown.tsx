interface RoundDetailsCooldownProps {
  timeString: string;
}

export function RoundDetailsCooldown({ timeString }: RoundDetailsCooldownProps) {
  return (
    <div className="p-6 text-center">
      <div className="text-lg font-bold console-glow">Cooldown</div>
      <div className="text-lg font-bold console-glow">до начала раунда {timeString}</div>
    </div>
  );
}
