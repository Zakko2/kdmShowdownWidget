'use client';

import React from 'react';
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
import { WEAPON_TRAITS, getWeaponLuckBonus } from '@/lib/weaponTraits';

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
  onActivateSurvivor,
  onOpenMenu
}) => {
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
            id="single-view-btn"
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

      {/* Main Container: Strictly 4 Columns Across All Landscape Screens */}
      <main className="grid grid-cols-4 gap-1 sm:gap-1.5 md:gap-2 flex-1 min-h-0 overflow-hidden">
        {survivors.map((survivor, idx) => {
          const theme = themes[idx];
          const activeWeaponIdx = survivor.activeWeaponIndex || 0;
          const activeWeapon = getActiveWeapon(survivor);
          const hitRoll = calculateHitRollFor(survivor);
          const woundRoll = calculateWoundRollFor(survivor);
          const critText = calculateCritTextFor(survivor);
          const weaponLuck = getWeaponLuckBonus(activeWeapon);
          const activeTraits = (activeWeapon.traits || [])
            .map(tId => WEAPON_TRAITS.find(t => t.id === tId))
            .filter(Boolean);

          return (
            <Card
              key={idx}
              id={`tv-card-${idx}`}
              onClick={() => onSelectSurvivor(idx)}
              className={`border-none shadow-xl ${theme.cardBg} flex flex-col rounded-xl overflow-hidden h-full min-h-0 cursor-pointer transition-all hover:scale-[1.008] hover:shadow-2xl group select-none`}
              title={`Click to edit ${survivor.name || `Survivor ${idx + 1}`} in Single View`}
            >
              <CardContent className="p-1.5 sm:p-2 md:p-3 flex-1 flex flex-col justify-between space-y-1 sm:space-y-1.5 overflow-hidden">
                {/* Single-line Header: Survivor Badge, Custom Name, W1/W2 Selector & Edit Action */}
                <div className="flex items-center justify-between gap-1 border-b border-black/10 pb-1 shrink-0">
                  <div className="flex items-center space-x-1 min-w-0 overflow-hidden">
                    <div className={`px-1.5 py-0.5 rounded-md flex items-center justify-center text-[10px] sm:text-xs font-black ${theme.dotActive} text-white shadow-xs tracking-wider shrink-0`}>
                      S{idx + 1}
                    </div>

                    {survivor.name && (
                      <span id={`tv-survivor-name-${idx}`} className={`text-[10px] sm:text-xs font-black truncate ${theme.textPrimary}`} title={survivor.name}>
                        {survivor.name}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-1 shrink-0">
                    {/* W1 / W2 Pill Selector */}
                    <div className="flex items-center p-0.5 bg-black/20 rounded-md">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          switchSurvivorWeapon(idx, 0);
                        }}
                        className={`px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] font-black transition-all ${
                          activeWeaponIdx === 0
                            ? 'bg-white/35 text-white shadow-sm ring-1 ring-white/30'
                            : 'opacity-50 hover:opacity-100'
                        }`}
                        title="Switch to Weapon 1"
                      >
                        W1
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          switchSurvivorWeapon(idx, 1);
                        }}
                        className={`px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] font-black transition-all ${
                          activeWeaponIdx === 1
                            ? 'bg-white/35 text-white shadow-sm ring-1 ring-white/30'
                            : 'opacity-50 hover:opacity-100'
                        }`}
                        title="Switch to Weapon 2"
                      >
                        W2
                      </button>
                    </div>

                    {/* Edit in Single View button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectSurvivor(idx);
                      }}
                      className={`flex items-center space-x-0.5 sm:space-x-1 px-1.5 py-0.5 rounded-md text-[9px] sm:text-[10px] font-bold ${theme.buttonBg} transition-all group-hover:bg-black/20 shadow-xs`}
                      title={`Edit ${survivor.name || `Survivor ${idx + 1}`} in Single View`}
                    >
                      <Smartphone className={`w-2.5 h-2.5 sm:w-3 sm:h-3 ${theme.buttonIcon}`} />
                      <span className="font-extrabold uppercase tracking-wide hidden lg:inline">Edit</span>
                    </button>
                  </div>
                </div>

                {/* Dual Roll Tiles (Prominent side-by-side) */}
                <div className="grid grid-cols-2 gap-1 sm:gap-2 shrink-0">
                  {/* To Hit Tile */}
                  <div className="flex flex-col items-center justify-center py-2 sm:py-2.5 px-1 rounded-xl bg-black/20 backdrop-blur-xs shadow-inner">
                    <div className="flex items-center space-x-1">
                      <Target className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${theme.textSecondary}`} />
                      <span className={`text-[9px] sm:text-[10px] uppercase font-bold tracking-wider ${theme.textSecondary}`}>Hit</span>
                    </div>
                    <p className={`text-2xl sm:text-3xl md:text-4xl font-black ${theme.textPrimary} mt-0.5 leading-none`}>
                      {hitRoll}+
                    </p>
                  </div>

                  {/* To Wound Tile */}
                  <div className="flex flex-col items-center justify-center py-2 sm:py-2.5 px-1 rounded-xl bg-black/20 backdrop-blur-xs shadow-inner">
                    <div className="flex items-center space-x-1">
                      <Sword className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${theme.textSecondary}`} />
                      <span className={`text-[9px] sm:text-[10px] uppercase font-bold tracking-wider ${theme.textSecondary}`}>Wound</span>
                    </div>
                    <p className={`text-2xl sm:text-3xl md:text-4xl font-black ${theme.textPrimary} mt-0.5 leading-none`}>
                      {woundRoll}+
                    </p>
                  </div>
                </div>

                {/* Special Attribute Info Section */}
                <div className="flex-1 min-h-0 flex flex-col justify-start space-y-1 sm:space-y-1.5 overflow-y-auto scrollbar-none pt-0.5">
                  {/* Crit Status Pill */}
                  <div className="flex flex-col items-center justify-center py-1 sm:py-1.5 px-2 rounded-lg bg-black/15 text-center shrink-0">
                    <div className="flex items-center space-x-1.5">
                      <Sparkles className={`w-3 h-3 ${theme.textSecondary}`} />
                      <span className={`text-xs sm:text-sm font-extrabold ${theme.textPrimary}`}>
                        {critText}
                      </span>
                      {weaponLuck > 0 && (
                        <span className={`text-[9px] sm:text-[10px] font-bold ${theme.textSecondary}`}>
                          (+{weaponLuck} Deadly)
                        </span>
                      )}
                    </div>
                    <span className={`text-[8px] sm:text-[9px] font-medium opacity-75 ${theme.textSecondary} leading-tight mt-0.5`}>
                      10s wound &bull; Crits cancel reactions
                    </span>
                  </div>

                  {/* Active Blind Spot Indicator (if set on survivor) */}
                  {survivor.blindSpot && (
                    <div className="flex items-center justify-center space-x-1.5 py-0.5 px-2 rounded-md bg-black/20 border border-black/10 shrink-0">
                      <Check className={`w-2.5 h-2.5 ${theme.textPrimary} stroke-[3]`} />
                      <span className={`text-[9.5px] sm:text-[10px] font-black uppercase tracking-wider ${theme.textPrimary}`}>
                        Blind Spot Active (+1 Acc)
                      </span>
                    </div>
                  )}

                  {/* Active Weapon Traits & Rule Reminders */}
                  <div className="space-y-1 flex-1">
                    {activeTraits.length > 0 ? (
                      activeTraits.map(trait => (
                        <div
                          key={trait.id}
                          className="p-1.5 rounded-lg bg-black/15 flex flex-col space-y-0.5"
                        >
                          <div className="flex items-center space-x-1.5">
                            <span className="px-1.5 py-0.2 rounded bg-black/30 text-[9px] sm:text-[9.5px] font-black uppercase tracking-wider text-white">
                              {trait.name}
                            </span>
                            <span className={`text-[8px] sm:text-[8.5px] font-bold uppercase opacity-60 ${theme.textSecondary}`}>
                              {trait.category}
                            </span>
                          </div>
                          <p className={`text-[9.5px] sm:text-[10.5px] font-medium ${theme.textPrimary} leading-snug opacity-90`}>
                            {trait.description}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="flex-1 flex items-center justify-center py-2 px-2 rounded-lg bg-black/10 text-center">
                        <span className={`text-[9px] sm:text-[10px] font-semibold opacity-60 ${theme.textSecondary} uppercase tracking-wider`}>
                          Standard Weapon &bull; No Special Traits
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </main>
    </div>
  );
};

export default TvFourPlayerView;
