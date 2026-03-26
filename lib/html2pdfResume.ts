import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Captures the live resume preview DOM element and exports it as an A4 PDF.
 * The output is pixel-identical to what the user sees in the preview panel.
 */
export async function generateResumePDF(_resumeData: unknown): Promise<void> {
  const element = document.getElementById('resume-preview-content');
  if (!element) {
    throw new Error('预览区域未找到，请确保简历预览窗口处于打开状态');
  }

  // Render at 2× scale for crisp print quality
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#ffffff',
    logging: false,
    width: 794,
    height: 1123,
  });

  const imgData = canvas.toDataURL('image/jpeg', 0.95);

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // A4: 210 mm × 297 mm
  pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297);
  pdf.save('姓名-学校-学历-专业-求职意向.pdf');
}
