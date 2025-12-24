'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Plus, Minus, Sword, Target, Share2, Copy, Zap, ZapOff } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

// --- Theme Configuration ---
const THEMES = [
  {
    name: 'Mint',
    // Background: Very pale version
    bgMain: 'bg-[#F2F8F3]',
    // Card: The Base Color (#BDD3C1)
    cardBg: 'bg-[#BDD3C1]/90',
    // Text on Card (Mint is light, so Dark text)
    textPrimary: 'text-emerald-950',
    textSecondary: 'text-emerald-800',
    // Buttons: Darker emerald
    buttonBg: 'bg-emerald-900/10 hover:bg-emerald-900/20 active:bg-emerald-900/30',
    buttonIcon: 'text-emerald-950',
    activeRing: 'ring-emerald-800',
    dotActive: 'bg-emerald-800',
    dotInactive: 'bg-emerald-800/20'
  },
  {
    name: 'Blue',
    // Background: Very pale version
    bgMain: 'bg-[#F0F6FF]',
    // Card: The Base Color (#6A95D4)
    cardBg: 'bg-[#6A95D4]/90',
    // Text on Card (This blue is mid-tone, White text looks premium/cleaner, or very dark blue)
    // Let's try White for primary text to pop against the blue.
    textPrimary: 'text-white',
    textSecondary: 'text-blue-50',
    // Buttons: White/Light
    buttonBg: 'bg-white/20 hover:bg-white/30 active:bg-white/40',
    buttonIcon: 'text-white',
    activeRing: 'ring-white',
    dotActive: 'bg-[#6A95D4]',
    dotInactive: 'bg-[#6A95D4]/30'
  },
  {
    name: 'Brown',
    // Background: Very pale beige/tan
    bgMain: 'bg-[#F5F2EA]',
    // Card: The Base Color (#6D5831)
    cardBg: 'bg-[#6D5831]/90',
    // Text on Card (Dark brown background -> White text)
    textPrimary: 'text-amber-50',
    textSecondary: 'text-amber-200',
    // Buttons
    buttonBg: 'bg-amber-100/10 hover:bg-amber-100/20 active:bg-amber-100/30',
    buttonIcon: 'text-amber-50',
    activeRing: 'ring-amber-200',
    dotActive: 'bg-[#6D5831]',
    dotInactive: 'bg-[#6D5831]/30'
  },
  {
    name: 'Red',
    // Background: Very pale peach
    bgMain: 'bg-[#FFF5F2]',
    // Card: The Base Color (#C97B63)
    cardBg: 'bg-[#C97B63]/90',
    // Text on Card (Terracotta is warm mid-tone, White often looks best)
    textPrimary: 'text-white',
    textSecondary: 'text-orange-50',
    // Buttons
    buttonBg: 'bg-white/20 hover:bg-white/30 active:bg-white/40',
    buttonIcon: 'text-white',
    activeRing: 'ring-white',
    dotActive: 'bg-[#C97B63]',
    dotInactive: 'bg-[#C97B63]/30'
  }
];

// --- Shared Components ---

const StatInput = ({ label, value, onChange, theme }) => {
  const increment = () => onChange(Math.min(value + 1, 99));
  const decrement = () => onChange(Math.max(value - 1, -99));

  return (
    <div className="flex flex-col items-center space-y-1">
      <label className={`text-xs uppercase tracking-wider font-semibold ${theme.textSecondary}`}>{label}</label>
      <div className="flex items-center justify-center w-full space-x-3">
        <button
          onClick={decrement}
          className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${theme.buttonBg}`}
        >
          <Minus className={`w-5 h-5 ${theme.buttonIcon}`} />
        </button>
        <div className={`w-8 text-center text-xl font-bold ${theme.textPrimary}`}>{value}</div>
        <button
          onClick={increment}
          className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${theme.buttonBg}`}
        >
          <Plus className={`w-5 h-5 ${theme.buttonIcon}`} />
        </button>
      </div>
    </div>
  );
};

