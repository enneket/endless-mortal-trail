# 《人间无尽途》实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建一个基于 Web 的国风文字冒险游戏引擎，包含完整的第一章内容（12个场景、3个NPC、打字机效果、状态管理、存档系统）。

**Architecture:** JSON 数据驱动架构。故事内容存放在 JSON 文件中，引擎负责渲染和状态管理。纯前端实现，无后端依赖。

**Tech Stack:** HTML / CSS / JavaScript（无框架），localStorage 存档

---

## 文件结构总览

```
endless_mortal_trail/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── engine/
│   │   ├── renderer.js
│   │   ├── state.js
│   │   ├── story-engine.js
│   │   └── save-manager.js
│   └── app.js
├── story/
│   ├── chapter1/
│   │   ├── meta.json
│   │   └── scenes/
│   │       ├── 01_awakening.json
│   │       ├── 02_light_path.json
│   │       ├── 03_observe_void.json
│   │       ├── 04_call_out.json
│   │       ├── 05_rift_gate.json
│   │       ├── 06_misty_village.json
│   │       ├── 07_mountain_path.json
│   │       ├── 08_tavern.json
│   │       ├── 09_village_secret.json
│   │       ├── 10_hermit.json
│   │       ├── 11_mountain_peak.json
│   │       └── 12_departure.json
│   └── shared/
│       ├── npcs.json
│       └── items.json
```

---

## Task 1: HTML 页面结构 + CSS 样式

**Files:**
- Create: `index.html`
- Create: `css/style.css`

- [ ] **Step 1: 创建 HTML 入口页面**

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>人间无尽途</title>
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <div id="game-container">
    <!-- 标题屏 -->
    <div id="title-screen" class="screen">
      <h1 class="game-title">人间无尽途</h1>
      <p class="game-subtitle">独行长路 · 人间百态 · 浮生过客 · 无尽行途</p>
      <div class="title-actions">
        <button id="btn-new-game" class="btn-choice">踏入人间</button>
        <button id="btn-continue" class="btn-choice" style="display:none;">继续旅途</button>
        <button id="btn-load" class="btn-choice" style="display:none;">读取存档</button>
      </div>
    </div>

    <!-- 游戏屏 -->
    <div id="game-screen" class="screen" style="display:none;">
      <div id="scene-title" class="scene-title"></div>
      <div id="story-text" class="story-text"></div>
      <div id="choices-container" class="choices-container"></div>
      <div id="status-bar" class="status-bar">
        <span id="stat-experience">阅历: 0</span>
        <span id="stat-mood">心境: 迷茫</span>
      </div>
    </div>

    <!-- 存档屏 -->
    <div id="save-screen" class="screen" style="display:none;">
      <h2 class="save-title">存档</h2>
      <div id="save-slots" class="save-slots"></div>
      <button id="btn-back" class="btn-choice">返回</button>
    </div>
  </div>

  <script type="module" src="js/app.js"></script>
</body>
</html>
```

- [ ] **Step 2: 创建 CSS 样式**

```css
/* css/style.css */

:root {
  --bg: #0a0a0a;
  --text: #e0e0e0;
  --text-dim: #666666;
  --text-muted: #444444;
  --border: #333333;
  --border-hover: #666666;
  --font-main: -apple-system, "Noto Sans SC", "PingFang SC", "Microsoft YaHei", sans-serif;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  height: 100%;
  background: var(--bg);
  color: var(--text);
  font-family: var(--font-main);
  font-size: 18px;
  line-height: 1.8;
  overflow: hidden;
}

#game-container {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.screen {
  width: 100%;
  max-width: 680px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* 标题屏 */
.game-title {
  font-size: 2.5rem;
  font-weight: 300;
  letter-spacing: 0.5em;
  color: var(--text);
  margin-bottom: 1rem;
}

.game-subtitle {
  font-size: 0.85rem;
  color: var(--text-dim);
  letter-spacing: 0.3em;
  margin-bottom: 3rem;
}

.title-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  max-width: 300px;
}

/* 游戏屏 */
.scene-title {
  font-size: 0.85rem;
  color: var(--text-dim);
  letter-spacing: 0.2em;
  margin-bottom: 2rem;
  text-align: center;
}

.story-text {
  width: 100%;
  margin-bottom: 2rem;
  min-height: 200px;
}

.story-text p {
  margin-bottom: 1em;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.story-text p.visible {
  opacity: 1;
}

.choices-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

/* 选项按钮 */
.btn-choice {
  background: transparent;
  color: var(--text);
  border: 1px solid var(--border);
  padding: 0.75rem 1.5rem;
  font-family: var(--font-main);
  font-size: 1rem;
  cursor: pointer;
  transition: border-color 0.2s ease;
  text-align: left;
  width: 100%;
}

.btn-choice:hover {
  border-color: var(--border-hover);
}

.btn-choice:active {
  opacity: 0.8;
}

/* 状态栏 */
.status-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 0.5rem 2rem;
  display: flex;
  justify-content: center;
  gap: 2rem;
  font-size: 0.7rem;
  color: var(--text-muted);
  background: var(--bg);
}

/* 存档屏 */
.save-title {
  font-size: 1.2rem;
  font-weight: 300;
  color: var(--text-dim);
  margin-bottom: 2rem;
  letter-spacing: 0.3em;
}

