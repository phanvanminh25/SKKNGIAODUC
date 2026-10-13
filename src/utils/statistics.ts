import { SurveyDataset, SurveyMetric } from '../types/skkn';

export function calculateMetrics(
  metrics: Omit<SurveyMetric, 'prePercent' | 'postPercent' | 'diffPercent'>[],
  totalStudents: number
): SurveyMetric[] {
  const total = totalStudents > 0 ? totalStudents : 1;
  return metrics.map((m) => {
    const prePercent = Number(((m.preCount / total) * 100).toFixed(1));
    const postPercent = Number(((m.postCount / total) * 100).toFixed(1));
    const diffPercent = Number((postPercent - prePercent).toFixed(1));
    return {
      ...m,
      prePercent,
      postPercent,
      diffPercent,
    };
  });
}

export function generateStatisticalCommentary(dataset: SurveyDataset): string {
  if (!dataset.metrics || dataset.metrics.length === 0) {
    return 'Chưa có đủ số liệu khảo sát để phân tích.';
  }

  const improved = dataset.metrics.filter((m) => m.diffPercent > 0);
  const reduced = dataset.metrics.filter((m) => m.diffPercent < 0);

  let text = `Căn cứ vào bảng số liệu khảo sát thực nghiệm tại ${dataset.testGroup} (tổng số ${dataset.totalStudents} học sinh), kết quả đối chứng trước và sau khi triển khai sáng kiến cho thấy sự biến chuyển tích cực và rõ nét như sau:\n\n`;

  if (improved.length > 0) {
    text += `1. Nhóm tiêu chí có sự tiến bộ vượt bậc:\n`;
    improved.forEach((item) => {
      text += `- Tiêu chí "${item.category}": Tăng từ ${item.preCount} HS (${item.prePercent}%) lên ${item.postCount} HS (${item.postPercent}%), chênh lệch tăng +${item.diffPercent}%.\n`;
    });
  }

  if (reduced.length > 0) {
    text += `\n2. Nhóm tiêu chí giảm mạnh (đặc biệt là tỷ lệ học sinh chưa đạt/thụ động):\n`;
    reduced.forEach((item) => {
      text += `- Tiêu chí "${item.category}": Giảm từ ${item.preCount} HS (${item.prePercent}%) xuống còn ${item.postCount} HS (${item.postPercent}%), mức giảm là ${item.diffPercent}%.\n`;
    });
  }

  text += `\n3. Đánh giá ý nghĩa sư phạm:\n`;
  text += `Sự dịch chuyển tích cực từ các mức xếp loại thấp lên các mức xếp loại cao đã chứng minh rõ rệt tính hiệu quả của các giải pháp. Các biện pháp tác động đã khơi gợi được năng lực tự học, kích thích động lực nội tại và nâng cao khả năng tiếp thu của học sinh một cách bền vững.`;

  return text;
}