const Checkbox = ({ id, label, checked, onChange, theme }) => (
  <div
    onClick={() => onChange(!checked)}
    className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${theme.buttonBg}`}
  >
    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${checked ? 'bg-white/30 border-transparent' : 'border-current opacity-50'}`}>
      {checked && <div className={`w-3 h-3 rounded-sm bg-current`} />}
    </div>
    <label htmlFor={id} className={`text-sm font-medium ${theme.textPrimary} cursor-pointer select-none`}>{label}</label>
  </div>
);

const RollSummary = ({ hitRoll, woundRoll, currentPage, setCurrentPage, theme }) => (
  <div className={`grid grid-cols-2 gap-3 mb-2 mx-4 mt-2`}>
    <button
      onClick={() => setCurrentPage('hit')}
      className={`relative text-center p-3 rounded-xl transition-all shadow-sm ${currentPage === 'hit'
        ? `${theme.cardBg} ring-2 ring-offset-2 ring-offset-[#F2F8F3] ${theme.activeRing}`
        : `${theme.cardBg} opacity-60 hover:opacity-80`
        } ring-offset-transparent`}
      style={{ '--tw-ring-offset-color': 'transparent' }} // Simplified ring logic
    >
      <div className="flex items-center justify-center space-x-2">
        <Target className={`w-4 h-4 ${theme.textSecondary}`} />
        <span className={`text-xs font-bold uppercase tracking-wide ${theme.textSecondary}`}>To Hit</span>
      </div>
      <p className={`text-3xl font-black ${theme.textPrimary} mt-0`}>{hitRoll}+</p>
    </button>
    <button
      onClick={() => setCurrentPage('wound')}
      className={`relative text-center p-3 rounded-xl transition-all shadow-sm ${currentPage === 'wound'
        ? `${theme.cardBg} ring-2 ring-offset-2 ring-offset-transparent ${theme.activeRing}`
        : `${theme.cardBg} opacity-60 hover:opacity-80`
        }`}
    >
      <div className="flex items-center justify-center space-x-2">
        <Sword className={`w-4 h-4 ${theme.textSecondary}`} />
        <span className={`text-xs font-bold uppercase tracking-wide ${theme.textSecondary}`}>To Wound</span>
      </div>
      <p className={`text-3xl font-black ${theme.textPrimary} mt-0`}>{woundRoll}+</p>
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
    <Card className={`w-full h-full border-none shadow-lg ${theme.cardBg} flex flex-col`}>
      <CardContent className="p-4 flex-1 flex flex-col space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
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

        <div className="grid grid-cols-2 gap-4">
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

        <div className={`rounded-xl p-3 text-center mt-auto ${theme.buttonBg} backdrop-blur-sm`}>
          <div className={`space-y-1 text-xs font-medium ${theme.textSecondary}`}>
            <p>1 always fails • Lantern 10 always wounds</p>
            <p className={`text-sm font-bold ${theme.textPrimary}`}>Crit: {criticalText}</p>
            <p>Criticals cancel reactions</p>
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
    <Card className={`w-full h-full border-none shadow-lg ${theme.cardBg} flex flex-col`}>
      <CardContent className="p-4 flex-1 flex flex-col space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
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

        <div className="space-y-2 py-2">
          <Checkbox
            id="blindSpot"
            label="Attacking from Blind Spot (+1 acc)"
            checked={inBlindSpot}
            onChange={setInBlindSpot}
            theme={theme}
          />
          <Checkbox
            id="knockedDown"
            label="Monster is Knocked Down (3+)"
            checked={monsterKnockedDown}
            onChange={setMonsterKnockedDown}
            theme={theme}
          />
        </div>

        <div className={`rounded-xl p-3 text-center mt-auto ${theme.buttonBg} backdrop-blur-sm`}>
          <p className={`text-xs font-medium ${theme.textSecondary}`}>
            Lantern 10 always hits • 1 always misses
          </p>
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
  const version = "v0.3.0";

  // Initial State Factory
  const createSurvivor = () => ({
    accuracy: 0,
    strength: 0,
    luck: 0,
    weaponAccuracy: 0,
    weaponStrength: 0,
    blindSpot: false
  });

  const [survivors, setSurvivors] = useState([
    createSurvivor(),
    createSurvivor(),
    createSurvivor(),
    createSurvivor()
  ]);

  const [monster, setMonster] = useState({
    toughness: 0,
    evasion: 0,
    luck: 0,
    knockedDown: false
  });

  const [isWakeLockActive, setIsWakeLockActive] = useState(false);
  const wakeLockRef = useRef(null);
  const [wakeLockSupported, setWakeLockSupported] = useState(false);

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

  const handleDragEnd = (event, info) => {
    const threshold = 50;
    if (info.offset.x < -threshold) {
      setActiveSurvivorIndex((prev) => (prev + 1) % 4);
    } else if (info.offset.x > threshold) {
      setActiveSurvivorIndex((prev) => (prev - 1 + 4) % 4);
    }
  };

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
    <div className={`fixed inset-0 flex flex-col transition-colors duration-500 ease-in-out overflow-hidden`}>

      {/* Header */}
      <div className={`pt-2 pb-0 text-center`}>
        {/* Using active dot color for text to tie it together, or just dark gray */}
        <h1 className={`text-xs font-black uppercase tracking-[0.2em] opacity-80 text-white`}>Survivor {activeSurvivorIndex + 1}</h1>
      </div>

      <RollSummary
        hitRoll={hitRequiredRoll}
        woundRoll={woundRequiredRoll}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        theme={theme}
      />

      {/* Main Content Area - Reduced Padding */}
      <div className="flex-1 min-h-0 relative overflow-hidden">
        <AnimatePresence mode='wait' initial={false}>
          <motion.div
            key={activeSurvivorIndex}
            className="absolute inset-0 px-4 pb-2"
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

      {/* Dots Indicator - Moved to bottom area but integrated */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 pointer-events-none z-10">
        {THEMES.map((t, idx) => (
          <div
            key={idx}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === activeSurvivorIndex ? `${t.dotActive} scale-125` : t.dotInactive
              }`}
          />
        ))}
      </div>

      {/* Share Button (transparent/unobtrusive) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-0 right-0 p-4 opacity-90 hover:opacity-100 transition-opacity z-20`}
        aria-label="Show menu"
      >
        <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-black/60 shadow-lg backdrop-blur-sm`}>
          <Share2 className={`w-5 h-5 text-white`} />
        </div>
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Share Panel */}
      <div
        className={`fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 transition-transform duration-300 ease-in-out z-40 ${isOpen ? 'translate-y-0' : 'translate-y-full'
          }`}
      >
        <div className="p-6 flex flex-col items-center space-y-4">
          <h2 className="text-gray-900 font-bold text-lg">Menu</h2>

          {canShare && (
            <button
              onClick={handleShare}
              className={`flex items-center space-x-3 px-6 py-3 rounded-xl bg-gray-100 w-64 justify-center text-gray-900`}
            >
              <Share2 className={`w-5 h-5`} />
              <span className={`font-medium`}>Share</span>
            </button>
          )}

          <button
            onClick={handleCopyLink}
            className={`flex items-center space-x-3 px-6 py-3 rounded-xl bg-gray-100 w-64 justify-center text-gray-900`}
          >
            <Copy className={`w-5 h-5`} />
            <span className={`font-medium`}>{copySuccess || 'Copy Link'}</span>
          </button>

          {wakeLockSupported && (
            <button
              onClick={toggleWakeLock}
              className={`flex items-center space-x-3 px-6 py-3 rounded-xl transition-all w-64 justify-center ${isWakeLockActive
                ? `bg-blue-600 text-white`
                : `bg-gray-100 text-gray-900`
                }`}
            >
              {isWakeLockActive ? (
                <Zap className={`w-5 h-5`} fill="currentColor" />
              ) : (
                <ZapOff className={`w-5 h-5`} />
              )}
              <span className={`font-medium`}>{isWakeLockActive ? 'Screen Awake' : 'Keep Awake'}</span>
            </button>
          )}

          <div className={`text-xs text-gray-400 pt-2`}>
            {version}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalculatorApp;
