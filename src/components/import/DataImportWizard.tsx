// ============================================================================
// GRATIS.NGO — Data Import Wizard Component
// ============================================================================

import React, { useState } from "react";
import {
  Upload,
  FileText,
  Check,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import {
  ImportEntityType,
  ImportFormat,
  ImportMapping,
  ImportOptions,
  ImportPreview,
  ENTITY_FIELDS,
} from "@/types/data-import";

interface DataImportWizardProps {
  entityType: ImportEntityType;
  userId: string;
  onComplete: () => void;
}

type Step = "upload" | "mapping" | "preview" | "execute";

export default function DataImportWizard({
  entityType,
  userId,
  onComplete,
}: DataImportWizardProps) {
  const [step, setStep] = useState<Step>("upload");
  const [file, setFile] = useState<File | null>(null);
  const [fileText, setFileText] = useState("");
  const [format, setFormat] = useState<ImportFormat>("csv");
  const [preview, setPreview] = useState<ImportPreview | null>(null);
  const [mappings, setMappings] = useState<ImportMapping[]>([]);
  const [options, setOptions] = useState<ImportOptions>({
    delimiter: ",",
    headerRow: 0,
    batchSize: 50,
    duplicateHandling: "skip",
    dryRun: false,
    sendNotifications: false,
    skipEmptyRows: true,
  });
  const [importing, setImporting] = useState(false);
  const [results, setResults] = useState<any>(null);

  // ── Step 1: Upload ─────────────────────────────────────────────────────────

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (!uploadedFile) return;

    setFile(uploadedFile);
    const text = await uploadedFile.text();
    setFileText(text);

    // Auto-detect format
    const detectedFormat = uploadedFile.name.endsWith(".json") ? "json" : "csv";
    setFormat(detectedFormat);
  };

  const handlePreview = async () => {
    if (!fileText) return;

    const res = await fetch("/api/import", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "preview",
        text: fileText,
        format,
        entityType,
        delimiter: options.delimiter,
      }),
    });

    const data = await res.json();
    setPreview(data.preview);
    setMappings(data.preview.suggestedMappings);
    setStep("mapping");
  };

  // ── Step 2: Mapping ────────────────────────────────────────────────────────

  const updateMapping = (
    index: number,
    field: keyof ImportMapping,
    value: any,
  ) => {
    setMappings((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const addMapping = () => {
    setMappings((prev) => [
      ...prev,
      { sourceColumn: "", targetField: "", required: false },
    ]);
  };

  const removeMapping = (index: number) => {
    setMappings((prev) => prev.filter((_, i) => i !== index));
  };

  // ── Step 3: Preview & Validate ─────────────────────────────────────────────

  const validateMappings = () => {
    const requiredFields = ENTITY_FIELDS[entityType].filter((f) => f.required);
    const mappedFields = mappings.map((m) => m.targetField);
    const missing = requiredFields.filter(
      (f) => !mappedFields.includes(f.name),
    );

    if (missing.length > 0) {
      alert(
        `Missing required fields: ${missing.map((f) => f.label).join(", ")}`,
      );
      return false;
    }
    return true;
  };

  // ── Step 4: Execute ────────────────────────────────────────────────────────

  const executeImport = async () => {
    if (!fileText) return;

    setImporting(true);
    setStep("execute");

    try {
      const res = await fetch("/api/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "execute",
          text: fileText,
          format,
          entityType,
          mappings,
          options,
          createdBy: userId,
        }),
      });

      const data = await res.json();
      setResults(data.results);
    } catch (error) {
      console.error("Import failed:", error);
    } finally {
      setImporting(false);
    }
  };

  // ── Render Steps ───────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* Progress Indicator */}
      <div className="flex items-center justify-between">
        {["upload", "mapping", "preview", "execute"].map((s, i) => (
          <div key={s} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                step === s
                  ? "bg-emerald-600 text-white"
                  : i <
                      ["upload", "mapping", "preview", "execute"].indexOf(step)
                    ? "bg-emerald-500/30 text-emerald-400"
                    : "bg-gray-700 text-gray-400"
              }`}
            >
              {i + 1}
            </div>
            <span className="ml-2 text-sm text-gray-400 capitalize">{s}</span>
            {i < 3 && <ArrowRight className="w-4 h-4 text-gray-600 mx-4" />}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        {step === "upload" && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white">Upload File</h3>
            <div className="flex items-center gap-4">
              <label className="flex-1 cursor-pointer border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-gray-500 transition">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-white font-medium">
                  Click to upload CSV or JSON
                </p>
                <p className="text-sm text-gray-400 mt-1">Max 10MB</p>
                <input
                  type="file"
                  accept=".csv,.json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {file && (
              <div className="flex items-center gap-3 p-4 bg-gray-900/50 rounded-lg">
                <FileText className="w-6 h-6 text-emerald-400" />
                <div className="flex-1">
                  <p className="text-sm text-white font-medium">{file.name}</p>
                  <p className="text-xs text-gray-400">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
                <Check className="w-5 h-5 text-emerald-400" />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Format
                </label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value as ImportFormat)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm"
                >
                  <option value="csv">CSV</option>
                  <option value="json">JSON</option>
                </select>
              </div>

              {format === "csv" && (
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Delimiter
                  </label>
                  <select
                    value={options.delimiter}
                    onChange={(e) =>
                      setOptions({ ...options, delimiter: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm"
                  >
                    <option value=",">Comma (,)</option>
                    <option value=";">Semicolon (;)</option>
                    <option value="\t">Tab</option>
                  </select>
                </div>
              )}
            </div>

            <button
              onClick={handlePreview}
              disabled={!file}
              className="w-full px-4 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-700 disabled:text-gray-500 text-white font-medium rounded-lg transition"
            >
              Continue to Mapping
            </button>
          </div>
        )}

        {step === "mapping" && preview && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Field Mapping</h3>
              <p className="text-sm text-gray-400">
                {preview.totalRows} rows detected
              </p>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {mappings.map((mapping, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 bg-gray-900/50 rounded-lg"
                >
                  <select
                    value={mapping.sourceColumn}
                    onChange={(e) =>
                      updateMapping(i, "sourceColumn", e.target.value)
                    }
                    className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm"
                  >
                    <option value="">Select source column</option>
                    {preview.headers.map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>

                  <ArrowRight className="w-4 h-4 text-gray-500" />

                  <select
                    value={mapping.targetField}
                    onChange={(e) =>
                      updateMapping(i, "targetField", e.target.value)
                    }
                    className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm"
                  >
                    <option value="">Select target field</option>
                    {ENTITY_FIELDS[entityType].map((f) => (
                      <option key={f.name} value={f.name}>
                        {f.label} {f.required && "*"}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={() => removeMapping(i)}
                    className="p-2 text-gray-400 hover:text-red-400"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={addMapping}
              className="text-sm text-emerald-400 hover:underline"
            >
              + Add mapping
            </button>

            <div className="flex gap-3">
              <button
                onClick={() => setStep("upload")}
                className="px-4 py-2 border border-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Back
              </button>
              <button
                onClick={() => {
                  if (validateMappings()) setStep("preview");
                }}
                className="flex-1 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg"
              >
                Preview Import
              </button>
            </div>
          </div>
        )}

        {step === "preview" && preview && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white">Preview & Options</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Duplicate Handling
                </label>
                <select
                  value={options.duplicateHandling}
                  onChange={(e) =>
                    setOptions({
                      ...options,
                      duplicateHandling: e.target.value as any,
                    })
                  }
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm"
                >
                  <option value="skip">Skip Duplicates</option>
                  <option value="update">Update Existing</option>
                  <option value="create">Create Anyway</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Batch Size
                </label>
                <input
                  type="number"
                  value={options.batchSize}
                  onChange={(e) =>
                    setOptions({
                      ...options,
                      batchSize: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm"
                />
              </div>
            </div>

            {preview.validationIssues.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-yellow-400">
                  ⚠ Validation Issues ({preview.validationIssues.length})
                </p>
                <div className="max-h-32 overflow-y-auto space-y-1">
                  {preview.validationIssues.slice(0, 5).map((issue, i) => (
                    <p key={i} className="text-xs text-gray-400">
                      Row {issue.row}: {issue.message}
                    </p>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setStep("mapping")}
                className="px-4 py-2 border border-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Back
              </button>
              <button
                onClick={executeImport}
                className="flex-1 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg"
              >
                Start Import
              </button>
            </div>
          </div>
        )}

        {step === "execute" && (
          <div className="space-y-4 text-center">
            {importing ? (
              <>
                <div className="animate-spin w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto" />
                <p className="text-white font-medium">Importing data...</p>
              </>
            ) : results ? (
              <>
                <Check className="w-16 h-16 text-emerald-400 mx-auto" />
                <h3 className="text-xl font-bold text-white">
                  Import Complete
                </h3>
                <div className="grid grid-cols-4 gap-4 max-w-md mx-auto">
                  <div className="bg-gray-900/50 p-3 rounded-lg">
                    <p className="text-2xl font-bold text-emerald-400">
                      {results.created}
                    </p>
                    <p className="text-xs text-gray-400">Created</p>
                  </div>
                  <div className="bg-gray-900/50 p-3 rounded-lg">
                    <p className="text-2xl font-bold text-blue-400">
                      {results.updated}
                    </p>
                    <p className="text-xs text-gray-400">Updated</p>
                  </div>
                  <div className="bg-gray-900/50 p-3 rounded-lg">
                    <p className="text-2xl font-bold text-yellow-400">
                      {results.skipped}
                    </p>
                    <p className="text-xs text-gray-400">Skipped</p>
                  </div>
                  <div className="bg-gray-900/50 p-3 rounded-lg">
                    <p className="text-2xl font-bold text-red-400">
                      {results.failed}
                    </p>
                    <p className="text-xs text-gray-400">Failed</p>
                  </div>
                </div>
                <button
                  onClick={onComplete}
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg"
                >
                  Done
                </button>
              </>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
