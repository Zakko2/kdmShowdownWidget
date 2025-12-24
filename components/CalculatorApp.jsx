'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Plus, Minus, Sword, Target, Share2, Copy, Zap, ZapOff } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

// --- Theme Configuration ---
const THEMES = [
  {
    name: 'Mint',
    baseColor: '#BDD3C1', // Pale Sage
    bgClass: 'bg-[#BDD3C1]',
    textPrimary: 'text-gray-900',
    textSecondary: 'text-gray-700',
    cardBg: 'bg-white/40',
    buttonBg: 'bg-emerald-900/10 hover:bg-emerald-900/20',
    buttonIcon: 'text-emerald-900',
    activeRing: 'ring-emerald-700',
    dotActive: 'bg-emerald-900',
    dotInactive: 'bg-emerald-900/30'
  },
  {
    name: 'Blue',
    baseColor: '#6A95D4', // Cornflower
    bgClass: 'bg-[#6A95D4]',
    textPrimary: 'text-gray-950',
    textSecondary: 'text-gray-800',
    cardBg: 'bg-white/30',
    buttonBg: 'bg-blue-900/10 hover:bg-blue-900/20',
    buttonIcon: 'text-blue-900',
    activeRing: 'ring-blue-800',
    dotActive: 'bg-blue-900',
    dotInactive: 'bg-blue-900/30'
  },
  {
    name: 'Brown',
    baseColor: '#6D5831', // Deep Umber
    bgClass: 'bg-[#6D5831]',
    textPrimary: 'text-gray-50',
    textSecondary: 'text-gray-300',
    cardBg: 'bg-black/30',
    buttonBg: 'bg-yellow-100/10 hover:bg-yellow-100/20',
    buttonIcon: 'text-yellow-100',
    activeRing: 'ring-yellow-500',
    dotActive: 'bg-yellow-100',
    dotInactive: 'bg-yellow-100/30'
  },
  {
    name: 'Red',
    baseColor: '#C97B63', // Terracotta
    bgClass: 'bg-[#C97B63]',
    textPrimary: 'text-gray-950',
    textSecondary: 'text-gray-900',
    cardBg: 'bg-white/30',
    buttonBg: 'bg-red-900/10 hover:bg-red-900/20',
    buttonIcon: 'text-red-900',
    activeRing: 'ring-red-900',
    dotActive: 'bg-red-900',
    dotInactive: 'bg-red-900/30'
  }
];

// --- Shared Components ---

const StatInput = ({ label, value, onChange, theme }) => {
  const increment = () => onChange(Math.min(value + 1, 99));
  const decrement = () => onChange(Math.max(value - 1, -99));

  return (
    <div className="flex flex-col items-center space-y-2">
      <label className={`text-sm font-medium ${theme.textSecondary}`}>{label}</label>
      <div className="flex items-center justify-center w-full space-x-3">
        <button
          onClick={decrement}
          className={`w-12 h-12 flex items-center justify-center rounded-full transition-colors ${theme.buttonBg}`}
        >
          <Minus className={`w-6 h-6 ${theme.buttonIcon}`} />
        </button>
        <div className={`w-12 text-center text-xl font-bold ${theme.textPrimary}`}>{value}</div>
        <button
          onClick={increment}
          className={`w-12 h-12 flex items-center justify-center rounded-full transition-colors ${theme.buttonBg}`}
        >
          <Plus className={`w-6 h-6 ${theme.buttonIcon}`} />
        </button>
      </div>
    </div>
  );
};

const Checkbox = ({ id, label, checked, onChange, theme }) => (
  <div className="flex items-center space-x-2 p-2">
    <input
      type="checkbox"
      id={id}
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className={`h-6 w-6 rounded border-gray-500 bg-opacity-20 ${theme.buttonBg} focus:${theme.activeRing}`}
    />
    <label htmlFor={id} className={`text-base ${theme.textSecondary}`}>{label}</label>
  </div>
);

