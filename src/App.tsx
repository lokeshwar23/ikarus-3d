import React, { useMemo, useState, useEffect } from "react";
import { ZoomIn, ZoomOut, Ruler, Maximize2, Focus } from "lucide-react";
import ThreeJSViewer from "./components/ThreeJSViewer";

const uuid = () =>
  (globalThis as any)?.crypto?.randomUUID?.() ||
  `${Date.now()}-${Math.random().toString(16).slice(2)}`;

const THEME = {
  typography: {
    family:
      "Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
    weight: 500,
    size: 16,
  },
  button: { radius: 14, shadow: "shadow", bg: "#D97762", color: "#FFFFFF" },
  gallery: { gap: 10, radius: 10 },
  layout: { cardRadius: 18, containerPadding: 20, sectionBg: "#FFFFFF" },
  stroke: { color: "#E5E7EB", weight: 1 },
  price: { base: 245, sale: 200 },
  swatches: [
      { name: "Leather Brown", color: "#4A332B" },
      { name: "Green 1", color: "#5B6F5D" },
      { name: "Green 2", color: "#5D7565" },
      { name: "Teal 1", color: "#5C7C7A" },
      { name: "Navy", color: "#4F5168" },
      { name: "Purple", color: "#6B4F5E" },
      { name: "Blue", color: "#4B5C71" },
      { name: "Red 1", color: "#A04946" },
      { name: "Wine", color: "#5C3738" },
      { name: "Teal 2", color: "#3F6D63" },
  ],
};

type DesktopMode = 'side' | 'stack';

