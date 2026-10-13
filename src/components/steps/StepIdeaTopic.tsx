import React, { useState } from 'react';
import {
  Sparkles,
  Lightbulb,
  CheckCircle,
  HelpCircle,
  ArrowRight,
  BookOpen,
  Target,
  Layers,
  Check,
} from 'lucide-react';
import { SKKNProject, GradeLevel } from '../../types/skkn';
import { suggestTopicsAI, TopicSuggestion } from '../../services/aiService';

interface StepIdeaTopicProps {
  project: SKKNProject;
  onUpdateMetadata: (metadata: Partial<SKKNProject['metadata']>) => void;
  onSelectGradeLevel: (level: GradeLevel) => void;
  onNextStep: () => void;
}

export const StepIdeaTopic: React.FC<StepIdeaTopicProps> = ({
  project,
  onUpdateMetadata,
  onSelectGradeLevel,
  onNextStep,
}) => {
  const [subject, setSubject] = useState(project.metadata.subject || 'Khoa học tự nhiên');
  const [grade, setGrade] = useState(project.metadata.grade || 'Lớp 8');
  const [problemStatement, setProblemStatement] = useState(
    'Học sinh còn thụ động trong giờ học, ngại phát biểu và chưa có kỹ năng tự học hiệu quả'
  );
  const [methodFocus, setMethodFocus] = useState(
    'Ứng dụng công nghệ số kết hợp dạy học dự án và trò chơi tương tác'
  );
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<TopicSuggestion[]>([]);
  const [hasGenerated, setHasGenerated] = useState(false);

  const gradeLevelLabels: Record<GradeLevel, string> = {
    mam_non: 'Mầm non',
    tieu_hoc: 'Tiểu học',
    thcs: 'THCS',
    thpt: 'THPT',
    quan_ly: 'Quản lý giáo dục',
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const results = await suggestTopicsAI({
        gradeLevel: `${gradeLevelLabels[project.gradeLevel]} - ${grade}`,
        subject,
        problemStatement,
        methodFocus,
      });
      setSuggestions(results);
      setHasGenerated(true);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectTopic = (suggestion: TopicSuggestion) => {
    onUpdateMetadata({
      title: suggestion.title,
      subject,
      grade,
    });
  };

  const quickProblems = [
    'Học sinh uể oải, thiếu hứng thú trong giờ học Lịch sử - Địa lý',
    'Học sinh lớp 1 còn rụt rè, phát âm chưa chuẩn và chữ viết chưa đều',
    'Học sinh chưa có thói quen tự học và giải quyết bài toán thực tế',
    'Trẻ mầm non 4-5 tuổi thiếu kỹ năng tự phục vụ và kỹ năng giao tiếp',
    'Khai thác thiết bị dạy học số và màn hình tương tác còn hạn chế',
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto py-6">
      {/* Introduction Card */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-indigo-800 rounded-2xl p-6 sm:p-8 text-white shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 text-blue-100 text-xs font-semibold backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 mr-1.5 text-amber-300" />
              Trợ lý AI Đề tài Giáo dục
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Gợi ý Ý Tưởng & Chuẩn Hóa Tên Đề Tài SKKN
            </h1>
            <p className="text-blue-100 text-sm sm:text-base max-w-2xl leading-relaxed">
              Tên đề tài là "bộ mặt" của sáng kiến. Ứng dụng giúp giáo viên xây dựng tên đề tài
              chuẩn ngữ pháp khoa học sư phạm, đúng cú pháp quy định của Bộ GD&ĐT và bám sát
              Chương trình GDPT 2018.
            </p>
          </div>
          <div className="flex-shrink-0 bg-white/10 p-4 rounded-xl border border-white/20 backdrop-blur-xs">
            <div className="text-xs text-blue-200 uppercase font-bold tracking-wider mb-1">
              Cú pháp chuẩn
            </div>
            <div className="text-sm font-medium text-white italic">
              "Một số biện pháp... nhằm... cho học sinh lớp... tại trường..."
            </div>
          </div>
        </div>
      </div>

      {/* Main Generator Form */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-lg font-bold text-slate-900 flex items-center">
            <Target className="w-5 h-5 mr-2 text-blue-700" />
            Nhập thông tin thực tế lớp học của bạn
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            AI sẽ dựa trên bối cảnh cụ thể của lớp bạn để đưa ra các gợi ý có tính thực tiễn cao
            nhất.
          </p>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          {/* Grade Level Selector */}
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-2">
              1. Cấp học / Đối tượng áp dụng:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {(['mam_non', 'tieu_hoc', 'thcs', 'thpt', 'quan_ly'] as GradeLevel[]).map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => onSelectGradeLevel(level)}
                  className={`p-3 rounded-xl border text-center font-medium text-sm transition-all ${
                    project.gradeLevel === level
                      ? 'border-blue-600 bg-blue-50 text-blue-800 ring-2 ring-blue-500/20 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  {gradeLevelLabels[level]}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Subject */}
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-2">
                2. Môn học / Lĩnh vực công tác:
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Ví dụ: Khoa học tự nhiên, Toán, Ngữ văn, Lịch sử, Âm nhạc..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-sm bg-white"
              />
            </div>

            {/* Grade */}
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-2">
                3. Khối lớp / Nhóm lớp cụ thể:
              </label>
              <input
                type="text"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                placeholder="Ví dụ: Lớp 8, Lớp 1, Lớp 10, Khối Mầm 4-5 tuổi..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-sm bg-white"
              />
            </div>
          </div>

          {/* Classroom Problem */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-semibold text-slate-800">
                4. Thực trạng lớp học / Vấn đề cần khắc phục:
              </label>
              <span className="text-xs text-slate-500">Mô tả càng thực tế càng tốt</span>
            </div>
            <textarea
              rows={3}
              value={problemStatement}
              onChange={(e) => setProblemStatement(e.target.value)}
              placeholder="Ví dụ: Học sinh uể oải trong giờ Lịch sử, thiếu liên hệ thực tiễn, nhiều em điểm dưới 5..."
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-sm bg-white resize-y"
            />
            {/* Quick Suggestions */}
            <div className="mt-2 flex flex-wrap gap-2">
              <span className="text-xs text-slate-500 self-center">Gợi ý nhanh:</span>
              {quickProblems.map((prob, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setProblemStatement(prob)}
                  className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-full transition-colors text-left"
                >
                  {prob.slice(0, 42)}...
                </button>
              ))}
            </div>
          </div>

          {/* Method Focus */}
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-2">
              5. Hướng giải pháp / Phương pháp trọng tâm:
            </label>
            <input
              type="text"
              value={methodFocus}
              onChange={(e) => setMethodFocus(e.target.value)}
              placeholder="Ví dụ: Ứng dụng STEM, Canva/Quizizz, Dạy học dự án, Trò chơi dân gian, Sơ đồ tư duy..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-sm bg-white"
            />
          </div>

          {/* Generate Button */}
          <div className="pt-2">
            <button
              onClick={handleGenerate}
              disabled={isLoading || !subject.trim() || !problemStatement.trim()}
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 rounded-xl bg-gradient-to-r from-blue-700 to-indigo-600 text-white font-semibold text-sm hover:from-blue-800 hover:to-indigo-700 shadow-md shadow-blue-200 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Đang phân tích & tạo đề tài chuẩn...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Gợi Ý 4 Tên Đề Tài Chuẩn Sư Phạm
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Suggested Topics List */}
      {suggestions.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 flex items-center">
              <Lightbulb className="w-5 h-5 text-amber-500 mr-2" />
              Danh sách đề tài được đề xuất:
            </h3>
            <span className="text-xs text-slate-500">
              Nhấn "Chọn đề tài này" để áp dụng vào bản thảo
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {suggestions.map((item, idx) => {
              const isSelected = project.metadata.title === item.title;
              return (
                <div
                  key={idx}
                  className={`p-5 rounded-2xl border transition-all ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/20 shadow-sm'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 font-bold text-xs flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <h4 className="text-base font-bold text-slate-900 leading-snug">
                          {item.title}
                        </h4>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-600 bg-white/80 p-3 rounded-xl border border-slate-100">
                        <div>
                          <span className="font-semibold text-slate-800">✨ Điểm mới: </span>
                          {item.novelty}
                        </div>
                        <div>
                          <span className="font-semibold text-slate-800">🎯 Tương thích GDPT 2018: </span>
                          {item.curriculumAlignment}
                        </div>
                      </div>

                      <div className="text-xs text-slate-600">
                        <span className="font-semibold text-slate-800">Các biện pháp chính: </span>
                        {item.keyMethods.join(' • ')}
                      </div>
                    </div>

                    <div className="flex-shrink-0 self-start sm:self-center">
                      <button
                        onClick={() => handleSelectTopic(item)}
                        className={`inline-flex items-center px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                          isSelected
                            ? 'bg-blue-700 text-white shadow-sm'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                        }`}
                      >
                        {isSelected ? (
                          <>
                            <Check className="w-4 h-4 mr-1.5" />
                            Đang chọn
                          </>
                        ) : (
                          'Chọn đề tài này'
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Selected Title Finalization Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-bold text-slate-900">
            Tên đề tài chính thức của bạn:
          </label>
          <span className="text-xs text-emerald-600 font-semibold flex items-center">
            <CheckCircle className="w-3.5 h-3.5 mr-1" />
            Có thể chỉnh sửa trực tiếp bên dưới
          </span>
        </div>

        <textarea
          rows={3}
          value={project.metadata.title}
          onChange={(e) => onUpdateMetadata({ title: e.target.value })}
          className="w-full p-4 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-600 text-base font-bold text-slate-900 bg-slate-50/50"
          placeholder="Nhập hoặc chỉnh sửa tên đề tài của bạn..."
        />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <p className="text-xs text-slate-500">
            Sau khi hoàn tất tên đề tài, chuyển sang Bước 2 để thiết lập đơn vị và quy chuẩn căn lề.
          </p>
          <button
            onClick={onNextStep}
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-semibold text-sm shadow-sm transition-all"
          >
            <span>Sang Bước 2: Thiết Lập Thể Thức</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};
