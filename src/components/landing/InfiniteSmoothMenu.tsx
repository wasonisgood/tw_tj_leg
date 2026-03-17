import { useEffect, useMemo, useRef, useState, WheelEvent } from 'react';
import { useAnimationFrame } from 'framer-motion';

export type InfiniteMenuCard = {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  date: string;
  href: string;
};

export type InfiniteMenuCategory = {
  key: 'laws' | 'meetings';
  label: string;
  items: InfiniteMenuCard[];
};

type InfiniteSmoothMenuProps = {
  categories: InfiniteMenuCategory[];
  onSelectItem: (item: InfiniteMenuCard, categoryKey: InfiniteMenuCategory['key']) => void;
  onFocusItem: (item: InfiniteMenuCard, categoryKey: InfiniteMenuCategory['key']) => void;
  showTabs?: boolean;
};

const CARD_WIDTH = 320;
const CARD_GAP = 16;
const TRACK_UNIT = CARD_WIDTH + CARD_GAP;

function wrapOffset(value: number, length: number): number {
  if (length <= 0) return 0;
  const max = length * TRACK_UNIT;
  if (max <= 0) return 0;
  return ((value % max) + max) % max;
}

export default function InfiniteSmoothMenu({ categories, onSelectItem, onFocusItem, showTabs = true }: InfiniteSmoothMenuProps) {
  const [activeCategory, setActiveCategory] = useState<InfiniteMenuCategory['key']>(categories[0]?.key || 'laws');
  const [offset, setOffset] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const velocityRef = useRef(42);
  const momentumRef = useRef(0);
  const focusedIndexRef = useRef(-1);

  const active = useMemo(() => {
    return categories.find((category) => category.key === activeCategory) || categories[0];
  }, [categories, activeCategory]);

  const loopItems = useMemo(() => {
    const baseItems = active?.items || [];
    return [...baseItems, ...baseItems, ...baseItems];
  }, [active]);

  useEffect(() => {
    if (!categories.find((category) => category.key === activeCategory) && categories[0]) {
      setActiveCategory(categories[0].key);
    }
  }, [activeCategory, categories]);

  useEffect(() => {
    setOffset(0);
    momentumRef.current = 0;
    focusedIndexRef.current = -1;
  }, [activeCategory]);

  useAnimationFrame((_, delta) => {
    if (!active?.items?.length) return;

    const idleDrift = (isHovered ? 0.3 : 1) * velocityRef.current * (delta / 1000);
    momentumRef.current *= 0.92;
    const nextOffset = wrapOffset(offset + idleDrift + momentumRef.current, active.items.length);
    setOffset(nextOffset);

    const index = Math.floor((nextOffset + TRACK_UNIT * 0.45) / TRACK_UNIT) % active.items.length;
    if (index !== focusedIndexRef.current && active.items[index]) {
      focusedIndexRef.current = index;
      onFocusItem(active.items[index], activeCategory);
    }
  });

  const handleWheel = (event: WheelEvent<HTMLDivElement>) => {
    const delta = event.deltaY + event.deltaX;
    momentumRef.current += delta * 0.02;
  };

  if (!active) {
    return null;
  }

  return (
    <section className="space-y-6">
      {showTabs && (
        <div className="flex items-center gap-3">
          {categories.map((category) => (
            <button
              key={category.key}
              onClick={() => setActiveCategory(category.key)}
              className={`px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] border transition-colors ${
                category.key === activeCategory
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-black hover:text-black'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      )}

      <div
        className="relative overflow-hidden border border-black bg-white/70 backdrop-blur-sm"
        onWheel={handleWheel}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[#F9F9F7] to-transparent pointer-events-none z-10" />
        <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[#F9F9F7] to-transparent pointer-events-none z-10" />

        <div
          className="flex py-5"
          style={{
            transform: `translateX(${-offset - (active.items.length * TRACK_UNIT)}px)`
          }}
        >
          {loopItems.map((item, idx) => (
            <button
              key={`${item.id}-${idx}`}
              onClick={() => onSelectItem(item, activeCategory)}
              className="shrink-0 w-[320px] mx-2 p-4 text-left bg-[#111111] text-white border border-[#2a2a2a] hover:bg-[#8C2F39] transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-black serif leading-tight line-clamp-2">{item.title}</p>
                <span className="text-[9px] font-black uppercase tracking-[0.18em] opacity-70">{item.date.slice(0, 4)}</span>
              </div>
              <p className="mt-3 text-[11px] text-gray-200 leading-relaxed line-clamp-2">{item.subtitle}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-[0.18em] text-amber-300">{item.badge}</span>
                <span className="text-[10px] font-black uppercase tracking-[0.18em]">Open</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
