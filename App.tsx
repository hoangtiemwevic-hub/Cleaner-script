
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
                <div className="flex gap-2">
                    <a 
                        href="https://www.minimax.io/audio/text-to-speech" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center px-4 py-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-all shadow-md text-sm font-bold active:scale-95"
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
        return text.replace(/911/g, '9 1 1');
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
            const removalKeywordsRegex = /^(Intro|Case \d+|Link vid|kết tội|đọc comment|bài học|câu nối|Outro)$/i;
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
                        highlights.push({ ...sub, text: applyAutoFixes(sub.text) });
                    } else if (isNote) {
                        notes.push({ ...sub, text: applyAutoFixes(sub.text) });
                    } else {
                        cleanSubs.push({ ...sub, text: applyAutoFixes(sub.text) });
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
                    if (!text) {
                        cleanLines.push(line);
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
                    cleanContent: cleanLines.join('\n').replace(/\n{3,}/g, '\n\n').trim(),
                    isSrt: false
                });
            }

        } catch (e) {
            setError("Lỗi khi phân tích nội dung.");
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-sans">
            <header className="bg-white dark:bg-slate-800 shadow-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center">
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-500 to-indigo-600">
                            Script Purifier
                        </span>
                    </div>
                </div>
            </header>

            <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Làm Sạch Kịch Bản</h1>
                    <p className="mt-2 text-slate-500 dark:text-slate-400">Tự động loại bỏ Timecodes, Ghi chú và tự động sửa các lỗi đọc số (911 → 9 1 1).</p>
                </div>

                <div className="flex flex-col gap-6">
                    <div className="p-6 bg-slate-100 dark:bg-slate-800/50 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
                        <TextAreaInput 
                            label="Nhập kịch bản hoặc file SRT cần xử lý" 
                            placeholder="Dán nội dung SRT hoặc văn bản thô vào đây để làm sạch..."
                            value={textContent}
                            onChange={setTextContent}
                        />
                        <div className="mt-4 flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={analyzeFile}
                                className="flex-grow flex items-center justify-center px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-all active:scale-[0.98]"
                            >
                                <FilterIcon /> Phân Tích & Làm Sạch
                            </button>
                            <button
                                onClick={handleReset}
                                className="flex items-center justify-center px-6 py-3 bg-slate-300 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold rounded-lg shadow-sm hover:bg-slate-400 dark:hover:bg-slate-600 transition-all active:scale-[0.98]"
                                title="Xóa tất cả nội dung"
                            >
                                <TrashIcon /> Làm mới
                            </button>
                        </div>
                        {error && <div className="mt-4 p-4 bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 rounded-lg border border-red-200 dark:border-red-800">{error}</div>}
                    </div>

                    {analysisResult && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
                            <div className="flex flex-col gap-6">
                                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/50 rounded-lg">
                                    <h3 className="font-bold text-amber-800 dark:text-amber-200 mb-3 flex items-center text-sm">
                                        <span className="mr-2">⚠️</span> Highlight Cases ({analysisResult.highlights.length})
                                    </h3>
                                    <div className="max-h-60 overflow-y-auto pr-2 space-y-2 scrollbar-thin scrollbar-thumb-amber-200 dark:scrollbar-thumb-amber-800">
                                        {analysisResult.highlights.length === 0 ? <p className="text-sm italic text-slate-500">Không tìm thấy.</p> : 
                                            analysisResult.highlights.map((h, i) => (
                                                <div key={i} className="text-sm bg-white dark:bg-slate-800 p-2 rounded border border-amber-100 dark:border-amber-800/50">
                                                    {analysisResult.isSrt && <span className="font-mono text-xs text-slate-400 block">{h.startTime} - {h.endTime}</span>}
                                                    <span className="text-slate-700 dark:text-slate-300">{h.text}</span>
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>

                                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700/50 rounded-lg">
                                    <h3 className="font-bold text-purple-800 dark:text-purple-200 mb-3 flex items-center text-sm">
                                        <span className="mr-2">📝</span> Thành phần đã lọc ({analysisResult.notes.length})
                                    </h3>
                                    <p className="text-[10px] text-purple-600 dark:text-purple-400 mb-2 italic">*Đã loại: Ghi chú, Timecodes, Intro/Outro, Case/Link và Tiếng Việt.</p>
                                    <div className="max-h-80 overflow-y-auto pr-2 space-y-2 scrollbar-thin scrollbar-thumb-purple-200 dark:scrollbar-thumb-purple-800">
                                        {analysisResult.notes.length === 0 ? <p className="text-sm italic text-slate-500">Không tìm thấy.</p> : 
                                            analysisResult.notes.map((n, i) => (
                                                <div key={i} className="text-sm bg-white dark:bg-slate-800 p-2 rounded border border-purple-100 dark:border-purple-800/50">
                                                    {analysisResult.isSrt && <span className="font-mono text-xs text-slate-400 block">{n.startTime} - {n.endTime}</span>}
                                                    <span className="text-slate-700 dark:text-slate-300">{n.text}</span>
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                            </div>
                            
                            <div className="p-6 bg-slate-100 dark:bg-slate-800/50 rounded-lg shadow-sm flex flex-col border border-slate-200 dark:border-slate-700">
                                <ResultDisplay 
                                    content={analysisResult.cleanContent} 
                                    label="Dữ liệu sạch (Sẵn sàng sử dụng)" 
                                />
                            </div>
                        </div>
                    )}
                </div>
            </main>

            <footer className="text-center py-6 text-sm text-slate-400 dark:text-slate-500 border-t border-slate-200 dark:border-slate-800 mt-auto">
                <p>Script Purifier - Công cụ tối ưu hóa kịch bản.</p>
            </footer>
        </div>
    );
}
