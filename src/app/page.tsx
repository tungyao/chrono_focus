import LocalTimeDisplay from '@/components/local-time-display';
import CityTimezones from '@/components/city-timezones';

export default function Home() {
  return (
    <main className="flex flex-col items-center min-h-screen max-h-screen overflow-hidden font-sans">
      <div className="flex-grow flex flex-col items-center justify-center w-full px-4">
        <LocalTimeDisplay />
      </div>
      <div className="w-full pb-4 md:pb-6">
        <CityTimezones />
      </div>
    </main>
  );
}
