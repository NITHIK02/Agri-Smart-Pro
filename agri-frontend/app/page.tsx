"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { 
    Activity, Leaf, ShoppingCart, FileText, Settings, LogOut, 
    Bell, Search, MapPin, Cpu, ShieldCheck, ChevronRight, 
    ExternalLink, Download, Star, Zap, Droplets, Sprout,
    LayoutGrid, List as ListIcon, X, CheckCircle2, AlertTriangle,
    Wifi, HardDrive, Server, SlidersHorizontal, User, Key,
    Filter, Database, ArrowUpRight, Clock, ShieldAlert, ToggleRight, ToggleLeft,
    Mic, MicOff, StopCircle, RefreshCw, UploadCloud, Lock, TrendingUp, ArrowRight
} from "lucide-react";

// ==========================================
// COMPONENT IMPORTS
// ==========================================
import CropLifecycleSubsystem from "./components/CropLifecycle";

// ==========================================
// MOCK DATA: MASSIVE DATABASES
// ==========================================
const MARKETPLACE_INVENTORY = [
    { id: "MKT-01", name: "AgriDrone X-4 Spectral", category: "Hardware", price: "₹1,08,500", rating: 4.9, stock: 12, tags: ["Aerial", "Mapping"], image: "🚁", desc: "Autonomous crop surveying drone with multispectral imaging payload. Connects directly to the Neural Core for live mapping." },
    { id: "MKT-02", name: "Bio-Shield Synthetic Fungicide", category: "Chemical", price: "₹7,200/L", rating: 4.7, stock: 145, tags: ["Fungal", "Preventative"], image: "🧪", desc: "Industrial-grade synthetic fungicide optimized for high-humidity environments. 99.9% efficacy against early blight." },
    { id: "MKT-03", name: "Cold-Pressed Neem Extract", category: "Organic", price: "₹3,800/L", rating: 4.8, stock: 320, tags: ["Organic", "Pest Control"], image: "🌿", desc: "100% organic pest deterrent. Acts as a mild fungal preventative and disrupts the lifecycle of over 200 pest species." },
    { id: "MKT-04", name: "SoilTech Sensor Node v2", category: "IoT", price: "₹12,500/unit", rating: 4.5, stock: 89, tags: ["Telemetry", "NPK"], image: "📡", desc: "Real-time NPK, moisture, and temperature soil telemetry. Solar powered with a 5-mile LoRaWAN range." },
    { id: "MKT-05", name: "Mycorrhizal Root Inoculant", category: "Organic", price: "₹4,900/kg", rating: 4.9, stock: 54, tags: ["Soil Health", "Roots"], image: "🍄", desc: "Beneficial fungi blend designed to exponentially increase root surface area and nutrient uptake efficiency." },
    { id: "MKT-06", name: "Automated Drip Valve (Solar)", category: "Hardware", price: "₹17,500", rating: 4.6, stock: 34, tags: ["Water", "Automation"], image: "🚰", desc: "Automate your drip lines remotely via the AgriSmart core. Integrates with weather APIs to prevent overwatering." },
    { id: "MKT-07", name: "Copper Sulfate Dusting", category: "Chemical", price: "₹2,900/25kg", rating: 4.3, stock: 500, tags: ["Blight", "Mildew"], image: "🛢️", desc: "Traditional broad-spectrum control for blight and powdery mildews. Fast acting formulation." },
    { id: "MKT-08", name: "Predatory Mite Release Pack", category: "Organic", price: "₹2,100/1000", rating: 4.8, stock: 0, tags: ["Biocontrol", "Pests"], image: "🐞", desc: "Live release predatory mites for natural spider mite control. (CURRENTLY OUT OF STOCK - BREEDING CYCLE ACTIVE)" },
    { id: "MKT-09", name: "Edge TPU Vision Accelerator", category: "Hardware", price: "₹7,500", rating: 5.0, stock: 21, tags: ["AI", "Compute"], image: "⚡", desc: "USB accelerator to run AgriSmart CNN models locally without internet connection. Reduces latency by 80%." },
    { id: "MKT-10", name: "Hydroponic Nutrient A+B", category: "Chemical", price: "₹9,900/set", rating: 4.7, stock: 76, tags: ["Hydro", "Nutrients"], image: "⚗️", desc: "Perfectly balanced synthetic nutrient profile for deep water culture and NFT hydroponic setups." },
];

const LIVE_MANDI_PRICES = [
    { crop: "Samba Paddy", price: "₹2,450", unit: "Quintal", trend: "up", location: "Vellore Mandi" },
    { crop: "Tomato (Roma)", price: "₹32", unit: "kg", trend: "down", location: "Coimbatore APMC" },
    { crop: "Cotton (MCU-5)", price: "₹7,100", unit: "Quintal", trend: "up", location: "Madurai Exchange" },
    { crop: "Urea Fertilizer", price: "₹266", unit: "45kg Bag", trend: "stable", location: "Govt Subsidized" },
];

