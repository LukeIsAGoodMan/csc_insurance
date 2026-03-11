import { useState, useMemo, useCallback } from "react";

/* ────────────────────────────────────────────────────────────
   useQuoteEngine — Multi-step state machine + premium calc.

   Steps: 0 Location → 1 Vehicle → 2 Driver → 3 Summary
   Premium: illustrative formula, not real underwriting.
   ──────────────────────────────────────────────────────────── */

export interface QuoteFormData {
  province: string;
  city: string;
  vehicleYear: string;
  vehicleType: string;
  driverAge: string;
  experience: string;
  accidents: string;
}

const INITIAL: QuoteFormData = {
  province: "",
  city: "",
  vehicleYear: "",
  vehicleType: "",
  driverAge: "",
  experience: "",
  accidents: "",
};

/* ── Factor tables ── */
const PROVINCE_FACTOR: Record<string, number> = {
  ON: 1.0, BC: 1.1, AB: 0.9, QC: 1.05,
  MB: 0.95, SK: 0.92, NB: 0.88, NS: 0.9, PE: 0.85, NL: 0.93,
};

const CITY_FACTOR: Record<string, number> = {
  toronto: 1.35, mississauga: 1.2, brampton: 1.25, hamilton: 1.1,
  ottawa: 1.05, vancouver: 1.3, calgary: 1.05, montreal: 1.1,
};

const VEHICLE_TYPE_FACTOR: Record<string, number> = {
  sedan: 1.0, suv: 1.1, truck: 1.05, sports: 1.4, other: 1.0,
};

const BASE_ANNUAL = 1500;

function calcPremium(d: QuoteFormData): number {
  if (!d.province) return 0;

  const prov = PROVINCE_FACTOR[d.province] ?? 1.0;
  const city = CITY_FACTOR[d.city.toLowerCase().trim()] ?? 1.0;

  const yr = parseInt(d.vehicleYear, 10);
  const vehAge = isNaN(yr) ? 1.0 : yr >= 2024 ? 1.2 : yr >= 2020 ? 1.0 : 0.85;
  const vehType = VEHICLE_TYPE_FACTOR[d.vehicleType] ?? 1.0;

  const age = parseInt(d.driverAge, 10);
  const ageFactor = isNaN(age) ? 1.0 : age < 25 ? 1.5 : age > 65 ? 1.15 : 1.0;

  const exp = parseInt(d.experience, 10);
  const expFactor = isNaN(exp) ? 1.0 : exp < 2 ? 1.3 : exp < 5 ? 1.1 : 1.0;

  const acc = parseInt(d.accidents, 10);
  const accFactor = isNaN(acc) ? 1.0 : acc === 0 ? 1.0 : acc === 1 ? 1.25 : 1.6;

  return (BASE_ANNUAL * prov * city * vehAge * vehType * ageFactor * expFactor * accFactor) / 12;
}

/* ── Step validation ── */
function canAdvanceFrom(step: number, d: QuoteFormData): boolean {
  switch (step) {
    case 0: return d.province !== "";
    case 1: return d.vehicleYear !== "" && d.vehicleType !== "";
    case 2: return d.driverAge !== "" && d.experience !== "" && d.accidents !== "";
    default: return false;
  }
}

export const STEP_LABELS = ["Location", "Vehicle", "Driver", "Summary"] as const;

export function useQuoteEngine() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<QuoteFormData>(INITIAL);

  const setField = useCallback(<K extends keyof QuoteFormData>(key: K, value: QuoteFormData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  }, []);

  const canAdvance = useMemo(() => canAdvanceFrom(step, formData), [step, formData]);
  const premium = useMemo(() => calcPremium(formData), [formData]);

  const nextStep = useCallback(() => {
    if (canAdvance && step < 3) setStep((s) => s + 1);
  }, [canAdvance, step]);

  const prevStep = useCallback(() => {
    if (step > 0) setStep((s) => s - 1);
  }, [step]);

  return { step, formData, setField, nextStep, prevStep, premium, canAdvance };
}