export default function App() {
  const [color, setColor] = useState<string>(THEME.swatches[0].color);
  const [cartOpen, setCartOpen] = useState<boolean>(false);
  const [cart, setCart] = useState<any[]>([]);
  const [arms, setArms] = useState<string>("Fixed arms");
  const [legs, setLegs] = useState<string>("Steel");
  const [desktopMode, setDesktopMode] = useState<DesktopMode>('side');

  const price = useMemo(() => THEME.price, []);
  const [collapseKey, setCollapseKey] = useState<number>(0);
  const productModelPath = "/81438f2b51ac4a78958169b7e419acbb.glb";

  const addToCart = () => {
    const item = { id: uuid(), name: "Cozy Lounge chair", color, arms, legs, price: price.sale, qty: 1 };
    setCart((c) => [item, ...c]);
    setCartOpen(true);
  };
  const removeItem = (id: string) => setCart((c) => c.filter((x) => x.id !== id));

  const cssVars: React.CSSProperties = {
    ["--font-family" as any]: THEME.typography.family,
    ["--font-weight" as any]: THEME.typography.weight as any,
    ["--font-size" as any]: `${THEME.typography.size}px`,
    ["--stroke" as any]: THEME.stroke.color,
    ["--stroke-w" as any]: `${THEME.stroke.weight}px`,
    ["--card-radius" as any]: `${THEME.layout.cardRadius}px`,
    ["--pad" as any]: `${THEME.layout.containerPadding}px`,
    ["--section-bg" as any]: THEME.layout.sectionBg,
    ["--btn-radius" as any]: `${THEME.button.radius}px`,
    ["--btn-bg" as any]: THEME.button.bg,
    ["--btn-fg" as any]: THEME.button.color,
  };

  return (
    <div className="min-h-screen bg-slate-50" style={cssVars}>
      <header className="sticky top-0 z-30 border-b bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3" style={{ fontFamily: "var(--font-family)", fontWeight: "var(--font-weight)" }}>
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-slate-900 text-white">UI</div>
            <span className="text-lg font-bold">Ikarus 3D</span>
          </div>
          <div className="relative flex items-center gap-2">
            <div className="flex items-center gap-1 rounded-lg border p-1 text-xs">
              <button className={`rounded-md px-2 py-1 ${desktopMode === 'side' ? 'bg-slate-900 text-white' : ''}`} onClick={() => setDesktopMode('side')} title="Side by side">Side</button>
              <button className={`rounded-md px-2 py-1 ${desktopMode === 'stack' ? 'bg-slate-900 text-white' : ''}`} onClick={() => setDesktopMode('stack')} title="Stacked vertically">Stack</button>
            </div>
            <button className="relative rounded-xl border px-3 py-1.5 text-sm" onClick={() => setCartOpen((v) => !v)}>
              Cart
              {cart.length > 0 && (<span className="absolute -right-2 -top-2 grid h-5 w-5 place-items-center rounded-full bg-slate-900 text-xs text-white">{cart.length}</span>)}
            </button>
          </div>
        </div>
      </header>

      <section style={{ background: "var(--section-bg)", padding: "var(--pad)" }}>
        {desktopMode === 'side' ? (
          <div className="hidden md:block">
            <div className="mx-auto grid max-w-7xl grid-cols-[120px,1fr,380px] gap-6">
              <GalleryDesktop />
              <Stage color={color} modelPath={productModelPath} ratio="16/5" />
              <ConfiguratorPanel
                color={color}
                setColor={setColor}
                arms={arms}
                setArms={setArms}
                legs={legs}
                setLegs={setLegs}
                price={price}
                addToCart={addToCart}
                collapseKey={collapseKey}
                onCollapseAll={() => setCollapseKey((k) => k + 1)}
              />
            </div>
          </div>
        ) : (
          <div className="mx-auto space-y-3 md:space-y-6 max-w-md md:max-w-5xl">
            {/* 3D Model Section */}
            <div className="overflow-hidden rounded-[var(--card-radius)] border" style={{ borderColor: "var(--stroke)", borderWidth: "var(--stroke-w)" }}>
              <Stage color={color} modelPath={productModelPath} ratio="16/8 md:16/6" />
            </div>
            
            {/* Gallery Section - Mobile Only */}
            <div className="md:hidden">
              <GalleryHorizontal />
            </div>
            
            {/* Configuration Panel Section */}
            <div className="md:hidden">
              <div className="rounded-[var(--card-radius)] border bg-white" style={{ borderColor: "var(--stroke)", borderWidth: "var(--stroke-w)" }}>
                <div className="flex items-center justify-between border-b px-4 py-3" style={{ borderColor: "var(--stroke)", borderWidth: "var(--stroke-w)" }}>
                  <div>
                    <div className="text-sm opacity-70">Cozy Lounge chair</div>
                    <div className="mt-1 h-1 w-32 rounded-full bg-slate-200" />
                  </div>
                  <button className="grid h-8 w-8 place-items-center rounded-lg border hover:bg-slate-50" title="Collapse all" aria-label="Collapse all customizations" onClick={() => setCollapseKey((k) => k + 1)}>≡⚙</button>
                </div>
                <div className="p-4" style={{ fontFamily: "var(--font-family)", fontWeight: "var(--font-weight)", fontSize: "var(--font-size)" }}>
                  <div className="flex items-center justify-between">
                    <div className="text-sm opacity-70">Customize your Chair</div>
                    <button className="grid h-8 w-8 place-items-center rounded-md border text-sm" title="Collapse all" onClick={() => setCollapseKey((k) => k + 1)}>≡⚙</button>
                  </div>
                  <MobileAccordion title="1. Arms" collapseKey={collapseKey} onCollapseAll={() => setCollapseKey((k) => k + 1)}>
                    <MobileSection title="Choose arm type">
                      <RadioRow value={arms} setValue={setArms} options={["Fixed arms", "Adjustable"]} />
                    </MobileSection>
                  </MobileAccordion>
                  <MobileAccordion title="2. Arm Finish" collapseKey={collapseKey} onCollapseAll={() => setCollapseKey((k) => k + 1)}>
                    <MobileSection title="LEATHER">
                      <SwatchGrid color={color} setColor={setColor} />
                    </MobileSection>
                    <MobileSection title="SECTION">
                      <SwatchRow color={color} setColor={setColor} colors={THEME.swatches.slice(0, 6).map(s => s.color)} />
                    </MobileSection>
                    <MobileSection title="ALUMINUM">
                      <SwatchRow color={color} setColor={setColor} colors={THEME.swatches.slice(10, 16).map(s => s.color)} />
                    </MobileSection>
                  </MobileAccordion>
                  <MobileAccordion title="3. Legs Finish" collapseKey={collapseKey} onCollapseAll={() => setCollapseKey((k) => k + 1)}>
                    <MobileSection title="Choose leg finish">
                      <RadioRow value={legs} setValue={setLegs} options={["Steel", "Aluminum"]} />
                    </MobileSection>
                  </MobileAccordion>
                  <div className="mt-4 border-t pt-3" style={{ borderColor: "var(--stroke)", borderWidth: "var(--stroke-w)" }}>
                    <div className="flex items-center justify-between">
                      <div className="text-sm">Product Price</div>
                      <Price price={price} />
                    </div>
                    <div className="mt-3 flex justify-end">
                      <AddButton onClick={addToCart} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Desktop Configuration Panel */}
            <div className="hidden md:block">
              <ConfiguratorPanel
                color={color}
                setColor={setColor}
                arms={arms}
                setArms={setArms}
                legs={legs}
                setLegs={setLegs}
                price={price}
                addToCart={addToCart}
                collapseKey={collapseKey}
                onCollapseAll={() => setCollapseKey((k) => k + 1)}
              />
            </div>
          </div>
        )}
      </section>

      {cartOpen && (
        <div className="fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/30" onClick={() => setCartOpen(false)} />
          <aside className="absolute right-0 top-0 h-full w-[360px] max-w-[90vw] bg-white shadow-xl">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <div className="font-semibold">Your Cart</div>
              <button className="rounded-md border px-2 py-1 text-sm" onClick={() => setCartOpen(false)}>Close</button>
            </div>
            <div className="divide-y">
              {cart.length === 0 && <div className="p-4 text-sm text-slate-500">Cart is empty</div>}
              {cart.map((item) => (
                <div key={item.id} className="flex items-center gap-3 p-4">
                  <div className="h-14 w-14 rounded-lg border" style={{ background: item.color }} />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-semibold">{item.name}</div>
                    <div className="truncate text-xs text-slate-600">{item.arms} · {item.legs}</div>
                    <div className="text-sm font-bold">${item.price}</div>
                  </div>
                  <button className="rounded-md border px-2 py-1 text-xs" onClick={() => removeItem(item.id)}>Remove</button>
                </div>
              ))}
            </div>
          </aside>
        </div>
      )}

      <footer className="mx-auto max-w-7xl px-4 py-8 text-center text-xs text-slate-500">
        
        <div className="font-medium">© 2024 Ikarus 3D. All Rights Reserved.</div>
      </footer>
    </div>
  );
}

