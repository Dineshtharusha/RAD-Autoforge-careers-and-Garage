import { Request, Response } from 'express';

interface DiagnosticResponse {
  issueTitle: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  potentialCauses: string[];
  recommendedServices: string[];
  estimatedCostRange: string;
  safetyAdvice: string;
  suggestedAction: string;
}

export const diagnoseVehicleIssue = async (req: Request, res: Response): Promise<void> => {
  try {
    const { symptoms, vehicleMake, vehicleModel, vehicleYear, mileage } = req.body;

    if (!symptoms) {
      res.status(400).json({ success: false, message: 'Please describe the symptoms or issues your vehicle is experiencing.' });
      return;
    }

    const symptomsLower = symptoms.toLowerCase();
    let diagnostic: DiagnosticResponse;

    if (symptomsLower.includes('brake') || symptomsLower.includes('squeak') || symptomsLower.includes('grind') || symptomsLower.includes('stopping')) {
      diagnostic = {
        issueTitle: 'Braking System Friction Wear & Rotor Scoring',
        severity: 'High',
        potentialCauses: [
          'Worn brake pads approaching or exceeding minimum thickness (below 3mm)',
          'Glazed brake rotors causing high-frequency harmonic vibration/squeal',
          'Uneven caliper pin lubrication or sticking piston',
        ],
        recommendedServices: ['Brake Service & Pad Replacement', 'Rotor Resurfacing / OEM Upgrade', 'Full System Inspection'],
        estimatedCostRange: '$180 - $390',
        safetyAdvice: 'Reduced stopping power directly impacts safety. Avoid emergency stops and service within 100 miles.',
        suggestedAction: 'Book an immediate AutoForge Precision Brake Inspection at your nearest workshop.',
      };
    } else if (symptomsLower.includes('oil') || symptomsLower.includes('leak') || symptomsLower.includes('smoke') || symptomsLower.includes('burning')) {
      diagnostic = {
        issueTitle: 'Engine Lubrication Degradation or Seal Seepage',
        severity: 'High',
        potentialCauses: [
          'Valve cover gasket or oil pan gasket minor seepage',
          'Thermal breakdown of aged synthetic oil',
          'PCV valve clogging leading to crankcase pressure buildup',
        ],
        recommendedServices: ['High-Performance Synthetic Oil & Filter Service', 'Engine Leak Pressure Test', 'Diagnostics'],
        estimatedCostRange: '$120 - $280',
        safetyAdvice: 'Check oil dipstick immediately. Do not operate engine if oil level is below the minimum hash mark.',
        suggestedAction: 'Schedule a High-Performance Oil Change with OEM factory filters.',
      };
    } else if (symptomsLower.includes('vibrat') || symptomsLower.includes('shake') || symptomsLower.includes('tire') || symptomsLower.includes('pull')) {
      diagnostic = {
        issueTitle: 'Wheel Imbalance or Suspension Alignment Deviation',
        severity: 'Medium',
        potentialCauses: [
          'Dynamic wheel imbalance or lost balance wheel weights',
          'Camber / Caster / Toe tracking misalignment from pothole impact',
          'Uneven tire tread cupping or radial pull',
        ],
        recommendedServices: ['Tire Services & Laser Wheel Alignment', 'Road-Force Balancing'],
        estimatedCostRange: '$95 - $190',
        safetyAdvice: 'Prolonged driving with misalignment causes rapid tire destruction and decreases highway stability.',
        suggestedAction: 'Schedule high-precision computerized wheel alignment and tire rotation.',
      };
    } else if (symptomsLower.includes('check engine') || symptomsLower.includes('code') || symptomsLower.includes('stutter') || symptomsLower.includes('misfire')) {
      diagnostic = {
        issueTitle: 'Powertrain Control Module (PCM) Error & Ignition/Fuel Misfire',
        severity: 'Critical',
        potentialCauses: [
          'Ignition coil degradation or fouled spark plug electrodes',
          'Mass Air Flow (MAF) sensor or O2 oxygen sensor feedback error',
          'Fuel injector delivery inconsistency',
        ],
        recommendedServices: ['Advanced Computer Diagnostics', 'Engine Repair & Tuning', 'Spark Plug & Coil Pack Service'],
        estimatedCostRange: '$150 - $450',
        safetyAdvice: 'If the check engine light is flashing, stop driving immediately to prevent catalytic converter damage.',
        suggestedAction: 'Book an AI-Assisted AutoForge Computer Diagnostic session with OEM telemetry scanners.',
      };
    } else {
      diagnostic = {
        issueTitle: `${vehicleMake || 'Vehicle'} Comprehensive Health Assessment`,
        severity: 'Medium',
        potentialCauses: [
          'Normal mechanical wear on auxiliary components',
          'Fluid breakdown across cooling, steering, or transmission systems',
          'Sensor recalibration needed after mileage threshold',
        ],
        recommendedServices: ['Advanced Diagnostics', 'Comprehensive 72-Point Inspection'],
        estimatedCostRange: '$110 - $260',
        safetyAdvice: 'Keep track of any unusual sounds or warning indicators on your instrument cluster.',
        suggestedAction: 'Bring your vehicle to any AutoForge certified workshop for an on-lift diagnostic scan.',
      };
    }

    res.json({
      success: true,
      data: {
        vehicle: `${vehicleYear || ''} ${vehicleMake || ''} ${vehicleModel || ''}`.trim() || 'General Vehicle',
        symptomsAnalyzed: symptoms,
        analysis: diagnostic,
        analyzedAt: new Date().toISOString(),
        poweredBy: 'AutoForge AI Diagnostic Engine v2.0 (Powered by Gemini Architecture)',
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

