'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {
  Plus,
  Minus,
  Sword,
  Target,
  Smartphone,
  Sparkles,
  Shield,
  Eye,
  Clover,
  Check,
  Menu
} from 'lucide-react';
import { WEAPON_TRAITS, TRAIT_CATEGORIES, getWeaponLuckBonus } from '@/lib/weaponTraits';

const CompactStatInput = ({ label, value, onChange, theme, icon: Icon }) => {
  const increment = () => onChange(Math.min(value + 1, 99));
  const decrement = () => onChange(Math.max(value - 1, -99));

  return (
    <div className="flex flex-col items-center justify-center p-1 rounded-lg bg-black/10 backdrop-blur-xs">
      <div className="flex items-center space-x-1 mb-0.5">
        {Icon && <Icon className={`w-2.5 h-2.5 opacity-80 ${theme.textSecondary}`} />}
        <span className={`text-[9px] md:text-[10px] font-bold uppercase tracking-wider ${theme.textSecondary} truncate`}>
          {label}
        </span>
      </div>
      <div className="flex items-center justify-center space-x-1.5 w-full">
        <button
          type="button"
          onClick={decrement}
          className={`w-6 h-6 md:w-7 md:h-7 flex items-center justify-center rounded-full transition-all ${theme.buttonBg} active:scale-95`}
          aria-label={`Decrease ${label}`}
        >
          <Minus className={`w-3 h-3 md:w-3.5 md:h-3.5 ${theme.buttonIcon}`} />
        </button>
        <span className={`w-5 md:w-6 text-center text-sm md:text-base font-black ${theme.textPrimary}`}>
          {value}
        </span>
        <button
          type="button"
          onClick={increment}
          className={`w-6 h-6 md:w-7 md:h-7 flex items-center justify-center rounded-full transition-all ${theme.buttonBg} active:scale-95`}
          aria-label={`Increase ${label}`}
        >
          <Plus className={`w-3 h-3 md:w-3.5 md:h-3.5 ${theme.buttonIcon}`} />
        </button>
      </div>
    </div>
  );
};

const MonsterStatInput = ({ label, value, onChange, icon: Icon }) => {
  const increment = () => onChange(Math.min(value + 1, 99));
  const decrement = () => onChange(Math.max(value - 1, -99));

  return (
    <div className="flex items-center space-x-1 bg-neutral-950/70 border border-neutral-800 rounded-lg px-1.5 sm:px-2 py-0.5">
      <div className="flex items-center space-x-1">
        {Icon && <Icon className="w-3 h-3 text-red-400" />}
        <span className="text-[10px] sm:text-[11px] font-semibold text-neutral-300 uppercase tracking-wider">{label}</span>
      </div>
      <div className="flex items-center space-x-0.5">
        <button
          type="button"
          onClick={decrement}
          className="w-5 h-5 flex items-center justify-center rounded bg-neutral-800 text-neutral-200 hover:bg-neutral-700 active:scale-95"
          aria-label={`Decrease ${label}`}
        >
          <Minus className="w-2.5 h-2.5" />
        </button>
        <span className="w-4 sm:w-5 text-center text-xs font-bold text-white">{value}</span>
        <button
          type="button"
          onClick={increment}
          className="w-5 h-5 flex items-center justify-center rounded bg-neutral-800 text-neutral-200 hover:bg-neutral-700 active:scale-95"
          aria-label={`Increase ${label}`}
        >
          <Plus className="w-2.5 h-2.5" />
        </button>
      </div>
    </div>
  );
};

