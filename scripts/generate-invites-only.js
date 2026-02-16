#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import admin from 'firebase-admin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let serviceAccount;
try {
  const serviceAccountPath = path.join(__dirname, '..', 'serviceAccountKey.json');
  serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
  console.log('✅ 找到 Firebase 服务账号密钥');
} catch (e) {
  console.error('❌ 未找到 serviceAccountKey.json 文件！');
  console.error('请确保 serviceAccountKey.json 在项目根目录');
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

function generateInviteCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

const count = parseInt(process.argv[2]) || 10;

console.log(`\n✨ 开始生成 ${count} 个邀请码...\n`);

const inviteCodes = [];
for (let i = 0; i < count; i++) {
  inviteCodes.push(generateInviteCode());
}

console.log('✅ 成功生成以下邀请码：\n');
inviteCodes.forEach((code, index) => {
  console.log(`  ${index + 1}. ${code}`);
});

const outputPath = path.join(__dirname, '..', 'invites-generated.txt');
fs.writeFileSync(outputPath, inviteCodes.join('\n'), 'utf8');
console.log(`\n📝 邀请码已保存到: ${outputPath}`);

console.log('\n🚀 开始上传到 Firebase Firestore...\n');

const batch = db.batch();
const inviteCodesRef = db.collection('inviteCodes');

inviteCodes.forEach((code) => {
  const docRef = inviteCodesRef.doc(code);
  batch.set(docRef, {
    code: code,
    used: false,
    usedBy: '',
    maxUses: 1,
    createdAt: new Date().toISOString()
  });
});

batch.commit()
  .then(() => {
    console.log('🎉 成功上传所有邀请码到 Firebase！\n');
    console.log('📋 邀请码已保存到 invites-generated.txt 和 Firebase Firestore');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ 上传到 Firebase 失败：', error);
    process.exit(1);
  });
