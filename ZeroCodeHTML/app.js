'use strict';

/* ============================================================
   HTML炼金工坊 · 零代码网页创作
   纯前端实现：拖拽画板 / 参数调整 / 实时代码 / CSS 优化
   ============================================================ */

const STORAGE_KEY = 'lanmo-workbench-v1';
const UI_FONT_KEY = 'lanmo-ui-font-size';
const CANVAS_W = 900;
const CANVAS_H = 600;
const HISTORY_LIMIT = 60;

const DEFAULT_IMAGE = 'assets/hero.svg';

const THEMES = {
  ocean: {
    name: '海盐蓝',
    accent: '#2f6bff',
    soft: '#eaf1ff',
    page: '#ffffff',
    card: '#f7faff',
    swatches: ['#2f6bff', '#eaf1ff', '#ffffff']
  },
  mint: {
    name: '薄荷青',
    accent: '#0ea97a',
    soft: '#e7f9f2',
    page: '#fbfffd',
    card: '#f5fcf9',
    swatches: ['#0ea97a', '#e7f9f2', '#fbfffd']
  },
  sunset: {
    name: '暖阳橙',
    accent: '#e8890c',
    soft: '#fff4e2',
    page: '#fffdf8',
    card: '#fffaf1',
    swatches: ['#e8890c', '#fff4e2', '#fffdf8']
  },
  sakura: {
    name: '樱雾粉',
    accent: '#e2558f',
    soft: '#fff0f6',
    page: '#fffafc',
    card: '#fff7fa',
    swatches: ['#e2558f', '#fff0f6', '#fffafc']
  }
};

const ACCENT_COLORS = ['#2f6bff', '#0ea5e9', '#0ea97a', '#7c5cff', '#e8890c', '#e2558f', '#475569'];

const CATALOG = [
  {
    type: 'heading',
    category: 'basic',
    name: '标题',
    desc: '主标题 / 区块标题',
    icon: 'heading',
    uiClass: 'ui-heading',
    tone: 'blue',
    width: 470,
    defaults: {
      text: '让创意，被看见',
      fontSize: 46,
      fontWeight: 700,
      color: '#14243c',
      align: 'left',
      lineHeight: 1.16,
      letterSpacing: -1.2
    }
  },
  {
    type: 'paragraph',
    category: 'basic',
    name: '段落',
    desc: '正文 / 说明文字',
    icon: 'paragraph',
    uiClass: 'ui-paragraph',
    tone: 'blue',
    width: 410,
    defaults: {
      text: '在这里写下一段文字，向读者介绍你的想法。',
      fontSize: 15,
      color: '#596981',
      align: 'left',
      lineHeight: 1.8,
      letterSpacing: 0
    }
  },
  {
    type: 'image',
    category: 'basic',
    name: '图片',
    desc: '照片 / 插图',
    icon: 'image',
    uiClass: 'ui-image',
    tone: 'mint',
    width: 292,
    defaults: {
      src: DEFAULT_IMAGE,
      alt: '同学们在合作完成网页作品',
      radius: 22,
      shadow: true,
      aspect: 1.38,
      fit: 'cover',
      bg: '#eaf1fb'
    }
  },
  {
    type: 'button',
    category: 'basic',
    name: '按钮',
    desc: '行动按钮 / 链接',
    icon: 'button',
    uiClass: 'ui-button',
    tone: 'blue',
    width: 136,
    defaults: {
      text: '开始探索',
      variant: 'primary',
      bg: '#2f6bff',
      color: '#ffffff',
      border: '#2f6bff',
      fontSize: 14,
      radius: 12,
      paddingX: 20,
      paddingY: 12,
      shadow: true
    }
  },
  {
    type: 'link',
    category: 'basic',
    name: '超链接',
    desc: '跳转网页 / 锚点',
    icon: 'link',
    uiClass: 'ui-link',
    tone: 'mint',
    width: 200,
    defaults: {
      text: '访问示例网站',
      href: 'https://www.example.com',
      target: '_blank',
      color: '#2f6bff',
      fontSize: 13.5,
      underline: true
    }
  },
  {
    type: 'badge',
    category: 'basic',
    name: '标签',
    desc: '分类 / 状态标记',
    icon: 'badge',
    uiClass: 'ui-badge',
    tone: 'amber',
    width: 246,
    defaults: {
      text: '信息科技 · 零代码工坊',
      color: '#2f6bff',
      bg: '#eaf1ff',
      border: '#d9e6ff',
      fontSize: 11.5,
      radius: 999
    }
  },
  {
    type: 'divider',
    category: 'basic',
    name: '分割线',
    desc: '划分内容层次',
    icon: 'divider',
    uiClass: 'ui-divider',
    tone: 'blue',
    width: 320,
    defaults: {
      color: '#dbe6f4',
      thickness: 1
    }
  },
  {
    type: 'form',
    category: 'form',
    name: '联系表单',
    desc: '留言 / 收集信息',
    icon: 'form',
    uiClass: 'ui-form',
    tone: 'violet',
    width: 360,
    defaults: {
      title: '留下你的想法',
      subtitle: '我们会认真阅读每一条留言',
      buttonText: '发送留言',
      bg: '#f7faff',
      accent: '#2f6bff',
      radius: 20,
      shadow: true
    }
  },
  {
    type: 'input',
    category: 'form',
    name: '输入框',
    desc: '姓名 / 邮箱',
    icon: 'input',
    uiClass: 'ui-field',
    tone: 'violet',
    width: 260,
    defaults: {
      label: '你的名字',
      placeholder: '请输入姓名',
      bg: '#ffffff',
      accent: '#2f6bff',
      radius: 10
    }
  },
  {
    type: 'textarea',
    category: 'form',
    name: '多行文本',
    desc: '留言 / 建议',
    icon: 'textarea',
    uiClass: 'ui-field',
    tone: 'violet',
    width: 300,
    defaults: {
      label: '留言内容',
      placeholder: '写下你想说的话…',
      bg: '#ffffff',
      accent: '#2f6bff',
      radius: 10
    }
  },
  {
    type: 'select',
    category: 'form',
    name: '下拉菜单',
    desc: '多个选项中选择',
    icon: 'select',
    uiClass: 'ui-field',
    tone: 'violet',
    width: 260,
    defaults: {
      label: '最喜欢的学科',
      options: '信息科技\n语文\n数学\n艺术',
      bg: '#ffffff',
      accent: '#2f6bff',
      radius: 10
    }
  },
  {
    type: 'checkbox',
    category: 'form',
    name: '复选框',
    desc: '同意 / 多选',
    icon: 'checkbox',
    uiClass: 'ui-checkbox',
    tone: 'violet',
    width: 300,
    defaults: {
      label: '我已阅读并同意《创作公约》',
      checked: true,
      accent: '#2f6bff'
    }
  },
  {
    type: 'card',
    category: 'layout',
    name: '内容卡片',
    desc: '标签 + 标题 + 正文',
    icon: 'card',
    uiClass: 'ui-card',
    tone: 'blue',
    width: 350,
    defaults: {
      tag: '今日任务',
      title: '让文字与图片找到平衡',
      text: '完成一张包含 3 个组件的网页，并为它挑选统一的颜色与圆角。',
      bg: '#f7faff',
      accent: '#2f6bff',
      radius: 20,
      shadow: true
    }
  },
  {
    type: 'quote',
    category: 'layout',
    name: '引用块',
    desc: '金句 / 创作心得',
    icon: 'quote',
    uiClass: 'ui-quote',
    tone: 'amber',
    width: 340,
    defaults: {
      text: '先完成，再完美。',
      cite: '—— 创作小贴士',
      bg: '#f8fbff',
      color: '#334155',
      accent: '#2f6bff',
      radius: 16
    }
  },
  {
    type: 'tip',
    category: 'layout',
    name: '提示条',
    desc: '小提示 / 注意事项',
    icon: 'tip',
    uiClass: 'ui-tip',
    tone: 'mint',
    width: 400,
    defaults: {
      text: '点击任意组件，右侧参数会立即亮起。试着调整字号和颜色吧。',
      bg: '#eef5ff',
      color: '#41536d',
      accent: '#2f6bff',
      radius: 14
    }
  },
  {
    type: 'list',
    category: 'layout',
    name: '列表',
    desc: '有序 / 无序列表',
    icon: 'list',
    uiClass: 'ui-list',
    tone: 'violet',
    width: 420,
    defaults: {
      items: '选择组件\n拖动到画板\n调整样式',
      ordered: false,
      fontSize: 14,
      color: '#455671',
      accent: '#2f6bff',
      lineHeight: 1.9
    }
  },
  {
    type: 'table',
    category: 'layout',
    name: '表格',
    desc: '表头 / 数据行',
    icon: 'table',
    uiClass: 'ui-table',
    tone: 'blue',
    width: 520,
    defaults: {
      headers: '姓名 | 学科 | 分数',
      rows: '小林 | 信息科技 | 95\n小周 | 数学 | 92\n小夏 | 艺术 | 98',
      fontSize: 11.5,
      color: '#455671',
      headerBg: '#eef5ff',
      headerColor: '#2f6bff',
      borderColor: '#e2eaf5',
      radius: 12,
      stripe: true,
      shadow: true
    }
  },
  {
    type: 'audio',
    category: 'media',
    name: '音频',
    desc: '播放声音 / 音乐',
    icon: 'audio',
    uiClass: 'ui-audio',
    tone: 'mint',
    width: 360,
    defaults: {
      title: '示例音频',
      src: 'https://www.w3schools.com/html/horse.mp3',
      bg: '#f7faff',
      accent: '#2f6bff',
      radius: 16
    }
  },
  {
    type: 'video',
    category: 'media',
    name: '视频',
    desc: '播放视频片段',
    icon: 'video',
    uiClass: 'ui-video',
    tone: 'rose',
    width: 380,
    defaults: {
      title: '示例视频',
      src: 'https://www.w3schools.com/html/mov_bbb.mp4',
      poster: 'assets/hero.svg',
      bg: '#f7faff',
      accent: '#2f6bff',
      radius: 16,
      shadow: true
    }
  },
  {
    type: 'glow',
    category: 'decor',
    name: '光晕',
    desc: '柔和背景装饰',
    icon: 'glow',
    uiClass: 'ui-glow',
    tone: 'mint',
    width: 160,
    defaults: {
      color: '#5b8fff',
      opacity: 0.32,
      blur: 10
    }
  },
  {
    type: 'sticker',
    category: 'decor',
    name: '星标贴纸',
    desc: '点缀画面的符号',
    icon: 'sticker',
    uiClass: 'ui-sticker',
    tone: 'amber',
    width: 52,
    defaults: {
      text: '✦',
      color: '#7fa8ff',
      fontSize: 48,
      rotate: -8,
      opacity: 1
    }
  },
  {
    type: 'decoicon',
    category: 'decor',
    name: '装饰图标',
    desc: '圆形图标徽章',
    icon: 'star',
    uiClass: 'ui-deco-icon',
    tone: 'violet',
    width: 54,
    defaults: {
      text: '✦',
      bg: '#eef5ff',
      color: '#2f6bff',
      fontSize: 24,
      radius: 16,
      shadow: false
    }
  }
];

const COMPONENT_CSS = `
/* ---------- 组件基础样式 ---------- */
.ui-heading,
.ui-paragraph {
  margin: 0;
  white-space: pre-wrap;
  overflow-wrap: break-word;
}

.ui-image {
  display: block;
  overflow: hidden;
}

.ui-image img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: var(--image-fit, cover);
}

.ui-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-family: inherit;
  font-weight: 650;
  line-height: 1.2;
  white-space: nowrap;
  cursor: pointer;
  transition: transform 0.18s ease, box-shadow 0.18s ease, filter 0.18s ease;
}

.ui-button::after {
  content: "→";
  font-size: 0.95em;
  transition: transform 0.18s ease;
}

.ui-button:hover {
  transform: translateY(-1px);
  filter: brightness(1.02);
}

.ui-button:hover::after {
  transform: translateX(3px);
}

.ui-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 1.3;
  letter-spacing: 0.02em;
  white-space: nowrap;
}

.ui-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-family: inherit;
  font-weight: 600;
  line-height: 1.4;
  text-underline-offset: 3px;
  transition: opacity 0.16s ease, transform 0.16s ease;
}

.ui-link::after {
  content: "↗";
  font-size: 0.92em;
  line-height: 1;
}

.ui-link:hover {
  opacity: 0.8;
  transform: translateX(1px);
}

.ui-divider {
  height: 0;
  padding: 0;
  margin: 0;
  border-right: 0;
  border-bottom: 0;
  border-left: 0;
}

/* ---------- 列表 ---------- */
.ui-list {
  font-family: inherit;
}

.ui-list .list-content {
  margin: 0;
  padding-left: 1.35em;
}

.ui-list li {
  padding-left: 2px;
  overflow-wrap: break-word;
}

.ui-list li::marker {
  color: var(--accent);
  font-weight: 700;
}

/* ---------- 表格 ---------- */
.ui-table {
  overflow: hidden;
  font-family: inherit;
}

.ui-table table {
  width: 100%;
  table-layout: fixed;
  border-collapse: separate;
  border-spacing: 0;
  font-size: inherit;
  color: inherit;
}

.ui-table th,
.ui-table td {
  padding: 8px 10px;
  border-bottom: 1px solid var(--table-border, #e2eaf5);
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ui-table th {
  background: var(--table-header-bg, #eef5ff);
  color: var(--table-header-color, #2f6bff);
  font-size: 0.94em;
  font-weight: 700;
  letter-spacing: 0.01em;
}

.ui-table tbody tr:last-child td {
  border-bottom: 0;
}

.ui-table.is-striped tbody tr:nth-child(even) td {
  background: var(--table-stripe, #f8fbff);
}

/* ---------- 音频 / 视频 ---------- */
.ui-audio,
.ui-video {
  display: flex;
  flex-direction: column;
  gap: 9px;
  font-family: inherit;
}

.ui-audio .media-head,
.ui-video .media-head {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.ui-audio .media-mark,
.ui-video .media-mark {
  width: 26px;
  height: 26px;
  display: grid;
  place-items: center;
  flex: 0 0 auto;
  border-radius: 8px;
  background: var(--accent, #2f6bff);
  color: #fff;
  font-size: 12px;
  font-weight: 700;
}

.ui-audio .media-copy,
.ui-video .media-copy {
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-width: 0;
}

.ui-audio .media-copy strong,
.ui-video .media-copy strong {
  overflow: hidden;
  color: #26364e;
  font-size: 11px;
  font-weight: 650;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ui-audio .media-copy small,
.ui-video .media-copy small {
  color: #8b9bb0;
  font-size: 7.5px;
  font-weight: 700;
  letter-spacing: 0.12em;
}

.ui-audio audio {
  width: 100%;
  height: 34px;
  display: block;
}

.ui-video .video-frame {
  overflow: hidden;
  border-radius: 9px;
  background: #101c30;
}

.ui-video video {
  display: block;
  width: 100%;
  aspect-ratio: 16 / 9;
  background: #101c30;
  object-fit: cover;
}

/* ---------- 联系表单 ---------- */
.ui-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  font-family: inherit;
}

.ui-form .form-kicker {
  display: block;
  color: var(--accent);
  font-size: 8px;
  font-weight: 750;
  letter-spacing: 0.15em;
}

.ui-form h3 {
  margin: 4px 0 2px;
  color: #182942;
  font-size: 17px;
  font-weight: 750;
  letter-spacing: -0.2px;
  line-height: 1.25;
}

.ui-form .form-sub {
  margin: 0 0 2px;
  color: #7a8aa0;
  font-size: 9.5px;
  line-height: 1.55;
}

.ui-form .form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.ui-form .form-field {
  display: flex;
  flex-direction: column;
  gap: 4px;
  color: #62738a;
  font-size: 9px;
  font-weight: 600;
}

.ui-form .form-field input,
.ui-form .form-field textarea {
  width: 100%;
  border: 1px solid #dfe9f5;
  border-radius: 8px;
  background: #fff;
  color: #22344f;
  font-family: inherit;
  font-size: 10px;
  outline: none;
  transition: border-color 0.16s ease, box-shadow 0.16s ease;
}

.ui-form .form-field input {
  height: 31px;
  padding: 0 9px;
}

.ui-form .form-field textarea {
  height: 48px;
  padding: 7px 9px;
  line-height: 1.5;
  resize: none;
}

.ui-form .form-field input::placeholder,
.ui-form .form-field textarea::placeholder {
  color: #acb8c9;
}

.ui-form .form-field input:focus,
.ui-form .form-field textarea:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(47, 107, 255, 0.08);
}

.ui-form .form-submit {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  height: 34px;
  margin-top: 2px;
  border: 0;
  border-radius: 9px;
  background: var(--accent);
  color: #fff;
  font-family: inherit;
  font-size: 10px;
  font-weight: 650;
  cursor: pointer;
  transition: transform 0.16s ease, box-shadow 0.16s ease;
}

.ui-form .form-submit:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 16px rgba(22, 54, 105, 0.14);
}

.ui-form .form-submit span {
  font-size: 11px;
}

/* ---------- 表单字段 ---------- */
.ui-field {
  display: flex;
  flex-direction: column;
  gap: 5px;
  font-family: inherit;
}

.ui-field .field-label-text {
  color: #5f7088;
  font-size: 10px;
  font-weight: 650;
}

.ui-field .field-box {
  display: flex;
  align-items: center;
  height: 36px;
  padding: 0 10px;
  border: 1px solid #dde8f6;
  border-radius: var(--field-radius, 10px);
  background: var(--field-bg, #ffffff);
  transition: border-color 0.16s ease, box-shadow 0.16s ease;
}

.ui-field .field-box--area {
  height: auto;
  padding: 8px 10px;
}

.ui-field input,
.ui-field textarea,
.ui-field select {
  width: 100%;
  border: 0;
  outline: 0;
  background: transparent;
  color: #26364e;
  font-family: inherit;
  font-size: 10.5px;
}

.ui-field textarea {
  min-height: 54px;
  padding: 0;
  line-height: 1.55;
  resize: none;
}

.ui-field select {
  cursor: pointer;
}

.ui-field input::placeholder,
.ui-field textarea::placeholder {
  color: #a9b6c8;
}

.ui-field .field-box:focus-within {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(47, 107, 255, 0.08);
}

/* ---------- 复选框 ---------- */
.ui-checkbox {
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-family: inherit;
}

.ui-checkbox input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.ui-checkbox .box {
  position: relative;
  width: 16px;
  height: 16px;
  flex: 0 0 auto;
  border: 1.5px solid #c9d7e8;
  border-radius: 5px;
  background: #fff;
  transition: background 0.16s ease, border-color 0.16s ease;
}

.ui-checkbox .box::after {
  content: "";
  position: absolute;
  left: 4.5px;
  top: 1.5px;
  width: 4px;
  height: 8px;
  border: solid #fff;
  border-width: 0 1.5px 1.5px 0;
  transform: rotate(42deg) scale(0);
  transition: transform 0.16s ease;
}

.ui-checkbox input:checked + .box {
  border-color: var(--accent);
  background: var(--accent);
}

.ui-checkbox input:checked + .box::after {
  transform: rotate(42deg) scale(1);
}

.ui-checkbox .text {
  color: #4b5d75;
  font-size: 10.5px;
  line-height: 1.45;
}

/* ---------- 内容卡片 ---------- */
.ui-card {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-family: inherit;
}

.ui-card .card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.ui-card .card-tag {
  display: inline-flex;
  align-items: center;
  height: 20px;
  padding: 0 7px;
  border: 1px solid currentColor;
  border-radius: 5px;
  color: var(--accent);
  font-size: 8px;
  font-weight: 700;
  letter-spacing: 0.04em;
}

.ui-card .card-mark {
  width: 22px;
  height: 22px;
  display: grid;
  place-items: center;
  border-radius: 7px;
  background: var(--accent);
  color: #fff;
  font-size: 10px;
}

.ui-card h3 {
  margin: 1px 0 0;
  color: #1c2c45;
  font-size: 18px;
  font-weight: 750;
  letter-spacing: -0.3px;
  line-height: 1.3;
}

.ui-card p {
  margin: 0;
  color: #64748b;
  font-size: 10.5px;
  line-height: 1.75;
}

.ui-card .card-line {
  height: 1px;
  margin: 3px 0 1px;
  background: #e6eef9;
}

.ui-card .card-foot {
  display: flex;
  align-items: center;
  gap: 5px;
  color: var(--accent);
  font-size: 9px;
  font-weight: 650;
}

.ui-card .card-foot i {
  font-style: normal;
}

/* ---------- 引用 ---------- */
.ui-quote {
  margin: 0;
  border-left: 3px solid var(--accent);
  font-family: inherit;
}

.ui-quote .quote-mark {
  display: block;
  height: 20px;
  color: var(--accent);
  font-family: Georgia, "Times New Roman", serif;
  font-size: 34px;
  font-weight: 700;
  line-height: 1;
  opacity: 0.82;
}

.ui-quote p {
  margin: 0 0 6px;
  font-size: 13px;
  font-weight: 600;
  line-height: 1.65;
}

.ui-quote cite {
  color: #8a98aa;
  font-size: 9px;
  font-style: normal;
}

/* ---------- 提示条 ---------- */
.ui-tip {
  display: flex;
  align-items: flex-start;
  gap: 9px;
  font-family: inherit;
}

.ui-tip .tip-mark {
  width: 19px;
  height: 19px;
  display: grid;
  place-items: center;
  flex: 0 0 auto;
  margin-top: 1px;
  border-radius: 50%;
  background: var(--accent);
  color: #fff;
  font-size: 10px;
  font-weight: 800;
}

.ui-tip p {
  margin: 0;
  font-size: 10.5px;
  line-height: 1.7;
}

/* ---------- 装饰 ---------- */
.ui-glow {
  display: block;
}

.ui-sticker {
  display: block;
  font-family: Georgia, "Times New Roman", serif;
  font-weight: 700;
  text-align: center;
}

.ui-deco-icon {
  display: grid;
  place-items: center;
  font-family: Georgia, "Times New Roman", serif;
  font-weight: 700;
}
`;

