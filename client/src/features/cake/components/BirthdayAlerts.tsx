import { useMemo } from 'react';
import { Cake, CalendarDays } from 'lucide-react';
import type { DeliveryRequest } from '../types/delivery';
import { daysUntilNextBirthday, formatDate, formatDobDisplay, getNextBirthdayDate } from '../utils/helpers';

type Row = DeliveryRequest & { daysUntil: number };

export function BirthdayAlerts({ deliveries }: { deliveries: DeliveryRequest[] }) {
  const rows = useMemo(() => {
    const list: Row[] = [];
    for (const d of deliveries) {
      if (d.status === 'REJECTED' || !d.dob?.trim()) continue;
      const days = daysUntilNextBirthday(d.dob);
      if (days === null) continue;
      list.push({ ...d, daysUntil: days });
    }
    list.sort((a, b) => a.daysUntil - b.daysUntil);
    return list.slice(0, 6);
  }, [deliveries]);

  if (rows.length === 0) return null;

  return (
    <section
      className="rounded-2xl border border-[#FBCFE8] bg-gradient-to-br from-white to-[#FDF2F8] p-5 md:p-6 shadow-sm"
      aria-labelledby="birthday-alerts-heading"
    >
      <div className="flex items-start gap-3 mb-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#EC4899] to-[#FBCFE8] shadow-sm">
          <Cake className="h-5 w-5 text-white" aria-hidden />
        </div>
        <div>
          <h2 id="birthday-alerts-heading" className="text-lg font-semibold text-[#1F2937]">
            Birthday alerts
          </h2>
          <p className="text-sm text-gray-600 mt-0.5">
            Nearest customer birthdays among your active orders — plan delivery or a message around their day.
          </p>
        </div>
      </div>

      <ul className="space-y-3">
        {rows.map((d) => {
          const next = getNextBirthdayDate(d.dob!);
          const whenLabel =
            d.daysUntil === 0
              ? 'Today'
              : d.daysUntil === 1
                ? 'Tomorrow'
                : `In ${d.daysUntil} days`;
          const urgency =
            d.daysUntil === 0
              ? 'bg-[#EC4899] text-white'
              : d.daysUntil <= 7
                ? 'bg-amber-100 text-[#1F2937] border border-amber-200'
                : 'bg-white text-[#1F2937] border border-gray-100';

          return (
            <li
              key={d.id}
              className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 rounded-xl px-4 py-3 ${urgency}`}
            >
              <div className="min-w-0">
                <p className={`font-medium truncate ${d.daysUntil === 0 ? 'text-white' : 'text-[#1F2937]'}`}>
                  {d.recipientName}
                </p>
                <p
                  className={`text-xs mt-0.5 ${d.daysUntil === 0 ? 'text-white/90' : 'text-gray-600'}`}
                >
                  DOB {formatDobDisplay(d.dob!)} · Cake delivery {formatDate(d.deliveryDate)}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0 text-sm">
                <CalendarDays
                  className={`h-4 w-4 shrink-0 ${d.daysUntil === 0 ? 'text-white' : 'text-gray-600'}`}
                  aria-hidden
                />
                <div className="text-right sm:text-left">
                  <p className={`font-semibold ${d.daysUntil === 0 ? 'text-white' : 'text-[#1F2937]'}`}>{whenLabel}</p>
                  {next ? (
                    <p className={`text-xs ${d.daysUntil === 0 ? 'text-white/85' : 'text-gray-600'}`}>
                      {next.toLocaleDateString(undefined, {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                  ) : null}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
