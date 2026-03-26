# PDF简历导出功能使用指南

## 功能说明

已为你的简历网站添加**标准PDF导出功能**，支持一键导出标准格式PDF简历。

## 使用方法

1. 在网站上点击"导出简历"按钮
2. 在弹出的模态框中选择要包含的实习经历和项目
3. 点击**"导出标准PDF"**按钮（绿色按钮）
4. PDF文件会自动下载到你的电脑

## 功能特点

✅ **格式一致**：采用与参考简历完全相同的布局和样式
✅ **中文支持**：使用思源黑体（Noto Sans SC），完美支持中文
✅ **一键导出**：无需手动调整，直接生成标准格式PDF
✅ **可定制**：支持选择不同的实习和项目经历

## 技术实现

使用 `@react-pdf/renderer` 库，特点：
- **跨平台一致**：在任何设备上生成的PDF格式完全相同
- **可编程控制**：每个像素都可精确控制
- **纯前端**：无需后端服务器

## 当前状态

### ✅ 已完成
- PDF生成器组件 (`lib/ResumePDFGenerator.tsx`)
- 导出工具函数 (`lib/exportResumePDF.tsx`)
- UI按钮集成 (在 `ResumeExportModal.tsx` 中添加了"导出标准PDF"按钮)
- 中文字体支持
- 标准简历格式（教育背景、实习经历、项目经历、技能证书）

### 🔧 待优化项

#### 1. **图片支持**（Logo和证件照）

参考简历顶部包含：
- 天津大学Logo（左侧）
- 证件照（右侧）

当前已准备好图片显示位置，需要添加图片数据：

**选项A：使用Base64编码**（推荐）
```typescript
// 在 lib/exportResumePDF.tsx 中
basic: {
  logoUrl: 'data:image/png;base64,iVBORw0KGgoAAAANS...', // base64编码
  photoUrl: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABA...', // base64编码
}
```

**选项B：使用在线URL**
```typescript
basic: {
  logoUrl: 'https://your-domain.com/logos/tju_logo.png',
  photoUrl: 'https://your-domain.com/images/profile.jpg',
}
```

**生成Base64的方法：**
```bash
# 在命令行运行
cd public/images
cat profile.jpg | base64 > profile_base64.txt

cd ../logos
# SVG需要先转换为PNG
```

#### 2. **数据映射优化**

当前 `prepareResumeData()` 函数已经针对示例实习经历做了映射。如果有新的实习，需要在该函数中添加对应的映射逻辑。

#### 3. **样式微调**

如果生成的PDF与参考简历有细微差异，可以调整 `lib/ResumePDFGenerator.tsx` 中的样式：

```typescript
const styles = StyleSheet.create({
  // 调整字体大小
  page: {
    fontSize: 10, // 调整这里
  },
  // 调整行距
  bulletText: {
    lineHeight: 1.5, // 调整这里
  },
  // 调整边距
  educationItem: {
    marginBottom: 8, // 调整这里
  },
});
```

## 故障排除

### 问题1：PDF下载失败

**原因**：浏览器阻止了下载或生成失败

**解决方法**：
1. 检查浏览器控制台是否有错误信息
2. 确保允许浏览器下载文件
3. 尝试清除浏览器缓存后重试

### 问题2：中文显示为方块

**原因**：字体加载失败

**解决方法**：
1. 检查网络连接（字体从Google Fonts加载）
2. 在 `lib/ResumePDFGenerator.tsx` 中更换其他中文字体链接

### 问题3：格式与参考不一致

**解决方法**：
在 `lib/ResumePDFGenerator.tsx` 中调整对应的样式值，参考上面的"样式微调"部分。

## 下一步优化建议

1. **添加图片**：将Logo和证件照转换为base64添加到PDF中
2. **字体优化**：如果Google Fonts加载慢，可以考虑使用本地字体
3. **批量导出**：添加一键导出多个版本（如针对不同岗位）
4. **自定义模板**：创建多个简历模板供选择

## 技术支持

如有问题，请检查：
- `lib/ResumePDFGenerator.tsx` - PDF组件定义
- `lib/exportResumePDF.tsx` - 数据准备和导出逻辑
- `components/ResumeExportModal.tsx` - UI按钮集成

开发服务器：`npm run dev` （默认端口3000，如被占用会自动切换到3001）
