import React, { useState } from 'react';
import type { Subtitle } from './types';
import { parseSrt, formatSrt } from './utils/srtParser';

// --- Icon Components ---
const CopyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);

const FilterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
  </svg>
);

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const ExternalLinkIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
  </svg>
);

// --- Shared UI Components ---

interface ResultDisplayProps {
  content: string;
  label?: string;
  placeholder?: string;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ 
  content, 
  label = "Kết quả", 
  placeholder = "Kết quả sẽ được hiển thị ở đây."
}) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(content).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    if (!content) {
       return (
         <div className="w-full h-full flex flex-col">
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">{label}</label>
             <div className="w-full h-64 flex items-center justify-center text-center text-slate-500 dark:text-slate-400 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-8">
                <p>{placeholder}</p>
             </div>
         </div>
       );
    }

    return (
        <div className="w-full h-full flex flex-col">
             <div className="flex justify-between items-end mb-2">
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-300">{label}</label>
                <div className="flex flex-wrap gap-2">
                    <a 
                        href="https://timecode-gamma.vercel.app/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md transition-all shadow-md text-xs sm:text-sm font-semibold active:scale-95"
                        title="Chuyển đến Timecode Tool"
                    >
                        <ExternalLinkIcon /> <span>Timecode</span>
                    </a>
                    <a 
                        href="https://www.minimax.io/audio/text-to-speech" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center px-3.5 py-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-all shadow-md text-xs sm:text-sm font-bold active:scale-95"
                    >
                        <ExternalLinkIcon /> <span>Bước tiếp theo</span>
                    </a>
                    <button 
                        onClick={handleCopy}
                        className="flex items-center px-3 py-1 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-md hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors shadow-sm text-xs font-medium"
                    >
                        {copied ? 'Đã sao chép!' : <><CopyIcon /> <span className="ml-1">Sao chép</span></>}
                    </button>
                </div>
             </div>
            <div className="relative flex-grow">
                <pre className="w-full h-96 md:h-[500px] p-4 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg overflow-auto whitespace-pre-wrap break-words font-mono text-sm leading-relaxed scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600">
                    <code>{content}</code>
                </pre>
            </div>
        </div>
    );
};

const TextAreaInput: React.FC<{
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
}> = ({ value, onChange, label, placeholder = "Dán nội dung tại đây..." }) => {
    return (
      <div className="w-full">
        <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">{label}</label>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={12}
          className="w-full p-3 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-shadow font-mono text-sm"
        />
      </div>
    );
};

// --- Main App Component ---

export default function App() {
    const [textContent, setTextContent] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [analysisResult, setAnalysisResult] = useState<{ 
        highlights: Subtitle[], 
        notes: Subtitle[], 
        cleanContent: string,
        isSrt: boolean
    } | null>(null);

    const handleReset = () => {
        setTextContent('');
        setAnalysisResult(null);
        setError('');
    };

    /**
     * Helper to apply automatic fixes like "911" -> "9 1 1"
     */
    const applyAutoFixes = (text: string): string => {
        return text.replace(/\b911\b/g, '9 1 1');
    };

    const analyzeFile = () => {
        if (!textContent.trim()) {
            setError("Vui lòng nhập nội dung cần lọc.");
            return;
        }
        setError('');
        
        try {
            const subtitles = parseSrt(textContent);
            const isSrt = subtitles.length > 0;

            const highlights: Subtitle[] = [];
            const notes: Subtitle[] = [];
            
            const vietnameseRegex = /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i;
            // Cập nhật lọc các từ chỉ dẫn kịch bản như "bài học", "kết tội", "đọc comment", "câu nối", "Intro", "Outro"...
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
                    // Bỏ qua các dòng trống để không tạo khoảng cách thừa
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
            setError("Đã xảy ra lỗi khi xử lý dữ liệu.");
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 p-4 sm:p-6 lg:p-8">
            <div className="max-w-6xl mx-auto space-y-6">
                <header className="flex flex-wrap justify-between items-center gap-3 border-b border-slate-200 dark:border-slate-700 pb-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Script Purifier</h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Lọc ghi chú và mốc thời gian khỏi kịch bản</p>
                    </div>
                    <div>
                        <a 
                            href="https://timecode-gamma.vercel.app/" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md transition-all shadow-sm text-xs sm:text-sm font-medium active:scale-95"
                        >
                            <ExternalLinkIcon /> <span>Mở Timecode Gamma</span>
                        </a>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left: Input */}
                    <div className="space-y-4">
                        <TextAreaInput
                            value={textContent}
                            onChange={setTextContent}
                            label="Nội dung gốc (SRT hoặc văn bản thuần)"
                            placeholder="Dán nội dung SRT hoặc kịch bản văn bản tại đây..."
                        />

                        {error && (
                            <p className="text-sm text-rose-500">{error}</p>
                        )}

                        <div className="flex gap-3">
                            <button
                                onClick={analyzeFile}
                                className="flex-1 flex items-center justify-center px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition-colors font-medium text-sm shadow-sm"
                            >
                                <FilterIcon /> Lọc nội dung
                            </button>
                            <button
                                onClick={handleReset}
                                className="flex items-center justify-center px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-lg transition-colors text-sm font-medium"
                            >
                                <TrashIcon /> Xóa
                            </button>
                        </div>
                    </div>

                    {/* Right: Result */}
                    <div>
                        <ResultDisplay
                            content={analysisResult ? analysisResult.cleanContent : ''}
                            label="Kết quả sạch"
                            placeholder="Kết quả sau khi lọc sẽ hiển thị ở đây."
                        />
                    </div>
                </div>

                {/* Bottom summaries: Highlights & Notes if any */}
                {analysisResult && (analysisResult.highlights.length > 0 || analysisResult.notes.length > 0) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-200 dark:border-slate-700">
                        {analysisResult.highlights.length > 0 && (
                            <div className="space-y-2">
                                <h3 className="text-sm font-semibold text-amber-600 dark:text-amber-400">
                                    Đoạn nổi bật ({analysisResult.highlights.length})
                                </h3>
                                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                                    {analysisResult.highlights.map((h, i) => (
                                        <div key={i} className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded-lg text-xs font-mono">
                                            {h.startTime && <div className="text-slate-400 mb-1">{h.startTime} --&gt; {h.endTime}</div>}
                                            <div>{h.text}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {analysisResult.notes.length > 0 && (
                            <div className="space-y-2">
                                <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                                    Ghi chú đã loại bỏ ({analysisResult.notes.length})
                                </h3>
                                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                                    {analysisResult.notes.map((n, i) => (
                                        <div key={i} className="p-3 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-mono line-through text-slate-500">
                                            {n.startTime && <div className="text-slate-400 mb-1">{n.startTime} --&gt; {n.endTime}</div>}
                                            <div>{n.text}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
