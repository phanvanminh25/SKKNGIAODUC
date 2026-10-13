export type GradeLevel = 'mam_non' | 'tieu_hoc' | 'thcs' | 'thpt' | 'quan_ly';

export interface SKKNMetadata {
  title: string;
  author: string;
  authorRole: string; // Giáo viên, Tổ trưởng, Hiệu phó, Hiệu trưởng...
  school: string;
  district: string; // Phòng GD&ĐT hoặc trực thuộc Sở
  province: string; // Sở GD&ĐT
  subject: string; // Môn học hoặc Lĩnh vực
  grade: string; // Khối lớp
  schoolYear: string; // Năm học: 2025 - 2026
  registrationDate: string;
  field: string; // Lĩnh vực: Phương pháp giảng dạy, Ứng dụng CNTT/Chuyển đổi số, Công tác chủ nhiệm, Quản lý giáo dục
}

export interface FormattingConfig {
  font: 'Times New Roman' | 'Arial';
  fontSize: 13 | 14;
  lineHeight: 1.3 | 1.4 | 1.5;
  marginTopCm: number; // 2.0
  marginBottomCm: number; // 2.0
  marginLeftCm: number; // 3.0 (theo chuẩn NĐ 30/2020)
  marginRightCm: number; // 2.0
  paragraphSpacingPt: number; // 6pt
  indentFirstLineCm: number; // 1.27cm
}

export interface SKKNSection {
  id: string;
  code: string; // e.g., "I.1", "II.2.1"
  title: string;
  part: 'PHẦN I' | 'PHẦN II' | 'PHẦN III' | 'PHẦN IV' | 'PHẦN V';
  content: string;
  isMandatory: boolean;
  guidanceTip: string;
  bulletNotes?: string;
}

export interface SurveyMetric {
  id: string;
  category: string; // e.g., "Điểm 9 - 10 (Giỏi/Tốt)", "Điểm 7 - 8 (Khá)", "Điểm 5 - 6 (Đạt/TB)", "Dưới 5 (Chưa đạt)"
  preCount: number;
  postCount: number;
  prePercent: number;
  postPercent: number;
  diffPercent: number;
}

export interface SurveyDataset {
  id: string;
  title: string;
  totalStudents: number;
  testGroup: string; // Lớp thực nghiệm (e.g., Lớp 8A - 42 HS)
  controlGroup?: string; // Lớp đối chứng (e.g., Lớp 8B - 40 HS)
  scaleType: 'diem_so' | 'muc_dat_gdpt2018' | 'khao_sat_thai_do';
  metrics: SurveyMetric[];
  aiAnalysisText: string;
}

export interface EvidenceItem {
  id: string;
  figureNumber: number; // Hình 1, Hình 2...
  title: string;
  description: string;
  category: 'san_pham_hs' | 'hoat_dong_lop' | 'giao_an' | 'phieu_khao_sat' | 'khac';
  imageUrl: string;
  dateCreated: string;
}

export interface Abbreviation {
  id: string;
  short: string;
  full: string;
}

export interface ReferenceItem {
  id: string;
  author: string;
  year: string;
  title: string;
  publisher: string;
  type: 'sach' | 'thong_tu_luat' | 'tap_chi' | 'internet';
}

export interface PlagiarismReport {
  noveltyScore: number; // 0 - 100
  noveltyLevel: string;
  duplicateRiskAreas: string[];
  uniqueStrengths: string[];
  improvementSuggestions: string[];
  lastCheckedAt?: string;
}

export interface AuditIssue {
  type: 'chinh_ta' | 'thuat_ngu' | 'can_cu_phap_ly';
  original: string;
  suggestion: string;
  explanation: string;
}

export interface AuditReport {
  totalIssues: number;
  issues: AuditIssue[];
  summary: string;
  lastCheckedAt?: string;
}

export interface SKKNProject {
  id: string;
  createdAt: string;
  updatedAt: string;
  metadata: SKKNMetadata;
  gradeLevel: GradeLevel;
  formatting: FormattingConfig;
  sections: SKKNSection[];
  surveyDatasets: SurveyDataset[];
  evidences: EvidenceItem[];
  abbreviations: Abbreviation[];
  references: ReferenceItem[];
  plagiarismReport?: PlagiarismReport;
  auditReport?: AuditReport;
}
