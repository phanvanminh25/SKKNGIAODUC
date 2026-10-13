import React, { useRef } from 'react';
import {
  X,
  Sparkles,
  BookOpen,
  Baby,
  GraduationCap,
  School,
  Building2,
  FilePlus,
  Upload,
} from 'lucide-react';
import { GradeLevel, SKKNProject } from '../types/skkn';
import { getSectionsTemplateByGrade, INITIAL_SKKN_PROJECT } from '../data/templates';

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectNew: (project: SKKNProject) => void;
}

export const NewProjectModal: React.FC<NewProjectModalProps> = ({
  isOpen,
  onClose,
  onSelectNew,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const templates: {
    level: GradeLevel;
    name: string;
    description: string;
    icon: any;
    defaultSubject: string;
    defaultGrade: string;
    sampleTitle: string;
  }[] = [
    {
      level: 'mam_non',
      name: 'Giáo dục Mầm non',
      description: 'Chăm sóc nuôi dưỡng, phát triển thể chất, ngôn ngữ, trò chơi dân gian (TT 51/2020)',
      icon: Baby,
      defaultSubject: 'Phát triển nhận thức & ngôn ngữ',
      defaultGrade: 'Mẫu giáo 4 - 5 tuổi',
      sampleTitle:
        'Một số biện pháp rèn luyện kỹ năng tự phục vụ và thói quen vệ sinh cho trẻ 4-5 tuổi thông qua trò chơi tương tác',
    },
    {
      level: 'tieu_hoc',
      name: 'Giáo dục Tiểu học',
      description: 'Chương trình GDPT 2018 lớp 1-5, Đổi mới đánh giá theo Thông tư 27/2020',
      icon: BookOpen,
      defaultSubject: 'Toán & Tiếng Việt',
      defaultGrade: 'Lớp 3',
      sampleTitle:
        'Một số giải pháp phát triển năng lực giải toán có lời văn cho học sinh lớp 3 thông qua sơ đồ tư duy và đồ dùng trực quan',
    },
    {
      level: 'thcs',
      name: 'Giáo dục THCS',
      description: 'Dạy học tích cực, STEM, Đánh giá xếp loại theo Thông tư 22/2021',
      icon: School,
      defaultSubject: 'Khoa học tự nhiên',
      defaultGrade: 'Lớp 8',
      sampleTitle:
        'Một số biện pháp đổi mới phương pháp dạy học phát triển năng lực tự học cho học sinh thông qua ứng dụng công nghệ số và dạy học dự án',
    },
    {
      level: 'thpt',
      name: 'Giáo dục THPT',
      description: 'Chuyên đề học tập, định hướng nghề nghiệp, ôn thi tốt nghiệp, nghiên cứu khoa học',
      icon: GraduationCap,
      defaultSubject: 'Vật lý / Hóa học',
      defaultGrade: 'Lớp 11',
      sampleTitle:
        'Ứng dụng mô hình Lớp học đảo ngược kết hợp học tập qua dự án nhằm nâng cao năng lực thực hành cho học sinh lớp 11',
    },
    {
      level: 'quan_ly',
      name: 'Quản lý Giáo dục',
      description: 'Quản trị nhà trường, sinh hoạt chuyên môn nghiên cứu bài học, chuyển đổi số',
      icon: Building2,
      defaultSubject: 'Quản lý giáo dục',
      defaultGrade: 'Toàn trường',
      sampleTitle:
        'Giải pháp nâng cao chất lượng sinh hoạt tổ chuyên môn theo nghiên cứu bài học và chuyển đổi số trong quản lý',
    },
  ];

  const handleSelectTemplate = (t: (typeof templates)[0]) => {
    const newProj: SKKNProject = {
      ...INITIAL_SKKN_PROJECT,
      id: `skkn-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      gradeLevel: t.level,
      metadata: {
        ...INITIAL_SKKN_PROJECT.metadata,
        title: t.sampleTitle,
        subject: t.defaultSubject,
        grade: t.defaultGrade,
      },
      sections: getSectionsTemplateByGrade(t.level),
    };
    onSelectNew(newProj);
    onClose();
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed && parsed.metadata && parsed.sections) {
          onSelectNew(parsed);
          onClose();
        } else {
          alert('Tệp sao lưu không đúng định dạng SKKN.');
        }
      } catch (err) {
        alert('Không thể đọc file JSON.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-6 animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-2">
            <FilePlus className="w-5 h-5 text-blue-700" />
            <h3 className="font-bold text-lg text-slate-900">Tạo Bản Thảo Sáng Kiến Mới</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs sm:text-sm text-slate-600">
          Chọn cấp học để khởi tạo bộ khung cấu trúc 5 phần chuẩn theo quy định hiện hành của Bộ
          Giáo dục và Đào tạo:
        </p>

        {/* Template Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {templates.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.level}
                onClick={() => handleSelectTemplate(t)}
                className="p-4 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 text-left transition-all group flex flex-col justify-between"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center space-x-2">
                    <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-sm text-slate-900 group-hover:text-blue-900">
                      {t.name}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-2">{t.description}</p>
                </div>
                <div className="pt-3 text-[11px] text-blue-700 font-semibold flex items-center">
                  Khởi tạo mẫu này →
                </div>
              </button>
            );
          })}
        </div>

        {/* Import JSON button */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImportJson}
            accept=".json"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center text-xs font-semibold text-slate-600 hover:text-slate-900 p-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <Upload className="w-4 h-4 mr-1.5 text-slate-500" />
            Nhập từ file sao lưu (.json)
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
          >
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
};
