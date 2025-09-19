import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Camera, Info, AlertTriangle, CheckCircle2, GitCompare } from 'lucide-react';

type Product = {
  barcode: string;
  name: string;
  brand: string;
  quantity: string;
  category: string;
  countries: string[];
  image?: string;
  nutrition: Partial<{
    energy_kcal_100g: number;
    fat_100g: number;
    saturated_fat_100g: number;
    sugars_100g: number;
    salt_100g: number;
    protein_100g: number;
    fiber_100g: number;
  }>;
};

// Simple simulated DB
const MOCK_DB: Record<string, Product> = {
  '8901058855677': {
    barcode: '8901058855677',
    name: 'Tomato Ketchup',
    brand: 'Maggi',
    quantity: '1 kg',
    category: 'Sauces & Ketchup',
    countries: ['India', 'UAE'],
    image: '/placeholder.svg',
    nutrition: {
      energy_kcal_100g: 100,
      fat_100g: 0.1,
      saturated_fat_100g: 0,
      sugars_100g: 22,
      salt_100g: 2.7,
      protein_100g: 1.2,
      fiber_100g: 0.3,
    },
  },
  '5000157072120': {
    barcode: '5000157072120',
    name: 'Tomato Ketchup',
    brand: 'Heinz',
    quantity: '570 g',
    category: 'Sauces & Ketchup',
    countries: ['UK', 'EU', 'India'],
    image: '/placeholder.svg',
    nutrition: {
      energy_kcal_100g: 102,
      fat_100g: 0.1,
      saturated_fat_100g: 0,
      sugars_100g: 22.8,
      salt_100g: 1.8,
      protein_100g: 1.3,
      fiber_100g: 0.2,
    },
  },
};

function level(value: number | undefined, thresholds: [number, number], reverse = false) {
  if (value == null) return { label: 'n/a', color: 'text-muted-foreground' };
  const [low, high] = thresholds;
  const isGood = reverse ? value >= high : value <= low;
  const isBad = reverse ? value <= low : value >= high;
  if (isGood) return { label: 'low', color: 'text-emerald-600' };
  if (isBad) return { label: 'high', color: 'text-red-600' };
  return { label: 'moderate', color: 'text-yellow-600' };
}

function computeHealthRating(p: Product) {
  const n = p.nutrition;
  if (!n) return { score: null as number | null, note: 'Insufficient data' };
  const sugars = n.sugars_100g ?? 0;
  const sat = n.saturated_fat_100g ?? 0;
  const salt = n.salt_100g ?? 0;
  const fiber = n.fiber_100g ?? 0;
  // Simple heuristic: lower sugars/sat/salt, higher fiber => higher score
  let score = 100;
  score -= Math.min(60, sugars * 2);
  score -= Math.min(20, sat * 5);
  score -= Math.min(20, salt * 5);
  score += Math.min(20, fiber * 4);
  score = Math.max(0, Math.min(100, Math.round(score)));
  return { score, note: 'Heuristic health rating' };
}

