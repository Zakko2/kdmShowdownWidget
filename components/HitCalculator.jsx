'use client';  // Add this at the top of the file

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';

const HitCalculator = () => {
  const [survivorAccuracy, setSurvivorAccuracy] = useState(0);
  const [weaponAccuracy, setWeaponAccuracy] = useState(0);
  const [monsterEvasion, setMonsterEvasion] = useState(0);
  const [inBlindSpot, setInBlindSpot] = useState(false);
  const [monsterKnockedDown, setMonsterKnockedDown] = useState(false);
  const [requiredRoll, setRequiredRoll] = useState(0);

  useEffect(() => {
    if (monsterKnockedDown) {
      setRequiredRoll(3);
      return;
    }

    let total = weaponAccuracy + monsterEvasion - survivorAccuracy - (inBlindSpot ? 1 : 0);
    total = Math.max(2, Math.min(10, total)); // Clamp between 2 and 10
    setRequiredRoll(total);
  }, [survivorAccuracy, weaponAccuracy, monsterEvasion, inBlindSpot, monsterKnockedDown]);

  const StatInput = ({ label, value, onChange }) => (
    <div>
      <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
      <input 
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
    </div>
  );

  const Checkbox = ({ id, label, checked, onChange }) => (
    <div className="flex items-center space-x-2">
      <input 
        type="checkbox"
        id={id}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
      />
      <label htmlFor={id} className="text-sm text-gray-600">{label}</label>
    </div>
  );

  return (
    <Card className="w-full max-w-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Hit Calculator</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <StatInput 
              label="Survivor Accuracy"
              value={survivorAccuracy}
              onChange={setSurvivorAccuracy}
            />
            <StatInput 
              label="Weapon Accuracy"
              value={weaponAccuracy}
              onChange={setWeaponAccuracy}
            />
            <StatInput 
              label="Monster Evasion"
              value={monsterEvasion}
              onChange={setMonsterEvasion}
            />
          </div>
          
          <div className="space-y-2 border-t border-b py-4">
            <Checkbox 
              id="blindSpot"
              label="Attacking from Blind Spot (+1 accuracy)"
              checked={inBlindSpot}
              onChange={setInBlindSpot}
            />
            <Checkbox 
              id="knockedDown"
              label="Monster is Knocked Down (hits on 3+)"
              checked={monsterKnockedDown}
              onChange={setMonsterKnockedDown}
            />
          </div>

          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Required Roll</h3>
            <p className="text-3xl font-bold text-gray-900">{requiredRoll}+</p>
            <p className="text-xs text-gray-500 mt-2">
              Lantern 10 always hits • 1 always misses
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HitCalculator;
