interface RoundDetailsBoardProps {
  onClick: () => void;
}

export function RoundDetailsBoard({ onClick }: RoundDetailsBoardProps) {
  return (
    <div className="p-8 flex justify-center items-center min-h-[300px]" onClick={onClick}>
      <div className="grid grid-cols-12 gap-1 w-full max-w-md">
        {/* Row 1 */}
        <div className="col-span-12 h-2"></div>
        {/* Row 2 */}
        <div className="col-span-2"></div>
        <div className="col-span-8 h-3 bg-gray-400 rounded"></div>
        <div className="col-span-2"></div>
        {/* Row 3 */}
        <div className="col-span-1"></div>
        <div className="col-span-10 h-4 bg-gray-500 rounded"></div>
        <div className="col-span-1"></div>
        {/* Row 4 */}
        <div className="col-span-1"></div>
        <div className="col-span-10 h-4 bg-gray-500 rounded"></div>
        <div className="col-span-1"></div>
        {/* Row 5 */}
        <div className="col-span-2"></div>
        <div className="col-span-8 h-4 bg-gray-500 rounded"></div>
        <div className="col-span-2"></div>
        {/* Row 6 */}
        <div className="col-span-1"></div>
        <div className="col-span-2 h-3 bg-yellow-300 rounded"></div>
        <div className="col-span-2"></div>
        <div className="col-span-4 h-3 bg-gray-500 rounded"></div>
        <div className="col-span-2"></div>
        <div className="col-span-1"></div>
        {/* Row 7 */}
        <div className="col-span-1"></div>
        <div className="col-span-4 h-3 bg-yellow-300 rounded"></div>
        <div className="col-span-2"></div>
        <div className="col-span-4 h-3 bg-yellow-300 rounded"></div>
        <div className="col-span-1"></div>
        {/* Row 8 */}
        <div className="col-span-1"></div>
        <div className="col-span-10 h-3 bg-yellow-300 rounded"></div>
        <div className="col-span-1"></div>
        {/* Row 9 */}
        <div className="col-span-2"></div>
        <div className="col-span-8 h-3 bg-yellow-300 rounded"></div>
        <div className="col-span-2"></div>
        {/* Row 10 */}
        <div className="col-span-3"></div>
        <div className="col-span-6 h-2 bg-yellow-200 rounded"></div>
        <div className="col-span-3"></div>
        {/* Row 11 */}
        <div className="col-span-12 h-2"></div>
      </div>
    </div>
  );
}
