import React, { useState, useEffect } from 'react';
import { SKKNProject, GradeLevel } from './types/skkn';
import { INITIAL_SKKN_PROJECT, getSectionsTemplateByGrade } from './data/templates';
import { Navbar } from './components/Navbar';
import { StepNavigation } from './components/StepNavigation';
import { StepIdeaTopic } from './components/steps/StepIdeaTopic';
import { StepGeneralInfo } from './components/steps/StepGeneralInfo';
import { StepContentEditor } from './components/steps/StepContentEditor';
import { StepDataEvidence } from './components/steps/StepDataEvidence';
import { StepAuditReview } from './components/steps/StepAuditReview';
import { StepPreviewExport } from './components/steps/StepPreviewExport';
import { AiConsultantDrawer } from './components/AiConsultantDrawer';
import { NewProjectModal } from './components/NewProjectModal';
import { HelpGuideModal } from './components/HelpGuideModal';
import { exportSKKNToDocx, downloadBlob } from './utils/docxExport';

const STORAGE_KEY = 'eduskkn_active_project_v1';

export default function App() {
  const [project, setProject] = useState<SKKNProject>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.metadata && parsed.sections) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Could not restore from localStorage, using default template');
    }
    return INITIAL_SKKN_PROJECT;
  });

  const [activeStep, setActiveStep] = useState<number>(1);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(new Date());
  const [isConsultantOpen, setIsConsultantOpen] = useState(false);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // Auto-save to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(project));
      setLastSavedAt(new Date());
    } catch (e) {
      console.error('Auto save error', e);
    }
  }, [project]);

  // Update handlers
  const handleUpdateMetadata = (meta: Partial<SKKNProject['metadata']>) => {
    setProject((prev) => ({
      ...prev,
      metadata: { ...prev.metadata, ...meta },
      updatedAt: new Date().toISOString(),
    }));
  };

  const handleSelectGradeLevel = (level: GradeLevel) => {
    setProject((prev) => ({
      ...prev,
      gradeLevel: level,
      sections: getSectionsTemplateByGrade(level),
      updatedAt: new Date().toISOString(),
    }));
  };

  const handleUpdateFormatting = (fmt: Partial<SKKNProject['formatting']>) => {
    setProject((prev) => ({
      ...prev,
      formatting: { ...prev.formatting, ...fmt },
      updatedAt: new Date().toISOString(),
    }));
  };

  const handleUpdateSection = (
    sectionId: string,
    content: string,
    bulletNotes?: string
  ) => {
    setProject((prev) => ({
      ...prev,
      sections: prev.sections.map((s) =>
        s.id === sectionId
          ? { ...s, content, bulletNotes: bulletNotes !== undefined ? bulletNotes : s.bulletNotes }
          : s
      ),
      updatedAt: new Date().toISOString(),
    }));
  };

  const handleUpdateSurveyDataset = (dataset: SKKNProject['surveyDatasets'][0]) => {
    setProject((prev) => ({
      ...prev,
      surveyDatasets: [dataset],
      updatedAt: new Date().toISOString(),
    }));
  };

  const handleApplyAnalysisToSection = (analysisText: string) => {
    // Sync into section III.3 (Phân tích kết quả thực nghiệm)
    setProject((prev) => ({
      ...prev,
      sections: prev.sections.map((s) =>
        s.id === 'sec-3-3' ? { ...s, content: analysisText } : s
      ),
      updatedAt: new Date().toISOString(),
    }));
  };

  const handleUpdateEvidences = (evidences: SKKNProject['evidences']) => {
    setProject((prev) => ({
      ...prev,
      evidences,
      updatedAt: new Date().toISOString(),
    }));
  };

  const handleUpdateAbbreviations = (abbreviations: SKKNProject['abbreviations']) => {
    setProject((prev) => ({
      ...prev,
      abbreviations,
      updatedAt: new Date().toISOString(),
    }));
  };

  const handleUpdateReferences = (references: SKKNProject['references']) => {
    setProject((prev) => ({
      ...prev,
      references,
      updatedAt: new Date().toISOString(),
    }));
  };

  const handleUpdatePlagiarismReport = (report: SKKNProject['plagiarismReport']) => {
    setProject((prev) => ({
      ...prev,
      plagiarismReport: report,
      updatedAt: new Date().toISOString(),
    }));
  };

  const handleUpdateAuditReport = (report: SKKNProject['auditReport']) => {
    setProject((prev) => ({
      ...prev,
      auditReport: report,
      updatedAt: new Date().toISOString(),
    }));
  };

  // Export docx trigger
  const handleExportDocx = async () => {
    try {
      const blob = await exportSKKNToDocx(project);
      const filename = `SKKN_${project.metadata.author || 'GiaoVien'}_${
        project.metadata.schoolYear || '2025'
      }.docx`;
      downloadBlob(blob, filename);
    } catch (e) {
      console.error(e);
      alert('Không thể xuất file Word. Vui lòng thử lại.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        project={project}
        onNewProject={() => setIsNewModalOpen(true)}
        onExportDocx={handleExportDocx}
        onPrintPreview={() => {
          setActiveStep(6);
          setTimeout(() => window.print(), 300);
        }}
        onOpenConsultant={() => setIsConsultantOpen(true)}
        onOpenHelp={() => setIsHelpOpen(true)}
        lastSavedAt={lastSavedAt}
        activeStep={activeStep}
        setActiveStep={setActiveStep}
      />

      {/* Step by step Progress Bar */}
      <StepNavigation currentStep={activeStep} onSelectStep={setActiveStep} />

      {/* Main Workspace based on current Step */}
      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6">
        {activeStep === 1 && (
          <StepIdeaTopic
            project={project}
            onUpdateMetadata={handleUpdateMetadata}
            onSelectGradeLevel={handleSelectGradeLevel}
            onNextStep={() => setActiveStep(2)}
          />
        )}

        {activeStep === 2 && (
          <StepGeneralInfo
            project={project}
            onUpdateMetadata={handleUpdateMetadata}
            onUpdateFormatting={handleUpdateFormatting}
            onUpdateAbbreviations={handleUpdateAbbreviations}
            onUpdateReferences={handleUpdateReferences}
            onNextStep={() => setActiveStep(3)}
            onPrevStep={() => setActiveStep(1)}
          />
        )}

        {activeStep === 3 && (
          <StepContentEditor
            project={project}
            onUpdateSection={handleUpdateSection}
            onNextStep={() => setActiveStep(4)}
            onPrevStep={() => setActiveStep(2)}
          />
        )}

        {activeStep === 4 && (
          <StepDataEvidence
            project={project}
            onUpdateSurveyDataset={handleUpdateSurveyDataset}
            onUpdateEvidences={handleUpdateEvidences}
            onApplyAnalysisToSection={handleApplyAnalysisToSection}
            onNextStep={() => setActiveStep(5)}
            onPrevStep={() => setActiveStep(3)}
          />
        )}

        {activeStep === 5 && (
          <StepAuditReview
            project={project}
            onUpdatePlagiarismReport={handleUpdatePlagiarismReport}
            onUpdateAuditReport={handleUpdateAuditReport}
            onNextStep={() => setActiveStep(6)}
            onPrevStep={() => setActiveStep(4)}
          />
        )}

        {activeStep === 6 && (
          <StepPreviewExport
            project={project}
            onPrevStep={() => setActiveStep(5)}
          />
        )}
      </main>

      {/* AI Pedagogical Consultant Chat Drawer */}
      <AiConsultantDrawer
        isOpen={isConsultantOpen}
        onClose={() => setIsConsultantOpen(false)}
        project={project}
      />

      {/* New Project / Level Selector Modal */}
      <NewProjectModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        onSelectNew={(newProj) => {
          setProject(newProj);
          setActiveStep(1);
        }}
      />

      {/* Educational Guidelines & Legal Reference Modal */}
      <HelpGuideModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500 print:hidden">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            © 2026 EduSKKN AI • Phần mềm hỗ trợ viết & chuẩn hóa Sáng kiến kinh nghiệm ngành Giáo dục
          </span>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsHelpOpen(true)}
              className="text-blue-700 hover:underline"
            >
              Cẩm nang NĐ 30 & Tiêu chuẩn Bộ GD&ĐT
            </button>
            <span>•</span>
            <button
              onClick={() => setIsConsultantOpen(true)}
              className="text-indigo-700 hover:underline"
            >
              Hỏi đáp cùng Cố vấn AI
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
