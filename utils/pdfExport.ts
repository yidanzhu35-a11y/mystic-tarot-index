import jsPDF from 'jspdf';
import { TarotCard, SpreadRecord, Notes } from '../types';
import { TAROT_DECK } from '../constants';

// 金色主题色
const GOLD_COLOR = '#D4AF37';
const TEXT_COLOR = '#333333';
const LIGHT_GRAY = '#F5F5F5';

export const exportSingleCardNotesToPDF = async (
  notes: Notes,
  selectedCardIds: number[]
) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  let y = margin;

  const today = new Date().toISOString().split('T')[0];
  
  // 选中的有笔记的牌
  const cardsToExport = selectedCardIds
    .map(id => ({ card: TAROT_DECK.find(c => c.id === id), note: notes[id] }))
    .filter(item => item.card && item.note && item.note.trim()) as { card: TarotCard; note: string }[];

  if (cardsToExport.length === 0) {
    alert('请选择有笔记的牌进行导出');
    return;
  }

  cardsToExport.forEach((item, index) => {
    if (index > 0) {
      doc.addPage();
      y = margin;
    }

    const { card, note } = item;

    // 页面边框
    doc.setDrawColor(GOLD_COLOR);
    doc.setLineWidth(1);
    doc.rect(margin - 5, margin - 5, pageWidth - 2 * (margin - 5), pageHeight - 2 * (margin - 5));

    // 标题
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.setTextColor(GOLD_COLOR);
    doc.text('你的塔塔书 - 单牌笔记', pageWidth / 2, y, { align: 'center' });
    y += 15;

    // 分隔线
    doc.setDrawColor(GOLD_COLOR);
    doc.setLineWidth(0.5);
    doc.line(margin, y, pageWidth - margin, y);
    y += 10;

    // 牌名和日期
    doc.setFontSize(12);
    doc.setTextColor(TEXT_COLOR);
    doc.setFont('helvetica', 'bold');
    doc.text(`牌名：${card.name}`, margin, y);
    y += 8;
    doc.text(`日期：${today}`, margin, y);
    y += 15;

    // 分隔线
    doc.line(margin, y, pageWidth - margin, y);
    y += 10;

    // 笔记内容标题
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(GOLD_COLOR);
    doc.text('笔记内容', pageWidth / 2, y, { align: 'center' });
    y += 10;

    // 笔记内容
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(TEXT_COLOR);
    
    const splitText = doc.splitTextToSize(note, pageWidth - 2 * margin);
    doc.text(splitText, margin, y);
    
    y += splitText.length * 7 + 15;

    // 页脚
    doc.setFontSize(10);
    doc.setTextColor(GOLD_COLOR);
    doc.text('你的塔塔书 - your-tarot-diary.space', pageWidth / 2, pageHeight - 15, { align: 'center' });
  });

  doc.save(`单牌笔记-${today}.pdf`);
};

export const exportSpreadNotesToPDF = async (spreads: SpreadRecord[]) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  let y = margin;

  const today = new Date().toISOString().split('T')[0];

  if (spreads.length === 0) {
    alert('请选择牌阵进行导出');
    return;
  }

  spreads.forEach((spread, index) => {
    if (index > 0) {
      doc.addPage();
      y = margin;
    }

    // 页面边框
    doc.setDrawColor(GOLD_COLOR);
    doc.setLineWidth(1);
    doc.rect(margin - 5, margin - 5, pageWidth - 2 * (margin - 5), pageHeight - 2 * (margin - 5));

    // 标题
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.setTextColor(GOLD_COLOR);
    doc.text('你的塔塔书 - 牌阵笔记', pageWidth / 2, y, { align: 'center' });
    y += 15;

    // 分隔线
    doc.setDrawColor(GOLD_COLOR);
    doc.setLineWidth(0.5);
    doc.line(margin, y, pageWidth - margin, y);
    y += 10;

    // 基本信息
    doc.setFontSize(12);
    doc.setTextColor(TEXT_COLOR);
    doc.setFont('helvetica', 'bold');
    
    const dateObj = new Date(spread.date);
    const formattedDate = dateObj.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    doc.text(`占卜日期：${formattedDate}`, margin, y);
    y += 8;
    
    if (spread.clientName) {
      doc.text(`当事人称呼：${spread.clientName}`, margin, y);
      y += 8;
    }
    
    doc.setFont('helvetica', 'normal');
    const questionText = doc.splitTextToSize(`占卜问题：${spread.question || '无'}`, pageWidth - 2 * margin);
    doc.text(questionText, margin, y);
    y += questionText.length * 7 + 10;

    // 分隔线
    doc.line(margin, y, pageWidth - margin, y);
    y += 10;

    // 牌阵部分
    if (spread.cards.length > 0) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.setTextColor(GOLD_COLOR);
      doc.text('牌阵', pageWidth / 2, y, { align: 'center' });
      y += 10;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      doc.setTextColor(TEXT_COLOR);
      
      spread.cards.forEach((spreadCard, cardIdx) => {
        const tarotCard = TAROT_DECK.find(c => c.id === spreadCard.cardId);
        if (tarotCard) {
          const positionMeaning = spreadCard.positionMeaning ? ` - ${spreadCard.positionMeaning}` : '';
          const reversedText = spreadCard.isReversed ? '（逆位）' : '（正位）';
          doc.text(`${cardIdx + 1}. ${tarotCard.name}${reversedText}${positionMeaning}`, margin, y);
          y += 7;
        }
      });
      y += 5;
    }

    // 完整解读部分
    if (spread.interpretation && spread.interpretation.trim()) {
      doc.setDrawColor(GOLD_COLOR);
      doc.line(margin, y, pageWidth - margin, y);
      y += 10;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.setTextColor(GOLD_COLOR);
      doc.text('完整解读', pageWidth / 2, y, { align: 'center' });
      y += 10;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      doc.setTextColor(TEXT_COLOR);
      
      const interpretationText = doc.splitTextToSize(spread.interpretation, pageWidth - 2 * margin);
      doc.text(interpretationText, margin, y);
      y += interpretationText.length * 7 + 10;
    }

    // 总结复盘部分
    if (spread.summary && spread.summary.trim()) {
      doc.setDrawColor(GOLD_COLOR);
      doc.line(margin, y, pageWidth - margin, y);
      y += 10;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.setTextColor(GOLD_COLOR);
      doc.text('总结复盘', pageWidth / 2, y, { align: 'center' });
      y += 10;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      doc.setTextColor(TEXT_COLOR);
      
      const summaryText = doc.splitTextToSize(spread.summary, pageWidth - 2 * margin);
      doc.text(summaryText, margin, y);
      y += summaryText.length * 7 + 10;
    }

    // 页脚
    doc.setFontSize(10);
    doc.setTextColor(GOLD_COLOR);
    doc.text('你的塔塔书 - your-tarot-diary.space', pageWidth / 2, pageHeight - 15, { align: 'center' });
  });

  doc.save(`牌阵笔记-${today}.pdf`);
};