.save-slots {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.save-slot {
  border: 1px solid var(--border);
  padding: 1rem;
  cursor: pointer;
  transition: border-color 0.2s ease;
}

.save-slot:hover {
  border-color: var(--border-hover);
}

.save-slot-title {
  font-size: 0.9rem;
  color: var(--text);
  margin-bottom: 0.25rem;
}

.save-slot-info {
  font-size: 0.75rem;
  color: var(--text-muted);
}

/* 打字机光标 */
.cursor {
  display: inline-block;
  width: 2px;
  height: 1em;
  background: var(--text-dim);
  margin-left: 2px;
  animation: blink 1s step-end infinite;
  vertical-align: text-bottom;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

/* 响应式 */
@media (max-width: 768px) {
  html, body {
    font-size: 16px;
  }

  .screen {
    padding: 1.5rem;
  }

  .game-title {
    font-size: 1.8rem;
  }

  .status-bar {
    padding: 0.5rem 1rem;
    gap: 1rem;
  }
}
```

- [ ] **Step 3: 验证页面**

在浏览器中打开 `index.html`，确认：
- 黑色背景，白色文字
- 标题"人间无尽途"居中显示
- 副标题和"踏入人间"按钮可见
- 按钮有边框，悬停时边框变亮

---

## Task 2: 状态管理器 (state.js)

**Files:**
- Create: `js/engine/state.js`

- [ ] **Step 1: 创建状态管理器**

```javascript
// js/engine/state.js

const DEFAULT_STATE = {
  player: {
    name: '渡途人',
    title: '无名行者'
  },
  stats: {
    experience: 0,
    wisdom: 0,
    courage: 0,
    karma: 0,
    mood: '迷茫'
  },
  inventory: [],
  history: [],
  currentScene: '01_awakening',
  currentChapter: 'chapter1',
  flags: {},
  playTime: 0,
  createdAt: null,
  savedAt: null
};

export class GameState {
  constructor() {
    this.state = this.createDefault();
    this.listeners = [];
  }

  createDefault() {
    return JSON.parse(JSON.stringify(DEFAULT_STATE));
  }

  reset() {
    this.state = this.createDefault();
    this.state.createdAt = Date.now();
    this.notify();
  }

  load(savedState) {
    this.state = { ...this.createDefault(), ...savedState };
    this.notify();
  }

  get(key) {
    return key.split('.').reduce((obj, k) => obj?.[k], this.state);
  }

  set(key, value) {
    const keys = key.split('.');
    const last = keys.pop();
    const target = keys.reduce((obj, k) => obj[k], this.state);
    target[last] = value;
    this.notify();
  }

  applyEffects(effects) {
    if (!effects) return;

    if (effects.karma) this.state.stats.karma += effects.karma;
    if (effects.wisdom) this.state.stats.wisdom += effects.wisdom;
    if (effects.courage) this.state.stats.courage += effects.courage;
    if (effects.experience) this.state.stats.experience += effects.experience;
    if (effects.mood) this.state.stats.mood = effects.mood;
    if (effects.addItem && !this.state.inventory.includes(effects.addItem)) {
      this.state.inventory.push(effects.addItem);
    }
    if (effects.removeItem) {
      this.state.inventory = this.state.inventory.filter(i => i !== effects.removeItem);
    }
    if (effects.setFlag) {
      this.state.flags[effects.setFlag] = true;
    }

    this.state.stats.experience += 1;
    this.notify();
  }

  addToHistory(sceneId) {
    if (!this.state.history.includes(sceneId)) {
      this.state.history.push(sceneId);
    }
  }

  hasItem(itemId) {
    return this.state.inventory.includes(itemId);
  }

  hasFlag(flag) {
    return !!this.state.flags[flag];
  }

  checkCondition(condition) {
    if (!condition) return true;
    if (condition.hasItem && !this.hasItem(condition.hasItem)) return false;
    if (condition.hasFlag && !this.hasFlag(condition.hasFlag)) return false;
    if (condition.minKarma && this.state.stats.karma < condition.minKarma) return false;
    if (condition.mood && this.state.stats.mood !== condition.mood) return false;
    return true;
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach(l => l(this.state));
  }

  toJSON() {
    return JSON.parse(JSON.stringify(this.state));
  }
}
```

- [ ] **Step 2: 验证状态管理器**

在浏览器控制台中测试：
```javascript
import { GameState } from './js/engine/state.js';
const state = new GameState();
state.reset();
console.log(state.get('stats.mood')); // 应输出 "迷茫"
state.applyEffects({ karma: 1, mood: '好奇' });
console.log(state.get('stats.karma')); // 应输出 1
console.log(state.get('stats.mood')); // 应输出 "好奇"
```

---

## Task 3: 存档管理器 (save-manager.js)

**Files:**
- Create: `js/engine/save-manager.js`

- [ ] **Step 1: 创建存档管理器**

```javascript
// js/engine/save-manager.js

const SAVE_PREFIX = 'emt_save_';
const MAX_SLOTS = 3;

export class SaveManager {
  constructor(gameState) {
    this.gameState = gameState;
  }

  save(slot) {
    if (slot < 1 || slot > MAX_SLOTS) return false;
    const data = this.gameState.toJSON();
    data.savedAt = Date.now();
    try {
      localStorage.setItem(`${SAVE_PREFIX}${slot}`, JSON.stringify(data));
      return true;
    } catch (e) {
      console.error('存档失败:', e);
      return false;
    }
  }

  load(slot) {
    if (slot < 1 || slot > MAX_SLOTS) return false;
    try {
      const raw = localStorage.getItem(`${SAVE_PREFIX}${slot}`);
      if (!raw) return false;
      const data = JSON.parse(raw);
      this.gameState.load(data);
      return true;
    } catch (e) {
      console.error('读档失败:', e);
      return false;
    }
  }

  autoSave() {
    return this.save(1);
  }

  getSaveInfo(slot) {
    if (slot < 1 || slot > MAX_SLOTS) return null;
    try {
      const raw = localStorage.getItem(`${SAVE_PREFIX}${slot}`);
      if (!raw) return null;
      const data = JSON.parse(raw);
      return {
        scene: data.currentScene,
        mood: data.stats?.mood || '未知',
        playTime: data.playTime || 0,
        savedAt: data.savedAt
      };
    } catch (e) {
      return null;
    }
  }

  getAllSaves() {
    const saves = [];
    for (let i = 1; i <= MAX_SLOTS; i++) {
      saves.push({
        slot: i,
        info: this.getSaveInfo(i)
      });
    }
    return saves;
  }

  hasSave() {
    for (let i = 1; i <= MAX_SLOTS; i++) {
      if (this.getSaveInfo(i)) return true;
    }
    return false;
  }

  deleteSave(slot) {
    if (slot < 1 || slot > MAX_SLOTS) return;
    localStorage.removeItem(`${SAVE_PREFIX}${slot}`);
  }
}
```

- [ ] **Step 2: 验证存档管理器**

在浏览器控制台中测试：
```javascript
import { GameState } from './js/engine/state.js';
import { SaveManager } from './js/engine/save-manager.js';
const state = new GameState();
state.reset();
const save = new SaveManager(state);
save.save(1);
console.log(save.getSaveInfo(1)); // 应输出存档信息
```

---

## Task 4: 打字机渲染器 (renderer.js)

**Files:**
- Create: `js/engine/renderer.js`

- [ ] **Step 1: 创建打字机渲染器**

```javascript
// js/engine/renderer.js

export class Renderer {
  constructor() {
    this.storyEl = document.getElementById('story-text');
    this.titleEl = document.getElementById('scene-title');
    this.choicesEl = document.getElementById('choices-container');
    this.statExpEl = document.getElementById('stat-experience');
    this.statMoodEl = document.getElementById('stat-mood');
    this.isTyping = false;
    this.skipRequested = false;
    this.currentTimeout = null;

    this.handleClick = this.handleClick.bind(this);
    document.addEventListener('click', this.handleClick);
  }

  handleClick() {
    if (this.isTyping) {
      this.skipRequested = true;
    }
  }

  setTitle(title) {
    this.titleEl.textContent = title;
  }

  async typeText(texts) {
    this.isTyping = true;
    this.skipRequested = false;
    this.storyEl.innerHTML = '';

    for (const item of texts) {
      if (item.delay > 0 && !this.skipRequested) {
        await this.wait(item.delay);
      }

      const p = document.createElement('p');
      this.storyEl.appendChild(p);

      if (this.skipRequested) {
        p.textContent = item.content;
        p.classList.add('visible');
      } else {
        await this.typewriteParagraph(p, item.content);
      }
    }

    this.isTyping = false;
  }

  async typewriteParagraph(el, text) {
    const cursor = document.createElement('span');
    cursor.className = 'cursor';

    for (let i = 0; i < text.length; i++) {
      if (this.skipRequested) {
        el.textContent = text;
        el.classList.add('visible');
        return;
      }

      el.textContent = text.substring(0, i + 1);
      el.appendChild(cursor);
      el.classList.add('visible');

      const char = text[i];
      const delay = '，。！？、；：'.includes(char) ? 120 : 60;
      await this.wait(delay);
    }

    cursor.remove();
  }

  showChoices(choices, onChoose) {
    this.choicesEl.innerHTML = '';
    choices.forEach((choice, index) => {
      const btn = document.createElement('button');
      btn.className = 'btn-choice';
      btn.textContent = choice.text;
      btn.addEventListener('click', () => {
        this.hideChoices();
        onChoose(index);
      });
      this.choicesEl.appendChild(btn);
    });
  }

  hideChoices() {
    this.choicesEl.innerHTML = '';
  }

  updateStats(stats) {
    if (this.statExpEl) this.statExpEl.textContent = `阅历: ${stats.experience}`;
    if (this.statMoodEl) this.statMoodEl.textContent = `心境: ${stats.mood}`;
  }

  async transitionToScene() {
    this.storyEl.style.opacity = '0';
    await this.wait(300);
    this.storyEl.style.opacity = '1';
    await this.wait(200);
  }

  showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => {
      s.style.display = 'none';
    });
    const screen = document.getElementById(screenId);
    if (screen) screen.style.display = 'flex';
  }

  wait(ms) {
    return new Promise(resolve => {
      this.currentTimeout = setTimeout(resolve, ms);
    });
  }

  destroy() {
    document.removeEventListener('click', this.handleClick);
    if (this.currentTimeout) clearTimeout(this.currentTimeout);
  }
}
```

- [ ] **Step 2: 验证渲染器**

在浏览器中手动测试：
- 打开页面，检查标题屏是否正确显示
- 检查 CSS 样式是否生效（黑色背景、白色文字、边框按钮）

---

## Task 5: 故事引擎 (story-engine.js)

**Files:**
- Create: `js/engine/story-engine.js`

- [ ] **Step 1: 创建故事引擎**

```javascript
// js/engine/story-engine.js