/* ============================================================
   全局状态
   ============================================================ */

let state = {
  mode: 'build',
  codeView: 'html',
  selectedId: null,
  elements: [],
  pageTitle: '我的第一个网页',
  canvasBg: '#ffffff',
  design: {
    theme: 'ocean',
    accent: '#2f6bff',
    soft: '#eaf1ff',
    radius: 16,
    shadow: true
  },
  grid: true,
  nextId: 1
};

let historyStack = [];
let redoStack = [];
let currentCode = '';
let canvasScale = 1;
let uiFontSize = 'medium';
let dragState = null;
let editContext = null;
let editTimer = null;
let saveTimer = null;
let saveStatusTimer = null;
let codeRaf = null;
let lastFocusedElement = null;
let isSavingError = false;

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

const dom = {};

/* ============================================================
   基础工具
   ============================================================ */

function escapeHTML(value) {
  return String(value ?? '').replace(/[&<>"']/g, (char) => {
    const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
    return map[char];
  });
}

function escapeAttr(value) {
  return escapeHTML(value).replace(/\n/g, '&#10;');
}

function icon(name, extraClass = '') {
  return `<svg class="icon ${extraClass}" aria-hidden="true"><use href="#i-${name}"/></svg>`;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

function getDef(type) {
  return CATALOG.find((item) => item.type === type);
}

function getDisplayName(type) {
  return getDef(type)?.name || '组件';
}

function normalizeHex(value, fallback = '#2f6bff') {
  if (typeof value !== 'string') return fallback;
  let v = value.trim();
  if (!v.startsWith('#')) v = `#${v}`;
  if (/^#[0-9a-f]{3}$/i.test(v)) {
    v = `#${v[1]}${v[1]}${v[2]}${v[2]}${v[3]}${v[3]}`;
  }
  return /^#[0-9a-f]{6}$/i.test(v) ? v.toLowerCase() : fallback;
}

function hexToRgb(hex) {
  const normalized = normalizeHex(hex, '#2f6bff');
  return {
    r: parseInt(normalized.slice(1, 3), 16),
    g: parseInt(normalized.slice(3, 5), 16),
    b: parseInt(normalized.slice(5, 7), 16)
  };
}

function hexToRgba(hex, alpha = 1) {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function mixHex(hex, targetHex, amount = 0.5) {
  const source = hexToRgb(hex);
  const target = hexToRgb(targetHex);
  const ratio = clamp(Number(amount) || 0, 0, 1);
  const channel = (key) =>
    Math.round(source[key] + (target[key] - source[key]) * ratio)
      .toString(16)
      .padStart(2, '0');
  return `#${channel('r')}${channel('g')}${channel('b')}`;
}

function relativeLuminance(hex) {
  const { r, g, b } = hexToRgb(hex);
  const channels = [r, g, b].map((value) => {
    const c = value / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function contrastRatio(fg, bg) {
  const l1 = relativeLuminance(fg);
  const l2 = relativeLuminance(bg);
  const light = Math.max(l1, l2);
  const dark = Math.min(l1, l2);
  return (light + 0.05) / (dark + 0.05);
}

function safeUrl(value) {
  const url = String(value || '').trim();
  if (/^\s*(javascript|vbscript|data:text\/html)/i.test(url)) return '';
  return url;
}

function formatNumber(value, decimals = 0) {
  const n = Number(value);
  if (!Number.isFinite(n)) return '0';
  return decimals > 0 ? n.toFixed(decimals) : String(Math.round(n));
}

function indent(text, spaces = '  ') {
  return String(text)
    .split('\n')
    .map((line) => (line ? spaces + line : line))
    .join('\n');
}

function debounce(fn, delay) {
  let timer = null;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

/* ============================================================
   界面字号
   ============================================================ */

function applyUIFontSize(size, options = {}) {
  const validSizes = ['small', 'medium', 'large'];
  const value = validSizes.includes(size) ? size : 'medium';
  const labels = { small: '小号', medium: '中号', large: '大号' };
  uiFontSize = value;
  document.documentElement.dataset.fontSize = value;

  const switchEl = dom.uiFontSwitch || document.getElementById('uiFontSwitch');
  if (switchEl) {
    switchEl.setAttribute('aria-label', `界面字号，当前${labels[value]}`);
    switchEl.querySelectorAll('[data-ui-font]').forEach((button) => {
      const active = button.dataset.uiFont === value;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
  }

  if (options.persist !== false) {
    try {
      localStorage.setItem(UI_FONT_KEY, value);
    } catch (error) {
      // UI preference persistence is best-effort only.
    }
  }
}

function initUIFontSize() {
  let saved = 'medium';
  try {
    const stored = localStorage.getItem(UI_FONT_KEY);
    if (['small', 'medium', 'large'].includes(stored)) saved = stored;
  } catch (error) {
    saved = 'medium';
  }
  applyUIFontSize(saved, { persist: false });
}

/* ============================================================
   初始示例与状态恢复
   ============================================================ */

function makeElement(type, x, y, width, overrides = {}) {
  const def = getDef(type);
  if (!def) return null;
  const id = `el-${state.nextId++}`;
  const z = state.elements.reduce((max, item) => Math.max(max, Number(item.z) || 0), 0) + 2;
  return {
    id,
    type,
    x: Math.round(x),
    y: Math.round(y),
    w: Math.round(width || def.width),
    z,
    props: { ...deepClone(def.defaults), ...deepClone(overrides) }
  };
}

function createDemoState() {
  state.elements = [];
  state.nextId = 1;
  state.pageTitle = '我的第一个网页';
  state.canvasBg = '#ffffff';
  state.design = {
    theme: 'ocean',
    accent: '#2f6bff',
    soft: '#eaf1ff',
    radius: 16,
    shadow: true
  };
  state.grid = true;

  const add = (type, x, y, w, props = {}) => {
    const el = makeElement(type, x, y, w, props);
    if (el) state.elements.push(el);
    return el;
  };

  add('badge', 62, 54, 246, { text: '信息科技 · 零代码工坊' });
  add('heading', 60, 88, 470, {
    text: '让创意，被看见',
    fontSize: 46,
    lineHeight: 1.16,
    letterSpacing: -1.2
  });
  add('paragraph', 62, 212, 415, {
    text: '在这里，拖拽就是你的第一行代码。把标题、图片和表单放进画板，右侧会实时生成属于你的网页。',
    fontSize: 15,
    lineHeight: 1.8
  });
  add('button', 62, 320, 136, {
    text: '开始探索',
    variant: 'primary',
    bg: '#2f6bff',
    color: '#ffffff',
    border: '#2f6bff'
  });
  add('button', 210, 320, 124, {
    text: '查看示例',
    variant: 'outline',
    bg: '#ffffff',
    color: '#2f6bff',
    border: '#c9d9f3',
    shadow: false
  });
  add('image', 548, 68, 292, {
    radius: 22,
    aspect: 1.38
  });
  add('sticker', 816, 32, 50, {
    text: '✦',
    color: '#8db2ff',
    fontSize: 44,
    rotate: -10
  });
  add('card', 62, 398, 350, {
    tag: '今日任务',
    title: '让文字与图片找到平衡',
    text: '完成一张包含 3 个组件的网页，并为它挑选统一的颜色与圆角。',
    radius: 20
  });
  add('tip', 432, 410, 406, {
    text: '点击任意组件，右侧参数会立即亮起。试着调整字号和颜色吧。',
    radius: 14
  });

  state.selectedId = state.elements[1]?.id || state.elements[0]?.id || null;
}

function normalizeElement(raw) {
  if (!raw || typeof raw !== 'object') return null;
  const def = getDef(raw.type);
  if (!def) return null;
  const rawId = String(raw.id || '');
  const props = {
    ...deepClone(def.defaults),
    ...(raw.props && typeof raw.props === 'object' ? raw.props : {})
  };
  if (raw.type === 'heading') {
    props.fontWeight = Number(props.fontWeight) >= 600 ? 700 : 400;
  }
  return {
    id: /^el-\d+$/.test(rawId) ? rawId : `el-${state.nextId++}`,
    type: raw.type,
    x: clamp(Number(raw.x) || 0, -200, CANVAS_W + 200),
    y: clamp(Number(raw.y) || 0, -200, CANVAS_H + 200),
    w: clamp(Number(raw.w) || def.width, 24, 1200),
    z: Number(raw.z) || 1,
    props
  };
}

function serializeState() {
  return JSON.stringify({
    version: 1,
    pageTitle: state.pageTitle,
    canvasBg: state.canvasBg,
    design: state.design,
    grid: state.grid,
    elements: state.elements,
    nextId: state.nextId
  });
}

function deserializeState(raw) {
  const data = JSON.parse(raw);
  if (!data || !Array.isArray(data.elements)) throw new Error('Invalid saved state');
  state.pageTitle = String(data.pageTitle || '我的第一个网页').slice(0, 40);
  state.canvasBg = normalizeHex(data.canvasBg, '#ffffff');
  state.design = {
    theme: data.design?.theme || 'ocean',
    accent: normalizeHex(data.design?.accent, '#2f6bff'),
    soft: normalizeHex(data.design?.soft, '#eaf1ff'),
    radius: clamp(Number(data.design?.radius) || 16, 0, 40),
    shadow: data.design?.shadow !== false
  };
  state.grid = data.grid !== false;
  state.elements = data.elements.map(normalizeElement).filter(Boolean);
  const maxId = state.elements.reduce((max, el) => {
    const n = Number(String(el.id).replace(/[^\d]/g, ''));
    return Number.isFinite(n) ? Math.max(max, n) : max;
  }, 0);
  state.nextId = Math.max(Number(data.nextId) || 1, maxId + 1);
  if (!state.elements.some((el) => el.id === state.selectedId)) {
    state.selectedId = state.elements[0]?.id || null;
  }
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    deserializeState(raw);
    return true;
  } catch (error) {
    return false;
  }
}

/* ============================================================
   渲染：画板元素
   ============================================================ */

function selectedElement() {
  return state.elements.find((el) => el.id === state.selectedId) || null;
}

function styleMap(el) {
  const p = el.props;
  const base = {
    left: `${el.x}px`,
    top: `${el.y}px`,
    width: `${el.w}px`,
    'z-index': el.z
  };

  switch (el.type) {
    case 'heading':
      return {
        ...base,
        color: p.color,
        'font-size': `${p.fontSize}px`,
        'font-weight': p.fontWeight,
        'text-align': p.align,
        'line-height': p.lineHeight,
        'letter-spacing': `${p.letterSpacing}px`
      };
    case 'paragraph':
      return {
        ...base,
        color: p.color,
        'font-size': `${p.fontSize}px`,
        'text-align': p.align,
        'line-height': p.lineHeight,
        'letter-spacing': `${p.letterSpacing}px`
      };
    case 'image':
      return {
        ...base,
        'border-radius': `${p.radius}px`,
        background: p.bg,
        'aspect-ratio': p.aspect,
        '--image-fit': p.fit,
        'box-shadow': p.shadow ? '0 18px 40px rgba(32, 66, 116, 0.14)' : 'none'
      };
    case 'button':
      return {
        ...base,
        background: p.bg,
        color: p.color,
        'font-size': `${p.fontSize}px`,
        'border-radius': `${p.radius}px`,
        padding: `${p.paddingY}px ${p.paddingX}px`,
        border: `1px solid ${p.variant === 'outline' ? p.border : 'transparent'}`,
        'box-shadow': p.shadow ? '0 9px 20px rgba(47, 107, 255, 0.2)' : 'none',
        'text-align': 'center'
      };
    case 'badge':
      return {
        ...base,
        background: p.bg,
        color: p.color,
        'font-size': `${p.fontSize}px`,
        'border-radius': `${p.radius}px`,
        border: `1px solid ${p.border}`
      };
    case 'link':
      return {
        ...base,
        color: p.color,
        'font-size': `${p.fontSize}px`,
        'text-decoration': p.underline ? 'underline' : 'none'
      };
    case 'list':
      return {
        ...base,
        color: p.color,
        'font-size': `${p.fontSize}px`,
        'line-height': p.lineHeight,
        '--accent': p.accent
      };
    case 'table':
      return {
        ...base,
        background: '#ffffff',
        color: p.color,
        'font-size': `${p.fontSize}px`,
        'border-radius': `${p.radius}px`,
        border: `1px solid ${p.borderColor}`,
        'box-shadow': p.shadow ? '0 14px 30px rgba(35, 69, 123, 0.07)' : 'none',
        '--table-header-bg': p.headerBg,
        '--table-header-color': p.headerColor,
        '--table-border': p.borderColor,
        '--table-stripe': mixHex(p.headerBg, '#ffffff', 0.78)
      };
    case 'audio':
      return {
        ...base,
        background: p.bg,
        'border-radius': `${p.radius}px`,
        padding: '12px',
        border: `1px solid ${hexToRgba(p.accent, 0.14)}`,
        '--accent': p.accent
      };
    case 'video':
      return {
        ...base,
        background: p.bg,
        'border-radius': `${p.radius}px`,
        padding: '12px',
        border: `1px solid ${hexToRgba(p.accent, 0.14)}`,
        '--accent': p.accent,
        'box-shadow': p.shadow ? '0 16px 34px rgba(35, 69, 123, 0.1)' : 'none'
      };
    case 'divider':
      return {
        ...base,
        'border-top': `${p.thickness}px solid ${p.color}`
      };
    case 'form':
      return {
        ...base,
        background: p.bg,
        'border-radius': `${p.radius}px`,
        padding: '20px',
        '--accent': p.accent,
        border: `1px solid ${hexToRgba(p.accent, 0.14)}`,
        'box-shadow': p.shadow ? '0 18px 44px rgba(35, 69, 123, 0.1)' : 'none'
      };
    case 'input':
    case 'textarea':
      return {
        ...base,
        '--field-bg': p.bg,
        '--field-radius': `${p.radius}px`,
        '--accent': p.accent
      };
    case 'select':
      return {
        ...base,
        '--field-bg': p.bg,
        '--field-radius': `${p.radius}px`,
        '--accent': p.accent
      };
    case 'checkbox':
      return {
        ...base,
        '--accent': p.accent
      };
    case 'card':
      return {
        ...base,
        background: p.bg,
        'border-radius': `${p.radius}px`,
        padding: '18px',
        '--accent': p.accent,
        border: `1px solid ${hexToRgba(p.accent, 0.13)}`,
        'box-shadow': p.shadow ? '0 16px 36px rgba(35, 69, 123, 0.08)' : 'none'
      };
    case 'quote':
      return {
        ...base,
        background: p.bg,
        color: p.color,
        'border-radius': `${p.radius}px`,
        padding: '14px 18px',
        '--accent': p.accent,
        border: `1px solid ${hexToRgba(p.accent, 0.1)}`
      };
    case 'tip':
      return {
        ...base,
        background: p.bg,
        color: p.color,
        'border-radius': `${p.radius}px`,
        padding: '12px 14px',
        '--accent': p.accent,
        border: `1px solid ${hexToRgba(p.accent, 0.16)}`
      };
    case 'glow':
      return {
        ...base,
        'aspect-ratio': 1,
        'border-radius': '999px',
        background: `radial-gradient(circle at 50% 50%, ${hexToRgba(p.color, 0.82)} 0%, ${hexToRgba(p.color, 0.32)} 38%, transparent 70%)`,
        filter: `blur(${p.blur}px)`,
        opacity: p.opacity
      };
    case 'sticker':
      return {
        ...base,
        color: p.color,
        'font-size': `${p.fontSize}px`,
        'line-height': 1,
        'text-align': 'center',
        transform: `rotate(${p.rotate}deg)`,
        opacity: p.opacity
      };
    case 'decoicon':
      return {
        ...base,
        'aspect-ratio': 1,
        background: p.bg,
        color: p.color,
        'border-radius': `${p.radius}px`,
        'font-size': `${p.fontSize}px`,
        'box-shadow': p.shadow ? '0 10px 22px rgba(35, 69, 123, 0.1)' : 'none'
      };
    default:
      return base;
  }
}

function styleAttr(map) {
  return Object.entries(map)
    .map(([key, value]) => `${key}: ${value}`)
    .join('; ');
}

function innerMarkup(el) {
  const p = el.props;
  switch (el.type) {
    case 'heading':
      return escapeHTML(p.text);
    case 'paragraph':
      return escapeHTML(p.text);
    case 'image':
      return `<img src="${escapeAttr(safeUrl(p.src))}" alt="${escapeAttr(p.alt)}" />`;
    case 'button':
      return escapeHTML(p.text);
    case 'link':
      return escapeHTML(p.text);
    case 'badge':
      return escapeHTML(p.text);
    case 'divider':
      return '';
    case 'list': {
      const items = String(p.items || '')
        .split('\n')
        .map((item) => item.trim())
        .filter(Boolean);
      const tag = p.ordered ? 'ol' : 'ul';
      const itemMarkup = (items.length ? items : ['列表项'])
        .map((item) => `<li>${escapeHTML(item)}</li>`)
        .join('\n');
      return `<${tag} class="list-content">\n${indent(itemMarkup, '  ')}\n</${tag}>`;
    }
    case 'table': {
      const splitCells = (line) => {
        const value = String(line || '').trim();
        return (value.includes('|') ? value.split('|') : value.split(/[，,]/)).map((cell) => cell.trim());
      };
      const headers = splitCells(p.headers);
      const rows = String(p.rows || '')
        .split('\n')
        .map((row) => row.trim())
        .filter(Boolean)
        .map(splitCells);
      const headingMarkup = `<tr>${headers.map((cell) => `<th>${escapeHTML(cell)}</th>`).join('')}</tr>`;
      const bodyMarkup = rows
        .map((cells) => `<tr>${cells.map((cell) => `<td>${escapeHTML(cell)}</td>`).join('')}</tr>`)
        .join('\n');
      return `<table>
  <thead>${headingMarkup}</thead>
  <tbody>
${indent(bodyMarkup, '    ')}
  </tbody>
</table>`;
    }
    case 'audio':
      return `
  <div class="media-head">
    <span class="media-mark">♪</span>
    <span class="media-copy"><strong>${escapeHTML(p.title)}</strong><small>AUDIO</small></span>
  </div>
  <audio controls preload="metadata" src="${escapeAttr(safeUrl(p.src))}"></audio>`.trim();
    case 'video':
      return `
  <div class="media-head">
    <span class="media-mark">▶</span>
    <span class="media-copy"><strong>${escapeHTML(p.title)}</strong><small>VIDEO</small></span>
  </div>
  <div class="video-frame">
    <video controls preload="none"${p.poster ? ` poster="${escapeAttr(safeUrl(p.poster))}"` : ''} src="${escapeAttr(safeUrl(p.src))}"></video>
  </div>`.trim();
    case 'form':
      return `
  <div class="form-head">
    <span class="form-kicker">CONTACT</span>
    <h3>${escapeHTML(p.title)}</h3>
    <p class="form-sub">${escapeHTML(p.subtitle)}</p>
  </div>
  <div class="form-row">
    <label class="form-field">姓名<input type="text" placeholder="你的名字" /></label>
    <label class="form-field">班级<input type="text" placeholder="例如：初二（3）班" /></label>
  </div>
  <label class="form-field">留言<textarea placeholder="写下你的想法…"></textarea></label>
  <button class="form-submit" type="submit">${escapeHTML(p.buttonText)}<span>→</span></button>`.trim();
    case 'input':
      return `
  <span class="field-label-text">${escapeHTML(p.label)}</span>
  <span class="field-box"><input type="text" placeholder="${escapeAttr(p.placeholder)}" /></span>`.trim();
    case 'textarea':
      return `
  <span class="field-label-text">${escapeHTML(p.label)}</span>
  <span class="field-box field-box--area"><textarea placeholder="${escapeAttr(p.placeholder)}"></textarea></span>`.trim();
    case 'select': {
      const options = String(p.options || '')
        .split('\n')
        .map((option) => option.trim())
        .filter(Boolean)
        .map((option) => `<option>${escapeHTML(option)}</option>`)
        .join('');
      return `
  <span class="field-label-text">${escapeHTML(p.label)}</span>
  <span class="field-box"><select>${options}</select></span>`.trim();
    }
    case 'checkbox':
      return `
  <input type="checkbox"${p.checked ? ' checked' : ''} />
  <span class="box"></span>
  <span class="text">${escapeHTML(p.label)}</span>`.trim();
    case 'card':
      return `
  <div class="card-top">
    <span class="card-tag">${escapeHTML(p.tag)}</span>
    <span class="card-mark">↗</span>
  </div>
  <h3>${escapeHTML(p.title)}</h3>
  <p>${escapeHTML(p.text)}</p>
  <div class="card-line"></div>
  <span class="card-foot">继续创作 <i>→</i></span>`.trim();
    case 'quote':
      return `
  <span class="quote-mark">“</span>
  <p>${escapeHTML(p.text)}</p>
  <cite>${escapeHTML(p.cite)}</cite>`.trim();
    case 'tip':
      return `
  <span class="tip-mark">!</span>
  <p>${escapeHTML(p.text)}</p>`.trim();
    case 'glow':
      return '';
    case 'sticker':
      return escapeHTML(p.text);
    case 'decoicon':
      return escapeHTML(p.text);
    default:
      return '';
  }
}

function rootTagFor(type) {
  switch (type) {
    case 'heading':
      return 'h2';
    case 'paragraph':
      return 'p';
    case 'image':
      return 'figure';
    case 'button':
      return 'button';
    case 'link':
      return 'a';
    case 'divider':
      return 'hr';
    case 'form':
      return 'form';
    case 'input':
    case 'textarea':
    case 'checkbox':
      return 'label';
    case 'select':
      return 'label';
    case 'card':
      return 'article';
    case 'quote':
      return 'blockquote';
    case 'sticker':
    case 'decoicon':
    case 'badge':
      return 'span';
    default:
      return 'div';
  }
}

function elementMarkup(el, options = {}) {
  const { editor = false, selected = false, isNew = false } = options;
  const def = getDef(el.type);
  if (!def) return '';
  const tag = rootTagFor(el.type);
  const striped = el.type === 'table' && el.props.stripe ? 'is-striped' : '';
  const classes = editor
    ? ['canvas-el', def.uiClass, striped, selected ? 'is-selected' : '', isNew ? 'is-new' : '']
        .filter(Boolean)
        .join(' ')
    : ['obj', el.id, def.uiClass, striped].filter(Boolean).join(' ');

  let attrs = `class="${classes}"`;
  if (editor) {
    attrs += ` data-id="${el.id}" style="${escapeAttr(styleAttr(styleMap(el)))}" tabindex="0"`;
  }
  if (el.type === 'button') attrs += ' type="button"';
  if (el.type === 'link' && !editor) {
    attrs += ` href="${escapeAttr(safeUrl(el.props.href) || '#')}"`;
    if (el.props.target === '_blank') attrs += ' target="_blank" rel="noopener noreferrer"';
  }
  if (el.type === 'form') {
    attrs +=
      ' onsubmit="event.preventDefault();this.querySelector(\'.form-submit\').textContent=\'已发送，谢谢！\';"';
  }
  if (el.type === 'divider') {
    return `<hr ${attrs} />`;
  }

  const content = innerMarkup(el);
  if (!content) {
    if (el.type === 'glow') return `<div ${attrs}></div>`;
    return `<${tag} ${attrs}></${tag}>`;
  }

  const contentLines = content.split('\n');
  if (contentLines.length === 1) {
    return `<${tag} ${attrs}>${content}</${tag}>`;
  }

  return `<${tag} ${attrs}>\n${indent(content, '  ')}\n</${tag}>`;
}

/* ============================================================
   画板渲染与交互
   ============================================================ */

function renderCanvas(options = {}) {
  const { newId = null } = options;
  if (!dom.artboard) return;
  dom.artboard.querySelectorAll('.canvas-el').forEach((node) => node.remove());

  const sorted = [...state.elements];
  sorted.forEach((el) => {
    const html = elementMarkup(el, {
      editor: true,
      selected: el.id === state.selectedId,
      isNew: el.id === newId
    });
    dom.artboard.insertAdjacentHTML('beforeend', html);
  });

  dom.canvasEmpty.hidden = state.elements.length > 0;
  dom.artboard.style.background = state.canvasBg;
  dom.artboard.classList.toggle('grid-hidden', !state.grid);
  dom.gridBtn.classList.toggle('is-active', state.grid);
  dom.gridBtn.setAttribute('aria-pressed', String(state.grid));
  updateSelectionTools();
}

function refreshElement(el) {
  const node = dom.artboard.querySelector(`.canvas-el[data-id="${el.id}"]`);
  if (!node) return;
  const selected = el.id === state.selectedId;
  node.outerHTML = elementMarkup(el, { editor: true, selected });
  updateSelectionTools();
}

function updateSelectionTools() {
  const el = selectedElement();
  if (!el || !dom.selectionTools) {
    if (dom.selectionTools) dom.selectionTools.hidden = true;
    return;
  }
  const node = dom.artboard.querySelector(`.canvas-el[data-id="${el.id}"]`);
  if (!node) {
    dom.selectionTools.hidden = true;
    return;
  }
  dom.selectionTools.hidden = false;
  dom.selectionName.textContent = getDisplayName(el.type);
  const nodeHeight = node.offsetHeight || 40;
  const top = el.y > 44 ? el.y - 34 : el.y + nodeHeight + 8;
  const left = clamp(el.x + el.w - 154, 4, CANVAS_W - 154);
  dom.selectionTools.style.left = `${left}px`;
  dom.selectionTools.style.top = `${top}px`;
}

function selectElement(id, options = {}) {
  const changed = state.selectedId !== (id || null);
  state.selectedId = id || null;
  $$('.canvas-el', dom.artboard).forEach((node) => {
    node.classList.toggle('is-selected', node.dataset.id === state.selectedId);
  });
  updateSelectionTools();
  if (state.mode === 'build' || options.forceInspector) {
    renderInspector(changed || Boolean(options.resetScroll));
  }
  updateSelectionChip();
}

function updateSelectionChip() {
  const el = selectedElement();
  const show = Boolean(el) && state.mode === 'build';
  dom.selectionChip.hidden = !show;
  if (show) dom.selectionChip.textContent = getDisplayName(el.type);
}

function harmonizeNewElement(el) {
  if (!el) return el;
  const p = el.props;
  const accent = state.design.accent;
  if (el.type === 'button') {
    if (p.variant === 'primary') {
      p.bg = accent;
      p.border = accent;
    } else if (p.variant === 'outline') {
      p.color = accent;
      p.border = hexToRgba(accent, 0.34);
    }
  }
  if (el.type === 'badge') {
    p.color = accent;
    p.bg = state.design.soft;
    p.border = hexToRgba(accent, 0.18);
  }
  if (['form', 'card', 'quote', 'tip', 'checkbox', 'input', 'textarea', 'select', 'list', 'audio', 'video'].includes(el.type)) {
    p.accent = accent;
  }
  if (el.type === 'link') p.color = accent;
  if (el.type === 'table') {
    p.headerColor = accent;
    p.headerBg = state.design.soft;
  }
  if (el.type === 'glow') p.color = accent;
  if (el.type === 'decoicon') {
    p.color = accent;
    p.bg = state.design.soft;
  }
  if (['image', 'button', 'form', 'card', 'decoicon', 'table', 'video'].includes(el.type) && p.shadow !== undefined) {
    p.shadow = state.design.shadow;
  }
  if (RADIUS_TYPES.includes(el.type) && p.radius !== undefined) {
    p.radius = state.design.radius;
  }
  return el;
}

function addComponent(type, dropX, dropY) {
  const def = getDef(type);
  if (!def) return;
  pushHistory();
  const offset = (state.elements.length % 4) * 16;
  const x = dropX == null ? clamp((CANVAS_W - def.width) / 2 + offset, 24, CANVAS_W - def.width - 24) : dropX;
  const y = dropY == null ? clamp(118 + offset, 24, CANVAS_H - 120) : dropY;
  const el = harmonizeNewElement(makeElement(type, x, y, def.width));
  state.elements.push(el);
  state.selectedId = el.id;
  renderCanvas({ newId: el.id });
  renderInspector(true);
  updateSelectionChip();
  scheduleCodeUpdate();
  queueSave();
  showToast(`已添加「${def.name}」`, 'success');
}

function deleteSelected() {
  const el = selectedElement();
  if (!el) return;
  pushHistory();
  state.elements = state.elements.filter((item) => item.id !== el.id);
  state.selectedId = null;
  renderCanvas();
  renderInspector();
  updateSelectionChip();
  scheduleCodeUpdate();
  queueSave();
  showToast('组件已删除', 'success');
}

function duplicateSelected() {
  const el = selectedElement();
  if (!el) return;
  pushHistory();
  const clone = deepClone(el);
  clone.id = `el-${state.nextId++}`;
  clone.x = clamp(el.x + 18, 0, CANVAS_W - el.w);
  clone.y = clamp(el.y + 18, 0, CANVAS_H - 40);
  clone.z = Math.max(...state.elements.map((item) => item.z), 0) + 2;
  state.elements.push(clone);
  state.selectedId = clone.id;
  renderCanvas({ newId: clone.id });
  renderInspector(true);
  updateSelectionChip();
  scheduleCodeUpdate();
  queueSave();
  showToast('已复制组件', 'success');
}

function changeLayer(action) {
  const el = selectedElement();
  if (!el) return;
  pushHistory();
  const ordered = [...state.elements].sort((a, b) => a.z - b.z);
  const index = ordered.findIndex((item) => item.id === el.id);
  if (index < 0) return;

  let targetIndex = index;
  if (action === 'up') targetIndex = Math.min(ordered.length - 1, index + 1);
  if (action === 'down') targetIndex = Math.max(0, index - 1);
  if (action === 'front') targetIndex = ordered.length - 1;
  if (action === 'back') targetIndex = 0;

  const [moved] = ordered.splice(index, 1);
  ordered.splice(targetIndex, 0, moved);
  ordered.forEach((item, i) => {
    item.z = i + 2;
  });
  state.elements = ordered;
  renderCanvas();
  renderInspector();
  scheduleCodeUpdate();
  queueSave();
}

function moveSelectedBy(dx, dy) {
  const el = selectedElement();
  if (!el) return;
  beginEdit('nudge');
  commitEdit('nudge');
  el.x = clamp(el.x + dx, -20, CANVAS_W - 10);
  el.y = clamp(el.y + dy, -20, CANVAS_H - 10);
  const node = dom.artboard.querySelector(`.canvas-el[data-id="${el.id}"]`);
  if (node) {
    node.style.left = `${el.x}px`;
    node.style.top = `${el.y}px`;
  }
  updateSelectionTools();
  syncPositionFields();
  scheduleCodeUpdate();
  queueSave();
}

function startDrag(event) {
  const node = event.target.closest('.canvas-el');
  if (!node || event.button !== 0) return;
  const el = state.elements.find((item) => item.id === node.dataset.id);
  if (!el) return;
  event.preventDefault();
  selectElement(el.id);
  const artboardRect = dom.artboard.getBoundingClientRect();
  const scale = artboardRect.width / CANVAS_W;
  dragState = {
    id: el.id,
    node,
    startClientX: event.clientX,
    startClientY: event.clientY,
    originX: el.x,
    originY: el.y,
    scale,
    moved: false,
    before: serializeState()
  };
  node.classList.add('is-dragging');
}

function onPointerMove(event) {
  if (!dragState) return;
  const dx = (event.clientX - dragState.startClientX) / dragState.scale;
  const dy = (event.clientY - dragState.startClientY) / dragState.scale;
  if (!dragState.moved && Math.abs(dx) + Math.abs(dy) < 2) return;
  if (!dragState.moved) {
    dragState.moved = true;
    pushHistory(dragState.before);
  }
  const el = state.elements.find((item) => item.id === dragState.id);
  if (!el) return;
  el.x = clamp(Math.round(dragState.originX + dx), 0, CANVAS_W - el.w);
  el.y = clamp(Math.round(dragState.originY + dy), 0, CANVAS_H - 40);
  dragState.node.style.left = `${el.x}px`;
  dragState.node.style.top = `${el.y}px`;
  updateSelectionTools();
  syncPositionFields();
  scheduleCodeUpdate();
}

function onPointerUp() {
  if (!dragState) return;
  const { node, moved } = dragState;
  node.classList.remove('is-dragging');
  dragState = null;
  if (moved) {
    queueSave();
    renderInspector();
  }
}

/* ============================================================
   代码生成
   ============================================================ */

function buildPageCss() {
  const cssLines = [];
  cssLines.push('/* ===== 页面基础 ===== */');
  cssLines.push('* { box-sizing: border-box; }');
  cssLines.push('body {');
  cssLines.push('  margin: 0;');
  cssLines.push('  min-height: 100vh;');
  cssLines.push('  display: flex;');
  cssLines.push('  align-items: center;');
  cssLines.push('  justify-content: center;');
  cssLines.push('  padding: 32px 16px;');
  cssLines.push('  background: #eef3fb;');
  cssLines.push('  font-family: "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif;');
  cssLines.push('}');
  cssLines.push('');
  cssLines.push('/* ===== 设计变量 ===== */');
  cssLines.push(':root {');
  cssLines.push(`  --brand: ${state.design.accent};`);
  cssLines.push(`  --soft-brand: ${state.design.soft};`);
  cssLines.push(`  --radius: ${state.design.radius}px;`);
  cssLines.push('  --ink: #14243c;');
  cssLines.push('  --muted: #64748b;');
  cssLines.push('}');
  cssLines.push('');
  cssLines.push('/* ===== 900 × 600 画板 ===== */');
  cssLines.push('.page {');
  cssLines.push('  position: relative;');
  cssLines.push('  width: 900px;');
  cssLines.push('  height: 600px;');
  cssLines.push('  margin: 0 auto;');
  cssLines.push('  overflow: hidden;');
  cssLines.push(`  background: ${state.canvasBg};`);
  cssLines.push('  border-radius: 20px;');
  cssLines.push('  box-shadow: 0 26px 60px rgba(33, 65, 115, 0.14);');
  cssLines.push('}');
  cssLines.push('');
  cssLines.push('.page .obj {');
  cssLines.push('  position: absolute;');
  cssLines.push('  box-sizing: border-box;');
  cssLines.push('  margin: 0;');
  cssLines.push('}');
  cssLines.push('');
  cssLines.push(COMPONENT_CSS.trim());
  cssLines.push('');

  state.elements.forEach((el) => {
    cssLines.push(`/* ${getDisplayName(el.type)} */`);
    cssLines.push(`.${el.id} {`);
    Object.entries(styleMap(el)).forEach(([key, value]) => {
      cssLines.push(`  ${key}: ${value};`);
    });
    cssLines.push('}');
    cssLines.push('');
  });

  return cssLines.join('\n').trimEnd();
}

function getHtmlFilename() {
  return `${safeFilename(state.pageTitle)}.html`;
}

function getCssFilename() {
  return `${safeFilename(state.pageTitle)}.css`;
}

function generateHTMLDoc(options = {}) {
  const { inlineCss = false } = options;
  const css = buildPageCss();
  const body = state.elements.length
    ? state.elements
        .map(
          (el) =>
            `  <!-- ${getDisplayName(el.type)} -->\n${indent(
              elementMarkup(el, { editor: false }),
              '  '
            )}`
        )
        .join('\n\n')
    : '  <!-- 画板还是空的，回到「页面编辑」添加组件吧。 -->';
  const styleBlock = inlineCss
    ? `  <style>
${indent(css, '    ')}
  </style>`
    : `  <!-- HTML 与 CSS 分离：请将同名 CSS 文件放在同一目录 -->
  <link rel="stylesheet" href="${escapeAttr(getCssFilename())}" />`;

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHTML(state.pageTitle)}</title>
${styleBlock}
</head>
<body>
  <!-- 由「HTML炼金工坊」创建 · 页面内容可自由修改 -->
  <main class="page">
${body}
  </main>
</body>
</html>`;
}

function generateStandaloneHTMLDoc() {
  return generateHTMLDoc({ inlineCss: true });
}

function generateCssOnly() {
  const safeTitle = state.pageTitle.replace(/\*\//g, '* /');
  const safeHtmlFile = getHtmlFilename().replace(/\*\//g, '* /');
  return `/* ==========================================================
   HTML炼金工坊 · ${safeTitle}
   页面样式 CSS —— 与「${safeHtmlFile}」配合使用
   ========================================================== */

${buildPageCss()}
`;
}

/* ============================================================
   代码高亮与代码面板
   ============================================================ */

function highlightTag(tag) {
  let html = escapeHTML(tag);
  html = html.replace(/^(&lt;\/?)([a-zA-Z][\w-]*)/, (_, bracket, name) => {
    return `<span class="tok-tag-bracket">${bracket}</span><span class="tok-tag">${name}</span>`;
  });
  html = html.replace(
    /(\s)([a-zA-Z_:][\w:.-]*)(=)(&quot;.*?&quot;|&#39;.*?&#39;)/g,
    (_, space, attr, equals, value) =>
      `${space}<span class="tok-attr">${attr}</span><span class="tok-punct">${equals}</span><span class="tok-string">${value}</span>`
  );
  html = html.replace(/(\/?&gt;)$/, '<span class="tok-tag-bracket">$1</span>');
  return html;
}

function findTagEnd(code, start) {
  let quote = null;
  for (let i = start + 1; i < code.length; i += 1) {
    const char = code[i];
    if (quote) {
      if (char === quote) quote = null;
    } else if (char === '"' || char === "'") {
      quote = char;
    } else if (char === '>') {
      return i;
    }
  }
  return code.length - 1;
}

function highlightHTML(code) {
  let result = '';
  let i = 0;
  while (i < code.length) {
    if (code.startsWith('<!DOCTYPE', i)) {
      const end = code.indexOf('>', i);
      result += `<span class="tok-doctype">${escapeHTML(code.slice(i, end + 1))}</span>`;
      i = end + 1;
      continue;
    }
    if (code.startsWith('<!--', i)) {
      const end = code.indexOf('-->', i);
      const finish = end === -1 ? code.length : end + 3;
      result += `<span class="tok-comment">${escapeHTML(code.slice(i, finish))}</span>`;
      i = finish;
      continue;
    }
    if (code.startsWith('<style', i)) {
      const openEnd = findTagEnd(code, i);
      const closeStart = code.indexOf('</style>', openEnd + 1);
      if (closeStart !== -1) {
        result += highlightTag(code.slice(i, openEnd + 1));
        result += highlightCSS(code.slice(openEnd + 1, closeStart));
        i = closeStart;
        continue;
      }
    }
    if (code[i] === '<') {
      const end = findTagEnd(code, i);
      result += highlightTag(code.slice(i, end + 1));
      i = end + 1;
      continue;
    }
    const next = code.indexOf('<', i);
    const finish = next === -1 ? code.length : next;
    result += `<span class="tok-text">${escapeHTML(code.slice(i, finish))}</span>`;
    i = finish;
  }
  return result;
}

function highlightCSS(code) {
  const lines = code.split('\n');
  let inComment = false;
  return lines
    .map((line) => {
      const trimmed = line.trim();
      if (inComment) {
        const ends = trimmed.includes('*/');
        if (ends) inComment = false;
        return `<span class="tok-comment">${escapeHTML(line)}</span>`;
      }
      if (trimmed.startsWith('/*')) {
        if (!trimmed.includes('*/')) inComment = true;
        return `<span class="tok-comment">${escapeHTML(line)}</span>`;
      }
      if (!trimmed) return '';
      if (/^[^{}]+[{]\s*$/.test(line)) {
        return `<span class="tok-css-selector">${escapeHTML(line)}</span>`;
      }
      if (trimmed === '}') {
        return `<span class="tok-css-brace">${escapeHTML(line)}</span>`;
      }
      const declaration = line.match(/^(\s*)([-a-zA-Z_][\w-]*)(\s*:\s*)(.*?)(;?)$/);
      if (declaration) {
        return `${declaration[1]}<span class="tok-css-prop">${escapeHTML(
          declaration[2]
        )}</span><span class="tok-css-brace">${escapeHTML(declaration[3])}</span><span class="tok-css-value">${escapeHTML(
          declaration[4]
        )}</span><span class="tok-css-brace">${escapeHTML(declaration[5])}</span>`;
      }
      return escapeHTML(line);
    })
    .join('\n');
}

function lineNumbersMarkup(count) {
  return Array.from({ length: count }, (_, i) => i + 1).join('\n');
}

function scheduleCodeUpdate() {
  if (codeRaf) return;
  codeRaf = requestAnimationFrame(() => {
    codeRaf = null;
    updateCodePanel();
  });
}

function getActiveCode() {
  return state.codeView === 'css' ? generateCssOnly() : generateHTMLDoc();
}

function syncCodeTabs() {
  const isCss = state.codeView === 'css';
  $$('.code-tab').forEach((tab) => {
    const active = tab.dataset.codeView === state.codeView;
    tab.classList.toggle('is-active', active);
    tab.setAttribute('aria-selected', String(active));
    tab.tabIndex = active ? 0 : -1;
  });
  if (dom.codeBody) {
    dom.codeBody.setAttribute('aria-labelledby', isCss ? 'codeTabCss' : 'codeTabHtml');
  }
  if (dom.copyCodeBtn) {
    const label = isCss ? 'CSS' : 'HTML';
    dom.copyCodeBtn.title = `复制 ${label} 代码`;
    dom.copyCodeBtn.setAttribute('aria-label', `复制 ${label} 代码`);
  }
}

function setCodeView(view, options = {}) {
  if (view !== 'html' && view !== 'css') return;
  if (state.codeView === view) return;
  state.codeView = view;
  syncCodeTabs();
  updateCodePanel();
  dom.codePre.scrollTop = 0;
  dom.codePre.scrollLeft = 0;
  dom.lineNumbers.scrollTop = 0;
  if (options.animate !== false && dom.codeBody) {
    dom.codeBody.classList.remove('is-code-switching');
    void dom.codeBody.offsetWidth;
    dom.codeBody.classList.add('is-code-switching');
    window.setTimeout(() => dom.codeBody.classList.remove('is-code-switching'), 240);
  }
}

function updateCodePanel() {
  const htmlCode = generateHTMLDoc();
  const cssCode = generateCssOnly();
  const htmlLines = htmlCode.split('\n').length;
  const cssLines = cssCode.split('\n').length;
  const isCss = state.codeView === 'css';
  const code = isCss ? cssCode : htmlCode;
  const scrollTop = dom.codePre.scrollTop;
  const scrollLeft = dom.codePre.scrollLeft;

  currentCode = code;
  dom.htmlLineCount.textContent = String(htmlLines);
  dom.cssLineCount.textContent = String(cssLines);
  dom.codeOutput.innerHTML = isCss ? highlightCSS(code) : highlightHTML(code);
  dom.lineNumbers.textContent = lineNumbersMarkup(isCss ? cssLines : htmlLines);
  dom.codeMeta.textContent = isCss ? `CSS · ${cssLines} 行 · 独立样式表` : `HTML · ${htmlLines} 行 · 引用 CSS`;
  syncCodeTabs();
  dom.codePre.scrollTop = scrollTop;
  dom.codePre.scrollLeft = scrollLeft;
  dom.lineNumbers.scrollTop = dom.codePre.scrollTop;

  if (dom.codeModal.classList.contains('is-open')) {
    updateCodeModal();
  }
}

function updateCodeModal() {
  const isCss = state.codeView === 'css';
  const code = currentCode || getActiveCode();
  const lines = code.split('\n').length;
  dom.codeModalTitle.textContent = isCss ? 'CSS 代码' : 'HTML 代码';
  dom.modalCodeOutput.innerHTML = isCss ? highlightCSS(code) : highlightHTML(code);
  dom.modalLineNumbers.textContent = lineNumbersMarkup(lines);
}

/* ============================================================
   画板尺寸适配
   ============================================================ */

function fitCanvas() {
  if (!dom.canvasViewport) return;
  const rect = dom.canvasViewport.getBoundingClientRect();
  const availableWidth = Math.max(260, rect.width - 48);
  const availableHeight = Math.max(220, rect.height - 82);
  const scale = Math.min(1, availableWidth / CANVAS_W, availableHeight / CANVAS_H);
  canvasScale = Math.max(0.28, scale);
  const viewportWidth = Math.round(CANVAS_W * canvasScale);
  const viewportHeight = Math.round(CANVAS_H * canvasScale);
  dom.artboardViewport.style.width = `${viewportWidth}px`;
  dom.artboardViewport.style.height = `${viewportHeight}px`;
  dom.artboard.style.transform = `scale(${canvasScale})`;
  dom.zoomLabel.textContent = `${Math.round(canvasScale * 100)}%`;
}

/* ============================================================
   左侧组件库
   ============================================================ */

function renderComponentGrid() {
  const activeCategory = $('.category-tab.is-active')?.dataset.category || 'basic';
  const query = dom.componentSearch.value.trim().toLowerCase();
  let items = CATALOG;
  if (query) {
    items = CATALOG.filter((item) =>
      `${item.name}${item.desc}${item.type}`.toLowerCase().includes(query)
    );
  } else {
    items = CATALOG.filter((item) => item.category === activeCategory);
  }

  if (!items.length) {
    dom.componentGrid.innerHTML = '<div class="no-components">没有找到相关组件，换个关键词试试。</div>';
    return;
  }

  dom.componentGrid.innerHTML = items
    .map(
      (item) => `
      <button class="component-card" type="button" draggable="true" data-type="${item.type}" data-tone="${item.tone}" aria-label="添加${item.name}组件">
        <span class="component-icon">${icon(item.icon)}</span>
        <span class="component-name">${item.name}</span>
        <span class="component-desc">${item.desc}</span>
      </button>`
    )
    .join('');
}

function renderThemes() {
  dom.themeGrid.innerHTML = Object.entries(THEMES)
    .map(
      ([key, theme]) => `
      <button class="theme-option" type="button" data-theme="${key}">
        <span class="theme-swatches">${theme.swatches
          .map((color) => `<i style="background:${color}"></i>`)
          .join('')}</span>
        <strong>${theme.name}</strong>
        <span class="theme-check">${icon('check')}</span>
      </button>`
    )
    .join('');
}

function renderAccentSwatches() {
  dom.accentSwatches.innerHTML = ACCENT_COLORS.map(
    (color) =>
      `<button class="accent-swatch" type="button" data-accent="${color}" style="--swatch:${color}" title="${color}">${icon(
        'check'
      )}</button>`
  ).join('');
}

function syncCssLibraryUI() {
  $$('.theme-option', dom.themeGrid).forEach((button) => {
    button.classList.toggle('is-active', button.dataset.theme === state.design.theme);
  });
  $$('.accent-swatch', dom.accentSwatches).forEach((button) => {
    button.classList.toggle(
      'is-active',
      button.dataset.accent.toLowerCase() === state.design.accent.toLowerCase()
    );
  });
  dom.radiusRange.value = String(state.design.radius);
  dom.radiusRange.style.setProperty(
    '--range-progress',
    `${((state.design.radius - 0) / 28) * 100}%`
  );
  dom.radiusValue.textContent = `${state.design.radius} px`;
  dom.shadowToggle.setAttribute('aria-checked', String(state.design.shadow));
  dom.shadowValue.textContent = state.design.shadow ? '开启' : '关闭';
}

/* ============================================================
   右侧参数面板
   ============================================================ */

function attrFor(kind, key) {
  if (kind === 'page') return `data-page-prop="${key}"`;
  if (kind === 'el') return `data-el-prop="${key}"`;
  return `data-prop="${key}"`;
}

function controlGroup(title, iconName, content, code = '') {
  return `
    <div class="control-group">
      <div class="group-title"><span>${icon(iconName)}${title}</span>${code ? `<small>${code}</small>` : ''}</div>
      ${content}
    </div>`;
}

function textField(label, kind, key, value, placeholder = '') {
  return `
    <div class="field">
      <label class="field-label"><span>${label}</span></label>
      <input class="text-input" type="text" ${attrFor(kind, key)} data-value-type="string" value="${escapeAttr(
    value
  )}" placeholder="${escapeAttr(placeholder)}" />
    </div>`;
}

function areaField(label, kind, key, value, rows = 3, placeholder = '') {
  return `
    <div class="field">
      <label class="field-label"><span>${label}</span></label>
      <textarea class="area-input" ${attrFor(kind, key)} data-value-type="string" rows="${rows}" placeholder="${escapeAttr(
    placeholder
  )}">${escapeHTML(value)}</textarea>
    </div>`;
}

function numberField(label, kind, key, value, min, max, step = 1, unit = '') {
  return `
    <div class="field">
      <label class="field-label"><span>${label}</span><output data-output-kind="${kind}" data-output-key="${key}">${formatNumber(
    value
  )}${unit ? ` ${unit}` : ''}</output></label>
      <input class="text-input" type="number" ${attrFor(kind, key)} data-value-type="number" value="${formatNumber(
    value
  )}" min="${min}" max="${max}" step="${step}" />
    </div>`;
}

function rangeField(label, kind, key, value, min, max, step = 1, unit = '', decimals = 0) {
  const percent = ((Number(value) - min) / (max - min)) * 100;
  return `
    <div class="field">
      <div class="field-label"><span>${label}</span><output data-output-kind="${kind}" data-output-key="${key}">${formatNumber(
    value,
    decimals
  )}${unit ? ` ${unit}` : ''}</output></div>
      <div class="range-field">
        <input class="range-input" type="range" ${attrFor(kind, key)} data-value-type="number" min="${min}" max="${max}" step="${step}" value="${value}" style="--range-progress:${percent}%" />
        <input class="range-number" type="number" ${attrFor(kind, key)} data-value-type="number" min="${min}" max="${max}" step="${step}" value="${formatNumber(
    value,
    decimals
  )}" />
      </div>
    </div>`;
}

function colorField(label, kind, key, value) {
  const color = normalizeHex(value);
  return `
    <div class="field">
      <label class="field-label"><span>${label}</span></label>
      <div class="color-control">
        <label class="color-well">
          <span class="color-preview" data-color-preview data-preview-kind="${kind}" data-preview-key="${key}" style="--color:${color}"></span>
          <input type="color" ${attrFor(kind, key)} data-value-type="color" value="${color}" aria-label="${label}" />
        </label>
        <input class="color-hex" type="text" ${attrFor(kind, key)} data-value-type="color" value="${color.toUpperCase()}" maxlength="7" />
      </div>
    </div>`;
}

function selectField(label, kind, key, value, options) {
  return `
    <div class="field">
      <label class="field-label"><span>${label}</span></label>
      <select class="select-input" ${attrFor(kind, key)} data-value-type="string">
        ${options
          .map(
            (option) =>
              `<option value="${escapeAttr(option.value)}"${
                String(option.value) === String(value) ? ' selected' : ''
              }>${escapeHTML(option.label)}</option>`
          )
          .join('')}
      </select>
    </div>`;
}

function segmentedField(label, key, value, options, valueType = 'string') {
  return `
    <div class="field">
      <div class="field-label"><span>${label}</span></div>
      <div class="segmented">
        ${options
          .map(
            (option) => `
            <button type="button" data-set-prop="${key}" data-value-type="${valueType}" data-value="${escapeAttr(
              option.value
            )}" class="${String(option.value) === String(value) ? 'is-active' : ''}" title="${escapeAttr(
              option.label
            )}">${option.icon ? icon(option.icon) : ''}${option.label ? `<span>${escapeHTML(option.label)}</span>` : ''}</button>`
          )
          .join('')}
      </div>
    </div>`;
}

function toggleField(label, prop, checked, description) {
  return `
    <div class="field">
      <div class="field-label"><span>${label}</span></div>
      <button class="toggle-row" type="button" data-toggle-prop="${prop}" role="switch" aria-checked="${Boolean(
    checked
  )}">
        <span class="toggle-track"><span class="toggle-thumb"></span></span>
        <span class="toggle-copy"><strong>${checked ? '开启' : '关闭'}</strong><small>${description}</small></span>
      </button>
    </div>`;
}

function contentMarkupFor(el) {
  const p = el.props;
  switch (el.type) {
    case 'heading':
      return areaField('标题文字', 'prop', 'text', p.text, 2, '输入一个有力的标题');
    case 'paragraph':
      return areaField('段落文字', 'prop', 'text', p.text, 4, '输入正文内容');
    case 'image':
      return `
        <div class="image-preview"><img src="${escapeAttr(safeUrl(p.src))}" alt="${escapeAttr(p.alt)}" /></div>
        ${textField('图片地址', 'prop', 'src', p.src, 'https://…')}
        ${textField('图片描述', 'prop', 'alt', p.alt, '描述图片内容')}
        <label class="upload-button">${icon('image')} 上传本地图片<input type="file" accept="image/*" data-upload-image hidden /></label>
        <div class="inline-note">${icon('info')}<span>支持网络图片地址，也可以上传本地图片。建议使用 1MB 以内的图片。</span></div>`;
    case 'button':
      return textField('按钮文字', 'prop', 'text', p.text, '例如：开始探索');
    case 'link':
      return `
        ${textField('链接文字', 'prop', 'text', p.text, '例如：访问示例网站')}
        ${textField('链接地址', 'prop', 'href', p.href, 'https://…')}
        ${selectField('打开方式', 'prop', 'target', p.target, [
          { value: '_blank', label: '新窗口打开' },
          { value: '_self', label: '当前窗口打开' }
        ])}
        <div class="inline-note">${icon('info')}<span>可填写网页地址、邮箱（mailto:）或页面内锚点。</span></div>`;
    case 'badge':
      return textField('标签文字', 'prop', 'text', p.text, '例如：新手作品');
    case 'form':
      return `
        ${textField('表单标题', 'prop', 'title', p.title, '例如：留下你的想法')}
        ${textField('辅助说明', 'prop', 'subtitle', p.subtitle, '例如：我们会认真阅读')}
        ${textField('按钮文字', 'prop', 'buttonText', p.buttonText, '例如：发送留言')}`;
    case 'input':
      return `${textField('字段标题', 'prop', 'label', p.label, '例如：你的名字')}${textField(
        '占位提示',
        'prop',
        'placeholder',
        p.placeholder,
        '例如：请输入姓名'
      )}`;
    case 'textarea':
      return `${textField('字段标题', 'prop', 'label', p.label, '例如：留言内容')}${textField(
        '占位提示',
        'prop',
        'placeholder',
        p.placeholder,
        '例如：写下你想说的话…'
      )}`;
    case 'select':
      return `${textField('字段标题', 'prop', 'label', p.label, '例如：最喜欢的学科')}${areaField(
        '选项（每行一个）',
        'prop',
        'options',
        p.options,
        4
      )}`;
    case 'checkbox':
      return textField('说明文字', 'prop', 'label', p.label, '例如：我已阅读并同意');
    case 'card':
      return `
        ${textField('卡片标签', 'prop', 'tag', p.tag, '例如：今日任务')}
        ${textField('卡片标题', 'prop', 'title', p.title, '输入卡片标题')}
        ${areaField('卡片正文', 'prop', 'text', p.text, 3, '输入卡片描述')}`;
    case 'quote':
      return `${areaField('引用内容', 'prop', 'text', p.text, 2)}${textField('署名', 'prop', 'cite', p.cite, '例如：—— 创作小贴士')}`;
    case 'tip':
      return areaField('提示文字', 'prop', 'text', p.text, 3);
    case 'list':
      return `
        ${areaField('列表项（每行一个）', 'prop', 'items', p.items, 5)}
        ${toggleField('有序列表', 'ordered', p.ordered, '使用数字序号')}`;
    case 'table':
      return `
        ${textField('表头', 'prop', 'headers', p.headers, '姓名 | 学科 | 分数')}
        ${areaField('表格数据（每行一条）', 'prop', 'rows', p.rows, 5, '小林 | 信息科技 | 95')}
        <div class="inline-note">${icon('info')}<span>用竖线「|」分隔同一行中的不同单元格，每行代表一条数据。</span></div>`;
    case 'audio':
      return `
        ${textField('音频标题', 'prop', 'title', p.title, '例如：我的配音作品')}
        ${textField('音频地址', 'prop', 'src', p.src, 'https://….mp3')}
        <div class="inline-note">${icon('info')}<span>建议使用 mp3、wav 等浏览器支持的音频地址。预览时可以播放。</span></div>`;
    case 'video':
      return `
        ${textField('视频标题', 'prop', 'title', p.title, '例如：我的校园短片')}
        ${textField('视频地址', 'prop', 'src', p.src, 'https://….mp4')}
        ${textField('封面图片', 'prop', 'poster', p.poster, 'https://…')}
        <div class="inline-note">${icon('info')}<span>建议使用 mp4（H.264）视频地址；封面地址可留空。</span></div>`;
    case 'sticker':
      return textField('符号文字', 'prop', 'text', p.text, '例如：✦');
    case 'decoicon':
      return textField('图标符号', 'prop', 'text', p.text, '例如：✦');
    case 'glow':
      return `<div class="inline-note">${icon('info')}<span>光晕是一个柔和的背景装饰。把它放在图片或标题下层，可以为画面增加氛围。</span></div>`;
    case 'divider':
      return `<div class="inline-note">${icon('info')}<span>分割线用于分隔不同的内容区块，可以在下方样式中调整颜色和粗细。</span></div>`;
    default:
      return '';
  }
}

function styleMarkupFor(el) {
  const p = el.props;
  switch (el.type) {
    case 'heading':
      return `
        ${rangeField('字号', 'prop', 'fontSize', p.fontSize, 24, 72, 1, 'px')}
        ${segmentedField('字重', 'fontWeight', p.fontWeight, [
          { value: 400, label: '常规' },
          { value: 700, label: '粗体' }
        ], 'number')}
        ${segmentedField('对齐', 'align', p.align, [
          { value: 'left', icon: 'align-left' },
          { value: 'center', icon: 'align-center' },
          { value: 'right', icon: 'align-right' }
        ])}
        ${colorField('文字颜色', 'prop', 'color', p.color)}
        ${rangeField('行高', 'prop', 'lineHeight', p.lineHeight, 1, 2.2, 0.05, '', 2)}
        ${rangeField('字间距', 'prop', 'letterSpacing', p.letterSpacing, -2, 6, 0.1, 'px', 1)}`;
    case 'paragraph':
      return `
        ${rangeField('字号', 'prop', 'fontSize', p.fontSize, 12, 28, 1, 'px')}
        ${segmentedField('对齐', 'align', p.align, [
          { value: 'left', icon: 'align-left' },
          { value: 'center', icon: 'align-center' },
          { value: 'right', icon: 'align-right' }
        ])}
        ${colorField('文字颜色', 'prop', 'color', p.color)}
        ${rangeField('行高', 'prop', 'lineHeight', p.lineHeight, 1.2, 2.4, 0.05, '', 2)}`;
    case 'image':
      return `
        ${rangeField('图片圆角', 'prop', 'radius', p.radius, 0, 40, 1, 'px')}
        ${selectField('填充方式', 'prop', 'fit', p.fit, [
          { value: 'cover', label: '裁剪填满' },
          { value: 'contain', label: '完整显示' }
        ])}
        ${rangeField('图片比例', 'prop', 'aspect', p.aspect, 0.7, 2, 0.02, '', 2)}
        ${colorField('占位背景', 'prop', 'bg', p.bg)}
        ${toggleField('柔和投影', 'shadow', p.shadow, '让图片浮起来')}`;
    case 'button':
      return `
        ${segmentedField('按钮类型', 'variant', p.variant, [
          { value: 'primary', label: '主按钮' },
          { value: 'outline', label: '描边' },
          { value: 'dark', label: '深色' }
        ])}
        ${colorField('背景颜色', 'prop', 'bg', p.bg)}
        ${colorField('文字颜色', 'prop', 'color', p.color)}
        ${rangeField('字号', 'prop', 'fontSize', p.fontSize, 11, 20, 1, 'px')}
        ${rangeField('圆角', 'prop', 'radius', p.radius, 0, 32, 1, 'px')}
        ${rangeField('左右留白', 'prop', 'paddingX', p.paddingX, 8, 40, 1, 'px')}
        ${rangeField('上下留白', 'prop', 'paddingY', p.paddingY, 6, 24, 1, 'px')}
        ${toggleField('按钮投影', 'shadow', p.shadow, '增强点击感')}`;
    case 'badge':
      return `
        ${colorField('标签背景', 'prop', 'bg', p.bg)}
        ${colorField('文字颜色', 'prop', 'color', p.color)}
        ${rangeField('字号', 'prop', 'fontSize', p.fontSize, 9, 18, 0.5, 'px', 1)}
        ${rangeField('圆角', 'prop', 'radius', p.radius, 0, 40, 1, 'px')}`;
    case 'link':
      return `
        ${rangeField('字号', 'prop', 'fontSize', p.fontSize, 10, 24, 0.5, 'px', 1)}
        ${colorField('链接颜色', 'prop', 'color', p.color)}
        ${toggleField('显示下划线', 'underline', p.underline, '更明显地区分链接')}`;
    case 'divider':
      return `
        ${colorField('线条颜色', 'prop', 'color', p.color)}
        ${rangeField('线条粗细', 'prop', 'thickness', p.thickness, 1, 8, 1, 'px')}`;
    case 'form':
      return `
        ${colorField('表单背景', 'prop', 'bg', p.bg)}
        ${colorField('强调色', 'prop', 'accent', p.accent)}
        ${rangeField('圆角', 'prop', 'radius', p.radius, 0, 32, 1, 'px')}
        ${toggleField('卡片投影', 'shadow', p.shadow, '让表单更立体')}`;
    case 'input':
    case 'textarea':
    case 'select':
      return `
        ${colorField('输入框背景', 'prop', 'bg', p.bg)}
        ${colorField('强调色', 'prop', 'accent', p.accent)}
        ${rangeField('圆角', 'prop', 'radius', p.radius, 0, 24, 1, 'px')}`;
    case 'checkbox':
      return colorField('选中颜色', 'prop', 'accent', p.accent);
    case 'card':
      return `
        ${colorField('卡片背景', 'prop', 'bg', p.bg)}
        ${colorField('强调色', 'prop', 'accent', p.accent)}
        ${rangeField('圆角', 'prop', 'radius', p.radius, 0, 32, 1, 'px')}
        ${toggleField('卡片投影', 'shadow', p.shadow, '增强层次感')}`;
    case 'quote':
      return `
        ${colorField('背景颜色', 'prop', 'bg', p.bg)}
        ${colorField('强调色', 'prop', 'accent', p.accent)}
        ${colorField('文字颜色', 'prop', 'color', p.color)}
        ${rangeField('圆角', 'prop', 'radius', p.radius, 0, 28, 1, 'px')}`;
    case 'tip':
      return `
        ${colorField('背景颜色', 'prop', 'bg', p.bg)}
        ${colorField('强调色', 'prop', 'accent', p.accent)}
        ${colorField('文字颜色', 'prop', 'color', p.color)}
        ${rangeField('圆角', 'prop', 'radius', p.radius, 0, 28, 1, 'px')}`;
    case 'list':
      return `
        ${rangeField('字号', 'prop', 'fontSize', p.fontSize, 10, 24, 1, 'px')}
        ${rangeField('行高', 'prop', 'lineHeight', p.lineHeight, 1.3, 2.4, 0.05, '', 2)}
        ${colorField('文字颜色', 'prop', 'color', p.color)}
        ${colorField('项目符号颜色', 'prop', 'accent', p.accent)}`;
    case 'table':
      return `
        ${rangeField('字号', 'prop', 'fontSize', p.fontSize, 9, 16, 0.5, 'px', 1)}
        ${colorField('表头背景', 'prop', 'headerBg', p.headerBg)}
        ${colorField('表头文字', 'prop', 'headerColor', p.headerColor)}
        ${colorField('正文文字', 'prop', 'color', p.color)}
        ${colorField('边框颜色', 'prop', 'borderColor', p.borderColor)}
        ${rangeField('圆角', 'prop', 'radius', p.radius, 0, 24, 1, 'px')}
        ${toggleField('斑马纹', 'stripe', p.stripe, '隔行使用浅色背景')}
        ${toggleField('表格投影', 'shadow', p.shadow, '让表格浮起来')}`;
    case 'audio':
      return `
        ${colorField('卡片背景', 'prop', 'bg', p.bg)}
        ${colorField('强调色', 'prop', 'accent', p.accent)}
        ${rangeField('圆角', 'prop', 'radius', p.radius, 0, 28, 1, 'px')}`;
    case 'video':
      return `
        ${colorField('卡片背景', 'prop', 'bg', p.bg)}
        ${colorField('强调色', 'prop', 'accent', p.accent)}
        ${rangeField('圆角', 'prop', 'radius', p.radius, 0, 28, 1, 'px')}
        ${toggleField('卡片投影', 'shadow', p.shadow, '增强画面层次')}`;
    case 'glow':
      return `
        ${colorField('光晕颜色', 'prop', 'color', p.color)}
        ${rangeField('不透明度', 'prop', 'opacity', p.opacity, 0.05, 1, 0.05, '', 2)}
        ${rangeField('模糊程度', 'prop', 'blur', p.blur, 0, 36, 1, 'px')}`;
    case 'sticker':
      return `
        ${colorField('符号颜色', 'prop', 'color', p.color)}
        ${rangeField('符号大小', 'prop', 'fontSize', p.fontSize, 18, 120, 1, 'px')}
        ${rangeField('旋转角度', 'prop', 'rotate', p.rotate, -30, 30, 1, '°')}
        ${rangeField('不透明度', 'prop', 'opacity', p.opacity, 0.1, 1, 0.05, '', 2)}`;
    case 'decoicon':
      return `
        ${colorField('图标背景', 'prop', 'bg', p.bg)}
        ${colorField('图标颜色', 'prop', 'color', p.color)}
        ${rangeField('符号大小', 'prop', 'fontSize', p.fontSize, 12, 48, 1, 'px')}
        ${rangeField('圆角', 'prop', 'radius', p.radius, 0, 32, 1, 'px')}
        ${toggleField('图标投影', 'shadow', p.shadow, '增加立体感')}`;
    default:
      return '';
  }
}

function positionGroup(el) {
  return `
    <div class="control-group">
      <div class="group-title"><span>${icon('layers')}位置与尺寸</span><small>POSITION</small></div>
      <div class="two-fields">
        <div class="field">
          <label class="field-label"><span>水平 X</span></label>
          <input class="text-input" type="number" data-el-prop="x" data-value-type="number" value="${Math.round(
            el.x
          )}" min="0" max="${CANVAS_W}" step="1" />
        </div>
        <div class="field">
          <label class="field-label"><span>垂直 Y</span></label>
          <input class="text-input" type="number" data-el-prop="y" data-value-type="number" value="${Math.round(
            el.y
          )}" min="0" max="${CANVAS_H}" step="1" />
        </div>
      </div>
      ${rangeField('组件宽度', 'el', 'w', el.w, 40, 880, 1, 'px')}
      <div class="layer-actions">
        <button class="layer-btn" type="button" data-layer-action="up">${icon('arrow-up')}上移一层</button>
        <button class="layer-btn" type="button" data-layer-action="down">${icon('arrow-down')}下移一层</button>
        <button class="layer-btn" type="button" data-layer-action="front">${icon('layers')}置于顶层</button>
        <button class="layer-btn" type="button" data-layer-action="back">${icon('layers')}置于底层</button>
      </div>
      <div class="inline-note">${icon('info')}<span>也可以直接在画板中拖拽组件。选中后使用方向键可 1px 微调。</span></div>
    </div>`;
}

function pageSettingsMarkup() {
  const categoryCount = new Set(state.elements.map((el) => getDef(el.type)?.category)).size;
  return `
    ${controlGroup(
      '页面信息',
      'layout',
      `
        ${textField('页面标题', 'page', 'title', state.pageTitle, '为作品起一个名字')}
        ${colorField('画板背景', 'page', 'bg', state.canvasBg)}
        <div class="field">
          <div class="field-label"><span>显示网格</span></div>
          <button class="toggle-row" type="button" data-page-toggle="grid" role="switch" aria-checked="${state.grid}">
            <span class="toggle-track"><span class="toggle-thumb"></span></span>
            <span class="toggle-copy"><strong>${state.grid ? '开启' : '关闭'}</strong><small>辅助对齐组件</small></span>
          </button>
        </div>
      `,
      'PAGE'
    )}
    ${controlGroup(
      '作品概览',
      'grid',
      `
        <div class="stat-grid">
          <div class="stat-card"><strong>${state.elements.length}</strong><span>个组件</span></div>
          <div class="stat-card"><strong>${categoryCount}</strong><span>个分类</span></div>
          <div class="stat-card"><strong>900×600</strong><span>画板尺寸</span></div>
          <div class="stat-card"><strong>${state.design.accent.toUpperCase()}</strong><span>品牌色</span></div>
        </div>
      `,
      'OVERVIEW'
    )}
    ${controlGroup(
      '快速操作',
      'bolt',
      `
        <div class="quick-actions">
          <button class="layer-btn" type="button" data-cmd="help">${icon('help')}创作指南</button>
          <button class="layer-btn" type="button" data-cmd="reset-demo">${icon('undo')}恢复示例</button>
        </div>
      `,
      'SHORTCUTS'
    )}`;
}

function renderInspector(resetScroll = false) {
  if (!dom.inspectorBody) return;
  updateSelectionChip();

  if (state.mode === 'css') {
    dom.inspectorEyebrow.textContent = 'DESIGN AUDIT';
    dom.inspectorTitle.textContent = '设计体检';
    dom.selectionChip.hidden = true;
    dom.inspectorBody.innerHTML = renderAuditPanel();
    if (resetScroll) dom.inspectorBody.scrollTop = 0;
    return;
  }

  const el = selectedElement();
  if (!el) {
    dom.inspectorEyebrow.textContent = 'PAGE SETTINGS';
    dom.inspectorTitle.textContent = '页面设置';
    dom.selectionChip.hidden = true;
    dom.inspectorBody.innerHTML = pageSettingsMarkup();
  } else {
    dom.inspectorEyebrow.textContent = 'INSPECTOR';
    dom.inspectorTitle.textContent = '参数调整';
    dom.selectionChip.hidden = false;
    dom.selectionChip.textContent = getDisplayName(el.type);
    dom.inspectorBody.innerHTML = `
      ${controlGroup('内容', 'type', contentMarkupFor(el), 'CONTENT')}
      ${controlGroup('样式', 'palette', styleMarkupFor(el), 'STYLE')}
      ${positionGroup(el)}`;
  }
  if (resetScroll) dom.inspectorBody.scrollTop = 0;
}

/* ============================================================
   设计体检
   ============================================================ */

function getCanvasMetrics() {
  return state.elements.map((el) => {
    const node = dom.artboard.querySelector(`.canvas-el[data-id="${el.id}"]`);
    return {
      el,
      x: el.x,
      y: el.y,
      w: el.w,
      h: node ? node.offsetHeight : 70
    };
  });
}

function countOverlaps(metrics) {
  let count = 0;
  const filtered = metrics.filter((item) => item.el.type !== 'glow');
  for (let i = 0; i < filtered.length; i += 1) {
    for (let j = i + 1; j < filtered.length; j += 1) {
      const a = filtered[i];
      const b = filtered[j];
      const xOverlap = Math.max(0, Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x));
      const yOverlap = Math.max(0, Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y));
      const intersection = xOverlap * yOverlap;
      const minArea = Math.min(a.w * a.h, b.w * b.h);
      if (intersection > 320 && minArea > 0 && intersection / minArea > 0.28) count += 1;
    }
  }
  return count;
}

function countStrongColors() {
  const count = new Set();
  state.elements.forEach((el) => {
    const p = el.props;
    ['color', 'bg', 'accent'].forEach((key) => {
      if (typeof p[key] !== 'string') return;
      if (!/^#[0-9a-f]{6}$/i.test(p[key])) return;
      if (relativeLuminance(p[key]) > 0.9) return;
      count.add(p[key].toLowerCase());
    });
  });
  return count.size;
}

function minTextContrast() {
  const candidates = [];
  state.elements.forEach((el) => {
    const p = el.props;
    if (['heading', 'paragraph'].includes(el.type)) {
      candidates.push({ fg: p.color, bg: state.canvasBg });
    }
    if (el.type === 'tip' || el.type === 'quote') {
      candidates.push({ fg: p.color, bg: p.bg });
    }
    if (el.type === 'card') {
      candidates.push({ fg: '#1c2c45', bg: p.bg });
    }
    if (el.type === 'form') {
      candidates.push({ fg: '#182942', bg: p.bg });
    }
    if (el.type === 'list') {
      candidates.push({ fg: p.color, bg: state.canvasBg });
    }
    if (el.type === 'table') {
      candidates.push({ fg: p.color, bg: '#ffffff' });
    }
  });
  if (!candidates.length) return 21;
  return Math.min(...candidates.map((item) => contrastRatio(item.fg, item.bg)));
}

function computeAudit() {
  const metrics = getCanvasMetrics();
  const contrast = minTextContrast();
  const radii = [
    ...new Set(
      state.elements
        .map((el) => el.props.radius)
        .filter((value) => Number.isFinite(Number(value)))
        .map((value) => Math.round(Number(value)))
    )
  ];
  const fontSizes = [
    ...new Set(
      state.elements.flatMap((el) => {
        const sizes = [];
        const size = Number(el.props.fontSize);
        if (Number.isFinite(size) && size > 0) sizes.push(Math.round(size * 10) / 10);
        if (el.type === 'card') sizes.push(18);
        if (el.type === 'form') sizes.push(17);
        if (el.type === 'quote') sizes.push(13);
        if (el.type === 'tip') sizes.push(10.5);
        return sizes;
      })
    )
  ];
  const colorCount = countStrongColors();
  const overlaps = countOverlaps(metrics);

  const checks = [
    {
      id: 'contrast',
      label: '文字对比度',
      pass: contrast >= 4.5,
      value: `${contrast.toFixed(1)}:1`,
      detail: contrast >= 4.5 ? '文字清晰易读' : '部分文字偏浅'
    },
    {
      id: 'hierarchy',
      label: '字号层级',
      pass: fontSizes.length >= 3,
      value: `${fontSizes.length} 级`,
      detail: fontSizes.length >= 3 ? '主次关系清楚' : '建议增加字号差异'
    },
    {
      id: 'radius',
      label: '圆角统一',
      pass: radii.length <= 3,
      value: `${radii.length} 种`,
      detail: radii.length <= 3 ? '圆角语言一致' : '圆角类型偏多'
    },
    {
      id: 'palette',
      label: '配色克制',
      pass: colorCount <= 8,
      value: `${colorCount} 色`,
      detail: colorCount <= 8 ? '颜色数量合适' : '颜色有点多'
    },
    {
      id: 'overlap',
      label: '画面留白',
      pass: overlaps === 0,
      value: overlaps === 0 ? '清爽' : `${overlaps} 处`,
      detail: overlaps === 0 ? '组件互不打扰' : '有组件重叠'
    }
  ];

  const warnings = checks.filter((check) => !check.pass).length;
  const score = state.elements.length ? Math.max(45, 100 - warnings * 6) : 0;
  let status = '建议优化';
  let message = '按照建议调整，让页面更统一。';
  if (score >= 98) {
    status = '非常出色';
    message = '版式、配色与文字层级都很协调。';
  } else if (score >= 90) {
    status = '状态良好';
    message = '整体已经很不错，再优化一处会更专业。';
  } else if (score >= 75) {
    status = '还有提升空间';
    message = '从圆角、对比度或留白开始调整吧。';
  }
  if (!state.elements.length) {
    status = '等待创作';
    message = '添加组件后，这里会出现设计建议。';
  }

  const accentUnified = state.elements
    .filter((el) =>
      ['button', 'badge', 'card', 'tip', 'form', 'quote', 'link', 'list', 'table', 'audio', 'video'].includes(el.type)
    )
    .every((el) => {
      if (el.type === 'button') return el.props.bg.toLowerCase() === state.design.accent.toLowerCase();
      if (el.type === 'badge' || el.type === 'link') {
        return el.props.color.toLowerCase() === state.design.accent.toLowerCase();
      }
      if (el.type === 'table') {
        return String(el.props.headerColor || '').toLowerCase() === state.design.accent.toLowerCase();
      }
      return String(el.props.accent || '').toLowerCase() === state.design.accent.toLowerCase();
    });

  return {
    checks,
    warnings,
    score,
    status,
    message,
    contrast,
    radii,
    accentUnified,
    overlaps
  };
}

function renderAuditPanel() {
  const audit = computeAudit();
  const circumference = 163.36;
  const offset = circumference * (1 - audit.score / 100);
  const suggestions = [];

  if (!audit.radii.length || audit.radii.length > 1) {
    suggestions.push({
      action: 'radius',
      icon: 'radius',
      title: '统一圆角',
      desc: `将全页圆角统一为 ${state.design.radius}px`
    });
  }
  if (audit.contrast < 4.5) {
    suggestions.push({
      action: 'contrast',
      icon: 'type',
      title: '增强文字对比度',
      desc: '让正文颜色更深，阅读更轻松'
    });
  }
  if (!state.design.shadow) {
    suggestions.push({
      action: 'shadow',
      icon: 'shadow',
      title: '添加柔和投影',
      desc: '给卡片与图片增加一点层次'
    });
  }
  if (!audit.accentUnified && suggestions.length < 3) {
    suggestions.push({
      action: 'accent',
      icon: 'color',
      title: '统一品牌色',
      desc: `把按钮与强调元素统一为 ${state.design.accent}`
    });
  }
  if (!suggestions.length) {
    suggestions.push({
      action: 'accent',
      icon: 'color',
      title: '统一品牌色',
      desc: '保持强调元素使用同一主色'
    });
  }

  return `
    <div class="audit-hero">
      <div class="score-ring">
        <svg viewBox="0 0 66 66">
          <circle class="ring-bg" cx="33" cy="33" r="26"></circle>
          <circle class="ring-value" cx="33" cy="33" r="26" style="stroke-dashoffset:${offset}"></circle>
        </svg>
        <span class="score-number"><strong>${audit.score}</strong><span>设计分</span></span>
      </div>
      <div class="audit-summary">
        <h3>${audit.status}</h3>
        <p>${audit.message}</p>
        <span class="audit-badge">${icon('bolt')}${audit.warnings === 0 ? '全部检查通过' : `${audit.warnings} 项可优化`}</span>
      </div>
    </div>

    <div class="group-title" style="margin-top:0"><span>${icon('wand')}优化建议</span><small>ONE CLICK</small></div>
    <div class="optimize-list">
      ${suggestions
        .map(
          (item) => `
          <div class="optimize-card">
            <span class="optimize-icon">${icon(item.icon)}</span>
            <span class="optimize-copy"><strong>${item.title}</strong><small>${item.desc}</small></span>
            <button class="apply-btn" type="button" data-optimize="${item.action}">应用</button>
          </div>`
        )
        .join('')}
    </div>

    <div class="group-title" style="margin-top:14px"><span>${icon('grid')}检查明细</span><small>CHECKLIST</small></div>
    <div class="audit-list">
      ${audit.checks
        .map(
          (check) => `
          <div class="audit-item ${check.pass ? '' : 'is-warn'}">
            <span class="audit-status">${icon(check.pass ? 'check' : 'info')}</span>
            <span class="audit-copy"><strong>${check.label}</strong><small>${check.detail}</small></span>
            <span class="audit-value">${check.value}</span>
          </div>`
        )
        .join('')}
    </div>
    <div class="inline-note">${icon('info')}<span>「CSS 优化」会改变全页样式，仍可随时撤销。品牌色、圆角和投影都会同步写入右侧 CSS。</span></div>
  `;
}

/* ============================================================
   属性变更处理
   ============================================================ */

function syncPositionFields() {
  const el = selectedElement();
  if (!el) return;
  $$('[data-el-prop]', dom.inspectorBody).forEach((input) => {
    const key = input.dataset.elProp;
    if (key === 'x' || key === 'y' || key === 'w') {
      if (document.activeElement !== input) input.value = Math.round(el[key]);
      if (input.type === 'range') {
        const min = Number(input.min);
        const max = Number(input.max);
        input.style.setProperty('--range-progress', `${((el[key] - min) / (max - min)) * 100}%`);
      }
    }
  });
  $$('[data-output-kind="el"]', dom.inspectorBody).forEach((output) => {
    const key = output.dataset.outputKey;
    if (key === 'w') output.textContent = `${Math.round(el.w)} px`;
  });
}

function syncControlValue(kind, key, value) {
  const selector =
    kind === 'page'
      ? `[data-page-prop="${key}"]`
      : kind === 'el'
        ? `[data-el-prop="${key}"]`
        : `[data-prop="${key}"]`;
  const controls = $$(selector, dom.inspectorBody);
  controls.forEach((control) => {
    const isActive = document.activeElement === control;
    if (!isActive) {
      if (control.type === 'color') {
        control.value = normalizeHex(value, control.value);
      } else if (control.type === 'text' || control.type === 'number' || control.type === 'range') {
        if (control.dataset.valueType === 'color') {
          control.value = normalizeHex(value, '#000000').toUpperCase();
        } else {
          control.value = value;
        }
      }
    }
    if (control.type === 'range') {
      const min = Number(control.min);
      const max = Number(control.max);
      control.style.setProperty('--range-progress', `${((Number(value) - min) / (max - min)) * 100}%`);
    }
  });
  $$(`[data-output-kind="${kind}"][data-output-key="${key}"]`, dom.inspectorBody).forEach((output) => {
    const rawUnit = output.textContent.includes('px')
      ? ' px'
      : output.textContent.includes('°')
        ? '°'
        : '';
    const decimals = String(value).includes('.') ? 2 : 0;
    output.textContent = `${formatNumber(value, decimals)}${rawUnit}`;
  });
  $$('.color-preview', dom.inspectorBody).forEach((preview) => {
    if (preview.dataset.previewKind === kind && preview.dataset.previewKey === key) {
      preview.style.setProperty('--color', normalizeHex(value));
    }
  });
  $$('.segmented button', dom.inspectorBody).forEach((button) => {
    if (button.dataset.setProp === key) {
      button.classList.toggle('is-active', String(button.dataset.value) === String(value));
    }
  });
  $$('[data-toggle-prop]', dom.inspectorBody).forEach((button) => {
    if (button.dataset.toggleProp !== key) return;
    button.setAttribute('aria-checked', String(Boolean(value)));
    const strong = $('.toggle-copy strong', button);
    if (strong) strong.textContent = value ? '开启' : '关闭';
  });
}

function updatePageLabels() {
  const title = state.pageTitle || '未命名作品';
  document.title = `${title} · HTML炼金工坊`;
  dom.stageLabel.textContent = title;
  dom.browserTitle.textContent = title;
}

function applyPageProp(key, value) {
  if (key === 'title') {
    state.pageTitle = String(value).slice(0, 40);
    updatePageLabels();
  } else if (key === 'bg') {
    state.canvasBg = normalizeHex(value, '#ffffff');
    dom.artboard.style.background = state.canvasBg;
  }
  scheduleCodeUpdate();
  queueSave();
}

function handleInspectorInput(event) {
  const control = event.target.closest('[data-prop], [data-el-prop], [data-page-prop]');
  if (!control) return;
  const prop = control.dataset.prop;
  const elProp = control.dataset.elProp;
  const pageProp = control.dataset.pageProp;
  const kind = prop ? 'prop' : elProp ? 'el' : 'page';
  const key = prop || elProp || pageProp;
  if (!key) return;

  if (kind === 'el') {
    const el = selectedElement();
    if (!el) return;
    const raw = Number(control.value);
    if (!Number.isFinite(raw)) return;
    const min = control.min !== '' ? Number(control.min) : -Infinity;
    const max = control.max !== '' ? Number(control.max) : Infinity;
    const value = clamp(Math.round(raw), min, max);
    beginEdit(`el:${el.id}:${key}`);
    commitEdit(`el:${el.id}:${key}`);
    el[key] = value;
    const node = dom.artboard.querySelector(`.canvas-el[data-id="${el.id}"]`);
    if (node) {
      if (key === 'x') node.style.left = `${el.x}px`;
      else if (key === 'y') node.style.top = `${el.y}px`;
      else if (key === 'w') node.style.width = `${el.w}px`;
      updateSelectionTools();
    }
    syncControlValue(kind, key, value);
    scheduleCodeUpdate();
    queueSave();
    return;
  }

  if (kind === 'page') {
    if (key === 'bg') {
      const color = normalizeHex(control.value, state.canvasBg);
      if (control.dataset.valueType === 'color' && control.type === 'text' && !/^#[0-9a-f]{6}$/i.test(control.value.trim())) {
        return;
      }
      beginEdit(`page:${key}`);
      commitEdit(`page:${key}`);
      applyPageProp(key, color);
      syncControlValue(kind, key, color);
      return;
    }
    beginEdit(`page:${key}`);
    commitEdit(`page:${key}`);
    applyPageProp(key, control.value);
    syncControlValue(kind, key, control.value);
    return;
  }

  const el = selectedElement();
  if (!el) return;
  const current = el.props[key];

  if (control.dataset.valueType === 'color') {
    const rawValue = control.value.trim();
    if (control.type === 'text' && !/^#[0-9a-f]{6}$/i.test(rawValue)) return;
    const color = normalizeHex(rawValue, current);
    beginEdit(`prop:${el.id}:${key}`);
    commitEdit(`prop:${el.id}:${key}`);
    el.props[key] = color;
    syncControlValue(kind, key, color);
  } else if (control.dataset.valueType === 'number') {
    const raw = Number(control.value);
    if (!Number.isFinite(raw)) return;
    const min = control.min !== '' ? Number(control.min) : -Infinity;
    const max = control.max !== '' ? Number(control.max) : Infinity;
    const value = clamp(raw, min, max);
    beginEdit(`prop:${el.id}:${key}`);
    commitEdit(`prop:${el.id}:${key}`);
    el.props[key] = value;
    syncControlValue(kind, key, value);
  } else {
    beginEdit(`prop:${el.id}:${key}`);
    commitEdit(`prop:${el.id}:${key}`);
    el.props[key] = control.value;
    syncControlValue(kind, key, control.value);
  }

  refreshElement(el);
  scheduleCodeUpdate();
  queueSave();
}

function handleInspectorChange(event) {
  if (event.target.matches('select[data-prop]')) {
    handleInspectorInput(event);
  }
}

function handleInspectorClick(event) {
  const segment = event.target.closest('[data-set-prop]');
  if (segment) {
    const el = selectedElement();
    if (!el) return;
    const key = segment.dataset.setProp;
    const valueType = segment.dataset.valueType;
    const value = valueType === 'number' ? Number(segment.dataset.value) : segment.dataset.value;
    beginEdit(`prop:${el.id}:${key}`);
    commitEdit(`prop:${el.id}:${key}`);
    el.props[key] = value;

    if (key === 'variant') {
      if (value === 'primary') {
        el.props.bg = state.design.accent;
        el.props.color = '#ffffff';
        el.props.border = state.design.accent;
        el.props.shadow = true;
      } else if (value === 'outline') {
        el.props.bg = '#ffffff';
        el.props.color = state.design.accent;
        el.props.border = hexToRgba(state.design.accent, 0.32);
        el.props.shadow = false;
      } else if (value === 'dark') {
        el.props.bg = '#182942';
        el.props.color = '#ffffff';
        el.props.border = '#182942';
        el.props.shadow = true;
      }
      renderInspector();
    } else {
      syncControlValue('prop', key, value);
    }
    refreshElement(el);
    scheduleCodeUpdate();
    queueSave();
    return;
  }

  const toggle = event.target.closest('[data-toggle-prop]');
  if (toggle) {
    const el = selectedElement();
    if (!el) return;
    const key = toggle.dataset.toggleProp;
    const next = !el.props[key];
    beginEdit(`prop:${el.id}:${key}`);
    commitEdit(`prop:${el.id}:${key}`);
    el.props[key] = next;
    toggle.setAttribute('aria-checked', String(next));
    const strong = $('.toggle-copy strong', toggle);
    if (strong) strong.textContent = next ? '开启' : '关闭';
    refreshElement(el);
    scheduleCodeUpdate();
    queueSave();
    return;
  }

  const pageToggle = event.target.closest('[data-page-toggle]');
  if (pageToggle) {
    pushHistory();
    state.grid = !state.grid;
    dom.artboard.classList.toggle('grid-hidden', !state.grid);
    dom.gridBtn.classList.toggle('is-active', state.grid);
    dom.gridBtn.setAttribute('aria-pressed', String(state.grid));
    pageToggle.setAttribute('aria-checked', String(state.grid));
    const strong = $('.toggle-copy strong', pageToggle);
    if (strong) strong.textContent = state.grid ? '开启' : '关闭';
    queueSave();
    return;
  }

  const layer = event.target.closest('[data-layer-action]');
  if (layer) {
    changeLayer(layer.dataset.layerAction);
    return;
  }

  const optimize = event.target.closest('[data-optimize]');
  if (optimize) {
    const action = optimize.dataset.optimize;
    if (action === 'radius') applyUnifiedRadius(state.design.radius);
    if (action === 'contrast') boostContrast();
    if (action === 'shadow') setShadows(true);
    if (action === 'accent') unifyAccent();
    return;
  }

  const cmd = event.target.closest('[data-cmd]');
  if (cmd) {
    if (cmd.dataset.cmd === 'help') openModal('helpModal');
    if (cmd.dataset.cmd === 'reset-demo') resetToDemo();
  }
}

function handleInspectorFocus(event) {
  const control = event.target.closest('[data-prop], [data-el-prop], [data-page-prop], [data-toggle-prop], [data-set-prop]');
  if (!control) return;
  const key =
    control.dataset.prop ||
    control.dataset.elProp ||
    control.dataset.pageProp ||
    control.dataset.toggleProp ||
    control.dataset.setProp;
  beginEdit(`${control.dataset.prop ? 'prop' : control.dataset.elProp ? 'el' : control.dataset.pageProp ? 'page' : 'prop'}:${
    selectedElement()?.id || 'page'
  }:${key}`);
}

function handleImageUpload(event) {
  const input = event.target.closest('[data-upload-image]');
  if (!input || !input.files?.[0]) return;
  const file = input.files[0];
  if (!file.type.startsWith('image/')) {
    showToast('请选择图片文件', 'warning');
    return;
  }
  if (file.size > 1.5 * 1024 * 1024) {
    showToast('图片超过 1.5MB，请换一张小一点的图片', 'warning');
    return;
  }
  const el = selectedElement();
  if (!el || el.type !== 'image') return;
  const reader = new FileReader();
  reader.onload = () => {
    beginEdit(`prop:${el.id}:src`);
    commitEdit(`prop:${el.id}:src`);
    el.props.src = String(reader.result);
    renderInspector();
    refreshElement(el);
    scheduleCodeUpdate();
    queueSave();
    showToast('图片已上传', 'success');
  };
  reader.onerror = () => showToast('图片读取失败，请重试', 'warning');
  reader.readAsDataURL(file);
  input.value = '';
}

/* ============================================================
   CSS 优化模式操作
   ============================================================ */

function applyAccentToElements() {
  const accent = state.design.accent;
  const soft = state.design.soft;
  state.elements.forEach((el) => {
    const p = el.props;
    if (el.type === 'button') {
      if (p.variant === 'primary') {
        p.bg = accent;
        p.border = accent;
      } else if (p.variant === 'outline') {
        p.color = accent;
        p.border = hexToRgba(accent, 0.34);
        p.bg = '#ffffff';
      }
    }
    if (el.type === 'badge') {
      p.color = accent;
      p.bg = soft;
      p.border = hexToRgba(accent, 0.18);
    }
    if (['form', 'card', 'quote', 'tip', 'checkbox', 'input', 'textarea', 'select', 'list', 'audio', 'video'].includes(el.type)) {
      p.accent = accent;
    }
    if (el.type === 'link') p.color = accent;
    if (el.type === 'table') {
      p.headerColor = accent;
      p.headerBg = soft;
    }
    if (el.type === 'glow') p.color = accent;
    if (el.type === 'decoicon') {
      p.color = accent;
      p.bg = soft;
    }
  });
}

function applyTheme(themeKey) {
  const theme = THEMES[themeKey];
  if (!theme) return;
  pushHistory();
  state.design.theme = themeKey;
  state.design.accent = theme.accent;
  state.design.soft = theme.soft;
  state.canvasBg = theme.page;
  applyAccentToElements();
  const cardBackgrounds = [...Object.values(THEMES).map((item) => item.card), '#f7faff'];
  state.elements.forEach((el) => {
    if (el.type === 'card' && cardBackgrounds.includes(el.props.bg.toLowerCase())) {
      el.props.bg = theme.card;
    }
  });
  dom.artboard.style.background = state.canvasBg;
  renderCanvas();
  syncCssLibraryUI();
  renderInspector();
  scheduleCodeUpdate();
  queueSave();
  showToast(`已应用「${theme.name}」主题`, 'success');
}

function setAccent(color) {
  const accent = normalizeHex(color, state.design.accent);
  pushHistory();
  state.design.theme = 'custom';
  state.design.accent = accent;
  state.design.soft = mixHex(accent, '#ffffff', 0.9);
  applyAccentToElements();
  renderCanvas();
  syncCssLibraryUI();
  renderInspector();
  scheduleCodeUpdate();
  queueSave();
}

const RADIUS_TYPES = ['image', 'button', 'badge', 'form', 'input', 'textarea', 'select', 'card', 'quote', 'tip', 'decoicon', 'table', 'audio', 'video'];

function applyUnifiedRadius(radius, record = true) {
  const value = clamp(Number(radius) || 0, 0, 40);
  if (record) pushHistory();
  state.design.radius = value;
  state.elements.forEach((el) => {
    if (RADIUS_TYPES.includes(el.type)) el.props.radius = value;
  });
  renderCanvas();
  syncCssLibraryUI();
  renderInspector();
  scheduleCodeUpdate();
  queueSave();
}

function setShadows(enabled) {
  pushHistory();
  state.design.shadow = Boolean(enabled);
  state.elements.forEach((el) => {
    if (['image', 'button', 'form', 'card', 'decoicon', 'table', 'video'].includes(el.type)) {
      el.props.shadow = Boolean(enabled);
    }
  });
  renderCanvas();
  syncCssLibraryUI();
  renderInspector();
  scheduleCodeUpdate();
  queueSave();
}

function unifyAccent() {
  pushHistory();
  applyAccentToElements();
  renderCanvas();
  renderInspector();
  syncCssLibraryUI();
  scheduleCodeUpdate();
  queueSave();
  showToast('品牌色已统一', 'success');
}

function boostContrast() {
  pushHistory();
  state.elements.forEach((el) => {
    if (el.type === 'paragraph') el.props.color = '#3f5069';
    if (el.type === 'heading') el.props.color = '#0f1f34';
    if (el.type === 'tip') el.props.color = '#34465f';
    if (el.type === 'quote') el.props.color = '#2f4058';
    if (el.type === 'card' || el.type === 'form') {
      if (contrastRatio('#182942', el.props.bg) < 4.5) el.props.bg = '#f7faff';
    }
  });
  renderCanvas();
  renderInspector();
  scheduleCodeUpdate();
  queueSave();
  showToast('文字对比度已增强', 'success');
}

function handleCssLibraryInput(event) {
  if (event.target === dom.radiusRange) {
    const value = Number(event.target.value);
    beginEdit('css:radius');
    commitEdit('css:radius');
    applyUnifiedRadius(value, false);
  }
}

function handleCssLibraryClick(event) {
  const theme = event.target.closest('[data-theme]');
  if (theme) {
    applyTheme(theme.dataset.theme);
    return;
  }
  const accent = event.target.closest('[data-accent]');
  if (accent) {
    setAccent(accent.dataset.accent);
    return;
  }
  if (event.target.closest('#shadowToggle')) {
    setShadows(!state.design.shadow);
  }
}

/* ============================================================
   模式切换
   ============================================================ */

function setMode(mode) {
  if (mode !== 'build' && mode !== 'css') return;
  if (state.mode === mode) return;
  state.mode = mode;
  $$('.mode-tab').forEach((tab) => tab.classList.toggle('is-active', tab.dataset.mode === mode));
  dom.buildLibrary.hidden = mode !== 'build';
  dom.cssLibrary.hidden = mode !== 'css';
  dom.libraryEyebrow.textContent = mode === 'css' ? 'STYLE SYSTEM' : 'COMPONENTS';
  dom.libraryTitle.textContent = mode === 'css' ? 'CSS 优化' : '组件库';
  dom.stageModePill.textContent = mode === 'css' ? '优化模式' : '编辑模式';
  dom.stageNote.innerHTML =
    mode === 'css'
      ? `${icon('wand')}优化会同步写入 CSS`
      : `${icon('save')}自动保存到本地`;
  state.codeView = mode === 'css' ? 'css' : 'html';
  syncCodeTabs();

  renderInspector(true);
  syncCssLibraryUI();
  dom.codePre.scrollTop = 0;
  dom.codePre.scrollLeft = 0;
  dom.lineNumbers.scrollTop = 0;
  scheduleCodeUpdate();

  document.querySelector('.workspace').classList.add('is-mode-switching');
  window.setTimeout(() => {
    document.querySelector('.workspace').classList.remove('is-mode-switching');
  }, 380);
}

/* ============================================================
   历史记录
   ============================================================ */

function pushHistory(snapshot = serializeState()) {
  if (historyStack[historyStack.length - 1] === snapshot) {
    redoStack = [];
    updateHistoryButtons();
    return;
  }
  historyStack.push(snapshot);
  if (historyStack.length > HISTORY_LIMIT) historyStack.shift();
  redoStack = [];
  updateHistoryButtons();
}

function updateHistoryButtons() {
  if (!dom.undoBtn) return;
  dom.undoBtn.disabled = historyStack.length === 0;
  dom.redoBtn.disabled = redoStack.length === 0;
}

function beginEdit(key) {
  if (!editContext || editContext.key !== key) {
    editContext = { key, before: serializeState(), committed: false };
  }
  clearTimeout(editTimer);
  editTimer = setTimeout(() => {
    editContext = null;
  }, 1600);
}

function commitEdit(key) {
  if (!editContext || editContext.key !== key) {
    pushHistory();
    return;
  }
  if (!editContext.committed) {
    pushHistory(editContext.before);
    editContext.committed = true;
  }
  clearTimeout(editTimer);
  editTimer = setTimeout(() => {
    editContext = null;
  }, 1600);
}

function restoreSnapshot(snapshot) {
  state.elements = [];
  state.nextId = 1;
  deserializeState(snapshot);
  if (!state.elements.some((el) => el.id === state.selectedId)) {
    state.selectedId = state.elements[0]?.id || null;
  }
  editContext = null;
  renderCanvas();
  updatePageLabels();
  syncCssLibraryUI();
  renderInspector();
  dom.artboard.style.background = state.canvasBg;
  scheduleCodeUpdate();
  queueSave();
}

function undo() {
  if (!historyStack.length) return;
  const current = serializeState();
  const previous = historyStack.pop();
  redoStack.push(current);
  editContext = null;
  restoreSnapshot(previous);
  updateHistoryButtons();
  showToast('已撤销上一步', 'success');
}

function redo() {
  if (!redoStack.length) return;
  const current = serializeState();
  const next = redoStack.pop();
  historyStack.push(current);
  editContext = null;
  restoreSnapshot(next);
  updateHistoryButtons();
  showToast('已重做', 'success');
}

/* ============================================================
   自动保存
   ============================================================ */

function setSaveStatus(mode) {
  if (!dom.saveStatus) return;
  clearTimeout(saveStatusTimer);
  dom.saveStatus.classList.toggle('is-saving', mode === 'saving');
  if (mode === 'saving') {
    dom.saveText.textContent = '保存中…';
    return;
  }
  if (mode === 'error') {
    dom.saveText.textContent = '未能保存';
    return;
  }
  dom.saveText.textContent = '已自动保存';
}

function queueSave() {
  clearTimeout(saveTimer);
  setSaveStatus('saving');
  saveTimer = setTimeout(() => {
    try {
      localStorage.setItem(STORAGE_KEY, serializeState());
      setSaveStatus('saved');
      isSavingError = false;
    } catch (error) {
      setSaveStatus('error');
      if (!isSavingError) {
        isSavingError = true;
        showToast('本地存储空间不足，图片可能太大，建议改用图片链接', 'warning', 4200);
      }
    }
  }, 320);
}

/* ============================================================
   Toast 与弹窗
   ============================================================ */

function showToast(message, type = 'info', duration = 2400) {
  const toast = document.createElement('div');
  toast.className = `toast ${type === 'success' ? 'is-success' : type === 'warning' ? 'is-warning' : ''}`;
  toast.innerHTML = `${icon(type === 'success' ? 'check' : type === 'warning' ? 'info' : 'bolt')}<span>${escapeHTML(
    message
  )}</span>`;
  dom.toastStack.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('is-leaving');
    setTimeout(() => toast.remove(), 220);
  }, duration);
}

function openModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  $$('.modal-layer.is-open').forEach((layer) => {
    if (layer !== modal) closeModal(layer);
  });
  lastFocusedElement = document.activeElement;
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  const focusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
  if (focusable) setTimeout(() => focusable.focus(), 80);
}

function closeModal(modal) {
  if (!modal) return;
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
    lastFocusedElement.focus();
  }
}

function closeAllModals() {
  $$('.modal-layer.is-open').forEach((modal) => closeModal(modal));
}

function openPreview() {
  openModal('previewModal');
  renderPreview('desktop');
}

function renderPreview(device) {
  const widths = { desktop: 900, tablet: 720, phone: 390 };
  const width = widths[device] || 900;
  const scale = Math.min(1, width / CANVAS_W);
  dom.previewFrameWrap.classList.remove('is-tablet', 'is-phone');
  if (device === 'tablet') dom.previewFrameWrap.classList.add('is-tablet');
  if (device === 'phone') dom.previewFrameWrap.classList.add('is-phone');
  $$('#deviceSwitch button').forEach((button) => {
    button.classList.toggle('is-active', button.dataset.device === device);
  });

  let doc = buildStandaloneDoc();
  const previewStyle = `
  <style>
    html { background: #eef4fb; overflow: hidden; }
    body { display: flex !important; align-items: center !important; justify-content: center !important; min-height: 100vh !important; padding: 0 !important; background: #eef4fb !important; overflow: hidden; }
    .page { zoom: ${scale}; flex: 0 0 auto; margin: 0 !important; }
  </style>`;
  const previewScript =
    '<script>document.addEventListener("submit", function (event) { event.preventDefault(); });</script>';
  doc = doc.replace('</head>', `${previewStyle}</head>`).replace('</body>', `${previewScript}</body>`);
  dom.previewFrame.srcdoc = doc;
}

/* ============================================================
   导出 / 复制
   ============================================================ */

function safeFilename(title) {
  return String(title || '我的网页')
    .replace(/[\\/:*?"<>|]/g, '')
    .slice(0, 40)
    .trim();
}

function downloadFile(content, filename, mime = 'text/plain;charset=utf-8') {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 800);
}

function embedDefaultImage(doc) {
  if (!window.LANMO_HERO_DATA) return doc;
  return doc.split(DEFAULT_IMAGE).join(window.LANMO_HERO_DATA);
}

function buildLinkedHTMLDoc() {
  return embedDefaultImage(generateHTMLDoc());
}

function buildStandaloneDoc() {
  return embedDefaultImage(generateStandaloneHTMLDoc());
}

function downloadHTML() {
  downloadFile(buildLinkedHTMLDoc(), getHtmlFilename(), 'text/html;charset=utf-8');
  showToast('HTML 已下载，请与同名 CSS 文件一起使用', 'success', 3600);
  closeAllModals();
}

function downloadSingleFileHTML() {
  const base = safeFilename(state.pageTitle);
  downloadFile(buildStandaloneDoc(), `${base}-单文件.html`, 'text/html;charset=utf-8');
  showToast('单文件 HTML 已下载', 'success');
  closeAllModals();
}

function downloadCSS() {
  downloadFile(generateCssOnly(), getCssFilename(), 'text/css;charset=utf-8');
  showToast('CSS 文件已下载', 'success');
  closeAllModals();
}

async function copyText(text, message = '代码已复制') {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
    } else {
      const area = document.createElement('textarea');
      area.value = text;
      area.style.position = 'fixed';
      area.style.opacity = '0';
      document.body.appendChild(area);
      area.select();
      document.execCommand('copy');
      area.remove();
    }
    showToast(message, 'success');
  } catch (error) {
    showToast('复制失败，请手动选择代码', 'warning');
  }
}

function copyCurrentCode() {
  const code = getActiveCode();
  copyText(code, state.codeView === 'css' ? 'CSS 已复制' : 'HTML 已复制');
}

function openCodeModal() {
  updateCodeModal();
  openModal('codeModal');
}

/* ============================================================
   导入 HTML
   ============================================================ */

function parseStylePx(value, fallback = 0) {
  const parsed = parseFloat(String(value || ''));
  return Number.isFinite(parsed) ? parsed : fallback;
}

function cssColorToHex(value, fallback = '#2f6bff') {
  if (!value) return fallback;
  const probe = document.createElement('span');
  probe.style.color = value;
  if (!probe.style.color) return fallback;
  document.body.appendChild(probe);
  const computed = getComputedStyle(probe).color;
  probe.remove();
  const match = computed.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)$/i);
  if (!match) return fallback;
  if (match[4] !== undefined && Number(match[4]) < 0.05) return fallback;
  return `#${[1, 2, 3]
    .map((index) => Number(match[index]).toString(16).padStart(2, '0'))
    .join('')}`;
}

function cssBackgroundToHex(value, fallback = '#ffffff') {
  if (!value) return fallback;
  const probe = document.createElement('span');
  probe.style.background = value;
  if (!probe.style.background) return fallback;
  document.body.appendChild(probe);
  const computed = getComputedStyle(probe).backgroundColor;
  probe.remove();
  const match = computed.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)$/i);
  if (!match) return fallback;
  if (match[4] !== undefined && Number(match[4]) < 0.05) return fallback;
  return `#${[1, 2, 3]
    .map((index) => Number(match[index]).toString(16).padStart(2, '0'))
    .join('')}`;
}

function cleanImportedText(value) {
  return String(value || '')
    .replace(/\u00a0/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function importedAlign(style, fallback = 'left') {
  const align = String(style.textAlign || '').toLowerCase();
  if (align === 'center' || align === 'right') return align;
  if (align === 'left' || align === 'start') return 'left';
  return fallback;
}

function createImportedElement(type, props, width) {
  const def = getDef(type);
  if (!def) return null;
  return {
    id: null,
    type,
    x: 0,
    y: 0,
    w: Math.round(width || def.width),
    z: 1,
    props: { ...deepClone(def.defaults), ...props }
  };
}

function parseImportedHTML(html, fileName) {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const elements = [];
  const maxElements = 30;
  let ignored = 0;
  let truncated = false;

  const ignoredTags = new Set([
    'script', 'style', 'link', 'meta', 'noscript', 'template', 'iframe',
    'form', 'input', 'select', 'textarea', 'canvas', 'svg', 'head', 'title'
  ]);
  const silentIgnoredTags = new Set([
    'script', 'style', 'link', 'meta', 'noscript', 'template', 'head', 'title'
  ]);
  const containerTags = new Set([
    'body', 'div', 'section', 'article', 'main', 'header', 'footer', 'aside',
    'nav', 'figure', 'figcaption', 'details', 'summary'
  ]);
  const inlineTags = new Set(['span', 'strong', 'em', 'b', 'i', 'u', 'small', 'mark', 'br', 'code']);

  function pushElement(element) {
    if (!element) return false;
    if (elements.length >= maxElements) {
      truncated = true;
      return false;
    }
    elements.push(element);
    return true;
  }

  function buildElement(node, tag) {
    const style = node.style || {};
    const text = cleanImportedText(node.textContent);

    if (/^h[1-6]$/.test(tag)) {
      if (!text) return null;
      const defaults = { h1: 42, h2: 34, h3: 28, h4: 24, h5: 22, h6: 20 };
      const fontValue = parseStylePx(style.fontSize, defaults[tag] || 28);
      const weightValue = parseInt(style.fontWeight, 10);
      return createImportedElement(
        'heading',
        {
          text,
          fontSize: Math.round(clamp(fontValue, 24, 60)),
          fontWeight: Number.isFinite(weightValue) && weightValue < 600 ? 400 : 700,
          color: cssColorToHex(style.color, '#14243c'),
          align: importedAlign(style),
          lineHeight: clamp(parseStylePx(style.lineHeight, 1.2), 1, 2),
          letterSpacing: clamp(parseStylePx(style.letterSpacing, 0), -2, 6)
        },
        374
      );
    }

    if (tag === 'p') {
      if (!text) return null;
      return createImportedElement(
        'paragraph',
        {
          text,
          fontSize: Math.round(clamp(parseStylePx(style.fontSize, 15), 12, 24)),
          color: cssColorToHex(style.color, '#596981'),
          align: importedAlign(style),
          lineHeight: clamp(parseStylePx(style.lineHeight, 1.8), 1.2, 2.4),
          letterSpacing: clamp(parseStylePx(style.letterSpacing, 0), -2, 6)
        },
        374
      );
    }

    if (tag === 'a') {
      if (!text) return null;
      const fontSize = Math.round(clamp(parseStylePx(style.fontSize, 13.5), 10, 24));
      const width = Math.round(clamp(text.length * fontSize * 1.05 + 38, 140, 360));
      return createImportedElement(
        'link',
        {
          text,
          href: node.getAttribute('href') || '#',
          target: node.getAttribute('target') === '_self' ? '_self' : '_blank',
          color: cssColorToHex(style.color, state.design.accent),
          fontSize,
          underline: !String(style.textDecoration || '').includes('none')
        },
        width
      );
    }

    if (tag === 'img') {
      const src = node.getAttribute('src') || node.getAttribute('data-src') || '';
      if (!src) return null;
      return createImportedElement(
        'image',
        {
          src,
          alt: node.getAttribute('alt') || '导入的图片',
          radius: Math.round(clamp(parseStylePx(style.borderRadius, 16), 0, 40)),
          aspect: 1.7,
          fit: 'cover',
          shadow: false
        },
        374
      );
    }

    if (tag === 'ul' || tag === 'ol') {
      const items = Array.from(node.children)
        .filter((child) => child.tagName.toLowerCase() === 'li')
        .map((child) => cleanImportedText(child.textContent))
        .filter(Boolean);
      if (!items.length) return null;
      return createImportedElement(
        'list',
        {
          items: items.join('\n'),
          ordered: tag === 'ol',
          fontSize: Math.round(clamp(parseStylePx(style.fontSize, 14), 10, 24)),
          color: cssColorToHex(style.color, '#455671'),
          lineHeight: clamp(parseStylePx(style.lineHeight, 1.9), 1.3, 2.4),
          accent: state.design.accent
        },
        374
      );
    }

    if (tag === 'table') {
      const rows = Array.from(node.querySelectorAll('tr'));
      if (!rows.length) return null;
      const cellsOf = (row) =>
        Array.from(row.querySelectorAll('th,td')).map((cell) => cleanImportedText(cell.textContent));
      const firstCells = cellsOf(rows[0]);
      if (!firstCells.length) return null;
      const hasHeaderCells = Boolean(rows[0].querySelector('th'));
      const headers = firstCells;
      const bodyRows = rows.slice(hasHeaderCells || rows.length > 1 ? 1 : 0).map(cellsOf);
      if (!hasHeaderCells && rows.length === 1) return null;
      return createImportedElement(
        'table',
        {
          headers: headers.join(' | '),
          rows: bodyRows.map((cells) => cells.join(' | ')).join('\n'),
          fontSize: Math.round(clamp(parseStylePx(style.fontSize, 11.5), 9, 16) * 10) / 10,
          color: cssColorToHex(style.color, '#455671'),
          headerBg: state.design.soft,
          headerColor: state.design.accent,
          borderColor: '#e2eaf5',
          radius: 12,
          stripe: true,
          shadow: false
        },
        374
      );
    }

    if (tag === 'blockquote') {
      const clone = node.cloneNode(true);
      const cite = clone.querySelector('cite');
      const citeText = cite ? cleanImportedText(cite.textContent) : '';
      if (cite) cite.remove();
      const quoteText = cleanImportedText(clone.textContent);
      if (!quoteText) return null;
      return createImportedElement(
        'quote',
        {
          text: quoteText,
          cite: citeText,
          color: cssColorToHex(style.color, '#334155'),
          accent: state.design.accent,
          bg: '#f8fbff',
          radius: 16
        },
        374
      );
    }

    if (tag === 'hr') {
      return createImportedElement(
        'divider',
        {
          color: cssColorToHex(style.borderTopColor, '#dbe6f4'),
          thickness: Math.max(1, Math.round(parseStylePx(style.borderTopWidth, 1)))
        },
        374
      );
    }

    if (tag === 'button') {
      if (!text) return null;
      const width = Math.round(clamp(text.length * 14 + 54, 110, 240));
      return createImportedElement(
        'button',
        {
          text,
          bg: cssBackgroundToHex(style.backgroundColor || style.background, state.design.accent),
          color: cssColorToHex(style.color, '#ffffff'),
          border: cssColorToHex(style.borderColor, state.design.accent),
          radius: Math.round(clamp(parseStylePx(style.borderRadius, 12), 0, 32))
        },
        width
      );
    }

    if (tag === 'audio') {
      const source = node.getAttribute('src') || node.querySelector('source')?.getAttribute('src') || '';
      if (!source) return null;
      return createImportedElement(
        'audio',
        {
          title: node.getAttribute('title') || '导入的音频',
          src: source,
          accent: state.design.accent
        },
        374
      );
    }

    if (tag === 'video') {
      const source = node.getAttribute('src') || node.querySelector('source')?.getAttribute('src') || '';
      if (!source) return null;
      return createImportedElement(
        'video',
        {
          title: node.getAttribute('title') || '导入的视频',
          src: source,
          poster: node.getAttribute('poster') || '',
          accent: state.design.accent,
          shadow: false
        },
        374
      );
    }

    return undefined;
  }

  function visit(node) {
    if (elements.length >= maxElements) {
      truncated = true;
      return;
    }
    const tag = node.tagName.toLowerCase();
    if (ignoredTags.has(tag)) {
      if (!silentIgnoredTags.has(tag)) ignored += 1;
      return;
    }

    const built = buildElement(node, tag);
    if (built) {
      pushElement(built);
      return;
    }

    const isContainer = containerTags.has(tag) || node.children.length > 0;
    if (isContainer) {
      const blockChildren = Array.from(node.children).filter(
        (child) => !inlineTags.has(child.tagName.toLowerCase())
      );
      const text = cleanImportedText(node.textContent);
      if (!blockChildren.length && text) {
        const paragraph = createImportedElement(
          'paragraph',
          {
            text,
            fontSize: Math.round(clamp(parseStylePx(node.style.fontSize, 15), 12, 24)),
            color: cssColorToHex(node.style.color, '#596981'),
            align: importedAlign(node.style),
            lineHeight: 1.8
          },
          374
        );
        pushElement(paragraph);
        return;
      }
      Array.from(node.children).forEach(visit);
      return;
    }

    const fallbackText = cleanImportedText(node.textContent);
    if (fallbackText) {
      pushElement(
        createImportedElement(
          'paragraph',
          {
            text: fallbackText,
            fontSize: Math.round(clamp(parseStylePx(node.style.fontSize, 15), 12, 24)),
            color: cssColorToHex(node.style.color, '#596981'),
            align: importedAlign(node.style),
            lineHeight: 1.8
          },
          374
        )
      );
    }
  }

  const body = doc.body;
  if (body) {
    const bodyBg = cssBackgroundToHex(body.style.backgroundColor || body.style.background, '#ffffff');
    Array.from(body.children).forEach(visit);
    return {
      title: cleanImportedText(doc.title) || fileName.replace(/\.html?$/i, '') || '导入的作品',
      elements,
      background: bodyBg,
      ignored,
      truncated
    };
  }

  return {
    title: fileName.replace(/\.html?$/i, '') || '导入的作品',
    elements,
    background: '#ffffff',
    ignored,
    truncated
  };
}

function layoutImportedElements() {
  if (!state.elements.length) return 0;
  const wideTypes = new Set(['heading', 'paragraph', 'list', 'table', 'image', 'audio', 'video', 'quote', 'tip', 'divider']);

  const tryColumns = (columnCount, gapY = 18) => {
    const startX = columnCount === 3 ? 44 : 56;
    const gapX = columnCount === 3 ? 24 : 40;
    const columnWidth = (CANVAS_W - startX * 2 - gapX * (columnCount - 1)) / columnCount;
    state.elements.forEach((el) => {
      el.w = wideTypes.has(el.type)
        ? Math.round(columnWidth)
        : Math.min(el.w, Math.round(columnWidth));
    });
    renderCanvas();

    const heights = state.elements.map((el) => {
      const node = dom.artboard.querySelector(`.canvas-el[data-id="${el.id}"]`);
      return node ? node.offsetHeight : 60;
    });

    const columns = Array.from({ length: columnCount }, (_, index) => ({
      x: Math.round(startX + index * (columnWidth + gapX)),
      nextY: 50
    }));
    let maxBottom = 50;
    state.elements.forEach((el, index) => {
      const column = columns.reduce((best, item) => (item.nextY < best.nextY ? item : best), columns[0]);
      el.x = column.x;
      el.y = column.nextY;
      column.nextY += heights[index] + gapY;
      maxBottom = Math.max(maxBottom, el.y + heights[index]);
    });
    return maxBottom;
  };

  let maxBottom = tryColumns(2);
  if (maxBottom > 565 && state.elements.length > 4) {
    maxBottom = tryColumns(3, 14);
  }
  renderCanvas();
  return maxBottom;
}

function applyImportedPage(result) {
  pushHistory();
  state.pageTitle = (result.title || '导入的作品').slice(0, 40);
  state.canvasBg = normalizeHex(result.background, '#ffffff');
  state.nextId = Math.max(
    state.nextId,
    state.elements.reduce((max, el) => {
      const value = Number(String(el.id).replace(/[^\d]/g, ''));
      return Number.isFinite(value) ? Math.max(max, value) : max;
    }, 0) + 1
  );
  state.elements = result.elements.map((el, index) => ({
    ...el,
    id: `el-${state.nextId++}`,
    z: index + 2
  }));
  state.selectedId = state.elements[0]?.id || null;

  dom.artboard.style.background = state.canvasBg;
  const maxBottom = layoutImportedElements();
  updatePageLabels();
  syncCssLibraryUI();
  renderInspector(true);
  updateSelectionChip();
  scheduleCodeUpdate();
  queueSave();
  closeModal(dom.importModal);
  fitCanvas();

  const ignoredText = result.ignored ? `，跳过 ${result.ignored} 个不支持的元素` : '';
  showToast(`已导入 ${state.elements.length} 个可编辑组件${ignoredText}`, 'success', 3200);
  if (result.truncated) {
    showToast('内容较多，只导入了前 30 个组件', 'warning', 3800);
  }
  if (maxBottom > CANVAS_H - 12) {
    showToast('部分内容超出画板，可删除或移动组件进行调整', 'warning', 4200);
  }
}

async function handleImportFile(event) {
  const input = event.target;
  const files = Array.from(input.files || []);
  input.value = '';
  if (!files.length) return;
  if (files.length !== 1) {
    showToast('一次只能导入 1 个 HTML 文件', 'warning');
    return;
  }

  const file = files[0];
  const name = file.name.toLowerCase();
  const isHtml = name.endsWith('.html') || name.endsWith('.htm') || file.type === 'text/html';
  if (!isHtml) {
    showToast('请选择 .html 或 .htm 文件', 'warning');
    return;
  }
  if (file.size > 5 * 1024 * 1024) {
    showToast('HTML 文件超过 5MB，请精简后再导入', 'warning');
    return;
  }

  try {
    const html = await file.text();
    const result = parseImportedHTML(html, file.name);
    if (!result.elements.length) {
      showToast('没有找到可编辑的内容，请检查 HTML 文件', 'warning', 3200);
      return;
    }
    if (state.elements.length) {
      const confirmed = window.confirm('导入会替换当前画板中的内容，确定继续吗？');
      if (!confirmed) return;
    }
    applyImportedPage(result);
  } catch (error) {
    showToast('HTML 文件读取失败，请重试', 'warning');
  }
}

/* ============================================================
   其它操作
   ============================================================ */

function resetToDemo() {
  if (!window.confirm('恢复示例作品会替换当前画板内容，确定继续吗？')) return;
  pushHistory();
  createDemoState();
  renderCanvas();
  updatePageLabels();
  syncCssLibraryUI();
  renderInspector(true);
  scheduleCodeUpdate();
  queueSave();
  showToast('示例作品已恢复', 'success');
}

function clearCanvas() {
  if (!state.elements.length) {
    showToast('画板已经是空的', 'info');
    return;
  }
  if (!window.confirm('确定清空画板上的所有组件吗？清空后仍可撤销。')) return;
  pushHistory();
  state.elements = [];
  state.selectedId = null;
  renderCanvas();
  renderInspector();
  updateSelectionChip();
  scheduleCodeUpdate();
  queueSave();
  showToast('画板已清空', 'success');
}

/* ============================================================
   事件绑定
   ============================================================ */

function bindEvents() {
  $$('.mode-tab').forEach((tab) => {
    tab.addEventListener('click', () => setMode(tab.dataset.mode));
  });

  dom.uiFontSwitch.addEventListener('click', (event) => {
    const button = event.target.closest('[data-ui-font]');
    if (!button) return;
    applyUIFontSize(button.dataset.uiFont);
    fitCanvas();
  });

  dom.undoBtn.addEventListener('click', undo);
  dom.redoBtn.addEventListener('click', redo);
  dom.previewBtn.addEventListener('click', openPreview);
  dom.exportBtn.addEventListener('click', () => openModal('exportModal'));
  dom.helpBtn.addEventListener('click', () => openModal('helpModal'));
  dom.libraryHelpBtn.addEventListener('click', () => openModal('helpModal'));
  dom.importBtn.addEventListener('click', () => openModal('importModal'));
  dom.chooseImportFileBtn.addEventListener('click', () => dom.importFileInput.click());
  dom.importFileInput.addEventListener('change', handleImportFile);

  dom.categoryTabs.addEventListener('click', (event) => {
    const tab = event.target.closest('[data-category]');
    if (!tab) return;
    $$('.category-tab', dom.categoryTabs).forEach((button) => {
      button.classList.toggle('is-active', button === tab);
      button.setAttribute('aria-selected', String(button === tab));
    });
    dom.componentSearch.value = '';
    renderComponentGrid();
    dom.buildLibrary.scrollTop = 0;
  });

  dom.componentSearch.addEventListener('input', renderComponentGrid);

  dom.componentGrid.addEventListener('click', (event) => {
    const card = event.target.closest('.component-card');
    if (!card) return;
    if (dom.componentGrid.dataset.justDragged === '1') {
      dom.componentGrid.dataset.justDragged = '0';
      return;
    }
    addComponent(card.dataset.type);
  });

  dom.componentGrid.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    const card = event.target.closest('.component-card');
    if (!card) return;
    event.preventDefault();
    addComponent(card.dataset.type);
  });

  dom.componentGrid.addEventListener('dragstart', (event) => {
    const card = event.target.closest('.component-card');
    if (!card) return;
    card.classList.add('is-dragging');
    dom.componentGrid.dataset.justDragged = '1';
    event.dataTransfer.effectAllowed = 'copy';
    event.dataTransfer.setData('text/plain', card.dataset.type);
  });

  dom.componentGrid.addEventListener('dragend', (event) => {
    const card = event.target.closest('.component-card');
    if (card) card.classList.remove('is-dragging');
    dom.artboard.classList.remove('is-dragover');
    setTimeout(() => {
      dom.componentGrid.dataset.justDragged = '0';
    }, 100);
  });

  dom.artboard.addEventListener('pointerdown', (event) => {
    if (event.target.closest('.selection-tools')) return;
    const node = event.target.closest('.canvas-el');
    if (!node) {
      selectElement(null);
      return;
    }
    startDrag(event);
  });

  document.addEventListener('pointermove', onPointerMove);
  document.addEventListener('pointerup', onPointerUp);

  dom.artboard.addEventListener('dragover', (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
    dom.artboard.classList.add('is-dragover');
  });

  dom.artboard.addEventListener('dragleave', (event) => {
    if (!dom.artboard.contains(event.relatedTarget)) {
      dom.artboard.classList.remove('is-dragover');
    }
  });

  dom.artboard.addEventListener('drop', (event) => {
    event.preventDefault();
    dom.artboard.classList.remove('is-dragover');
    const type = event.dataTransfer.getData('text/plain');
    if (!getDef(type)) return;
    const rect = dom.artboard.getBoundingClientRect();
    const scale = rect.width / CANVAS_W;
    const x = clamp(Math.round((event.clientX - rect.left) / scale), 0, CANVAS_W - 60);
    const y = clamp(Math.round((event.clientY - rect.top) / scale), 0, CANVAS_H - 40);
    addComponent(type, x, y);
  });

  dom.selectionTools.addEventListener('pointerdown', (event) => event.stopPropagation());
  dom.selectionTools.addEventListener('click', (event) => {
    const button = event.target.closest('[data-selection-action]');
    if (!button) return;
    const action = button.dataset.selectionAction;
    if (action === 'delete') deleteSelected();
    if (action === 'duplicate') duplicateSelected();
    if (action === 'front') changeLayer('front');
  });

  dom.gridBtn.addEventListener('click', () => {
    pushHistory();
    state.grid = !state.grid;
    dom.artboard.classList.toggle('grid-hidden', !state.grid);
    dom.gridBtn.classList.toggle('is-active', state.grid);
    dom.gridBtn.setAttribute('aria-pressed', String(state.grid));
    queueSave();
  });

  dom.fitBtn.addEventListener('click', fitCanvas);
  dom.clearBtn.addEventListener('click', clearCanvas);

  dom.inspectorBody.addEventListener('input', handleInspectorInput);
  dom.inspectorBody.addEventListener('change', (event) => {
    handleInspectorChange(event);
    handleImageUpload(event);
  });
  dom.inspectorBody.addEventListener('focusin', handleInspectorFocus);
  dom.inspectorBody.addEventListener('pointerdown', handleInspectorFocus, true);
  dom.inspectorBody.addEventListener('click', handleInspectorClick);

  dom.cssLibrary.addEventListener('input', handleCssLibraryInput);
  dom.cssLibrary.addEventListener('click', handleCssLibraryClick);

  dom.codeTabs.addEventListener('click', (event) => {
    const tab = event.target.closest('[data-code-view]');
    if (!tab) return;
    setCodeView(tab.dataset.codeView);
  });

  dom.codeTabs.addEventListener('keydown', (event) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    const nextView = state.codeView === 'html' ? 'css' : 'html';
    setCodeView(nextView);
    const nextTab = $(`[data-code-view="${nextView}"]`, dom.codeTabs);
    if (nextTab) nextTab.focus();
  });

  dom.copyCodeBtn.addEventListener('click', copyCurrentCode);
  dom.expandCodeBtn.addEventListener('click', openCodeModal);
  dom.codePre.addEventListener('scroll', () => {
    dom.lineNumbers.scrollTop = dom.codePre.scrollTop;
  });
  dom.modalCodeCopyBtn.addEventListener('click', () => {
    copyText(currentCode || getActiveCode(), '代码已复制');
  });

  dom.downloadHtmlBtn.addEventListener('click', downloadHTML);
  dom.downloadCssBtn.addEventListener('click', downloadCSS);
  dom.downloadSingleFileBtn.addEventListener('click', downloadSingleFileHTML);
  dom.copyExportBtn.addEventListener('click', copyCurrentCode);
  dom.previewExportBtn.addEventListener('click', () => {
    closeModal(dom.previewModal);
    openModal('exportModal');
  });

  dom.deviceSwitch.addEventListener('click', (event) => {
    const button = event.target.closest('[data-device]');
    if (!button) return;
    renderPreview(button.dataset.device);
  });

  $$('[data-close-modal]').forEach((button) => {
    button.addEventListener('click', () => closeModal(button.closest('.modal-layer')));
  });

  $$('.modal-layer').forEach((layer) => {
    layer.addEventListener('mousedown', (event) => {
      if (event.target === layer) closeModal(layer);
    });
  });

  document.addEventListener('keydown', handleKeyboard);
  window.addEventListener('resize', debounce(fitCanvas, 80));

  if ('ResizeObserver' in window) {
    const observer = new ResizeObserver(debounce(fitCanvas, 30));
    observer.observe(dom.canvasViewport);
  }
}

function handleKeyboard(event) {
  const target = event.target;
  const isTyping =
    target instanceof HTMLElement &&
    (target.matches('input, textarea, select') || target.isContentEditable);

  if (event.key === 'Escape') {
    if ($$('.modal-layer.is-open').length) {
      closeAllModals();
      return;
    }
    if (isTyping) {
      target.blur();
      return;
    }
    selectElement(null);
    return;
  }

  if (isTyping) {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') {
      event.preventDefault();
      queueSave();
      showToast('作品已保存到本地', 'success');
    }
    return;
  }

  const mod = event.ctrlKey || event.metaKey;
  if (mod && event.key.toLowerCase() === 'z') {
    event.preventDefault();
    if (event.shiftKey) redo();
    else undo();
    return;
  }
  if (mod && event.key.toLowerCase() === 'y') {
    event.preventDefault();
    redo();
    return;
  }
  if (mod && event.key.toLowerCase() === 's') {
    event.preventDefault();
    queueSave();
    showToast('作品已保存到本地', 'success');
    return;
  }
  if (mod && event.key.toLowerCase() === 'd') {
    if (selectedElement()) {
      event.preventDefault();
      duplicateSelected();
    }
    return;
  }

  if (event.key === '/') {
    event.preventDefault();
    if (state.mode !== 'build') setMode('build');
    requestAnimationFrame(() => dom.componentSearch.focus());
    return;
  }

  if (!selectedElement()) return;
  if (event.key === 'Delete' || event.key === 'Backspace') {
    event.preventDefault();
    deleteSelected();
    return;
  }
  const step = event.shiftKey ? 10 : 1;
  if (event.key === 'ArrowLeft') {
    event.preventDefault();
    moveSelectedBy(-step, 0);
  } else if (event.key === 'ArrowRight') {
    event.preventDefault();
    moveSelectedBy(step, 0);
  } else if (event.key === 'ArrowUp') {
    event.preventDefault();
    moveSelectedBy(0, -step);
  } else if (event.key === 'ArrowDown') {
    event.preventDefault();
    moveSelectedBy(0, step);
  }
}

/* ============================================================
   启动
   ============================================================ */

function cacheDOM() {
  dom.artboard = $('#artboard');
  dom.artboardViewport = $('#artboardViewport');
  dom.canvasViewport = $('#canvasViewport');
  dom.canvasEmpty = $('#canvasEmpty');
  dom.gridBtn = $('#gridBtn');
  dom.zoomLabel = $('#zoomLabel');
  dom.selectionTools = $('#selectionTools');
  dom.selectionName = $('#selectionName');
  dom.stageLabel = $('#stageLabel');
  dom.browserTitle = $('#browserTitle');
  dom.selectionChip = $('#selectionChip');
  dom.stageModePill = $('#stageModePill');
  dom.stageNote = $('#stageNote');
  dom.buildLibrary = $('#buildLibrary');
  dom.cssLibrary = $('#cssLibrary');
  dom.libraryEyebrow = $('#libraryEyebrow');
  dom.libraryTitle = $('#libraryTitle');
  dom.libraryHelpBtn = $('#libraryHelpBtn');
  dom.componentSearch = $('#componentSearch');
  dom.categoryTabs = $('#categoryTabs');
  dom.componentGrid = $('#componentGrid');
  dom.themeGrid = $('#themeGrid');
  dom.accentSwatches = $('#accentSwatches');
  dom.radiusRange = $('#radiusRange');
  dom.radiusValue = $('#radiusValue');
  dom.shadowToggle = $('#shadowToggle');
  dom.shadowValue = $('#shadowValue');
  dom.inspectorBody = $('#inspectorBody');
  dom.inspectorEyebrow = $('#inspectorEyebrow');
  dom.inspectorTitle = $('#inspectorTitle');
  dom.codeOutput = $('#codeOutput');
  dom.codePre = $('#codePre');
  dom.codeBody = $('#codeBody');
  dom.codeTabs = $('#codeTabs');
  dom.lineNumbers = $('#lineNumbers');
  dom.htmlLineCount = $('#htmlLineCount');
  dom.cssLineCount = $('#cssLineCount');
  dom.codeMeta = $('#codeMeta');
  dom.codeEyebrow = $('#codeEyebrow');
  dom.codeTitle = $('#codeTitle');
  dom.undoBtn = $('#undoBtn');
  dom.redoBtn = $('#redoBtn');
  dom.previewBtn = $('#previewBtn');
  dom.exportBtn = $('#exportBtn');
  dom.helpBtn = $('#helpBtn');
  dom.importBtn = $('#importBtn');
  dom.importModal = $('#importModal');
  dom.chooseImportFileBtn = $('#chooseImportFileBtn');
  dom.importFileInput = $('#importFileInput');
  dom.copyCodeBtn = $('#copyCodeBtn');
  dom.expandCodeBtn = $('#expandCodeBtn');
  dom.codeModal = $('#codeModal');
  dom.codeModalTitle = $('#codeModalTitle');
  dom.modalCodeOutput = $('#modalCodeOutput');
  dom.modalLineNumbers = $('#modalLineNumbers');
  dom.modalCodeCopyBtn = $('#codeModalCopyBtn');
  dom.previewModal = $('#previewModal');
  dom.previewFrame = $('#previewFrame');
  dom.previewFrameWrap = $('#previewFrameWrap');
  dom.previewExportBtn = $('#previewExportBtn');
  dom.deviceSwitch = $('#deviceSwitch');
  dom.downloadHtmlBtn = $('#downloadHtmlBtn');
  dom.downloadCssBtn = $('#downloadCssBtn');
  dom.downloadSingleFileBtn = $('#downloadSingleFileBtn');
  dom.copyExportBtn = $('#copyExportBtn');
  dom.toastStack = $('#toastStack');
  dom.saveStatus = $('#saveStatus');
  dom.saveText = $('#saveText');
  dom.uiFontSwitch = $('#uiFontSwitch');
  dom.clearBtn = $('#clearBtn');
  dom.fitBtn = $('#fitBtn');
}

function init() {
  document.head.insertAdjacentHTML('beforeend', `<style id="component-styles">${COMPONENT_CSS}</style>`);
  cacheDOM();
  initUIFontSize();

  const restored = loadState();
  if (!restored) {
    createDemoState();
  } else if (!state.selectedId) {
    state.selectedId = state.elements[0]?.id || null;
  }

  renderThemes();
  renderAccentSwatches();
  renderComponentGrid();
  renderCanvas();
  updatePageLabels();
  syncCssLibraryUI();
  renderInspector();
  bindEvents();
  updateHistoryButtons();
  updateCodePanel();
  requestAnimationFrame(fitCanvas);

  if (restored) {
    setSaveStatus('saved');
  } else {
    queueSave();
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
