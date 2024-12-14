'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Plus, Minus, Sword, Target } from 'lucide-react';

const WoundCalculator = () => {
  return (
    <Card className="w-full h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl text-center">Wound Calculator</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500 text-lg">Coming Soon</p>
        </div>
      </CardContent>
    </Card>
  );
};

const HitCalculator = () => {
  const [survivorAccuracy, setSurvivorAccuracy] = useState(0);
  const [weaponAccuracy, setWeaponAccuracy] = useState(0);
  const [monsterEvasion, setMonsterEvasion] = useState(0);
  const [inBlindSpot, setInBlindSpot] = useState(false);
  const [monsterKnockedDown, setMonsterKnockedDown] = useState(false);
  const [requiredRoll, setRequiredRoll] = useState(0);

  React.useEffect(() => {
    if (monsterKnockedDown) {
      setRequiredRoll(3);
      return;
    }

    let total = weaponAccuracy + monsterEvasion - survivorAccuracy - (inBlindSpot ? 1 : 0);
    total = Math.max(2, Math.min(10, total));
    setRequiredRoll(total);
  }, [survivorAccuracy, weaponAccuracy, monsterEvasion, inBlindSpot, monsterKnockedDown]);

  const StatInput = ({ label, value, onChange }) => {
    const increment = () => onChange(Math.min(value + 1, 10));
    const decrement = () => onChange(Math.max(value - 1, -10));

    return (
      <div className="flex flex-col items-center space-y-2">
        <label className="text-sm font-medium text-gray-600">{label}</label>
        <div className="flex items-center justify-center w-full space-x-3">
          <button
            onClick={decrement}
            className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 active:bg-gray-300 transition-colors"
          >
            <Minus className="w-6 h-6 text-gray-600" />
          </button>
          <div className="w-12 text-center text-xl font-bold">{value}</div>
          <button
            onClick={increment}
            className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 active:bg-gray-300 transition-colors"
          >
            <Plus className="w-6 h-6 text-gray-600" />
          </button>
        </div>
      </div>
    );
  };

  const Checkbox = ({ id, label, checked, onChange }) => (
    <div className="flex items-center space-x-2 p-2">
      <input 
        type="checkbox"
        id={id}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-6 w-6 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
      />
      <label htmlFor={id} className="text-base text-gray-600">{label}</label>
    </div>
  );

  return (
    <Card className="w-full h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl text-center">Hit Calculator</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
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

          <div className="bg-gray-50 rounded-lg p-6 text-center">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Required Roll</h3>
            <p className="text-4xl font-bold text-gray-900">{requiredRoll}+</p>
            <p className="text-xs text-gray-500 mt-2">
              Lantern 10 always hits • 1 always misses
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const CalculatorApp = () => {
  const [currentPage, setCurrentPage] = useState('hit');

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 p-4">
        {currentPage === 'hit' ? <HitCalculator /> : <WoundCalculator />}
      </div>
      
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t">
        <div className="flex justify-around p-2">
          <button
            onClick={() => setCurrentPage('hit')}
            className={`flex flex-col items-center p-2 rounded-lg flex-1 mx-1 ${
              currentPage === 'hit' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'
            }`}
          >
            <Target className="w-6 h-6" />
            <span className="text-sm mt-1">To Hit</span>
          </button>
          <button
            onClick={() => setCurrentPage('wound')}
            className={`flex flex-col items-center p-2 rounded-lg flex-1 mx-1 ${
              currentPage === 'wound' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'
            }`}
          >
            <Sword className="w-6 h-6" />
            <span className="text-sm mt-1">To Wound</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CalculatorApp;