function GalleryDesktop() {
  return (
    <div className="flex">
      <div className="flex w-full flex-col items-start gap-2.5">
        {[1, 2, 3, 4, 5].map((n) => (
          <img key={n} src="/cabinet.jpg" alt={`view ${n}`} className="aspect-[1/1] w-20 rounded-lg border object-cover" />
        ))}
      </div>
    </div>
  );
}

function GalleryHorizontal() {
  return (
    <div className="mt-3 overflow-x-auto">
      <div className="flex items-center gap-2.5">
        {[1, 2, 3, 4, 5].map((n) => (
          <img key={n} src="/cabinet.jpg" alt={`view ${n}`} className="aspect-[1/1] w-16 shrink-0 rounded-lg border object-cover" />
        ))}
      </div>
    </div>
  );
}

function Stage({ color, ratio = "16/6", modelPath }: { color: string; ratio?: string; modelPath?: string }) {
  // Handle responsive aspect ratios
  const getAspectRatio = () => {
    if (ratio === "16/8 md:16/6") {
      return "16/8";
    }
    if (ratio === "16/10 md:16/7") {
      return "16/10";
    }
    return ratio;
  };

  const getResponsiveClasses = () => {
    if (ratio === "16/8 md:16/6") {
      return "aspect-[16/8] md:aspect-[16/6]";
    }
    if (ratio === "16/10 md:16/7") {
      return "aspect-[16/10] md:aspect-[16/7]";
    }
    return "";
  };

  return (
    <div className="grid place-items-center">
      <div className={`relative w-full max-w-5xl ${getResponsiveClasses()}`} style={getResponsiveClasses() ? {} : { aspectRatio: getAspectRatio() }}>
        <div className="absolute inset-0 grid place-items-center">
          {modelPath ? (
            <div className="w-full h-full">
              <ThreeJSViewer modelPath={modelPath} color={color} />
            </div>
          ) : (
            <div className="h-28 w-3/5 rounded-md opacity-80 mix-blend-multiply" style={{ background: color }} />
          )}
        </div>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2">
          {[Focus, Ruler, Maximize2, ZoomIn, ZoomOut].map((Icon, i) => (
            <button key={i} className="grid h-9 w-9 place-items-center rounded-md border bg-white shadow-sm hover:bg-slate-100" type="button">
              <Icon size={16} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function ConfiguratorPanel({ color, setColor, arms, setArms, legs, setLegs, price, addToCart, collapseKey, onCollapseAll }:{ color: string; setColor: (c:string)=>void; arms: string; setArms: (v:string)=>void; legs: string; setLegs:(v:string)=>void; price: {base:number; sale:number}; addToCart: ()=>void; collapseKey:number; onCollapseAll: ()=>void; }) {
  return (
    <div className="rounded-[var(--card-radius)] border bg-white" style={{ borderColor: "var(--stroke)", borderWidth: "var(--stroke-w)" }}>
      <div className="flex items-center justify-between border-b px-4 py-3" style={{ borderColor: "var(--stroke)", borderWidth: "var(--stroke-w)" }}>
        <div>
          <div className="text-sm opacity-70">Cozy Lounge chair</div>
          <div className="mt-1 h-1 w-32 rounded-full bg-slate-200" />
        </div>
        <button className="grid h-8 w-8 place-items-center rounded-lg border hover:bg-slate-50" title="Collapse all" aria-label="Collapse all customizations" onClick={onCollapseAll}>≡⚙</button>
      </div>
      <div className="p-4" style={{ fontFamily: "var(--font-family)", fontWeight: "var(--font-weight)", fontSize: "var(--font-size)" }}>
        <div className="flex items-center justify-between">
          <div className="text-sm opacity-70">Customize your Chair</div>
          <button className="grid h-8 w-8 place-items-center rounded-md border text-sm" title="Collapse all" onClick={onCollapseAll}>≡⚙</button>
        </div>
        <DesktopAccordion title="1. Arms" subtitle={arms} collapseKey={collapseKey}>
          <RadioRow value={arms} setValue={setArms} options={["Fixed arms", "Adjustable"]} />
        </DesktopAccordion>
        <DesktopAccordion title="2. Arm Finish" subtitle="Leather Brown" defaultOpen collapseKey={collapseKey}>
          <div className="mt-1 text-xs font-semibold">LEATHER</div>
          <SwatchGrid color={color} setColor={setColor} />
          <div className="mt-2 text-xs font-semibold opacity-70">SECTION</div>
          <SwatchRow color={color} setColor={setColor} colors={THEME.swatches.slice(0, 6).map(s => s.color)} />
          <div className="mt-2 text-xs font-semibold opacity-70">ALUMINUM</div>
          <SwatchRow color={color} setColor={setColor} colors={THEME.swatches.slice(10, 16).map(s => s.color)} />
        </DesktopAccordion>
        <DesktopAccordion title="3. Legs Finish" subtitle={legs} collapseKey={collapseKey}>
          <RadioRow value={legs} setValue={setLegs} options={["Steel", "Aluminum"]} />
        </DesktopAccordion>
        <div className="mt-2 border-t pt-3" style={{ borderColor: "var(--stroke)", borderWidth: "var(--stroke-w)" }}>
          <div className="flex items-center justify-between">
            <div className="text-sm">Product Price</div>
            <Price price={price} />
          </div>
          <div className="mt-3 flex justify-end">
            <AddButton onClick={addToCart} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Price({ price }:{price:{base:number;sale:number}}) {
  return (
    <div className="flex items-baseline gap-2">
      <div className="text-2xl font-extrabold">${price.sale}</div>
      <div className="text-sm line-through opacity-60">${price.base}</div>
    </div>
  );
}

function AddButton({ onClick }:{onClick:()=>void}) {
  return (
    <button onClick={onClick} className={`rounded-[var(--btn-radius)] px-5 py-3 font-semibold ${THEME.button.shadow} transition active:scale-[0.99]`} style={{ background: "var(--btn-bg)", color: "var(--btn-fg)" }}>Add to cart</button>
  );
}

function DesktopAccordion({ title, subtitle, children, defaultOpen = false, collapseKey }:{title:string; subtitle?:string; children:React.ReactNode; defaultOpen?: boolean; collapseKey:number}) {
  const [open, setOpen] = useState<boolean>(defaultOpen);
  useEffect(() => { setOpen(false); }, [collapseKey]);
  return (
    <div className="mt-3 rounded-xl border" style={{ borderColor: "var(--stroke)", borderWidth: "var(--stroke-w)" }}>
      <button className="flex w-full items-center justify-between px-3 py-2" onClick={() => setOpen((v) => !v)}>
        <div>
          <div className="text-sm font-semibold">{title}</div>
          {subtitle && <div className="text-xs opacity-60">{subtitle}</div>}
        </div>
        <span className="text-xl">{open ? "–" : "+"}</span>
      </button>
      {open && <div className="border-t p-3" style={{ borderColor: "var(--stroke)", borderWidth: "var(--stroke-w)" }}>{children}</div>}
    </div>
  );
}

function MobileAccordion({ title, children, collapseKey, onCollapseAll }:{title:string; children:React.ReactNode; collapseKey:number; onCollapseAll:()=>void}) {
  const [open, setOpen] = useState<boolean>(true);
  useEffect(() => { setOpen(false); }, [collapseKey]);
  return (
    <div>
      <div className="flex w-full items-center justify-between px-4 py-3">
        <button className="text-left text-sm font-semibold" onClick={() => setOpen((v) => !v)}>
          {title}
        </button>
        <div className="flex items-center gap-2">
          <button className="grid h-8 w-8 place-items-center rounded-md border text-sm" title="Collapse all" onClick={(e) => { e.stopPropagation(); onCollapseAll?.(); }}>≡⚙</button>
          <button className="grid h-8 w-8 place-items-center rounded-md border text-lg" onClick={() => setOpen((v) => !v)}>{open ? "–" : "+"}</button>
        </div>
      </div>
      {open && <div className="border-t" style={{ borderColor: "var(--stroke)", borderWidth: "var(--stroke-w)" }}>{children}</div>}
    </div>
  );
}

function MobileSection({ title, children }:{title:string; children:React.ReactNode}) {
  return (
    <div className="px-4 py-2">
      <div className="mb-1.5 text-xs font-semibold">{title}</div>
      {children}
    </div>
  );
}

function RadioRow({ value, setValue, options }:{value:string; setValue:(v:string)=>void; options:string[]}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button key={opt} onClick={() => setValue(opt)} className={`rounded-full border px-3 py-1 text-xs ${value === opt ? "bg-slate-900 text-white" : "bg-white"}`}>
          {opt}
        </button>
      ))}
    </div>
  );
}

function SwatchGrid({ color, setColor }:{color:string; setColor:(c:string)=>void}) {
  return (
    <div className="grid grid-cols-6 gap-1.5 sm:grid-cols-7">
      {THEME.swatches.map((swatch) => (
        <Swatch key={swatch.color} color={swatch.color} selected={color === swatch.color} onClick={() => setColor(swatch.color)} name={swatch.name} />
      ))}
    </div>
  );
}

function SwatchRow({ color, setColor, colors }:{color:string; setColor:(c:string)=>void; colors:string[]}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {colors.map((c) => {
        const swatch = THEME.swatches.find(s => s.color === c);
        return (
          <Swatch key={c} color={c} selected={color === c} onClick={() => setColor(c)} name={swatch?.name || c} />
        );
      })}
    </div>
  );
}

function Swatch({ color, selected, onClick, name }: { color: string; selected: boolean; onClick: () => void; name?: string }) {
  return (
    <button aria-label={`Color ${name || color}`} onClick={onClick} className="group relative inline-grid h-10 w-10 place-items-center">
      <div className={`relative h-9 w-9 rounded-full border transition-transform ${selected ? "scale-[1.02]" : "scale-100"}`} style={{ background: color }}>
        {selected && (<div className="pointer-events-none absolute inset-0 rounded-full ring-2 ring-orange-400 outline outline-4 outline-white" />)}
        {selected && (<span className="pointer-events-none absolute -right-1 -top-1 grid h-4 w-4 place-items-center rounded-full bg-orange-500 text-[10px] font-bold text-white shadow" aria-hidden>✓</span>)}
      </div>
      <div className="pointer-events-none absolute left-[-148px] top-1/2 hidden -translate-y-1/2 opacity-0 transition group-hover:block group-hover:opacity-100">
        <div className="w-[132px] rounded-xl border bg-white p-2 shadow-xl">
          <div className="h-20 w-full rounded-md border" style={{ background: color }} />
          <div className="mt-2 truncate px-1 text-xs text-slate-700">{name || color}</div>
        </div>
      </div>
    </button>
  );
}
