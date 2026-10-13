import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Image as ImageIcon,
  Plus,
  Trash2,
  Sparkles,
  CheckCircle,
  Copy,
  ArrowRight,
  Calculator,
  Upload,
} from 'lucide-react';
import { SKKNProject, SurveyDataset, SurveyMetric, EvidenceItem } from '../../types/skkn';
import { calculateMetrics, generateStatisticalCommentary } from '../../utils/statistics';
import { analyzeSurveyDataAI } from '../../services/aiService';

interface StepDataEvidenceProps {
  project: SKKNProject;
  onUpdateSurveyDataset: (dataset: SurveyDataset) => void;
  onUpdateEvidences: (evidences: EvidenceItem[]) => void;
  onApplyAnalysisToSection: (text: string) => void;
  onNextStep: () => void;
  onPrevStep: () => void;
}

export const StepDataEvidence: React.FC<StepDataEvidenceProps> = ({
  project,
  onUpdateSurveyDataset,
  onUpdateEvidences,
  onApplyAnalysisToSection,
  onNextStep,
  onPrevStep,
}) => {
  const dataset = project.surveyDatasets[0] || {
    id: 'survey-1',
    title: 'Khảo sát chất lượng học tập trước và sau thực nghiệm',
    totalStudents: 42,
    testGroup: 'Lớp 8A (Thực nghiệm - 42 HS)',
    controlGroup: 'Lớp 8B (Đối chứng - 40 HS)',
    scaleType: 'diem_so',
    metrics: [],
    aiAnalysisText: '',
  };

  const [totalStudents, setTotalStudents] = useState<number>(dataset.totalStudents || 42);
  const [metrics, setMetrics] = useState<SurveyMetric[]>(dataset.metrics);
  const [aiAnalysis, setAiAnalysis] = useState<string>(dataset.aiAnalysisText || '');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [copied, setCopied] = useState(false);

  // Evidence modal state
  const [showAddEvidence, setShowAddEvidence] = useState(false);
  const [eviTitle, setEviTitle] = useState('');
  const [eviDesc, setEviDesc] = useState('');
  const [eviCat, setEviCat] = useState<EvidenceItem['category']>('san_pham_hs');
  const [eviUrl, setEviUrl] = useState('');

  // Handle metric count change & auto calculate percentages
  const handleCountChange = (
    metricId: string,
    field: 'preCount' | 'postCount',
    val: number
  ) => {
    const updated = metrics.map((m) => {
      if (m.id === metricId) {
        return {
          ...m,
          [field]: Math.max(0, val),
        };
      }
      return m;
    });

    const calculated = calculateMetrics(updated, totalStudents);
    setMetrics(calculated);
    onUpdateSurveyDataset({
      ...dataset,
      totalStudents,
      metrics: calculated,
    });
  };

  const handleTotalStudentsChange = (newTotal: number) => {
    const total = Math.max(1, newTotal);
    setTotalStudents(total);
    const calculated = calculateMetrics(metrics, total);
    setMetrics(calculated);
    onUpdateSurveyDataset({
      ...dataset,
      totalStudents: total,
      metrics: calculated,
    });
  };

  // Run AI / statistical analysis
  const handleGenerateAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const result = await analyzeSurveyDataAI(
        {
          title: dataset.title,
          totalStudents,
          testGroup: dataset.testGroup,
          metrics,
        },
        project.metadata.title
      );
      setAiAnalysis(result);
      onUpdateSurveyDataset({
        ...dataset,
        metrics,
        aiAnalysisText: result,
      });
    } catch (e) {
      const fallback = generateStatisticalCommentary({
        ...dataset,
        totalStudents,
        metrics,
      });
      setAiAnalysis(fallback);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSyncToSections = () => {
    onApplyAnalysisToSection(aiAnalysis);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Add evidence
  const handleAddEvidence = () => {
    if (!eviTitle.trim()) return;
    const newEvi: EvidenceItem = {
      id: `evi-${Date.now()}`,
      figureNumber: project.evidences.length + 1,
      title: eviTitle.trim(),
      description: eviDesc.trim() || 'Hình ảnh minh chứng thực nghiệm sư phạm tại đơn vị.',
      category: eviCat,
      imageUrl:
        eviUrl.trim() ||
        'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80',
      dateCreated: new Date().toISOString().split('T')[0],
    };
    onUpdateEvidences([...project.evidences, newEvi]);
    setEviTitle('');
    setEviDesc('');
    setEviUrl('');
    setShowAddEvidence(false);
  };

  const handleDeleteEvidence = (id: string) => {
    const updated = project.evidences
      .filter((e) => e.id !== id)
      .map((e, idx) => ({ ...e, figureNumber: idx + 1 }));
    onUpdateEvidences(updated);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto py-6">
      {/* Title Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <h2 className="text-xl font-bold text-slate-900 flex items-center">
          <BarChart3 className="w-5 h-5 mr-2 text-blue-700" />
          Xử Lý Số Liệu Khảo Sát Thực Nghiệm & Quản Lý Minh Chứng
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Số liệu đối chứng trước và sau giải pháp là "linh hồn" chứng minh tính khoa học và giá trị
          thực tiễn của SKKN. Nhập số lượng học sinh, ứng dụng tự động tính phần trăm, độ lệch, vẽ
          biểu đồ và viết đoạn văn phân tích.
        </p>
      </div>

      {/* Survey Data Table & Calculator */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-slate-50/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center">
              <Calculator className="w-4 h-4 mr-2 text-blue-700" />
              1. Bảng số liệu khảo sát đối chứng trước & sau thực nghiệm
            </h3>
            <span className="text-xs text-slate-500">
              Đối tượng: {dataset.testGroup || 'Lớp thực nghiệm'}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <label className="text-xs font-semibold text-slate-700">Tổng số học sinh:</label>
            <input
              type="number"
              min="1"
              value={totalStudents}
              onChange={(e) => handleTotalStudentsChange(parseInt(e.target.value) || 1)}
              className="w-20 px-3 py-1.5 text-xs text-center font-bold bg-white border border-slate-300 rounded-lg"
            />
            <span className="text-xs text-slate-500">em</span>
          </div>
        </div>

        {/* Interactive Data Table */}
        <div className="p-6 overflow-x-auto">
          <table className="w-full text-xs sm:text-sm text-left border-collapse">
            <thead>
              <tr className="bg-slate-100/80 text-slate-700 uppercase font-bold border-b border-slate-200">
                <th className="py-3 px-4">Xếp loại / Tiêu chí đánh giá</th>
                <th className="py-3 px-4 text-center">Trước thực nghiệm (SL)</th>
                <th className="py-3 px-4 text-center">Trước TN (%)</th>
                <th className="py-3 px-4 text-center">Sau thực nghiệm (SL)</th>
                <th className="py-3 px-4 text-center">Sau TN (%)</th>
                <th className="py-3 px-4 text-center">Độ lệch (+/- %)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {metrics.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-semibold text-slate-800">{m.category}</td>
                  <td className="py-3 px-4 text-center">
                    <input
                      type="number"
                      min="0"
                      value={m.preCount}
                      onChange={(e) =>
                        handleCountChange(m.id, 'preCount', parseInt(e.target.value) || 0)
                      }
                      className="w-16 px-2 py-1 text-center bg-white border border-slate-300 rounded-md font-semibold"
                    />
                  </td>
                  <td className="py-3 px-4 text-center font-medium text-slate-600">
                    {m.prePercent}%
                  </td>
                  <td className="py-3 px-4 text-center">
                    <input
                      type="number"
                      min="0"
                      value={m.postCount}
                      onChange={(e) =>
                        handleCountChange(m.id, 'postCount', parseInt(e.target.value) || 0)
                      }
                      className="w-16 px-2 py-1 text-center bg-white border border-slate-300 rounded-md font-semibold"
                    />
                  </td>
                  <td className="py-3 px-4 text-center font-medium text-slate-600">
                    {m.postPercent}%
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full font-bold text-xs ${
                        m.diffPercent > 0
                          ? 'bg-emerald-100 text-emerald-800'
                          : m.diffPercent < 0
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {m.diffPercent > 0 ? `+${m.diffPercent}%` : `${m.diffPercent}%`}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Visual Chart Comparison */}
        <div className="p-6 bg-slate-50/60 border-t border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center">
              <TrendingUp className="w-4 h-4 mr-1.5 text-blue-600" />
              Biểu đồ so sánh trực quan (%)
            </h4>
            <div className="flex items-center space-x-4 text-xs">
              <span className="flex items-center">
                <span className="w-3 h-3 bg-slate-400 rounded-xs mr-1.5" />
                Trước TN
              </span>
              <span className="flex items-center font-bold text-blue-800">
                <span className="w-3 h-3 bg-blue-600 rounded-xs mr-1.5" />
                Sau TN
              </span>
            </div>
          </div>

          <div className="space-y-4">
            {metrics.map((m) => (
              <div key={m.id} className="space-y-1.5">
                <div className="flex justify-between text-xs text-slate-700 font-medium">
                  <span>{m.category}</span>
                  <span>
                    Trước: <strong className="text-slate-600">{m.prePercent}%</strong> ➔ Sau:{' '}
                    <strong className="text-blue-700">{m.postPercent}%</strong>
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-6 rounded-lg overflow-hidden flex flex-col justify-center space-y-0.5 p-0.5">
                  <div
                    className="bg-slate-400 h-2.5 rounded-sm transition-all duration-500"
                    style={{ width: `${Math.min(100, m.prePercent)}%` }}
                    title={`Trước TN: ${m.prePercent}%`}
                  />
                  <div
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2.5 rounded-sm transition-all duration-500"
                    style={{ width: `${Math.min(100, m.postPercent)}%` }}
                    title={`Sau TN: ${m.postPercent}%`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Automatic Commentary & Analysis */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center">
              <Sparkles className="w-4 h-4 mr-2 text-indigo-600" />
              2. Phân tích & Viết nhận xét số liệu tự động
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Tạo lập luận sư phạm sắc bén từ kết quả đối chứng thực nghiệm.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleGenerateAnalysis}
              disabled={isAnalyzing}
              className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors"
            >
              {isAnalyzing ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin mr-1.5" />
                  Đang phân tích...
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                  Tạo nhận xét khoa học
                </>
              )}
            </button>
          </div>
        </div>

        <textarea
          rows={6}
          value={aiAnalysis}
          onChange={(e) => setAiAnalysis(e.target.value)}
          placeholder="Đoạn văn phân tích số liệu sẽ xuất hiện ở đây..."
          className="w-full p-4 rounded-xl border border-slate-300 text-sm leading-relaxed text-slate-800 bg-slate-50/50 focus:outline-hidden focus:ring-2 focus:ring-indigo-600"
        />

        <div className="flex items-center justify-between pt-1">
          <span className="text-xs text-slate-500">
            Có thể chỉnh sửa trực tiếp đoạn văn trên trước khi chèn vào bài viết.
          </span>
          <button
            onClick={handleSyncToSections}
            className="inline-flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors"
          >
            <CheckCircle className="w-3.5 h-3.5 mr-1.5" />
            {copied ? 'Đã đồng bộ vào Mục III.3!' : 'Đồng bộ vào Mục III.3 của SKKN'}
          </button>
        </div>
      </div>

      {/* Evidence & Classroom Artifacts Manager */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center">
              <ImageIcon className="w-4 h-4 mr-2 text-blue-700" />
              3. Quản lý Minh chứng Thực nghiệm ({project.evidences.length})
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Đính kèm ảnh sản phẩm học sinh, ảnh hoạt động lớp, phiếu khảo sát để làm phụ lục.
            </p>
          </div>

          <button
            onClick={() => setShowAddEvidence(!showAddEvidence)}
            className="inline-flex items-center px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-xs rounded-xl transition-colors border border-blue-200"
          >
            <Plus className="w-4 h-4 mr-1" />
            Thêm minh chứng
          </button>
        </div>

        {/* Add Evidence Form */}
        {showAddEvidence && (
          <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Thêm minh chứng mới:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tiêu đề hình ảnh minh chứng:
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Sản phẩm sơ đồ tư duy của nhóm 1"
                  value={eviTitle}
                  onChange={(e) => setEviTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Phân loại minh chứng:
                </label>
                <select
                  value={eviCat}
                  onChange={(e) => setEviCat(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white"
                >
                  <option value="san_pham_hs">Sản phẩm của học sinh</option>
                  <option value="hoat_dong_lop">Hình ảnh hoạt động lớp học</option>
                  <option value="giao_an">Kế hoạch bài dạy / Giáo án minh họa</option>
                  <option value="phieu_khao_sat">Phiếu khảo sát / Đánh giá</option>
                  <option value="khac">Minh chứng khác</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Đường dẫn ảnh (URL) hoặc ảnh mẫu:
                </label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/... (Để trống nếu dùng ảnh mẫu giáo dục)"
                  value={eviUrl}
                  onChange={(e) => setEviUrl(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mô tả chi tiết / Chú thích ảnh:
                </label>
                <input
                  type="text"
                  placeholder="Mô tả hoàn cảnh, lớp học, thời điểm ghi nhận..."
                  value={eviDesc}
                  onChange={(e) => setEviDesc(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setShowAddEvidence(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200 rounded-lg"
              >
                Hủy
              </button>
              <button
                onClick={handleAddEvidence}
                className="px-4 py-1.5 text-xs bg-blue-700 text-white font-semibold rounded-lg hover:bg-blue-800"
              >
                Lưu minh chứng
              </button>
            </div>
          </div>
        )}

        {/* Evidence List Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {project.evidences.map((evi) => (
            <div
              key={evi.id}
              className="p-4 rounded-xl border border-slate-200 bg-white flex flex-col justify-between space-y-3 shadow-2xs"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 text-xs font-bold">
                    Hình {evi.figureNumber}
                  </span>
                  <button
                    onClick={() => handleDeleteEvidence(evi.id)}
                    className="text-slate-400 hover:text-rose-600 p-1"
                    title="Xóa minh chứng"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="aspect-video w-full rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
                  <img
                    src={evi.imageUrl}
                    alt={evi.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as any).src =
                        'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                </div>

                <h4 className="text-sm font-bold text-slate-900 leading-snug">{evi.title}</h4>
                <p className="text-xs text-slate-500 line-clamp-2">{evi.description}</p>
              </div>

              <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-100 flex justify-between">
                <span>Loại: {evi.category}</span>
                <span>Ngày: {evi.dateCreated}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between pt-4">
        <button
          onClick={onPrevStep}
          className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-medium text-sm hover:bg-slate-50"
        >
          Quay lại Bước 3
        </button>

        <button
          onClick={onNextStep}
          className="inline-flex items-center px-6 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-semibold text-sm shadow-sm transition-all"
        >
          <span>Sang Bước 5: Kiểm Duyệt & Tính Mới</span>
          <ArrowRight className="w-4 h-4 ml-2" />
        </button>
      </div>
    </div>
  );
};
