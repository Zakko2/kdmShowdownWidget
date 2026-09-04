'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Plus, Minus, Sword, Target, Share2, Copy, Zap, ZapOff, Tv, Check, RotateCcw, ChevronLeft, ChevronRight, Pencil } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import TvFourPlayerView from '@/components/TvFourPlayerView';
import { WEAPON_TRAITS, TRAIT_CATEGORIES, getWeaponLuckBonus, createWeapon } from '@/lib/weaponTraits';
import {
  saveSurvivorsToStorage,
  loadSurvivorsFromStorage,
  clearSurvivorsStorage,
  saveViewPreferences,
  loadViewPreferences
} from '@/lib/storage';

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
    <div className="flex flex-col items-center justify-center p-1 sm:p-2 rounded-xl bg-black/10 backdrop-blur-xs">
      <label className={`text-[9px] sm:text-xs uppercase tracking-wider font-bold ${theme.textSecondary} truncate mb-0.5 text-center`}>
        {label}
      </label>
      <div className="flex items-center justify-center w-full space-x-1 sm:space-x-2.5">
        <button
          type="button"
          onClick={decrement}
          className={`w-7 h-7 sm:w-10 sm:h-10 flex items-center justify-center rounded-full transition-colors ${theme.buttonBg} active:scale-95`}
          aria-label={`Decrease ${label}`}
        >
          <Minus className={`w-3.5 h-3.5 sm:w-5 sm:h-5 ${theme.buttonIcon}`} />
        </button>
        <div className={`w-6 sm:w-8 text-center text-base sm:text-xl font-black ${theme.textPrimary}`}>
          {value}
        </div>
        <button
          type="button"
          onClick={increment}
          className={`w-7 h-7 sm:w-10 sm:h-10 flex items-center justify-center rounded-full transition-colors ${theme.buttonBg} active:scale-95`}
          aria-label={`Increase ${label}`}
        >
          <Plus className={`w-3.5 h-3.5 sm:w-5 sm:h-5 ${theme.buttonIcon}`} />
        </button>
      </div>
    </div>
  );
};