export class StoryEngine {
  constructor(gameState, renderer, saveManager) {
    this.gameState = gameState;
    this.renderer = renderer;
    this.saveManager = saveManager;
    this.sceneCache = {};
    this.npcData = null;
    this.itemData = null;
  }

  async loadChapter(chapterId) {
    try {
      const metaRes = await fetch(`story/${chapterId}/meta.json`);
      this.chapterMeta = await metaRes.json();
    } catch (e) {
      console.warn('未找到章节元数据:', e);
      this.chapterMeta = {};
    }

    try {
      const npcRes = await fetch('story/shared/npcs.json');
      this.npcData = await npcRes.json();
    } catch (e) {
      console.warn('未找到NPC数据:', e);
    }

    try {
      const itemRes = await fetch('story/shared/items.json');
      this.itemData = await itemRes.json();
    } catch (e) {
      console.warn('未找到物品数据:', e);
    }
  }

  async loadScene(sceneId) {
    if (this.sceneCache[sceneId]) {
      return this.sceneCache[sceneId];
    }

    const chapter = this.gameState.get('currentChapter');
    try {
      const res = await fetch(`story/${chapter}/scenes/${sceneId}.json`);
      const scene = await res.json();
      this.sceneCache[sceneId] = scene;
      return scene;
    } catch (e) {
      console.error(`加载场景失败: ${sceneId}`, e);
      return null;
    }
  }

  async playScene(sceneId) {
    const scene = await this.loadScene(sceneId);
    if (!scene) {
      console.error('场景不存在:', sceneId);
      return;
    }

    this.gameState.set('currentScene', sceneId);
    this.gameState.addToHistory(sceneId);

    await this.renderer.transitionToScene();
    this.renderer.setTitle(scene.title);

    await this.renderer.typeText(scene.texts);

    const availableChoices = scene.choices.filter(choice =>
      this.gameState.checkCondition(choice.condition)
    );

    if (availableChoices.length > 0) {
      this.renderer.showChoices(availableChoices, (index) => {
        const chosen = availableChoices[index];
        this.gameState.applyEffects(chosen.effects);
        this.renderer.updateStats(this.gameState.get('stats'));
        this.saveManager.autoSave();
        this.playScene(chosen.target);
      });
    }

    this.renderer.updateStats(this.gameState.get('stats'));
  }

