import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  BorderStyle,
  PageBreak,
  Header,
  Footer,
  PageNumber,
} from 'docx';
import { SKKNProject } from '../types/skkn';

export async function exportSKKNToDocx(project: {
  metadata: SKKNProject['metadata'];
  formatting: SKKNProject['formatting'];
  sections: SKKNProject['sections'];
  surveyDatasets: SKKNProject['surveyDatasets'];
  abbreviations: SKKNProject['abbreviations'];
  references: SKKNProject['references'];
  evidences: SKKNProject['evidences'];
}) {
  const { metadata, formatting, sections, surveyDatasets, abbreviations, references, evidences } = project;

  // 1 cm = 567 twips
  const topMarginTwips = Math.round((formatting.marginTopCm || 2.0) * 567);
  const bottomMarginTwips = Math.round((formatting.marginBottomCm || 2.0) * 567);
  const leftMarginTwips = Math.round((formatting.marginLeftCm || 3.0) * 567);
  const rightMarginTwips = Math.round((formatting.marginRightCm || 2.0) * 567);

  const fontName = formatting.font || 'Times New Roman';
  const fontSizeHalfPoints = (formatting.fontSize || 14) * 2; // docx uses half-points
  const lineHeightTwips = Math.round((formatting.lineHeight || 1.4) * 240); // 240 = single line

  // Build Document Elements
  const docChildren: (Paragraph | Table)[] = [];

  // ==================== TRANG BÌA (COVER PAGE) ====================
  docChildren.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 120 },
      children: [
        new TextRun({
          text: metadata.province.toUpperCase() || 'SỞ GIÁO DỤC VÀ ĐÀO TẠO',
          font: fontName,
          size: 26,
          bold: true,
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: metadata.school.toUpperCase() || 'TRƯỜNG THCS LÊ QUÝ ĐÔN',
          font: fontName,
          size: 26,
          bold: true,
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 600 },
      children: [
        new TextRun({
          text: '----------------------------------------',
          font: fontName,
          size: 24,
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 800, after: 400 },
      children: [
        new TextRun({
          text: 'BÁO CÁO KẾT QUẢ',
          font: fontName,
          size: 32,
          bold: true,
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 600 },
      children: [
        new TextRun({
          text: 'NGHIÊN CỨU SÁNG KIẾN KINH NGHIỆM',
          font: fontName,
          size: 36,
          bold: true,
          color: '003366',
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 400, after: 800 },
      children: [
        new TextRun({
          text: `ĐỀ TÀI: "${metadata.title.toUpperCase()}"`,
          font: fontName,
          size: 32,
          bold: true,
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.LEFT,
      spacing: { before: 1200, after: 160 },
      indent: { left: 2400 },
      children: [
        new TextRun({
          text: `Lĩnh vực áp dụng: `,
          font: fontName,
          size: 26,
          bold: true,
        }),
        new TextRun({
          text: metadata.field || metadata.subject || 'Phương pháp giảng dạy',
          font: fontName,
          size: 26,
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.LEFT,
      spacing: { after: 160 },
      indent: { left: 2400 },
      children: [
        new TextRun({
          text: `Tác giả sáng kiến: `,
          font: fontName,
          size: 26,
          bold: true,
        }),
        new TextRun({
          text: metadata.author || 'Nguyễn Văn A',
          font: fontName,
          size: 26,
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.LEFT,
      spacing: { after: 160 },
      indent: { left: 2400 },
      children: [
        new TextRun({
          text: `Chức vụ / Công tác: `,
          font: fontName,
          size: 26,
          bold: true,
        }),
        new TextRun({
          text: `${metadata.authorRole || 'Giáo viên'} - Bộ môn: ${metadata.subject || ''}`,
          font: fontName,
          size: 26,
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.LEFT,
      spacing: { after: 600 },
      indent: { left: 2400 },
      children: [
        new TextRun({
          text: `Đơn vị: `,
          font: fontName,
          size: 26,
          bold: true,
        }),
        new TextRun({
          text: metadata.school || 'Trường THCS',
          font: fontName,
          size: 26,
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 800, after: 200 },
      children: [
        new TextRun({
          text: `Năm học: ${metadata.schoolYear || '2025 - 2026'}`,
          font: fontName,
          size: 26,
          bold: true,
        }),
      ],
    }),
    new Paragraph({
      children: [new PageBreak()],
    })
  );

  // ==================== MỤC LỤC & DANH MỤC ====================
  docChildren.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 300 },
      children: [
        new TextRun({
          text: 'MỤC LỤC',
          font: fontName,
          size: 30,
          bold: true,
        }),
      ],
    })
  );

  // Auto TOC items
  const tocEntries = [
    { title: 'DANH MỤC CÁC CHỮ VIẾT TẮT', page: 'Trang 2' },
    { title: 'PHẦN I: ĐẶT VẤN ĐỀ', page: 'Trang 3' },
    { title: 'PHẦN II: NỘI DUNG VÀ GIẢI PHÁP THỰC HIỆN', page: 'Trang 5' },
    { title: 'PHẦN III: HIỆU QUẢ CỦA SÁNG KIẾN (THỰC NGHIỆM SƯ PHẠM)', page: 'Trang 12' },
    { title: 'PHẦN IV: BÀI HỌC KINH NGHIỆM', page: 'Trang 16' },
    { title: 'PHẦN V: KẾT LUẬN VÀ KHUYẾN NGHỊ', page: 'Trang 17' },
    { title: 'TÀI LIỆU THAM KHẢO', page: 'Trang 19' },
    { title: 'PHỤ LỤC & MINH CHỨNG', page: 'Trang 20' },
  ];

  tocEntries.forEach((entry) => {
    docChildren.push(
      new Paragraph({
        spacing: { after: 120 },
        alignment: AlignmentType.BOTH,
        children: [
          new TextRun({
            text: entry.title,
            font: fontName,
            size: fontSizeHalfPoints - 2,
            bold: entry.title.startsWith('PHẦN') || entry.title === 'MỤC LỤC',
          }),
          new TextRun({
            text: ` ......................................................................................... `,
            font: fontName,
            size: 20,
            color: '888888',
          }),
          new TextRun({
            text: entry.page,
            font: fontName,
            size: fontSizeHalfPoints - 2,
            bold: true,
          }),
        ],
      })
    );
  });

  docChildren.push(
    new Paragraph({
      spacing: { before: 400, after: 300 },
      children: [new PageBreak()],
    })
  );

  // ==================== DANH MỤC TỪ VIẾT TẮT ====================
  if (abbreviations && abbreviations.length > 0) {
    docChildren.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 300 },
        children: [
          new TextRun({
            text: 'DANH MỤC CÁC CHỮ VIẾT TẮT',
            font: fontName,
            size: 28,
            bold: true,
          }),
        ],
      })
    );

    const abbrRows = [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 1500, type: WidthType.DXA },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: 'STT', font: fontName, bold: true, size: 24 })],
              }),
            ],
          }),
          new TableCell({
            width: { size: 2500, type: WidthType.DXA },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: 'Ký hiệu viết tắt', font: fontName, bold: true, size: 24 })],
              }),
            ],
          }),
          new TableCell({
            width: { size: 5500, type: WidthType.DXA },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: 'Ý nghĩa đầy đủ', font: fontName, bold: true, size: 24 })],
              }),
            ],
          }),
        ],
      }),
      ...abbreviations.map(
        (abbr, idx) =>
          new TableRow({
            children: [
              new TableCell({
                width: { size: 1500, type: WidthType.DXA },
                children: [
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [new TextRun({ text: `${idx + 1}`, font: fontName, size: 24 })],
                  }),
                ],
              }),
              new TableCell({
                width: { size: 2500, type: WidthType.DXA },
                children: [
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [new TextRun({ text: abbr.short, font: fontName, bold: true, size: 24 })],
                  }),
                ],
              }),
              new TableCell({
                width: { size: 5500, type: WidthType.DXA },
                children: [
                  new Paragraph({
                    alignment: AlignmentType.LEFT,
                    children: [new TextRun({ text: abbr.full, font: fontName, size: 24 })],
                  }),
                ],
              }),
            ],
          })
      ),
    ];

    docChildren.push(
      new Table({
        rows: abbrRows,
        width: { size: 9500, type: WidthType.DXA },
        alignment: AlignmentType.CENTER,
      }),
      new Paragraph({
        spacing: { before: 300, after: 300 },
        children: [new PageBreak()],
      })
    );
  }

  // ==================== CÁC PHẦN NỘI DUNG CHÍNH ====================
  const parts = ['PHẦN I', 'PHẦN II', 'PHẦN III', 'PHẦN IV', 'PHẦN V'] as const;
  const partTitles: Record<string, string> = {
    'PHẦN I': 'PHẦN I: ĐẶT VẤN ĐỀ',
    'PHẦN II': 'PHẦN II: NỘI DUNG VÀ GIẢI PHÁP THỰC HIỆN',
    'PHẦN III': 'PHẦN III: HIỆU QUẢ CỦA SÁNG KIẾN (THỰC NGHIỆM SƯ PHẠM)',
    'PHẦN IV': 'PHẦN IV: BÀI HỌC KINH NGHIỆM',
    'PHẦN V': 'PHẦN V: KẾT LUẬN VÀ KHUYẾN NGHỊ',
  };

  parts.forEach((partKey) => {
    const partSections = sections.filter((s) => s.part === partKey);
    if (partSections.length === 0) return;

    // Heading Part
    docChildren.push(
      new Paragraph({
        alignment: AlignmentType.LEFT,
        spacing: { before: 300, after: 200 },
        children: [
          new TextRun({
            text: partTitles[partKey],
            font: fontName,
            size: fontSizeHalfPoints + 2,
            bold: true,
            color: '003366',
          }),
        ],
      })
    );

    partSections.forEach((sec) => {
      // Heading section
      docChildren.push(
        new Paragraph({
          alignment: AlignmentType.LEFT,
          spacing: { before: 200, after: 120 },
          children: [
            new TextRun({
              text: `${sec.code}. ${sec.title}`,
              font: fontName,
              size: fontSizeHalfPoints,
              bold: true,
            }),
          ],
        })
      );

      // Section paragraphs
      const paragraphs = sec.content.split('\n\n');
      paragraphs.forEach((pText) => {
        if (!pText.trim()) return;

        // Check if this is the survey dataset section
        if (sec.id === 'sec-3-2' && surveyDatasets.length > 0) {
          // Render Table of survey data!
          const ds = surveyDatasets[0];
          docChildren.push(
            new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: { before: 160, after: 120 },
              children: [
                new TextRun({
                  text: `Bảng 1: ${ds.title}`,
                  font: fontName,
                  size: fontSizeHalfPoints - 2,
                  italics: true,
                  bold: true,
                }),
              ],
            })
          );

          const tableRows = [
            new TableRow({
              children: [
                new TableCell({
                  children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Tiêu chí xếp loại', font: fontName, bold: true, size: 22 })] })],
                }),
                new TableCell({
                  children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Trước TN (SL / %)', font: fontName, bold: true, size: 22 })] })],
                }),
                new TableCell({
                  children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Sau TN (SL / %)', font: fontName, bold: true, size: 22 })] })],
                }),
                new TableCell({
                  children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Chênh lệch (+/-)', font: fontName, bold: true, size: 22 })] })],
                }),
              ],
            }),
            ...ds.metrics.map(
              (m) =>
                new TableRow({
                  children: [
                    new TableCell({
                      children: [new Paragraph({ children: [new TextRun({ text: m.category, font: fontName, size: 22 })] })],
                    }),
                    new TableCell({
                      children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${m.preCount} HS (${m.prePercent}%)`, font: fontName, size: 22 })] })],
                    }),
                    new TableCell({
                      children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${m.postCount} HS (${m.postPercent}%)`, font: fontName, size: 22 })] })],
                    }),
                    new TableCell({
                      children: [
                        new Paragraph({
                          alignment: AlignmentType.CENTER,
                          children: [
                            new TextRun({
                              text: `${m.diffPercent > 0 ? '+' : ''}${m.diffPercent}%`,
                              font: fontName,
                              bold: true,
                              size: 22,
                              color: m.diffPercent > 0 ? '006600' : '990000',
                            }),
                          ],
                        }),
                      ],
                    }),
                  ],
                })
            ),
          ];

          docChildren.push(
            new Table({
              rows: tableRows,
              width: { size: 9500, type: WidthType.DXA },
              alignment: AlignmentType.CENTER,
            })
          );

          if (ds.aiAnalysisText) {
            docChildren.push(
              new Paragraph({
                alignment: AlignmentType.BOTH,
                spacing: { before: 160, after: 120, line: lineHeightTwips },
                indent: { firstLine: 720 },
                children: [
                  new TextRun({
                    text: ds.aiAnalysisText,
                    font: fontName,
                    size: fontSizeHalfPoints,
                  }),
                ],
              })
            );
          }
        } else {
          docChildren.push(
            new Paragraph({
              alignment: AlignmentType.BOTH,
              spacing: { after: 120, line: lineHeightTwips },
              indent: { firstLine: 720 }, // 1.27cm
              children: [
                new TextRun({
                  text: pText.trim(),
                  font: fontName,
                  size: fontSizeHalfPoints,
                }),
              ],
            })
          );
        }
      });
    });
  });

  // ==================== TÀI LIỆU THAM KHẢO ====================
  if (references && references.length > 0) {
    docChildren.push(
      new Paragraph({
        spacing: { before: 400, after: 200 },
        children: [new PageBreak()],
      }),
      new Paragraph({
        alignment: AlignmentType.LEFT,
        spacing: { before: 200, after: 200 },
        children: [
          new TextRun({
            text: 'TÀI LIỆU THAM KHẢO',
            font: fontName,
            size: fontSizeHalfPoints + 2,
            bold: true,
            color: '003366',
          }),
        ],
      })
    );

    references.forEach((ref, idx) => {
      docChildren.push(
        new Paragraph({
          alignment: AlignmentType.BOTH,
          spacing: { after: 100, line: lineHeightTwips },
          indent: { left: 720, hanging: 720 },
          children: [
            new TextRun({
              text: `[${idx + 1}] ${ref.author} (${ref.year}), `,
              font: fontName,
              size: fontSizeHalfPoints,
              bold: true,
            }),
            new TextRun({
              text: `${ref.title}, `,
              font: fontName,
              size: fontSizeHalfPoints,
              italics: true,
            }),
            new TextRun({
              text: `${ref.publisher}.`,
              font: fontName,
              size: fontSizeHalfPoints,
            }),
          ],
        })
      );
    });
  }

  // ==================== PHỤ LỤC & MINH CHỨNG ====================
  if (evidences && evidences.length > 0) {
    docChildren.push(
      new Paragraph({
        spacing: { before: 400, after: 200 },
        children: [new PageBreak()],
      }),
      new Paragraph({
        alignment: AlignmentType.LEFT,
        spacing: { before: 200, after: 200 },
        children: [
          new TextRun({
            text: 'PHỤ LỤC: DANH MỤC HÌNH ẢNH MINH CHỨNG THỰC NGHIỆM',
            font: fontName,
            size: fontSizeHalfPoints + 2,
            bold: true,
            color: '003366',
          }),
        ],
      })
    );

    evidences.forEach((evi) => {
      docChildren.push(
        new Paragraph({
          alignment: AlignmentType.LEFT,
          spacing: { before: 160, after: 80 },
          children: [
            new TextRun({
              text: `Hình ${evi.figureNumber}: ${evi.title}`,
              font: fontName,
              size: fontSizeHalfPoints,
              bold: true,
            }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.BOTH,
          spacing: { after: 120, line: lineHeightTwips },
          indent: { firstLine: 720 },
          children: [
            new TextRun({
              text: `Mô tả: ${evi.description} (Ngày ghi nhận: ${evi.dateCreated})`,
              font: fontName,
              size: fontSizeHalfPoints - 2,
              italics: true,
            }),
          ],
        })
      );
    });
  }

  // Create Document with Standard Page Setup
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: topMarginTwips,
              bottom: bottomMarginTwips,
              left: leftMarginTwips,
              right: rightMarginTwips,
            },
          },
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({
                    text: `Sáng kiến kinh nghiệm năm học ${metadata.schoolYear || '2025 - 2026'}`,
                    font: fontName,
                    size: 18,
                    italics: true,
                    color: '666666',
                  }),
                ],
              }),
            ],
          }),
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    children: [PageNumber.CURRENT],
                    font: fontName,
                    size: 20,
                  }),
                ],
              }),
            ],
          }),
        },
        children: docChildren,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  return blob;
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