const TvFourPlayerView = ({
  survivors,
  updateSurvivorIndex,
  updateSurvivorWeaponStat,
  switchSurvivorWeapon,
  toggleSurvivorWeaponTrait,
  monster,
  updateMonster,
  themes,
  onSwitchToSingleView,
  onSelectSurvivor,
  onOpenMenu
}) => {
  const [traitModalSurvivorIdx, setTraitModalSurvivorIdx] = useState(null);
  const [modalCategory, setModalCategory] = useState('All');

  const getActiveWeapon = (survivor) => {
    const idx = survivor?.activeWeaponIndex || 0;
    return (survivor?.weapons && survivor.weapons[idx]) || { accuracy: 0, strength: 0, traits: [] };
  };

  const calculateHitRollFor = (survivor) => {
    if (monster.knockedDown) return 3;
    const weapon = getActiveWeapon(survivor);
    let total = weapon.accuracy + monster.evasion - survivor.accuracy - (survivor.blindSpot ? 1 : 0);
    return Math.max(2, Math.min(10, total));
  };

  const calculateWoundRollFor = (survivor) => {
    const weapon = getActiveWeapon(survivor);
    let required = monster.toughness - weapon.strength - survivor.strength;
    return Math.max(2, Math.min(9, required));
  };

  const calculateCritTextFor = (survivor) => {
    const weapon = getActiveWeapon(survivor);
    const weaponLuck = getWeaponLuckBonus(weapon);
    const totalLuck = survivor.luck + weaponLuck;
    const netLuck = totalLuck - monster.luck;

    if (monster.luck > totalLuck) {
      return "No Crit";
    } else if (netLuck > 0) {
      const criticalValue = Math.max(2, 10 - netLuck);
      return criticalValue === 10 ? "Crit: L10" : `Crit: ${criticalValue}+`;
    }
    return "Crit: L10";
  };

  return (
    <div className="fixed inset-0 flex flex-col p-1.5 md:p-2 overflow-hidden bg-black/60 backdrop-blur-md">
      {/* Top Bar: Strictly single-line, zero wrapping */}
      <header className="flex items-center justify-between gap-1.5 mb-1.5 px-2.5 py-1 bg-neutral-900/90 border border-neutral-800 rounded-xl shadow-xl flex-nowrap shrink-0">
        {/* Left: Branding */}
        <div className="flex items-center space-x-1.5 shrink-0">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-xs font-black tracking-widest text-neutral-100 uppercase hidden xs:inline">
            KDM Showdown
          </span>
        </div>

        {/* Center: Monster Controls */}
        <div className="flex items-center gap-1 sm:gap-1.5 flex-nowrap shrink-0 overflow-x-auto scrollbar-none">
          <MonsterStatInput
            label="Tough"
            value={monster.toughness}
            onChange={(v) => updateMonster('toughness', v)}
            icon={Shield}
          />
          <MonsterStatInput
            label="Eva"
            value={monster.evasion}
            onChange={(v) => updateMonster('evasion', v)}
            icon={Eye}
          />
          <MonsterStatInput
            label="Luck"
            value={monster.luck}
            onChange={(v) => updateMonster('luck', v)}
            icon={Clover}
          />

          {/* Knocked Down Toggle */}
          <button
            type="button"
            onClick={() => updateMonster('knockedDown', !monster.knockedDown)}
            className={`flex items-center space-x-1 px-1.5 sm:px-2 py-0.5 rounded-lg border text-[10px] sm:text-[11px] font-semibold transition-all whitespace-nowrap ${
              monster.knockedDown
                ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-sm'
                : 'bg-neutral-950/70 border-neutral-800 text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <div className={`w-3 h-3 rounded flex items-center justify-center border ${
              monster.knockedDown ? 'border-amber-400 bg-amber-400 text-neutral-950' : 'border-neutral-600'
            }`}>
              {monster.knockedDown && <Check className="w-2 h-2 stroke-[3]" />}
            </div>
            <span className="hidden sm:inline">Knocked Down (3+)</span>
            <span className="sm:hidden">KD (3+)</span>
          </button>
        </div>

        {/* Right: Sleek Single View button & Menu button */}
        <div className="flex items-center space-x-1.5 shrink-0">
          <button
            type="button"
            onClick={onSwitchToSingleView}
            className="flex items-center space-x-1 px-2 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold transition-colors shadow-sm whitespace-nowrap"
            title="Switch to Single Player View"
          >
            <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden xs:inline">Single View</span>
          </button>

          {onOpenMenu && (
            <button
              type="button"
              onClick={onOpenMenu}
              className="p-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition-colors shadow-sm"
              title="Open Menu"
              aria-label="Open Menu"
            >
              <Menu className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </header>

      {/* Main Container: Pure 4-Column Layout */}
      <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-1.5 md:gap-2 flex-1 min-h-0 overflow-y-auto lg:overflow-visible">
        {survivors.map((survivor, idx) => {
          const theme = themes[idx];
          const activeWeaponIdx = survivor.activeWeaponIndex || 0;
          const activeWeapon = getActiveWeapon(survivor);
          const hitRoll = calculateHitRollFor(survivor);
          const woundRoll = calculateWoundRollFor(survivor);
          const critText = calculateCritTextFor(survivor);

          return (
            <Card
              key={idx}
              className={`border-none shadow-xl ${theme.cardBg} flex flex-col rounded-xl overflow-hidden h-full min-h-[250px] lg:min-h-0`}
            >
              <CardContent className="p-2 md:p-2.5 flex-1 flex flex-col justify-between space-y-1.5">
                {/* Single-line Header: Survivor Title & W1/W2 Selector */}
                <div className="flex items-center justify-between border-b border-black/10 pb-1">
                  <div className="flex items-center space-x-1.5">
                    <button
                      type="button"
                      onClick={() => onSelectSurvivor(idx)}
                      className="flex items-center space-x-1.5 text-left group"
                      title={`Open Survivor ${idx + 1} in Single View`}
                    >
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-black ${theme.dotActive} text-white shadow-sm group-hover:scale-105 transition-transform`}>
                        {idx + 1}
                      </div>
                      <h2 className={`text-xs md:text-sm font-black uppercase tracking-wider ${theme.textPrimary}`}>
                        S{idx + 1}
                      </h2>
                    </button>

                    {/* W1 / W2 Pill Selector */}
                    <div className="flex items-center p-0.5 bg-black/20 rounded-md">
                      <button
                        type="button"
                        onClick={() => switchSurvivorWeapon(idx, 0)}
                        className={`px-1.5 py-0.2 rounded text-[10px] font-black transition-all ${
                          activeWeaponIdx === 0
                            ? 'bg-white/35 text-white shadow-sm'
                            : 'opacity-50 hover:opacity-100'
                        }`}
                        title="Switch to Weapon 1"
                      >
                        W1
                      </button>
                      <button
                        type="button"
                        onClick={() => switchSurvivorWeapon(idx, 1)}
                        className={`px-1.5 py-0.2 rounded text-[10px] font-black transition-all ${
                          activeWeaponIdx === 1
                            ? 'bg-white/35 text-white shadow-sm'
                            : 'opacity-50 hover:opacity-100'
                        }`}
                        title="Switch to Weapon 2"
                      >
                        W2
                      </button>
                    </div>
                  </div>

                  {/* Trait manager & Single view button */}
                  <div className="flex items-center space-x-1">
                    <button
                      type="button"
                      onClick={() => setTraitModalSurvivorIdx(idx)}
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${theme.buttonBg} transition-all`}
                      title="Manage Weapon Traits"
                    >
                      +Traits
                    </button>
                    <button
                      type="button"
                      onClick={() => onSelectSurvivor(idx)}
                      className={`p-1 rounded opacity-70 hover:opacity-100 ${theme.buttonBg} transition-all`}
                      title={`Open Survivor ${idx + 1} in Single View`}
                    >
                      <Smartphone className={`w-3 h-3 ${theme.buttonIcon}`} />
                    </button>
                  </div>
                </div>

                {/* Dual Roll Tiles (Prominent side-by-side) */}
                <div className="grid grid-cols-2 gap-1.5">
                  {/* To Hit Tile */}
                  <div className="flex flex-col items-center justify-center py-1.5 px-1 rounded-lg bg-black/20 backdrop-blur-xs">
                    <div className="flex items-center space-x-1">
                      <Target className={`w-3 h-3 ${theme.textSecondary}`} />
                      <span className={`text-[9px] uppercase font-bold tracking-wider ${theme.textSecondary}`}>Hit</span>
                    </div>
                    <p className={`text-2xl lg:text-3xl font-black ${theme.textPrimary} mt-0.5 leading-none`}>
                      {hitRoll}+
                    </p>
                  </div>

                  {/* To Wound Tile */}
                  <div className="flex flex-col items-center justify-center py-1.5 px-1 rounded-lg bg-black/20 backdrop-blur-xs">
                    <div className="flex items-center space-x-1">
                      <Sword className={`w-3 h-3 ${theme.textSecondary}`} />
                      <span className={`text-[9px] uppercase font-bold tracking-wider ${theme.textSecondary}`}>Wound</span>
                    </div>
                    <p className={`text-2xl lg:text-3xl font-black ${theme.textPrimary} mt-0.5 leading-none`}>
                      {woundRoll}+
                    </p>
                  </div>
                </div>

                {/* Crit Status Pill & Traits */}
                <div className="space-y-1">
                  <div className="flex items-center justify-center space-x-1 py-0.5 px-2 rounded bg-black/15 text-center">
                    <Sparkles className={`w-2.5 h-2.5 ${theme.textSecondary}`} />
                    <span className={`text-[10px] md:text-[11px] font-extrabold ${theme.textPrimary}`}>
                      {critText}
                    </span>
                  </div>

                  {/* Active Weapon Traits Chips */}
                  {activeWeapon.traits && activeWeapon.traits.length > 0 && (
                    <div className="flex flex-wrap items-center justify-center gap-1">
                      {activeWeapon.traits.map(tId => {
                        const trait = WEAPON_TRAITS.find(t => t.id === tId);
                        if (!trait) return null;
                        return (
                          <span
                            key={trait.id}
                            onClick={() => setTraitModalSurvivorIdx(idx)}
                            className="px-1.5 py-0.2 rounded bg-black/25 text-[8.5px] font-black uppercase tracking-wider cursor-pointer hover:bg-black/40 transition-colors"
                            title={trait.description}
                          >
                            {trait.name}
                          </span>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Stat Modifiers - 3 compact rows: Acc -> Str -> BlindSpot/Luck */}
                <div className="space-y-1 flex-1 flex flex-col justify-end pt-1 border-t border-black/10">
                  {/* Row 1: Accuracy */}
                  <div className="grid grid-cols-2 gap-1">
                    <CompactStatInput
                      label="Survivor Acc"
                      value={survivor.accuracy}
                      onChange={(v) => updateSurvivorIndex(idx, 'accuracy', v)}
                      theme={theme}
                    />
                    <CompactStatInput
                      label="Weapon Acc"
                      value={activeWeapon.accuracy}
                      onChange={(v) => updateSurvivorWeaponStat(idx, activeWeaponIdx, 'accuracy', v)}
                      theme={theme}
                    />
                  </div>

                  {/* Row 2: Strength */}
                  <div className="grid grid-cols-2 gap-1">
                    <CompactStatInput
                      label="Survivor Str"
                      value={survivor.strength}
                      onChange={(v) => updateSurvivorIndex(idx, 'strength', v)}
                      theme={theme}
                    />
                    <CompactStatInput
                      label="Weapon Str"
                      value={activeWeapon.strength}
                      onChange={(v) => updateSurvivorWeaponStat(idx, activeWeaponIdx, 'strength', v)}
                      theme={theme}
                    />
                  </div>

                  {/* Row 3: Blind Spot & Survivor Luck side by side */}
                  <div className="grid grid-cols-2 gap-1 items-center">
                    <div
                      onClick={() => updateSurvivorIndex(idx, 'blindSpot', !survivor.blindSpot)}
                      className={`h-full flex items-center justify-center space-x-1.5 p-1 rounded-lg cursor-pointer transition-all ${
                        survivor.blindSpot ? 'bg-black/25 ring-1 ring-current' : 'bg-black/10 hover:bg-black/15'
                      }`}
                    >
                      <div className={`w-3 h-3 rounded border flex items-center justify-center ${
                        survivor.blindSpot ? 'bg-white/40 border-transparent text-white' : 'border-current opacity-60'
                      }`}>
                        {survivor.blindSpot && <Check className="w-2 h-2 stroke-[3]" />}
                      </div>
                      <span className={`text-[9px] md:text-[10px] font-bold ${theme.textPrimary} select-none`}>
                        Blind Spot
                      </span>
                    </div>

                    <CompactStatInput
                      label="Survivor Luck"
                      value={survivor.luck}
                      onChange={(v) => updateSurvivorIndex(idx, 'luck', v)}
                      theme={theme}
                      icon={Clover}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </main>

      {/* Trait Manager Modal */}
      {traitModalSurvivorIdx !== null && (() => {
        const survivor = survivors[traitModalSurvivorIdx];
        const activeWeaponIdx = survivor?.activeWeaponIndex || 0;
        const currentWeapon = getActiveWeapon(survivor);
        const filteredTraits = modalCategory === 'All'
          ? WEAPON_TRAITS
          : WEAPON_TRAITS.filter(t => t.category === modalCategory);

        return (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
            onClick={() => setTraitModalSurvivorIdx(null)}
          >
            <div
              className="bg-neutral-900 border border-neutral-700 rounded-2xl p-4 max-w-md w-full shadow-2xl space-y-3 flex flex-col max-h-[85vh]"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-neutral-800 pb-2 shrink-0">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
                    Survivor {traitModalSurvivorIdx + 1} &bull; Weapon {activeWeaponIdx + 1} Traits
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setTraitModalSurvivorIdx(null)}
                  className="text-neutral-300 hover:text-white text-xs font-bold px-3 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700"
                >
                  Done
                </button>
              </div>

              {/* Category filter tabs */}
              <div className="flex items-center gap-1 overflow-x-auto pb-1 shrink-0 scrollbar-none text-[11px]">
                {TRAIT_CATEGORIES.map(cat => {
                  const countInCat = cat === 'All'
                    ? (currentWeapon.traits || []).length
                    : WEAPON_TRAITS.filter(t => t.category === cat && currentWeapon.traits?.includes(t.id)).length;
                  const isCatActive = modalCategory === cat;

                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setModalCategory(cat)}
                      className={`px-2.5 py-1 rounded-lg font-bold transition-all whitespace-nowrap flex items-center space-x-1 ${
                        isCatActive
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'bg-neutral-800 text-neutral-400 hover:text-white'
                      }`}
                    >
                      <span>{cat}</span>
                      {countInCat > 0 && (
                        <span className="w-4 h-4 rounded-full bg-white/25 text-[9px] font-black flex items-center justify-center">
                          {countInCat}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Trait list */}
              <div className="grid grid-cols-1 gap-1.5 overflow-y-auto pr-1 flex-1">
                {filteredTraits.map(trait => {
                  const isSelected = currentWeapon.traits && currentWeapon.traits.includes(trait.id);
                  return (
                    <button
                      key={trait.id}
                      type="button"
                      onClick={() => toggleSurvivorWeaponTrait(traitModalSurvivorIdx, activeWeaponIdx, trait.id)}
                      className={`flex items-start justify-between p-2.5 rounded-xl text-left border transition-all ${
                        isSelected
                          ? 'bg-blue-600/30 border-blue-500 text-white shadow-sm'
                          : 'bg-neutral-800/60 border-neutral-700/60 text-neutral-300 hover:bg-neutral-800'
                      }`}
                    >
                      <div className="flex flex-col pr-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-bold text-white">{trait.name}</span>
                          <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-neutral-700 text-neutral-300 font-semibold tracking-wider">
                            {trait.category}
                          </span>
                        </div>
                        <span className="text-[10px] text-neutral-400 mt-0.5">{trait.description}</span>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};

export default TvFourPlayerView;