const RollSummary = ({ hitRoll, woundRoll, currentPage, setCurrentPage, theme }) => (
  <div className={`grid grid-cols-2 gap-2 p-2 ${theme.cardBg} backdrop-blur-sm shadow-sm rounded-b-xl mb-4 mx-2`}>
    <button
      onClick={() => setCurrentPage('hit')}
      className={`text-center p-3 rounded-lg transition-all ${currentPage === 'hit'
        ? `${theme.buttonBg} ring-2 ${theme.activeRing}`
        : 'hover:bg-black/5'
        }`}
    >
      <div className="flex items-center justify-center space-x-2">
        <Target className={`w-5 h-5 ${theme.textSecondary}`} />
        <span className={`text-sm font-medium ${theme.textSecondary}`}>To Hit</span>
      </div>
      <p className={`text-2xl font-bold ${theme.textPrimary} mt-1`}>{hitRoll}+</p>
    </button>
    <button
      onClick={() => setCurrentPage('wound')}
      className={`text-center p-3 rounded-lg transition-all ${currentPage === 'wound'
        ? `${theme.buttonBg} ring-2 ${theme.activeRing}`
        : 'hover:bg-black/5'
        }`}
    >
      <div className="flex items-center justify-center space-x-2">
        <Sword className={`w-5 h-5 ${theme.textSecondary}`} />
        <span className={`text-sm font-medium ${theme.textSecondary}`}>To Wound</span>
      </div>
      <p className={`text-2xl font-bold ${theme.textPrimary} mt-1`}>{woundRoll}+</p>
    </button>
  </div>
);

