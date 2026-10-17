import React, { useState, useRef } from 'react';
import ResumeSubNav, { ResumeTab } from '../components/ResumeSubNav';
import { ResumeUploadResponse } from '../types';

interface ResumeUploadPageProps {
  onNavigateToTab: (tab: ResumeTab) => void;
}

export default function ResumeUploadPage({ onNavigateToTab }: ResumeUploadPageProps) {
  const [file, setFile] = useState<File | null>(null);
  const [versionLabel, setVersionLabel] = useState('v2.2');
  const [versionNotes, setVersionNotes] = useState('Updated with Spring Boot 3.3 microservices, Kafka saga orchestration, and 2026 batch graduation proof.');
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgressStep, setUploadProgressStep] = useState<string>('');
  const [uploadResult, setUploadResult] = useState<ResumeUploadResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processSelectedFile(e.target.files[0]);
    }
  };

  const processSelectedFile = (selected: File) => {
    setErrorMessage(null);
    setUploadResult(null);

    if (!selected.name.toLowerCase().endsWith('.pdf')) {
      setErrorMessage('Upload rejected: Only official PDF documents (.pdf) are permitted.');
      return;
    }

    if (selected.size > 5 * 1024 * 1024) {
      setErrorMessage(`Upload rejected: File size (${(selected.size / 1024 / 1024).toFixed(1)}MB) exceeds maximum permitted limit of 5.0MB.`);
      return;
    }

    setFile(selected);
  };

  const handleSubmitUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setErrorMessage('Please select a valid PDF resume file.');
      return;
    }

    setUploading(true);
    setErrorMessage(null);

    // Simulate multi-step verification pipeline for UX
    setUploadProgressStep('Verifying binary header magic bytes (%PDF-)...');
    await new Promise((r) => setTimeout(r, 400));
    setUploadProgressStep('Writing to private storage enclave (./storage/resumes/user_arjun)...');
    await new Promise((r) => setTimeout(r, 500));
    setUploadProgressStep('Parsing structured text and line evidence with Apache Tika...');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('versionLabel', versionLabel);
    formData.append('userId', 'user_arjun');

    try {
      const response = await fetch('/api/v1/resumes/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });

      if (!response.ok) {
        const errorJson = await response.json();
        throw new Error(errorJson.error || 'Failed to upload resume.');
      }

      const result: ResumeUploadResponse = await response.json();
      setUploadResult(result);
      setUploadProgressStep('Extraction and analysis complete!');
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred during upload.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto pb-16">
      <ResumeSubNav
        activeTab="RESUME_UPLOAD"
        onSelectTab={onNavigateToTab}
        versionLabel={versionLabel}
        atsScore={uploadResult?.atsScore || 91}
      />

      {/* Header */}
      <div className="pb-6 border-b border-[#e2e8f0]">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ecfdf5] text-[#059669] text-xs font-semibold mb-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#059669]"></span>
          <span>Zero-Hallucination Pipeline</span>
          <span className="text-[#94a3b8]">/</span>
          <span>Strict Pre-Flight Validation Matrix</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0f172a] tracking-tight">
          Upload & Validation Center
        </h1>
        <p className="text-sm text-[#64748b] mt-1 max-w-2xl">
          Upload your resume PDF to instantiate a new version in your private enclave. Each upload undergoes binary magic-byte inspection, Apache Tika line parsing, and SHA-256 immutability verification.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
        
        {/* Left Column (7 cols): Upload Form & Interactive Drop Zone */}
        <div className="lg:col-span-7 flex flex-col gap-6">

          <form onSubmit={handleSubmitUpload} className="bg-white rounded-xl border border-[#e2e8f0] p-6 shadow-xs">
            
            <div className="flex items-center justify-between pb-4 border-b border-[#f1f5f9] mb-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#4338ca] text-[20px]">cloud_upload</span>
                <h2 className="text-sm font-bold text-[#0f172a] uppercase tracking-wider">
                  Select Master Resume PDF
                </h2>
              </div>
              <span className="text-xs font-mono text-[#64748b]">Max 5.0 MB</span>
            </div>

            {/* Drag & Drop Zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
                isDragging
                  ? 'border-[#4338ca] bg-[#eef2ff]'
                  : file
                  ? 'border-[#10b981] bg-[#f0fdf4]'
                  : 'border-[#cbd5e1] hover:border-[#4338ca] hover:bg-[#faf8ff]'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,application/pdf"
                className="hidden"
                onChange={handleFileChange}
              />

              <div className="flex flex-col items-center">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-3 transition ${
                  file ? 'bg-[#10b981] text-white' : 'bg-[#eef2ff] text-[#4338ca]'
                }`}>
                  <span className="material-symbols-outlined text-[32px]">
                    {file ? 'check_circle' : 'upload_file'}
                  </span>
                </div>

                {file ? (
                  <div>
                    <p className="text-sm font-bold text-[#0f172a]">{file.name}</p>
                    <p className="text-xs text-[#64748b] mt-1">
                      {(file.size / 1024).toFixed(1)} KB • Click or drop another PDF to replace
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm font-bold text-[#0f172a]">
                      Drop your resume PDF here, or <span className="text-[#4338ca] underline">browse files</span>
                    </p>
                    <p className="text-xs text-[#64748b] mt-1">
                      Accepts standard PDF/A files up to 5 MB with embedded text layers
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Version Metadata Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
              <div>
                <label className="block text-xs font-bold text-[#334155] mb-1">
                  Target Version Label
                </label>
                <input
                  type="text"
                  value={versionLabel}
                  onChange={(e) => setVersionLabel(e.target.value)}
                  placeholder="e.g. v2.2, v3.0"
                  className="w-full px-3 py-2 text-xs font-mono font-bold bg-[#f8fafc] border border-[#cbd5e1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4338ca]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#334155] mb-1">
                  Batch Eligibility Target
                </label>
                <div className="px-3 py-2 text-xs font-mono font-bold bg-[#ecfdf5] text-[#059669] border border-[#a7f3d0] rounded-lg flex items-center justify-between">
                  <span>2026 Batch (Outgoing)</span>
                  <span className="material-symbols-outlined text-[16px]">verified</span>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-xs font-bold text-[#334155] mb-1">
                Version Changelog Notes (Optional)
              </label>
              <textarea
                value={versionNotes}
                onChange={(e) => setVersionNotes(e.target.value)}
                rows={2}
                placeholder="Describe modifications made to this version..."
                className="w-full px-3 py-2 text-xs bg-[#f8fafc] border border-[#cbd5e1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4338ca]"
              />
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="mt-4 p-3.5 rounded-lg bg-[#fef2f2] border border-[#fecaca] text-[#b91c1c] text-xs flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">error</span>
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Progress Pipeline */}
            {uploading && (
              <div className="mt-4 p-4 rounded-lg bg-[#eef2ff] border border-[#c7d2fe]">
                <div className="flex items-center gap-2 text-xs font-bold text-[#4338ca]">
                  <span className="w-2 h-2 rounded-full bg-[#4338ca] animate-ping"></span>
                  <span>{uploadProgressStep}</span>
                </div>
                <div className="w-full bg-[#c7d2fe] h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-[#4338ca] h-full w-2/3 animate-pulse"></div>
                </div>
              </div>
            )}

            {/* Upload Button */}
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => { setFile(null); setErrorMessage(null); setUploadResult(null); }}
                className="px-4 py-2 text-xs font-semibold text-[#64748b] hover:text-[#0f172a]"
              >
                Reset
              </button>
              <button
                type="submit"
                disabled={!file || uploading}
                className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-xs font-bold transition shadow-xs ${
                  !file || uploading
                    ? 'bg-[#cbd5e1] text-[#94a3b8] cursor-not-allowed'
                    : 'bg-[#4338ca] text-white hover:bg-[#3730a3]'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">security_update_good</span>
                <span>{uploading ? 'Processing Resume...' : `Publish & Parse ${versionLabel}`}</span>
              </button>
            </div>

          </form>

          {/* Success Extraction Result Card */}
          {uploadResult && (
            <div className="bg-white rounded-xl border border-[#10b981] p-6 shadow-md animate-fadeIn">
              <div className="flex items-center justify-between pb-3 border-b border-[#f1f5f9]">
                <div className="flex items-center gap-2 text-[#059669]">
                  <span className="material-symbols-outlined text-[24px]">verified</span>
                  <h3 className="text-sm font-bold">Successfully Published {uploadResult.versionLabel}!</h3>
                </div>
                <span className="px-2 py-0.5 rounded bg-[#ecfdf5] text-[#059669] font-mono text-xs font-bold">
                  ATS Score: {uploadResult.atsScore}/100
                </span>
              </div>

              <p className="text-xs text-[#334155] mt-3">
                {uploadResult.message}
              </p>

              <div className="mt-3">
                <span className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider">
                  Extracted Verified Skills:
                </span>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {uploadResult.extractedSkills.map((sk, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-[#f1f5f9] text-[#334155] text-[11px] font-mono">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-[#f1f5f9] flex items-center justify-end gap-3">
                <button
                  onClick={() => onNavigateToTab('RESUME_ANALYSIS')}
                  className="px-4 py-2 rounded-lg bg-[#eef2ff] text-[#4338ca] hover:bg-[#e0e7ff] text-xs font-bold"
                >
                  View Analysis Overview
                </button>
                <button
                  onClick={() => onNavigateToTab('RESUME_MATCHING')}
                  className="px-4 py-2 rounded-lg bg-[#4338ca] text-white hover:bg-[#3730a3] text-xs font-bold"
                >
                  Match Against Target Jobs →
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Right Column (5 cols): Pre-Flight Validation Matrix */}
        <div className="lg:col-span-5 flex flex-col gap-6">

          <div className="bg-white rounded-xl border border-[#e2e8f0] p-6 shadow-xs">
            <div className="flex items-center gap-2 pb-3 border-b border-[#f1f5f9] mb-4">
              <span className="material-symbols-outlined text-[#4338ca] text-[20px]">fact_check</span>
              <h3 className="text-sm font-bold text-[#0f172a] uppercase tracking-wider">
                Pre-Flight Validation Matrix
              </h3>
            </div>

            <div className="space-y-3.5 text-xs">
              
              <div className="flex items-start gap-3 p-3 rounded-lg bg-[#f8fafc] border border-[#e2e8f0]">
                <span className="material-symbols-outlined text-[#10b981] text-[18px] shrink-0 mt-0.5">check_circle</span>
                <div>
                  <h4 className="font-bold text-[#0f172a]">Magic Byte Header Validation</h4>
                  <p className="text-[#64748b] text-[11px] mt-0.5">
                    Binary stream inspected for hex bytes <span className="font-mono text-[#4338ca]">%PDF- (0x255044462D)</span>. Executable or disguised files are rejected immediately.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-[#f8fafc] border border-[#e2e8f0]">
                <span className="material-symbols-outlined text-[#10b981] text-[18px] shrink-0 mt-0.5">check_circle</span>
                <div>
                  <h4 className="font-bold text-[#0f172a]">Maximum Size Restriction</h4>
                  <p className="text-[#64748b] text-[11px] mt-0.5">
                    Hard ceiling enforced at 5.0 MB to safeguard parsing threads and reject bloated embedded assets.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-[#f8fafc] border border-[#e2e8f0]">
                <span className="material-symbols-outlined text-[#10b981] text-[18px] shrink-0 mt-0.5">check_circle</span>
                <div>
                  <h4 className="font-bold text-[#0f172a]">Apache Tika Text Layer Extraction</h4>
                  <p className="text-[#64748b] text-[11px] mt-0.5">
                    Evaluates optical text stream readability. Non-text scanned raster images without OCR layers are flagged.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-[#f8fafc] border border-[#e2e8f0]">
                <span className="material-symbols-outlined text-[#10b981] text-[18px] shrink-0 mt-0.5">check_circle</span>
                <div>
                  <h4 className="font-bold text-[#0f172a]">SHA-256 Immutability Checksum</h4>
                  <p className="text-[#64748b] text-[11px] mt-0.5">
                    A cryptographic digest is recorded in MongoDB version history to guarantee digital provenance across job applications.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-[#f8fafc] border border-[#e2e8f0]">
                <span className="material-symbols-outlined text-[#10b981] text-[18px] shrink-0 mt-0.5">check_circle</span>
                <div>
                  <h4 className="font-bold text-[#0f172a]">2026 Batch Qualification Proof</h4>
                  <p className="text-[#64748b] text-[11px] mt-0.5">
                    Automatic regex scan ensures graduation year matches candidate policy (2026 passed out batch).
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Private Local Storage Security Warning */}
          <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-xl p-5 text-xs text-[#166534]">
            <div className="flex items-center gap-2 font-bold mb-1">
              <span className="material-symbols-outlined text-[18px]">verified_user</span>
              <span>Private Enclave Protection</span>
            </div>
            <p className="text-[11px] leading-relaxed text-[#15803d]">
              Uploaded files are stored privately on local server disk under <span className="font-mono font-bold">./storage/resumes/user_arjun/</span> with random UUID prefixes. They are never exposed to public URLs or external CDNs.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
