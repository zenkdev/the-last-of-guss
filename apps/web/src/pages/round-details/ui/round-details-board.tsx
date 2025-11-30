interface RoundDetailsBoardProps {
  onClick: () => void;
}
export function RoundDetailsBoard({ onClick }: RoundDetailsBoardProps) {
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    // Проверяем, что клик произошел по элементу с data-clickable атрибутом
    if (target.hasAttribute('data-clickable')) {
      onClick();
    }
  };

  return (
    <div className="p-8 flex justify-center items-center min-h-[300px]" onClick={handleClick}>
      <div className="grid grid-cols-12 gap-1 w-full max-w-md">
        <div className="col-span-2"></div>
        <div className="col-span-8 h-6 bg-gray-400 rounded" data-clickable></div>
        <div className="col-span-2"></div>
        <div className="col-span-1"></div>
        <div className="col-span-2 h-6 bg-gray-400 rounded" data-clickable></div>
        <div className="col-span-8 h-6 bg-gray-600 rounded" data-clickable></div>
        <div className="col-span-1"></div>
        <div className="col-span-1"></div>
        <div className="col-span-2 h-6 bg-gray-400 rounded" data-clickable></div>
        <div className="col-span-8 h-6 bg-gray-600 rounded" data-clickable></div>
        <div className="col-span-1"></div>
        <div className="col-span-1"></div>
        <div className="col-span-2 h-6 bg-gray-400 rounded" data-clickable></div>
        <div className="col-span-8 h-6 bg-gray-600 rounded" data-clickable></div>
        <div className="col-span-1"></div>
        <div className="col-span-2"></div>
        <div className="col-span-2 h-6 bg-gray-400 rounded" data-clickable></div>
        <div className="col-span-6 h-6 bg-gray-600 rounded" data-clickable></div>
        <div className="col-span-2"></div>
        <div className="col-span-1"></div>
        <div className="col-span-2 h-6 bg-gray-400 rounded" data-clickable></div>
        <div className="col-span-2 h-6 bg-yellow-300 rounded" data-clickable></div>
        <div className="col-span-2 h-6 bg-gray-400 rounded" data-clickable></div>
        <div className="col-span-4 h-6 bg-gray-600 rounded" data-clickable></div>
        <div className="col-span-1"></div>
        <div className="col-span-1"></div>
        <div className="col-span-2 h-6 bg-gray-400 rounded" data-clickable></div>
        <div className="col-span-4 h-6 bg-yellow-300 rounded" data-clickable></div>
        <div className="col-span-2 h-6 bg-gray-400 rounded" data-clickable></div>
        <div className="col-span-3"></div>
        <div className="col-span-1"></div>
        <div className="col-span-2 h-6 bg-gray-400 rounded" data-clickable></div>
        <div className="col-span-8 h-6 bg-yellow-300 rounded" data-clickable></div>
        <div className="col-span-1"></div>
        <div className="col-span-2"></div>
        <div className="col-span-2 h-6 bg-gray-400 rounded" data-clickable></div>
        <div className="col-span-6 h-6 bg-yellow-300 rounded" data-clickable></div>
        <div className="col-span-2"></div>
        <div className="col-span-3"></div>
        <div className="col-span-6 h-6 bg-gray-400 rounded" data-clickable></div>
        <div className="col-span-3"></div>
      </div>
    </div>
  );
}
