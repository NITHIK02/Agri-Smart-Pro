"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
    UploadCloud, Activity, Thermometer, Droplets, AlertTriangle, 
    CheckCircle2, ShieldAlert, Leaf, Microscope, Terminal, 
    RefreshCw, MapPin, Cpu, Database, Network, FileText, Download
} from "lucide-react";

// ==========================================
// TYPESCRIPT INTERFACES
// ==========================================
interface WeatherData {
    temperature: string;
    humidity: string;
    risk_factor: string;
    forecast_warning?: string;
}

interface PathologyReport {
    diagnosis: string;
    pathogen_type: string;
    confidence_score: number;
    severity_index: string;
    remediation_steps: string[];
    chemical_recommendation: string;
    organic_alternative: string;
    weather_impact: WeatherData;
}

interface NeuralResponse {
    tracking_id: string;
    timestamp: string;
    engine: string;
    metrics: {
        processing_time_ms: number;
        payload_size_kb: number;
        security_hash: string;
    };
    report: PathologyReport;
}

// ==========================================
// INDIAN CITY DATABASE
// ==========================================
const INDIAN_CITIES = [
    "Agra, UP", "Ahmedabad, GJ", "Amritsar, PB", "Bangalore, KA",
    "Bhopal, MP", "Bhubaneswar, OR", "Chandigarh, CH", "Chennai, TN",
    "Coimbatore, TN", "Dehradun, UK", "Delhi, DL", "Faridabad, HR",
    "Gurgaon, HR", "Guwahati, AS", "Hyderabad, TG", "Indore, MP",
    "Jaipur, RJ", "Jodhpur, RJ", "Kanpur, UP", "Kochi, KL",
    "Kolkata, WB", "Lucknow, UP", "Ludhiana, PB", "Madurai, TN",
    "Mumbai, MH", "Mysore, KA", "Nagpur, MH", "Nashik, MH",
    "Noida, UP", "Patna, BR", "Pune, MH", "Raipur, CG",
    "Rajkot, GJ", "Ranchi, JH", "Salem, TN", "Surat, GJ", 
    "Thiruvananthapuram, KL", "Tiruchirappalli, TN", "Tiruppur, TN", 
    "Vadodara, GJ", "Varanasi, UP", "Vellore, TN", "Vijayawada, AP", "Visakhapatnam, AP"
];

