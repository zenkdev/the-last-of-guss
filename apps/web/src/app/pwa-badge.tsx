import { useEffect, useState } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';

export default function PWABadge() {
  // check for updates every hour
  const period = 60 * 60 * 1000;

  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(swUrl, r) {
      if (period <= 0) return;
      if (r?.active?.state === 'activated') {
        registerPeriodicSync(period, swUrl, r);
      } else if (r?.installing) {
        r.installing.addEventListener('statechange', e => {
          const sw = e.target as ServiceWorker;
          if (sw.state === 'activated') registerPeriodicSync(period, swUrl, r);
        });
      }
    },
  });

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (offlineReady || needRefresh) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setOfflineReady(false);
        setNeedRefresh(false);
      }, 10_000);
      return () => clearTimeout(timer);
    }
  }, [offlineReady, needRefresh, setOfflineReady, setNeedRefresh]);

  function close() {
    setIsVisible(false);
    setOfflineReady(false);
    setNeedRefresh(false);
  }

  if (!isVisible && !offlineReady && !needRefresh) {
    return null;
  }

  return (
    <div
      className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 font-console ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      <div className="bg-console-bg border-2 border-console-green rounded-lg p-4 console-border console-text shadow-lg min-w-[300px] max-w-[500px]">
        <div className="flex items-center justify-between gap-4">
          <p className="text-console-green console-glow flex-1">
            {offlineReady ? 'Приложение готово к работе offline' : 'Доступно новое обновление, нажмите кнопку для перезагрузки.'}
          </p>
          <div className="flex items-center gap-2">
            {needRefresh && (
              <button
                onClick={() => updateServiceWorker(true)}
                className="px-4 py-2 bg-console-bg border-2 border-console-green text-console-green rounded text-sm font-medium console-border hover:bg-console-green hover:text-console-bg console-glow transition-all cursor-pointer"
              >
                Перезагрузить
              </button>
            )}
            <button
              onClick={close}
              className="text-console-green hover:text-console-green-light console-glow transition-all cursor-pointer text-xl leading-none"
              aria-label="Закрыть"
            >
              ×
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * This function will register a periodic sync check every hour, you can modify the interval as needed.
 */
function registerPeriodicSync(period: number, swUrl: string, r: ServiceWorkerRegistration) {
  if (period <= 0) return;

  setInterval(async () => {
    if ('onLine' in navigator && !navigator.onLine) return;

    const resp = await fetch(swUrl, {
      cache: 'no-store',
      headers: {
        cache: 'no-store',
        'cache-control': 'no-cache',
      },
    });

    if (resp?.status === 200) await r.update();
  }, period);
}