function ProductCard({ product }: { product: Product }) {
  const { score, note } = computeHealthRating(product);
  const n = product.nutrition;
  const sugarLevel = level(n.sugars_100g, [5, 22.5]); // per 100g UK style
  const satLevel = level(n.saturated_fat_100g, [1.5, 5]);
  const saltLevel = level(n.salt_100g, [0.3, 1.5]);
  const proteinLevel = level(n.protein_100g, [5, 20], true); // higher is good
  const fiberLevel = level(n.fiber_100g, [3, 6], true); // higher is good

  const warnings: string[] = [];
  if ((n.sugars_100g ?? 0) >= 22.5) warnings.push('High in sugar');
  if ((n.salt_100g ?? 0) >= 1.5) warnings.push('High in salt');
  if ((n.saturated_fat_100g ?? 0) >= 5) warnings.push('High in saturated fat');
  if ((n.protein_100g ?? 0) < 5) warnings.push('Low in protein');

  return (
    <Card className="border shadow-card">
      <CardHeader className="flex flex-row items-center gap-4">
        <img src={product.image || '/placeholder.svg'} alt={product.name} className="h-16 w-16 rounded object-cover" />
        <div>
          <CardTitle>{product.name} · {product.brand}</CardTitle>
          <CardDescription>
            {product.quantity} • {product.category}
          </CardDescription>
          <div className="text-xs text-muted-foreground mt-1">Barcode: {product.barcode} • Sold in: {product.countries.join(', ')}</div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="mb-1 text-sm font-medium">Nutrition per 100g</div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>Energy: {n.energy_kcal_100g ?? 'N/A'} kcal</div>
            <div>Fat: {n.fat_100g ?? 'N/A'} g ({level(n.fat_100g, [3, 17]).label})</div>
            <div>Saturated fat: {n.saturated_fat_100g ?? 'N/A'} g <span className={satLevel.color}>({satLevel.label})</span></div>
            <div>Sugars: {n.sugars_100g ?? 'N/A'} g <span className={sugarLevel.color}>({sugarLevel.label})</span></div>
            <div>Salt: {n.salt_100g ?? 'N/A'} g <span className={saltLevel.color}>({saltLevel.label})</span></div>
            <div>Protein: {n.protein_100g ?? 'N/A'} g <span className={proteinLevel.color}>({proteinLevel.label})</span></div>
            <div>Fiber: {n.fiber_100g ?? 'N/A'} g <span className={fiberLevel.color}>({fiberLevel.label})</span></div>
          </div>
        </div>
        <div className="rounded-md border p-3">
          <div className="mb-1 flex items-center gap-2 text-sm font-medium"><Info className="h-4 w-4" /> Health rating</div>
          {score == null ? (
            <div className="text-sm text-muted-foreground">{note}</div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="text-2xl font-bold">{score}/100</div>
              <div className="h-2 grow overflow-hidden rounded bg-muted">
                <div className={`h-2 ${score >= 70 ? 'bg-emerald-500' : score >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${score}%` }} />
              </div>
            </div>
          )}
        </div>
        {warnings.length > 0 && (
          <div className="rounded-md border border-amber-200 bg-amber-50 p-3">
            <div className="mb-1 flex items-center gap-2 text-sm font-medium text-amber-700"><AlertTriangle className="h-4 w-4" /> Warnings</div>
            <ul className="list-disc pl-5 text-sm text-amber-800">
              {warnings.map(w => <li key={w}>{w}</li>)}
            </ul>
          </div>
        )}
        <div className="rounded-md border p-3">
          <div className="mb-1 flex items-center gap-2 text-sm font-medium"><CheckCircle2 className="h-4 w-4" /> Recommendation</div>
          <div className="text-sm text-muted-foreground">Try a low-sugar ketchup or homemade tomato relish. Better alternative: Heinz No Added Sugar Ketchup.</div>
        </div>
        <div className="text-xs text-muted-foreground">Health tip: Use sparingly due to high sugar.</div>
      </CardContent>
    </Card>
  );
}

