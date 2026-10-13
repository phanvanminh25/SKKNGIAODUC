import React, { useState } from 'react';
import {
  FileText,
  Building,
  User,
  Sliders,
  CheckCircle,
  ArrowRight,
  Plus,
  Trash2,
  BookMarked,
  Info,
} from 'lucide-react';
import { SKKNProject, Abbreviation, ReferenceItem } from '../../types/skkn';

interface StepGeneralInfoProps {
  project: SKKNProject;
  onUpdateMetadata: (metadata: Partial<SKKNProject['metadata']>) => void;
  onUpdateFormatting: (formatting: Partial<SKKNProject['formatting']>) => void;
  onUpdateAbbreviations: (abbreviations: Abbreviation[]) => void;
  onUpdateReferences: (references: ReferenceItem[]) => void;
  onNextStep: () => void;
  onPrevStep: () => void;
}

export const StepGeneralInfo: React.FC<StepGeneralInfoProps> = ({
  project,
  onUpdateMetadata,
  onUpdateFormatting,
  onUpdateAbbreviations,
  onUpdateReferences,
  onNextStep,
  onPrevStep,
}) => {
  const { metadata, formatting, abbreviations, references } = project;

  // New Abbreviation state
  const [newAbbrShort, setNewAbbrShort] = useState('');
  const [newAbbrFull, setNewAbbrFull] = useState('');

  // New Reference state
  const [newRefAuthor, setNewRefAuthor] = useState('');
  const [newRefYear, setNewRefYear] = useState('2024');
  const [newRefTitle, setNewRefTitle] = useState('');
  const [newRefPublisher, setNewRefPublisher] = useState('');

  const handleAddAbbr = () => {
    if (!newAbbrShort.trim() || !newAbbrFull.trim()) return;
    const item: Abbreviation = {
      id: Date.now().toString(),
      short: newAbbrShort.trim(),
      full: newAbbrFull.trim(),
    };
    onUpdateAbbreviations([...abbreviations, item]);
    setNewAbbrShort('');
    setNewAbbrFull('');
  };

  const handleDeleteAbbr = (id: string) => {
    onUpdateAbbreviations(abbreviations.filter((a) => a.id !== id));
  };

  const handleAddRef = () => {
    if (!newRefAuthor.trim() || !newRefTitle.trim()) return;
    const item: ReferenceItem = {
      id: `ref-${Date.now()}`,
      author: newRefAuthor.trim(),
      year: newRefYear.trim(),
      title: newRefTitle.trim(),
      publisher: newRefPublisher.trim() || 'NXB Giáo dục',
      type: 'sach',
    };
    onUpdateReferences([...references, item]);
    setNewRefAuthor('');
    setNewRefTitle('');
    setNewRefPublisher('');
  };

  const handleDeleteRef = (id: string) => {
    onUpdateReferences(references.filter((r) => r.id !== id));
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto py-6">
      {/* Title Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <h2 className="text-xl font-bold text-slate-900 flex items-center">
          <Sliders className="w-5 h-5 mr-2 text-blue-700" />
          Thông Tin Tác Giả & Quy Chuẩn Thể Thức Văn Bản
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Thiết lập tự động căn lề theo Nghị định 30/2020/NĐ-CP của Chính phủ về công tác văn thư và
          thông tin in ấn trên trang bìa.
        </p>
      </div>

      {/* Author & School Administrative Information */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 flex items-center">
            <Building className="w-4 h-4 mr-2 text-blue-700" />
            1. Cơ quan chủ quản & Thông tin tác giả
          </h3>
          <span className="text-xs text-slate-500">Hiển thị trực tiếp trên Trang bìa chuẩn</span>
        </div>

        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Sở GD&ĐT (Cơ quan cấp tỉnh):
            </label>
            <input
              type="text"
              value={metadata.province}
              onChange={(e) => onUpdateMetadata({ province: e.target.value })}
              placeholder="Ví dụ: Sở GD&ĐT Tỉnh Bình Dương"
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Phòng GD&ĐT / Cấp huyện:
            </label>
            <input
              type="text"
              value={metadata.district}
              onChange={(e) => onUpdateMetadata({ district: e.target.value })}
              placeholder="Ví dụ: Phòng GD&ĐT TP. Thủ Dầu Một"
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Trường học / Đơn vị công tác:
            </label>
            <input
              type="text"
              value={metadata.school}
              onChange={(e) => onUpdateMetadata({ school: e.target.value })}
              placeholder="Ví dụ: Trường THCS Lê Quý Đôn"
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Họ và tên tác giả:
            </label>
            <input
              type="text"
              value={metadata.author}
              onChange={(e) => onUpdateMetadata({ author: e.target.value })}
              placeholder="Ví dụ: Nguyễn Thị Thu Hà"
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Chức vụ / Vị trí việc làm:
            </label>
            <input
              type="text"
              value={metadata.authorRole}
              onChange={(e) => onUpdateMetadata({ authorRole: e.target.value })}
              placeholder="Ví dụ: Giáo viên, Tổ trưởng chuyên môn..."
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Năm học đăng ký:
            </label>
            <input
              type="text"
              value={metadata.schoolYear}
              onChange={(e) => onUpdateMetadata({ schoolYear: e.target.value })}
              placeholder="Ví dụ: 2025 - 2026"
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
            />
          </div>
        </div>
      </div>

      {/* Formatting according to Decree 30/2020 */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="w-4 h-4 text-blue-700" />
            <h3 className="text-base font-bold text-slate-900">
              2. Định dạng thể thức tự động (Nghị định 30/2020/NĐ-CP)
            </h3>
          </div>
          <span className="px-2.5 py-0.5 text-xs font-semibold bg-emerald-100 text-emerald-800 rounded-full">
            Đạt chuẩn 100%
          </span>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Font */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-2">
                Kiểu phông chữ (Font):
              </label>
              <div className="flex space-x-3">
                {(['Times New Roman', 'Arial'] as const).map((font) => (
                  <button
                    key={font}
                    type="button"
                    onClick={() => onUpdateFormatting({ font })}
                    className={`flex-1 py-2 px-3 rounded-xl border text-sm font-medium transition-all ${
                      formatting.font === font
                        ? 'border-blue-600 bg-blue-50 text-blue-800 ring-2 ring-blue-500/20'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    {font}
                  </button>
                ))}
              </div>
            </div>

            {/* Font Size */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-2">
                Cỡ chữ văn bản (Font Size):
              </label>
              <div className="flex space-x-3">
                {([13, 14] as const).map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => onUpdateFormatting({ fontSize: size })}
                    className={`flex-1 py-2 px-3 rounded-xl border text-sm font-medium transition-all ${
                      formatting.fontSize === size
                        ? 'border-blue-600 bg-blue-50 text-blue-800 ring-2 ring-blue-500/20'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    {size} pt {size === 14 ? '(Khuyên dùng)' : ''}
                  </button>
                ))}
              </div>
            </div>

            {/* Line Spacing */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-2">
                Dãn dòng (Line Spacing):
              </label>
              <div className="flex space-x-2">
                {([1.3, 1.4, 1.5] as const).map((line) => (
                  <button
                    key={line}
                    type="button"
                    onClick={() => onUpdateFormatting({ lineHeight: line })}
                    className={`flex-1 py-2 px-2.5 rounded-xl border text-sm font-medium transition-all ${
                      formatting.lineHeight === line
                        ? 'border-blue-600 bg-blue-50 text-blue-800 ring-2 ring-blue-500/20'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    {line} lines
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Margins */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-700 uppercase flex items-center">
                <Info className="w-3.5 h-3.5 text-blue-600 mr-1.5" />
                Căn lề trang A4 chuẩn hành chính (Khổ 210 x 297 mm):
              </span>
              <span className="text-xs text-slate-500">Đơn vị: Centimet (cm)</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs text-slate-600 mb-1">Lề Trái (Đóng gáy):</label>
                <div className="flex items-center">
                  <input
                    type="number"
                    step="0.1"
                    min="2.5"
                    max="3.5"
                    value={formatting.marginLeftCm}
                    onChange={(e) => onUpdateFormatting({ marginLeftCm: parseFloat(e.target.value) || 3.0 })}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-sm text-center font-bold text-slate-900"
                  />
                  <span className="ml-1.5 text-xs text-slate-500 font-medium">cm</span>
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-600 mb-1">Lề Phải:</label>
                <div className="flex items-center">
                  <input
                    type="number"
                    step="0.1"
                    min="1.5"
                    max="2.5"
                    value={formatting.marginRightCm}
                    onChange={(e) => onUpdateFormatting({ marginRightCm: parseFloat(e.target.value) || 2.0 })}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-sm text-center font-bold text-slate-900"
                  />
                  <span className="ml-1.5 text-xs text-slate-500 font-medium">cm</span>
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-600 mb-1">Lề Trên (Top):</label>
                <div className="flex items-center">
                  <input
                    type="number"
                    step="0.1"
                    min="1.5"
                    max="2.5"
                    value={formatting.marginTopCm}
                    onChange={(e) => onUpdateFormatting({ marginTopCm: parseFloat(e.target.value) || 2.0 })}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-sm text-center font-bold text-slate-900"
                  />
                  <span className="ml-1.5 text-xs text-slate-500 font-medium">cm</span>
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-600 mb-1">Lề Dưới (Bottom):</label>
                <div className="flex items-center">
                  <input
                    type="number"
                    step="0.1"
                    min="1.5"
                    max="2.5"
                    value={formatting.marginBottomCm}
                    onChange={(e) => onUpdateFormatting({ marginBottomCm: parseFloat(e.target.value) || 2.0 })}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-sm text-center font-bold text-slate-900"
                  />
                  <span className="ml-1.5 text-xs text-slate-500 font-medium">cm</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Abbreviations & References */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Abbreviations */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 flex items-center">
              <BookMarked className="w-4 h-4 mr-2 text-indigo-600" />
              Danh mục các chữ viết tắt ({abbreviations.length})
            </h3>
            <span className="text-xs text-slate-500">Tự động xuất bảng trong file Word</span>
          </div>

          <div className="max-h-48 overflow-y-auto space-y-2 pr-1 divide-y divide-slate-100">
            {abbreviations.map((item) => (
              <div key={item.id} className="pt-2 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-800 bg-slate-100 px-1.5 py-0.5 rounded-md mr-2">
                    {item.short}
                  </span>
                  <span className="text-slate-600">{item.full}</span>
                </div>
                <button
                  onClick={() => handleDeleteAbbr(item.id)}
                  className="text-slate-400 hover:text-rose-600 p-1 rounded-md"
                  title="Xóa"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Add abbr */}
          <div className="flex gap-2 pt-2 border-t border-slate-100">
            <input
              type="text"
              placeholder="Viết tắt (VD: GDĐT)"
              value={newAbbrShort}
              onChange={(e) => setNewAbbrShort(e.target.value)}
              className="w-1/3 px-3 py-1.5 text-xs rounded-lg border border-slate-300"
            />
            <input
              type="text"
              placeholder="Nghĩa đầy đủ (VD: Giáo dục và Đào tạo)"
              value={newAbbrFull}
              onChange={(e) => setNewAbbrFull(e.target.value)}
              className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-300"
            />
            <button
              onClick={handleAddAbbr}
              className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-xs rounded-lg transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* References */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 flex items-center">
              <FileText className="w-4 h-4 mr-2 text-indigo-600" />
              Tài liệu tham khảo & Căn cứ ({references.length})
            </h3>
            <span className="text-xs text-slate-500">Chuẩn trích dẫn APA</span>
          </div>

          <div className="max-h-48 overflow-y-auto space-y-2 pr-1 divide-y divide-slate-100">
            {references.map((item, idx) => (
              <div key={item.id} className="pt-2 flex items-start justify-between text-xs">
                <div className="text-slate-700">
                  <span className="font-bold text-slate-900 mr-1">[{idx + 1}]</span>
                  <span>{item.author} ({item.year}), </span>
                  <span className="italic">{item.title}</span>, {item.publisher}.
                </div>
                <button
                  onClick={() => handleDeleteRef(item.id)}
                  className="text-slate-400 hover:text-rose-600 p-1 rounded-md ml-2 flex-shrink-0"
                  title="Xóa"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Add ref */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Tác giả / Cơ quan"
                value={newRefAuthor}
                onChange={(e) => setNewRefAuthor(e.target.value)}
                className="w-2/3 px-3 py-1.5 text-xs rounded-lg border border-slate-300"
              />
              <input
                type="text"
                placeholder="Năm (2024)"
                value={newRefYear}
                onChange={(e) => setNewRefYear(e.target.value)}
                className="w-1/3 px-3 py-1.5 text-xs rounded-lg border border-slate-300"
              />
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Tên tài liệu / Thông tư / Luật"
                value={newRefTitle}
                onChange={(e) => setNewRefTitle(e.target.value)}
                className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-300"
              />
              <button
                onClick={handleAddRef}
                className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-lg transition-colors flex items-center"
              >
                <Plus className="w-3.5 h-3.5 mr-1" /> Thêm
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Step Navigation Controls */}
      <div className="flex items-center justify-between pt-4">
        <button
          onClick={onPrevStep}
          className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-medium text-sm hover:bg-slate-50"
        >
          Quay lại Bước 1
        </button>

        <button
          onClick={onNextStep}
          className="inline-flex items-center px-6 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-semibold text-sm shadow-sm transition-all"
        >
          <span>Tiếp tục: Soạn Thảo 5 Phần</span>
          <ArrowRight className="w-4 h-4 ml-2" />
        </button>
      </div>
    </div>
  );
};
