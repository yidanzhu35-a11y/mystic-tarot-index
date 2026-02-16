import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 检查是否有 serviceAccountKey.json
const serviceAccountPath = path.join(__dirname, '..', 'serviceAccountKey.json');

if (!fs.existsSync(serviceAccountPath)) {
  console.error('❌ 错误：找不到 serviceAccountKey.json 文件！');
  console.log('\n📋 请按以下步骤操作：');
  console.log('1. 打开 Firebase 控制台 → 项目设置 → 服务账号');
  console.log('2. 点击"生成新的私钥"');
  console.log('3. 下载 JSON 文件，重命名为 serviceAccountKey.json');
  console.log('4. 放在项目根目录下\n');
  process.exit(1);
}

// 初始化 Firebase Admin
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// 生成邀请码函数
function generateCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// 批量添加邀请码
async function generateAndAddInvites(count = 10) {
  console.log(`\n✨ 开始生成 ${count} 个邀请码...\n`);
  
  const invites = [];
  const batch = db.batch();
  
  for (let i = 0; i < count; i++) {
    const code = generateCode();
    invites.push(code);
    
    const inviteRef = db.collection('inviteCodes').doc(code);
    batch.set(inviteRef, {
      code: code,
      used: false,
      usedBy: '',
      maxUses: 1,
      createdAt: new Date().toISOString()
    });
  }
  
  // 提交批量操作
  await batch.commit();
  
  console.log('✅ 成功生成以下邀请码：\n');
  invites.forEach((code, index) => {
    console.log(`  ${index + 1}. ${code}`);
  });
  
  // 保存到文件
  const outputPath = path.join(__dirname, '..', 'invites-generated.txt');
  fs.writeFileSync(outputPath, invites.join('\n'));
  console.log(`\n📝 邀请码已保存到: ${outputPath}`);
  console.log('\n🎉 完成！\n');
  
  process.exit(0);
}

// 获取命令行参数
const args = process.argv.slice(2);
const count = args[0] ? parseInt(args[0]) : 10;

generateAndAddInvites(count).catch((error) => {
  console.error('❌ 发生错误：', error);
  process.exit(1);
});
