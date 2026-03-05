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
          padding: 30px;
        }
        .document-header {
          text-align: center;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 2px solid ${GOLD_COLOR};
        }
        .document-title {
          font-size: 28px;
          color: ${GOLD_COLOR};
          font-weight: bold;
        }
        .document-date {
          color: #666;
          font-size: 14px;
          margin-top: 10px;
        }
        .note-item {
          margin-bottom: 40px;
          padding-bottom: 30px;
          border-bottom: 1px dashed #ccc;
        }
        .note-item:last-child {
          border-bottom: none;
          margin-bottom: 0;
          padding-bottom: 0;
        }
        .card-name {
          font-size: 20px;
          font-weight: bold;
          color: ${GOLD_COLOR};
          margin-bottom: 10px;
        }
        .note-content {
          line-height: 1.8;
          color: #333;
          white-space: pre-wrap;
          font-size: 14px;
        }
        .document-footer {
          text-align: center;
          margin-top: 50px;
          padding-top: 20px;
          border-top: 2px solid ${GOLD_COLOR};
          color: ${GOLD_COLOR};
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="document-header">
        <div class="document-title">你的塔塔书 - 单牌笔记</div>
        <div class="document-date">导出日期：${today}</div>
      </div>
  `;

  cardsToExport.forEach((item) => {
    const { card, note } = item;
    htmlContent += `
      <div class="note-item">
        <div class="card-name">${card.name}</div>
        <div class="note-content">${note.replace(/\n/g, '<br>')}</div>
      </div>
    `;
  });

  htmlContent += `
      <div class="document-footer">
        你的塔塔书 - your-tarot-diary.space
      </div>
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
          padding: 30px;
        }
        .document-header {
          text-align: center;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 2px solid ${GOLD_COLOR};
        }
        .document-title {
          font-size: 28px;
          color: ${GOLD_COLOR};
          font-weight: bold;
        }
        .document-date {
          color: #666;
          font-size: 14px;
          margin-top: 10px;
        }
        .spread-item {
          margin-bottom: 50px;
          padding-bottom: 40px;
          border-bottom: 1px dashed #ccc;
        }
        .spread-item:last-child {
          border-bottom: none;
          margin-bottom: 0;
          padding-bottom: 0;
        }
        .spread-title {
          font-size: 20px;
          font-weight: bold;
          color: ${GOLD_COLOR};
          margin-bottom: 15px;
        }
        .info-item {
          margin: 8px 0;
        }
        .info-label {
          font-weight: bold;
          color: ${GOLD_COLOR};
        }
        .card-list {
          margin: 15px 0;
        }
        .card-item {
          margin: 6px 0;
          padding-left: 20px;
        }
        .section-title {
          font-size: 16px;
          font-weight: bold;
          color: ${GOLD_COLOR};
          margin: 20px 0 10px 0;
        }
        .content {
          line-height: 1.8;
          color: #333;
          white-space: pre-wrap;
          font-size: 14px;
        }
        .document-footer {
          text-align: center;
          margin-top: 50px;
          padding-top: 20px;
          border-top: 2px solid ${GOLD_COLOR};
          color: ${GOLD_COLOR};
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="document-header">
        <div class="document-title">你的塔塔书 - 牌阵笔记</div>
        <div class="document-date">导出日期：${today}</div>
      </div>
  `;

  spreads.forEach((spread, index) => {
    const dateObj = new Date(spread.date);
    const formattedDate = dateObj.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    htmlContent += `
      <div class="spread-item">
        <div class="spread-title">记录 ${index + 1}</div>
        <div class="info-item"><span class="info-label">占卜日期：</span>${formattedDate}</div>
        ${spread.clientName ? `<div class="info-item"><span class="info-label">当事人称呼：</span>${spread.clientName}</div>` : ''}
        <div class="info-item"><span class="info-label">占卜问题：</span>${spread.question || '无'}</div>
    `;

    if (spread.cards.length > 0) {
      htmlContent += `<div class="section-title">牌阵</div><div class="card-list">`;
      spread.cards.forEach((spreadCard, cardIdx) => {
        const tarotCard = TAROT_DECK.find(c => c.id === spreadCard.cardId);
        if (tarotCard) {
          const positionMeaning = spreadCard.positionMeaning ? ` - ${spreadCard.positionMeaning}` : '';
          const reversedText = spreadCard.isReversed ? '（逆位）' : '（正位）';
          htmlContent += `<div class="card-item">${cardIdx + 1}. ${tarotCard.name}${reversedText}${positionMeaning}</div>`;
        }
      });
      htmlContent += `</div>`;
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

    htmlContent += `</div>`;
  });

  htmlContent += `
      <div class="document-footer">
        你的塔塔书 - your-tarot-diary.space
      </div>
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
