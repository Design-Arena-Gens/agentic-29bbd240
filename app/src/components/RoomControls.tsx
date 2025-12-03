import { RoomDimensions } from "@/lib/roomModes";
import { ChangeEvent } from "react";

interface RoomControlsProps {
  dimensions: RoomDimensions;
  onDimensionChange: (next: RoomDimensions) => void;
  maxFrequency: number;
  onMaxFrequencyChange: (value: number) => void;
  sliceHeight: number;
  onSliceHeightChange: (value: number) => void;
}

export function RoomControls({
  dimensions,
  onDimensionChange,
  maxFrequency,
  onMaxFrequencyChange,
  sliceHeight,
  onSliceHeightChange,
}: RoomControlsProps) {
  const handleDimensionChange =
    (key: keyof RoomDimensions) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      const value = Number(event.target.value);
      if (Number.isNaN(value) || value <= 0) return;
      onDimensionChange({ ...dimensions, [key]: value });
    };

  return (
    <section className="space-y-6 rounded-2xl border border-zinc-200 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/60">
      <header>
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          Raumparameter
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Dimensionen in Metern und berechnetes Frequenzband.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <label className="flex flex-col gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Länge (X)
          <input
            type="number"
            min={1}
            step={0.1}
            value={dimensions.length}
            onChange={handleDimensionChange("length")}
            className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-inner focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
          />
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Breite (Z)
          <input
            type="number"
            min={1}
            step={0.1}
            value={dimensions.width}
            onChange={handleDimensionChange("width")}
            className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-inner focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
          />
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Höhe (Y)
          <input
            type="number"
            min={1}
            step={0.1}
            value={dimensions.height}
            onChange={handleDimensionChange("height")}
            className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-inner focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
          />
        </label>
      </div>

      <div className="space-y-2">
        <label className="flex items-center justify-between text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Max. Frequenzbereich
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            {maxFrequency.toFixed(0)} Hz
          </span>
        </label>
        <input
          type="range"
          min={50}
          max={500}
          step={10}
          value={maxFrequency}
          onChange={(event) =>
            onMaxFrequencyChange(Number(event.target.value))
          }
          className="w-full accent-indigo-500"
        />
      </div>

      <div className="space-y-2">
        <label className="flex items-center justify-between text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Slice Höhe
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            {sliceHeight.toFixed(2)} m
          </span>
        </label>
        <input
          type="range"
          min={0}
          max={dimensions.height}
          step={0.05}
          value={Math.min(sliceHeight, dimensions.height)}
          onChange={(event) =>
            onSliceHeightChange(Number(event.target.value))
          }
          className="w-full accent-indigo-500"
        />
      </div>
    </section>
  );
}

