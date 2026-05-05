"use client";

import React, { useState } from "react";
import { 
    Sprout, Calendar, MapPin, Droplets, Sun, 
    Wheat, Plus, Activity, AlertCircle, ArrowRight, CheckCircle2 
} from "lucide-react";

// ==========================================
// TYPES & MOCK DATA
// ==========================================
interface TimelineEvent {
    stage: string;
    daysFromPlanting: number;
    estimatedDate: string;
    actionRequired: string;
    icon: any;
    status: "completed" | "current" | "upcoming";
}

interface RegisteredCrop {
    id: string;
    name: string;
    location: string;
    plantDate: string;
    progress: number;
    currentStage: string;
    health: "Optimal" | "Warning" | "Critical";
    timeline: TimelineEvent[];
}

export default function CropLifecycleSubsystem({ currentLocation = "Vellore, TN" }: { currentLocation?: string }) {
    // ==========================================
    // STATE
    // ==========================================
    const [isRegistering, setIsRegistering] = useState(false);
    const [newCropName, setNewCropName] = useState("");
    
    // Default list of already registered crops
    const [activeCrops, setActiveCrops] = useState<RegisteredCrop[]>([
        {
            id: "CROP-8821",
            name: "Samba Rice (Paddy)",
            location: "Vellore, TN",
            plantDate: "2026-03-15",
            progress: 35,
            currentStage: "Vegetative / Tillering",
            health: "Optimal",
            timeline: [
                { stage: "Seedling", daysFromPlanting: 0, estimatedDate: "Mar 15", actionRequired: "Nursery bed preparation and initial flooding.", icon: Sprout, status: "completed" },
                { stage: "Transplanting", daysFromPlanting: 21, estimatedDate: "Apr 05", actionRequired: "Maintain 2-3cm water level. Apply basal fertilizer.", icon: Droplets, status: "completed" },
                { stage: "Vegetative / Tillering", daysFromPlanting: 45, estimatedDate: "Apr 29", actionRequired: "Scout for stem borer. Apply top-dressing nitrogen.", icon: Activity, status: "current" },
                { stage: "Panicle Initiation", daysFromPlanting: 75, estimatedDate: "May 29", actionRequired: "Maintain strict water levels. High vulnerability stage.", icon: Sun, status: "upcoming" },
                { stage: "Harvest", daysFromPlanting: 120, estimatedDate: "Jul 13", actionRequired: "Drain field 10 days prior. Monitor grain moisture.", icon: Wheat, status: "upcoming" }
            ]
        }
    ]);

    // ==========================================
    // HANDLERS
    // ==========================================
    const handleRegisterCrop = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCropName) return;

        // Generate a dynamic timeline based on today's date
        const today = new Date();
        const formatDate = (daysToAdd: number) => {
            const d = new Date(today);
            d.setDate(today.getDate() + daysToAdd);
            return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        };

        const newCrop: RegisteredCrop = {
            id: `CROP-${Math.floor(Math.random() * 9000) + 1000}`,
            name: newCropName,
            location: currentLocation,
            plantDate: today.toISOString().split('T')[0],
            progress: 5,
            currentStage: "Seedling",
            health: "Optimal",
            timeline: [
                { stage: "Seedling", daysFromPlanting: 0, estimatedDate: formatDate(0), actionRequired: "Soil preparation and seed treatment.", icon: Sprout, status: "current" },
                { stage: "Vegetative", daysFromPlanting: 30, estimatedDate: formatDate(30), actionRequired: "First weed management cycle and irrigation.", icon: Droplets, status: "upcoming" },
                { stage: "Flowering", daysFromPlanting: 60, estimatedDate: formatDate(60), actionRequired: "Monitor for pest activity. Ensure optimal nutrition.", icon: Sun, status: "upcoming" },
                { stage: "Harvest", daysFromPlanting: 100, estimatedDate: formatDate(100), actionRequired: "Yield collection and post-harvest processing.", icon: Wheat, status: "upcoming" }
            ]
        };

        setActiveCrops([newCrop, ...activeCrops]);
        setNewCropName("");
        setIsRegistering(false);
    };

    // ==========================================
    // RENDER HELPERS
    // ==========================================
    const getHealthColor = (health: string) => {
        if (health === "Optimal") return "text-emerald-500 bg-emerald-500/10 border-emerald-500/30";
        if (health === "Warning") return "text-yellow-500 bg-yellow-500/10 border-yellow-500/30";
        return "text-red-500 bg-red-500/10 border-red-500/30";
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            
            {/* HEADER & REGISTRATION CTA */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-[#111111] p-6 rounded-xl border border-gray-800 shadow-xl">
                <div>
                    <h2 className="text-2xl font-black text-white tracking-wide">LIFECYCLE SUBSYSTEM</h2>
                    <p className="text-sm text-gray-400 mt-1 flex items-center">
                        <MapPin className="w-4 h-4 mr-1 text-emerald-500" />
                        Tracking biometrics for: <span className="font-bold text-gray-200 ml-1">{currentLocation}</span>
                    </p>
                </div>
                
                {!isRegistering && (
                    <button 
                        onClick={() => setIsRegistering(true)}
                        className="mt-4 md:mt-0 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold tracking-widest rounded-lg flex items-center shadow-[0_0_15px_rgba(16,185,129,0.2)] transition-all"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        INITIALIZE NEW CYCLE
                    </button>
                )}
            </div>

            {/* REGISTRATION FORM (EXPANDABLE) */}
            {isRegistering && (
                <div className="bg-[#0a0a0a] border border-emerald-500/30 p-6 rounded-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                        <Activity className="w-48 h-48" />
                    </div>
                    <h3 className="text-sm font-bold text-emerald-500 uppercase tracking-widest mb-4">Register Botanical Asset</h3>
                    <form onSubmit={handleRegisterCrop} className="flex flex-col md:flex-row gap-4 relative z-10">
                        <div className="flex-1">
                            <label className="text-xs text-gray-500 uppercase font-bold mb-2 block">Target Species / Crop Name</label>
                            <input 
                                type="text" 
                                value={newCropName}
                                onChange={(e) => setNewCropName(e.target.value)}
                                placeholder="e.g., Tomato (Roma), Wheat (HD2967)"
                                className="w-full bg-[#111111] border border-gray-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-emerald-500"
                                required
                            />
                        </div>
                        <div className="flex-1">
                            <label className="text-xs text-gray-500 uppercase font-bold mb-2 block">Planting Date</label>
                            <div className="bg-[#111111] border border-gray-700 rounded-lg py-3 px-4 text-gray-400 cursor-not-allowed">
                                Today (Auto-detected)
                            </div>
                        </div>
                        <div className="flex items-end gap-2">
                            <button type="submit" className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition-all">
                                DEPLOY
                            </button>
                            <button type="button" onClick={() => setIsRegistering(false)} className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-lg transition-all">
                                CANCEL
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* ACTIVE CROP CYCLES LIST */}
            <div className="space-y-6">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest border-b border-gray-800 pb-2">Active Telemetry Cycles ({activeCrops.length})</h3>
                
                {activeCrops.map((crop) => (
                    <div key={crop.id} className="bg-[#111111] border border-gray-800 rounded-xl p-0 overflow-hidden shadow-xl">
                        {/* Top Card Info */}
                        <div className="p-6 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                            <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-2">
                                    <h4 className="text-xl font-bold text-white">{crop.name}</h4>
                                    <span className={`px-3 py-1 text-[10px] uppercase font-black rounded-full border ${getHealthColor(crop.health)}`}>
                                        {crop.health}
                                    </span>
                                    <span className="text-xs font-mono text-gray-500 bg-black px-2 py-1 rounded">{crop.id}</span>
                                </div>
                                <div className="flex items-center text-sm text-gray-400 space-x-4">
                                    <span className="flex items-center"><Calendar className="w-4 h-4 mr-1 text-gray-500"/> Planted: {crop.plantDate}</span>
                                    <span className="flex items-center"><MapPin className="w-4 h-4 mr-1 text-gray-500"/> {crop.location}</span>
                                </div>
                            </div>

                            {/* Progress Bar Area */}
                            <div className="w-full lg:w-1/3 space-y-2">
                                <div className="flex justify-between text-xs font-bold">
                                    <span className="text-emerald-500">{crop.currentStage}</span>
                                    <span className="text-white">{crop.progress}%</span>
                                </div>
                                <div className="h-2 w-full bg-gray-900 rounded-full overflow-hidden border border-gray-800">
                                    <div 
                                        className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)] transition-all duration-1000 relative"
                                        style={{ width: `${crop.progress}%` }}
                                    >
                                        <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite]"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Timeline Visualization */}
                        <div className="bg-[#0a0a0a] p-6 border-t border-gray-800">
                            <div className="relative">
                                {/* Connecting Line */}
                                <div className="absolute top-6 left-6 right-6 h-0.5 bg-gray-800 hidden md:block z-0"></div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
                                    {crop.timeline.slice(0, 4).map((event, idx) => {
                                        const Icon = event.icon;
                                        const isCompleted = event.status === "completed";
                                        const isCurrent = event.status === "current";
                                        
                                        return (
                                            <div key={idx} className="relative flex flex-col items-start md:items-center">
                                                {/* Node */}
                                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 border-2 transition-all
                                                    ${isCompleted ? 'bg-emerald-900/40 border-emerald-500 text-emerald-400' : 
                                                      isCurrent ? 'bg-emerald-500 border-emerald-400 text-black shadow-[0_0_20px_rgba(16,185,129,0.4)]' : 
                                                      'bg-gray-900 border-gray-800 text-gray-600'}
                                                `}>
                                                    <Icon className="w-6 h-6" />
                                                </div>
                                                
                                                {/* Data */}
                                                <div className="text-left md:text-center space-y-1">
                                                    <h5 className={`text-sm font-bold ${isCurrent ? 'text-emerald-500' : 'text-gray-300'}`}>{event.stage}</h5>
                                                    <p className="text-xs font-mono text-gray-500">Day {event.daysFromPlanting} • {event.estimatedDate}</p>
                                                    
                                                    {/* Current Action Tooltip */}
                                                    {isCurrent && (
                                                        <div className="mt-3 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-left hidden md:block">
                                                            <p className="text-[10px] uppercase font-bold text-emerald-500 mb-1 flex items-center"><CheckCircle2 className="w-3 h-3 mr-1"/> Action Required</p>
                                                            <p className="text-xs text-gray-300 leading-tight">{event.actionRequired}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            
            {/* CSS Animation for the progress bar sheen */}
            <style dangerouslySetInnerHTML={{__html: `
                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
            `}} />
        </div>
    );
}