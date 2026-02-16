# 邀请码系统使用说明

## 第一步：获取 Firebase 服务账号密钥

1. 打开 [Firebase 控制台](https://console.firebase.google.com/)
2. 选择你的项目 → 点击 ⚙️ 项目设置
3. 选择"服务账号"标签页
4. 点击"生成新的私钥"按钮
5. 下载 JSON 文件，**重命名为** `serviceAccountKey.json`
6. 把文件放在项目根目录下（和 package.json 同级）

⚠️ **重要：** 不要把 `serviceAccountKey.json` 提交到 git！这个文件包含你的 Firebase 管理员权限！

---

## 第二步：批量生成邀请码

### 方法1：使用 npm 脚本（推荐）

```bash
# 生成 10 个邀请码（默认）
npm run generate-invites

# 生成指定数量，比如 50 个
npm run generate-invites 50
```

### 方法2：直接运行 node

```bash
# 生成 10 个邀请码
node scripts/generate-invites.js

# 生成 50 个邀请码
node scripts/generate-invites.js 50
```

---

## 第三步：查看生成的邀请码

脚本运行成功后会：
1. 在终端显示所有生成的邀请码
2. 自动保存到 `invites-generated.txt` 文件中

---

## 邀请码数据结构

每个邀请码在 Firestore 中的结构：

```javascript
{
  code: "ABC123XYZ",        // 邀请码
  used: false,               // 是否已使用
  usedBy: "",                // 使用者的 UID
  maxUses: 1,                // 最大使用次数
  createdAt: "2026-02-16..." // 创建时间
}
```

---

## 常见问题

### Q: 脚本报错说找不到 serviceAccountKey.json？
A: 确保你已经下载了 Firebase 服务账号密钥，并重命名为 `serviceAccountKey.json` 放在项目根目录。

### Q: 如何删除已使用的邀请码？
A: 在 Firebase 控制台 → Firestore Database → inviteCodes 集合中手动删除，或者可以写一个清理脚本。

### Q: 可以让一个邀请码被多人使用吗？
A: 可以！修改脚本中的 `maxUses` 字段为你想要的数字（比如 5 表示可以被使用 5 次），然后修改 AuthModal 中的验证逻辑。

---

## 安全提示

- 🔐 `serviceAccountKey.json` 包含管理员权限，**绝对不要**分享或提交到公开仓库
- 📝 定期检查 Firestore 中的邀请码使用情况
- 🛡️ 如果发现滥用，可以在 Firebase 控制台中禁用相关账号