  async start() {
    await this.loadChapter('chapter1');
    const startScene = this.gameState.get('currentScene') || '01_awakening';
    await this.playScene(startScene);
  }

  getNpc(npcId) {
    return this.npcData?.[npcId] || null;
  }

  getItem(itemId) {
    return this.itemData?.[itemId] || null;
  }
}
```

- [ ] **Step 2: 验证故事引擎**

引擎本身无法独立验证，需要配合场景数据。将在 Task 7 中集成测试。

---

## Task 6: 主入口 (app.js)

**Files:**
- Create: `js/app.js`

- [ ] **Step 1: 创建主入口**

```javascript
// js/app.js

import { GameState } from './engine/state.js';
import { Renderer } from './engine/renderer.js';
import { SaveManager } from './engine/save-manager.js';
import { StoryEngine } from './engine/story-engine.js';

class App {
  constructor() {
    this.gameState = new GameState();
    this.renderer = new Renderer();
    this.saveManager = new SaveManager(this.gameState);
    this.storyEngine = new StoryEngine(this.gameState, this.renderer, this.saveManager);

    this.playTimeTimer = null;
    this.init();
  }

  init() {
    this.bindEvents();
    this.updateTitleScreen();
    this.renderer.showScreen('title-screen');
  }

  bindEvents() {
    document.getElementById('btn-new-game').addEventListener('click', () => {
      this.startNewGame();
    });

    document.getElementById('btn-continue').addEventListener('click', () => {
      this.continueGame();
    });

    document.getElementById('btn-load').addEventListener('click', () => {
      this.showSaveScreen();
    });

    document.getElementById('btn-back').addEventListener('click', () => {
      this.renderer.showScreen('title-screen');
    });
  }

  updateTitleScreen() {
    const hasSave = this.saveManager.hasSave();
    document.getElementById('btn-continue').style.display = hasSave ? 'block' : 'none';
    document.getElementById('btn-load').style.display = hasSave ? 'block' : 'none';
  }

  async startNewGame() {
    this.gameState.reset();
    this.renderer.showScreen('game-screen');
    this.startPlayTimeTracker();
    await this.storyEngine.start();
  }

  async continueGame() {
    const loaded = this.saveManager.load(1);
    if (loaded) {
      this.renderer.showScreen('game-screen');
      this.startPlayTimeTracker();
      const sceneId = this.gameState.get('currentScene');
      await this.storyEngine.playScene(sceneId);
    }
  }

  showSaveScreen() {
    const saves = this.saveManager.getAllSaves();
    const container = document.getElementById('save-slots');
    container.innerHTML = '';

    saves.forEach(({ slot, info }) => {
      const div = document.createElement('div');
      div.className = 'save-slot';

      if (info) {
        const timeStr = this.formatTime(info.playTime);
        const dateStr = new Date(info.savedAt).toLocaleString('zh-CN');
        div.innerHTML = `
          <div class="save-slot-title">存档 ${slot}</div>
          <div class="save-slot-info">${info.mood} · ${timeStr} · ${dateStr}</div>
        `;
        div.addEventListener('click', () => {
          this.saveManager.load(slot);
          this.renderer.showScreen('game-screen');
          this.startPlayTimeTracker();
          this.storyEngine.playScene(this.gameState.get('currentScene'));
        });
      } else {
        div.innerHTML = `
          <div class="save-slot-title">存档 ${slot}</div>
          <div class="save-slot-info">空</div>
        `;
      }

      container.appendChild(div);
    });

    this.renderer.showScreen('save-screen');
  }

  startPlayTimeTracker() {
    if (this.playTimeTimer) clearInterval(this.playTimeTimer);
    this.playTimeTimer = setInterval(() => {
      const current = this.gameState.get('playTime') || 0;
      this.gameState.set('playTime', current + 1);
    }, 1000);
  }

  formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}分${s}秒`;
  }
}

window.addEventListener('DOMContentLoaded', () => {
  new App();
});
```

- [ ] **Step 2: 验证主入口**

在浏览器中打开 `index.html`：
- 应看到标题屏
- 点击"踏入人间"按钮（此时会报错，因为还没有场景数据，这是正常的）

---

## Task 7: NPC 和物品数据

**Files:**
- Create: `story/shared/npcs.json`
- Create: `story/shared/items.json`
- Create: `story/chapter1/meta.json`

- [ ] **Step 1: 创建 NPC 数据**

```json
{
  "nameless_elder": {
    "id": "nameless_elder",
    "name": "无名老者",
    "identity": "裂隙中的引路人",
    "personality": "淡然、温和、话语不多但字字珠玑",
    "role": "揭示世界观，引导玩家理解渡途人身份"
  },
  "scholar": {
    "id": "scholar",
    "name": "落魄书生",
    "identity": "困在雾中古村的旅人",
    "personality": "忧郁、善谈、有些自嘲",
    "role": "展示NPC有独立人格和执念"
  },
  "hermit": {
    "id": "hermit",
    "name": "隐世老者",
    "identity": "山中修行多年的隐者",
    "personality": "沉默寡言，偶尔发问直击内心",
    "role": "心境试炼，影响玩家的命格倾向"
  }
}
```

- [ ] **Step 2: 创建物品数据**

```json
{
  "jade_pendant": {
    "id": "jade_pendant",
    "name": "无名玉佩",
    "description": "一块温润的古玉，上面刻着看不清的纹路。握在手中，有种奇异的安心感。",
    "origin": "裂隙虚空中拾得",
    "use": "后续章节可触发隐藏剧情"
  },
  "old_book": {
    "id": "old_book",
    "name": "残破古籍",
    "description": "一卷残破的书册，字迹模糊，依稀可辨是某个朝代的野史。",
    "origin": "雾中古村酒肆中获得",
    "use": "可在后续人间中交换信息或触发知识类选项"
  }
}
```

- [ ] **Step 3: 创建章节元数据**

```json
{
  "id": "chapter1",
  "title": "裂隙初醒",
  "description": "渡途人在虚空中醒来，踏入第一个人间",
  "sceneCount": 12,
  "startScene": "01_awakening"
}
```

---

## Task 8: 第一章场景 01-04（虚空篇）

