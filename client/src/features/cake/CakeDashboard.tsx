import type { CakeUser } from './CakeUserContext';
import { CakeUserProvider } from './CakeUserContext';
import { CakeNavProvider } from './CakeNavContext';
import { CakeDataProvider } from './CakeDataContext';
import { CakeRootLayout } from './layouts/CakeRootLayout';

export function CakeDashboard({ user }: { user: CakeUser | null | undefined }) {
  return (
    <div className="h-full min-h-0 flex flex-col">
      <CakeUserProvider user={user ?? null}>
        <CakeNavProvider>
          <CakeDataProvider>
            <CakeRootLayout />
          </CakeDataProvider>
        </CakeNavProvider>
      </CakeUserProvider>
    </div>
  );
}
