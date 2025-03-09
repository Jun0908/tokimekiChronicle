// components/CharacterSelect.tsx
import React from "react";

export type CharacterType = {
  name: string;
  value: string;
};

export const Characters: CharacterType[] = [
  { name: "shizuku", value: "shizuku" },
  { name: "rei", value: "rei" },
  { name: "Vitalik", value: "vitalik" },
];

type Props = {
  selected: CharacterType;
  onChange: (char: CharacterType) => void;
};

export default function CharacterSelect({ selected, onChange }: Props) {
  return (
    <div className="flex gap-4 p-4">
      <label className="font-medium">Select Character:</label>
      <select
        className="p-2 border rounded-md"
        onChange={(e) => {
          const selectedChar = Characters.find((c) => c.value === e.target.value);
          if (selectedChar) onChange(selectedChar);
        }}
        value={selected.value}
      >
        {Characters.map((char) => (
          <option key={char.value} value={char.value}>
            {char.name}
          </option>
        ))}
      </select>
    </div>
  );
}
