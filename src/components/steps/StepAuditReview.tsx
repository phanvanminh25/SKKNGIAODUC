import React, { useState } from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle,
  FileSearch,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Scale,
  SpellCheck,
  Check,
} from 'lucide-react';
import { SKKNProject, PlagiarismReport, AuditReport } from '../../types/skkn';
import { checkPlagiarismAndNoveltyAI, proofreadSKKNAI } from '../../services/aiService';

interface StepAuditReviewProps {
  project: SKKNProject;
  onUpdatePlagiarismReport: (report: PlagiarismReport) => void;
  onUpdateAuditReport: (report: AuditReport) => void;
  onNextStep: () => void;
  onPrevStep: () => void;
}

export const StepAuditReview: React.FC<StepAuditReviewProps> = ({
  project,
  onUpdatePlagiarismReport,
  onUpdateAuditReport,
  onNextStep,
  onPrevStep,
}) => {
  const [isScanningPlagiarism, setIsScanningPlagiarism] = useState(false);
  const [isProofreading, setIsProofreading] = useState(false);

  const plagiarism = project.plagiarismReport;
  const audit = project.auditReport;

  // Aggregate text for auditing
  const fullContent = project.sections.map((s) => `${s.title}\n${s.content}`).join('\n\n');

  const handleScanPlagiarism = async () => {
    setIsScanningPlagiarism(true);
    try {
      const res = await checkPlagiarismAndNoveltyAI({
        title: project.metadata.title,
        content: fullContent,
      });
      onUpdatePlagiarismReport(res);
    } catch (e) {
      console.error(e);
    } finally {
      setIsScanningPlagiarism(false);
    }
  };

  const handleProofread = async () => {
    setIsProofreading(true);
    try {
      const res = await proofreadSKKNAI(fullContent);
      onUpdateAuditReport(res);
    } catch (e) {
      console.error(e);
    } finally {
      setIsProofreading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto py-6">
      {/* Title Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <h2 className="text-xl font-bold text-slate-900 flex items-center">
          <ShieldCheck className="w-5 h-5 mr-2 text-blue-700" />
          Kiểm Duyệt Tính Mới, Chống Trùng Lặp & Soát Lỗi Sư Phạm
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Hội đồng chấm sáng kiến các cấp đặc biệt khắt khe về tính mới và quy chuẩn văn phong pháp
          lý. Hệ thống hỗ trợ giáo viên tự thẩm định trước khi nộp để đạt tỷ lệ công nhận cao nhất.
        </p>
      </div>

      {/* 1. Plagiarism & Novelty Audit */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-slate-50/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Scale className="w-4 h-4 text-indigo-600" />
            <h3 className="text-base font-bold text-slate-900">
              1. Thẩm định Tính Mới & Nguy cơ Trùng lặp ý tưởng
            </h3>
          </div>

          <button
            onClick={handleScanPlagiarism}
            disabled={isScanningPlagiarism}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors"
          >
            {isScanningPlagiarism ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin mr-1.5" />
                Đang đối soát kho dữ liệu SKKN...
              </>
            ) : (
              <>
                <FileSearch className="w-3.5 h-3.5 mr-1.5" />
                Quét Thẩm Định Tính Mới
              </>
            )}
          </button>
        </div>

        <div className="p-6 space-y-6">
          {plagiarism ? (
            <div className="space-y-6">
              {/* Score header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 gap-4">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-blue-800 uppercase tracking-wider">
                    Điểm đánh giá tính sáng tạo & độc bản:
                  </span>
                  <div className="text-2xl sm:text-3xl font-extrabold text-blue-900">
                    {plagiarism.noveltyScore} / 100 điểm
                  </div>
                  <div className="text-xs font-semibold text-emerald-700 flex items-center">
                    <CheckCircle className="w-3.5 h-3.5 mr-1" />
                    Xếp loại: {plagiarism.noveltyLevel}
                  </div>
                </div>

                <div className="text-xs text-slate-500 bg-white/80 p-3 rounded-xl border border-blue-100 max-w-sm">
                  💡 Điểm tính mới &gt; 80 đạt yêu cầu công nhận cấp cơ sở (trường/huyện); &gt; 90 đủ
                  điều kiện đề nghị xét tặng cấp tỉnh/thành phố.
                </div>
              </div>

              {/* Analysis points */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Unique Strengths */}
                <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 space-y-3">
                  <h4 className="text-sm font-bold text-emerald-900 flex items-center">
                    <CheckCircle className="w-4 h-4 text-emerald-600 mr-1.5" />
                    Điểm mới nổi bật của sáng kiến:
                  </h4>
                  <ul className="text-xs text-emerald-950 space-y-2 list-disc list-inside">
                    {plagiarism.uniqueStrengths.map((s, idx) => (
                      <li key={idx} className="leading-relaxed">
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Duplicate Risk Areas */}
                <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-3">
                  <h4 className="text-sm font-bold text-amber-900 flex items-center">
                    <AlertTriangle className="w-4 h-4 text-amber-600 mr-1.5" />
                    Khu vực có nguy cơ trùng lặp ý tưởng:
                  </h4>
                  <ul className="text-xs text-amber-950 space-y-2 list-disc list-inside">
                    {plagiarism.duplicateRiskAreas.map((r, idx) => (
                      <li key={idx} className="leading-relaxed">
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Suggestions to maximize score */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center">
                  <Sparkles className="w-4 h-4 text-blue-600 mr-1.5" />
                  Khuyến nghị để tối ưu hóa điểm số và bản quyền tác giả:
                </h4>
                <div className="space-y-2 text-xs text-slate-700">
                  {plagiarism.improvementSuggestions.map((sug, idx) => (
                    <div key={idx} className="flex items-start space-x-2">
                      <span className="font-bold text-blue-700 flex-shrink-0">•</span>
                      <span>{sug}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 space-y-3 text-slate-500">
              <Scale className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-sm">Chưa thực hiện kiểm tra tính mới.</p>
              <button
                onClick={handleScanPlagiarism}
                className="px-4 py-2 bg-indigo-50 text-indigo-700 font-semibold text-xs rounded-xl hover:bg-indigo-100"
              >
                Bắt đầu thẩm định ngay
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 2. Spell, Terminology & Legal Reference Audit */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-slate-50/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <SpellCheck className="w-4 h-4 text-blue-700" />
            <h3 className="text-base font-bold text-slate-900">
              2. Soát Lỗi Chính Tả, Thuật Ngữ & Căn Cứ Pháp Lý Giáo Dục
            </h3>
          </div>

          <button
            onClick={handleProofread}
            disabled={isProofreading}
            className="inline-flex items-center px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors"
          >
            {isProofreading ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin mr-1.5" />
                Đang rà soát văn bản...
              </>
            ) : (
              <>
                <SpellCheck className="w-3.5 h-3.5 mr-1.5" />
                Soát Lỗi Văn Bản & Thuật Ngữ
              </>
            )}
          </button>
        </div>

        <div className="p-6 space-y-5">
          {audit ? (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs text-slate-700">
                <span className="font-semibold">{audit.summary}</span>
                <span className="font-bold text-blue-700">
                  Phát hiện: {audit.totalIssues} điểm cần lưu ý
                </span>
              </div>

              {audit.issues && audit.issues.length > 0 ? (
                <div className="space-y-3">
                  {audit.issues.map((issue, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl border border-slate-200 bg-white space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md">
                          {issue.type === 'thuat_ngu'
                            ? 'Thuật ngữ sư phạm'
                            : issue.type === 'can_cu_phap_ly'
                            ? 'Căn cứ pháp lý'
                            : 'Lỗi chính tả'}
                        </span>
                        <span className="text-slate-400">Đề xuất chỉnh sửa</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                        <div className="p-2.5 bg-rose-50/50 rounded-lg border border-rose-100">
                          <span className="font-bold text-rose-800">Đoạn gốc: </span>
                          <span className="text-slate-800">"{issue.original}"</span>
                        </div>
                        <div className="p-2.5 bg-emerald-50/50 rounded-lg border border-emerald-100">
                          <span className="font-bold text-emerald-800">Gợi ý sửa: </span>
                          <span className="text-slate-900 font-semibold">"{issue.suggestion}"</span>
                        </div>
                      </div>

                      <p className="text-[11px] text-slate-500 italic pt-1">
                        💡 Lý do: {issue.explanation}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center text-xs text-emerald-700 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>
                    Tuyệt vời! Không phát hiện lỗi chính tả hoặc sai lệch thuật ngữ nghiêm trọng nào.
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 space-y-3 text-slate-500">
              <SpellCheck className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-sm">Chưa thực hiện soát lỗi văn bản.</p>
              <button
                onClick={handleProofread}
                className="px-4 py-2 bg-blue-50 text-blue-700 font-semibold text-xs rounded-xl hover:bg-blue-100"
              >
                Bắt đầu soát lỗi ngay
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between pt-4">
        <button
          onClick={onPrevStep}
          className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-medium text-sm hover:bg-slate-50"
        >
          Quay lại Bước 4
        </button>

        <button
          onClick={onNextStep}
          className="inline-flex items-center px-6 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-semibold text-sm shadow-sm transition-all"
        >
          <span>Sang Bước 6: Xem Trước & Xuất Word</span>
          <ArrowRight className="w-4 h-4 ml-2" />
        </button>
      </div>
    </div>
  );
};
