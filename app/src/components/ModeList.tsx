import { RoomMode, ModeType } from "@/lib/roomModes";

const typeLabels: Record<ModeType, string> = {
  axial: "Axial",
  tangential: "Tangential",
  oblique: "Schräg",
};

interface ModeListProps {
  modes: RoomMode[];
  selectedModeIds: Set<string>;
  onToggleMode: (mode: RoomMode) => void;
  onIsolateMode?: (mode: RoomMode) => void;
  dominantType?: ModeType | "all";
  onFilterType?: (type: ModeType | "all") => void;
}

export function ModeList({
  modes,
  selectedModeIds,
  onToggleMode,
  onIsolateMode,
  dominantType = "all",
  onFilterType,
}: ModeListProps) {
  return (
    <section className="space-y-4 rounded-2xl border border-zinc-200 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/60">
      <header className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Modenübersicht
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Wähle relevante Eigenmoden bis zum aktuellen Grenzbereich.
          </p>
        </div>
        {onFilterType && (
          <select
            value={dominantType}
            onChange={(event) =>
              onFilterType(
                event.target.value as ModeType | "all"
              )
            }
            className="rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-sm font-medium text-zinc-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
          >
            <option value="all">Alle</option>
            <option value="axial">Axial</option>
            <option value="tangential">Tangential</option>
            <option value="oblique">Schräg</option>
          </select>
        )}
      </header>

      <div className="max-h-64 space-y-2 overflow-y-auto pr-1">
        {modes.map((mode) => {
          const active = selectedModeIds.has(mode.id);
          return (
            <button
              key={mode.id}
              type="button"
              onClick={() => onToggleMode(mode)}
              className={`flex w-full items-center justify-between rounded-xl border px-3 py-2 text-left transition ${
                active
                  ? "border-indigo-400/60 bg-indigo-50 text-indigo-900 shadow-sm dark:border-indigo-500/50 dark:bg-indigo-950/40 dark:text-indigo-100"
                  : "border-transparent bg-zinc-100/30 text-zinc-700 hover:border-zinc-200 hover:bg-zinc-100 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
              }`}
            >
              <div>
                <p className="text-sm font-semibold">
                  {mode.frequency.toFixed(1)} Hz
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  ({mode.n}, {mode.m}, {mode.l}) · {typeLabels[mode.type]}
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                <span>deg {mode.degeneracy}</span>
                {onIsolateMode && (
                  <span
                    className="rounded-lg border border-zinc-200 px-2 py-1 text-[11px] uppercase tracking-wide text-zinc-600 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-indigo-500 dark:hover:bg-indigo-950/40 dark:hover:text-indigo-300"
                    onClick={(event) => {
                      event.stopPropagation();
                      onIsolateMode(mode);
                    }}
                  >
                    Solo
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}

