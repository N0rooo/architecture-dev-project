import LeaderboardView from './_views/LeaderboardView';

export default function page() {
  return (
    <section className="mt-4 flex flex-col items-center justify-center gap-4">
      <div className="container mx-auto flex max-w-5xl items-center justify-center">
        <LeaderboardView />
      </div>
    </section>
  );
}
