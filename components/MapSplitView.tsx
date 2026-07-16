"use client";

import React, { useState } from"react";
import { Map, List, Navigation, MapPin, Search, Star, Users, AlertCircle } from"lucide-react";
import { motion, AnimatePresence } from"motion/react";

interface LocationNode {
 id: string;
 name: string;
 type:"agency" |"patient" |"staff";
 lat: number; // offset X percent (e.g. 20 to 80)
 lng: number; // offset Y percent
 city: string;
 rating?: number;
 description?: string;
}

interface MapSplitViewProps {
 locations: LocationNode[];
 onSelectNode?: (node: LocationNode) => void;
}

export function MapSplitView({ locations, onSelectNode }: MapSplitViewProps) {
 const [activeView, setActiveView] = useState<"map" |"list" |"split">("split");
 const [searchQuery, setSearchQuery] = useState("");
 const [distance, setDistance] = useState(25);
 const [selectedNode, setSelectedNode] = useState<LocationNode | null>(null);
 
 // Resizable split state: proportion of left panel (e.g., 30%, 50%, 70%)
 const [splitWidth, setSplitWidth] = useState<30 | 50 | 70>(50);

 const filteredLocations = locations.filter(
 (loc) => {
 const matchSearch = loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
 loc.city.toLowerCase().includes(searchQuery.toLowerCase());
 // Distance simulation filter (based on location coordinates distance offset)
 const coordinateDistance = Math.sqrt(Math.pow(loc.lat - 50, 2) + Math.pow(loc.lng - 50, 2)) * 1.5;
 return matchSearch && coordinateDistance <= distance;
 }
 );

 const handleMarkerClick = (node: LocationNode) => {
 setSelectedNode(node);
 if (onSelectNode) onSelectNode(node);
 };

 const getWidthClass = (side:"left" |"right") => {
 if (activeView !=="split") return"w-full";
 if (side ==="left") {
 return splitWidth === 30 ?"w-full md:w-[30%]" : splitWidth === 70 ?"w-full md:w-[70%]" :"w-full md:w-1/2";
 } else {
 return splitWidth === 30 ?"w-full md:w-[70%]" : splitWidth === 70 ?"w-full md:w-[30%]" :"w-full md:w-1/2";
 }
 };

 // Find routes: draw connection lines from staff to patients
 const staffNodes = filteredLocations.filter(l => l.type ==="staff");
 const patientNodes = filteredLocations.filter(l => l.type ==="patient");

 return (
 <div className="bg-white border border-border rounded-3xl overflow-hidden shadow-sm flex flex-col min-h-[500px]">
 
 {/* Top Filter and view mode triggers */}
 <div className="p-6 border-b border-border flex flex-col md:flex-row gap-6 items-center justify-between">
 <div className="flex flex-1 flex-wrap items-center gap-6 w-full">
 {/* Quick Search */}
 <div className="relative flex-1 min-w-[180px] max-w-sm">
 <Search className="absolute left-3 top-2.5 w-4 h-4 text-text-tertiary" />
 <input
 type="text"
 placeholder="Search by city, patient, staff or agency..."
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 className="w-full pl-9 pr-4 py-2 bg-bg-alt border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 text-primary"
 />
 </div>

 {/* Distance Filter */}
 <div className="flex items-center gap-6 bg-bg-alt px-3 py-2.5 rounded-xl border border-slate-150 text-sm text-text-secondary">
 <span>Radius:</span>
 <input
 type="range"
 min="5"
 max="100"
 value={distance}
 onChange={(e) => setDistance(Number(e.target.value))}
 className="w-24 accent-teal-600"
 />
 <span className="font-bold">{distance} km</span>
 </div>

 {/* Tablet resizable controls */}
 {activeView ==="split" && (
 <div className="hidden md:flex items-center gap-1 bg-bg-alt border border-slate-150 p-0.5 rounded-xl text-sm font-black uppercase">
 <span className="px-3 text-text-tertiary">Resizer:</span>
 <button onClick={() => setSplitWidth(30)} className={`px-3 py-2 rounded ${splitWidth === 30 ?"bg-primary text-white" :"text-text-tertiary"}`}>30%</button>
 <button onClick={() => setSplitWidth(50)} className={`px-3 py-2 rounded ${splitWidth === 50 ?"bg-primary text-white" :"text-text-tertiary"}`}>50%</button>
 <button onClick={() => setSplitWidth(70)} className={`px-3 py-2 rounded ${splitWidth === 70 ?"bg-primary text-white" :"text-text-tertiary"}`}>70%</button>
 </div>
 )}
 </div>

 {/* View togglers - Mobile toggle layout */}
 <div className="flex items-center gap-1.5 p-1 bg-bg-alt rounded-xl border border-border">
 <button
 onClick={() => setActiveView("list")}
 className={`p-1.5 rounded-lg transition-all cursor-pointer ${
 activeView ==="list" ?"bg-white shadow text-accent" :"text-text-tertiary"
 }`}
 >
 <List className="w-4 h-4" />
 </button>
 <button
 onClick={() => setActiveView("map")}
 className={`p-1.5 rounded-lg transition-all cursor-pointer ${
 activeView ==="map" ?"bg-white shadow text-accent" :"text-text-tertiary"
 }`}
 >
 <Map className="w-4 h-4" />
 </button>
 <button
 onClick={() => setActiveView("split")}
 className={`hidden md:block p-1.5 rounded-lg transition-all cursor-pointer ${
 activeView ==="split" ?"bg-white shadow text-accent" :"text-text-tertiary"
 }`}
 >
 <span className="text-base font-extrabold px-1 uppercase">Split</span>
 </button>
 </div>
 </div>

 {/* Split Screens Layout */}
 <div className="flex-1 flex flex-col md:flex-row relative">
 {/* LEFT COMPONENT: List details */}
 {(activeView ==="list" || activeView ==="split") && (
 <div className={`flex-1 border-r border-border overflow-y-auto max-h-[500px] p-6 space-y-3 transition-all duration-300 ${getWidthClass("left")}`}>
 <span className="block text-base font-bold text-text-tertiary uppercase tracking-widest px-1">
 Discovered Providers ({filteredLocations.length})
 </span>

 {filteredLocations.length === 0 ? (
 <div className="text-center py-12">
 <AlertCircle className="w-8 h-8 text-white mx-auto mb-2" />
 <p className="text-sm text-text-tertiary">No matching providers found in this radius.</p>
 </div>
 ) : (
 filteredLocations.map((loc) => (
 <div
 key={loc.id}
 onClick={() => handleMarkerClick(loc)}
 className={`p-6 border rounded-2xl cursor-pointer transition-all ${
 selectedNode?.id === loc.id
 ?"bg-accent-light/20 border-accent shadow-xs"
 :"bg-white border-slate-150 hover:bg-bg-alt/50"
 }`}
 >
 <div className="flex justify-between items-start gap-6">
 <div>
 <span className={`inline-block px-1.5 py-2.5 rounded text-[8px] font-extrabold uppercase mb-1.5 ${
 loc.type ==="agency"
 ?"bg-bg text-secondary"
 : loc.type ==="staff"
 ?"bg-purple-100 text-secondary"
 :"bg-bg text-accent-light"
 }`}>
 {loc.type}
 </span>
 <h4 className="text-sm font-bold text-primary leading-none">
 {loc.name}
 </h4>
 <p className="text-base text-text-tertiary mt-1 font-semibold">{loc.city}</p>
 </div>

 {loc.rating && (
 <div className="flex items-center gap-1">
 <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
 <span className="text-base font-bold text-text-secondary">{loc.rating}</span>
 </div>
 )}
 </div>

 {loc.description && (
 <p className="text-base text-text-tertiary mt-2 line-clamp-2">
 {loc.description}
 </p>
 )}
 </div>
 ))
 )}
 </div>
 )}

 {/* RIGHT COMPONENT: Interactive SVG Map Canvas */}
 {(activeView ==="map" || activeView ==="split") && (
 <div className={`bg-bg-alt flex-1 relative min-h-[350px] md:min-h-0 transition-all duration-300 ${getWidthClass("right")}`}>
 {/* Grid helper lines */}
 <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [radial-gradient(#1e293b_1.5px,transparent_1.5px)] [background-size:16px_16px] pointer-events-none opacity-60" />

 {/* Travel route preview dynamic lines between staff and patient */}
 <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-60">
 {staffNodes.map((st, idx) => {
 const pat = patientNodes[idx % Math.max(1, patientNodes.length)];
 if (!pat) return null;
 return (
 <path
 key={`route-${idx}`}
 d={`M ${st.lat}%,${st.lng}% L ${pat.lat}%,${pat.lng}%`}
 fill="none"
 stroke="rgba(20, 184, 166, 0.7)"
 strokeWidth="2.5"
 strokeDasharray="6,4"
 className="animate-pulse"
 />
 );
 })}
 </svg>

 {/* Markers Roster */}
 {filteredLocations.map((loc) => {
 const isSelected = selectedNode?.id === loc.id;
 const size = isSelected ?"z-20 scale-125 animate-bounce" :"z-10 hover:scale-110";

 return (
 <div
 key={loc.id}
 style={{ left:`${loc.lat}%`, top:`${loc.lng}%`}}
 className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all ${size}`}
 onClick={() => handleMarkerClick(loc)}
 >
 <div className={`p-2 rounded-full border shadow-md flex items-center justify-center ${
 isSelected
 ?"bg-accent text-white border-white scale-110 ring-4 ring-teal-500/20"
 : loc.type ==="agency"
 ?"bg-primary text-white border-blue-400"
 : loc.type ==="staff"
 ?"bg-purple-600 text-white border-purple-400"
 :"bg-accent-light text-white border-amber-400"
 }`}>
 <MapPin className="w-4 h-4" />
 </div>
 </div>
 );
 })}

 {/* Float Popover detail card for selected Node */}
 <AnimatePresence>
 {selectedNode && (
 <motion.div
 initial={{ opacity: 0, y: 10, scale: 0.95 }}
 animate={{ opacity: 1, y: 0, scale: 1 }}
 exit={{ opacity: 0, y: 10, scale: 0.95 }}
 className="absolute bottom-4 left-4 right-4 bg-white border border-border rounded-2xl p-6 shadow-xl z-20"
 >
 <div className="flex justify-between items-start">
 <div>
 <span className="text-sm font-bold text-text-tertiary uppercase tracking-widest block">
 Selected location node ({selectedNode.type})
 </span>
 <h4 className="text-sm font-bold text-primary mt-0.5">
 {selectedNode.name}
 </h4>
 <p className="text-base text-text-tertiary font-medium mt-1">
 GPS Coordinates offset: {selectedNode.lat.toFixed(1)}°N, {selectedNode.lng.toFixed(1)}°E ({selectedNode.city})
 </p>
 </div>
 <button
 onClick={() => setSelectedNode(null)}
 className="text-sm text-text-tertiary hover:text-text-secondary"
 >
 ✕
 </button>
 </div>
 </motion.div>
 )}
 </AnimatePresence>
 </div>
 )}
 </div>
 </div>
 );
}
