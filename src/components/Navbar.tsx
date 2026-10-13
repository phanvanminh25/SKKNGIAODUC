import React from 'react';
import {
  BookOpen,
  FileDown,
  Printer,
  Sparkles,
  Bot,
  Save,
  CheckCircle2,
  FolderOpen,
  PlusCircle,
  HelpCircle,
} from 'lucide-react';
import { SKKNProject } from '../types/skkn';

interface NavbarProps {
  project: SKKNProject;
  onNewProject: () => void;
  onExportDocx: () => void;
  onPrintPreview: () => void;
  onOpenConsultant: () => void;
  onOpenHelp: () => void;
  lastSavedAt: Date | null;
  activeStep: number;
  setActiveStep: (step: number) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  project,
  onNewProject,
  onExportDocx,
  onPrintPreview,
  onOpenConsultant,
  onOpenHelp,
  lastSavedAt,
  activeStep,
  setActiveStep,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-100">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg text-slate-900 tracking-tight">EduSKKN AI</span>
                <span className="px-2 py-0.5 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full">
                  Chuẩn Bộ GD&ĐT
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block truncate max-w-sm">
                Trợ lý viết & chuẩn hóa Sáng kiến kinh nghiệm sư phạm
              </p>
            </div>
          </div>

          {/* Center: Save status */}
          <div className="hidden md:flex items-center text-xs text-slate-500 bg-slate-100/80 px-3 py-1.5 rounded-full border border-slate-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mr-1.5" />
            <span>
              Tự động lưu: {lastSavedAt ? lastSavedAt.toLocaleTimeString('vi-VN') : 'Đã đồng bộ'}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              onClick={onNewProject}
              className="inline-flex items-center px-3 py-1.5 text-xs sm:text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              title="Tạo đề tài mới hoặc chọn mẫu"
            >
              <PlusCircle className="w-4 h-4 mr-1 text-slate-600" />
              <span className="hidden sm:inline">Tạo mới</span>
            </button>

            <button
              onClick={onOpenConsultant}
              className="inline-flex items-center px-3 py-1.5 text-xs sm:text-sm font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors"
              title="Trò chuyện với Cố vấn Sư phạm AI"
            >
              <Bot className="w-4 h-4 mr-1.5 text-indigo-600 animate-pulse" />
              <span>Cố vấn AI</span>
            </button>

            <button
              onClick={() => setActiveStep(6)}
              className="inline-flex items-center px-3 py-1.5 text-xs sm:text-sm font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg transition-colors"
              title="Xem văn bản định dạng A4"
            >
              <Printer className="w-4 h-4 mr-1 text-slate-600" />
              <span className="hidden sm:inline">Xem A4 / In</span>
            </button>

            <button
              onClick={onExportDocx}
              className="inline-flex items-center px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-sm shadow-blue-200 transition-all active:scale-95"
              title="Xuất file Word chuẩn Nghị định 30/2020/NĐ-CP"
            >
              <FileDown className="w-4 h-4 mr-1.5" />
              <span>Xuất Word (.docx)</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
