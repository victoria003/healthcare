"use client";
import React, { useState, useEffect } from "react";
import { BarChart3, FileText, Download, Calendar, Save, Star, Clock, AlertCircle, RefreshCw } from "lucide-react";
import { DataTable } from "../../components/DataTable";

interface ReportingDeskProps {
  sfConnected?: boolean;
}

export default function ReportingDesk({ sfConnected = false }: ReportingDeskProps) {
  const [activeCategory, setActiveCategory] = useState<"bookings" | "patients" | "agencies" | "revenue" | "visits" | "staff">("bookings");
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState<any[]>([]);
  const [savedFilters, setSavedFilters] = useState<string[]>([]);
  const [scheduledReports, setScheduledReports] = useState<string[]>([]);
  const [favReports, setFavReports] = useState<string[]>([]);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleEmail, setScheduleEmail] = useState("");
  const [scheduleCron, setScheduleCron] = useState("daily");
  const [filterQuery, setFilterQuery] = useState("");

  const categories = [
    { id: "bookings", label: "Bookings Report" },
    { id: "patients", label: "Patients Report" },
    { id: "agencies", label: "Agencies Report" },
    { id: "revenue", label: "Revenue Report" },
    { id: "visits", label: "Visits Report" },
    { id: "staff", label: "Staff Roster Report" },
  ] as const;

  // Retrieve reports dynamically from Snowflake query
  const loadReports = async () => {
    if (!sfConnected) {
      setReportData([]);
      return;
    }
    setLoading(true);
    try {
      // Simulate querying different views based on category
      const res = await fetch("/api/bookings");
      const data = await res.json();
      if (data.success) {
        if (activeCategory === "bookings") {
          setReportData(data.bookings.map((b: any) => ({
            id: b.id,
            patient: b.patientName,
            agency: b.agencyName,
            service: b.serviceName,
            amount: b.amount,
            status: b.status,
            date: b.date
          })));
        } else if (activeCategory === "patients") {
          // Query unique patients
          const patients = Array.from(new Set(data.bookings.map((b: any) => b.patientName))).map((name, i) => ({
            id: `p-${100 + i}`,
            name,
            totalBookings: data.bookings.filter((b: any) => b.patientName === name).length,
            totalSpend: data.bookings.filter((b: any) => b.patientName === name).reduce((acc: number, curr: any) => acc + curr.amount, 0),
            status: "Active"
          }));
          setReportData(patients);
        } else if (activeCategory === "agencies") {
          const agencies = Array.from(new Set(data.bookings.map((b: any) => b.agencyName))).map((name, i) => ({
            id: `a-${100 + i}`,
            name,
            bookings: data.bookings.filter((b: any) => b.agencyName === name).length,
            grossRevenue: data.bookings.filter((b: any) => b.agencyName === name).reduce((acc: number, curr: any) => acc + curr.amount, 0),
            rating: 4.8
          }));
          setReportData(agencies);
        } else if (activeCategory === "revenue") {
          const revs = data.bookings.map((b: any, i: number) => ({
            id: `r-${100 + i}`,
            reference: b.id,
            grossAmount: b.amount,
            commission: Math.round(b.amount * 0.12),
            settledAmount: Math.round(b.amount * 0.88),
            status: b.paymentStatus
          }));
          setReportData(revs);
        } else if (activeCategory === "visits") {
          const visits = data.bookings.map((b: any, i: number) => ({
            id: `v-${100 + i}`,
            bookingId: b.id,
            staff: b.assignedStaffName || "Unassigned",
            checkIn: b.date,
            eta: b.etaMinutes || 0,
            status: b.status
          }));
          setReportData(visits);
        } else if (activeCategory === "staff") {
          const staff = Array.from(new Set(data.bookings.filter((b: any) => b.assignedStaffName).map((b: any) => b.assignedStaffName))).map((name, i) => ({
            id: `s-${100 + i}`,
            name,
            allocatedVisits: data.bookings.filter((b: any) => b.assignedStaffName === name).length,
            rating: 4.9,
            status: "active"
          }));
          setReportData(staff);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, [activeCategory, sfConnected]);

  // Handle saving filters
  const handleSaveFilter = () => {
    const filterName = `${activeCategory.toUpperCase()} - query "${filterQuery || "all"}"`;
    if (!savedFilters.includes(filterName)) {
      const updated = [...savedFilters, filterName];
      setSavedFilters(updated);
      localStorage.setItem("hc_saved_filters", JSON.stringify(updated));
    }
  };

  // Handle scheduling
  const handleScheduleReport = () => {
    if (!scheduleEmail) return;
    const scheduleDesc = `${activeCategory.toUpperCase()} Report to ${scheduleEmail} (${scheduleCron})`;
    const updated = [...scheduledReports, scheduleDesc];
    setScheduledReports(updated);
    setScheduleEmail("");
    setShowScheduleModal(false);
  };

  // Toggle favorite
  const toggleFavorite = () => {
    const reportName = `${activeCategory.toUpperCase()} Ledger Summary`;
    let updated;
    if (favReports.includes(reportName)) {
      updated = favReports.filter((r) => r !== reportName);
    } else {
      updated = [...favReports, reportName];
    }
    setFavReports(updated);
  };

  // Table Columns based on active category
  const getColumns = () => {
    switch (activeCategory) {
      case "bookings":
        return [
          { header: "Booking ID", accessor: "id" as const, sortable: true, sortKey: "id" },
          { header: "Patient", accessor: "patient" as const, sortable: true, sortKey: "patient" },
          { header: "Agency Provider", accessor: "agency" as const, sortable: true, sortKey: "agency" },
          { header: "Specialty Service", accessor: "service" as const },
          { header: "Settlement cost", accessor: (row: any) => `INR ${row.amount.toLocaleString()}` },
          {
            header: "State",
            accessor: (row: any) => (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                {row.status}
              </span>
            ),
          },
        ];
      case "patients":
        return [
          { header: "Patient ID", accessor: "id" as const, sortable: true, sortKey: "id" },
          { header: "Patient Name", accessor: "name" as const, sortable: true, sortKey: "name" },
          { header: "Visits Reserved", accessor: "totalBookings" as const, sortable: true, sortKey: "totalBookings" },
          { header: "Cumulative Cost", accessor: (row: any) => `INR ${row.totalSpend.toLocaleString()}` },
          { header: "Compliance Profile", accessor: "status" as const },
        ];
      case "agencies":
        return [
          { header: "Agency ID", accessor: "id" as const },
          { header: "Agency Brand", accessor: "name" as const, sortable: true, sortKey: "name" },
          { header: "Dispatches Done", accessor: "bookings" as const, sortable: true, sortKey: "bookings" },
          { header: "Gross Revenue", accessor: (row: any) => `INR ${row.grossRevenue.toLocaleString()}` },
          { header: "Audited Rating", accessor: "rating" as const },
        ];
      case "revenue":
        return [
          { header: "Audit ID", accessor: "id" as const },
          { header: "Booking Ref", accessor: "reference" as const },
          { header: "Gross Amount", accessor: (row: any) => `INR ${row.grossAmount.toLocaleString()}` },
          { header: "SaaS Commission (12%)", accessor: (row: any) => `INR ${row.commission.toLocaleString()}` },
          { header: "Agency Payout (88%)", accessor: (row: any) => `INR ${row.settledAmount.toLocaleString()}` },
          { header: "Status", accessor: "status" as const },
        ];
      case "visits":
        return [
          { header: "Visit Index", accessor: "id" as const },
          { header: "Roster Match", accessor: "bookingId" as const },
          { header: "Assigned Roster", accessor: "staff" as const },
          { header: "ETA (Mins)", accessor: "eta" as const },
          { header: "Status", accessor: "status" as const },
        ];
      case "staff":
        return [
          { header: "Staff ID", accessor: "id" as const },
          { header: "Companion Name", accessor: "name" as const, sortable: true, sortKey: "name" },
          { header: "Assigned Shifts", accessor: "allocatedVisits" as const, sortable: true, sortKey: "allocatedVisits" },
          { header: "Quality Rating", accessor: "rating" as const },
          { header: "Status", accessor: "status" as const },
        ];
    }
  };

  return (
    <div className="space-y-6">
      {/* Upper Branded Header */}
      <div className="bg-slate-900 text-white border border-slate-850 p-6 rounded-3xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-teal-400" />
            Snowflake Relational Reporting Console
          </h2>
          <p className="text-xs text-slate-400">Generate compliance matrices, revenue summaries, and dispatch audit logs directly from Snowflake database warehouses.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={toggleFavorite}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer border ${
              favReports.includes(`${activeCategory.toUpperCase()} Ledger Summary`)
                ? "bg-amber-500 border-amber-400 text-slate-950"
                : "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
            }`}
          >
            <Star className="w-3.5 h-3.5" />
            Favorite
          </button>
          <button
            onClick={() => setShowScheduleModal(true)}
            className="px-3 py-1.5 bg-teal-500 text-slate-950 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5" />
            Schedule Delivery
          </button>
        </div>
      </div>

      {/* Main Grid View */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Navigation Sidebar */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 space-y-4">
          <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">
            Report Types
          </span>
          <div className="space-y-1">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
                  activeCategory === cat.id
                    ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                }`}
              >
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          {/* Favorites Summary Panel */}
          {favReports.length > 0 && (
            <div className="pt-4 border-t border-slate-100 dark:border-slate-850 space-y-2">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">
                Favorites
              </span>
              <div className="space-y-1">
                {favReports.map((fav, idx) => (
                  <div key={idx} className="flex items-center gap-2 px-2 text-[10px] text-slate-500 font-semibold truncate">
                    <Star className="w-3 h-3 text-amber-500 fill-amber-500 shrink-0" />
                    <span>{fav}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Schedule list */}
          {scheduledReports.length > 0 && (
            <div className="pt-4 border-t border-slate-100 dark:border-slate-850 space-y-2">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">
                Scheduled Deliveries
              </span>
              <div className="space-y-1.5">
                {scheduledReports.map((sc, idx) => (
                  <div key={idx} className="flex items-center gap-2 px-2 text-[10px] text-slate-500 font-semibold">
                    <Clock className="w-3 h-3 text-teal-500 shrink-0" />
                    <span className="truncate">{sc}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Dynamic Snowflake Grid Viewer */}
        <div className="lg:col-span-3 space-y-4">
          {!sfConnected ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center flex flex-col items-center">
              <AlertCircle className="w-12 h-12 text-amber-500 mb-4 animate-bounce" />
              <h3 className="text-base font-bold text-slate-800 dark:text-white">Awaiting Snowflake Connection</h3>
              <p className="text-xs text-slate-400 mt-2 max-w-sm">Connect your Snowflake analytics schema in the console bar above to pull live database logs and reports.</p>
              <div className="mt-6 flex gap-3">
                <span className="px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 text-xs font-bold rounded-xl bg-slate-50 dark:bg-slate-800/40">
                  Connect Snowflake to View Data
                </span>
              </div>
            </div>
          ) : loading ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center">
              <RefreshCw className="w-8 h-8 text-teal-500 animate-spin mx-auto mb-4" />
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Querying Snowflake Cluster...</p>
            </div>
          ) : reportData.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center">
              <p className="text-xs text-slate-400">No Data Available in Snowflake Database.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Filter controls and saving capability */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-3xl flex flex-col sm:flex-row gap-3 items-center justify-between shadow-xs">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <input
                    type="text"
                    placeholder="Apply query filters..."
                    value={filterQuery}
                    onChange={(e) => setFilterQuery(e.target.value)}
                    className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none w-full sm:w-60"
                  />
                  <button
                    onClick={handleSaveFilter}
                    className="p-2 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 rounded-xl border border-slate-250 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                    title="Save current filters"
                  >
                    <Save className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-[10px] font-mono text-slate-400">
                  SQL Table Source: <span className="font-bold text-slate-600 dark:text-slate-200">CORE.{activeCategory.toUpperCase()}</span>
                </div>
              </div>

              {/* Data Table */}
              <DataTable
                data={reportData}
                columns={getColumns()}
                searchPlaceholder={`Filter ${activeCategory}...`}
                searchKey="patient"
                exportFileName={`homecare_${activeCategory}_report`}
              />
            </div>
          )}
        </div>
      </div>

      {/* Scheduling Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
            <div>
              <h3 className="font-bold text-slate-950 dark:text-white text-base">Schedule Reports Delivery</h3>
              <p className="text-xs text-slate-500">Deliver structured reports directly to stakeholders on a cron sequence.</p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                  Recipient Email Address
                </label>
                <input
                  type="email"
                  value={scheduleEmail}
                  onChange={(e) => setScheduleEmail(e.target.value)}
                  placeholder="recipient@company.com"
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                  Sequence Schedule
                </label>
                <select
                  value={scheduleCron}
                  onChange={(e) => setScheduleCron(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none"
                >
                  <option value="daily">Every Morning (08:00 AM UTC)</option>
                  <option value="weekly">Every Monday (08:00 AM UTC)</option>
                  <option value="monthly">First day of month</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowScheduleModal(false)}
                className="flex-1 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-500"
              >
                Cancel
              </button>
              <button
                onClick={handleScheduleReport}
                className="flex-1 py-2 bg-slate-950 dark:bg-white text-white dark:text-slate-950 rounded-xl text-xs font-bold uppercase"
              >
                Apply Schedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
