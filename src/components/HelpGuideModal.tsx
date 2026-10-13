import React from 'react';
import { X, BookOpen, CheckCircle, Scale, ShieldCheck, FileText } from 'lucide-react';

interface HelpGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpGuideModal: React.FC<HelpGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl space-y-6 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-blue-700" />
            <h3 className="font-bold text-lg text-slate-900">
              Cẩm Nang & Tiêu Chuẩn Viết Sáng Kiến Kinh Nghiệm
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6 text-xs sm:text-sm text-slate-700">
          {/* Section 1 */}
          <div className="space-y-2">
            <h4 className="font-bold text-base text-blue-900 flex items-center">
              <FileText className="w-4 h-4 mr-2 text-blue-600" />
              1. Quy chuẩn thể thức theo Nghị định số 30/2020/NĐ-CP
            </h4>
            <p className="leading-relaxed">
              Văn bản Sáng kiến kinh nghiệm phải tuân thủ nghiêm ngặt thể thức văn bản hành chính:
            </p>
            <ul className="list-disc list-inside space-y-1 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <li>
                <strong>Khổ giấy:</strong> A4 (210 mm x 297 mm), định hướng đứng.
              </li>
              <li>
                <strong>Căn lề chuẩn:</strong> Lề trên 20-25mm, Lề dưới 20-25mm, Lề trái 30-35mm (để
                đóng gáy), Lề phải 15-20mm. EduSKKN tự động đặt chuẩn <strong>2-2-3-2 cm</strong>.
              </li>
              <li>
                <strong>Phông chữ:</strong> Times New Roman hoặc Arial, cỡ chữ 13-14pt, màu đen.
              </li>
              <li>
                <strong>Dãn dòng:</strong> 1.3 - 1.5 lines. Dãn đoạn: Before 0pt, After 6pt.
              </li>
            </ul>
          </div>

          {/* Section 2 */}
          <div className="space-y-2">
            <h4 className="font-bold text-base text-blue-900 flex items-center">
              <Scale className="w-4 h-4 mr-2 text-indigo-600" />
              2. 5 Tiêu chí chấm điểm của Hội đồng thẩm định SKKN
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-100">
                <span className="font-bold text-blue-900">Tính Mới & Sáng Tạo:</span>
                <p className="text-xs text-slate-600 mt-1">
                  Không sao chép từ các tài liệu đã công bố; đề xuất cách làm mới, công cụ mới hoặc
                  quy trình mới hiệu quả hơn cách làm truyền thống.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-100">
                <span className="font-bold text-emerald-900">Tính Khoa Học & Sư Phạm:</span>
                <p className="text-xs text-slate-600 mt-1">
                  Lập luận logic, thuật ngữ sư phạm chuẩn mực bám sát Chương trình GDPT 2018 và tâm
                  lý học lứa tuổi.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-purple-50/60 border border-purple-100">
                <span className="font-bold text-purple-900">Tính Thực Nghiệm & Số Liệu:</span>
                <p className="text-xs text-slate-600 mt-1">
                  Có bảng đối chứng trước và sau tác động giữa lớp thực nghiệm và lớp đối chứng để
                  chứng minh hiệu quả định lượng.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-100">
                <span className="font-bold text-amber-900">Khả Năng Nhân Rộng:</span>
                <p className="text-xs text-slate-600 mt-1">
                  Giải pháp dễ áp dụng, không đòi hỏi chi phí đắt đỏ, các giáo viên khác trong trường
                  hoặc huyện có thể học tập và làm theo.
                </p>
              </div>
            </div>
          </div>

          {/* Section 3 */}
          <div className="space-y-2">
            <h4 className="font-bold text-base text-blue-900 flex items-center">
              <ShieldCheck className="w-4 h-4 mr-2 text-emerald-600" />
              3. Lưu ý về Bản quyền & Tránh vi phạm sao chép
            </h4>
            <p className="leading-relaxed">
              Hội đồng giám khảo hiện nay đều quét đối soát với kho dữ liệu các SKKN đã đạt giải
              trước đó. Để không bị trừ điểm tính mới:
            </p>
            <ul className="list-disc list-inside space-y-1 bg-emerald-50/50 p-3.5 rounded-xl border border-emerald-100 text-emerald-950">
              <li>
                Luôn bổ sung <strong>số liệu thực tế của chính học sinh trường bạn</strong> (tên lớp,
                đặc điểm vùng miền).
              </li>
              <li>
                Đính kèm <strong>ảnh chụp sản phẩm học tập và hoạt động lớp học</strong> thực tế ở
                phần Phụ lục minh chứng.
              </li>
              <li>
                Sử dụng tính năng <strong>Quét Tính Mới & Trùng lặp</strong> tại Bước 5 trước khi
                nộp.
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold bg-blue-700 text-white rounded-xl hover:bg-blue-800"
          >
            Đã hiểu, quay lại soạn thảo
          </button>
        </div>
      </div>
    </div>
  );
};
