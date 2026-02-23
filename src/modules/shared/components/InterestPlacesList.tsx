import * as React from "react";
import { interestPlaces } from "@/modules/shared/data/interestPlaces";

export default function InterestPlacesList() {
  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Lugares de interés turístico cercanos a Villa D2</h2>
      <ul className="list-disc pl-6 space-y-2">
        {interestPlaces.map((place, idx) => (
          <li key={idx}>
            {place.url ? (
              <a href={place.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                {place.name}
              </a>
            ) : (
              <span>{place.name}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
