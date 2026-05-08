import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/SafeAuthProvider';
import { Button } from '@/components/ui/button';
import { Camera, Upload, X, Check, AlertTriangle, Loader2 } from 'lucide-react';

interface BillUploadProps {
  onUploadComplete?: (data: ExtractedBillData) => void;
  onError?: (error: string) => void;
}

interface ExtractedBillData {
  biller_name: string;
  account_number?: string;
  amount_due: number;
  due_date?: string;
  bill_type?: string;
  confidence_score: number;
  document_id: string;
}

interface UploadState {
  status: 'idle' | 'uploading' | 'processing' | 'success' | 'error';
  progress: number;
  message: string;
}

const OCR_SERVER_URL = import.meta.env.VITE_OCR_SERVER_URL || '';

export default function BillUpload({ onUploadComplete, onError }: BillUploadProps) {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadState, setUploadState] = useState<UploadState>({
    status: 'idle',
    progress: 0,
    message: ''
  });
  const [extractedData, setExtractedData] = useState<ExtractedBillData | null>(null);

  const handleFileSelect = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setUploadState({
        status: 'error',
        progress: 0,
        message: 'Please select an image file (JPEG, PNG)'
      });
      onError?.('Invalid file type');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadState({
        status: 'error',
        progress: 0,
        message: 'File too large (max 10MB)'
      });
      onError?.('File too large');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);

    // Upload and process
    setUploadState({ status: 'uploading', progress: 10, message: 'Uploading...' });

    try {
      const formData = new FormData();
      formData.append('file', file);
      if (user?.id) {
        formData.append('requester_id', user.id);
      }

      setUploadState({ status: 'processing', progress: 50, message: 'AI analyzing document...' });

      const response = await fetch(`${OCR_SERVER_URL}/ocr/extract`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Processing failed');
      }

      setExtractedData(result.extracted_data);
      setUploadState({
        status: 'success',
        progress: 100,
        message: 'Document analyzed successfully!'
      });

      onUploadComplete?.(result.extracted_data);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed';
      setUploadState({
        status: 'error',
        progress: 0,
        message: errorMessage
      });
      onError?.(errorMessage);
    }
  }, [user, onUploadComplete, onError]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  }, [handleFileSelect]);

  const resetUpload = () => {
    setPreview(null);
    setExtractedData(null);
    setUploadState({ status: 'idle', progress: 0, message: '' });
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  const confidenceColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 50) return 'text-yellow-400';
    return 'text-red-400';
  };

  const confidenceLabel = (score: number) => {
    if (score >= 80) return 'High confidence';
    if (score >= 50) return 'Medium confidence - please verify';
    return 'Low confidence - manual review needed';
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        className="hidden"
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleInputChange}
        className="hidden"
      />

      <AnimatePresence mode="wait">
        {uploadState.status === 'idle' && !preview && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="border-2 border-dashed border-slate-600 rounded-xl p-8 text-center hover:border-amber-500 transition-colors"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-white/[0.08] flex items-center justify-center">
                <Upload className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-slate-300 font-medium">
                Drop your bill here or click to upload
              </p>
              <p className="text-slate-500 text-sm">
                Supports: JPEG, PNG (max 10MB)
              </p>
              <div className="flex gap-3 mt-2">
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="border-slate-600 text-slate-300 hover:text-white"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Choose File
                </Button>
                <Button
                  variant="outline"
                  onClick={() => cameraInputRef.current?.click()}
                  className="border-slate-600 text-slate-300 hover:text-white"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Take Photo
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {(uploadState.status !== 'idle' || preview) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-4"
          >
            {/* Preview */}
            {preview && (
              <div className="relative rounded-xl overflow-hidden bg-white/[0.08]">
                <img
                  src={preview}
                  alt="Bill preview"
                  className="w-full max-h-64 object-contain"
                />
                <button
                  type="button"
                  aria-label="Close preview"
                  onClick={resetUpload}
                  className="absolute top-2 right-2 p-1 rounded-full bg-slate-950/80 text-white hover:bg-red-500/80 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Progress */}
            {uploadState.status !== 'idle' && uploadState.status !== 'success' && (
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  {uploadState.status === 'uploading' && <Loader2 className="w-5 h-5 text-amber-100 animate-spin" />}
                  {uploadState.status === 'processing' && <Loader2 className="w-5 h-5 text-amber-100 animate-spin" />}
                  {uploadState.status === 'error' && <AlertTriangle className="w-5 h-5 text-red-400" />}
                  <span className={`text-sm ${
                    uploadState.status === 'error' ? 'text-red-400' : 'text-slate-300'
                  }`}>
                    {uploadState.message}
                  </span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <motion.div
                    className={`h-2 rounded-full ${
                      uploadState.status === 'error' ? 'bg-red-500' : 'bg-amber-500'
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${uploadState.progress}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            )}

            {/* Extracted Data */}
            {extractedData && uploadState.status === 'success' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/[0.055] border border-white/10 rounded-xl p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-white font-semibold">Extracted Information</h3>
                  <div className={`text-sm font-medium ${confidenceColor(extractedData.confidence_score)}`}>
                    {Math.round(extractedData.confidence_score)}% - {confidenceLabel(extractedData.confidence_score)}
                  </div>
                </div>

                <div className="grid gap-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Biller:</span>
                    <span className="text-white">{extractedData.biller_name || 'Not detected'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Amount Due:</span>
                    <span className="text-white font-mono">
                      {extractedData.amount_due ? `$${extractedData.amount_due.toFixed(2)}` : 'Not detected'}
                    </span>
                  </div>
                  {extractedData.account_number && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Account #:</span>
                      <span className="text-white font-mono">{extractedData.account_number}</span>
                    </div>
                  )}
                  {extractedData.due_date && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Due Date:</span>
                      <span className="text-white">{extractedData.due_date}</span>
                    </div>
                  )}
                  {extractedData.bill_type && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Type:</span>
                      <span className="text-white capitalize">{extractedData.bill_type}</span>
                    </div>
                  )}
                </div>

                {extractedData.confidence_score < 50 && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex items-start gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                    <p className="text-red-300 text-sm">
                      Low confidence extraction. Please review and correct the information before submitting.
                    </p>
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <Button
                    onClick={() => {
                      // Submit to Supabase
                      console.log('Submitting need:', extractedData);
                    }}
                    className="flex-1 bg-amber-200 hover:bg-amber-100 text-slate-950 shadow-[0_0_32px_rgba(251,191,36,0.16)]"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Submit Need
                  </Button>
                  <Button
                    variant="outline"
                    onClick={resetUpload}
                    className="border-slate-600 text-slate-300"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Retake
                  </Button>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
