// Hook to load hostal prices from settings (public endpoint)

import { useState, useEffect } from 'react';
import { settingsService, PricesResponse } from '../services/settings.service';

const DEFAULT_PRICES: PricesResponse = {
  earlyCheckInPrice: 0,
  lateCheckOutPrice: 0,
  transferOneWayPrice: 0,
  transferRoundTripPrice: 0,
  breakfastPrice: 0,
};

export function usePrices() {
  const [prices, setPrices] = useState<PricesResponse>(DEFAULT_PRICES);
  const [loadingPrices, setLoadingPrices] = useState(true);

  useEffect(() => {
    settingsService
      .getPrices()
      .then(setPrices)
      .catch((err) => console.error('Error loading prices:', err))
      .finally(() => setLoadingPrices(false));
  }, []);

  return { prices, loadingPrices };
}

