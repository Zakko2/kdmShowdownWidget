'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Plus, Minus, Sword, Target, Share2, Copy, ChevronUp } from 'lucide-react';

const BottomSheet = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState('');
  const version = "v0.1.0";

  const handleShare = async () => {
    try {
      await navigator.share({
        title: 'KDM Hit Calculator',
        text: 'Check out this useful calculator for Kingdom Death: Monster!',
        url: window.location.href
      });
    } catch (error) {
      console.log('Share failed:', error);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopySuccess('Copied!');
      setTimeout(() => setCopySuccess(''), 2000);
    } catch (err) {
      setCopySuccess('Failed to copy');
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 flex flex-col items-center">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-1 rounded-full bg-gray-700 mb-1 mt-1"
        aria-label="Toggle info panel"
      />
      
      <div 
        className={`w-full bg-gray-800 border-t border-gray-700 transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="p-4 flex flex-col items-center space-y-3">
          {navigator.share && (
            <button
              onClick={handleShare}
              className="flex items-center space-x-2 px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 transition-colors w-48"
            >
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
          )}
          
          <button
            onClick={handleCopyLink}
            className="flex items-center space-x-2 px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 transition-colors w-48"
          >
            <Copy className="w-4 h-4" />
            <span>{copySuccess || 'Copy Link'}</span>
          </button>

          <div className="text-sm text-gray-400 pt-2">
            {version}
          </div>
        </div>
      </div>
    </div>
  );
};

const ShareButton = () => {
  const [isPwa, setIsPwa] = useState(false);

  useEffect(() => {
    // Check if running as installed PWA
    const isStandalone = window.navigator.standalone || // iOS
      window.matchMedia('(display-mode: standalone)').matches; // Android/Desktop
    setIsPwa(isStandalone);
  }, []);

  const handleShare = async () => {
    try {
      await navigator.share({
        title: 'KDM Hit Calculator',
        text: 'Check out this useful calculator for Kingdom Death: Monster!',
        url: window.location.href
      });
    } catch (error) {
      console.log('Share failed:', error);
    }
  };

  if (!isPwa || !navigator.share) return null;

  return (
    <button
      onClick={handleShare}
      className="fixed bottom-4 right-4 w-12 h-12 flex items-center justify-center rounded-full bg-blue-500 hover:bg-blue-600 active:bg-blue-700 transition-colors shadow-lg"
      aria-label="Share app"
    >
      <Share2 className="w-6 h-6 text-white" />
    </button>
  );
};

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

const RollSummary = ({ hitRoll, woundRoll, currentPage, setCurrentPage }) => (
  <div className="grid grid-cols-2 gap-2 p-2 bg-gray-800">
    <button
      onClick={() => setCurrentPage('hit')}
      className={`text-center p-3 rounded transition-colors ${
        currentPage === 'hit' 
          ? 'bg-gray-700 ring-1 ring-blue-500' 
          : 'hover:bg-gray-700/50'
      }`}
    >
      <div className="flex items-center justify-center space-x-2">
        <Target className="w-5 h-5 text-gray-300" />
        <span className="text-sm font-medium text-gray-300">To Hit</span>
      </div>
      <p className="text-2xl font-bold text-gray-100 mt-1">{hitRoll}+</p>
    </button>
    <button
      onClick={() => setCurrentPage('wound')}
      className={`text-center p-3 rounded transition-colors ${
        currentPage === 'wound' 
          ? 'bg-gray-700 ring-1 ring-blue-500' 
          : 'hover:bg-gray-700/50'
      }`}
    >
      <div className="flex items-center justify-center space-x-2">
        <Sword className="w-5 h-5 text-gray-300" />
        <span className="text-sm font-medium text-gray-300">To Wound</span>
      </div>
      <p className="text-2xl font-bold text-gray-100 mt-1">{woundRoll}+</p>
    </button>
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
  let criticalText = "Lantern 10";
  const netLuck = luck - monsterLuck;
  
  if (monsterLuck > luck) {
    criticalText = "Not possible";
  } else if (netLuck > 0) {
    const criticalValue = Math.max(2, 10 - netLuck);
    criticalText = criticalValue === 10 ? "Lantern 10" : `${criticalValue}+`;
  }

  return (
    <Card className="w-full h-full bg-gray-900 border-gray-700 overflow-hidden flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl text-center text-gray-200">Wound Calculator</CardTitle>
      </CardHeader>
      <CardContent className="p-3 flex-1 min-h-0 overflow-y-auto">
        <div className="flex flex-col h-full space-y-3">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 mb-3">
            <StatInput 
              label="Weapon Strength"
              value={weaponStrength}
              onChange={setWeaponStrength}
            />
            <StatInput 
              label="Survivor Strength"
              value={survivorStrength}
              onChange={setSurvivorStrength}
            />
            <StatInput 
              label="Monster Toughness"
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
            <div className="space-y-1 text-xs text-gray-500">
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
    <Card className="w-full h-full bg-gray-900 border-gray-700 overflow-hidden flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl text-center text-gray-200">Hit Calculator</CardTitle>
      </CardHeader>
      <CardContent className="p-3 flex-1 min-h-0 overflow-y-auto">
        <div className="flex flex-col h-full space-y-3">
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
            <p className="text-xs text-gray-500">
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
  const [monsterLuck, setMonsterLuck] = useState(0);
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

  // Wound calculator effect
  React.useEffect(() => {
    let required = monsterToughness - weaponStrength - survivorStrength;
    required = Math.max(2, Math.min(9, required));
    setWoundRequiredRoll(required);
  }, [weaponStrength, survivorStrength, monsterToughness]);

  return (
    <div className="fixed inset-0 flex flex-col bg-black overflow-hidden">
      <RollSummary 
        hitRoll={hitRequiredRoll} 
        woundRoll={woundRequiredRoll}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
      <div className="flex-1 p-2 sm:p-4 min-h-0">
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
      <BottomSheet />
      <ShareButton />
    </div>
  );
};

export default CalculatorApp;
