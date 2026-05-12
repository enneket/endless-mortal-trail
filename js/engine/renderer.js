/**
 * renderer.js - 打字机渲染器
 * 人间无尽途 · 文本渲染模块
 *
 * 负责故事文本的打字机效果展示、选项按钮渲染、
 * 状态栏更新和场景切换动画。
 */

const PUNCTUATION = new Set(['，', '。', '！', '？', '、', '；', '：']);
const CHAR_DELAY = 60;
const PUNCTUATION_DELAY = 120;
const FADE_OUT_MS = 300;
const FADE_IN_MS = 200;

export class Renderer {
  constructor() {
    this.storyEl = document.getElementById('story-text');
    this.titleEl = document.getElementById('scene-title');
    this.choicesEl = document.getElementById('choices-container');
    this.statExpEl = document.getElementById('stat-experience');
    this.statMoodEl = document.getElementById('stat-mood');

    if (!this.storyEl || !this.titleEl || !this.choicesEl) {
      throw new Error('[Renderer] Missing required DOM elements');
    }

    /** @type {boolean} */
    this.isTyping = false;
    /** @type {boolean} */
    this.skipRequested = false;
    /** @type {number | null} */
    this.currentTimeout = null;

    this._handleClickBound = this.handleClick.bind(this);
    document.addEventListener('click', this._handleClickBound);
  }

  // ---------------------------------------------------------------------------
  // 事件处理
  // ---------------------------------------------------------------------------

  /**
   * 点击跳过：如果正在打字，请求跳过。
   */
  handleClick() {
    if (this.isTyping) {
      this.skipRequested = true;
    }
  }

  // ---------------------------------------------------------------------------
  // 标题
  // ---------------------------------------------------------------------------

  /**
   * 设置场景标题。
   * @param {string} title
   */
  setTitle(title) {
    this.titleEl.textContent = title;
  }

  // ---------------------------------------------------------------------------
  // 打字机文本
  // ---------------------------------------------------------------------------

  /**
   * 逐段展示文本数组。
   * @param {string[]} texts - 段落数组
   */
  async typeText(texts) {
    this.isTyping = true;
    this.skipRequested = false;

    for (let i = 0; i < texts.length; i++) {
      if (this.skipRequested) {
        // 跳过模式：直接显示从当前段落开始的所有剩余段落
        for (let j = i; j < texts.length; j++) {
          const p = document.createElement('p');
          p.textContent = texts[j];
          p.classList.add('visible');
          this.storyEl.appendChild(p);
        }
        break;
      }

      await this.wait(200);

      const p = document.createElement('p');
      this.storyEl.appendChild(p);

      if (this.skipRequested) {
        p.textContent = texts[i];
        p.classList.add('visible');
      } else {
        await this.typewriteParagraph(p, texts[i]);
      }
    }

    this.isTyping = false;
    this.skipRequested = false;
  }

  /**
   * 对单个段落执行打字机效果。
   * @param {HTMLElement} el - 目标 <p> 元素
   * @param {string} text - 要显示的文本
   */
  async typewriteParagraph(el, text) {
    const cursor = document.createElement('span');
    cursor.className = 'cursor';
    el.appendChild(cursor);

    for (let i = 0; i < text.length; i++) {
      if (this.skipRequested) {
        // 跳过：一次性显示剩余文字
        el.textContent = text;
        el.classList.add('visible');
        return;
      }

      const char = text[i];
      // 在光标前插入字符
      el.insertBefore(document.createTextNode(char), cursor);

      const delay = PUNCTUATION.has(char) ? PUNCTUATION_DELAY : CHAR_DELAY;
      await this.wait(delay);
    }

    // 打字完成，移除光标并显示段落
    cursor.remove();
    el.classList.add('visible');
  }

  // ---------------------------------------------------------------------------
  // 选项
  // ---------------------------------------------------------------------------

  /**
   * 显示选项按钮。
   * @param {Array<{ text: string }>} choices - 选项数组
   * @param {(index: number) => void} onChoose - 选择回调
   */
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

  /**
   * 清空选项容器。
   */
  hideChoices() {
    this.choicesEl.innerHTML = '';
  }

  // ---------------------------------------------------------------------------
  // 状态栏
  // ---------------------------------------------------------------------------

  /**
   * 更新状态栏显示。
   * @param {{ experience?: number, mood?: string }} stats
   */
  updateStats(stats) {
    if (stats.experience !== undefined) {
      this.statExpEl.textContent = `阅历: ${stats.experience}`;
    }
    if (stats.mood !== undefined) {
      this.statMoodEl.textContent = `心境: ${stats.mood}`;
    }
  }

  // ---------------------------------------------------------------------------
  // 场景切换
  // ---------------------------------------------------------------------------

  /**
   * 淡出故事区域，清空内容，再淡入。
   */
  async transitionToScene() {
    this.skipRequested = true;
    if (this.currentTimeout !== null) {
      clearTimeout(this.currentTimeout);
      this.currentTimeout = null;
    }
    this.storyEl.style.opacity = '0';
    await this.wait(FADE_OUT_MS);

    this.storyEl.innerHTML = '';
    this.storyEl.style.opacity = '1';
    await this.wait(FADE_IN_MS);
  }

  // ---------------------------------------------------------------------------
  // 屏幕切换
  // ---------------------------------------------------------------------------

  /**
   * 隐藏所有 .screen 元素，显示目标屏幕。
   * @param {string} screenId - 目标屏幕的 ID
   */
  showScreen(screenId) {
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => {
      screen.classList.add('hidden');
    });

    const target = document.getElementById(screenId);
    if (target) {
      target.classList.remove('hidden');
    }
  }

  // ---------------------------------------------------------------------------
  // 工具方法
  // ---------------------------------------------------------------------------

  /**
   * 等待指定毫秒。
   * @param {number} ms
   * @returns {Promise<void>}
   */
  wait(ms) {
    return new Promise(resolve => {
      this.currentTimeout = setTimeout(() => {
        this.currentTimeout = null;
        resolve();
      }, ms);
    });
  }

  // ---------------------------------------------------------------------------
  // 清理
  // ---------------------------------------------------------------------------

  /**
   * 移除事件监听器，清理定时器。
   */
  destroy() {
    document.removeEventListener('click', this._handleClickBound);
    if (this.currentTimeout !== null) {
      clearTimeout(this.currentTimeout);
      this.currentTimeout = null;
    }
  }
}
