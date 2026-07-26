import { useCallback, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '../components/Header';
import type { HeaderContext } from './headerContext';

export function AppLayout() {
  const [eventTitle, setEventTitle] = useState<string | null>(null);

  const setEventTitleStable = useCallback((title: string | null) => setEventTitle(title), []);

  const context: HeaderContext = { setEventTitle: setEventTitleStable };

  return (
    <div className="potof-app">
      <Header eventTitle={eventTitle} />
      <Outlet context={context} />
    </div>
  );
}
