import type { CakeUser } from './CakeUserContext';
import { CakeUserProvider } from './CakeUserContext';
import { CakeNavProvider } from './CakeNavContext';
import { CakeDataProvider } from './CakeDataContext';
import { CakeRootLayout } from './layouts/CakeRootLayout';

export function CakeDashboard({
  user,
  handleLogout,
}: {
  user: CakeUser | null | undefined;
  handleLogout?: () => void;
}) {
  return (
    <div className="h-full min-h-0 flex flex-col">
      <CakeUserProvider user={user ?? null}>
        <CakeNavProvider>
          <CakeDataProvider>
            <CakeRootLayout onLogout={handleLogout} />
          </CakeDataProvider>
        </CakeNavProvider>
      </CakeUserProvider>
    </div>
  );
}
