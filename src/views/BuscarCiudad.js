import { Data } from "../components/json/Data"
import React, { useState } from "react";

export default function BuscarCiudad() {
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);

  const handleCommunityChange = (event) => {
    setSelectedCommunity(event.target.value);
    setSelectedCity(null);
  };

  const handleCityChange = (event) => {
    setSelectedCity(event.target.value);
  };

  const handleCitySearch = (event) => {
    event.preventDefault();
  };
    return (
    <div>
      <h1>Selecciona una comunidad autónoma</h1>
      <select value={selectedCommunity} onChange={handleCommunityChange}>
        <option value={null}>Selecciona una comunidad</option>
        {Object.keys(Data).map((community) => (
          <option key={community} value={community}>
            {community}
          </option>
        ))}
      </select>
      {selectedCommunity && (
        <div>
          <h2>Selecciona una ciudad de {selectedCommunity}</h2>
          <select value={selectedCity} onChange={handleCityChange}>
            <option value={null}>Selecciona una ciudad</option>
            {Data[selectedCommunity].map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
          <form onSubmit={handleCitySearch}>
            <label>
              Buscar ciudad:
              <input type="text" />
            </label>
            <button type="submit">Buscar</button>
          </form>
        </div>
      )}
    </div>
  );




}