**Files:**
- Create: `story/chapter1/scenes/01_awakening.json`
- Create: `story/chapter1/scenes/02_light_path.json`
- Create: `story/chapter1/scenes/03_observe_void.json`
- Create: `story/chapter1/scenes/04_call_out.json`

- [ ] **Step 1: 创建场景 01 - 裂隙初醒**

```json
{
  "id": "01_awakening",
  "title": "裂隙初醒",
  "atmosphere": {
    "time": "黎明",
    "weather": "薄雾",
    "mood": "迷茫"
  },
  "texts": [
    {
      "content": "你睁开眼。",
      "delay": 0
    },
    {
      "content": "四周是无尽的虚空，像墨汁晕染在宣纸上，缓缓流动。没有上下，没有左右，只有无边的黑暗与你独处。",
      "delay": 800
    },
    {
      "content": "你记不起自己是谁，从何处来。只觉得身体很轻，像一片落叶，被风托着，不知要飘向何方。",
      "delay": 1000
    },
    {
      "content": "远处，有一点微光。像是深夜山间人家的灯火，又像是黎明前第一缕晨曦。它在那里，不远不近，像是在等你。",
      "delay": 1200
    }
  ],
  "choices": [
    {
      "text": "向微光走去",
      "target": "02_light_path",
      "effects": {
        "karma": 1,
        "mood": "好奇"
      },
      "condition": null
    },
    {
      "text": "留在原地，仔细观察四周",
      "target": "03_observe_void",
      "effects": {
        "wisdom": 1,
        "mood": "谨慎"
      },
      "condition": null
    },
    {
      "text": "大声呼喊，试探虚空中是否有回应",
      "target": "04_call_out",
      "effects": {
        "courage": 1
      },
      "condition": null
    }
  ],
  "onEnter": [],
  "onExit": []
}
```

- [ ] **Step 2: 创建场景 02 - 向光而行**

```json
{
  "id": "02_light_path",
  "title": "向光而行",
  "atmosphere": {
    "time": "黎明",
    "weather": "微光",
    "mood": "好奇"
  },
  "texts": [
    {
      "content": "你向那点微光走去。",
      "delay": 0
    },
    {
      "content": "脚步踏在虚空中，竟有实地的触感。每走一步，身后的黑暗便退去一分，前方的光亮便近了一寸。",
      "delay": 800
    },
    {
      "content": "不知走了多久——也许是一瞬，也许是一世——你看见光中站着一个人影。",
      "delay": 1000
    },
    {
      "content": "那是一位老者，白发如雪，面容却看不出年纪。他穿着一身素色长袍，站在那里，像是已经等了千年。",
      "delay": 1000
    },
    {
      "content": ""你来了。"老者开口，声音像是从很远的地方传来，又像是在你耳边低语。",
      "delay": 800
    },
    {
      "content": ""我等了你很久。或者说，我等了很多人。你是其中一个。"",
      "delay": 600
    }
  ],
  "choices": [
    {
      "text": ""你是谁？这里是哪里？"",
      "target": "05_rift_gate",
      "effects": {
        "setFlag": "asked_elder_identity"
      },
      "condition": null
    },
    {
      "text": ""你说'很多人'——还有别人来过？"",
      "target": "05_rift_gate",
      "effects": {
        "wisdom": 1,
        "setFlag": "asked_about_others"
      },
      "condition": null
    },
    {
      "text": "沉默不语，只是看着他",
      "target": "05_rift_gate",
      "effects": {
        "mood": "淡然"
      },
      "condition": null
    }
  ],
  "onEnter": [],
  "onExit": []
}
```

- [ ] **Step 3: 创建场景 03 - 观察虚空**

```json
{
  "id": "03_observe_void",
  "title": "观察虚空",
  "atmosphere": {
    "time": "黎明",
    "weather": "虚无",
    "mood": "宁静"
  },
  "texts": [
    {
      "content": "你没有动。你站在原地，仔细打量这片虚空。",
      "delay": 0
    },
    {
      "content": "黑暗并非全然的黑。它有层次，有深浅，像水墨画中的浓淡变化。你看见远处有细小的光点在漂浮，像是萤火虫，又像是星辰的碎片。",
      "delay": 1000
    },
    {
      "content": "你的目光被一样东西吸引——一块温润的古玉，正缓缓向你飘来。它不大，只有拇指大小，上面刻着模糊的纹路，看不真切。",
      "delay": 1200
    },
    {
      "content": "你伸出手，玉佩落入掌心。触手温热，有种奇异的安心感，像是握住了什么久远的记忆的残片。",
      "delay": 1000
    },
    {
      "content": "得到：无名玉佩",
      "delay": 500
    }
  ],
  "choices": [
    {
      "text": "收好玉佩，向微光走去",
      "target": "05_rift_gate",
      "effects": {
        "addItem": "jade_pendant"
      },
      "condition": null
    },
    {
      "text": "仔细端详玉佩上的纹路",
      "target": "05_rift_gate",
      "effects": {
        "addItem": "jade_pendant",
        "wisdom": 1,
        "setFlag": "examined_jade"
      },
      "condition": null
    }
  ],
  "onEnter": [],
  "onExit": []
}
```

- [ ] **Step 4: 创建场景 04 - 呼喊试探**

```json
{
  "id": "04_call_out",
  "title": "呼喊试探",
  "atmosphere": {
    "time": "黎明",
    "weather": "虚空震动",
    "mood": "紧张"
  },
  "texts": [
    {
      "content": ""有人吗——"",
      "delay": 0
    },
    {
      "content": "你的声音在虚空中回荡，像是石子投入深潭，激起一圈又一圈的涟漪。",
      "delay": 800
    },
    {
      "content": "虚空震动了。",
      "delay": 1000
    },
    {
      "content": "不是声音引起的震动，而是某种更深层的共鸣。你感觉到，在这片虚空的某个角落，有什么东西醒来了。它不是人，不是兽，而是一种……存在。",
      "delay": 1200
    },
    {
      "content": "你突然明白了一件事：这里不止你一个。这片虚空，连着无数个世界。每一个世界里，都有人在行走。",
      "delay": 1000
    },
    {
      "content": "你不是第一个，也不会是最后一个。",
      "delay": 800
    }
  ],
  "choices": [
    {
      "text": "向那股共鸣的方向走去",
      "target": "05_rift_gate",
      "effects": {
        "courage": 1,
        "setFlag": "felt_resonance"
      },
      "condition": null
    },
    {
      "text": "向微光走去，那里似乎更安全",
      "target": "05_rift_gate",
      "effects": {
        "mood": "谨慎"
      },
      "condition": null
    }
  ],
  "onEnter": [],
  "onExit": []
}
```