const PAST_REPORTS = [
    { id: "REP-9921", date: "2026-04-18", time: "14:22", location: "Sector 4, Vellore", plant: "Tomato (Roma)", diagnosis: "Early Blight", confidence: 94.2, severity: "Medium", status: "Treated", operator: "8992-TX" },
    { id: "REP-9920", date: "2026-04-15", time: "09:15", location: "Sector 2, Coimbatore", plant: "Wheat (HD2967)", diagnosis: "Healthy", confidence: 99.8, severity: "None", status: "Archived", operator: "8992-TX" },
    { id: "REP-9919", date: "2026-04-10", time: "16:45", location: "Sector 7, Vellore", plant: "Samba Paddy", diagnosis: "Nitrogen Deficiency", confidence: 88.5, severity: "High", status: "Monitoring", operator: "8992-TX" },
    { id: "REP-9918", date: "2026-04-02", time: "11:30", location: "Greenhouse A", plant: "Bell Pepper", diagnosis: "Powdery Mildew", confidence: 91.0, severity: "Low", status: "Treated", operator: "8992-TX" },
    { id: "REP-9917", date: "2026-03-28", time: "08:00", location: "Sector 1, Coimbatore", plant: "Cotton", diagnosis: "Healthy", confidence: 97.4, severity: "None", status: "Archived", operator: "8992-TX" },
    { id: "REP-9916", date: "2026-03-25", time: "13:10", location: "Sector 4, Vellore", plant: "Tomato (Roma)", diagnosis: "Spider Mites", confidence: 89.9, severity: "Medium", status: "Archived", operator: "8992-TX" },
    { id: "REP-9915", date: "2026-03-20", time: "10:05", location: "Sector 3, Vellore", plant: "Potato", diagnosis: "Late Blight", confidence: 96.1, severity: "Critical", status: "Escalated", operator: "8992-TX" },
];

const SYSTEM_NOTIFICATIONS = [
    { id: 1, type: "alert", message: "High humidity detected in Sector 4. Blight risk elevated by 34%.", time: "10 mins ago" },
    { id: 2, type: "success", message: "Neural Core successfully trained on 500 new local pathology samples.", time: "2 hours ago" },
    { id: 3, type: "info", message: "Firmware update available for SoilTech Node #442.", time: "5 hours ago" },
];

