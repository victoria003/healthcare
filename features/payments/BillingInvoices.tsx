"use client";

import React, { useState, useEffect } from "react";
import { Receipt, CreditCard, ChevronDown, Calendar, Printer, DollarSign } from "lucide-react";
import { DataTable } from "../../components/DataTable";

export default function BillingInvoices() {
  const [activeTab, setActiveTab] = useState<"patient" | "payroll">("patient");
  const [invoices, setInvoices] = useState<any[]>([]);
  const [payroll, setPayroll] = useState<any[]>([]);
  const [printingInv, setPrintingInv] = useState<any | null>(null);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/invoices");
      const data = await res.json();
      if (data.success) {
        setInvoices(data.invoices);
      }
      setPayroll([
        { id: "pay-1", staffName: "Priya Sharma, RN", baseSalary: 38000, allowance: 4200, deductions: 1500, netPay: 40700, month: "July 2026", status: "paid" }
      ]);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const patientInvoiceColumns = [
    { header: "Invoice ID", accessor: "id" as const, sortable: true, sortKey: "id" },
    { header: "Patient Name", accessor: "patientName" as const, sortable: true, sortKey: "patientName" },
    { header: "Agency", accessor: "agencyName" as const, sortable: true, sortKey: "agencyName" },
    {
      header: "Total Due",
      accessor: (row: any) => `INR ${row.total.toLocaleString()}`,
      sortable: true,
      sortKey: "total",
    },
    {
      header: "Status",
      accessor: (row: any) => (
        <span className="px-2.5 py-1 bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/30 text-[10px] font-extrabold uppercase rounded-full">
          {row.status}
        </span>
      ),
    },
    {
      header: "Actions",
      accessor: (row: any) => (
        <button
          onClick={() => setPrintingInv(row)}
          className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg cursor-pointer transition-all"
        >
          <Printer className="w-4 h-4" />
        </button>
      ),
    },
  ];

  const payrollColumns = [
    { header: "Staff Member", accessor: "staffName" as const, sortable: true, sortKey: "staffName" },
    { header: "Month", accessor: "month" as const, sortable: true, sortKey: "month" },
    { header: "Base Salary", accessor: (row: any) => `INR ${row.baseSalary.toLocaleString()}` },
    { header: "Allowances", accessor: (row: any) => `INR ${row.allowance.toLocaleString()}` },
    { header: "Deductions", accessor: (row: any) => `INR ${row.deductions.toLocaleString()}` },
    {
      header: "Net Pay",
      accessor: (row: any) => (
        <span className="font-extrabold text-slate-900 dark:text-white">
          INR {row.netPay.toLocaleString()}
        </span>
      ),
      sortable: true,
      sortKey: "netPay",
    },
    {
      header: "Status",
      accessor: (row: any) => (
        <span className="px-2.5 py-0.5 bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/30 text-[9px] font-extrabold uppercase rounded-full">
          {row.status}
        </span>
      ),
    },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
      <div className="p-6 bg-slate-900 text-white flex justify-between items-center border-b border-slate-800">
        <div>
          <h3 className="text-lg font-bold">Financial Operations Desk</h3>
          <p className="text-xs text-slate-400">Statement Audits, GST Accounting, and Staff Payroll Sheets</p>
        </div>
      </div>

      <div className="flex border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40">
        <button
          onClick={() => { setActiveTab("patient"); setPrintingInv(null); }}
          className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
            activeTab === "patient" ? "border-teal-600 text-teal-600" : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-white"
          }`}
        >
          <Receipt className="w-4 h-4 inline-block mr-1.5" />
          Patient Settlement Invoices
        </button>
        <button
          onClick={() => { setActiveTab("payroll"); setPrintingInv(null); }}
          className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
            activeTab === "payroll" ? "border-teal-600 text-teal-600" : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-white"
          }`}
        >
          <DollarSign className="w-4 h-4 inline-block mr-1.5" />
          Clinical Payroll Ledger
        </button>
      </div>

      <div className="p-6 bg-white dark:bg-slate-900">
        {printingInv ? (
          <div className="p-6 border border-slate-300 dark:border-slate-700 rounded-3xl space-y-6 max-w-2xl mx-auto bg-slate-50 dark:bg-slate-800/40 relative">
            <div className="flex justify-between items-start border-b border-slate-200 dark:border-slate-700 pb-4">
              <div>
                <h4 className="font-extrabold text-slate-900 dark:text-white text-base">HOMECARE GRID INVOICE</h4>
                <p className="text-xs font-mono text-slate-500 mt-1">Invoice ID: {printingInv.id}</p>
                <p className="text-xs text-slate-500 mt-0.5 font-medium">Due Date: {printingInv.dueDate}</p>
              </div>
              <button
                onClick={() => window.print()}
                className="p-2 bg-slate-950 dark:bg-white text-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-slate-100 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                Print
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs font-medium">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Billed To</p>
                <p className="text-slate-800 dark:text-slate-200 font-bold mt-1">{printingInv.patientName}</p>
                <p className="text-slate-500 mt-0.5">Primary Care Recipient</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Issued By</p>
                <p className="text-slate-800 dark:text-slate-200 font-bold mt-1">{printingInv.agencyName}</p>
                <p className="text-slate-500 mt-0.5">Certified Care Agency</p>
              </div>
            </div>

            <div className="border-t border-slate-200 dark:border-slate-700 pt-4 text-xs space-y-2">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Treatment Subtotal</span>
                <span>INR {printingInv.amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>GST Tax (18%)</span>
                <span>INR {printingInv.tax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-bold border-t border-slate-200 dark:border-slate-700 pt-2 text-slate-950 dark:text-white">
                <span>Total Settled Amount</span>
                <span>INR {printingInv.total.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={() => setPrintingInv(null)}
              className="w-full py-2 bg-slate-900 dark:bg-slate-700 text-white hover:bg-slate-800 rounded-xl text-xs font-bold uppercase transition-all cursor-pointer"
            >
              Back to Invoice List
            </button>
          </div>
        ) : activeTab === "patient" ? (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">
                Active Patient Statements
              </h4>
            </div>

            <DataTable
              data={invoices}
              columns={patientInvoiceColumns}
              searchPlaceholder="Search invoices..."
              searchKey="patientName"
              exportFileName="patient_invoices"
            />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">
                Nisarga Agency Staff Payroll Ledger
              </h4>
            </div>

            <DataTable
              data={payroll}
              columns={payrollColumns}
              searchPlaceholder="Search staff payroll..."
              searchKey="staffName"
              exportFileName="staff_payroll"
            />
          </div>
        )}
      </div>
    </div>
  );
}

