import { Input } from '../../../shared/components/ui/input';
import { Label } from '../../../shared/components/ui/label';

type DateRangeFilterProps = {
  start: string;
  end: string;
  onStartChange: (v: string) => void;
  onEndChange: (v: string) => void;
};

export function DateRangeFilter({ start, end, onStartChange, onEndChange }: DateRangeFilterProps) {
  return (
    <div className="flex flex-wrap items-end gap-3">
      <div className="space-y-1">
        <Label htmlFor="filter-start" className="text-xs text-gray-500">
          From
        </Label>
        <Input
          id="filter-start"
          type="date"
          value={start}
          onChange={(e) => onStartChange(e.target.value)}
          className="h-9 w-[140px] border-[#FBCFE8] focus-visible:ring-[#EC4899]"
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="filter-end" className="text-xs text-gray-500">
          To
        </Label>
        <Input
          id="filter-end"
          type="date"
          value={end}
          onChange={(e) => onEndChange(e.target.value)}
          className="h-9 w-[140px] border-[#FBCFE8] focus-visible:ring-[#EC4899]"
        />
      </div>
    </div>
  );
}