- [ ] **Step 5: 验证场景 01-04**

在浏览器中点击"踏入人间"：
- 应看到场景 01 的文字逐字出现
- 三个选项应正确显示
- 点击选项后应跳转到对应场景
- 打字机效果应正常工作
- 点击可跳过打字机效果

---

## Task 9: 第一章场景 05-07（裂隙之门 + 分支）

**Files:**
- Create: `story/chapter1/scenes/05_rift_gate.json`
- Create: `story/chapter1/scenes/06_misty_village.json`
- Create: `story/chapter1/scenes/07_mountain_path.json`

- [ ] **Step 1: 创建场景 05 - 裂隙之门**

```json
{
  "id": "05_rift_gate",
  "title": "裂隙之门",
  "atmosphere": {
    "time": "黎明",
    "weather": "光暗交织",
    "mood": "神秘"
  },
  "texts": [
    {
      "content": "你来到一处奇异的地方。",
      "delay": 0
    },
    {
      "content": "虚空中出现了一道裂缝，像是有人用刀在黑纸上划了一道口子。裂缝的另一边，透出不同的光——有暖黄的烛光，有清冷的月光，有刺眼的火光。",
      "delay": 1000
    },
    {
      "content": "老者站在裂缝前，背对着你。",
      "delay": 800
    },
    {
      "content": ""这叫'衍世人间'。"他说，声音像是从很远的地方传来。",
      "delay": 600
    },
    {
      "content": ""天地间有一个主凡尘界，四周衍生出无穷无尽的小人间。每一个，都是一个完整的世界。有太平市井，有乱世烽烟，有山野隐世，有诡秘故城。"",
      "delay": 800
    },
    {
      "content": ""你是'渡途人'。你的宿命，就是穿行于这些人间之间。没有终点，没有归途。"",
      "delay": 1000
    },
    {
      "content": "他转过身，看着你。",
      "delay": 600
    },
    {
      "content": ""前方有两条路。一条通往村落，烟火人间；一条通往山野，清冷孤径。你选哪条？"",
      "delay": 800
    }
  ],
  "choices": [
    {
      "text": "走向那透出暖黄烛光的裂缝",
      "target": "06_misty_village",
      "effects": {
        "mood": "好奇"
      },
      "condition": null
    },
    {
      "text": "走向那透出清冷月光的裂缝",
      "target": "07_mountain_path",
      "effects": {
        "mood": "淡然"
      },
      "condition": null
    }
  ],
  "onEnter": [],
  "onExit": []
}
```

- [ ] **Step 2: 创建场景 06 - 雾中古村**

```json
{
  "id": "06_misty_village",
  "title": "雾中古村",
  "atmosphere": {
    "time": "黄昏",
    "weather": "薄雾",
    "mood": "宁静"
  },
  "texts": [
    {
      "content": "你穿过裂缝，踏入了第一个人间。",
      "delay": 0
    },
    {
      "content": "眼前是一座古村。青石板路，白墙黛瓦，几缕炊烟从屋顶升起，融进薄雾里。村口有一棵老槐树，树下坐着几个老人，正闲闲地聊着什么。",
      "delay": 1000
    },
    {
      "content": "空气里有柴火的味道，有饭菜的香气，有泥土的潮湿。这些气息混在一起，让你想起什么——又什么都想不起来。",
      "delay": 1200
    },
    {
      "content": "一个孩子从巷子里跑出来，看了你一眼，又笑着跑开了。",
      "delay": 800
    },
    {
      "content": "这里很安静，很平和。像是乱世之外的桃源，又像是暴风雨前的宁静。",
      "delay": 1000
    }
  ],
  "choices": [
    {
      "text": "走向村口的酒肆，那里似乎有人在说话",
      "target": "08_tavern",
      "effects": {
        "experience": 1
      },
      "condition": null
    },
    {
      "text": "沿着小巷往村子里走，看看还有什么",
      "target": "09_village_secret",
      "effects": {
        "wisdom": 1
      },
      "condition": null
    }
  ],
  "onEnter": [],
  "onExit": []
}
```

- [ ] **Step 3: 创建场景 07 - 山间古道**

```json
{
  "id": "07_mountain_path",
  "title": "山间古道",
  "atmosphere": {
    "time": "深夜",
    "weather": "月光",
    "mood": "清冷"
  },
  "texts": [
    {
      "content": "你穿过裂缝，踏入了另一个人间。",
      "delay": 0
    },
    {
      "content": "这是一条山间古道。月光如水，洒在青石板上，泛着清冷的光。两旁是高耸的竹林，风吹过时，竹叶沙沙作响，像是有人在低语。",
      "delay": 1000
    },
    {
      "content": "道上没有人。只有你，和你的影子。",
      "delay": 800
    },
    {
      "content": "远处的山峰隐在云雾中，看不见顶。道旁有一块残碑，字迹已经模糊，依稀可辨"归隐"二字。",
      "delay": 1200
    },
    {
      "content": "空气清冽，带着松柏的香气。这里很冷，但冷得让人清醒。",
      "delay": 800
    }
  ],
  "choices": [
    {
      "text": "沿着古道继续前行",
      "target": "10_hermit",
      "effects": {
        "courage": 1
      },
      "condition": null
    },
    {
      "text": "在残碑前停留，仔细辨认上面的字",
      "target": "10_hermit",
      "effects": {
        "wisdom": 1,
        "setFlag": "read_stele"
      },
      "condition": null
    }
  ],
  "onEnter": [],
  "onExit": []
}
```

- [ ] **Step 4: 验证场景 05-07**

从场景 01 开始，选择不同路径：
- 选择"向微光走去" → 02 → 05 → 06 或 07
- 选择"留在原地" → 03 → 05
- 选择"呼喊" → 04 → 05
- 验证所有路径都能正确跳转

