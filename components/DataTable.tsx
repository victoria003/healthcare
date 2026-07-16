"use client";

import React, { useState, useMemo } from"react";
import { 
 ArrowUpDown, ChevronLeft, ChevronRight, Download, 
 SlidersHorizontal, Check, Trash2, ArrowLeft, ArrowRight, Loader2, Search 
} from"lucide-react";
import { motion, AnimatePresence } from"motion/react";

interface Column<T> {
 header: string;
 accessor: keyof T | ((row: T) => React.ReactNode);
 sortable?: boolean;
 sortKey?: string;
}

interface DataTableProps<T> {
 data: T[];
 columns: Column<T>[];
 searchPlaceholder?: string;
 searchKey?: keyof T;
 filterOptions?: {
 label: string;
 key: keyof T;
 options: string[];
 }[];
 exportFileName?: string;
 isLoading?: boolean;
}

export function DataTable<T extends Record<string, any>>({
 data,
 columns: initialColumns,
 searchPlaceholder ="Search records...",
 searchKey,
 filterOptions,
 exportFileName ="homecare_report",
 isLoading = false,
}: DataTableProps<T>) {
 const [columns, setColumns] = useState<Column<T>[]>(initialColumns);
 const [searchQuery, setSearchQuery] = useState("");
 const [columnSearch, setColumnSearch] = useState<Record<string, string>>({});
 const [sortKey, setSortKey] = useState<string | null>(null);
 const [sortDirection, setSortDirection] = useState<"asc" |"desc">("asc");
 const [selectedFilters, setSelectedFilters] = useState<Record<string, string>>({});
 const [currentPage, setCurrentPage] = useState(1);
 const [pageSize] = useState(5);
 const [visibleColumns, setVisibleColumns] = useState<number[]>(initialColumns.map((_, i) => i));
 const [showColumnDropdown, setShowColumnDropdown] = useState(false);
 const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>({});

 // Export to CSV/Excel Functionality
 const exportData = (type:"csv" |"excel") => {
 try {
 const headers = columns.map((col) => col.header).join(",");
 const rows = data.map((row) =>
 columns
 .map((col) => {
 const val = typeof col.accessor ==="function" ?"" : row[col.accessor as string];
 return`"${String(val ||"").replace(/"/g, '""')}"`;
 })
 .join(",")
 );
 const content = [headers, ...rows].join("\n");
 const blob = new Blob([content], { type:"text/csv;charset=utf-8;" });
 const url = URL.createObjectURL(blob);
 const link = document.createElement("a");
 link.setAttribute("href", url);
 link.setAttribute("download",`${exportFileName}.${type ==="csv" ?"csv" :"xls"}`);
 document.body.appendChild(link);
 link.click();
 document.body.removeChild(link);
 } catch (err) {
 console.error("Export Failed", err);
 }
 };

 // Toggle Row Selection
 const toggleRow = (id: string) => {
 setSelectedRows((prev) => ({ ...prev, [id]: !prev[id] }));
 };

 const toggleSelectAll = () => {
 const allSelected = data.every((row) => selectedRows[row.id]);
 const newSelection: Record<string, boolean> = {};
 if (!allSelected) {
 data.forEach((row) => {
 newSelection[row.id] = true;
 });
 }
 setSelectedRows(newSelection);
 };

 // Reorder Columns
 const moveColumn = (index: number, direction:"left" |"right") => {
 const targetIndex = direction ==="left" ? index - 1 : index + 1;
 if (targetIndex < 0 || targetIndex >= columns.length) return;

 const updated = [...columns];
 const temp = updated[index];
 updated[index] = updated[targetIndex];
 updated[targetIndex] = temp;
 setColumns(updated);

 // Also update visible index mappings
 setVisibleColumns(prev => 
 prev.map(i => {
 if (i === index) return targetIndex;
 if (i === targetIndex) return index;
 return i;
 }).sort()
 );
 };

 // Bulk actions simulator
 const handleBulkDelete = () => {
 const selectedIds = Object.keys(selectedRows).filter(k => selectedRows[k]);
 alert(`Bulk Action: Executed Delete on ${selectedIds.length} records in Snowflake.`);
 setSelectedRows({});
 };

 // Filter and Sort Processing
 const filteredData = useMemo(() => {
 let result = [...data];

 // Global Search Match
 if (searchQuery) {
 result = result.filter((item) =>
 Object.values(item).some((val) =>
 String(val ||"").toLowerCase().includes(searchQuery.toLowerCase())
 )
 );
 }

 // Column-specific Search
 Object.keys(columnSearch).forEach((key) => {
 const q = columnSearch[key];
 if (q) {
 result = result.filter((item) =>
 String(item[key] ||"").toLowerCase().includes(q.toLowerCase())
 );
 }
 });

 // Apply Filter Options
 Object.keys(selectedFilters).forEach((key) => {
 const filterVal = selectedFilters[key];
 if (filterVal) {
 result = result.filter((item) => String(item[key] ||"").toLowerCase() === filterVal.toLowerCase());
 }
 });

 // Apply Sorting
 if (sortKey) {
 result.sort((a, b) => {
 const aVal = a[sortKey];
 const bVal = b[sortKey];
 if (aVal < bVal) return sortDirection ==="asc" ? -1 : 1;
 if (aVal > bVal) return sortDirection ==="asc" ? 1 : -1;
 return 0;
 });
 }

 return result;
 }, [data, searchQuery, columnSearch, selectedFilters, sortKey, sortDirection]);

 // Pagination calculation
 const totalItems = filteredData.length;
 const totalPages = Math.ceil(totalItems / pageSize) || 1;
 const paginatedData = useMemo(() => {
 const startIdx = (currentPage - 1) * pageSize;
 return filteredData.slice(startIdx, startIdx + pageSize);
 }, [filteredData, currentPage, pageSize]);

 const handleSort = (key: string) => {
 if (sortKey === key) {
 setSortDirection((prev) => (prev ==="asc" ?"desc" :"asc"));
 } else {
 setSortKey(key);
 setSortDirection("asc");
 }
 };

 const isAllSelected = data.length > 0 && data.every((row) => selectedRows[row.id]);
 const selectedCount = Object.keys(selectedRows).filter(k => selectedRows[k]).length;

 return (
 <div className="space-y-4">
 {/* Top Filter & Actions Panel */}
 <div className="flex flex-col md:flex-row gap-6 justify-between items-stretch md:items-center bg-white p-6 border border-border rounded-3xl shadow-xs">
 <div className="flex flex-1 flex-wrap items-center gap-6">
 {/* Global Search bar */}
 <div className="relative flex-1 min-w-[200px] max-w-sm">
 <Search className="absolute left-3.5 top-3 w-4 h-4 text-text-tertiary" />
 <input
 type="text"
 placeholder={searchPlaceholder}
 value={searchQuery}
 onChange={(e) => {
 setSearchQuery(e.target.value);
 setCurrentPage(1);
 }}
 className="w-full pl-10 pr-4 py-2 bg-bg-alt border border-border rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 text-primary"
 />
 </div>

 {/* Filter options selects */}
 {filterOptions?.map((f) => (
 <select
 key={f.key as string}
 value={selectedFilters[f.key as string] ||""}
 onChange={(e) => {
 setSelectedFilters((prev) => ({ ...prev, [f.key as string]: e.target.value }));
 setCurrentPage(1);
 }}
 className="px-3 py-2 bg-bg-alt border border-border rounded-2xl text-sm font-bold text-text-secondary focus:outline-none"
 >
 <option value="">All {f.label}</option>
 {f.options.map((opt) => (
 <option key={opt} value={opt}>{opt}</option>
 ))}
 </select>
 ))}
 </div>

 {/* Global CSV/Excel and View Customizers */}
 <div className="flex items-center gap-6 flex-wrap">
 {/* Bulk actions */}
 {selectedCount > 0 && (
 <button
 onClick={handleBulkDelete}
 className="px-3 py-2 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 rounded-2xl text-sm font-bold flex items-center gap-1.5 cursor-pointer"
 >
 <Trash2 className="w-4 h-4" />
 Delete Selected ({selectedCount})
 </button>
 )}

 {/* Column toggler */}
 <div className="relative">
 <button
 onClick={() => setShowColumnDropdown(!showColumnDropdown)}
 className="p-2 bg-bg-alt border border-border text-text-secondary rounded-2xl hover:bg-bg-alt transition-all flex items-center gap-6 text-sm font-bold cursor-pointer"
 >
 <SlidersHorizontal className="w-4 h-4" />
 Columns
 </button>
 <AnimatePresence>
 {showColumnDropdown && (
 <div className="absolute right-0 mt-2 bg-white border border-border rounded-2xl shadow-xl p-3 z-30 min-w-[200px] space-y-1.5">
 <span className="block text-base font-bold text-text-tertiary uppercase tracking-widest px-3 mb-1">
 Toggle View & Order
 </span>
 {columns.map((col, idx) => (
 <div key={idx} className="flex items-center justify-between gap-6.5 px-3 py-2 hover:bg-bg-alt :bg-primary rounded-xl">
 <label className="flex items-center gap-6 cursor-pointer text-sm font-medium text-text-secondary">
 <input
 type="checkbox"
 checked={visibleColumns.includes(idx)}
 onChange={() => {
 if (visibleColumns.includes(idx)) {
 setVisibleColumns(visibleColumns.filter((i) => i !== idx));
 } else {
 setVisibleColumns([...visibleColumns, idx].sort());
 }
 }}
 className="rounded text-accent focus:ring-teal-500/20"
 />
 {col.header}
 </label>
 <div className="flex gap-0.5">
 <button onClick={() => moveColumn(idx,"left")} disabled={idx === 0} className="p-0.5 border rounded disabled:opacity-30">
 <ArrowLeft className="w-2.5 h-2.5" />
 </button>
 <button onClick={() => moveColumn(idx,"right")} disabled={idx === columns.length - 1} className="p-0.5 border rounded disabled:opacity-30">
 <ArrowRight className="w-2.5 h-2.5" />
 </button>
 </div>
 </div>
 ))}
 </div>
 )}
 </AnimatePresence>
 </div>

 {/* Export Select */}
 <div className="flex bg-primary text-white rounded-2xl overflow-hidden text-sm font-bold border border-slate-850 shadow-sm shrink-0">
 <button onClick={() => exportData("csv")} className="px-3 py-2 border-r border-border-light hover:opacity-90 flex items-center gap-1.5">
 <Download className="w-3.5 h-3.5" />
 CSV
 </button>
 <button onClick={() => exportData("excel")} className="px-3 py-2 hover:opacity-90">
 Excel
 </button>
 </div>
 </div>
 </div>

 {/* Main Table Shell with Sticky Header option */}
 <div className="bg-white border border-border rounded-3xl overflow-hidden shadow-sm max-h-[500px] overflow-y-auto relative">
 {isLoading ? (
 <div className="py-20 text-center flex flex-col items-center justify-center">
 <Loader2 className="w-8 h-8 text-accent animate-spin mb-2" />
 <p className="text-sm text-text-tertiary font-bold uppercase tracking-widest">Querying Snowflake...</p>
 </div>
 ) : (
 <>
 {/* Desktop Table */}
 <div className="hidden md:block">
 <table className="w-full text-left border-collapse">
 <thead className="sticky top-0 bg-bg-alt z-10 shadow-xs">
 <tr className="border-b border-border">
 <th className="py-4 px-6 w-12 bg-inherit">
 <input
 type="checkbox"
 checked={isAllSelected}
 onChange={toggleSelectAll}
 className="rounded border-border text-accent focus:ring-teal-500/20"
 />
 </th>
 {columns.map((col, idx) => {
 if (!visibleColumns.includes(idx)) return null;
 return (
 <th
 key={idx}
 className="py-4 px-5 text-sm font-bold text-text-tertiary uppercase tracking-widest bg-inherit"
 >
 <div className="flex flex-col gap-1">
 <div
 onClick={() => col.sortable && col.sortKey && handleSort(col.sortKey)}
 className={`flex items-center gap-1.5 ${
 col.sortable ?"cursor-pointer hover:text-text-secondary :text-white select-none" :""
 }`}
 >
 {col.header}
 {col.sortable && <ArrowUpDown className="w-3.5 h-3.5 opacity-60" />}
 </div>
 {/* Column Search Box */}
 {typeof col.accessor !=="function" && (
 <input
 type="text"
 placeholder={`Filter ${col.header}...`}
 value={columnSearch[col.accessor as string] ||""}
 onChange={(e) => {
 setColumnSearch({ ...columnSearch, [col.accessor as string]: e.target.value });
 setCurrentPage(1);
 }}
 className="px-3 py-2.5 text-sm bg-white border border-border rounded focus:outline-none w-full max-w-[120px] font-medium"
 />
 )}
 </div>
 </th>
 );
 })}
 </tr>
 </thead>
 <tbody>
 {paginatedData.length === 0 ? (
 <tr>
 <td colSpan={columns.length + 1} className="py-12 text-center text-sm text-text-tertiary">
 No matching records available.
 </td>
 </tr>
 ) : (
 paginatedData.map((row, rIdx) => {
 const isSelected = !!selectedRows[row.id];
 return (
 <tr
 key={row.id || rIdx}
 className={`border-b border-border-light last:border-none transition-colors hover:bg-bg-alt/50 :bg-primary/30 ${
 isSelected ?"bg-accent-light/20" :""
 }`}
 >
 <td className="py-4 px-6">
 <input
 type="checkbox"
 checked={isSelected}
 onChange={() => toggleRow(row.id)}
 className="rounded border-border text-accent focus:ring-teal-500/20"
 />
 </td>
 {columns.map((col, cIdx) => {
 if (!visibleColumns.includes(cIdx)) return null;
 return (
 <td key={cIdx} className="py-4 px-5 text-sm text-text-secondary font-semibold">
 {typeof col.accessor ==="function"
 ? col.accessor(row)
 : String(row[col.accessor as string] ??"")}
 </td>
 );
 })}
 </tr>
 );
 })
 )}
 </tbody>
 </table>
 </div>

 {/* Mobile Cards Grid Layout */}
 <div className="block md:hidden p-6 space-y-4">
 {paginatedData.length === 0 ? (
 <p className="text-center text-sm text-text-tertiary py-6">No matching records available.</p>
 ) : (
 paginatedData.map((row, rIdx) => {
 const isSelected = !!selectedRows[row.id];
 return (
 <div
 key={row.id || rIdx}
 className={`p-6 border border-slate-150 rounded-2xl space-y-3 shadow-xs ${
 isSelected ?"bg-accent-light/10 border-teal-150" :"bg-white"
 }`}
 >
 <div className="flex justify-between items-center">
 <input
 type="checkbox"
 checked={isSelected}
 onChange={() => toggleRow(row.id)}
 className="rounded border-border text-accent focus:ring-teal-500/20"
 />
 <span className="text-base font-mono text-text-tertiary">ID: {row.id || rIdx}</span>
 </div>

 <div className="grid grid-cols-2 gap-6 text-sm">
 {columns.map((col, cIdx) => {
 if (!visibleColumns.includes(cIdx)) return null;
 return (
 <div key={cIdx} className="space-y-1">
 <span className="block text-sm font-bold text-text-tertiary uppercase tracking-widest">
 {col.header}
 </span>
 <span className="font-semibold text-primary">
 {typeof col.accessor ==="function"
 ? col.accessor(row)
 : String(row[col.accessor as string] ??"")}
 </span>
 </div>
 );
 })}
 </div>
 </div>
 );
 })
 )}
 </div>
 </>
 )}
 </div>

 {/* Pagination Footer */}
 <div className="flex items-center justify-between px-3 text-sm">
 <span className="text-text-tertiary font-medium">
 Showing <span className="font-bold text-text-secondary">{(currentPage - 1) * pageSize + 1}</span> to{""}
 <span className="font-bold text-text-secondary">
 {Math.min(currentPage * pageSize, totalItems)}
 </span>{""}
 of <span className="font-bold text-text-secondary">{totalItems}</span> records
 </span>

 <div className="flex items-center gap-1.5">
 <button
 onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
 disabled={currentPage === 1}
 className="p-2 border border-border rounded-xl hover:bg-bg-alt :bg-primary disabled:opacity-40 disabled:hover:bg-transparent text-text-secondary cursor-pointer"
 >
 <ChevronLeft className="w-4 h-4" />
 </button>
 <span className="font-bold text-text-secondary px-3">
 {currentPage} / {totalPages}
 </span>
 <button
 onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
 disabled={currentPage === totalPages}
 className="p-2 border border-border rounded-xl hover:bg-bg-alt :bg-primary disabled:opacity-40 disabled:hover:bg-transparent text-text-secondary cursor-pointer"
 >
 <ChevronRight className="w-4 h-4" />
 </button>
 </div>
 </div>
 </div>
 );
}
