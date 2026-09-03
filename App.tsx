import React, { useState } from 'react';
import { 
  Sparkles, 
  Trash2, 
  Copy, 
  Check, 
  ExternalLink, 
  FileText, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import type { Subtitle } from './types';
import { parseSrt, formatSrt } from './utils/srtParser';

// --- Professional Result Display Component ---

interface ResultDisplayProps {
  content: string;
  label?: string;
  placeholder?: string;
  isSrt?: boolean;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ 
  content, 
  label = "Văn bản đã xử lý", 
  placeholder = "Kết quả sau khi lọc sẽ hiển thị tại đây...",
  isSrt = false,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!content) return;
    navigator.clipboard.writeText(content).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const lineCount = content ? content.split('\n').filter(Boolean).length : 0;
  const wordCount = content ? content.trim().split(/\s+/).filter(Boolean).length : 0;

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200/90 dark:border-slate-700/80 shadow-sm overflow-hidden">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 px-4 py-3 bg-slate-50/70 dark:bg-slate-900/40 border-b border-slate-200/80 dark:border-slate-700/80">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 ring-4 ring-emerald-500/10"></div>
          <span className="font-semibold text-sm text-slate-800 dark:text-slate-200 tracking-tight">
            {label}
          </span>
          {content && (
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-200/70 dark:bg-slate-700/70 text-slate-600 dark:text-slate-300">
              {isSrt ? 'Định dạng SRT' : `${lineCount} dòng • ${wordCount} từ`}
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <a 
            href="https://timecode-gamma.vercel.app/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-200/80 dark:border-emerald-800/60 rounded-lg transition-all shadow-2xs hover:shadow-xs active:scale-95"
            title="Mở Timecode Tool"
          >
            <span>Timecode</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-80" />
          </a>

          <a 
            href="https://www.minimax.io/audio/text-to-speech" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-all shadow-xs hover:shadow-indigo-500/20 active:scale-95"
            title="Chuyển sang Minimax Text to Speech"
          >
            <span>Bước tiếp theo</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>

          <button 
            type="button"
            onClick={handleCopy}
            disabled={!content}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all border ${
              copied
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/60'
            } disabled:opacity-40 disabled:cursor-not-allowed active:scale-95`}
            title="Sao chép nội dung đã làm sạch"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Đã sao chép</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span>Sao chép</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Editor Body */}
      <div className="relative flex-1 p-3 bg-white dark:bg-slate-800/50 min-h-[380px] sm:min-h-[460px] flex flex-col">
        {content ? (
          <textarea
            readOnly
            value={content}
            className="w-full flex-1 p-3 bg-slate-50/60 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-700/60 rounded-xl font-mono text-xs sm:text-sm leading-relaxed text-slate-800 dark:text-slate-100 focus:outline-none resize-none select-all"
          />
        ) : (
          <div className="w-full flex-1 flex flex-col items-center justify-center text-center p-8 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700/70 bg-slate-50/40 dark:bg-slate-900/20">
            <div className="w-11 h-11 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500 mb-3 shadow-2xs">
              <FileText className="w-5 h-5" />
            </div>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400 max-w-xs">
              {placeholder}
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
              Dán kịch bản hoặc phụ đề ở cột bên trái và nhấn <span className="font-semibold text-slate-600 dark:text-slate-300">Lọc nội dung</span>.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// --- Main Application Component ---

export default function App() {
  const [textContent, setTextContent] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<{ 
    highlights: Subtitle[]; 
    notes: Subtitle[]; 
    cleanContent: string;
    isSrt: boolean;
  } | null>(null);

  const handleReset = () => {
    setTextContent('');
    setAnalysisResult(null);
    setError('');
  };

  /**
   * Helper auto-fix for TTS (e.g. "911" -> "9 1 1")
   */
  const applyAutoFixes = (text: string): string => {
    return text.replace(/\b911\b/g, '9 1 1');
  };

  const analyzeFile = () => {
    if (!textContent.trim()) {
      setError("Vui lòng nhập hoặc dán nội dung cần lọc.");
      return;
    }
    setError('');
    
    try {
      const subtitles = parseSrt(textContent);
      const isSrt = subtitles.length > 0;

      const highlights: Subtitle[] = [];
      const notes: Subtitle[] = [];
      
      const vietnameseRegex = /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i;
      // Filter Vietnamese notes: "bài học", "kết tội", "đọc comment", "câu nối", "Intro", "Outro"...
      const removalKeywordsRegex = /(?:^|[\s:\[\({-])(Intro|Case \d+|Link vid|kết tội|đọc comment|bài học|câu nối|Outro)(?:[\s:\]\)}!?.-]|$)/i;
      const timeRangeRegex = /\d{1,2}:\d{2}(?::\d{2})?\s*-\s*\d{1,2}:\d{2}(?::\d{2})?/;
      const highlightRegex = /highlight case/i;

      const shouldExclude = (text: string) => {
        const trimmed = text.trim();
        return removalKeywordsRegex.test(trimmed) || 
               timeRangeRegex.test(trimmed) || 
               vietnameseRegex.test(trimmed);
      };

      if (isSrt) {
        const cleanSubs: Subtitle[] = [];
        subtitles.forEach(sub => {
          const isHighlight = highlightRegex.test(sub.text);
          const isNote = shouldExclude(sub.text);

          if (isHighlight) {
            highlights.push({ ...sub, text: applyAutoFixes(sub.text.trim()) });
          } else if (isNote) {
            notes.push({ ...sub, text: applyAutoFixes(sub.text.trim()) });
          } else {
            const cleanedText = applyAutoFixes(sub.text.trim());
            if (cleanedText) {
              cleanSubs.push({ ...sub, text: cleanedText });
            }
          }
        });

        setAnalysisResult({ 
          highlights, 
          notes, 
          cleanContent: formatSrt(cleanSubs),
          isSrt: true
        });
      } else {
        const lines = textContent.split('\n');
        const cleanLines: string[] = [];
        
        lines.forEach((line, index) => {
          const text = line.trim();
          // Bỏ qua dòng trống để tránh khoảng cách thừa
          if (!text) {
            return;
          }

          const fixedText = applyAutoFixes(text);
          const subStub: Subtitle = { index: index + 1, startTime: '', endTime: '', text: fixedText };
          
          if (highlightRegex.test(text)) {
            highlights.push(subStub);
          } else if (shouldExclude(text)) {
            notes.push(subStub);
          } else {
            cleanLines.push(fixedText);
          }
        });

        setAnalysisResult({
          highlights,
          notes,
          cleanContent: cleanLines.join('\n'),
          isSrt: false
        });
      }
    } catch (err) {
      setError("Đã xảy ra lỗi khi xử lý dữ liệu. Vui lòng kiểm tra lại cấu trúc.");
    }
  };

  const inputLineCount = textContent ? textContent.split('\n').filter(Boolean).length : 0;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-30 bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 text-white flex items-center justify-center shadow-xs shadow-indigo-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                  Script Purifier
                </h1>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/50">
                  <ShieldCheck className="w-3 h-3 mr-0.5" /> Chuẩn TTS
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-none mt-0.5">
                Lọc ghi chú tiếng Việt &amp; mốc thời gian khỏi kịch bản
              </p>
            </div>
          </div>

          {/* Quick External Links */}
          <div className="flex items-center gap-2">
            <a 
              href="https://timecode-gamma.vercel.app/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-all shadow-xs hover:shadow-emerald-500/20 text-xs sm:text-sm font-medium active:scale-95"
            >
              <span>Mở Timecode Gamma</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-90" />
            </a>
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* 2-Column Workstation Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          {/* Left Column: Input Panel */}
          <div className="flex flex-col bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200/90 dark:border-slate-700/80 shadow-sm overflow-hidden">
            {/* Input Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-slate-50/70 dark:bg-slate-900/40 border-b border-slate-200/80 dark:border-slate-700/80">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                <span className="font-semibold text-sm text-slate-800 dark:text-slate-200 tracking-tight">
                  Nội dung gốc (SRT hoặc văn bản thuần)
                </span>
              </div>
              {inputLineCount > 0 && (
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-200/70 dark:bg-slate-700/70 text-slate-600 dark:text-slate-300">
                  {inputLineCount} dòng
                </span>
              )}
            </div>

            {/* Input Textarea Area */}
            <div className="p-3 flex-1 flex flex-col min-h-[380px] sm:min-h-[460px]">
              <textarea
                value={textContent}
                onChange={(e) => {
                  setTextContent(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Dán nội dung phụ đề .SRT hoặc kịch bản văn bản tại đây..."
                className="w-full flex-1 p-3.5 bg-slate-50/60 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-700/60 rounded-xl font-mono text-xs sm:text-sm leading-relaxed text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-400 transition-all resize-none"
              />

              {/* Error Message */}
              {error && (
                <div className="mt-2.5 px-3 py-2 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 flex items-center gap-2 text-rose-700 dark:text-rose-300 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Action Buttons Toolbar */}
              <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={analyzeFile}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 rounded-xl font-semibold text-xs sm:text-sm shadow-sm transition-all active:scale-[0.99] cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-indigo-400 dark:text-indigo-600" />
                  <span>Lọc nội dung</span>
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700/70 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl font-medium text-xs sm:text-sm transition-colors cursor-pointer"
                  title="Xóa trắng nội dung"
                >
                  <Trash2 className="w-4 h-4 text-slate-500" />
                  <span>Xóa</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Cleaned Result Panel */}
          <div className="flex flex-col">
            <ResultDisplay
              content={analysisResult ? analysisResult.cleanContent : ''}
              label="Kết quả sạch"
              placeholder="Kết quả sau khi lọc sẽ hiển thị tại đây."
              isSrt={analysisResult?.isSrt}
            />
          </div>
        </div>

        {/* Bottom Details: Highlights & Filtered Notes (if any) */}
        {analysisResult && (analysisResult.highlights.length > 0 || analysisResult.notes.length > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* Highlights */}
            {analysisResult.highlights.length > 0 && (
              <div className="bg-white dark:bg-slate-800/90 rounded-2xl border border-amber-200/80 dark:border-amber-900/60 p-4 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-amber-500 ring-4 ring-amber-500/10"></div>
                    <h2 className="text-sm font-semibold text-amber-900 dark:text-amber-200">
                      Đoạn nổi bật
                    </h2>
                  </div>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                    {analysisResult.highlights.length} đoạn
                  </span>
                </div>

                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {analysisResult.highlights.map((h, i) => (
                    <div 
                      key={i} 
                      className="p-2.5 bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-800/40 rounded-xl text-xs font-mono text-slate-800 dark:text-slate-200"
                    >
                      {h.startTime && (
                        <div className="text-[11px] text-amber-700 dark:text-amber-400 font-sans mb-1">
                          {h.startTime} ➔ {h.endTime}
                        </div>
                      )}
                      <div>{h.text}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Filtered Notes */}
            {analysisResult.notes.length > 0 && (
              <div className="bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 p-4 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-rose-500 ring-4 ring-rose-500/10"></div>
                    <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                      Ghi chú đã loại bỏ (bài học, kết tội...)
                    </h2>
                  </div>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300">
                    {analysisResult.notes.length} câu
                  </span>
                </div>

                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {analysisResult.notes.map((n, i) => (
                    <div 
                      key={i} 
                      className="p-2.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 rounded-xl text-xs font-mono line-through text-slate-400 dark:text-slate-500"
                    >
                      {n.startTime && (
                        <div className="text-[11px] text-slate-400 font-sans mb-1 no-underline">
                          {n.startTime} ➔ {n.endTime}
                        </div>
                      )}
                      <div>{n.text}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="py-4 text-center border-t border-slate-200/60 dark:border-slate-800/60 text-xs text-slate-400 dark:text-slate-500">
        Script Purifier • Tự động chuẩn hóa TTS &amp; lọc ghi chú kịch bản
      </footer>
    </div>
  );
}