// ==========================================
// MAIN COMMAND CENTER COMPONENT
// ==========================================
export default function ScanCommandCenter() {
    // UI State
    const [scanState, setScanState] = useState<"idle" | "scanning" | "complete" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState("");
    const [scanLogIndex, setScanLogIndex] = useState(0);
    
    // Inputs
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageMeta, setImageMeta] = useState({ size: "", type: "" });
    const [locationQuery, setLocationQuery] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [scaleMode, setScaleMode] = useState<"commercial" | "household">("commercial");

    // Output Data
    const [reportData, setReportData] = useState<NeuralResponse | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Filter cities based on user input
    const filteredLocations = INDIAN_CITIES.filter(loc => 
        loc.toLowerCase().includes(locationQuery.toLowerCase())
    );

    // Advanced Scanning Terminal Logs
    const SCAN_LOGS = [
        "> Establishing secure handshake with Neural Core...",
        "> Extracting multispectral image features...",
        "> Isolating botanical subject from background...",
        "> Querying Gemini Vision API...",
        "> Analyzing foliar lesion geometry...",
        "> Cross-referencing global pathology database...",
        "> Fetching local meteorological telemetry...",
        "> Compiling remediation strategies...",
        "> Finalizing intelligence report..."
    ];

    // Cycle through logs during scan
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (scanState === "scanning") {
            setScanLogIndex(0);
            interval = setInterval(() => {
                setScanLogIndex(prev => (prev < SCAN_LOGS.length - 1 ? prev + 1 : prev));
            }, 800);
        }
        return () => clearInterval(interval);
    }, [scanState]);

    // Close dropdown if clicked outside
    useEffect(() => {
        const handleClickOutside = () => setIsDropdownOpen(false);
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    // ==========================================
    // HANDLERS
    // ==========================================
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
            setImageMeta({
                size: (file.size / 1024 / 1024).toFixed(2) + " MB",
                type: file.type.split('/')[1].toUpperCase()
            });
            setScanState("idle");
        }
    };

    const executeDeepScan = async () => {
        if (!imageFile) {
            setErrorMessage("SYSTEM HALT: Botanical specimen required for analysis.");
            setScanState("error");
            return;
        }

        setScanState("scanning");
        setErrorMessage("");

        // Prepare the payload for the Python Backend
        const formData = new FormData();
        formData.append("file", imageFile);
        formData.append("location", locationQuery || "Unknown Location");
        formData.append("scale", scaleMode);
        formData.append("language", "en");

        try {
            // REAL FETCH CALL TO TITAN CORE
            const response = await fetch("http://localhost:8000/api/v1/analyze", {
                method: "POST",
                headers: {
                    // Enterprise API Key matching the backend configuration
                    "X-AgriSmart-Key": "sk-agri-live-772819001bca9928"
                },
                body: formData,
            });

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.detail || `Core responded with HTTP ${response.status}. Verify Python backend is online.`);
            }

            const data = await response.json();
            
            // Artificial delay to make the UI feel heavy and analytical
            setTimeout(() => {
                setReportData(data);
                setScanState("complete");
            }, 1500);

        } catch (error: any) {
            console.error("Neural Core Connection Error:", error);
            setErrorMessage(error.message || "FATAL ERROR: Unable to establish uplink with Local Python Neural Core.");
            setScanState("error");
        }
    };

    // ==========================================
    // RENDER HELPER
    // ==========================================
    const getSeverityColor = (severity: string) => {
        const s = severity.toLowerCase();
        if (s.includes("high") || s.includes("critical")) return "text-red-500 border-red-500 bg-red-500/10";
        if (s.includes("medium") || s.includes("moderate")) return "text-yellow-500 border-yellow-500 bg-yellow-500/10";
        if (s.includes("low") || s.includes("mild")) return "text-blue-500 border-blue-500 bg-blue-500/10";
        return "text-emerald-500 border-emerald-500 bg-emerald-500/10";
    };

    return (
        <div className="min-h-screen bg-[#050505] text-gray-200 p-6 font-sans selection:bg-emerald-500/30">
            <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-12 gap-8">
                
                {/* LEFT PANEL: UPLOAD & CONTROLS */}
                <div className="xl:col-span-4 space-y-6">
                    <div className="bg-[#0a0a0a] border border-gray-800 rounded-xl p-6 shadow-2xl relative overflow-hidden">
                        {/* Decorative UI elements */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl rounded-full pointer-events-none"></div>
                        
                        <div className="flex items-center space-x-3 mb-8 border-b border-gray-800 pb-4">
                            <Microscope className="text-emerald-500 w-6 h-6" />
                            <h2 className="text-xl font-bold tracking-[0.2em] text-white">SYSTEM UPLINK</h2>
                        </div>

                        {/* Drag & Drop Zone */}
                        <div 
                            className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 group overflow-hidden
                                ${imagePreview ? 'border-emerald-500/50 bg-emerald-950/20' : 'border-gray-700 hover:border-emerald-500/50 hover:bg-gray-800/30'}
                            `}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <input 
                                type="file" 
                                className="hidden" 
                                ref={fileInputRef} 
                                accept="image/*" 
                                onChange={handleImageUpload} 
                            />
                            {imagePreview ? (
                                <div className="space-y-4">
                                    <div className="relative">
                                        <img src={imagePreview} alt="Target" className="mx-auto h-48 w-full object-cover rounded-lg border border-gray-800 shadow-2xl" />
                                        {scanState === "scanning" && (
                                            <div className="absolute inset-0 bg-emerald-500/20 animate-pulse rounded-lg flex items-center justify-center border-2 border-emerald-500">
                                                <div className="w-full h-1 bg-emerald-400 absolute top-0 shadow-[0_0_10px_#10b981] animate-[scan_2s_ease-in-out_infinite]"></div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex justify-center space-x-4 text-[10px] font-mono text-gray-400 bg-black/50 py-2 rounded">
                                        <span className="flex items-center"><Database className="w-3 h-3 mr-1 text-emerald-500"/> {imageMeta.size}</span>
                                        <span className="flex items-center"><FileText className="w-3 h-3 mr-1 text-emerald-500"/> FORMAT: {imageMeta.type}</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4 py-8 relative z-10">
                                    <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-500 border border-gray-800">
                                        <UploadCloud className="w-8 h-8 text-emerald-500" />
                                    </div>
                                    <p className="text-sm text-gray-300 font-medium tracking-wide">INITIALIZE VISUAL UPLOAD</p>
                                    <p className="text-xs text-gray-500 font-mono">Supports RAW, JPG, PNG up to 4K</p>
                                </div>
                            )}
                        </div>

                        {/* Location Input with Z-Index Fix */}
                        <div className="mt-8 relative" onClick={(e) => e.stopPropagation()}>
                            <label className="text-[10px] font-bold text-emerald-500/80 uppercase tracking-widest mb-2 block flex items-center">
                                <Network className="w-3 h-3 mr-2" /> Geographic Telemetry
                            </label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3.5 w-4 h-4 text-gray-500" />
                                <input 
                                    type="text" 
                                    value={locationQuery}
                                    onChange={(e) => {
                                        setLocationQuery(e.target.value);
                                        setIsDropdownOpen(true);
                                    }}
                                    onFocus={() => setIsDropdownOpen(true)}
                                    placeholder="Enter Location (e.g. Coimbatore)"
                                    className="w-full bg-[#050505] border border-gray-800 rounded-lg py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-all shadow-inner"
                                />
                                
                                {/* Dropdown */}
                                {isDropdownOpen && filteredLocations.length > 0 && (
                                    <div className="absolute top-full left-0 w-full mt-2 bg-[#0a0a0a] border border-gray-700 rounded-lg shadow-[0_10px_40px_rgba(0,0,0,0.8)] z-[100] max-h-56 overflow-y-auto custom-scrollbar">
                                        {filteredLocations.map((loc, idx) => (
                                            <div 
                                                key={idx} 
                                                className="px-4 py-3 text-sm text-gray-300 hover:bg-emerald-500/10 hover:text-emerald-400 cursor-pointer transition-colors border-b border-gray-800/50 last:border-0"
                                                onClick={() => {
                                                    setLocationQuery(loc);
                                                    setIsDropdownOpen(false);
                                                }}
                                            >
                                                {loc}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Scale Toggle */}
                        <div className="mt-6 relative z-0">
                            <label className="text-[10px] font-bold text-emerald-500/80 uppercase tracking-widest mb-2 block flex items-center">
                                <Cpu className="w-3 h-3 mr-2" /> Deployment Scale
                            </label>
                            <div className="flex bg-[#050505] rounded-lg p-1 border border-gray-800">
                                <button 
                                    className={`flex-1 py-2.5 text-xs font-bold tracking-wider rounded-md transition-all duration-300 ${scaleMode === 'commercial' ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 shadow-[inset_0_0_10px_rgba(16,185,129,0.1)]' : 'text-gray-500 hover:text-gray-300 border border-transparent'}`}
                                    onClick={() => setScaleMode('commercial')}
                                >
                                    COMMERCIAL
                                </button>
                                <button 
                                    className={`flex-1 py-2.5 text-xs font-bold tracking-wider rounded-md transition-all duration-300 ${scaleMode === 'household' ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 shadow-[inset_0_0_10px_rgba(16,185,129,0.1)]' : 'text-gray-500 hover:text-gray-300 border border-transparent'}`}
                                    onClick={() => setScaleMode('household')}
                                >
                                    HOUSEHOLD
                                </button>
                            </div>
                        </div>

                        {/* Execute Button */}
                        <button 
                            onClick={executeDeepScan}
                            disabled={scanState === "scanning"}
                            className={`w-full mt-8 py-4 rounded-lg font-bold tracking-[0.2em] text-xs transition-all duration-300 flex items-center justify-center space-x-3 overflow-hidden relative group
                                ${scanState === "scanning" ? 'bg-gray-900 text-emerald-500 border border-emerald-500/30 cursor-wait' : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.1)] hover:shadow-[0_0_30px_rgba(16,185,129,0.3)]'}
                            `}
                        >
                            {scanState === "scanning" ? (
                                <><RefreshCw className="w-5 h-5 animate-spin" /><span>PROCESSING...</span></>
                            ) : (
                                <><Activity className="w-5 h-5 group-hover:scale-110 transition-transform" /><span>EXECUTE DEEP SCAN</span></>
                            )}
                        </button>

                        {/* Error Handling */}
                        {scanState === "error" && (
                            <div className="mt-6 p-4 bg-red-950/30 border border-red-500/50 rounded-lg flex items-start space-x-3 animate-in fade-in zoom-in duration-300">
                                <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                                <p className="text-xs text-red-400 leading-relaxed font-mono">{errorMessage}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT PANEL: DASHBOARD RESULTS */}
                <div className="xl:col-span-8 space-y-6">
                    
                    {/* IDLE STATE */}
                    {scanState === "idle" && (
                        <div className="h-full min-h-[600px] flex items-center justify-center border-2 border-gray-800/50 rounded-xl bg-[#0a0a0a]/30 border-dashed relative overflow-hidden group">
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 pointer-events-none"></div>
                            <div className="text-center text-gray-600 relative z-10 transition-transform duration-700 group-hover:scale-105">
                                <Terminal className="w-20 h-20 mx-auto mb-6 opacity-30 text-emerald-500" />
                                <h2 className="text-2xl font-black tracking-widest text-gray-700 mb-2">NEURAL CORE STANDBY</h2>
                                <p className="font-mono text-xs tracking-widest text-gray-500">AWAITING VISUAL TELEMETRY UPLOAD</p>
                            </div>
                        </div>
                    )}

                    {/* SCANNING STATE (Advanced Terminal Animation) */}
                    {scanState === "scanning" && (
                        <div className="h-full min-h-[600px] flex items-center justify-center border border-emerald-500/20 rounded-xl bg-[#0a0a0a] shadow-[inset_0_0_100px_rgba(16,185,129,0.02)]">
                            <div className="text-center w-full max-w-lg px-8">
                                <div className="relative w-32 h-32 mx-auto mb-12">
                                    <div className="absolute inset-0 border-t-2 border-l-2 border-emerald-500 rounded-full animate-[spin_1.5s_linear_infinite]"></div>
                                    <div className="absolute inset-2 border-r-2 border-b-2 border-emerald-400/50 rounded-full animate-[spin_2s_linear_infinite_reverse]"></div>
                                    <div className="absolute inset-6 border-t-2 border-emerald-600/30 rounded-full animate-[spin_3s_linear_infinite]"></div>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Leaf className="w-10 h-10 text-emerald-500 animate-pulse" />
                                    </div>
                                </div>
                                
                                <div className="bg-black/80 border border-gray-800 rounded-xl p-6 text-left shadow-2xl relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-900 via-emerald-500 to-emerald-900 opacity-20"></div>
                                    <div className="flex items-center space-x-2 mb-4 border-b border-gray-800 pb-2">
                                        <Terminal className="w-4 h-4 text-gray-500" />
                                        <span className="text-[10px] font-bold text-gray-500 tracking-widest uppercase">Live System Output</span>
                                    </div>
                                    <div className="space-y-2 font-mono text-[11px] text-emerald-400 h-32 overflow-hidden flex flex-col justify-end">
                                        {SCAN_LOGS.slice(0, scanLogIndex + 1).map((log, i) => (
                                            <p key={i} className="animate-in slide-in-from-bottom-2 fade-in duration-300 opacity-80">
                                                {log}
                                            </p>
                                        ))}
                                        <p className="animate-pulse text-emerald-500 mt-2 font-black">_</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* COMPLETE STATE (Full Intelligence Report) */}
                    {scanState === "complete" && reportData && (
                        <div className="space-y-6 animate-in zoom-in-95 duration-500">
                            
                            {/* Header Action Bar */}
                            <div className="flex justify-between items-end border-b border-gray-800 pb-4">
                                <div>
                                    <p className="text-[10px] font-mono text-emerald-500 mb-1">TRACKING ID: {reportData.tracking_id || "SYS-891-B"}</p>
                                    <h2 className="text-xl font-bold tracking-widest text-white">INTELLIGENCE REPORT</h2>
                                </div>
                                <button onClick={() => window.print()} className="flex items-center space-x-2 text-[10px] font-bold bg-gray-900 hover:bg-gray-800 text-gray-300 px-4 py-2 rounded-md border border-gray-700 transition-colors">
                                    <Download className="w-3 h-3" />
                                    <span>EXPORT PDF</span>
                                </button>
                            </div>

                            {/* TOP ROW: Diagnosis & Confidence */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="md:col-span-2 bg-[#0a0a0a] border border-gray-800 p-8 rounded-xl relative overflow-hidden group hover:border-gray-700 transition-colors">
                                    <div className="absolute top-[-20%] right-[-10%] p-4 opacity-5 group-hover:scale-110 transition-transform duration-700 pointer-events-none">
                                        <ShieldAlert className="w-64 h-64 text-emerald-500" />
                                    </div>
                                    
                                    <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-2">Primary Diagnosis</h3>
                                    <h1 className="text-4xl sm:text-5xl font-black text-white mb-4 tracking-tight leading-tight">{reportData.report.diagnosis}</h1>
                                    
                                    <div className="flex flex-wrap gap-3 mt-6">
                                        <span className="px-4 py-1.5 text-xs font-bold bg-gray-900 text-gray-300 rounded-full border border-gray-700 flex items-center shadow-inner">
                                            <Microscope className="w-3 h-3 mr-2 text-emerald-500"/> {reportData.report.pathogen_type}
                                        </span>
                                        <span className={`px-4 py-1.5 text-xs font-bold rounded-full border ${getSeverityColor(reportData.report.severity_index)}`}>
                                            SEVERITY: {reportData.report.severity_index.toUpperCase()}
                                        </span>
                                    </div>
                                </div>

                                <div className="bg-[#0a0a0a] border border-gray-800 p-6 rounded-xl flex flex-col justify-center items-center relative hover:border-gray-700 transition-colors">
                                    <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-6 w-full text-center">AI Match Confidence</h3>
                                    <div className="relative w-36 h-36 flex items-center justify-center">
                                        {/* Background Circle */}
                                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                                            <path className="text-gray-900" strokeWidth="2.5" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                            {/* Progress Circle */}
                                            <path 
                                                className={reportData.report.confidence_score > 70 ? "text-emerald-500" : reportData.report.confidence_score > 40 ? "text-yellow-500" : "text-red-500"} 
                                                strokeDasharray={`${reportData.report.confidence_score}, 100`} 
                                                strokeWidth="2.5" strokeLinecap="round" stroke="currentColor" fill="none" 
                                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                                                style={{ transition: 'stroke-dasharray 1.5s ease-out' }}
                                            />
                                        </svg>
                                        <div className="absolute flex flex-col items-center">
                                            <span className="text-4xl font-black text-white">{reportData.report.confidence_score}<span className="text-lg text-gray-500">%</span></span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* MIDDLE ROW: Weather Telemetry */}
                            <div className="bg-[#0a0a0a] border border-gray-800 rounded-xl p-8 hover:border-gray-700 transition-colors">
                                <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-6 flex items-center border-b border-gray-800 pb-4">
                                    <Thermometer className="w-4 h-4 mr-2 text-emerald-500"/> Environmental Telemetry Core
                                </h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                    <div className="bg-[#050505] p-5 rounded-lg border border-gray-800/50 shadow-inner">
                                        <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-2">Local Temp</p>
                                        <p className="text-2xl font-black text-white">{reportData.report.weather_impact.temperature}</p>
                                    </div>
                                    <div className="bg-[#050505] p-5 rounded-lg border border-gray-800/50 shadow-inner">
                                        <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-2">Humidity Index</p>
                                        <p className="text-2xl font-black text-blue-400">{reportData.report.weather_impact.humidity}</p>
                                    </div>
                                    <div className="bg-[#050505] p-5 rounded-lg border border-gray-800/50 shadow-inner md:col-span-2">
                                        <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-2">Pathogen Spread Risk</p>
                                        <p className="text-xl font-bold text-red-400">{reportData.report.weather_impact.risk_factor}</p>
                                    </div>
                                </div>
                                {reportData.report.weather_impact.forecast_warning && (
                                    <div className="mt-6 bg-blue-950/20 border border-blue-500/20 p-4 rounded-lg flex items-start">
                                        <Network className="w-4 h-4 mr-3 text-blue-400 shrink-0 mt-0.5"/>
                                        <p className="text-xs text-blue-300/80 leading-relaxed font-mono">
                                            {reportData.report.weather_impact.forecast_warning}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* BOTTOM ROW: Action Plan */}
                            <div className="bg-[#0a0a0a] border border-gray-800 rounded-xl p-8 hover:border-gray-700 transition-colors">
                                <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-8 flex items-center border-b border-gray-800 pb-4">
                                    <Droplets className="w-4 h-4 mr-2 text-emerald-500"/> Strategic Remediation Protocol
                                </h3>
                                
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                                    {/* Steps */}
                                    <div className="space-y-6">
                                        <h4 className="text-xs font-bold text-white tracking-wider flex items-center">
                                            <Activity className="w-4 h-4 mr-2 text-emerald-500" /> IMMEDIATE ACTIONS
                                        </h4>
                                        <ul className="space-y-4">
                                            {reportData.report.remediation_steps.map((step, i) => (
                                                <li key={i} className="flex items-start text-sm text-gray-300 bg-[#050505] p-4 rounded-lg border border-gray-800/50">
                                                    <CheckCircle2 className="w-5 h-5 text-emerald-500 mr-3 mt-0.5 shrink-0" />
                                                    <span className="leading-relaxed">{step}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    
                                    {/* Pathways */}
                                    <div className="space-y-6">
                                        <h4 className="text-xs font-bold text-white tracking-wider flex items-center">
                                            <Database className="w-4 h-4 mr-2 text-emerald-500" /> TREATMENT PATHWAYS
                                        </h4>
                                        
                                        <div className="bg-gradient-to-br from-[#050505] to-emerald-950/10 p-6 rounded-xl border border-emerald-500/20 shadow-[inset_0_0_20px_rgba(16,185,129,0.05)]">
                                            <p className="text-[10px] font-black text-emerald-500 mb-2 tracking-widest flex items-center">
                                                <Leaf className="w-3 h-3 mr-2"/> ORGANIC APPROACH
                                            </p>
                                            <p className="text-sm text-emerald-100/70 leading-relaxed">
                                                {reportData.report.organic_alternative}
                                            </p>
                                        </div>

                                        <div className="bg-gradient-to-br from-[#050505] to-blue-950/10 p-6 rounded-xl border border-blue-500/20 shadow-[inset_0_0_20px_rgba(59,130,246,0.05)]">
                                            <p className="text-[10px] font-black text-blue-500 mb-2 tracking-widest flex items-center">
                                                <Microscope className="w-3 h-3 mr-2"/> SYNTHETIC APPROACH
                                            </p>
                                            <p className="text-sm text-blue-100/70 leading-relaxed">
                                                {reportData.report.chemical_recommendation}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}