export default function FoodScanner() {
  const navigate = useNavigate();
  const [barcode, setBarcode] = useState('');
  const [compareBarcode, setCompareBarcode] = useState('');
  const [product, setProduct] = useState<Product | null>(null);
  const [compareProduct, setCompareProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [supportsDetector, setSupportsDetector] = useState<boolean>(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [instructionIndex, setInstructionIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);
  const detectorRef = useRef<any>(null);
  const instructionTimerRef = useRef<number | null>(null);
  const zxingReaderRef = useRef<any>(null);
  const zxingStopRef = useRef<() => void>(() => {});
  const lastScanCodeRef = useRef<string>('');
  const lastScanAtRef = useRef<number>(0);

  const openBasicStream = async () => {
    try {
      let stream: MediaStream | null = null;
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'environment' } }, audio: false });
      } catch {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false });
      }
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        try { await videoRef.current.play(); } catch {}
      }
    } catch {
      setError('Could not access the camera. Check permissions and try again.');
    }
  };

  const instructions = [
    'Center the barcode inside the frame.',
    'Hold steady and ensure good lighting.',
    'Avoid glare or reflections on the barcode.',
    'We’ll fetch nutrition details once detected.',
  ];

  const simulateLookup = (code: string): Product => {
    const clean = code.trim();
    if (MOCK_DB[clean]) return MOCK_DB[clean];
    // generate a plausible ketchup-like product
    return {
      barcode: clean,
      name: 'Tomato Ketchup',
      brand: 'Generic',
      quantity: '500 g',
      category: 'Sauces & Ketchup',
      countries: ['India'],
      image: '/placeholder.svg',
      nutrition: {
        energy_kcal_100g: 98,
        fat_100g: 0.2,
        saturated_fat_100g: 0.1,
        sugars_100g: 21 + Math.round((parseInt(clean.slice(-2)) % 5)),
        salt_100g: 2.0,
        protein_100g: 1.1,
        fiber_100g: 0.3,
      },
    };
  };

  const fetchFromOFF = async (code: string): Promise<Product | null> => {
    try {
      const res = await fetch(`https://world.openfoodfacts.org/api/v0/product/${encodeURIComponent(code)}.json`);
      const json = await res.json();
      if (!json || json.status !== 1) return null;
      const p = json.product;
      const prod: Product = {
        barcode: code,
        name: p.product_name || 'Unknown',
        brand: Array.isArray(p.brands_tags) && p.brands_tags.length ? p.brands_tags[0] : (p.brands || 'Unknown'),
        quantity: p.quantity || 'N/A',
        category: Array.isArray(p.categories_tags) && p.categories_tags.length ? p.categories_tags[0].replace('en:', '').replace('-', ' ') : 'Unknown',
        countries: (p.countries && String(p.countries).split(',').map((s: string) => s.trim()).filter(Boolean)) || [],
        image: p.image_front_small_url || p.image_small_url || undefined,
        nutrition: {
          energy_kcal_100g: p.nutriments?.['energy-kcal_100g'] ?? p.nutriments?.energy_kcal_100g,
          fat_100g: p.nutriments?.fat_100g,
          saturated_fat_100g: p.nutriments?.['saturated-fat_100g'],
          sugars_100g: p.nutriments?.sugars_100g,
          salt_100g: p.nutriments?.salt_100g,
          protein_100g: p.nutriments?.proteins_100g,
          fiber_100g: p.nutriments?.fiber_100g,
        },
      };
      return prod;
    } catch {
      return null;
    }
  };

  const onScan = () => {
    if (!barcode) { setError('Please enter a barcode number'); return; }
    setError(null);
    const prod = simulateLookup(barcode);
    setProduct(prod);
    setCompareProduct(null);
  };

  const onCompare = () => {
    if (!product) return;
    if (!compareBarcode) { setError('Enter a second barcode to compare'); return; }
    setError(null);
    const prod = simulateLookup(compareBarcode);
    setCompareProduct(prod);
  };

  // Detector support check
  useEffect(() => {
    const BD = (window as any).BarcodeDetector;
    if (typeof BD === 'function') {
      setSupportsDetector(true);
      detectorRef.current = new BD({ formats: ['ean_13', 'ean_8', 'upc_a', 'upc_e', 'code_128'] });
    } else {
      setSupportsDetector(false);
    }
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
      if (instructionTimerRef.current) window.clearInterval(instructionTimerRef.current);
    };
  }, []);

  const startLiveScan = async () => {
    setError(null);
    setScanning(true);
    setStep(2);
    if (!instructionTimerRef.current) {
      instructionTimerRef.current = window.setInterval(() => {
        setInstructionIndex((i) => (i + 1) % instructions.length);
      }, 2000);
    }
    try {
      if (!supportsDetector) {
        await startZXingScan();
        return;
      }
      // Try back camera first, then fallback to front camera if unavailable
      let stream: MediaStream | null = null;
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'environment' } }, audio: false });
      } catch {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false });
      }
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      const analyze = async () => {
        if (!videoRef.current || !detectorRef.current) {
          rafRef.current = requestAnimationFrame(analyze);
          return;
        }
        try {
          const barcodes = await detectorRef.current.detect(videoRef.current);
          if (barcodes && barcodes.length) {
            const code = barcodes[0].rawValue || barcodes[0].rawValue || '';
            if (code) {
              const now = Date.now();
              if (code !== lastScanCodeRef.current || now - lastScanAtRef.current > 2000) {
                lastScanCodeRef.current = code;
                lastScanAtRef.current = now;
                const off = await fetchFromOFF(code);
                const prod = off || simulateLookup(code);
                setBarcode(code);
                setProduct(prod);
                setCompareProduct(null);
              }
            }
          }
        } catch {}
        rafRef.current = requestAnimationFrame(analyze);
      };
      rafRef.current = requestAnimationFrame(analyze);
    } catch (e) {
      setScanning(false);
      setError('Camera access denied or not available. You can use manual entry.');
    }
  };

  // ZXing fallback for browsers without BarcodeDetector (works on iOS Safari)
  const startZXingScan = async () => {
    // Try to load library; if it fails, keep overlay open and show hint, but don't close
    const showHint = (msg: string) => setError(msg);
    try {
      const libUrl = 'https://cdn.jsdelivr.net/npm/@zxing/library@0.20.0';
      await new Promise<void>((resolve) => {
        const existing = document.querySelector(`script[data-zxing="1"]`);
        if (existing) return resolve();
        const s = document.createElement('script');
        s.src = `${libUrl}/umd/index.min.js`;
        s.async = true;
        s.dataset.zxing = '1';
        s.onload = () => resolve();
        s.onerror = () => resolve();
        document.head.appendChild(s);
      });
      const ZXingAny: any = (window as any).ZXing;
      if (!ZXingAny) {
        showHint('Scanner library couldn\'t load. Showing camera preview only.');
        await openBasicStream();
        return;
      }
      const reader = new ZXingAny.BrowserMultiFormatReader();
      zxingReaderRef.current = reader;
      let devices: any[] = [];
      try {
        devices = await ZXingAny.BrowserCodeReader.listVideoInputDevices();
      } catch {}
      let deviceId: string | undefined = undefined;
      if (devices && devices.length) {
        const back = devices.find((d: any) => /back|rear|environment/i.test(d.label));
        deviceId = (back || devices[0]).deviceId;
      }
      reader.decodeFromVideoDevice(deviceId || null, videoRef.current, async (result: any) => {
        if (result) {
          const code = result.getText ? result.getText() : result.text || '';
          if (code) {
            const now = Date.now();
            if (code !== lastScanCodeRef.current || now - lastScanAtRef.current > 2000) {
              lastScanCodeRef.current = code;
              lastScanAtRef.current = now;
              const off = await fetchFromOFF(code);
              const prod = off || simulateLookup(code);
              setBarcode(code);
              setProduct(prod);
              setCompareProduct(null);
            }
          }
        }
      });
      zxingStopRef.current = () => { try { reader.reset(); } catch {} };
    } catch (e) {
      showHint('Live scanning fallback encountered an error. Showing camera preview only.');
      await openBasicStream();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-wellness">
      <header className="sticky top-0 z-10 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="container mx-auto flex items-center gap-4 px-4 py-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">Food Scanner</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Step 1: Tips, mirror BPM flow */}
        {step === 1 && (
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>Scan Tips</CardTitle>
              <CardDescription>We’ll use your camera to read the barcode.</CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal space-y-2 pl-5 text-sm">
                <li>Center the barcode inside a well-lit area.</li>
                <li>Hold steady and avoid glare or reflections.</li>
                <li>Use the back camera for better focus.</li>
              </ol>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button onClick={startLiveScan} variant="secondary" className="w-full sm:w-auto">Open Scanner</Button>
                <div className="flex w-full grow flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
                  <Input placeholder="Enter barcode number" value={barcode} onChange={(e) => setBarcode(e.target.value)} className="w-full sm:w-64" />
                  <Button onClick={onScan} className="w-full sm:w-auto">Lookup</Button>
                </div>
              </div>
              {error ? <div className="mt-2 text-sm text-red-600">{error}</div> : null}
            </CardContent>
          </Card>
        )}

        {/* Legacy quick access card (still useful after first scan) */}
        {step !== 1 && (
          <Card className="mb-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Camera className="h-5 w-5" /> Scan a barcode</CardTitle>
              <CardDescription>Point your camera at a barcode or enter it manually.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button onClick={startLiveScan} variant="secondary" className="w-full sm:w-auto">Open Scanner</Button>
                <div className="flex w-full grow flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
                  <Input placeholder="Enter barcode number" value={barcode} onChange={(e) => setBarcode(e.target.value)} className="w-full sm:w-64" />
                  <Button onClick={onScan} className="w-full sm:w-auto">Lookup</Button>
                </div>
              </div>
              {error ? <div className="mt-2 text-sm text-red-600">{error}</div> : null}
            </CardContent>
          </Card>
        )}
        

        {scanning ? (
          <div className="fixed inset-0 z-50 bg-black/80">
            <div className="relative mx-auto flex h-full w-full max-w-4xl flex-col items-center justify-center px-4">
              <div className="relative w-full max-w-3xl">
                <div className="relative w-full overflow-hidden rounded-lg aspect-video">
                  <video ref={videoRef} className="absolute inset-0 h-full w-full object-cover" playsInline muted />
                </div>
                {/* Viewfinder overlay */}
                <div className="pointer-events-none absolute inset-0 rounded-lg ring-2 ring-white/70">
                  <div className="absolute inset-4 md:inset-8 rounded border-2 border-white/90" />
                </div>
              </div>
              <div className="mt-3 flex flex-col items-center gap-2">
                <div className="text-center text-sm text-white/90">{instructions[instructionIndex]}</div>
                <div className="text-xs text-white/70">Align the barcode inside the rectangle</div>
              </div>
              <Button className="mt-4" variant="outline" onClick={() => {
                setScanning(false);
                if (rafRef.current) cancelAnimationFrame(rafRef.current);
                if (streamRef.current) { streamRef.current.getTracks().forEach(t => t.stop()); streamRef.current = null; }
                if (instructionTimerRef.current) { window.clearInterval(instructionTimerRef.current); instructionTimerRef.current = null; }
                if (zxingReaderRef.current) { try { zxingReaderRef.current.reset(); } catch {} zxingReaderRef.current = null; }
              }}>Cancel</Button>
            </div>
          </div>
        ) : null}

        {product ? (
          <div className="space-y-4">
            <ProductCard product={product} />

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><GitCompare className="h-5 w-5" /> Compare products</CardTitle>
                <CardDescription>Scan another barcode to compare side-by-side.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Input placeholder="Enter second barcode" value={compareBarcode} onChange={(e) => setCompareBarcode(e.target.value)} />
                  <Button variant="secondary" onClick={onCompare}>Compare</Button>
                </div>
                {compareProduct ? (
                  <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                    <ProductCard product={product} />
                    <ProductCard product={compareProduct} />
                  </div>
                ) : null}
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">After scanning, product details, nutrition, and insights will appear here.</div>
        )}
      </main>
    </div>
  );
}


