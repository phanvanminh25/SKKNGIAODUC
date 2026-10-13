import React, { useState } from 'react';
import {
  Sparkles,
  FileText,
  Wand2,
  ListTree,
  Languages,
  Cpu,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { SKKNProject, SKKNSection } from '../../types/skkn';
import {
  generateOutlineAI,
  expandSectionAI,
  transformToneAI,
  suggestModernMethodsAI,
} from '../../services/aiService';

interface StepContentEditorProps {
  project: SKKNProject;
  onUpdateSection: (sectionId: string, content: string, bulletNotes?: string) => void;
  onNextStep: () => void;
  onPrevStep: () => void;
}

export const StepContentEditor: React.FC<StepContentEditorProps> = ({
  project,
  onUpdateSection,
  onNextStep,
  onPrevStep,
}) => {
  const { sections, metadata, gradeLevel } = project;
  const [selectedSectionId, setSelectedSectionId] = useState<string>(sections[0]?.id || 'sec-1-1');

  // AI action modal / panel states
  const [activeAiTool, setActiveAiTool] = useState<
    'none' | 'outline' | 'expand' | 'tone' | 'modern'
  >('none');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiOutput, setAiOutput] = useState<string>('');
  const [copied, setCopied] = useState(false);

  // Selected section object
  const currentSection = sections.find((s) => s.id === selectedSectionId) || sections[0];

  const handleRunOutline = async () => {
    setActiveAiTool('outline');
    setIsAiLoading(true);
    setAiOutput('');
    try {
      const result = await generateOutlineAI({
        title: metadata.title,
        sectionId: `${currentSection.code} - ${currentSection.title}`,
        gradeLevel: metadata.grade,
        subject: metadata.subject,
      });
      setAiOutput(result);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleRunExpand = async () => {
    if (!currentSection.bulletNotes && !currentSection.content) return;
    setActiveAiTool('expand');
    setIsAiLoading(true);
    setAiOutput('');
    try {
      const notes = currentSection.bulletNotes || currentSection.content;
      const result = await expandSectionAI({
        sectionTitle: currentSection.title,
        rawNotes: notes,
        context: metadata.title,
      });
      setAiOutput(result);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleRunToneTransform = async () => {
    if (!currentSection.content) return;
    setActiveAiTool('tone');
    setIsAiLoading(true);
    setAiOutput('');
    try {
      const result = await transformToneAI(currentSection.content);
      setAiOutput(result);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleRunModernMethods = async () => {
    setActiveAiTool('modern');
    setIsAiLoading(true);
    setAiOutput('');
    try {
      const result = await suggestModernMethodsAI({
        title: metadata.title,
        subject: metadata.subject,
        gradeLevel: metadata.grade,
        currentDraft: currentSection.content,
      });
      setAiOutput(result);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleApplyAiOutput = () => {
    if (!aiOutput) return;
    const newContent = currentSection.content
      ? `${currentSection.content}\n\n${aiOutput}`
      : aiOutput;
    onUpdateSection(currentSection.id, newContent, currentSection.bulletNotes);
    setActiveAiTool('none');
    setAiOutput('');
  };

  const handleReplaceWithAiOutput = () => {
    if (!aiOutput) return;
    onUpdateSection(currentSection.id, aiOutput, currentSection.bulletNotes);
    setActiveAiTool('none');
    setAiOutput('');
  };

  const handleCopyAiOutput = () => {
    navigator.clipboard.writeText(aiOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Group sections by Part
  const parts = ['PHẦN I', 'PHẦN II', 'PHẦN III', 'PHẦN IV', 'PHẦN V'] as const;
  const partTitles: Record<string, string> = {
    'PHẦN I': 'PHẦN I: ĐẶT VẤN ĐỀ',
    'PHẦN II': 'PHẦN II: NỘI DUNG VÀ GIẢI PHÁP THỰC HIỆN',
    'PHẦN III': 'PHẦN III: HIỆU QUẢ CỦA SÁNG KIẾN',
    'PHẦN IV': 'PHẦN IV: BÀI HỌC KINH NGHIỆM',
    'PHẦN V': 'PHẦN V: KẾT LUẬN VÀ KHUYẾN NGHỊ',
  };

  // Word count helper
  const getWordCount = (str: string) => {
    return str ? str.trim().split(/\s+/).filter(Boolean).length : 0;
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto py-4">
      {/* Header bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center">
            <FileText className="w-5 h-5 mr-2 text-blue-700" />
            Soạn Thảo & Chuẩn Hóa 5 Phần Theo Quy Chuẩn Bộ GD&ĐT
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 line-clamp-1">
            Đề tài: <span className="font-semibold text-slate-800">{metadata.title}</span>
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg">
            Tổng cộng: {sections.reduce((acc, s) => acc + getWordCount(s.content), 0)} từ
          </span>
        </div>
      </div>

      {/* Main 2-column workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Table of Contents tree (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden sticky top-20 max-h-[calc(100vh-6rem)] flex flex-col">
          <div className="p-4 border-b border-slate-100 bg-slate-50/80 flex items-center justify-between">
            <span className="font-bold text-sm text-slate-800 flex items-center">
              <ListTree className="w-4 h-4 mr-2 text-blue-700" />
              Cấu trúc mục lục SKKN
            </span>
            <span className="text-xs text-slate-500 font-medium">{sections.length} mục</span>
          </div>

          <div className="p-3 overflow-y-auto space-y-4 divide-y divide-slate-100 flex-1">
            {parts.map((pKey) => {
              const partSecs = sections.filter((s) => s.part === pKey);
              if (partSecs.length === 0) return null;

              return (
                <div key={pKey} className="pt-2 first:pt-0">
                  <div className="text-xs font-bold text-blue-900 uppercase tracking-wider mb-2 px-2">
                    {partTitles[pKey]}
                  </div>
                  <div className="space-y-1">
                    {partSecs.map((sec) => {
                      const isSelected = sec.id === selectedSectionId;
                      const words = getWordCount(sec.content);

                      return (
                        <button
                          key={sec.id}
                          onClick={() => {
                            setSelectedSectionId(sec.id);
                            setActiveAiTool('none');
                          }}
                          className={`w-full text-left p-2.5 rounded-xl text-xs transition-all flex items-start justify-between ${
                            isSelected
                              ? 'bg-blue-50 text-blue-900 font-bold border border-blue-200 shadow-2xs'
                              : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                          }`}
                        >
                          <div className="pr-2">
                            <span className="inline-block font-bold text-blue-700 mr-1.5">
                              {sec.code}
                            </span>
                            <span>{sec.title}</span>
                          </div>
                          <span
                            className={`flex-shrink-0 text-[10px] px-1.5 py-0.5 rounded-md font-semibold ${
                              words > 100
                                ? 'bg-emerald-100 text-emerald-800'
                                : words > 0
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-slate-100 text-slate-400'
                            }`}
                          >
                            {words} từ
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Editor & AI Assistant (8 cols) */}
        <div className="lg:col-span-8 space-y-5">
          {/* Section Info Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-1 text-xs font-bold bg-blue-100 text-blue-800 rounded-lg">
                  {currentSection.code}
                </span>
                <span className="text-xs text-slate-500 font-semibold uppercase">
                  {currentSection.part}
                </span>
              </div>
              <span className="text-xs font-medium text-emerald-600 flex items-center">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Mục bắt buộc theo Bộ GD&ĐT
              </span>
            </div>

            <h3 className="text-lg font-bold text-slate-900 leading-snug">
              {currentSection.title}
            </h3>

            {/* Guidance Tip from pedagogical expert */}
            <div className="bg-amber-50/80 border border-amber-200/80 p-3.5 rounded-xl text-xs text-amber-900 flex items-start space-x-2.5">
              <HelpCircle className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Hướng dẫn trình bày: </span>
                {currentSection.guidanceTip}
              </div>
            </div>

            {/* AI Action Toolbar for this section */}
            <div className="pt-2 border-t border-slate-100">
              <div className="text-xs font-semibold text-slate-600 uppercase mb-2">
                Trợ lý AI đồng hành:
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  onClick={handleRunOutline}
                  disabled={isAiLoading}
                  className="inline-flex items-center justify-center p-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold border border-indigo-200 transition-colors"
                >
                  <ListTree className="w-3.5 h-3.5 mr-1.5 text-indigo-600" />
                  Gợi ý dàn ý
                </button>

                <button
                  onClick={handleRunExpand}
                  disabled={isAiLoading}
                  className="inline-flex items-center justify-center p-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold border border-blue-200 transition-colors"
                  title="Mở rộng ý từ gạch đầu dòng"
                >
                  <Wand2 className="w-3.5 h-3.5 mr-1.5 text-blue-600" />
                  Mở rộng đoạn
                </button>

                <button
                  onClick={handleRunToneTransform}
                  disabled={isAiLoading || !currentSection.content}
                  className="inline-flex items-center justify-center p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold border border-emerald-200 transition-colors"
                  title="Chuyển văn nói thành văn phong sư phạm"
                >
                  <Languages className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
                  Chuẩn hóa sư phạm
                </button>

                <button
                  onClick={handleRunModernMethods}
                  disabled={isAiLoading}
                  className="inline-flex items-center justify-center p-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-semibold border border-purple-200 transition-colors"
                  title="Gợi ý lồng ghép STEM, AI, Chuyển đổi số"
                >
                  <Cpu className="w-3.5 h-3.5 mr-1.5 text-purple-600" />
                  Lồng ghép STEM/AI
                </button>
              </div>
            </div>
          </div>

          {/* AI Output / Co-pilot result display */}
          {activeAiTool !== 'none' && (
            <div className="bg-gradient-to-br from-indigo-50/90 to-blue-50/90 border border-indigo-200 p-5 rounded-2xl shadow-xs space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-indigo-600 animate-pulse" />
                  <span className="font-bold text-sm text-indigo-950">
                    {activeAiTool === 'outline' && 'Gợi ý Dàn ý Chi tiết'}
                    {activeAiTool === 'expand' && 'Mở rộng Đoạn văn Sư phạm'}
                    {activeAiTool === 'tone' && 'Chuyển hóa Ngôn ngữ Sư phạm Chuẩn mực'}
                    {activeAiTool === 'modern' && 'Đề xuất Phương pháp Hiện đại (STEM / AI)'}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleCopyAiOutput}
                    className="p-1.5 text-xs text-indigo-700 hover:bg-white rounded-lg transition-colors flex items-center"
                    title="Sao chép"
                  >
                    {copied ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600 mr-1" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 mr-1" />
                    )}
                    {copied ? 'Đã chép' : 'Sao chép'}
                  </button>

                  <button
                    onClick={() => setActiveAiTool('none')}
                    className="text-xs text-slate-500 hover:text-slate-800 px-2 py-1"
                  >
                    Đóng
                  </button>
                </div>
              </div>

              {isAiLoading ? (
                <div className="py-6 flex flex-col items-center justify-center space-y-3">
                  <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs font-medium text-indigo-800">
                    AI đang phân tích bối cảnh và chắp bút bằng ngôn ngữ sư phạm...
                  </span>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-white/90 rounded-xl border border-indigo-100 text-sm text-slate-800 whitespace-pre-wrap leading-relaxed max-h-72 overflow-y-auto">
                    {aiOutput}
                  </div>

                  <div className="flex flex-wrap gap-2 justify-end">
                    <button
                      onClick={handleApplyAiOutput}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
                    >
                      + Chèn vào cuối nội dung hiện tại
                    </button>
                    <button
                      onClick={handleReplaceWithAiOutput}
                      className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold rounded-xl transition-colors"
                    >
                      Thay thế toàn bộ nội dung mục này
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Teacher's Bullet Notes / Raw Input Box */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-700 uppercase">
                Ghi chép thô / Gạch đầu dòng ý tưởng của bạn:
              </label>
              <span className="text-[11px] text-slate-500">
                Nhập ý thô vào đây rồi bấm "Mở rộng đoạn" ở trên
              </span>
            </div>
            <textarea
              rows={2}
              value={currentSection.bulletNotes || ''}
              onChange={(e) =>
                onUpdateSection(currentSection.id, currentSection.content, e.target.value)
              }
              placeholder="Ví dụ: - Tổ chức cho học sinh làm việc nhóm theo kỹ thuật khăn trải bàn&#10;- Sử dụng phần mềm Kahoot để khởi động 5 phút đầu giờ..."
              className="w-full p-3 text-xs bg-slate-50/70 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* Main Full-Text Rich Area */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-bold text-slate-900">
                Nội dung hoàn chỉnh của mục ({currentSection.code}):
              </label>
              <span className="text-xs text-slate-500 font-medium">
                {getWordCount(currentSection.content)} từ • Font Times New Roman 14pt
              </span>
            </div>

            <textarea
              rows={12}
              value={currentSection.content}
              onChange={(e) =>
                onUpdateSection(currentSection.id, e.target.value, currentSection.bulletNotes)
              }
              placeholder="Nhập nội dung chi tiết của phần này hoặc sử dụng gợi ý AI ở trên..."
              className="w-full p-4 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-600 text-sm leading-relaxed text-slate-900 resize-y font-serif"
              style={{
                fontFamily: project.formatting.font === 'Arial' ? 'Arial, sans-serif' : 'Tinos, Times New Roman, serif',
                lineHeight: project.formatting.lineHeight || 1.4,
              }}
            />
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-4">
            <button
              onClick={onPrevStep}
              className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-medium text-sm hover:bg-slate-50"
            >
              Quay lại Bước 2
            </button>

            <button
              onClick={onNextStep}
              className="inline-flex items-center px-6 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-semibold text-sm shadow-sm transition-all"
            >
              <span>Sang Bước 4: Xử Lý Số Liệu & Minh Chứng</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