---

## Task 10: 第一章场景 08-09（雾中古村分支）

**Files:**
- Create: `story/chapter1/scenes/08_tavern.json`
- Create: `story/chapter1/scenes/09_village_secret.json`

- [ ] **Step 1: 创建场景 08 - 酒肆夜话**

```json
{
  "id": "08_tavern",
  "title": "酒肆夜话",
  "atmosphere": {
    "time": "深夜",
    "weather": "薄雾",
    "mood": "忧郁"
  },
  "texts": [
    {
      "content": "酒肆不大，只有三四张桌子。角落里坐着一个人，正对着一壶酒发呆。",
      "delay": 0
    },
    {
      "content": "他穿着一身洗得发白的青衫，面容清瘦，眉宇间有几分书卷气，又有几分落魄。看见你进来，他抬起头，苦笑了一下。",
      "delay": 1000
    },
    {
      "content": ""又来一个。"他说，声音有些沙哑。"坐吧，反正这酒我也喝不完。"",
      "delay": 800
    },
    {
      "content": "你坐下。他给你倒了一杯酒。",
      "delay": 500
    },
    {
      "content": ""我叫什么？不记得了。来这里多久了？也不记得了。只记得我本来是个读书人，考了三次科举，三次落榜。后来就到了这里。"",
      "delay": 1000
    },
    {
      "content": "他喝了一口酒。",
      "delay": 600
    },
    {
      "content": ""这村子很奇怪。外面的人进不来，里面的人出不去。或者说……没人想出去。"",
      "delay": 1000
    },
    {
      "content": "他从怀里掏出一卷书册，递给你。",
      "delay": 800
    },
    {
      "content": ""这是我在村子里找到的。残破得厉害，但里面记着一些……有意思的事。你拿着吧，我留着也没用。"",
      "delay": 1000
    },
    {
      "content": "得到：残破古籍",
      "delay": 500
    }
  ],
  "choices": [
    {
      "text": ""你为什么不离开这里？"",
      "target": "12_departure",
      "effects": {
        "addItem": "old_book",
        "setFlag": "asked_scholar_stay"
      },
      "condition": null
    },
    {
      "text": ""这村子有什么秘密？"",
      "target": "12_departure",
      "effects": {
        "addItem": "old_book",
        "wisdom": 1,
        "setFlag": "asked_scholar_secret"
      },
      "condition": null
    },
    {
      "text": "接过书册，沉默地喝完那杯酒",
      "target": "12_departure",
      "effects": {
        "addItem": "old_book",
        "mood": "淡然"
      },
      "condition": null
    }
  ],
  "onEnter": [],
  "onExit": []
}
```

- [ ] **Step 2: 创建场景 09 - 村中秘事**

```json
{
  "id": "09_village_secret",
  "title": "村中秘事",
  "atmosphere": {
    "time": "深夜",
    "weather": "浓雾",
    "mood": "诡异"
  },
  "texts": [
    {
      "content": "你沿着小巷往村子里走。",
      "delay": 0
    },
    {
      "content": "巷子越走越窄，雾气越来越浓。两侧的墙壁上长满了青苔，脚下的石板路变得湿滑。",
      "delay": 800
    },
    {
      "content": "你发现一件奇怪的事：这些房子，都没有门。",
      "delay": 1000
    },
    {
      "content": "每一栋房子都只有窗，没有门。窗户紧闭，里面透出微弱的光。你贴近一扇窗，听见里面传来低低的哭声。",
      "delay": 1200
    },
    {
      "content": "你继续往前走，来到村子的尽头。那里有一口井，井口用石板封住，石板上刻着一行字：",
      "delay": 1000
    },
    {
      "content": ""莫问来路，莫问归途。"",
      "delay": 800
    },
    {
      "content": "你突然明白，这个村子，困住的不是人，是记忆。",
      "delay": 1000
    }
  ],
  "choices": [
    {
      "text": "掀开石板，看看井里有什么",
      "target": "12_departure",
      "effects": {
        "courage": 2,
        "setFlag": "opened_well",
        "mood": "桀骜"
      },
      "condition": null
    },
    {
      "text": "转身离开，有些事不该追问",
      "target": "12_departure",
      "effects": {
        "karma": 1,
        "mood": "淡然"
      },
      "condition": null
    }
  ],
  "onEnter": [],
  "onExit": []
}
```

- [ ] **Step 3: 验证场景 08-09**

从场景 06 出发：
- 选择"走向酒肆" → 08
- 选择"往村子里走" → 09
- 验证物品获取和标记设置正确

---

## Task 11: 第一章场景 10-12（山野分支 + 结局）

**Files:**
- Create: `story/chapter1/scenes/10_hermit.json`
- Create: `story/chapter1/scenes/11_mountain_peak.json`
- Create: `story/chapter1/scenes/12_departure.json`

- [ ] **Step 1: 创建场景 10 - 山中隐者**

```json
{
  "id": "10_hermit",
  "title": "山中隐者",
  "atmosphere": {
    "time": "黎明",
    "weather": "山雾",
    "mood": "宁静"
  },
  "texts": [
    {
      "content": "古道的尽头，是一间茅屋。",
      "delay": 0
    },
    {
      "content": "茅屋前坐着一位老者，正在煮茶。他没有看你，只是专注地看着壶中的水沸腾。",
      "delay": 800
    },
    {
      "content": ""坐。"他说。只有一个字。",
      "delay": 1000
    },
    {
      "content": "你坐下。他给你倒了一杯茶。",
      "delay": 600
    },
    {
      "content": "茶很苦，但苦过之后，有一丝回甘。",
      "delay": 800
    },
    {
      "content": ""你从哪里来？"他问。",
      "delay": 1000
    },
    {
      "content": "你沉默。你不知道答案。",
      "delay": 800
    },
    {
      "content": ""你要到哪里去？"他又问。",
      "delay": 1000
    },
    {
      "content": "你依然沉默。",
      "delay": 800
    },
    {
      "content": ""很好。"他说。"不知道来路，不知道归途，才能真正地走。"",
      "delay": 1000
    }
  ],
  "choices": [
    {
      "text": ""您在这里多久了？"",
      "target": "11_mountain_peak",
      "effects": {
        "setFlag": "asked_hermit_time"
      },
      "condition": null
    },
    {
      "text": ""您也是渡途人吗？"",
      "target": "11_mountain_peak",
      "effects": {
        "wisdom": 1,
        "setFlag": "asked_hermit_identity"
      },
      "condition": null
    },
    {
      "text": "喝完茶，起身道谢",
      "target": "11_mountain_peak",
      "effects": {
        "mood": "淡然"
      },
      "condition": null
    }
  ],
  "onEnter": [],
  "onExit": []
}
```

