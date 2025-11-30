export function RoundsListError() {
  return (
    <div className="p-8 text-center console-text">
      <div className="text-red-500 mb-4 console-glow">Ошибка при загрузке раундов</div>
      <button
        onClick={() => window.location.reload()}
        className="px-4 py-2 bg-console-bg border border-console-green text-console-green rounded cursor-pointer hover:bg-console-green hover:text-console-bg transition-all console-border"
      >
        Обновить
      </button>
    </div>
  );
}
