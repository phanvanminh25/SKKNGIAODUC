import React from 'react';
import {
  Lightbulb,
  Sliders,
  FileEdit,
  BarChart3,
  ShieldCheck,
  FileCheck2,
  ChevronRight,
} from 'lucide-react';

interface StepNavigationProps {
  currentStep: number;
  onSelectStep: (step: number) => void;
}

export const STEPS = [
  {
    id: 1,
    title: 'Ý tưởng & Đề tài',
    subtitle: 'Gợi ý tên chuẩn GDPT 2018',
    icon: Lightbulb,
  },
  {
    id: 2,
    title: 'Thiết lập & Quy chuẩn',
    subtitle: 'Cấp học & Căn lề NĐ 30',
    icon: Sliders,
  },
  {
    id: 3,
    title: 'Soạn thảo 5 Phần',
    subtitle: 'Trợ lý viết & mở rộng ý',
    icon: FileEdit,
  },
  {
    id: 4,
    title: 'Số liệu & Minh chứng',
    subtitle: 'Bảng đối chứng & Biểu đồ',
    icon: BarChart3,
  },
  {
    id: 5,
    title: 'Kiểm duyệt & Tính mới',
    subtitle: 'Quét trùng lặp & Chính tả',
    icon: ShieldCheck,
  },
  {
    id: 6,
    title: 'Xem trước & Xuất Word',
    subtitle: 'Khung A4 & Xuất .docx',
    icon: FileCheck2,
  },
];

export const StepNavigation: React.FC<StepNavigationProps> = ({
  currentStep,
  onSelectStep,
}) => {
  return (
    <div className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <nav aria-label="Tiến trình làm việc" className="overflow-x-auto scrollbar-none">
          <ol className="flex items-center min-w-max space-x-2 sm:space-x-4">
            {STEPS.map((step, idx) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isPast = currentStep > step.id;

              return (
                <li key={step.id} className="flex items-center">
                  <button
                    onClick={() => onSelectStep(step.id)}
                    className={`group flex items-center px-3 py-2 rounded-xl text-left transition-all ${
                      isActive
                        ? 'bg-blue-50 text-blue-800 border border-blue-200 shadow-xs'
                        : isPast
                        ? 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                        : 'text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center mr-2.5 transition-colors text-sm font-semibold ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-xs'
                          : isPast
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'
                      }`}
                    >
                      {isPast ? '✓' : <Icon className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="flex items-center space-x-1">
                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                          Bước {step.id}
                        </span>
                      </div>
                      <div
                        className={`text-xs sm:text-sm font-medium leading-snug ${
                          isActive ? 'text-blue-900 font-bold' : 'text-slate-800'
                        }`}
                      >
                        {step.title}
                      </div>
                    </div>
                  </button>

                  {idx < STEPS.length - 1 && (
                    <ChevronRight className="w-4 h-4 text-slate-300 mx-1 flex-shrink-0" />
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
      </div>
    </div>
  );
};