- [ ] **Step 2: 创建场景 11 - 孤峰远眺**

```json
{
  "id": "11_mountain_peak",
  "title": "孤峰远眺",
  "atmosphere": {
    "time": "黎明",
    "weather": "云海",
    "mood": "壮阔"
  },
  "texts": [
    {
      "content": "老者指了指山顶。",
      "delay": 0
    },
    {
      "content": ""去吧。上去看看。"",
      "delay": 800
    },
    {
      "content": "你沿着山路攀登。山越来越高，雾越来越薄。当你终于站在山顶时，你看见了——",
      "delay": 1200
    },
    {
      "content": "云海之下，是无数个人间。",
      "delay": 1000
    },
    {
      "content": "你看见了炊烟袅袅的村庄，看见了战火纷飞的边关，看见了月下的荒村，看见了繁华的市集。每一个人间都是一个完整的世界，每一个世界里都有人在行走、在生活、在挣扎、在欢笑。",
      "delay": 1500
    },
    {
      "content": "你突然明白，这就是你的路。不是终点，不是归途，而是无尽的行途。",
      "delay": 1200
    },
    {
      "content": "风吹过山巅，带着松柏的香气和远方人间的气息。",
      "delay": 800
    },
    {
      "content": "你深吸一口气，转身下山。",
      "delay": 600
    }
  ],
  "choices": [
    {
      "text": "下山，踏入下一个衍世人间",
      "target": "12_departure",
      "effects": {
        "experience": 2,
        "mood": "淡然"
      },
      "condition": null
    }
  ],
  "onEnter": [],
  "onExit": []
}
```

- [ ] **Step 3: 创建场景 12 - 踏上下一程**

```json
{
  "id": "12_departure",
  "title": "踏上下一程",
  "atmosphere": {
    "time": "黎明",
    "weather": "微光",
    "mood": "平静"
  },
  "texts": [
    {
      "content": "你回到了那道裂缝前。",
      "delay": 0
    },
    {
      "content": "老者已经不在了。只有那道裂缝还在，透着不同的光。",
      "delay": 800
    },
    {
      "content": "你没有犹豫。你迈步走了进去。",
      "delay": 1000
    },
    {
      "content": "身后，裂缝缓缓合拢。",
      "delay": 800
    },
    {
      "content": "前方，是另一个人间。",
      "delay": 1000
    },
    {
      "content": "你继续走着。不问来路，不问归途。",
      "delay": 1200
    },
    {
      "content": "——第一章·完——",
      "delay": 1500
    }
  ],
  "choices": [
    {
      "text": "继续旅途（待续）",
      "target": "01_awakening",
      "effects": {
        "experience": 3
      },
      "condition": null
    }
  ],
  "onEnter": [],
  "onExit": []
}
```

- [ ] **Step 4: 验证完整流程**

从场景 01 开始，走完所有分支：
- 路径 1: 01 → 02 → 05 → 06 → 08 → 12
- 路径 2: 01 → 02 → 05 → 06 → 09 → 12
- 路径 3: 01 → 02 → 05 → 07 → 10 → 11 → 12
- 路径 4: 01 → 03 → 05 → ...
- 路径 5: 01 → 04 → 05 → ...

验证：
- 所有路径都能走通
- 物品获取正确
- 标记设置正确
- 状态栏更新正确
- 存档/读档正常

---

## Task 12: 响应式适配 + 场景切换动画

**Files:**
- Modify: `css/style.css`
- Modify: `js/engine/renderer.js`

- [ ] **Step 1: 完善响应式样式**

在 `css/style.css` 中添加：

```css
/* 移动端适配 */
@media (max-width: 768px) {
  .btn-choice {
    padding: 1rem;
    font-size: 0.95rem;
  }

  .story-text p {
    margin-bottom: 0.8em;
  }

  .choices-container {
    gap: 0.5rem;
  }

  .game-title {
    letter-spacing: 0.3em;
  }

  .game-subtitle {
    letter-spacing: 0.15em;
    font-size: 0.75rem;
  }
}

/* 小屏幕适配 */
@media (max-width: 375px) {
  html, body {
    font-size: 15px;
  }

  .screen {
    padding: 1rem;
  }

  .game-title {
    font-size: 1.5rem;
  }
}
```

- [ ] **Step 2: 完善场景切换动画**

在 `js/engine/renderer.js` 的 `transitionToScene` 方法中，确保动画流畅：

```javascript
async transitionToScene() {
  this.storyEl.style.transition = 'opacity 0.3s ease';
  this.storyEl.style.opacity = '0';
  await this.wait(300);
  this.storyEl.innerHTML = '';
  this.storyEl.style.opacity = '1';
  await this.wait(200);
}
```

- [ ] **Step 3: 验证响应式**

在浏览器中测试不同屏幕尺寸：
- 1440px 桌面端
- 768px 平板端
- 375px 手机端
- 320px 小屏手机

验证：
- 文字大小合适
- 选项按钮全宽
- 状态栏不溢出
- 无水平滚动条

---

## 验收清单

完成所有任务后，验证以下功能：

- [ ] 标题屏正确显示
- [ ] 点击"踏入人间"开始新游戏
- [ ] 打字机效果逐字显示文字
- [ ] 点击可跳过打字机效果
- [ ] 选项按钮正确显示
- [ ] 点击选项后正确跳转
- [ ] 状态栏实时更新
- [ ] 存档功能正常
- [ ] 读档功能正常
- [ ] 所有 12 个场景可正常访问
- [ ] 物品获取正常
- [ ] 条件选项正常
- [ ] 响应式布局正常
- [ ] 场景切换动画流畅
