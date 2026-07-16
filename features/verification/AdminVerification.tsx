"use client";

import React, { useState, useEffect } from "react";
import { Check, X, ShieldAlert, FileText, ExternalLink, RefreshCw, AlertCircle } from "lucide-react";

export default function AdminVerification() {
  const [queue, setQueue] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [reviewNote, setReviewNote] = useState("");
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [actionStatus, setActionStatus] = useState("");

  const fetchQueue = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/verification-queue");
      const data = await res.json();
      if (data.success) {
        setQueue(data.queue);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  const handleDocumentReview = async (agencyId: string, docId: string, status: "APPROVED" | "REJECTED") => {
    setActionStatus("processing");
    try {
      const res = await fetch(`/api/admin/agencies/${agencyId}/documents/${docId}/review`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, remarks: reviewNote || "Reviewed by compliance administrator." })
      });
      const data = await res.json();
      if (data.success) {
        setReviewNote("");
        setSelectedDocId(null);
        fetchQueue();
        setActionStatus("success");
        setTimeout(() => setActionStatus(""), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const verifyAgency = async (agencyId: string, action: "VERIFY" | "REJECT") => {
    setActionStatus("processing");
    try {
      const res = await fetch(`/api/admin/agencies/${agencyId}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action })
      });
      const data = await res.json();
      if (data.success) {
        fetchQueue();
        setActionStatus("success");
        setTimeout(() => setActionStatus(""), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
      <div className="p-6 bg-slate-900 text-white flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold">Platform Onboarding & Compliance Verification</h3>
          <p className="text-xs text-slate-400">Review, Audit, Approve, or Reject Agency Licenses, GST, PAN & Owner KYC</p>
        </div>
        <button
          onClick={fetchQueue}
          className="p-2 bg-slate-800 text-slate-300 hover:text-white rounded-xl cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="p-6">
        {actionStatus === "success" && (
          <div className="p-3 mb-4 bg-emerald-50 text-emerald-800 font-bold text-xs rounded-xl">
            Compliance updates registered successfully. Database trace logs generated.
          </div>
        )}

        {loading ? (
          <div className="space-y-4 animate-pulse py-4">
            <div className="h-5 bg-slate-100 rounded w-1/3" />
            <div className="h-10 bg-slate-100 rounded w-full" />
          </div>
        ) : queue.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-xs text-slate-500 font-medium">No pending agency compliance files in the queue.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {queue.map((agency) => (
              <div key={agency.id} className="p-5 border border-slate-200 rounded-3xl bg-slate-50/50 space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-3">
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-sm">{agency.name}</h4>
                    <p className="text-[11px] text-slate-500 font-medium">Owner: {agency.ownerName} • Contact: {agency.email}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => verifyAgency(agency.id, "VERIFY")}
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold uppercase transition-all cursor-pointer"
                    >
                      Verify Agency Onboard
                    </button>
                    <button
                      onClick={() => verifyAgency(agency.id, "REJECT")}
                      className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold uppercase transition-all cursor-pointer"
                    >
                      Reject Onboard
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <h5 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Uploaded Compliance Documents</h5>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {agency.documents?.map((doc: any) => (
                      <div key={doc.id} className="p-4 border border-slate-150 rounded-2xl bg-white space-y-3">
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <span className="text-[9px] bg-slate-100 text-slate-700 font-extrabold uppercase px-2 py-0.5 rounded">
                              {doc.docType}
                            </span>
                            <h6 className="font-bold text-slate-900 text-xs mt-1.5">{doc.docNumber || "Doc verification file"}</h6>
                            <p className="text-[10px] text-slate-400 font-medium">Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()}</p>
                          </div>
                          <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase ${
                            doc.status === "APPROVED" ? "bg-emerald-50 text-emerald-700" : doc.status === "REJECTED" ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-700"
                          }`}>
                            {doc.status}
                          </span>
                        </div>

                        {/* View File Simulation */}
                        <div className="p-3 bg-slate-50 border border-slate-150 rounded-xl flex items-center justify-between text-[11px] text-slate-500">
                          <span className="font-mono">R2_SECURE_STORAGE://{doc.fileName}</span>
                          <a href={doc.fileUrl} target="_blank" className="text-teal-600 hover:underline flex items-center gap-0.5">
                            <ExternalLink className="w-3 h-3" />
                            View
                          </a>
                        </div>

                        {selectedDocId === doc.id ? (
                          <div className="space-y-2 pt-2 border-t border-slate-100">
                            <input
                              type="text"
                              value={reviewNote}
                              onChange={(e) => setReviewNote(e.target.value)}
                              placeholder="Review remarks e.g., GST registration verified"
                              className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none focus:border-teal-500"
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleDocumentReview(agency.id, doc.id, "APPROVED")}
                                className="flex-1 py-1 bg-emerald-600 text-white rounded text-[10px] font-bold uppercase cursor-pointer"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleDocumentReview(agency.id, doc.id, "REJECTED")}
                                className="flex-1 py-1 bg-red-600 text-white rounded text-[10px] font-bold uppercase cursor-pointer"
                              >
                                Reject
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => setSelectedDocId(doc.id)}
                            className="text-[10px] text-teal-600 hover:underline font-bold uppercase tracking-wider cursor-pointer"
                          >
                            Review File
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
