'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Plus, Minus, Sword, Target } from 'lucide-react';

const StatInput = ({ label, value, onChange }) => {
  const increment = () => onChange(Math.min(value + 1, 99));
  const decrement = () => onChange(Math.max(value - 1, -99));

  return (
    <div className="flex flex-col items-center space-y-2">
      <label className="text-sm font-medium text-gray-300">{label}</label>
      <div className="flex items-center justify-center w-full space-x-3">
        <button
          onClick={decrement}
          className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-800 hover:bg-gray-700 active:bg-gray-600 transition-colors"
        >
          <Minus className="w-6 h-6 text-gray-300" />
        </button>
        <div className="w-12 text-center text-xl font-bold text-gray-200">{value}</div>
        <button
          onClick={increment}
          className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-800 hover:bg-gray-700 active:bg-gray-600 transition-colors"
        >
          <Plus className="w-6 h-6 text-gray-300" />
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
      className="h-6 w-6 rounded border-gray-600 bg-gray-800 text-blue-500 focus:ring-blue-500"
    />
    <label htmlFor={id} className="text-base text-gray-300">{label}</label>
  </div>
);

const WoundCalculator = ({ 
  weaponStrength, setWeaponStrength,
  survivorStrength, setSurvivorStrength,
  monsterToughness, setMonsterToughness,
  luck, setLuck,
  monsterLuck, setMonsterLuck,
  requiredRoll 
}) => {
  // Calculate if and when critical wounds are possible
  let criticalText = "Lantern 10";
  
  // Compare survivor and monster luck first
  const netLuck = luck - monsterLuck;
  
  if (monsterLuck > luck) {
    // If monster luck exceeds survivor luck, no crits possible
    criticalText = "Not possible";
  } else if (netLuck > 0) {
    // Only reduce crit threshold if survivor luck exceeds monster luck
    // 10 - netLuck gives us the minimum roll needed
    // Math.max(2, ...) ensures we never go below 2
    const criticalValue = Math.max(2, 10 - netLuck);
    criticalText = criticalValue === 10 ? "Lantern 10" : `${criticalValue}+`;
  }

  return (
    <Card className="w-full h-full bg-gray-900 border-gray-700">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl text-center text-gray-200">Wound Calculator</CardTitle>
      </CardHeader>
      <CardContent className="p-3 h-full">
        <div className="flex flex-col h-full space-y-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 mb-3">
            <StatInput 
              label="Weapon Str"
              value={weaponStrength}
              onChange={setWeaponStrength}
            />
            <StatInput 
              label="Survivor Str"
              value={survivorStrength}
              onChange={setSurvivorStrength}
            />
            <StatInput 
              label="Monster Tough"
              value={monsterToughness}
              onChange={setMonsterToughness}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <StatInput 
              label="Survivor Luck"
              value={luck}
              onChange={setLuck}
            />
            <StatInput 
              label="Monster Luck"
              value={monsterLuck}
              onChange={setMonsterLuck}
            />
          </div>

          <div className="bg-gray-800 rounded-lg p-4 text-center mt-auto">
            <h3 className="text-sm font-medium text-gray-400 mb-1">Required Roll</h3>
            <p className="text-4xl font-bold text-gray-100">{requiredRoll}+</p>
            <div className="space-y-1 mt-2 text-xs text-gray-500">
              <p>1 always fails • Lantern 10 always wounds</p>
              <p>Critical Wound on: {criticalText}</p>
              <p>Critical wounds cancel all reactions</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const HitCalculator = ({
  survivorAccuracy, setSurvivorAccuracy,
  weaponAccuracy, setWeaponAccuracy,
  monsterEvasion, setMonsterEvasion,
  inBlindSpot, setInBlindSpot,
  monsterKnockedDown, setMonsterKnockedDown,
  requiredRoll
}) => {
  return (
    <Card className="w-full h-full bg-gray-900 border-gray-700">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl text-center text-gray-200">Hit Calculator</CardTitle>
      </CardHeader>
      <CardContent className="p-3 h-full">
        <div className="flex flex-col h-full space-y-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
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
          
          <div className="border-t border-b border-gray-700 py-2">
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

          <div className="bg-gray-800 rounded-lg p-4 text-center mt-auto">
            <h3 className="text-sm font-medium text-gray-400 mb-1">Required Roll</h3>
            <p className="text-4xl font-bold text-gray-100">{requiredRoll}+</p>
            <p className="text-xs text-gray-500 mt-1">
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
  
  // Hit calculator state
  const [survivorAccuracy, setSurvivorAccuracy] = useState(0);
  const [weaponAccuracy, setWeaponAccuracy] = useState(0);
  const [monsterEvasion, setMonsterEvasion] = useState(0);
  const [inBlindSpot, setInBlindSpot] = useState(false);
  const [monsterKnockedDown, setMonsterKnockedDown] = useState(false);
  const [hitRequiredRoll, setHitRequiredRoll] = useState(0);

  // Wound calculator state
  const [weaponStrength, setWeaponStrength] = useState(0);
  const [survivorStrength, setSurvivorStrength] = useState(0);
  const [monsterToughness, setMonsterToughness] = useState(0);
  const [luck, setLuck] = useState(0);
  const [woundRequiredRoll, setWoundRequiredRoll] = useState(0);

  // Hit calculator effect
  React.useEffect(() => {
    if (monsterKnockedDown) {
      setHitRequiredRoll(3);
      return;
    }

    let total = weaponAccuracy + monsterEvasion - survivorAccuracy - (inBlindSpot ? 1 : 0);
    total = Math.max(2, Math.min(10, total));
    setHitRequiredRoll(total);
  }, [survivorAccuracy, weaponAccuracy, monsterEvasion, inBlindSpot, monsterKnockedDown]);

  const [monsterLuck, setMonsterLuck] = useState(0);  // Add this with other wound calculator state

  // Wound calculator effect
  React.useEffect(() => {
    let required = monsterToughness - weaponStrength - survivorStrength;
    required = Math.max(2, Math.min(9, required));
    setWoundRequiredRoll(required);
  }, [weaponStrength, survivorStrength, monsterToughness]);

  return (
    <div className="h-screen flex flex-col bg-black">
      <div className="flex-1 flex flex-col h-[calc(100vh-64px)]">
        <div className="flex-1 p-2 sm:p-4">
          {currentPage === 'hit' ? (
            <HitCalculator 
              survivorAccuracy={survivorAccuracy}
              setSurvivorAccuracy={setSurvivorAccuracy}
              weaponAccuracy={weaponAccuracy}
              setWeaponAccuracy={setWeaponAccuracy}
              monsterEvasion={monsterEvasion}
              setMonsterEvasion={setMonsterEvasion}
              inBlindSpot={inBlindSpot}
              setInBlindSpot={setInBlindSpot}
              monsterKnockedDown={monsterKnockedDown}
              setMonsterKnockedDown={setMonsterKnockedDown}
              requiredRoll={hitRequiredRoll}
            />
          ) : (
            <WoundCalculator 
              weaponStrength={weaponStrength}
              setWeaponStrength={setWeaponStrength}
              survivorStrength={survivorStrength}
              setSurvivorStrength={setSurvivorStrength}
              monsterToughness={monsterToughness}
              setMonsterToughness={setMonsterToughness}
              luck={luck}
              setLuck={setLuck}
              monsterLuck={monsterLuck}
              setMonsterLuck={setMonsterLuck}
              requiredRoll={woundRequiredRoll}
            />
          )}
        </div>
      </div>
      
      <div className="h-16 bg-gray-900 border-t border-gray-700">
        <div className="flex justify-around h-full">
          <button
            onClick={() => setCurrentPage('hit')}
            className={`flex flex-col items-center justify-center flex-1 mx-1 ${
              currentPage === 'hit' ? 'bg-gray-800 text-blue-400' : 'text-gray-400'
            }`}
          >
            <Target className="w-6 h-6" />
            <span className="text-sm mt-1">To Hit</span>
          </button>
          <button
            onClick={() => setCurrentPage('wound')}
            className={`flex flex-col items-center justify-center flex-1 mx-1 ${
              currentPage === 'wound' ? 'bg-gray-800 text-blue-400' : 'text-gray-400'
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
