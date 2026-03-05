import { TarotCard, SpreadRecord, Notes } from '../types';
import { TAROT_DECK } from '../constants';

const GOLD_COLOR = '#D4AF37';
const BG_COLOR = '#1F204A';
const CARD_BG = '#2A2B55';

export const exportSingleCardNotesToPrint = async (
  notes: Notes,
  selectedCardIds: number[]
) => {
  const cardsToExport = selectedCardIds
    .map(id => ({ card: TAROT_DECK.find(c => c.id === id), note: notes[id] }))
    .filter(item => item.card && item.note && item.note.trim()) as { card: TarotCard; note: string }[];

  if (cardsToExport.length === 0) {
    alert('请选择有笔记的牌进行导出');
    return;
  }

  const today = new Date().toLocaleDateString('zh-CN');

  let htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>单牌笔记 - 你的塔塔书</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "PingFang SC", "Microsoft YaHei", sans-serif;
          background: white;
          padding: 20px;
        }
        .page {
          page-break-after: always;
          padding: 30px;
          border: 2px solid ${GOLD_COLOR};
          margin-bottom: 20px;
        }
        .header {
          text-align: center;
          margin-bottom: 20px;
          padding-bottom: 15px;
          border-bottom: 1px solid ${GOLD_COLOR};
        }
        .title {
          font-size: 24px;
          color: ${GOLD_COLOR};
          font-weight: bold;
        }
        .card-info {
          margin-bottom: 15px;
        }
        .card-name {
          font-size: 18px;
          font-weight: bold;
          color: ${GOLD_COLOR};
          margin-bottom: 5px;
        }
        .date {
          color: #666;
          font-size: 14px;
        }
        .section-title {
          font-size: 16px;
          font-weight: bold;
          color: ${GOLD_COLOR};
          margin: 20px 0 10px 0;
          padding-bottom: 5px;
          border-bottom: 1px solid ${GOLD_COLOR};
          text-align: center;
        }
        .note-content {
          line-height: 1.8;
          color: #333;
          white-space: pre-wrap;
          font-size: 14px;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          padding-top: 15px;
          border-top: 1px solid ${GOLD_COLOR};
          color: ${GOLD_COLOR};
          font-size: 12px;
        }
        @media print {
          .page { border: 2px solid ${GOLD_COLOR} !important; }
        }
      </style>
    </head>
    <body>
  `;

  cardsToExport.forEach((item) => {
    const { card, note } = item;
    htmlContent += `
      <div class="page">
        <div class="header">
          <div class="title">你的塔塔书 - 单牌笔记</div>
        </div>
        <div class="card-info">
          <div class="card-name">${card.name}</div>
          <div class="date">日期：${today}</div>
        </div>
        <div class="section-title">笔记内容</div>
        <div class="note-content">${note.replace(/\n/g, '<br>')}</div>
        <div class="footer">你的塔塔书 - your-tarot-diary.space</div>
      </div>
    `;
  });

  htmlContent += `
    </body>
    </html>
  `;

  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.onload = () => {
      printWindow.print();
    };
  }
};

export const exportSpreadNotesToPrint = async (spreads: SpreadRecord[]) => {
  if (spreads.length === 0) {
    alert('请选择牌阵进行导出');
    return;
  }

  const today = new Date().toLocaleDateString('zh-CN');

  let htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>牌阵笔记 - 你的塔塔书</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "PingFang SC", "Microsoft YaHei", sans-serif;
          background: white;
          padding: 20px;
        }
        .page {
          page-break-after: always;
          padding: 30px;
          border: 2px solid ${GOLD_COLOR};
          margin-bottom: 20px;
        }
        .header {
          text-align: center;
          margin-bottom: 20px;
          padding-bottom: 15px;
          border-bottom: 1px solid ${GOLD_COLOR};
        }
        .title {
          font-size: 24px;
          color: ${GOLD_COLOR};
          font-weight: bold;
        }
        .info-item {
          margin: 8px 0;
        }
        .info-label {
          font-weight: bold;
          color: ${GOLD_COLOR};
        }
        .section-title {
          font-size: 16px;
          font-weight: bold;
          color: ${GOLD_COLOR};
          margin: 20px 0 10px 0;
          padding-bottom: 5px;
          border-bottom: 1px solid ${GOLD_COLOR};
          text-align: center;
        }
        .card-item {
          margin: 8px 0;
          padding-left: 20px;
        }
        .content {
          line-height: 1.8;
          color: #333;
          white-space: pre-wrap;
          font-size: 14px;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          padding-top: 15px;
          border-top: 1px solid ${GOLD_COLOR};
          color: ${GOLD_COLOR};
          font-size: 12px;
        }
        @media print {
          .page { border: 2px solid ${GOLD_COLOR} !important; }
        }
      </style>
    </head>
    <body>
  `;

  spreads.forEach((spread) => {
    const dateObj = new Date(spread.date);
    const formattedDate = dateObj.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    htmlContent += `
      <div class="page">
        <div class="header">
          <div class="title">你的塔塔书 - 牌阵笔记</div>
        </div>
        <div class="info-item"><span class="info-label">占卜日期：</span>${formattedDate}</div>
        ${spread.clientName ? `<div class="info-item"><span class="info-label">当事人称呼：</span>${spread.clientName}</div>` : ''}
        <div class="info-item"><span class="info-label">占卜问题：</span>${spread.question || '无'}</div>
    `;

    if (spread.cards.length > 0) {
      htmlContent += `<div class="section-title">牌阵</div>`;
      spread.cards.forEach((spreadCard, cardIdx) => {
        const tarotCard = TAROT_DECK.find(c => c.id === spreadCard.cardId);
        if (tarotCard) {
          const positionMeaning = spreadCard.positionMeaning ? ` - ${spreadCard.positionMeaning}` : '';
          const reversedText = spreadCard.isReversed ? '（逆位）' : '（正位）';
          htmlContent += `<div class="card-item">${cardIdx + 1}. ${tarotCard.name}${reversedText}${positionMeaning}</div>`;
        }
      });
    }

    if (spread.interpretation && spread.interpretation.trim()) {
      htmlContent += `
        <div class="section-title">完整解读</div>
        <div class="content">${spread.interpretation.replace(/\n/g, '<br>')}</div>
      `;
    }

    if (spread.summary && spread.summary.trim()) {
      htmlContent += `
        <div class="section-title">总结复盘</div>
        <div class="content">${spread.summary.replace(/\n/g, '<br>')}</div>
      `;
    }

    htmlContent += `
        <div class="footer">你的塔塔书 - your-tarot-diary.space</div>
      </div>
    `;
  });

  htmlContent += `
    </body>
    </html>
  `;

  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.onload = () => {
      printWindow.print();
    };
  }
};
