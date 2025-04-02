import FreePrizeView from './_views/freePrizeView';
import CashprizeView from './_views/freePrizeView';

export default function page() {
  return (
    <section className="mt-4 flex flex-col items-center justify-center gap-4">
      <div className="flex items-center justify-center">
        <FreePrizeView />
      </div>
    </section>
  );
}
