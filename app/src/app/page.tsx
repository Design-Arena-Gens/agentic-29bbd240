'use client';

import { useMemo, useState } from "react";
import {
  ModeType,
  RoomDimensions,
  RoomMode,
  evaluatePressureField,
  generateRoomModes,
} from "@/lib/roomModes";
import { RoomControls } from "@/components/RoomControls";
import { ModeList } from "@/components/ModeList";
import { RoomVisualizer } from "@/components/RoomVisualizer";

const INITIAL_DIMENSIONS: RoomDimensions = {
  length: 7.4,
  width: 5.2,
  height: 2.9,
};

const INITIAL_MAX_FREQUENCY = 300;

const INITIAL_SELECTION = generateRoomModes(
  INITIAL_DIMENSIONS,
  INITIAL_MAX_FREQUENCY
)
  .slice(0, 6)
  .map((mode) => mode.id);

export default function Home() {
  const [dimensions, setDimensions] =
    useState<RoomDimensions>({ ...INITIAL_DIMENSIONS });
  const [maxFrequency, setMaxFrequency] =
    useState(INITIAL_MAX_FREQUENCY);
  const [sliceHeight, setSliceHeight] = useState(1.2);
  const [modeFilter, setModeFilter] = useState<ModeType | "all">(
    "all"
  );
  const [selectedIds, setSelectedIds] =
    useState<string[]>(INITIAL_SELECTION);

  const modes = useMemo(
    () => generateRoomModes(dimensions, maxFrequency),
    [dimensions, maxFrequency]
  );

  const selectedSet = useMemo(
    () => new Set(selectedIds),
    [selectedIds]
  );

  const filteredModes = useMemo(() => {
    if (modeFilter === "all") return modes;
    return modes.filter((mode) => mode.type === modeFilter);
  }, [modeFilter, modes]);

  const activeModes = useMemo(() => {
    return modes.filter((mode) => selectedSet.has(mode.id));
  }, [modes, selectedSet]);

  const field = useMemo(() => {
    if (activeModes.length === 0) return null;
    return evaluatePressureField(dimensions, activeModes);
  }, [dimensions, activeModes]);

  const clampedSliceHeight = Math.min(
    sliceHeight,
    dimensions.height
  );

  const handleDimensionChange = (next: RoomDimensions) => {
    setDimensions(next);
    setSliceHeight((prev) => Math.min(prev, next.height));
  };

  const handleToggleMode = (mode: RoomMode) => {
    setSelectedIds((prev) => {
      const exists = prev.includes(mode.id);
      if (exists) {
        return prev.filter((id) => id !== mode.id);
      }
      return [...prev, mode.id];
    });
  };

  const handleIsolateMode = (mode: RoomMode) => {
    setSelectedIds([mode.id]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 py-12 text-zinc-100">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 lg:grid lg:grid-cols-[340px,minmax(0,1fr)]">
        <div className="space-y-6">
          <div className="space-y-3">
            <h1 className="text-2xl font-semibold lg:text-3xl">
              Advanced Rectangular Room Mode Calculator
            </h1>
            <p className="text-sm text-zinc-300">
              Hochpräzise Analyse axialer, tangentialer und obliquer
              Eigenmoden im rechteckigen Raum mit Echtzeit-Visualisierung
              des Schalldruckfelds.
            </p>
          </div>
          <RoomControls
            dimensions={dimensions}
            onDimensionChange={handleDimensionChange}
            maxFrequency={maxFrequency}
            onMaxFrequencyChange={setMaxFrequency}
            sliceHeight={clampedSliceHeight}
            onSliceHeightChange={setSliceHeight}
          />
          <ModeList
            modes={filteredModes}
            selectedModeIds={selectedSet}
            onToggleMode={handleToggleMode}
            onIsolateMode={handleIsolateMode}
            dominantType={modeFilter}
            onFilterType={setModeFilter}
          />
        </div>
        <div className="space-y-6">
          <RoomVisualizer
            field={field}
            sliceHeight={clampedSliceHeight}
          />
        </div>
      </div>
    </div>
  );
}