const Checkbox = ({ id, label, checked, onChange, theme }) => (
  <div
    onClick={() => onChange(!checked)}
    className={`flex items-center space-x-2 p-2 rounded-xl cursor-pointer transition-colors ${
      checked ? 'bg-black/20 ring-1 ring-current' : 'bg-black/10 hover:bg-black/15'
    }`}
  >
    <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
      checked ? 'bg-white/40 border-transparent text-white' : 'border-current opacity-60'
    }`}>
      {checked && <Check className="w-3 h-3 stroke-[3]" />}
    </div>
    <label htmlFor={id} className={`text-xs font-semibold ${theme.textPrimary} cursor-pointer select-none truncate`}>
      {label}
    </label>
  </div>
);

const RollSummary = ({ hitRoll, woundRoll, currentPage, setCurrentPage, theme }) => (
  <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-1.5 sm:mb-2 mx-4 mt-1 sm:mt-2">
    <button
      onClick={() => setCurrentPage('hit')}
      className={`relative text-center p-2 sm:p-3 rounded-xl transition-all shadow-sm ${currentPage === 'hit'
        ? `${theme.cardBg} ring-2 ring-offset-2 ring-offset-[#F2F8F3] ${theme.activeRing}`
        : `${theme.cardBg} opacity-60 hover:opacity-80`
        } ring-offset-transparent`}
      style={{ '--tw-ring-offset-color': 'transparent' }}
    >
      <div className="flex items-center justify-center space-x-1.5">
        <Target className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${theme.textSecondary}`} />
        <span className={`text-[10px] sm:text-xs font-bold uppercase tracking-wide ${theme.textSecondary}`}>To Hit</span>
      </div>
      <p className={`text-2xl sm:text-3xl font-black ${theme.textPrimary} mt-0`}>{hitRoll}+</p>
    </button>
    <button
      onClick={() => setCurrentPage('wound')}
      className={`relative text-center p-2 sm:p-3 rounded-xl transition-all shadow-sm ${currentPage === 'wound'
        ? `${theme.cardBg} ring-2 ring-offset-2 ring-offset-transparent ${theme.activeRing}`
        : `${theme.cardBg} opacity-60 hover:opacity-80`
        }`}
    >
      <div className="flex items-center justify-center space-x-1.5">
        <Sword className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${theme.textSecondary}`} />
        <span className={`text-[10px] sm:text-xs font-bold uppercase tracking-wide ${theme.textSecondary}`}>To Wound</span>
      </div>
      <p className={`text-2xl sm:text-3xl font-black ${theme.textPrimary} mt-0`}>{woundRoll}+</p>
    </button>
  </div>
);

const WeaponSelector = ({
  activeWeaponIndex,
  onSwitchWeapon,
  weaponTraits = [],
  onToggleTrait,
  theme
}) => {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredTraits = selectedCategory === 'All'
    ? WEAPON_TRAITS
    : WEAPON_TRAITS.filter(t => t.category === selectedCategory);

  // Sort so selected traits always appear at the top/front
  const sortedTraits = [...filteredTraits].sort((a, b) => {
    const aSelected = weaponTraits.includes(a.id);
    const bSelected = weaponTraits.includes(b.id);
    if (aSelected && !bSelected) return -1;
    if (!aSelected && bSelected) return 1;
    return 0;
  });

  return (
    <div className="space-y-1.5 pb-2 border-b border-black/10 shrink-0">
      <div className="flex items-center justify-between">
        {/* W1 / W2 Pill Selector */}
        <div className="flex items-center space-x-1 bg-black/15 p-0.5 rounded-lg">
          <button
            type="button"
            onClick={() => onSwitchWeapon(0)}
            className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
              activeWeaponIndex === 0
                ? 'bg-white/30 text-white shadow-sm ring-1 ring-white/30'
                : 'opacity-60 hover:opacity-100'
            }`}
          >
            Weapon 1
          </button>
          <button
            type="button"
            onClick={() => onSwitchWeapon(1)}
            className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
              activeWeaponIndex === 1
                ? 'bg-white/30 text-white shadow-sm ring-1 ring-white/30'
                : 'opacity-60 hover:opacity-100'
            }`}
          >
            Weapon 2
          </button>
        </div>

        <span className={`text-[10px] font-bold uppercase tracking-wider ${theme.textSecondary}`}>
          {weaponTraits.length > 0 ? `${weaponTraits.length} Active Trait${weaponTraits.length > 1 ? 's' : ''}` : 'No Traits'}
        </span>
      </div>

      {/* Category filter tabs */}
      <div onPointerDown={(e) => e.stopPropagation()} className="flex items-center gap-1 overflow-x-auto pb-0.5 scrollbar-none text-[10px]">
        {TRAIT_CATEGORIES.map(cat => {
          const countInCat = cat === 'All'
            ? weaponTraits.length
            : WEAPON_TRAITS.filter(t => t.category === cat && weaponTraits.includes(t.id)).length;
          const isCatActive = selectedCategory === cat;

          return (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-2 py-0.5 rounded-md font-bold transition-all whitespace-nowrap flex items-center space-x-1 ${
                isCatActive
                  ? 'bg-black/25 text-white shadow-xs'
                  : 'opacity-60 hover:opacity-90'
              }`}
            >
              <span>{cat}</span>
              {countInCat > 0 && (
                <span className="w-3.5 h-3.5 rounded-full bg-white/30 text-[8.5px] font-black flex items-center justify-center">
                  {countInCat}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Trait Selector Pills - Horizontal scroll with selected traits at front */}
      <div onPointerDown={(e) => e.stopPropagation()} className="flex items-center gap-1 overflow-x-auto pb-0.5 scrollbar-none">
        {sortedTraits.map(trait => {
          const isSelected = weaponTraits.includes(trait.id);
          return (
            <button
              key={trait.id}
              type="button"
              onClick={() => onToggleTrait(trait.id)}
              className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all whitespace-nowrap flex items-center space-x-1 ${
                isSelected
                  ? 'bg-white/30 ring-1 ring-white/60 text-white shadow-sm'
                  : 'bg-black/10 opacity-60 hover:opacity-90'
              }`}
              title={trait.description}
            >
              {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
              <span>{trait.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

const WoundCalculator = ({
  survivorStrength, setSurvivorStrength,
  weaponStrength, setWeaponStrength,
  activeWeaponIndex, onSwitchWeapon,
  weaponTraits = [], onToggleTrait,
  monsterToughness, setMonsterToughness,
  luck, setLuck,
  monsterLuck, setMonsterLuck,
  theme
}) => {
  const weaponLuckBonus = weaponTraits.includes('deadly3')
    ? 3
    : weaponTraits.includes('deadly2')
    ? 2
    : weaponTraits.includes('deadly')
    ? 1
    : 0;
  const totalLuck = luck + weaponLuckBonus;
  let criticalText = "Lantern 10";
  const netLuck = totalLuck - monsterLuck;

  if (monsterLuck > totalLuck) {
    criticalText = "Not possible";
  } else if (netLuck > 0) {
    const criticalValue = Math.max(2, 10 - netLuck);
    criticalText = criticalValue === 10 ? "Lantern 10" : `${criticalValue}+`;
  }

  const activeTraitNotes = WEAPON_TRAITS.filter(t => weaponTraits.includes(t.id));

  return (
    <Card className={`w-full h-full border-none shadow-lg ${theme.cardBg} flex flex-col overflow-hidden`}>
      <CardContent className="p-2.5 sm:p-4 flex-1 flex flex-col space-y-2 sm:space-y-3 overflow-y-auto scrollbar-none pb-12 sm:pb-4">
        <WeaponSelector
          activeWeaponIndex={activeWeaponIndex}
          onSwitchWeapon={onSwitchWeapon}
          weaponTraits={weaponTraits}
          onToggleTrait={onToggleTrait}
          theme={theme}
        />

        {/* 3 stats side by side across ALL screen sizes! */}
        <div className="grid grid-cols-3 gap-1.5 sm:gap-3">
          <StatInput
            label="Survivor Str"
            value={survivorStrength}
            onChange={setSurvivorStrength}
            theme={theme}
          />
          <StatInput
            label="Weapon Str"
            value={weaponStrength}
            onChange={setWeaponStrength}
            theme={theme}
          />
          <StatInput
            label="Monster Tough"
            value={monsterToughness}
            onChange={setMonsterToughness}
            theme={theme}
          />
        </div>

        {/* Luck Controls */}
        <div className="grid grid-cols-2 gap-2 max-w-xs mx-auto w-full">
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

        <div className={`rounded-xl p-2.5 sm:p-3 text-center mt-auto ${theme.buttonBg} backdrop-blur-sm space-y-1`}>
          <div className={`space-y-0.5 text-xs font-medium ${theme.textSecondary}`}>
            <p>1 always fails • Lantern 10 always wounds</p>
            <p className={`text-sm font-bold ${theme.textPrimary}`}>
              Crit: {criticalText}
              {weaponLuckBonus > 0 && <span className="ml-1 text-xs font-normal opacity-80">(+{weaponLuckBonus} Deadly)</span>}
            </p>
            <p>Criticals cancel reactions</p>
          </div>

          {activeTraitNotes.length > 0 && (
            <div className="pt-1.5 border-t border-black/10 space-y-1">
              {activeTraitNotes.map(trait => (
                <div key={trait.id} className={`text-[11px] font-medium flex items-center justify-center space-x-1.5 ${theme.textPrimary}`}>
                  <span className="px-1.5 py-0.5 rounded bg-black/20 text-[9px] font-black uppercase tracking-wider">
                    {trait.name}
                  </span>
                  <span>{trait.description}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const HitCalculator = ({
  survivorAccuracy, setSurvivorAccuracy,
  weaponAccuracy, setWeaponAccuracy,
  activeWeaponIndex, onSwitchWeapon,
  weaponTraits = [], onToggleTrait,
  monsterEvasion, setMonsterEvasion,
  inBlindSpot, setInBlindSpot,
  monsterKnockedDown, setMonsterKnockedDown,
  theme
}) => {
  const activeTraitNotes = WEAPON_TRAITS.filter(t => weaponTraits.includes(t.id));

  return (
    <Card className={`w-full h-full border-none shadow-lg ${theme.cardBg} flex flex-col overflow-hidden`}>
      <CardContent className="p-2.5 sm:p-4 flex-1 flex flex-col space-y-2 sm:space-y-3 overflow-y-auto scrollbar-none pb-12 sm:pb-4">
        <WeaponSelector
          activeWeaponIndex={activeWeaponIndex}
          onSwitchWeapon={onSwitchWeapon}
          weaponTraits={weaponTraits}
          onToggleTrait={onToggleTrait}
          theme={theme}
        />

        {/* 3 stats side by side across ALL screen sizes! */}
        <div className="grid grid-cols-3 gap-1.5 sm:gap-3">
          <StatInput
            label="Survivor Acc"
            value={survivorAccuracy}
            onChange={setSurvivorAccuracy}
            theme={theme}
          />
          <StatInput
            label="Weapon Acc"
            value={weaponAccuracy}
            onChange={setWeaponAccuracy}
            theme={theme}
          />
          <StatInput
            label="Monster Eva"
            value={monsterEvasion}
            onChange={setMonsterEvasion}
            theme={theme}
          />
        </div>

        {/* Checkboxes in 1 clean row */}
        <div className="grid grid-cols-2 gap-2 py-0.5">
          <Checkbox
            id="blindSpot"
            label="Blind Spot (+1)"
            checked={inBlindSpot}
            onChange={setInBlindSpot}
            theme={theme}
          />
          <Checkbox
            id="knockedDown"
            label="Knocked Down (3+)"
            checked={monsterKnockedDown}
            onChange={setMonsterKnockedDown}
            theme={theme}
          />
        </div>

        <div className={`rounded-xl p-2.5 sm:p-3 text-center mt-auto ${theme.buttonBg} backdrop-blur-sm space-y-1`}>
          <p className={`text-xs font-medium ${theme.textSecondary}`}>
            Lantern 10 always hits • 1 always misses
          </p>

          {activeTraitNotes.length > 0 && (
            <div className="pt-1.5 border-t border-black/10 space-y-1">
              {activeTraitNotes.map(trait => (
                <div key={trait.id} className={`text-[11px] font-medium flex items-center justify-center space-x-1.5 ${theme.textPrimary}`}>
                  <span className="px-1.5 py-0.5 rounded bg-black/20 text-[9px] font-black uppercase tracking-wider">
                    {trait.name}
                  </span>
                  <span>{trait.description}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// --- Main Application ---
const CalculatorApp = () => {
  const [currentPage, setCurrentPage] = useState('hit');
  const [viewMode, setViewMode] = useState('single');
  const [isOpen, setIsOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState('');
  const [activeSurvivorIndex, setActiveSurvivorIndex] = useState(0);
  const version = "v0.4.0";

  // Initial State Factory
  const createSurvivor = (name = '') => ({
    name: typeof name === 'string' ? name : '',
    accuracy: 0,
    strength: 0,
    luck: 0,
    blindSpot: false,
    activeWeaponIndex: 0,
    weapons: [
      createWeapon('Weapon 1'),
      createWeapon('Weapon 2')
    ]
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
  const [isHydrated, setIsHydrated] = useState(false);
  const lastOrientationRef = useRef(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState('');

  // Reset name editing state when switching active survivor
  useEffect(() => {
    setIsEditingName(false);
  }, [activeSurvivorIndex]);

  // Load from Cookies / LocalStorage on mount
  useEffect(() => {
    const saved = loadSurvivorsFromStorage(createSurvivor);
    if (saved) {
      setSurvivors(saved);
    }
    const prefs = loadViewPreferences();
    if (typeof prefs.activeSurvivorIndex === 'number') {
      setActiveSurvivorIndex(prefs.activeSurvivorIndex);
    }
    setIsHydrated(true);
  }, []);

  // Auto-detect orientation: Portrait -> Single View (last interacted survivor), Landscape -> 4 Columns
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkOrientation = () => {
      const isPortrait = window.matchMedia('(orientation: portrait)').matches || window.innerHeight > window.innerWidth;
      const currentOrientation = isPortrait ? 'portrait' : 'landscape';

      if (lastOrientationRef.current !== currentOrientation) {
        lastOrientationRef.current = currentOrientation;
        setViewMode(isPortrait ? 'single' : 'tv');
      }
    };

    // Initial check
    checkOrientation();

    const mediaPortrait = window.matchMedia('(orientation: portrait)');
    const handleMedia = () => checkOrientation();

    if (mediaPortrait.addEventListener) {
      mediaPortrait.addEventListener('change', handleMedia);
    } else if (mediaPortrait.addListener) {
      mediaPortrait.addListener(handleMedia);
    }
    window.addEventListener('orientationchange', handleMedia);
    window.addEventListener('resize', handleMedia);

    return () => {
      if (mediaPortrait.removeEventListener) {
        mediaPortrait.removeEventListener('change', handleMedia);
      } else if (mediaPortrait.removeListener) {
        mediaPortrait.removeListener(handleMedia);
      }
      window.removeEventListener('orientationchange', handleMedia);
      window.removeEventListener('resize', handleMedia);
    };
  }, []);

  // Auto-save survivors to Cookies and LocalStorage on change
  useEffect(() => {
    if (!isHydrated) return;
    saveSurvivorsToStorage(survivors);
  }, [survivors, isHydrated]);

  // Save view preferences
  useEffect(() => {
    if (!isHydrated) return;
    saveViewPreferences({ viewMode, activeSurvivorIndex });
  }, [viewMode, activeSurvivorIndex, isHydrated]);

  const handleResetSurvivors = () => {
    if (typeof window !== 'undefined' && window.confirm('Reset all 4 survivors and their weapons to defaults?')) {
      const reset = [
        createSurvivor(),
        createSurvivor(),
        createSurvivor(),
        createSurvivor()
      ];
      setSurvivors(reset);
      clearSurvivorsStorage();
    }
  };

  const handleResetMonster = () => {
    setMonster({
      toughness: 0,
      evasion: 0,
      luck: 0,
      knockedDown: false
    });
  };

  const currentSurvivor = survivors[activeSurvivorIndex];
  const theme = THEMES[activeSurvivorIndex];
  const currentActiveWeaponIdx = currentSurvivor?.activeWeaponIndex || 0;
  const currentWeapon = (currentSurvivor?.weapons && currentSurvivor.weapons[currentActiveWeaponIdx]) || { accuracy: 0, strength: 0, traits: [] };

  const getActiveWeapon = (survivor) => {
    const idx = survivor?.activeWeaponIndex || 0;
    return (survivor?.weapons && survivor.weapons[idx]) || { accuracy: 0, strength: 0, traits: [] };
  };

  const updateSurvivorIndex = (index, field, value) => {
    setActiveSurvivorIndex(index);
    setSurvivors(prev => {
      const newSurvivors = [...prev];
      newSurvivors[index] = {
        ...newSurvivors[index],
        [field]: value
      };
      return newSurvivors;
    });
  };

  const updateSurvivor = (field, value) => {
    updateSurvivorIndex(activeSurvivorIndex, field, value);
  };

  const switchSurvivorWeapon = (survivorIdx, weaponIdx) => {
    setActiveSurvivorIndex(survivorIdx);
    setSurvivors(prev => {
      const newSurvivors = [...prev];
      newSurvivors[survivorIdx] = {
        ...newSurvivors[survivorIdx],
        activeWeaponIndex: weaponIdx
      };
      return newSurvivors;
    });
  };

  const updateSurvivorWeaponStat = (survivorIdx, weaponIdx, field, value) => {
    setActiveSurvivorIndex(survivorIdx);
    setSurvivors(prev => {
      const newSurvivors = [...prev];
      const survivor = { ...newSurvivors[survivorIdx] };
      const weapons = [...(survivor.weapons || [createWeapon('Weapon 1'), createWeapon('Weapon 2')])];
      weapons[weaponIdx] = {
        ...weapons[weaponIdx],
        [field]: value
      };
      survivor.weapons = weapons;
      newSurvivors[survivorIdx] = survivor;
      return newSurvivors;
    });
  };

  const toggleSurvivorWeaponTrait = (survivorIdx, weaponIdx, traitId) => {
    setActiveSurvivorIndex(survivorIdx);
    setSurvivors(prev => {
      const newSurvivors = [...prev];
      const survivor = { ...newSurvivors[survivorIdx] };
      const weapons = [...(survivor.weapons || [createWeapon('Weapon 1'), createWeapon('Weapon 2')])];
      const weapon = { ...weapons[weaponIdx] };
      let traits = [...(weapon.traits || [])];

      if (traits.includes(traitId)) {
        traits = traits.filter(t => t !== traitId);
      } else {
        if (traitId === 'deadly') {
          traits = traits.filter(t => t !== 'deadly2' && t !== 'deadly3');
        } else if (traitId === 'deadly2') {
          traits = traits.filter(t => t !== 'deadly' && t !== 'deadly3');
        } else if (traitId === 'deadly3') {
          traits = traits.filter(t => t !== 'deadly' && t !== 'deadly2');
        }

        if (traitId === 'devastating') {
          traits = traits.filter(t => t !== 'devastating2');
        } else if (traitId === 'devastating2') {
          traits = traits.filter(t => t !== 'devastating');
        }

        if (traitId === 'sharp') {
          traits = traits.filter(t => t !== 'razor_sharp');
        } else if (traitId === 'razor_sharp') {
          traits = traits.filter(t => t !== 'sharp');
        }

        traits.push(traitId);
      }

      weapon.traits = traits;
      weapons[weaponIdx] = weapon;
      survivor.weapons = weapons;
      newSurvivors[survivorIdx] = survivor;
      return newSurvivors;
    });
  };

  const updateMonster = (field, value) => {
    setMonster(prev => ({ ...prev, [field]: value }));
  };

  const calculateHitRollFor = (survivor, monsterObj) => {
    if (monsterObj.knockedDown) return 3;
    const weapon = getActiveWeapon(survivor);
    let total = weapon.accuracy + monsterObj.evasion - survivor.accuracy - (survivor.blindSpot ? 1 : 0);
    return Math.max(2, Math.min(10, total));
  };

  const calculateWoundRollFor = (survivor, monsterObj) => {
    const weapon = getActiveWeapon(survivor);
    let required = monsterObj.toughness - weapon.strength - survivor.strength;
    return Math.max(2, Math.min(9, required));
  };

  const hitRequiredRoll = calculateHitRollFor(currentSurvivor, monster);
  const woundRequiredRoll = calculateWoundRollFor(currentSurvivor, monster);

  const [slideDirection, setSlideDirection] = useState(0);

  const nextSurvivor = () => {
    setSlideDirection(1);
    setActiveSurvivorIndex((prev) => (prev + 1) % 4);
  };

  const prevSurvivor = () => {
    setSlideDirection(-1);
    setActiveSurvivorIndex((prev) => (prev - 1 + 4) % 4);
  };

  const handleDragEnd = (event, info) => {
    const threshold = 50;
    const velocityThreshold = 400;
    if (info.offset.x < -threshold || info.velocity.x < -velocityThreshold) {
      nextSurvivor();
    } else if (info.offset.x > threshold || info.velocity.x > velocityThreshold) {
      prevSurvivor();
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

      {viewMode === 'tv' ? (
        <TvFourPlayerView
          survivors={survivors}
          updateSurvivorIndex={updateSurvivorIndex}
          updateSurvivorWeaponStat={updateSurvivorWeaponStat}
          switchSurvivorWeapon={switchSurvivorWeapon}
          toggleSurvivorWeaponTrait={toggleSurvivorWeaponTrait}
          monster={monster}
          updateMonster={updateMonster}
          themes={THEMES}
          onSwitchToSingleView={() => setViewMode('single')}
          onSelectSurvivor={(idx) => {
            setActiveSurvivorIndex(idx);
            setViewMode('single');
          }}
          onActivateSurvivor={(idx) => setActiveSurvivorIndex(idx)}
          onOpenMenu={() => setIsOpen(true)}
        />
      ) : (
        <>
          {/* Header with Nav Arrows */}
          <div className="pt-2 pb-0 flex items-center justify-between px-4">
            <div className="w-14" />
            <div className="flex items-center space-x-1.5 sm:space-x-2">
              <button
                id="prev-survivor-btn"
                type="button"
                onClick={prevSurvivor}
                className="p-1 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                title="Previous Survivor"
                aria-label="Previous Survivor"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {isEditingName ? (
                <div className="flex items-center space-x-1">
                  <input
                    id="rename-survivor-input"
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        updateSurvivor('name', nameInput.trim());
                        setIsEditingName(false);
                      } else if (e.key === 'Escape') {
                        setIsEditingName(false);
                      }
                    }}
                    onBlur={() => {
                      updateSurvivor('name', nameInput.trim());
                      setIsEditingName(false);
                    }}
                    autoFocus
                    maxLength={20}
                    placeholder={`Survivor ${activeSurvivorIndex + 1}`}
                    className="bg-black/50 text-white text-xs font-black uppercase tracking-wider px-2 py-0.5 rounded-lg border border-white/40 text-center outline-none focus:border-white focus:ring-1 focus:ring-white w-28 sm:w-36 shadow-inner"
                  />
                  <button
                    id="save-survivor-name-btn"
                    type="button"
                    onClick={() => {
                      updateSurvivor('name', nameInput.trim());
                      setIsEditingName(false);
                    }}
                    className="p-1 rounded-md text-emerald-400 hover:text-emerald-300 hover:bg-white/10 transition-colors"
                    title="Save Name"
                    aria-label="Save Name"
                  >
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </button>
                </div>
              ) : (
                <button
                  id="rename-survivor-btn"
                  type="button"
                  onClick={() => {
                    setNameInput(currentSurvivor.name || '');
                    setIsEditingName(true);
                  }}
                  className="flex items-center space-x-1.5 px-2 py-0.5 rounded-lg hover:bg-white/10 transition-all group max-w-[150px] sm:max-w-[200px]"
                  title="Click to rename survivor"
                >
                  <h1 className="text-xs font-black uppercase tracking-[0.15em] text-white opacity-95 group-hover:opacity-100 truncate">
                    {currentSurvivor.name || `Survivor ${activeSurvivorIndex + 1}`}
                  </h1>
                  <Pencil className="w-2.5 h-2.5 text-white/50 group-hover:text-white transition-colors shrink-0" />
                </button>
              )}

              <button
                id="next-survivor-btn"
                type="button"
                onClick={nextSurvivor}
                className="p-1 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                title="Next Survivor"
                aria-label="Next Survivor"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <button
              id="tv-mode-btn"
              onClick={() => setViewMode('tv')}
              className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-white/15 hover:bg-white/25 text-white text-xs font-semibold backdrop-blur-xs transition-colors shadow-sm"
              title="Switch to 4-Player TV View"
            >
              <Tv className="w-3.5 h-3.5 text-amber-300" />
              <span className="text-[11px] font-bold">4P TV</span>
            </button>
          </div>

          <RollSummary
            hitRoll={hitRequiredRoll}
            woundRoll={woundRequiredRoll}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            theme={theme}
          />

          {/* Main Content Area */}
          <div className="flex-1 min-h-0 relative overflow-hidden">
            <AnimatePresence mode="popLayout" custom={slideDirection} initial={false}>
              <motion.div
                key={activeSurvivorIndex}
                custom={slideDirection}
                variants={{
                  enter: (dir) => ({
                    x: dir > 0 ? '100%' : dir < 0 ? '-100%' : 0,
                    opacity: 0
                  }),
                  center: {
                    x: 0,
                    opacity: 1
                  },
                  exit: (dir) => ({
                    x: dir > 0 ? '-100%' : dir < 0 ? '100%' : 0,
                    opacity: 0
                  })
                }}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 350, damping: 32 },
                  opacity: { duration: 0.15 }
                }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={handleDragEnd}
                className="absolute inset-0 px-4 pb-2 touch-pan-y"
              >
                {currentPage === 'hit' ? (
                  <HitCalculator
                    survivorAccuracy={currentSurvivor.accuracy}
                    setSurvivorAccuracy={(v) => updateSurvivor('accuracy', v)}
                    weaponAccuracy={currentWeapon.accuracy}
                    setWeaponAccuracy={(v) => updateSurvivorWeaponStat(activeSurvivorIndex, currentActiveWeaponIdx, 'accuracy', v)}
                    activeWeaponIndex={currentActiveWeaponIdx}
                    onSwitchWeapon={(wIdx) => switchSurvivorWeapon(activeSurvivorIndex, wIdx)}
                    weaponTraits={currentWeapon.traits || []}
                    onToggleTrait={(tId) => toggleSurvivorWeaponTrait(activeSurvivorIndex, currentActiveWeaponIdx, tId)}
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
                    survivorStrength={currentSurvivor.strength}
                    setSurvivorStrength={(v) => updateSurvivor('strength', v)}
                    weaponStrength={currentWeapon.strength}
                    setWeaponStrength={(v) => updateSurvivorWeaponStat(activeSurvivorIndex, currentActiveWeaponIdx, 'strength', v)}
                    activeWeaponIndex={currentActiveWeaponIdx}
                    onSwitchWeapon={(wIdx) => switchSurvivorWeapon(activeSurvivorIndex, wIdx)}
                    weaponTraits={currentWeapon.traits || []}
                    onToggleTrait={(tId) => toggleSurvivorWeaponTrait(activeSurvivorIndex, currentActiveWeaponIdx, tId)}
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

          {/* Dots Indicator - Interactive */}
          <div className="absolute bottom-3 left-0 right-0 flex justify-center space-x-3 pointer-events-auto z-20">
            {THEMES.map((t, idx) => {
              const survivorName = survivors[idx]?.name || `Survivor ${idx + 1}`;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setSlideDirection(idx > activeSurvivorIndex ? 1 : -1);
                    setActiveSurvivorIndex(idx);
                  }}
                  className="p-1 group focus:outline-hidden"
                  title={`Switch to ${survivorName}`}
                  aria-label={`Switch to ${survivorName}`}
                >
                  <div
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                      idx === activeSurvivorIndex ? `${t.dotActive} scale-125 ring-2 ring-white/50` : `${t.dotInactive} hover:scale-110`
                    }`}
                  />
                </button>
              );
            })}
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
        </>
      )}

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

          {/* View Mode Toggle */}
          <button
            onClick={() => {
              setViewMode(prev => prev === 'single' ? 'tv' : 'single');
              setIsOpen(false);
            }}
            className="flex items-center space-x-3 px-6 py-3 rounded-xl bg-amber-50 border border-amber-200 w-64 justify-center text-amber-900 font-semibold hover:bg-amber-100 transition-colors"
          >
            <Tv className="w-5 h-5 text-amber-700" />
            <span>{viewMode === 'single' ? '4-Player TV View' : 'Single Player View'}</span>
          </button>

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

          {/* Reset Buttons */}
          <div className="grid grid-cols-2 gap-2 w-64 pt-2 border-t border-gray-100">
            <button
              onClick={handleResetSurvivors}
              className="flex items-center justify-center space-x-1 px-3 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-800 text-xs font-bold border border-red-200 transition-colors"
              title="Reset all 4 survivors to default"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Survivors</span>
            </button>
            <button
              onClick={handleResetMonster}
              className="flex items-center justify-center space-x-1 px-3 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold transition-colors"
              title="Reset monster toughness, evasion, luck"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Monster</span>
            </button>
          </div>

          {/* Auto-save cookie badge */}
          <div className="flex items-center space-x-1.5 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Player data auto-saved to Cookies & Storage</span>
          </div>

          <div className={`text-xs text-gray-400 pt-2`}>
            {version}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalculatorApp;