// ==========================================
// MAIN DASHBOARD COMPONENT
// ==========================================
export default function MasterDashboard() {
    // ------------------------------------------
    // IN-APP AUTHENTICATION STATE
    // ------------------------------------------
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loginCode, setLoginCode] = useState("");
    const [loginError, setLoginError] = useState(false);

    // ------------------------------------------
    // GLOBAL STATE
    // ------------------------------------------
    const [activeTab, setActiveTab] = useState("diagnostics"); 
    const [currentTime, setCurrentTime] = useState("");
    const [showNotifications, setShowNotifications] = useState(false);
    
    // Telemetry State
    const [serverLoad, setServerLoad] = useState(42);
    const [apiLatency, setApiLatency] = useState(124);
    const [activeNodes, setActiveNodes] = useState(8);

    // Marketplace State
    const [marketFilter, setMarketFilter] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    
    // Reports State
    const [reportSort, setReportSort] = useState("date");

    // Settings State
    const [autoUpdateEnabled, setAutoUpdateEnabled] = useState(true);
    const [dronePatrolEnabled, setDronePatrolEnabled] = useState(false);
    const [encryptionEnabled, setEncryptionEnabled] = useState(true);

    // Image Upload State
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Scanner & Voice State
    const [language, setLanguage] = useState("en-US");
    const [voiceEnabled, setVoiceEnabled] = useState(true);
    const [scanState, setScanState] = useState({ status: 'idle', progress: 0, result: null as any, error: null as any });
    const scanAbortController = useRef<AbortController | null>(null);

    // ------------------------------------------
    // AUTHENTICATION LOGIC
    // ------------------------------------------
    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // Fallback code or the actual backend secret
        if (loginCode === "8992-TX" || loginCode === "sk-agri-live-772819001bca9928") {
            setIsAuthenticated(true);
            setLoginError(false);
        } else {
            setLoginError(true);
            setLoginCode("");
        }
    };

    // ------------------------------------------
    // VOICE LOGIC
    // ------------------------------------------
    const stopVoice = () => {
        if (window.speechSynthesis) window.speechSynthesis.cancel();
    };

    const speakDiagnosis = (text: string, langCode: string) => {
        if (!window.speechSynthesis || !voiceEnabled) return;
        stopVoice(); 
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = langCode; 
        utterance.rate = 0.95; 
        window.speechSynthesis.speak(utterance);
    };

    useEffect(() => {
        return () => stopVoice();
    }, []);

    // ------------------------------------------
    // ADVANCED SCAN EXECUTION ENGINE (LIVE API)
    // ------------------------------------------
    const handleButtonClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedImage(file);
            executeDeepScan(file); 
        }
    };

    // Passed the file directly so state doesn't lag
    const executeDeepScan = async (fileToScan: File) => {
        if (scanAbortController.current) {
            scanAbortController.current.abort();
        }
        scanAbortController.current = new AbortController();
        const signal = scanAbortController.current.signal;

        if (!fileToScan) {
            setScanState({ status: 'error', progress: 0, result: null, error: "No visual payload detected. Please select an image." });
            return;
        }

        setScanState({ status: 'scanning', progress: 5, result: null, error: null });
        stopVoice(); 

        try {
            // 1. Prepare Payload
            const formData = new FormData();
            formData.append("file", fileToScan);
            formData.append("location", "Sector 4, Vellore"); 
            formData.append("language", language);

            // 2. Cosmetic Ticker
            const progressInterval = setInterval(() => {
                setScanState(prev => {
                    if (prev.progress < 85) return { ...prev, progress: prev.progress + 5 };
                    return prev;
                });
            }, 600);

            // 3. API UPLINK
            const response = await fetch("http://localhost:8000/api/v1/analyze", {
                method: "POST",
                body: formData,
                signal: signal
            });

            clearInterval(progressInterval);

            if (signal.aborted) throw new Error("AbortError");

            if (!response.ok) {
                throw new Error(`API Gateway Error: ${response.status}`);
            }

            // 4. Parse Real Neural Data
            const aiData = await response.json();
            const report = aiData.report;

            let primaryRec = report.remediation_steps[0] || "Consult agronomist.";
            if (report.chemical_recommendation && report.chemical_recommendation !== "N/A") {
                 primaryRec += ` Recommended chemical: ${report.chemical_recommendation}`;
            }

            const liveResult = {
                crop_name: report.crop_name, // NEW: Dynamically mapped
                diagnosis: report.diagnosis,
                severity_index: report.severity_index,
                confidence: report.confidence_score,
                recommendation: primaryRec
            };

            setScanState({ status: 'complete', progress: 100, result: liveResult, error: null });

            if (voiceEnabled) {
                const speechText = `Analysis complete. Target identified as ${liveResult.crop_name}. Pathology match is ${liveResult.diagnosis}. Severity index is ${liveResult.severity_index}. Confidence level ${liveResult.confidence} percent. Recommendation: ${report.remediation_steps[0]}`;
                speakDiagnosis(speechText, language);
            }

        } catch (error: any) {
            if (error.message === "AbortError" || error.name === "AbortError") {
                setScanState({ status: 'aborted', progress: 0, result: null, error: "Scan terminated securely by operator." });
            } else {
                console.error(error);
                setScanState({ status: 'error', progress: 0, result: null, error: "Neural Core connection failed. Ensure backend is running on port 8000." });
            }
        }
    };

    const cancelScan = () => {
        if (scanAbortController.current) {
            scanAbortController.current.abort();
        }
        stopVoice();
        setSelectedImage(null);
    };

    // ------------------------------------------
    // EFFECTS & DATA PROCESSING
    // ------------------------------------------
    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date();
            setCurrentTime(now.toLocaleTimeString('en-US', { hour12: false }) + " IST");
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (!isAuthenticated || activeTab !== "diagnostics") return;
        const telemetryInterval = setInterval(() => {
            setServerLoad(prev => Math.min(100, Math.max(10, prev + (Math.random() * 10 - 5))));
            setApiLatency(prev => Math.max(20, prev + (Math.random() * 20 - 10)));
            if (Math.random() > 0.9) setActiveNodes(prev => (prev === 8 ? 7 : 8));
        }, 3000);
        return () => clearInterval(telemetryInterval);
    }, [isAuthenticated, activeTab]);

    const filteredMarket = useMemo(() => {
        return MARKETPLACE_INVENTORY.filter(item => 
            (marketFilter === "All" || item.category === marketFilter) &&
            (item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())))
        );
    }, [marketFilter, searchQuery]);

    const sortedReports = useMemo(() => {
        let reports = [...PAST_REPORTS];
        if (reportSort === "severity") {
            const severityRank: Record<string, number> = { "Critical": 4, "High": 3, "Medium": 2, "Low": 1, "None": 0 };
            reports.sort((a, b) => severityRank[b.severity] - severityRank[a.severity]);
        } else {
            reports.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        }
        return reports;
    }, [reportSort]);

    // ------------------------------------------
    // RENDER HELPERS
    // ------------------------------------------
    const getSeverityStyles = (severity: string) => {
        switch(severity) {
            case "Critical": return "bg-red-600/20 text-red-500 border-red-500/50 animate-pulse";
            case "High": return "bg-orange-500/10 text-orange-500 border-orange-500/30";
            case "Medium": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/30";
            case "Low": return "bg-blue-500/10 text-blue-500 border-blue-500/30";
            default: return "bg-emerald-500/10 text-emerald-500 border-emerald-500/30";
        }
    };

    const getStatusIcon = (status: string) => {
        switch(status) {
            case "Treated": return <ShieldCheck className="w-4 h-4 text-emerald-500" />;
            case "Monitoring": return <Activity className="w-4 h-4 text-yellow-500" />;
            case "Escalated": return <AlertTriangle className="w-4 h-4 text-red-500 animate-pulse" />;
            default: return <FileText className="w-4 h-4 text-gray-500" />;
        }
    };

    // ==========================================
    // SECURE LOGIN OVERLAY
    // ==========================================
    if (!isAuthenticated) {
        return (
            <div className="flex h-screen items-center justify-center bg-[#050505] text-emerald-500 font-mono relative overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                
                <div className="z-10 w-full max-w-md bg-[#0a0a0a] border border-emerald-500/30 p-8 rounded-2xl shadow-[0_0_50px_rgba(16,185,129,0.1)] backdrop-blur-xl">
                    <div className="flex flex-col items-center mb-8">
                        <div className="w-16 h-16 bg-emerald-900/30 rounded-2xl flex items-center justify-center border border-emerald-500/50 mb-4 animate-pulse">
                            <Lock className="w-8 h-8 text-emerald-500" />
                        </div>
                        <h1 className="text-2xl font-black tracking-widest text-white">AGRISMART CORE</h1>
                        <p className="text-xs text-emerald-500/70 tracking-widest mt-1">RESTRICTED TERMINAL ACCESS</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest mb-2 block">Operative Access Code</label>
                            <input 
                                type="password" 
                                value={loginCode}
                                onChange={(e) => setLoginCode(e.target.value)}
                                placeholder="Enter code (e.g. 8992-TX)" 
                                className={`w-full bg-black border ${loginError ? 'border-red-500 text-red-500' : 'border-emerald-500/50 text-white'} p-4 outline-none text-center tracking-[0.5em] rounded-xl focus:border-emerald-500 transition-colors`}
                                autoFocus
                            />
                            {loginError && <p className="text-red-500 text-xs text-center mt-2 animate-bounce">AUTHORIZATION FAILED</p>}
                        </div>
                        <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black tracking-widest py-4 rounded-xl flex items-center justify-center transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                            INITIALIZE UPLINK <ArrowRight className="w-5 h-5 ml-2" />
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    // ==========================================
    // MAIN DASHBOARD CONTENT
    // ==========================================
    return (
        <div className="min-h-screen bg-[#050505] text-gray-200 flex font-sans overflow-hidden selection:bg-emerald-500/30">
            
            {/* SIDEBAR NAVIGATION */}
            <aside className="w-72 bg-[#0a0a0a] border-r border-gray-800 flex flex-col justify-between hidden lg:flex z-50 shrink-0">
                <div>
                    <div className="p-6 border-b border-gray-800 bg-gradient-to-b from-[#111111] to-transparent">
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)] border border-emerald-500/50">
                                <Leaf className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-black text-white tracking-widest leading-none">AGRISMART</h1>
                                <p className="text-[10px] text-emerald-500 font-mono tracking-widest uppercase mt-1">Enterprise Core v3.0</p>
                            </div>
                        </div>
                        
                        <div className="bg-[#111111] p-4 rounded-xl border border-gray-800 shadow-inner">
                            <div className="flex justify-between items-start mb-2">
                                <p className="text-[10px] text-gray-500 uppercase font-bold">Active Operative</p>
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            </div>
                            <p className="text-sm font-mono text-white flex items-center mb-1">
                                <ShieldCheck className="w-4 h-4 mr-2 text-blue-500" /> ID: 8992-TX
                            </p>
                            <p className="text-xs text-gray-500 flex items-center">
                                <MapPin className="w-3 h-3 mr-1" /> Sector 4, Vellore
                            </p>
                        </div>
                    </div>

                    <nav className="p-4 space-y-2">
                        <p className="px-4 text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-2 mt-4">Main Directives</p>
                        {[
                            { id: "diagnostics", icon: Cpu, label: "System Diagnostics" },
                            { id: "lifecycle", icon: Sprout, label: "Crop Lifecycle" },
                            { id: "marketplace", icon: ShoppingCart, label: "Market & Supply" },
                            { id: "reports", icon: FileText, label: "Intelligence Reports" },
                            { id: "settings", icon: Settings, label: "Core Settings" },
                        ].map((item) => {
                            const Icon = item.icon;
                            const isActive = activeTab === item.id;
                            return (
                                <button 
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id)}
                                    className={`w-full flex items-center px-4 py-3.5 text-sm font-bold rounded-xl transition-all duration-300 group
                                        ${isActive 
                                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[inset_4px_0_0_rgba(16,185,129,1)]' 
                                            : 'text-gray-400 border border-transparent hover:bg-gray-900 hover:text-white hover:border-gray-800'}`}
                                >
                                    <Icon className={`w-5 h-5 mr-3 transition-colors ${isActive ? 'text-emerald-500' : 'text-gray-500 group-hover:text-emerald-400'}`} /> 
                                    {item.label}
                                </button>
                            );
                        })}
                    </nav>
                </div>

                <div className="p-6 border-t border-gray-800 bg-[#0a0a0a]">
                    <div className="flex items-center justify-between text-xs font-mono text-gray-500 mb-4 bg-black p-3 rounded-lg border border-gray-800">
                        <span className="flex items-center"><Wifi className="w-3 h-3 mr-2 text-emerald-500"/> Uplink</span>
                        <span className="text-emerald-500">{apiLatency.toFixed(0)}ms</span>
                    </div>
                    <button onClick={() => setIsAuthenticated(false)} className="w-full flex items-center justify-center px-4 py-3 text-sm font-bold text-red-500 hover:text-white hover:bg-red-600 border border-red-500/20 hover:border-red-500 rounded-xl transition-all">
                        <LogOut className="w-5 h-5 mr-2" /> SECURE LOGOUT
                    </button>
                </div>
            </aside>

            {/* MAIN CONTENT AREA */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
                
                {/* TOP HEADER */}
                <header className="bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-gray-800 p-4 lg:p-6 sticky top-0 z-40 flex justify-between items-center shadow-lg">
                    <div className="flex items-center space-x-4">
                        <div className="lg:hidden p-2 bg-emerald-600/20 rounded-lg border border-emerald-500/30">
                            <Leaf className="w-6 h-6 text-emerald-500" />
                        </div>
                        <div>
                            <h2 className="text-xl lg:text-2xl font-black text-white tracking-widest uppercase flex items-center">
                                {activeTab.replace("-", " ")} DIRECTIVE
                            </h2>
                            <p className="text-xs text-gray-500 font-mono hidden md:block">Connected to AgriSmart Regional Cloud (Vellore-01)</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 lg:space-x-6">
                        <div className="hidden md:flex items-center space-x-2 border-r border-gray-800 pr-4 mr-2">
                            <select 
                                value={language} 
                                onChange={(e) => setLanguage(e.target.value)}
                                className="bg-black text-xs font-mono text-emerald-500 border border-emerald-500/30 rounded-lg px-2 py-2 outline-none cursor-pointer focus:border-emerald-500 transition-colors"
                            >
                                <option value="en-US">ENG-US</option>
                                <option value="hi-IN">HIN-IN</option>
                                <option value="ta-IN">TAM-IN</option>
                            </select>
                            <button 
                                onClick={() => {
                                    setVoiceEnabled(!voiceEnabled);
                                    if (voiceEnabled) stopVoice();
                                }}
                                className={`p-2 rounded-lg border transition-all ${voiceEnabled ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500' : 'bg-gray-900 border-gray-800 text-gray-500 hover:text-white'}`}
                                title={voiceEnabled ? "Voice Assistant Active" : "Voice Assistant Offline"}
                            >
                                {voiceEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                            </button>
                        </div>

                        <div className="hidden lg:flex items-center space-x-2 text-xs font-mono text-emerald-500 bg-emerald-500/10 px-4 py-2 rounded-lg border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]">
                            <Activity className="w-4 h-4 animate-pulse" />
                            <span>SAT-LINK ACTIVE</span>
                        </div>
                        <div className="text-sm font-mono text-gray-300 bg-black px-4 py-2 rounded-lg border border-gray-800">
                            {currentTime || "SYNCING CLOCK..."}
                        </div>
                        
                        <div className="relative">
                            <button 
                                onClick={() => setShowNotifications(!showNotifications)}
                                className={`p-3 rounded-lg transition-all border ${showNotifications ? 'bg-gray-800 border-gray-700 text-white' : 'bg-transparent border-transparent text-gray-400 hover:bg-gray-900 hover:text-white'}`}
                            >
                                <Bell className="w-5 h-5" />
                                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 border-2 border-[#0a0a0a] rounded-full animate-pulse"></span>
                            </button>

                            {showNotifications && (
                                <div className="absolute right-0 mt-2 w-80 bg-[#111111] border border-gray-700 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                                    <div className="p-4 border-b border-gray-800 bg-[#0a0a0a] flex justify-between items-center">
                                        <h3 className="text-sm font-bold text-white uppercase tracking-wider">System Alerts</h3>
                                        <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded font-bold">3 New</span>
                                    </div>
                                    <div className="max-h-96 overflow-y-auto custom-scrollbar">
                                        {SYSTEM_NOTIFICATIONS.map(notif => (
                                            <div key={notif.id} className="p-4 border-b border-gray-800/50 hover:bg-white/[0.02] transition-colors cursor-pointer">
                                                <div className="flex items-start space-x-3">
                                                    {notif.type === 'alert' && <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />}
                                                    {notif.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />}
                                                    {notif.type === 'info' && <Activity className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />}
                                                    <div>
                                                        <p className="text-sm text-gray-300 leading-snug">{notif.message}</p>
                                                        <p className="text-[10px] text-gray-500 mt-2 font-mono">{notif.time}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <button className="w-full p-3 text-xs font-bold text-gray-400 hover:text-white bg-[#0a0a0a] hover:bg-gray-900 transition-colors">
                                        MARK ALL AS READ
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* SCROLLABLE CONTENT AREA */}
                <div className="p-4 lg:p-8 flex-1 overflow-y-auto custom-scrollbar relative">
                    
                    {/* TAB 1: DIAGNOSTICS */}
                    {activeTab === "diagnostics" && (
                        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
                            <div className="bg-gradient-to-br from-[#111111] to-[#0a0a0a] border border-gray-800 p-8 lg:p-12 rounded-3xl shadow-2xl relative overflow-hidden group">
                                <div className="absolute -top-24 -right-24 p-8 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all duration-1000 pointer-events-none">
                                    <Cpu className="w-96 h-96 text-emerald-500" />
                                </div>
                                
                                <div className="relative z-10 max-w-3xl">
                                    <div className="flex items-center space-x-3 mb-6">
                                        <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-xs font-bold tracking-widest uppercase">
                                            Vision Engine Online
                                        </span>
                                    </div>
                                    <h2 className="text-4xl lg:text-5xl font-black text-white mb-6 tracking-wide leading-tight">
                                        NEURAL CORE <br/>COMMAND CENTER
                                    </h2>
                                    <p className="text-lg text-gray-400 leading-relaxed mb-10 max-w-2xl">
                                        The AgriSmart Vision Transformer is standing by. Run full-spectrum pathological analysis synced with live local weather telemetry and trigger intelligent voice readouts.
                                    </p>
                                    
                                    <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                                        <input 
                                            type="file" 
                                            ref={fileInputRef} 
                                            onChange={handleFileChange} 
                                            style={{ display: 'none' }} 
                                            accept="image/*" 
                                        />
                                        {scanState.status === 'idle' || scanState.status === 'aborted' || scanState.status === 'error' || scanState.status === 'complete' ? (
                                            <button onClick={handleButtonClick} className="inline-flex items-center justify-center px-10 py-5 bg-emerald-600 hover:bg-emerald-500 text-white text-lg font-black tracking-widest rounded-xl transition-all duration-300 shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:shadow-[0_0_50px_rgba(16,185,129,0.5)] transform hover:-translate-y-1">
                                                <UploadCloud className="w-6 h-6 mr-4" />
                                                INITIALIZE DEEP SCAN
                                            </button>
                                        ) : (
                                            <button onClick={cancelScan} className="inline-flex items-center justify-center px-10 py-5 bg-red-600/20 hover:bg-red-600 border border-red-500 text-white text-lg font-black tracking-widest rounded-xl transition-all duration-300 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
                                                <StopCircle className="w-6 h-6 mr-4" />
                                                ABORT OPERATION
                                            </button>
                                        )}
                                        {selectedImage && (scanState.status === 'idle' || scanState.status === 'complete') && (
                                            <div className="flex items-center text-sm text-emerald-400 font-mono px-4">
                                                <CheckCircle2 className="w-4 h-4 mr-2" />
                                                {selectedImage.name} Uploaded
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {scanState.status !== 'idle' && (
                                <div className="bg-[#111111] border border-gray-800 p-6 lg:p-8 rounded-2xl shadow-xl animate-in fade-in slide-in-from-bottom-4">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-lg font-bold text-white uppercase tracking-widest flex items-center">
                                            {scanState.status === 'scanning' && <RefreshCw className="w-5 h-5 mr-3 text-emerald-500 animate-spin" />}
                                            {scanState.status === 'complete' && <CheckCircle2 className="w-5 h-5 mr-3 text-emerald-500" />}
                                            {scanState.status === 'error' || scanState.status === 'aborted' ? <ShieldAlert className="w-5 h-5 mr-3 text-red-500" /> : null}
                                            Operation Status: {scanState.status.toUpperCase()}
                                        </h3>
                                        {scanState.status === 'scanning' && <span className="text-emerald-500 font-mono text-xl">{scanState.progress}%</span>}
                                    </div>

                                    {scanState.status === 'scanning' && (
                                        <div className="w-full bg-black border border-gray-800 h-4 rounded-full overflow-hidden mb-4">
                                            <div className="bg-emerald-500 h-full transition-all duration-300 ease-out" style={{ width: `${scanState.progress}%` }}></div>
                                        </div>
                                    )}

                                    {scanState.result && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                                            {/* NEW: Detected Crop Card */}
                                            <div className="bg-blue-500/10 p-4 rounded-xl border border-blue-500/30">
                                                <p className="text-xs text-blue-400 uppercase font-bold mb-1">Detected Crop</p>
                                                <p className="text-xl font-black text-blue-500">{scanState.result.crop_name}</p>
                                            </div>
                                            <div className="bg-black p-4 rounded-xl border border-gray-800">
                                                <p className="text-xs text-gray-500 uppercase font-bold mb-1">Detected Pathology</p>
                                                <p className="text-xl font-black text-white">{scanState.result.diagnosis}</p>
                                            </div>
                                            <div className="bg-red-500/10 p-4 rounded-xl border border-red-500/30">
                                                <p className="text-xs text-red-400 uppercase font-bold mb-1">Severity Index</p>
                                                <p className="text-xl font-black text-red-500">{scanState.result.severity_index}</p>
                                            </div>
                                            <div className="bg-emerald-500/10 p-4 rounded-xl border border-emerald-500/30">
                                                <p className="text-xs text-emerald-400 uppercase font-bold mb-1">AI Confidence</p>
                                                <p className="text-xl font-black text-emerald-500">{scanState.result.confidence}%</p>
                                            </div>
                                            <div className="md:col-span-4 bg-black p-4 rounded-xl border border-gray-800 flex items-start mt-2">
                                                <FileText className="w-5 h-5 mr-3 text-gray-500 mt-0.5" />
                                                <div>
                                                    <p className="text-xs text-gray-500 uppercase font-bold mb-1">Actionable Recommendation</p>
                                                    <p className="text-gray-300">{scanState.result.recommendation}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {scanState.error && (
                                        <div className="bg-red-500/10 text-red-400 border border-red-500/30 p-4 rounded-xl font-mono text-sm">
                                            [!] WARNING: {scanState.error}
                                        </div>
                                    )}
                                </div>
                            )}

                            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest border-b border-gray-800 pb-2 mt-12 mb-6">Live Infrastructure Telemetry</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className="bg-[#111111] border border-gray-800 p-6 rounded-2xl">
                                    <div className="flex justify-between items-start mb-4">
                                        <Server className="w-6 h-6 text-blue-500" />
                                        <span className="text-xs font-mono text-gray-500">NODE-A1</span>
                                    </div>
                                    <h3 className="text-gray-400 text-sm font-bold mb-1">Server CPU Load</h3>
                                    <div className="flex items-end space-x-2">
                                        <p className="text-3xl font-black text-white">{serverLoad.toFixed(1)}<span className="text-lg text-gray-500">%</span></p>
                                    </div>
                                    <div className="w-full bg-gray-900 h-1.5 mt-4 rounded-full overflow-hidden">
                                        <div className="bg-blue-500 h-full transition-all duration-500" style={{width: `${serverLoad}%`}}></div>
                                    </div>
                                </div>

                                <div className="bg-[#111111] border border-gray-800 p-6 rounded-2xl">
                                    <div className="flex justify-between items-start mb-4">
                                        <Activity className="w-6 h-6 text-emerald-500" />
                                        <span className="text-xs font-mono text-gray-500">API-GW</span>
                                    </div>
                                    <h3 className="text-gray-400 text-sm font-bold mb-1">Inference Latency</h3>
                                    <div className="flex items-end space-x-2">
                                        <p className="text-3xl font-black text-white">{apiLatency.toFixed(0)}<span className="text-lg text-gray-500">ms</span></p>
                                    </div>
                                    <div className="w-full bg-gray-900 h-1.5 mt-4 rounded-full overflow-hidden">
                                        <div className="bg-emerald-500 h-full transition-all duration-500" style={{width: `${(apiLatency/200)*100}%`}}></div>
                                    </div>
                                </div>

                                <div className="bg-[#111111] border border-gray-800 p-6 rounded-2xl">
                                    <div className="flex justify-between items-start mb-4">
                                        <HardDrive className="w-6 h-6 text-purple-500" />
                                        <span className="text-xs font-mono text-gray-500">EDGE-NET</span>
                                    </div>
                                    <h3 className="text-gray-400 text-sm font-bold mb-1">Active IoT Nodes</h3>
                                    <div className="flex items-end space-x-2">
                                        <p className="text-3xl font-black text-white">{activeNodes}<span className="text-lg text-gray-500">/8</span></p>
                                    </div>
                                    <div className="flex space-x-1 mt-4">
                                        {[...Array(8)].map((_, i) => (
                                            <div key={i} className={`flex-1 h-1.5 rounded-full ${i < activeNodes ? 'bg-purple-500' : 'bg-gray-800'}`}></div>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-[#111111] border border-gray-800 p-6 rounded-2xl flex flex-col justify-center items-center text-center">
                                    <ShieldCheck className="w-10 h-10 text-emerald-500 mb-3" />
                                    <h3 className="text-white font-bold">End-to-End Encryption</h3>
                                    <p className="text-xs text-gray-500 mt-2">All payloads secured via AES-256 before transmission.</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB 2: CROP LIFECYCLE */}
                    {activeTab === "lifecycle" && (
                        <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                <div className="bg-emerald-900/20 border border-emerald-500/30 p-6 rounded-xl flex items-center justify-between">
                                    <div>
                                        <p className="text-xs text-emerald-500 font-bold uppercase mb-1">Active Cycles</p>
                                        <p className="text-3xl font-black text-white">4</p>
                                    </div>
                                    <Sprout className="w-10 h-10 text-emerald-500/50" />
                                </div>
                                <div className="bg-[#111111] border border-gray-800 p-6 rounded-xl flex items-center justify-between">
                                    <div>
                                        <p className="text-xs text-gray-500 font-bold uppercase mb-1">Avg Crop Health</p>
                                        <p className="text-3xl font-black text-white">92%</p>
                                    </div>
                                    <Activity className="w-10 h-10 text-gray-600" />
                                </div>
                                <div className="bg-[#111111] border border-gray-800 p-6 rounded-xl flex items-center justify-between">
                                    <div>
                                        <p className="text-xs text-gray-500 font-bold uppercase mb-1">Next Major Harvest</p>
                                        <p className="text-2xl font-black text-white">July 13</p>
                                    </div>
                                    <Leaf className="w-10 h-10 text-gray-600" />
                                </div>
                            </div>
                            <CropLifecycleSubsystem currentLocation="Vellore, TN" />
                        </div>
                    )}

                    {/* TAB 3: MARKETPLACE */}
                    {activeTab === "marketplace" && (
                        <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
                            
                            {/* Live Crop Exchange Ticker */}
                            <div className="bg-[#111111] border border-emerald-500/30 rounded-2xl p-6 shadow-[0_0_20px_rgba(16,185,129,0.1)] mb-8">
                                <h3 className="text-emerald-500 font-black tracking-widest uppercase mb-4 flex items-center">
                                    <TrendingUp className="w-5 h-5 mr-3" /> Live Mandi Exchange Rates (Tamil Nadu)
                                </h3>
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                    {LIVE_MANDI_PRICES.map((mandi, idx) => (
                                        <div key={idx} className="bg-black border border-gray-800 p-4 rounded-xl">
                                            <p className="text-xs text-gray-500 font-bold mb-1">{mandi.location}</p>
                                            <p className="text-white font-bold">{mandi.crop}</p>
                                            <div className="flex items-center justify-between mt-2">
                                                <span className="text-xl font-black text-emerald-400">{mandi.price}</span>
                                                <span className="text-xs text-gray-600 font-mono">/{mandi.unit}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-[#111111] border border-gray-800 p-4 rounded-2xl shadow-xl flex flex-col lg:flex-row justify-between items-center gap-4 sticky top-0 z-30">
                                <div className="flex flex-wrap items-center gap-2">
                                    {["All", "Hardware", "Chemical", "Organic", "IoT"].map(cat => (
                                        <button 
                                            key={cat}
                                            onClick={() => setMarketFilter(cat)}
                                            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${marketFilter === cat ? 'bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]' : 'bg-black text-gray-400 border border-gray-800 hover:border-gray-600 hover:text-white'}`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                                <div className="flex items-center space-x-3 w-full lg:w-auto">
                                    <div className="relative flex-1 lg:w-64">
                                        <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                                        <input 
                                            type="text" 
                                            placeholder="Search inventory..." 
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full bg-black border border-gray-800 text-white text-sm rounded-lg pl-10 pr-4 py-2 focus:border-emerald-500 focus:outline-none transition-colors"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {filteredMarket.length > 0 ? filteredMarket.map(item => (
                                    <div key={item.id} className="bg-[#111111] border border-gray-800 rounded-2xl p-6 hover:border-emerald-500/50 hover:shadow-[0_0_30px_rgba(16,185,129,0.1)] transition-all group flex flex-col justify-between">
                                        <div>
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="text-4xl bg-black w-14 h-14 flex items-center justify-center rounded-xl border border-gray-800 group-hover:scale-110 transition-transform">
                                                    {item.image}
                                                </div>
                                                <span className="text-emerald-500 font-black text-lg">{item.price}</span>
                                            </div>
                                            <h3 className="text-white font-bold text-lg mb-1">{item.name}</h3>
                                            <p className="text-xs text-gray-500 mb-4 h-12 overflow-hidden">{item.desc}</p>
                                            <div className="flex flex-wrap gap-2 mb-6">
                                                <span className="px-2 py-1 bg-gray-900 border border-gray-800 rounded text-[10px] text-gray-400 font-mono uppercase">{item.category}</span>
                                                {item.tags.map(tag => (
                                                    <span key={tag} className="px-2 py-1 bg-emerald-900/20 border border-emerald-500/20 rounded text-[10px] text-emerald-500 font-mono uppercase">{tag}</span>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                                            <div className="flex items-center text-sm font-bold text-gray-300">
                                                <Star className="w-4 h-4 text-yellow-500 mr-1" /> {item.rating}
                                            </div>
                                            <button disabled={item.stock === 0} className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${item.stock > 0 ? 'bg-emerald-600 hover:bg-emerald-500 text-white' : 'bg-gray-800 text-gray-500 cursor-not-allowed'}`}>
                                                {item.stock > 0 ? `ADD TO CART (${item.stock})` : 'OUT OF STOCK'}
                                            </button>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="col-span-full py-20 text-center flex flex-col items-center justify-center border border-dashed border-gray-800 rounded-2xl">
                                        <Database className="w-12 h-12 text-gray-600 mb-4" />
                                        <h3 className="text-lg font-bold text-gray-400">NO INVENTORY MATCHES FOUND</h3>
                                        <p className="text-sm text-gray-600 mt-2">Adjust your filters or sync with main supply chain database.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* TAB 4: REPORTS */}
                    {activeTab === "reports" && (
                        <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
                            <div className="bg-[#111111] border border-gray-800 rounded-2xl shadow-xl overflow-hidden">
                                <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-[#0a0a0a]">
                                    <h3 className="text-lg font-black text-white uppercase tracking-widest flex items-center">
                                        <FileText className="w-5 h-5 mr-3 text-emerald-500" /> Global Log Archive
                                    </h3>
                                    <select 
                                        value={reportSort} 
                                        onChange={(e) => setReportSort(e.target.value)}
                                        className="bg-black text-sm text-gray-300 border border-gray-800 rounded-lg px-4 py-2 outline-none focus:border-emerald-500"
                                    >
                                        <option value="date">Sort by Date (Newest)</option>
                                        <option value="severity">Sort by Severity</option>
                                    </select>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-black border-b border-gray-800 text-xs font-mono text-gray-500 uppercase tracking-widest">
                                                <th className="p-4">Report ID</th>
                                                <th className="p-4">Timestamp</th>
                                                <th className="p-4">Subject</th>
                                                <th className="p-4">Diagnosis</th>
                                                <th className="p-4">Severity</th>
                                                <th className="p-4">Status</th>
                                                <th className="p-4 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-sm">
                                            {sortedReports.map((report) => (
                                                <tr key={report.id} className="border-b border-gray-800/50 hover:bg-white/[0.02] transition-colors">
                                                    <td className="p-4 font-mono text-gray-400">{report.id}</td>
                                                    <td className="p-4 text-gray-300">
                                                        {report.date} <span className="text-gray-600 ml-2">{report.time}</span>
                                                    </td>
                                                    <td className="p-4 text-white font-bold">{report.plant}</td>
                                                    <td className="p-4 text-gray-300">{report.diagnosis}</td>
                                                    <td className="p-4">
                                                        <span className={`px-3 py-1 rounded border text-xs font-bold uppercase tracking-wider ${getSeverityStyles(report.severity)}`}>
                                                            {report.severity}
                                                        </span>
                                                    </td>
                                                    <td className="p-4 flex items-center">
                                                        {getStatusIcon(report.status)}
                                                        <span className="ml-2 text-gray-400">{report.status}</span>
                                                    </td>
                                                    <td className="p-4 text-right">
                                                        <button className="p-2 text-gray-500 hover:text-emerald-500 transition-colors">
                                                            <ExternalLink className="w-4 h-4" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB 5: SETTINGS */}
                    {activeTab === "settings" && (
                        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
                            <div className="bg-[#111111] border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
                                <div className="p-6 border-b border-gray-800 bg-[#0a0a0a]">
                                    <h3 className="text-lg font-black text-white uppercase tracking-widest flex items-center">
                                        <SlidersHorizontal className="w-5 h-5 mr-3 text-emerald-500" /> System Preferences
                                    </h3>
                                </div>
                                <div className="p-6 space-y-6">
                                    <div className="flex items-center justify-between pb-6 border-b border-gray-800">
                                        <div>
                                            <h4 className="text-white font-bold mb-1">Firmware Auto-Update</h4>
                                            <p className="text-xs text-gray-500">Automatically patch Edge Nodes and Drones during off-peak hours.</p>
                                        </div>
                                        <button onClick={() => setAutoUpdateEnabled(!autoUpdateEnabled)} className={`p-1 rounded-full transition-colors ${autoUpdateEnabled ? 'text-emerald-500' : 'text-gray-600'}`}>
                                            {autoUpdateEnabled ? <ToggleRight className="w-10 h-10" /> : <ToggleLeft className="w-10 h-10" />}
                                        </button>
                                    </div>
                                    <div className="flex items-center justify-between pb-6 border-b border-gray-800">
                                        <div>
                                            <h4 className="text-white font-bold mb-1">Automated Drone Patrols</h4>
                                            <p className="text-xs text-gray-500">Dispatch AgriDrones daily at 0600 hrs for preliminary field mapping.</p>
                                        </div>
                                        <button onClick={() => setDronePatrolEnabled(!dronePatrolEnabled)} className={`p-1 rounded-full transition-colors ${dronePatrolEnabled ? 'text-emerald-500' : 'text-gray-600'}`}>
                                            {dronePatrolEnabled ? <ToggleRight className="w-10 h-10" /> : <ToggleLeft className="w-10 h-10" />}
                                        </button>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h4 className="text-white font-bold mb-1 flex items-center">
                                                <Key className="w-4 h-4 mr-2 text-emerald-500" /> Military-Grade Encryption
                                            </h4>
                                            <p className="text-xs text-gray-500">Enforce AES-256 on all incoming telemetry. Disabling improves latency by 4ms.</p>
                                        </div>
                                        <button onClick={() => setEncryptionEnabled(!encryptionEnabled)} className={`p-1 rounded-full transition-colors ${encryptionEnabled ? 'text-emerald-500' : 'text-gray-600'}`}>
                                            {encryptionEnabled ? <ToggleRight className="w-10 h-10" /> : <ToggleLeft className="w-10 h-10" />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="border border-red-900/50 bg-red-950/10 rounded-2xl p-6">
                                <h3 className="text-red-500 font-bold uppercase tracking-widest mb-2 flex items-center">
                                    <ShieldAlert className="w-5 h-5 mr-2" /> Danger Zone
                                </h3>
                                <p className="text-xs text-gray-400 mb-4">Actions here can result in permanent data loss or total system recalibration.</p>
                                <button className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white text-sm font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(239,68,68,0.3)]">
                                    INITIATE FACTORY RESET
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}