const WoundCalculator = ({
  weaponStrength, setWeaponStrength,
  survivorStrength, setSurvivorStrength,
  monsterToughness, setMonsterToughness,
  luck, setLuck,
  monsterLuck, setMonsterLuck,
  theme
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
    <Card className={`w-full h-full border-none shadow-lg ${theme.cardBg} backdrop-blur-md overflow-hidden flex flex-col`}>
      <CardHeader className="pb-2">
        <CardTitle className={`text-xl text-center ${theme.textPrimary}`}>Wound Calculator</CardTitle>
      </CardHeader>
      <CardContent className="p-3 flex-1 min-h-0 overflow-y-auto">
        <div className="flex flex-col h-full space-y-3">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 mb-3">
            <StatInput
              label="Weapon Strength"
              value={weaponStrength}
              onChange={setWeaponStrength}
              theme={theme}
            />
            <StatInput
              label="Survivor Strength"
              value={survivorStrength}
              onChange={setSurvivorStrength}
              theme={theme}
            />
            <StatInput
              label="Monster Toughness"
              value={monsterToughness}
              onChange={setMonsterToughness}
              theme={theme}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <StatInput
              label="Survivor Luck"
              value={luck}
              onChange={setLuck}
              theme={theme}
            />
            <StatInput
              label="Monster Luck"
              value={monsterLuck}
              onChange={setMonsterLuck}
              theme={theme}
            />
          </div>

          <div className={`rounded-lg p-4 text-center mt-auto ${theme.buttonBg}`}>
            <div className={`space-y-1 text-xs ${theme.textSecondary}`}>
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
  theme
}) => {
  return (
    <Card className={`w-full h-full border-none shadow-lg ${theme.cardBg} backdrop-blur-md overflow-hidden flex flex-col`}>
      <CardHeader className="pb-2">
        <CardTitle className={`text-xl text-center ${theme.textPrimary}`}>Hit Calculator</CardTitle>
      </CardHeader>
      <CardContent className="p-3 flex-1 min-h-0 overflow-y-auto">
        <div className="flex flex-col h-full space-y-3">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <StatInput
              label="Survivor Accuracy"
              value={survivorAccuracy}
              onChange={setSurvivorAccuracy}
              theme={theme}
            />
            <StatInput
              label="Weapon Accuracy"
              value={weaponAccuracy}
              onChange={setWeaponAccuracy}
              theme={theme}
            />
            <StatInput
              label="Monster Evasion"
              value={monsterEvasion}
              onChange={setMonsterEvasion}
              theme={theme}
            />
          </div>

          <div className={`border-t border-b border-black/10 py-2`}>
            <Checkbox
              id="blindSpot"
              label="Attacking from Blind Spot (+1 accuracy)"
              checked={inBlindSpot}
              onChange={setInBlindSpot}
              theme={theme}
            />
            <Checkbox
              id="knockedDown"
              label="Monster is Knocked Down (hits on 3+)"
              checked={monsterKnockedDown}
              onChange={setMonsterKnockedDown}
              theme={theme}
            />
          </div>

          <div className={`rounded-lg p-4 text-center mt-auto ${theme.buttonBg}`}>
            <p className={`text-xs ${theme.textSecondary}`}>
              Lantern 10 always hits • 1 always misses
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// --- Main Application ---
const CalculatorApp = () => {
  const [currentPage, setCurrentPage] = useState('hit');
  const [isOpen, setIsOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState('');
  const [activeSurvivorIndex, setActiveSurvivorIndex] = useState(0);
  const version = "v0.2.0";

  // Initial State Factory
  const createSurvivor = () => ({
    accuracy: 0,
    strength: 0,
    luck: 0,
    weaponAccuracy: 0,
    weaponStrength: 0,
    blindSpot: false
  });

  // Unique State: Survivors
  const [survivors, setSurvivors] = useState([
    createSurvivor(),
    createSurvivor(),
    createSurvivor(),
    createSurvivor()
  ]);

  // Shared State: Monster
  const [monster, setMonster] = useState({
    toughness: 0,
    evasion: 0,
    luck: 0,
    knockedDown: false
  });

  // Wake Lock state
  const [isWakeLockActive, setIsWakeLockActive] = useState(false);
  const wakeLockRef = useRef(null);
  const [wakeLockSupported, setWakeLockSupported] = useState(false);

  // Helpers
  const currentSurvivor = survivors[activeSurvivorIndex];
  const theme = THEMES[activeSurvivorIndex];

  const updateSurvivor = (field, value) => {
    setSurvivors(prev => {
      const newSurvivors = [...prev];
      newSurvivors[activeSurvivorIndex] = {
        ...newSurvivors[activeSurvivorIndex],
        [field]: value
      };
      return newSurvivors;
    });
  };

  const updateMonster = (field, value) => {
    setMonster(prev => ({ ...prev, [field]: value }));
  };

  // Derived Calculations
  const calculateHitRoll = () => {
    if (monster.knockedDown) return 3;
    let total = currentSurvivor.weaponAccuracy + monster.evasion - currentSurvivor.accuracy - (currentSurvivor.blindSpot ? 1 : 0);
    return Math.max(2, Math.min(10, total));
  };

  const calculateWoundRoll = () => {
    let required = monster.toughness - currentSurvivor.weaponStrength - currentSurvivor.strength;
    return Math.max(2, Math.min(9, required));
  };

  const hitRequiredRoll = calculateHitRoll();
  const woundRequiredRoll = calculateWoundRoll();

  // Navigation Logic
  const handleDragEnd = (event, info) => {
    const threshold = 50;
    if (info.offset.x < -threshold) {
      // Swipe Left -> Next
      setActiveSurvivorIndex((prev) => (prev + 1) % 4);
    } else if (info.offset.x > threshold) {
      // Swipe Right -> Prev
      setActiveSurvivorIndex((prev) => (prev - 1 + 4) % 4);
    }
  };

  // Wake Lock Logic
  useEffect(() => {
    if ('wakeLock' in navigator) {
      setWakeLockSupported(true);
    }
  }, []);

  const requestWakeLock = async () => {
    try {
      const lock = await navigator.wakeLock.request('screen');
      wakeLockRef.current = lock;
      setIsWakeLockActive(true);
      lock.addEventListener('release', () => {
        setIsWakeLockActive(false);
        wakeLockRef.current = null;
      });
    } catch (err) {
      console.error(err);
      setIsWakeLockActive(false);
    }
  };

  const releaseWakeLock = async () => {
    if (wakeLockRef.current) {
      await wakeLockRef.current.release();
      wakeLockRef.current = null;
      setIsWakeLockActive(false);
    }
  };

  const toggleWakeLock = () => {
    if (isWakeLockActive) releaseWakeLock();
    else requestWakeLock();
  };

  const handleShare = async () => {
    if (typeof window !== 'undefined' && window.navigator && window.navigator.share) {
      try {
        await window.navigator.share({
          title: 'KDM Hit Calculator',
          text: 'Check out this useful calculator for Kingdom Death: Monster!',
          url: window.location.href
        });
      } catch (error) {
        console.log('Share failed:', error);
      }
    }
  };

  const handleCopyLink = async () => {
    if (typeof window !== 'undefined' && window.navigator && window.navigator.clipboard) {
      try {
        await window.navigator.clipboard.writeText(window.location.href);
        setCopySuccess('Copied!');
        setTimeout(() => setCopySuccess(''), 2000);
      } catch (err) {
        setCopySuccess('Failed');
      }
    }
  };

  const [canShare, setCanShare] = useState(false);
  useEffect(() => {
    if (typeof window !== 'undefined' && window.navigator && window.navigator.share) {
      setCanShare(true);
    }
  }, []);

  return (
    <div className={`fixed inset-0 flex flex-col transition-colors duration-500 ease-in-out overflow-hidden ${theme.bgClass}`}>

      {/* Header */}
      <div className={`pt-4 pb-0 text-center ${theme.textPrimary}`}>
        <h1 className="text-sm font-bold opacity-70 tracking-widest uppercase">Survivor {activeSurvivorIndex + 1}</h1>
      </div>

      <RollSummary
        hitRoll={hitRequiredRoll}
        woundRoll={woundRequiredRoll}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        theme={theme}
      />

      <div className="flex-1 min-h-0 relative overflow-hidden">
        <AnimatePresence mode='wait' initial={false}>
          <motion.div
            key={activeSurvivorIndex}
            className="absolute inset-0 p-2 sm:p-4 pb-20"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
          >
            {currentPage === 'hit' ? (
              <HitCalculator
                survivorAccuracy={currentSurvivor.accuracy}
                setSurvivorAccuracy={(v) => updateSurvivor('accuracy', v)}
                weaponAccuracy={currentSurvivor.weaponAccuracy}
                setWeaponAccuracy={(v) => updateSurvivor('weaponAccuracy', v)}
                monsterEvasion={monster.evasion}
                setMonsterEvasion={(v) => updateMonster('evasion', v)}
                inBlindSpot={currentSurvivor.blindSpot}
                setInBlindSpot={(v) => updateSurvivor('blindSpot', v)}
                monsterKnockedDown={monster.knockedDown}
                setMonsterKnockedDown={(v) => updateMonster('knockedDown', v)}
                requiredRoll={hitRequiredRoll}
                theme={theme}
              />
            ) : (
              <WoundCalculator
                weaponStrength={currentSurvivor.weaponStrength}
                setWeaponStrength={(v) => updateSurvivor('weaponStrength', v)}
                survivorStrength={currentSurvivor.strength}
                setSurvivorStrength={(v) => updateSurvivor('strength', v)}
                monsterToughness={monster.toughness}
                setMonsterToughness={(v) => updateMonster('toughness', v)}
                luck={currentSurvivor.luck}
                setLuck={(v) => updateSurvivor('luck', v)}
                monsterLuck={monster.luck}
                setMonsterLuck={(v) => updateMonster('luck', v)}
                requiredRoll={woundRequiredRoll}
                theme={theme}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dots Indicator */}
      <div className="fixed bottom-20 left-0 right-0 flex justify-center space-x-2 pointer-events-none">
        {THEMES.map((t, idx) => (
          <div
            key={idx}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === activeSurvivorIndex ? `${t.dotActive} scale-125` : t.dotInactive
              }`}
          />
        ))}
      </div>

      {/* Bottom Menu Button */}
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Share Button (Toggle) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-4 right-4 w-12 h-12 rounded-full shadow-lg z-30 flex items-center justify-center transition-colors ${theme.buttonBg} backdrop-blur-md`}
        aria-label="Show share options"
      >
        <Share2 className={`w-6 h-6 ${theme.textPrimary}`} />
      </button>

      {/* Share Panel */}
      <div
        className={`fixed bottom-0 left-0 right-0 ${theme.cardBg} backdrop-blur-xl border-t border-white/10 transition-transform duration-300 ease-in-out z-30 ${isOpen ? 'translate-y-0' : 'translate-y-full'
          }`}
      >
        <div className="p-6 flex flex-col items-center space-y-4">
          {canShare && (
            <button
              onClick={handleShare}
              className={`flex items-center space-x-3 px-6 py-3 rounded-xl transition-colors w-64 justify-center ${theme.buttonBg}`}
            >
              <Share2 className={`w-5 h-5 ${theme.textPrimary}`} />
              <span className={`font-medium ${theme.textPrimary}`}>Share</span>
            </button>
          )}

          <button
            onClick={handleCopyLink}
            className={`flex items-center space-x-3 px-6 py-3 rounded-xl transition-colors w-64 justify-center ${theme.buttonBg}`}
          >
            <Copy className={`w-5 h-5 ${theme.textPrimary}`} />
            <span className={`font-medium ${theme.textPrimary}`}>{copySuccess || 'Copy Link'}</span>
          </button>

          {wakeLockSupported && (
            <button
              onClick={toggleWakeLock}
              className={`flex items-center space-x-3 px-6 py-3 rounded-xl transition-all w-64 justify-center ${isWakeLockActive
                ? `${theme.activeRing} ring-2 bg-white/10`
                : theme.buttonBg
                }`}
            >
              {isWakeLockActive ? (
                <Zap className={`w-5 h-5 ${theme.textPrimary}`} fill="currentColor" />
              ) : (
                <ZapOff className={`w-5 h-5 ${theme.textPrimary}`} />
              )}
              <span className={`font-medium ${theme.textPrimary}`}>{isWakeLockActive ? 'Screen Awake' : 'Keep Awake'}</span>
            </button>
          )}

          <div className={`text-sm ${theme.textSecondary} pt-2 opacity-50`}>
            {version}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalculatorApp;
