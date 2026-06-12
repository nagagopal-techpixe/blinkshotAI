import { useState, useRef, useEffect, useCallback } from "react";

const stylePresets = [
  { label: "Original",    thumb: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300&q=80", filters: { exposure: 0, contrast: 0, saturation: 0, highlights: 0, shadows: 0, temperature: 0, sharpness: 0, vignette: 0 } },
  { label: "Cinematic",   thumb: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=300&q=80", filters: { exposure: -10, contrast: 20, saturation: -15, highlights: -20, shadows: 10, temperature: -10, sharpness: 10, vignette: 30 } },
  { label: "Fashion",     thumb: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=300&q=80", filters: { exposure: 10, contrast: 10, saturation: 20, highlights: 10, shadows: -5, temperature: 5, sharpness: 15, vignette: 10 } },
  { label: "Product",     thumb: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300&q=80", filters: { exposure: 15, contrast: 5, saturation: 0, highlights: -10, shadows: 20, temperature: 0, sharpness: 20, vignette: 0 } },
  { label: "Luxury",      thumb: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=300&q=80", filters: { exposure: -5, contrast: 15, saturation: -20, highlights: -15, shadows: 5, temperature: -5, sharpness: 5, vignette: 40 } },
  { label: "Golden Hour", thumb: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=300&q=80", filters: { exposure: 10, contrast: 10, saturation: 30, highlights: 20, shadows: -10, temperature: 30, sharpness: 5, vignette: 20 } },
];

const TOOLS = ["Select","Crop","Move","Brush","Expand","Text","Subtitle","AI"];

function Toggle({ enabled, onChange }) {
  return (
    <div onClick={onChange} className="relative cursor-pointer flex-shrink-0"
      style={{ width:40, height:22, borderRadius:11, background: enabled ? "linear-gradient(90deg,#8D45FE,#FD4FDA)" : "#1e1e2e", transition:"background 0.2s" }}>
      <div style={{ position:"absolute", top:3, left: enabled ? 21 : 3, width:16, height:16, borderRadius:"50%", background:"#fff", transition:"left 0.2s" }} />
    </div>
  );
}

function SliderControl({ label, value, min=-100, max=100, onChange }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex justify-between items-center">
        <span className="text-xs" style={{ color:"#9191A8" }}>{label}</span>
        <span className="text-xs font-bold text-white">{value > 0 ? `+${value}` : value}</span>
      </div>
      <div className="relative flex items-center" style={{ height:20 }}>
        <div className="w-full h-1.5 rounded-full" style={{ background:"#1e1e2e" }}>
          <div className="h-full rounded-full" style={{ width:`${pct}%`, background:"linear-gradient(90deg,#8D45FE,#FD4FDA)" }} />
        </div>
        <input type="range" min={min} max={max} value={value} onChange={e => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer" style={{ height:"100%" }} />
        <div className="absolute w-3 h-3 rounded-full border-2 border-white pointer-events-none"
          style={{ left:`calc(${pct}% - 6px)`, background:"#8D45FE" }} />
      </div>
    </div>
  );
}

function ToolIcon({ name, active }) {
  const color = active ? "#FD4FDA" : "#fff";
  const s = { width:18, height:18, fill:"none", stroke:color, strokeWidth:1.8 };
  switch(name) {
    case "Select":   return <svg {...s} viewBox="0 0 24 24"><path d="M5 3l14 9-7 1-4 7z"/></svg>;
    case "Crop":     return <svg {...s} viewBox="0 0 24 24"><path d="M6 2v14h14"/><path d="M2 6h14v14"/></svg>;
    case "Move":     return <svg {...s} viewBox="0 0 24 24"><path d="M5 9l-3 3 3 3M9 5l3-3 3 3M15 19l-3 3-3-3M19 9l3 3-3 3"/><path d="M2 12h20M12 2v20"/></svg>;
    case "Brush":    return <svg {...s} viewBox="0 0 24 24"><path d="M9.06 11.9l8.07-8.06a2.85 2.85 0 114.03 4.03l-8.06 8.07"/><path d="M7.07 14.94c-1.66 0-3 1.35-3 3.02 0 1.33-2.5 1.52-2 2.02 1 1 2.48 1.02 3.5 1.02 2.2 0 4-1.8 4-4.04a3.01 3.01 0 00-2.5-2.02z"/></svg>;
    case "Expand":   return <svg {...s} viewBox="0 0 24 24"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>;
    case "Text":     return <svg {...s} viewBox="0 0 24 24"><path d="M4 7V4h16v3M9 20h6M12 4v16"/></svg>;
    case "Subtitle": return <svg {...s} viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M7 15h4m4 0h2M7 11h10"/></svg>;
    case "AI":       return <svg {...s} viewBox="0 0 24 24"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>;
    default: return null;
  }
}

function applyFilters(canvas, imgEl, filters, vignetteEnabled) {
  if (!canvas || !imgEl) return;
  const ctx = canvas.getContext("2d");
  const W = imgEl.naturalWidth || imgEl.width;
  const H = imgEl.naturalHeight || imgEl.height;
  canvas.width = W;
  canvas.height = H;
  ctx.drawImage(imgEl, 0, 0, W, H);
  const imageData = ctx.getImageData(0, 0, W, H);
  const d = imageData.data;
  const expF = 1 + filters.exposure / 100;
  const conF = (259 * (filters.contrast + 255)) / (255 * (259 - filters.contrast));
  const satF = 1 + filters.saturation / 100;
  const temp = filters.temperature;
  const hilF = filters.highlights / 200;
  const shaF = filters.shadows / 200;
  for (let i = 0; i < d.length; i += 4) {
    let r = d[i], g = d[i+1], b = d[i+2];
    r *= expF; g *= expF; b *= expF;
    r = conF*(r-128)+128; g = conF*(g-128)+128; b = conF*(b-128)+128;
    const lum = 0.299*r + 0.587*g + 0.114*b;
    if (lum > 128) { const f = hilF*((lum-128)/127); r+=f*r; g+=f*g; b+=f*b; }
    else           { const f = shaF*((128-lum)/128);  r+=f*r; g+=f*g; b+=f*b; }
    const avg = (r+g+b)/3;
    r = avg+(r-avg)*satF; g = avg+(g-avg)*satF; b = avg+(b-avg)*satF;
    if (temp > 0)       { r *= 1+temp/200;           b *= 1-temp/400; }
    else if (temp < 0)  { b *= 1+Math.abs(temp)/200; r *= 1-Math.abs(temp)/400; }
    d[i]   = Math.max(0,Math.min(255,r));
    d[i+1] = Math.max(0,Math.min(255,g));
    d[i+2] = Math.max(0,Math.min(255,b));
  }
  ctx.putImageData(imageData, 0, 0);
  if (vignetteEnabled && filters.vignette > 0) {
    const cx=W/2, cy=H/2, rad=Math.sqrt(cx*cx+cy*cy);
    const grad = ctx.createRadialGradient(cx,cy,rad*0.3,cx,cy,rad);
    grad.addColorStop(0,"rgba(0,0,0,0)");
    grad.addColorStop(1,`rgba(0,0,0,${filters.vignette/150})`);
    ctx.fillStyle=grad; ctx.fillRect(0,0,W,H);
  }
}

export default function PhotoEditor() {
  const [imgEl, setImgEl]               = useState(null);
  const originalImgEl                   = useRef(null);
  const [hasImage, setHasImage]         = useState(false);
  const [view, setView]                 = useState("after");
  const [selectedPreset, setSelectedPreset] = useState(0);
  const [activeTab, setActiveTab]       = useState("adjust");
  const [activeTool, setActiveTool]     = useState("Select");
  const [exportFormat, setExportFormat] = useState("jpeg");
  const [exportQuality, setExportQuality] = useState(92);
  const [exporting, setExporting]       = useState(false);
  const [vignetteEnabled, setVignetteEnabled] = useState(true);
  const [aiRetouching, setAiRetouching] = useState(true);
  const [skinSmoothing, setSkinSmoothing] = useState(false);
  const [bgCleanup, setBgCleanup]       = useState(false);
  const [filters, setFilters]           = useState({ exposure:0, contrast:0, saturation:0, highlights:0, shadows:0, temperature:0, sharpness:0, vignette:0 });
  const [layers, setLayers] = useState([
    { id:"colorGrade",    label:"Color Grade",     active:true,  color:"#8D45FE" },
    { id:"subjectMask",   label:"Subject Mask",    active:false, color:"#FD4FDA" },
    { id:"skyReplacement",label:"Sky Replacement", active:false, color:"#45A6FE" },
  ]);

  const [zoom, setZoom]               = useState(1);
  const [panOffset, setPanOffset]     = useState({ x:0, y:0 });
  const [crop, setCrop]               = useState(null);
  const [cropDraft, setCropDraft]     = useState(null);
  const [selection, setSelection]     = useState(null);
  const [selDraft, setSelDraft]       = useState(null);
  const [brushStrokes, setBrushStrokes] = useState([]);
  const [textOverlays, setTextOverlays] = useState([]);
  const [textInput, setTextInput]     = useState(null);
  const [textInputValue, setTextInputValue] = useState("");
  const [textColor, setTextColor]     = useState("#ffffff");
  const [selectedTextId, setSelectedTextId] = useState(null); // ✅ Track selected text
  const [subtitle, setSubtitle]       = useState(null);
  const [brushColor, setBrushColor]   = useState("#FD4FDA");
  const [brushSize, setBrushSize]     = useState(12);
  const [aiStatus, setAiStatus]       = useState(null);

  const canvasRef    = useRef(null);
  const fileInputRef = useRef(null);
  const textInputRef = useRef(null);
  const isDrawing    = useRef(false);
  const dragStart    = useRef(null);
  const panStart     = useRef(null);
  const panDraft     = useRef({ x:0, y:0 });

  const updateFilter = (key, val) => setFilters(prev => ({ ...prev, [key]: val }));
  const toggleLayer  = (id) => setLayers(prev => prev.map(l => l.id===id ? { ...l, active:!l.active } : l));
  const activeLayerIds = layers.filter(l => l.active).map(l => l.id);

  // ✅ Generate unique text ID
  const generateTextId = () => `text_${Date.now()}_${Math.random()}`;

  // ── Render ────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext("2d");

    if (view === "before") {
      const orig = originalImgEl.current;
      if (!orig) return;
      canvas.width  = orig.naturalWidth  || orig.width;
      canvas.height = orig.naturalHeight || orig.height;
      ctx.drawImage(orig, 0, 0);
      return;
    }

    if (!imgEl) return;
    applyFilters(canvas, imgEl, filters, vignetteEnabled);
    const W = canvas.width, H = canvas.height;

    if (activeLayerIds.includes("colorGrade")) {
      ctx.save(); ctx.globalCompositeOperation="multiply"; ctx.globalAlpha=0.08;
      ctx.fillStyle="#c87941"; ctx.fillRect(0,0,W,H); ctx.restore();
      ctx.save(); ctx.globalCompositeOperation="screen"; ctx.globalAlpha=0.04;
      ctx.fillStyle="#8D45FE"; ctx.fillRect(0,0,W,H); ctx.restore();
    }
    if (activeLayerIds.includes("subjectMask")) {
      ctx.save();
      const cx=W*0.5, cy=H*0.45, rx=W*0.28, ry=H*0.38;
      const g=ctx.createRadialGradient(cx,cy,Math.min(rx,ry)*0.4,cx,cy,Math.max(rx,ry));
      g.addColorStop(0,"rgba(0,0,0,0)"); g.addColorStop(0.7,"rgba(0,0,0,0)"); g.addColorStop(1,"rgba(253,77,218,0.18)");
      ctx.fillStyle=g; ctx.fillRect(0,0,W,H); ctx.restore();
    }
    if (activeLayerIds.includes("skyReplacement")) {
      ctx.save(); const skyH=H*0.35;
      const sg=ctx.createLinearGradient(0,0,0,skyH);
      sg.addColorStop(0,"rgba(69,166,254,0.32)"); sg.addColorStop(1,"rgba(69,166,254,0)");
      ctx.fillStyle=sg; ctx.fillRect(0,0,W,skyH); ctx.restore();
    }
    if (brushStrokes.length) {
      ctx.save();
      brushStrokes.forEach(stroke => {
        if (!stroke.points.length) return;
        ctx.strokeStyle=stroke.color; ctx.lineWidth=stroke.size;
        ctx.lineCap="round"; ctx.lineJoin="round"; ctx.globalAlpha=0.7;
        ctx.beginPath();
        stroke.points.forEach((p,i) => i===0 ? ctx.moveTo(p.x,p.y) : ctx.lineTo(p.x,p.y));
        ctx.stroke();
      });
      ctx.restore();
    }
    textOverlays.forEach(t => {
      ctx.save();
      ctx.font=`bold ${t.size}px sans-serif`; ctx.fillStyle=t.color;
      ctx.shadowColor="rgba(0,0,0,0.7)"; ctx.shadowBlur=6;
      ctx.fillText(t.text, t.x, t.y);
      ctx.restore();
    });
    if (subtitle) {
      ctx.save();
      ctx.fillStyle="rgba(0,0,0,0.6)"; ctx.fillRect(0,H*0.88,W,H*0.12);
      ctx.font=`bold ${Math.floor(H*0.04)}px sans-serif`; ctx.fillStyle="#ffffff";
      ctx.textAlign="center"; ctx.textBaseline="middle";
      ctx.fillText(subtitle, W/2, H*0.94);
      ctx.restore();
    }
    if (crop) {
      ctx.save(); ctx.fillStyle="rgba(0,0,0,0.55)";
      ctx.fillRect(0,0,W,crop.y);
      ctx.fillRect(0,crop.y+crop.h,W,H-(crop.y+crop.h));
      ctx.fillRect(0,crop.y,crop.x,crop.h);
      ctx.fillRect(crop.x+crop.w,crop.y,W-(crop.x+crop.w),crop.h);
      ctx.strokeStyle="#FD4FDA"; ctx.lineWidth=2; ctx.setLineDash([6,3]);
      ctx.strokeRect(crop.x,crop.y,crop.w,crop.h);
      ctx.restore();
    }
  }, [filters, imgEl, view, vignetteEnabled, activeLayerIds.join(","), brushStrokes, textOverlays, subtitle, crop]);

  useEffect(() => {
    if (textInput && textInputRef.current) {
      setTimeout(() => textInputRef.current?.focus(), 30);
    }
  }, [textInput]);

  const toImageCoords = useCallback((e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x:0, y:0 };
    const rect   = canvas.getBoundingClientRect();
    const scaleX = canvas.width  / rect.width;
    const scaleY = canvas.height / rect.height;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top)  * scaleY,
    };
  }, []);

  // ✅ Check if click is near an existing text overlay (with proper text bounds)
  const findTextAtPosition = useCallback((imgPos) => {
    if (!canvasRef.current) return null;
    const ctx = canvasRef.current.getContext("2d");
    
    for (let t of textOverlays) {
      // Set up font to measure text properly
      ctx.font = `bold ${t.size}px sans-serif`;
      const metrics = ctx.measureText(t.text);
      
      // Calculate text bounding box
      // fillText draws from baseline, so we need to offset for height
      const textWidth = metrics.width;
      const textHeight = t.size * 1.2; // Approximate height (size * line-height factor)
      const textTop = t.y - t.size * 0.8; // Offset above baseline
      const textLeft = t.x;
      
      // Check if click is within text bounds (with padding)
      const padding = 15; // extra pixels around text to make it easier to click
      const minX = textLeft - padding;
      const maxX = textLeft + textWidth + padding;
      const minY = textTop - padding;
      const maxY = textTop + textHeight + padding;
      
      if (imgPos.x >= minX && imgPos.x <= maxX && 
          imgPos.y >= minY && imgPos.y <= maxY) {
        return t.id;
      }
    }
    return null;
  }, [textOverlays]);

  const handlePointerDown = useCallback((e) => {
    if (!hasImage) return;
    if (activeTool === "Text") return;
    const imgPos = toImageCoords(e);
    isDrawing.current  = true;
    dragStart.current  = { screen: { x: e.clientX, y: e.clientY }, img: imgPos };
    panStart.current   = { ...panOffset };
    panDraft.current   = { ...panOffset };

    if (activeTool === "Brush") {
      setBrushStrokes(prev => [...prev, { points:[imgPos], color:brushColor, size:brushSize }]);
    }
    if (activeTool === "Select") {
      setSelDraft({ x:imgPos.x, y:imgPos.y, w:0, h:0 });
      setSelection(null);
    }
    if (activeTool === "Crop") {
      setCropDraft({ x:imgPos.x, y:imgPos.y, w:0, h:0 });
      setCrop(null);
    }
  }, [hasImage, activeTool, brushColor, brushSize, panOffset, toImageCoords]);

  const handlePointerMove = useCallback((e) => {
    if (!isDrawing.current || !hasImage) return;
    const imgPos = toImageCoords(e);

    if (activeTool === "Brush") {
      setBrushStrokes(prev => {
        const updated = [...prev];
        const last = updated[updated.length-1];
        updated[updated.length-1] = { ...last, points:[...last.points, imgPos] };
        return updated;
      });
    }
    if (activeTool === "Move") {
      const dx = e.clientX - dragStart.current.screen.x;
      const dy = e.clientY - dragStart.current.screen.y;
      panDraft.current = { x: panStart.current.x + dx, y: panStart.current.y + dy };
      setPanOffset(panDraft.current);
    }
    if (activeTool === "Select" && selDraft) {
      const x = Math.min(imgPos.x, dragStart.current.img.x);
      const y = Math.min(imgPos.y, dragStart.current.img.y);
      const w = Math.abs(imgPos.x - dragStart.current.img.x);
      const h = Math.abs(imgPos.y - dragStart.current.img.y);
      setSelDraft({ x, y, w, h });
    }
    if (activeTool === "Crop" && cropDraft) {
      const x = Math.min(imgPos.x, dragStart.current.img.x);
      const y = Math.min(imgPos.y, dragStart.current.img.y);
      const w = Math.abs(imgPos.x - dragStart.current.img.x);
      const h = Math.abs(imgPos.y - dragStart.current.img.y);
      setCropDraft({ x, y, w, h });
    }
  }, [hasImage, activeTool, selDraft, cropDraft, toImageCoords]);

  const handlePointerUp = useCallback((e) => {
    if (!isDrawing.current) return;
    isDrawing.current = false;
    setPanOffset(panDraft.current);

    if (activeTool === "Select" && selDraft && selDraft.w > 5 && selDraft.h > 5) {
      setSelection(selDraft); setSelDraft(null);
    }
    if (activeTool === "Crop" && cropDraft && cropDraft.w > 5 && cropDraft.h > 5) {
      setCrop(cropDraft); setCropDraft(null);
    }
  }, [activeTool, selDraft, cropDraft]);

  // ✅ Enhanced canvas click: check for existing text first
  const handleCanvasClick = useCallback((e) => {
    if (!hasImage || activeTool !== "Text") return;
    const imgPos = toImageCoords(e);
    
    // Check if clicking on existing text
    const existingTextId = findTextAtPosition(imgPos);
    if (existingTextId) {
      setSelectedTextId(existingTextId);
      setTextInput(null);
      return;
    }

    // Create new text
    setTextInput({ ...imgPos, id: generateTextId() });
    setTextInputValue("");
    setSelectedTextId(null);
  }, [hasImage, activeTool, toImageCoords, findTextAtPosition]);

  const commitTextInput = useCallback(() => {
    if (!textInput || !textInputValue.trim() || !canvasRef.current) {
      setTextInput(null); setTextInputValue(""); return;
    }
    const canvas = canvasRef.current;
    const size = Math.max(20, canvas.height * 0.04);
    setTextOverlays(prev => [...prev, { 
      id: textInput.id,
      text: textInputValue.trim(), 
      x: textInput.x, 
      y: textInput.y, 
      size, 
      color: textColor 
    }]);
    setTextInput(null); setTextInputValue(""); setSelectedTextId(null);
  }, [textInput, textInputValue, textColor]);

  // ✅ Update selected text
  const updateSelectedText = (updates) => {
    setTextOverlays(prev => prev.map(t => t.id === selectedTextId ? { ...t, ...updates } : t));
  };

  // ✅ Delete selected text
  const deleteSelectedText = () => {
    setTextOverlays(prev => prev.filter(t => t.id !== selectedTextId));
    setSelectedTextId(null);
  };

  const applyCrop = () => {
    if (!crop || !canvasRef.current || !imgEl) return;
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext("2d");
    const imageData = ctx.getImageData(crop.x, crop.y, crop.w, crop.h);
    canvas.width = crop.w; canvas.height = crop.h;
    ctx.putImageData(imageData, 0, 0);
    const newSrc = canvas.toDataURL();
    const newImg = new Image();
    newImg.onload = () => setImgEl(newImg);
    newImg.src = newSrc;
    setCrop(null);
  };

  const handleExpandClick = () => {
    setZoom(prev => prev >= 2 ? 0.5 : parseFloat((prev + 0.25).toFixed(2)));
  };

  const handleAI = async () => {
    if (!hasImage) return;
    setAiStatus("loading");
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({
          model:"claude-sonnet-4-6", max_tokens:1000,
          messages:[{ role:"user", content:"Suggest best photo editing adjustments for a professional cinematic result. Reply JSON only, no markdown. Keys: exposure contrast saturation highlights shadows temperature sharpness vignette. All -100 to 100 except sharpness and vignette which are 0-100." }]
        })
      });
      const data  = await response.json();
      const raw   = data.content?.find(b => b.type==="text")?.text || "{}";
      const clean = raw.replace(/```json|```/g,"").trim();
      setFilters(prev => ({ ...prev, ...JSON.parse(clean) }));
      setAiStatus("done");
      setTimeout(() => setAiStatus(null), 2000);
    } catch { setAiStatus(null); }
  };

  const handleToolClick = (name) => {
    setActiveTool(name);
    setTextInput(null);
    setSelectedTextId(null);
    if (name === "Expand")   handleExpandClick();
    if (name === "AI")       { handleAI(); return; }
    if (name === "Subtitle" && hasImage) {
      const text = window.prompt("Enter subtitle text:");
      if (text?.trim()) setSubtitle(text.trim());
    }
  };

  const loadImageFromSrc = (src) => {
    const image = new Image();
    image.onload = () => {
      originalImgEl.current = image;
      setImgEl(image);
      setHasImage(true);
    };
    image.onerror = () => alert("Failed to load image.");
    image.src = src;
  };

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setFilters({ exposure:0, contrast:0, saturation:0, highlights:0, shadows:0, temperature:0, sharpness:0, vignette:0 });
    setSelectedPreset(0); setView("after");
    setBrushStrokes([]); setTextOverlays([]); setSubtitle(null);
    setCrop(null); setSelection(null); setZoom(1); setPanOffset({ x:0, y:0 });
    setTextInput(null); setSelectedTextId(null);
    loadImageFromSrc(url);
  };

  const applyPreset = (idx) => { setSelectedPreset(idx); setFilters({ ...stylePresets[idx].filters }); };

  const resetFilters = () => {
    setFilters({ exposure:0, contrast:0, saturation:0, highlights:0, shadows:0, temperature:0, sharpness:0, vignette:0 });
    setSelectedPreset(0); setBrushStrokes([]); setTextOverlays([]); setSubtitle(null);
    setCrop(null); setSelection(null); setZoom(1); setPanOffset({ x:0, y:0 }); 
    setTextInput(null); setSelectedTextId(null);
  };

  const handleExport = () => {
    if (!canvasRef.current || !hasImage) return;
    setExporting(true);
    setTimeout(() => {
      const mime    = exportFormat==="png" ? "image/png" : exportFormat==="webp" ? "image/webp" : "image/jpeg";
      const quality = exportFormat==="png" ? 1 : exportQuality/100;
      const a = document.createElement("a");
      a.href = canvasRef.current.toDataURL(mime, quality);
      a.download = `edited.${exportFormat}`; a.click();
      setExporting(false);
    }, 200);
  };

  const cursorMap = { Select:"crosshair", Crop:"crosshair", Move:"grab", Brush:"cell", Expand:"zoom-in", Text:"crosshair", Subtitle:"text", AI:"default" };
  const draftRect = activeTool==="Select" ? selDraft : activeTool==="Crop" ? cropDraft : null;
  const activeFilters = Object.entries(filters).filter(([,v]) => v !== 0);
  const selectedText = textOverlays.find(t => t.id === selectedTextId);

  return (
    <div className="min-h-screen p-3 sm:p-4 lg:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-white text-2xl sm:text-3xl font-extrabold mb-1">Photo Editor</h1>
          <p className="text-sm" style={{ color:"#9191A8" }}>Upload a photo and edit in real-time.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={resetFilters}
            className="px-3 py-2 rounded-xl text-sm font-semibold transition-all hover:opacity-80"
            style={{ background:"#1a1a2e", color:"#9191A8", border:"1px solid #2a2a3e" }}>
            Reset
          </button>
          <button onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
            style={{ background:"linear-gradient(90deg,#8D45FE,#FD4FDA)" }}>
            Upload Photo
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_310px] gap-4">
        <div className="flex flex-col gap-4">

          {/* Canvas area */}
          <div className="rounded-2xl overflow-hidden relative" style={{ background:"#060B28", border:"1px solid #222", minHeight:300 }}>

            {hasImage && (
              <div className="absolute top-4 left-4 z-10 flex rounded-xl overflow-hidden"
                style={{ background:"rgba(0,0,0,0.55)", backdropFilter:"blur(8px)" }}>
                {["before","after"].map(v => (
                  <button key={v} onClick={() => setView(v)}
                    className="px-4 py-1.5 text-sm font-semibold transition-all capitalize"
                    style={{
                      background: view===v ? (v==="after" ? "linear-gradient(90deg,#8D45FE,#FD4FDA)" : "#fff") : "transparent",
                      color: view===v && v==="before" ? "#000" : "#fff",
                      border:"none", cursor:"pointer"
                    }}>{v}</button>
                ))}
              </div>
            )}

            {aiStatus && (
              <div className="absolute top-4 right-4 z-10 px-3 py-1.5 rounded-xl text-xs font-bold text-white"
                style={{ background:"rgba(141,69,254,0.85)", backdropFilter:"blur(8px)" }}>
                {aiStatus==="loading" ? "✦ AI enhancing…" : "✦ AI applied!"}
              </div>
            )}
            {hasImage && zoom !== 1 && (
              <div className="absolute top-4 right-4 z-10 px-2 py-1 rounded-lg text-xs font-bold"
                style={{ background:"rgba(0,0,0,0.6)", color:"#FD4FDA" }}>
                {Math.round(zoom*100)}%
              </div>
            )}

            {!hasImage && (
              <div className="flex flex-col items-center justify-center gap-4"
                style={{ minHeight:380, cursor:"pointer" }}
                onClick={() => fileInputRef.current?.click()}>
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center"
                  style={{ background:"rgba(141,69,254,0.12)", border:"2px dashed #8D45FE" }}>
                  <svg width="36" height="36" fill="none" stroke="#8D45FE" strokeWidth="1.6" viewBox="0 0 24 24">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                    <polyline points="17 8 12 3 7 8"/>
                    <line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                </div>
                <div className="text-center">
                  <p className="text-white font-bold text-base mb-1">Drop your photo here</p>
                  <p className="text-sm" style={{ color:"#9191A8" }}>or click to browse — JPG, PNG, WebP</p>
                </div>
              </div>
            )}

            {/* Canvas + overlays */}
            {hasImage && (
              <div style={{ position:"relative", overflow:"hidden" }}>
                {/* Pan wrapper */}
                <div style={{
                  transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoom})`,
                  transformOrigin:"center",
                  transition: activeTool==="Move" ? "none" : "transform 0.15s",
                  cursor: cursorMap[activeTool] || "default",
                  userSelect:"none",
                  position:"relative",
                }}
                  onMouseDown={handlePointerDown}
                  onMouseMove={handlePointerMove}
                  onMouseUp={handlePointerUp}
                  onMouseLeave={() => { isDrawing.current = false; }}
                  onClick={handleCanvasClick}
                  onTouchStart={handlePointerDown}
                  onTouchMove={handlePointerMove}
                  onTouchEnd={handlePointerUp}
                >
                  <canvas
                    ref={canvasRef}
                    className="w-full object-contain block"
                    style={{ maxHeight:460, display:"block", pointerEvents:"none" }}
                  />

                  {/* Draft rect overlay */}
                  {draftRect && draftRect.w > 2 && draftRect.h > 2 && canvasRef.current && (
                    <svg
                      viewBox={`0 0 ${canvasRef.current.width} ${canvasRef.current.height}`}
                      preserveAspectRatio="none"
                      style={{ position:"absolute", inset:0, width:"100%", height:"100%", pointerEvents:"none" }}>
                      <rect x={draftRect.x} y={draftRect.y} width={draftRect.w} height={draftRect.h}
                        fill="rgba(141,69,254,0.12)"
                        stroke={activeTool==="Crop" ? "#FD4FDA" : "#8D45FE"}
                        strokeWidth="2" strokeDasharray="6,3" />
                    </svg>
                  )}

                  {/* Selection handles */}
                  {selection && activeTool==="Select" && canvasRef.current && (
                    <svg
                      viewBox={`0 0 ${canvasRef.current.width} ${canvasRef.current.height}`}
                      preserveAspectRatio="none"
                      style={{ position:"absolute", inset:0, width:"100%", height:"100%", pointerEvents:"none" }}>
                      <rect x={selection.x} y={selection.y} width={selection.w} height={selection.h}
                        fill="rgba(141,69,254,0.08)" stroke="#8D45FE" strokeWidth="2" strokeDasharray="4,2" />
                      {[[0,0],[1,0],[0,1],[1,1]].map(([fx,fy]) => (
                        <rect key={`${fx}${fy}`}
                          x={selection.x + fx*selection.w - 5} y={selection.y + fy*selection.h - 5}
                          width={10} height={10} fill="#8D45FE" rx={2} />
                      ))}
                    </svg>
                  )}

                  {/* Inline text input for new text */}
                  {textInput && canvasRef.current && (
                    <div style={{
                      position:"absolute",
                      left:`${(textInput.x / canvasRef.current.width) * 100}%`,
                      top:`${(textInput.y / canvasRef.current.height) * 100}%`,
                      transform:"translate(-2px, -1em)",
                      zIndex:20,
                      display:"flex",
                      alignItems:"center",
                      gap:4,
                    }}>
                      <input
                        ref={textInputRef}
                        value={textInputValue}
                        onChange={e => setTextInputValue(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === "Enter") commitTextInput();
                          if (e.key === "Escape") { setTextInput(null); setTextInputValue(""); }
                        }}
                        placeholder="Type here…"
                        style={{
                          background:"rgba(0,0,0,0.65)",
                          border:"2px solid #8D45FE",
                          borderRadius:6,
                          color: textColor,
                          fontSize:16,
                          fontWeight:700,
                          padding:"3px 8px",
                          outline:"none",
                          minWidth:120,
                          backdropFilter:"blur(4px)",
                          boxShadow:"0 2px 12px rgba(141,69,254,0.4)",
                        }}
                      />
                      <button onClick={commitTextInput}
                        style={{ background:"#8D45FE", border:"none", borderRadius:6, color:"#fff", fontWeight:700, fontSize:13, padding:"4px 10px", cursor:"pointer" }}>
                        ✓
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); setTextInput(null); setTextInputValue(""); }}
                        style={{ background:"#333", border:"none", borderRadius:6, color:"#aaa", fontSize:13, padding:"4px 8px", cursor:"pointer" }}>
                        ✕
                      </button>
                    </div>
                  )}
                </div>

                {/* Crop controls */}
                {crop && (
                  <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                    <button onClick={applyCrop}
                      className="px-4 py-2 rounded-xl text-sm font-bold text-white"
                      style={{ background:"linear-gradient(90deg,#8D45FE,#FD4FDA)" }}>
                      Apply Crop
                    </button>
                    <button onClick={() => setCrop(null)}
                      className="px-4 py-2 rounded-xl text-sm font-bold"
                      style={{ background:"#1a1a2e", color:"#9191A8" }}>
                      Cancel
                    </button>
                  </div>
                )}

                {/* ✅ Selected text edit controls */}
                {selectedText && (
                  <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-2 z-20 px-4 py-3 rounded-xl"
                    style={{ background:"rgba(10,10,30,0.9)", backdropFilter:"blur(12px)" }}>
                    <input type="color" value={selectedText.color} 
                      onChange={(e) => updateSelectedText({ color: e.target.value })}
                      title="Text color"
                      style={{ width:32, height:32, borderRadius:"50%", border:"2px solid #fff", cursor:"pointer", padding:0 }} />
                    <input type="text" value={selectedText.text}
                      onChange={(e) => updateSelectedText({ text: e.target.value })}
                      style={{
                        background:"rgba(0,0,0,0.5)",
                        border:"1px solid #8D45FE",
                        borderRadius:6,
                        color:"#fff",
                        fontSize:13,
                        fontWeight:700,
                        padding:"6px 10px",
                        outline:"none",
                        minWidth:150,
                      }} />
                    <button onClick={deleteSelectedText}
                      className="px-4 py-2 rounded-xl text-sm font-bold text-white"
                      style={{ background:"#d32f2f" }}>
                      Delete
                    </button>
                    <button onClick={() => setSelectedTextId(null)}
                      className="px-4 py-2 rounded-xl text-sm font-bold"
                      style={{ background:"#1a1a2e", color:"#9191A8" }}>
                      Done
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Toolbar */}
            {hasImage && (
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 px-3 py-2 rounded-2xl"
                style={{ background:"rgba(10,10,30,0.85)", backdropFilter:"blur(12px)", flexWrap:"nowrap", whiteSpace:"nowrap", zIndex:30 }}>
                {TOOLS.map(name => (
                  <button key={name} title={name} onClick={() => handleToolClick(name)}
                    className="w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center transition-all"
                    style={{
                      background: activeTool===name ? "rgba(141,69,254,0.2)" : "none",
                      border:"none", cursor:"pointer",
                      boxShadow: activeTool===name ? "0 0 0 1px #8D45FE" : "none",
                    }}>
                    <ToolIcon name={name} active={activeTool===name} />
                  </button>
                ))}

                {activeTool==="Brush" && (
                  <>
                    <div style={{ width:1, height:24, background:"#2a2a3e", margin:"0 4px" }} />
                    <input type="color" value={brushColor} onChange={e => setBrushColor(e.target.value)}
                      title="Brush color"
                      style={{ width:28, height:28, borderRadius:"50%", border:"2px solid #fff", cursor:"pointer", padding:0 }} />
                    <input type="range" min={4} max={40} value={brushSize} onChange={e => setBrushSize(Number(e.target.value))}
                      style={{ width:60, accentColor:"#8D45FE" }} />
                    <button onClick={() => setBrushStrokes([])}
                      style={{ fontSize:10, color:"#9191A8", background:"none", border:"none", cursor:"pointer" }}>
                      Clear
                    </button>
                  </>
                )}

                {activeTool==="Text" && (
                  <>
                    <div style={{ width:1, height:24, background:"#2a2a3e", margin:"0 4px" }} />
                    <input type="color" value={textColor} onChange={e => setTextColor(e.target.value)}
                      title="Text color"
                      style={{ width:28, height:28, borderRadius:"50%", border:"2px solid #fff", cursor:"pointer", padding:0 }} />
                    {textOverlays.length > 0 && (
                      <button onClick={() => { setTextOverlays([]); setSelectedTextId(null); }}
                        style={{ fontSize:10, color:"#9191A8", background:"none", border:"none", cursor:"pointer" }}>
                        Clear All
                      </button>
                    )}
                  </>
                )}

                {activeTool==="Move" && (
                  <>
                    <div style={{ width:1, height:24, background:"#2a2a3e", margin:"0 4px" }} />
                    <button onClick={() => setPanOffset({ x:0, y:0 })}
                      style={{ fontSize:10, color:"#9191A8", background:"none", border:"none", cursor:"pointer" }}>
                      Reset pan
                    </button>
                  </>
                )}

                {activeTool==="Subtitle" && subtitle && (
                  <>
                    <div style={{ width:1, height:24, background:"#2a2a3e", margin:"0 4px" }} />
                    <button onClick={() => setSubtitle(null)}
                      style={{ fontSize:10, color:"#9191A8", background:"none", border:"none", cursor:"pointer" }}>
                      Remove
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Hint bar */}
          {hasImage && (
            <div className="rounded-xl px-4 py-2 text-xs flex items-center gap-2"
              style={{ background:"#060B28", border:"1px solid #222", color:"#9191A8" }}>
              <span style={{ color:"#8D45FE", fontWeight:700 }}>{activeTool}</span>
              <span>—</span>
              <span>
                {activeTool==="Select"   && "Drag to draw a selection."}
                {activeTool==="Crop"     && "Drag to define crop area, then Apply Crop."}
                {activeTool==="Move"     && "Drag to pan. Use Expand to zoom."}
                {activeTool==="Brush"    && "Paint on the image. Pick color & size in the toolbar."}
                {activeTool==="Expand"   && `Zoom: ${Math.round(zoom*100)}% — click again to cycle.`}
                {activeTool==="Text"     && selectedText ? "Click text to edit, or click canvas for new text." : "Click to create text. Click existing text to edit."}
                {activeTool==="Subtitle" && "Adds a subtitle bar at the bottom."}
                {activeTool==="AI"       && (aiStatus==="loading" ? "Applying AI enhancements…" : "Click AI to auto-enhance.")}
              </span>
            </div>
          )}

          {/* ✅ Text Overlays List */}
          {textOverlays.length > 0 && activeTool === "Text" && (
            <div className="rounded-2xl p-4" style={{ background:"#060B28", border:"1px solid #222" }}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-white">Text Objects ({textOverlays.length})</span>
              </div>
              <div className="flex flex-col gap-2">
                {textOverlays.map((t) => (
                  <div key={t.id} 
                    onClick={() => setSelectedTextId(t.id)}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer transition-all"
                    style={{ 
                      background: selectedTextId === t.id ? "rgba(141,69,254,0.2)" : "#1a1a2e",
                      border: selectedTextId === t.id ? "1px solid #8D45FE" : "1px solid #2a2a3e"
                    }}>
                    <div style={{ width:16, height:16, borderRadius:4, background:t.color, flexShrink:0 }} />
                    <span className="text-xs text-white flex-1 truncate">{t.text}</span>
                    <span className="text-xs" style={{ color:"#9191A8" }}>{t.size}px</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Style Presets */}
          <div className="rounded-2xl p-5" style={{ background:"#060B28", border:"1px solid #222" }}>
            <h2 className="text-white text-base font-bold mb-3">Style Presets</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {stylePresets.map(({ label, thumb }, i) => (
                <div key={label} onClick={() => applyPreset(i)} className="rounded-xl overflow-hidden cursor-pointer relative"
                  style={{ border:`2px solid ${selectedPreset===i ? "#8D45FE" : "transparent"}`, transition:"border 0.15s" }}>
                  <img src={thumb} alt={label} style={{ width:"100%", height:70, objectFit:"cover", display:"block" }} />
                  {selectedPreset===i && <div className="absolute inset-0" style={{ background:"rgba(141,69,254,0.15)" }} />}
                  <p className="text-center text-xs py-1.5 font-semibold"
                    style={{ color:selectedPreset===i ? "#8D45FE" : "#9191A8", background:"#060B28" }}>
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Active adjustments */}
          <div className="rounded-2xl p-4" style={{ background:"#060B28", border:"1px solid #222" }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-white">Active Adjustments</span>
              {activeFilters.length > 0 && (
                <button onClick={resetFilters} className="text-xs" style={{ color:"#9191A8", background:"none", border:"none", cursor:"pointer" }}>Clear all</button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {activeFilters.length === 0
                ? <span className="text-xs" style={{ color:"#9191A8" }}>No adjustments applied yet.</span>
                : activeFilters.map(([k,v]) => (
                    <span key={k} className="text-xs px-2 py-1 rounded-lg font-semibold"
                      style={{ background:"rgba(141,69,254,0.15)", color:"#8D45FE" }}>
                      {k}: {v>0?`+${v}`:v}
                    </span>
                  ))
              }
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div className="flex flex-col gap-4">
          <div className="rounded-2xl overflow-hidden" style={{ background:"#060B28", border:"1px solid #222" }}>
            <div className="flex border-b" style={{ borderColor:"#1a1a2e" }}>
              {["adjust","enhance","layers"].map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className="flex-1 py-3 text-xs font-bold capitalize transition-all"
                  style={{ background:"none", border:"none", cursor:"pointer",
                    borderBottom: activeTab===tab ? "2px solid #8D45FE" : "2px solid transparent",
                    color: activeTab===tab ? "#8D45FE" : "#9191A8" }}>
                  {tab}
                </button>
              ))}
            </div>
            <div className="p-5">
              {activeTab === "adjust" && (
                <div className="flex flex-col gap-4">
                  {[
                    { key:"exposure",    label:"Exposure",    min:-100, max:100 },
                    { key:"contrast",    label:"Contrast",    min:-100, max:100 },
                    { key:"saturation",  label:"Saturation",  min:-100, max:100 },
                    { key:"highlights",  label:"Highlights",  min:-100, max:100 },
                    { key:"shadows",     label:"Shadows",     min:-100, max:100 },
                    { key:"temperature", label:"Temperature", min:-100, max:100 },
                    { key:"sharpness",   label:"Sharpness",   min:0,    max:100 },
                    { key:"vignette",    label:"Vignette",    min:0,    max:100 },
                  ].map(({ key, label, min, max }) => (
                    <SliderControl key={key} label={label} value={filters[key]} min={min} max={max}
                      onChange={v => updateFilter(key, v)} />
                  ))}
                </div>
              )}
              {activeTab === "enhance" && (
                <div className="flex flex-col">
                  {[
                    { label:"Vignette Effect",    enabled:vignetteEnabled, set:setVignetteEnabled },
                    { label:"AI Retouching",      enabled:aiRetouching,    set:setAiRetouching },
                    { label:"Skin Smoothing",     enabled:skinSmoothing,   set:setSkinSmoothing },
                    { label:"Background Cleanup", enabled:bgCleanup,       set:setBgCleanup },
                  ].map(({ label, enabled, set }, i, arr) => (
                    <div key={label} className="flex items-center justify-between py-3"
                      style={{ borderBottom: i<arr.length-1 ? "1px solid #1a1a2e" : "none" }}>
                      <span className="text-sm text-white font-medium">{label}</span>
                      <Toggle enabled={enabled} onChange={() => set(p => !p)} />
                    </div>
                  ))}
                  <div className="mt-4">
                    <span className="text-sm text-white font-medium block mb-2">Color Grading</span>
                    <div className="grid grid-cols-2 gap-2">
                      {["None","Warm Cinematic","Cool Film","Vintage"].map(grade => (
                        <button key={grade} className="py-2 px-3 rounded-xl text-xs font-semibold text-left"
                          style={{ background:"#1a1a2e", color:"#9191A8", border:"none", cursor:"pointer" }}>
                          {grade}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              {activeTab === "layers" && (
                <div className="flex flex-col gap-2">
                  {layers.map(({ id, label, active, color }) => (
                    <div key={id} onClick={() => toggleLayer(id)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all"
                      style={{ background:"#1a1a2e", border:active?`1px solid ${color}`:"1px solid transparent", opacity:active?1:0.55 }}>
                      <svg width="15" height="15" fill="none" stroke={active?color:"#9191A8"} strokeWidth="1.8" viewBox="0 0 24 24">
                        {active
                          ? <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3" fill={color} stroke={color}/></>
                          : <><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></>
                        }
                      </svg>
                      <div className="w-4 h-4 rounded flex-shrink-0" style={{ background:active?color:"#444" }} />
                      <span className="text-white text-xs font-semibold flex-1">{label}</span>
                      {active
                        ? <span className="text-xs px-1.5 py-0.5 rounded" style={{ background:`${color}30`, color }}>ON</span>
                        : <span className="text-xs px-1.5 py-0.5 rounded" style={{ background:"#2a2a3e", color:"#9191A8" }}>OFF</span>
                      }
                    </div>
                  ))}
                  <p className="text-xs mt-2" style={{ color:"#9191A8" }}>Click a layer to toggle it on/off.</p>
                </div>
              )}
            </div>
          </div>

          {/* Export */}
          <div className="rounded-2xl p-5" style={{ background:"#060B28", border:"1px solid #222" }}>
            <h2 className="text-white text-base font-bold mb-4">Export</h2>
            <div className="flex gap-2 mb-3">
              {["jpeg","png","webp"].map(fmt => (
                <button key={fmt} onClick={() => setExportFormat(fmt)}
                  className="flex-1 py-2 rounded-xl text-xs font-bold uppercase transition-all"
                  style={{ background:exportFormat===fmt?"linear-gradient(90deg,#8D45FE,#FD4FDA)":"#1a1a2e", color:"#fff", border:"none", cursor:"pointer" }}>
                  {fmt}
                </button>
              ))}
            </div>
            {exportFormat==="jpeg" && (
              <div className="mb-4">
                <SliderControl label="Quality" value={exportQuality} min={10} max={100} onChange={setExportQuality} />
              </div>
            )}
            <div className="rounded-xl overflow-hidden mb-4 flex items-center justify-center" style={{ height:110, background:"#1a1a2e" }}>
              {hasImage
                ? <canvas
                    ref={el => {
                      if (el && canvasRef.current && canvasRef.current.width > 0) {
                        el.width  = canvasRef.current.width;
                        el.height = canvasRef.current.height;
                        el.getContext("2d").drawImage(canvasRef.current, 0, 0);
                      }
                    }}
                    style={{ width:"100%", height:"100%", objectFit:"cover" }}
                  />
                : <span className="text-xs" style={{ color:"#9191A8" }}>No image loaded</span>
              }
            </div>
            <button onClick={handleExport} disabled={exporting || !hasImage}
              className="w-full py-3 sm:py-4 rounded-xl text-white font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
              style={{ background:"linear-gradient(90deg,#8D45FE,#FD4FDA)" }}>
              {exporting ? "Exporting…" : `Export as ${exportFormat.toUpperCase()}`}
            </button>
            {!hasImage && <p className="text-xs text-center mt-2" style={{ color:"#9191A8" }}>Upload a photo first</p>}
          </div>
        </div>
      </div>
    </div>
  );
}