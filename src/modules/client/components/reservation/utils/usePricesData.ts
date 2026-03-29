import type { PricesData } from '../types';
import { usePrices } from '@/modules/shared/hooks';

export function usePricesData(): PricesData {
  const { prices: rawPrices } = usePrices();
  // Force numeric conversion — API returns prices as strings ("20.00")
  return {
    earlyCheckInPrice: Number(rawPrices.earlyCheckInPrice),
    lateCheckOutPrice: Number(rawPrices.lateCheckOutPrice),
    transferOneWayPrice: Number(rawPrices.transferOneWayPrice),
    transferRoundTripPrice: Number(rawPrices.transferRoundTripPrice),
    breakfastPrice: Number(rawPrices.breakfastPrice),
  };
}

