import React, { useState } from 'react';
import {
  FileDown,
  Printer,
  FileCheck2,
  Download,
  Share2,
  Lock,
  CheckCircle2,
  ArrowLeft,
  Settings,
  Eye,
} from 'lucide-react';
import { SKKNProject } from '../../types/skkn';
import { exportSKKNToDocx, downloadBlob } from '../../utils/docxExport';

interface StepPreviewExportProps {
  project: SKKNProject;
  onPrevStep: () => void;
}

export const StepPreviewExport: React.FC<StepPreviewExportProps> = ({
  project,
  onPrevStep,
}) => {
  const { metadata, formatting, sections, surveyDatasets, abbreviations, references, evidences } =
    project;
  const [isExporting, setIsExporting] = useState(false);
  const [showPrintMessage, setShowPrintMessage] = useState(false);

  const handleExportDocx = async () => {
    setIsExporting(true);
    try {
      const blob = await exportSKKNToDocx(project);
      const filename = `SKKN_${metadata.author || 'GiaoVien'}_${metadata.schoolYear || '2025'}.docx`;
      downloadBlob(blob, filename);
    } catch (e) {
      console.error('Export docx error', e);
      alert('Có lỗi khi tạo file Word. Vui lòng thử lại.');
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportBackupJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(project, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `SaoLuu_SKKN_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const fontStyle = {
    fontFamily: formatting.font === 'Arial' ? 'Arial, sans-serif' : 'Tinos, "Times New Roman", serif',
    fontSize: `${formatting.fontSize}pt`,
    lineHeight: formatting.lineHeight || 1.4,
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto py-6">
      {/* Action Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center">
            <FileCheck2 className="w-5 h-5 mr-2 text-blue-700" />
            Xem Trước Khổ Giấy A4 & Xuất Bản Sáng Kiến
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Văn bản được căn lề tự động theo chuẩn Nghị định 30/2020/NĐ-CP (Trái 3cm, Phải 2cm, Trên
            2cm, Dưới 2cm).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleExportBackupJson}
            className="inline-flex items-center px-3.5 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors"
            title="Lưu file dự phòng trên máy tính"
          >
            <Download className="w-4 h-4 mr-1.5 text-slate-500" />
            Sao lưu (.json)
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors"
          >
            <Printer className="w-4 h-4 mr-1.5 text-slate-700" />
            In / Xuất PDF
          </button>

          <button
            onClick={handleExportDocx}
            disabled={isExporting}
            className="inline-flex items-center px-5 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs sm:text-sm font-semibold shadow-md shadow-blue-200 transition-all active:scale-95"
          >
            {isExporting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Đang tạo file Word...
              </>
            ) : (
              <>
                <FileDown className="w-4 h-4 mr-2" />
                Tải File Word (.docx)
              </>
            )}
          </button>
        </div>
      </div>

      {/* Security & Confidentiality Commitment */}
      <div className="bg-emerald-50 border border-emerald-200/80 p-4 rounded-2xl flex items-center space-x-3 text-xs text-emerald-900 print:hidden">
        <Lock className="w-4 h-4 text-emerald-700 flex-shrink-0" />
        <span>
          <strong>Cam kết bảo mật:</strong> Ý tưởng và số liệu nghiên cứu của thầy/cô được bảo mật
          tuyệt đối trong trình duyệt của bạn, hoàn toàn không bị rò rỉ trước khi Hội đồng thẩm định
          công bố kết quả.
        </span>
      </div>

      {/* Realistic A4 Paper Container */}
      <div
        className="bg-white mx-auto shadow-xl rounded-sm border border-slate-300 print:border-none print:shadow-none print:m-0"
        style={{
          width: '100%',
          maxWidth: '210mm',
          minHeight: '297mm',
          paddingTop: `${formatting.marginTopCm}cm`,
          paddingBottom: `${formatting.marginBottomCm}cm`,
          paddingLeft: `${formatting.marginLeftCm}cm`,
          paddingRight: `${formatting.marginRightCm}cm`,
          ...fontStyle,
        }}
      >
        {/* ================= COVER PAGE ================= */}
        <div className="text-center space-y-6 min-h-[250mm] flex flex-col justify-between py-8 border-b-2 border-dashed border-slate-200 print:border-none print:page-break-after-always">
          <div className="space-y-1">
            <div className="font-bold uppercase tracking-wider text-sm sm:text-base">
              {metadata.province || 'SỞ GIÁO DỤC VÀ ĐÀO TẠO'}
            </div>
            <div className="font-bold uppercase text-sm sm:text-base">
              {metadata.school || 'TRƯỜNG THCS LÊ QUÝ ĐÔN'}
            </div>
            <div className="w-32 h-0.5 bg-slate-800 mx-auto mt-2" />
          </div>

          <div className="space-y-4 my-auto py-12">
            <div className="font-bold text-lg sm:text-xl uppercase tracking-wider">
              BÁO CÁO KẾT QUẢ
            </div>
            <div className="font-extrabold text-xl sm:text-2xl text-blue-900 uppercase">
              NGHIÊN CỨU SÁNG KIẾN KINH NGHIỆM
            </div>
            <div className="pt-6 font-bold text-lg sm:text-xl uppercase max-w-lg mx-auto text-slate-900 leading-snug">
              ĐỀ TÀI: "{metadata.title}"
            </div>
          </div>

          <div className="space-y-2 text-left max-w-md mx-auto w-full pt-8 text-sm">
            <div>
              <strong>Lĩnh vực áp dụng:</strong>{' '}
              {metadata.field || metadata.subject || 'Phương pháp dạy học'}
            </div>
            <div>
              <strong>Tác giả sáng kiến:</strong> {metadata.author || 'Nguyễn Thị Thu Hà'}
            </div>
            <div>
              <strong>Chức vụ / Vị trí:</strong> {metadata.authorRole || 'Giáo viên'} - Môn:{' '}
              {metadata.subject}
            </div>
            <div>
              <strong>Đơn vị công tác:</strong> {metadata.school}
            </div>
          </div>

          <div className="font-bold text-sm uppercase pt-6">
            Năm học: {metadata.schoolYear || '2025 - 2026'}
          </div>
        </div>

        {/* ================= TABLE OF CONTENTS ================= */}
        <div className="py-12 border-b-2 border-dashed border-slate-200 print:border-none print:page-break-after-always">
          <h2 className="text-center font-bold text-base sm:text-lg uppercase mb-8">MỤC LỤC</h2>
          <div className="space-y-2.5 text-xs sm:text-sm">
            <div className="flex justify-between border-b border-dotted border-slate-300 pb-1">
              <span className="font-bold">DANH MỤC CÁC CHỮ VIẾT TẮT</span>
              <span>Trang 2</span>
            </div>
            <div className="flex justify-between border-b border-dotted border-slate-300 pb-1">
              <span className="font-bold">PHẦN I: ĐẶT VẤN ĐỀ</span>
              <span>Trang 3</span>
            </div>
            <div className="flex justify-between border-b border-dotted border-slate-300 pb-1">
              <span className="font-bold">PHẦN II: NỘI DUNG VÀ GIẢI PHÁP THỰC HIỆN</span>
              <span>Trang 5</span>
            </div>
            <div className="flex justify-between border-b border-dotted border-slate-300 pb-1">
              <span className="font-bold">PHẦN III: HIỆU QUẢ CỦA SÁNG KIẾN (THỰC NGHIỆM)</span>
              <span>Trang 12</span>
            </div>
            <div className="flex justify-between border-b border-dotted border-slate-300 pb-1">
              <span className="font-bold">PHẦN IV: BÀI HỌC KINH NGHIỆM</span>
              <span>Trang 16</span>
            </div>
            <div className="flex justify-between border-b border-dotted border-slate-300 pb-1">
              <span className="font-bold">PHẦN V: KẾT LUẬN VÀ KHUYẾN NGHỊ</span>
              <span>Trang 17</span>
            </div>
            <div className="flex justify-between border-b border-dotted border-slate-300 pb-1">
              <span className="font-bold">TÀI LIỆU THAM KHẢO</span>
              <span>Trang 19</span>
            </div>
            <div className="flex justify-between border-b border-dotted border-slate-300 pb-1">
              <span className="font-bold">PHỤ LỤC & HÌNH ẢNH MINH CHỨNG</span>
              <span>Trang 20</span>
            </div>
          </div>
        </div>

        {/* ================= ABBREVIATIONS ================= */}
        {abbreviations.length > 0 && (
          <div className="py-12 border-b-2 border-dashed border-slate-200 print:border-none print:page-break-after-always">
            <h2 className="text-center font-bold text-base sm:text-lg uppercase mb-6">
              DANH MỤC CÁC CHỮ VIẾT TẮT
            </h2>
            <table className="w-full text-xs sm:text-sm border border-slate-400 border-collapse">
              <thead>
                <tr className="bg-slate-100 font-bold border-b border-slate-400 text-center">
                  <th className="p-2 border-r border-slate-400 w-16">STT</th>
                  <th className="p-2 border-r border-slate-400 w-32">Ký hiệu viết tắt</th>
                  <th className="p-2">Ý nghĩa đầy đủ</th>
                </tr>
              </thead>
              <tbody>
                {abbreviations.map((abbr, i) => (
                  <tr key={abbr.id} className="border-b border-slate-300">
                    <td className="p-2 text-center border-r border-slate-400">{i + 1}</td>
                    <td className="p-2 text-center font-bold border-r border-slate-400">
                      {abbr.short}
                    </td>
                    <td className="p-2">{abbr.full}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ================= BODY SECTIONS ================= */}
        <div className="py-8 space-y-8 text-justify">
          {(['PHẦN I', 'PHẦN II', 'PHẦN III', 'PHẦN IV', 'PHẦN V'] as const).map((partKey) => {
            const partSecs = sections.filter((s) => s.part === partKey);
            if (partSecs.length === 0) return null;

            const partTitles: Record<string, string> = {
              'PHẦN I': 'PHẦN I: ĐẶT VẤN ĐỀ',
              'PHẦN II': 'PHẦN II: NỘI DUNG VÀ GIẢI PHÁP THỰC HIỆN',
              'PHẦN III': 'PHẦN III: HIỆU QUẢ CỦA SÁNG KIẾN (THỰC NGHIỆM SƯ PHẠM)',
              'PHẦN IV': 'PHẦN IV: BÀI HỌC KINH NGHIỆM',
              'PHẦN V': 'PHẦN V: KẾT LUẬN VÀ KHUYẾN NGHỊ',
            };

            return (
              <div key={partKey} className="space-y-6">
                <h2 className="font-bold text-base uppercase text-blue-950 pt-4 border-t border-slate-200">
                  {partTitles[partKey]}
                </h2>

                {partSecs.map((sec) => (
                  <div key={sec.id} className="space-y-3">
                    <h3 className="font-bold text-sm">
                      {sec.code}. {sec.title}
                    </h3>

                    {/* Section survey table render if III.2 */}
                    {sec.id === 'sec-3-2' && surveyDatasets.length > 0 && (
                      <div className="my-4 space-y-2">
                        <div className="text-center font-bold italic text-xs">
                          Bảng 1: {surveyDatasets[0].title}
                        </div>
                        <table className="w-full text-xs border border-slate-400 border-collapse">
                          <thead>
                            <tr className="bg-slate-100 font-bold border-b border-slate-400 text-center">
                              <th className="p-2 border-r border-slate-400">Tiêu chí xếp loại</th>
                              <th className="p-2 border-r border-slate-400">Trước TN (SL / %)</th>
                              <th className="p-2 border-r border-slate-400">Sau TN (SL / %)</th>
                              <th className="p-2">Độ lệch (+/- %)</th>
                            </tr>
                          </thead>
                          <tbody>
                            {surveyDatasets[0].metrics.map((m) => (
                              <tr key={m.id} className="border-b border-slate-300">
                                <td className="p-2 font-medium border-r border-slate-400">
                                  {m.category}
                                </td>
                                <td className="p-2 text-center border-r border-slate-400">
                                  {m.preCount} HS ({m.prePercent}%)
                                </td>
                                <td className="p-2 text-center border-r border-slate-400">
                                  {m.postCount} HS ({m.postPercent}%)
                                </td>
                                <td className="p-2 text-center font-bold">
                                  {m.diffPercent > 0 ? `+${m.diffPercent}%` : `${m.diffPercent}%`}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {sec.content.split('\n\n').map((paragraph, pIdx) => {
                      if (!paragraph.trim()) return null;
                      return (
                        <p
                          key={pIdx}
                          className="indent-8 text-slate-800 leading-relaxed"
                          style={{ marginBottom: `${formatting.paragraphSpacingPt}pt` }}
                        >
                          {paragraph.trim()}
                        </p>
                      );
                    })}
                  </div>
                ))}
              </div>
            );
          })}
        </div>

        {/* ================= REFERENCES ================= */}
        {references.length > 0 && (
          <div className="py-8 border-t border-slate-300 space-y-4">
            <h2 className="font-bold text-base uppercase text-blue-950">TÀI LIỆU THAM KHẢO</h2>
            <ol className="list-none space-y-2 text-xs sm:text-sm">
              {references.map((ref, idx) => (
                <li key={ref.id} className="pl-6 -indent-6">
                  <strong>[{idx + 1}]</strong> {ref.author} ({ref.year}),{' '}
                  <span className="italic">{ref.title}</span>, {ref.publisher}.
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* ================= EVIDENCES ================= */}
        {evidences.length > 0 && (
          <div className="py-8 border-t border-slate-300 space-y-6">
            <h2 className="font-bold text-base uppercase text-blue-950">
              PHỤ LỤC: MINH CHỨNG THỰC NGHIỆM
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {evidences.map((evi) => (
                <div key={evi.id} className="space-y-1 text-center">
                  <div className="aspect-video w-full rounded-md overflow-hidden bg-slate-100 border border-slate-300">
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
                  <div className="font-bold text-xs">
                    Hình {evi.figureNumber}: {evi.title}
                  </div>
                  <div className="text-[11px] text-slate-500 italic">{evi.description}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer Navigation */}
      <div className="flex items-center justify-between pt-4 print:hidden">
        <button
          onClick={onPrevStep}
          className="inline-flex items-center px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-medium text-sm hover:bg-slate-50"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại Bước 5
        </button>

        <button
          onClick={handleExportDocx}
          disabled={isExporting}
          className="inline-flex items-center px-6 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-semibold text-sm shadow-md shadow-blue-200 transition-all active:scale-95"
        >
          <FileDown className="w-4 h-4 mr-2" />
          Tải File Word (.docx) Chính Thức
        </button>
      </div>
    </div>
  );
};
