/**
 * renderer.js - 打字机渲染器
 * 人间无尽途 · 文本渲染模块
 *
 * 负责故事文本的打字机效果展示、选项按钮渲染、
 * 状态栏更新和场景切换动画。
 */

const PUNCTUATION = new Set(['，', '。', '！', '？', '、', '；', '：']);
const CHAR_DELAY = 30;
const PUNCTUATION_DELAY = 60;
const PAGE_FADE_MS = 300;

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
    this.isTransitioning = false;
    /** @type {boolean} */
    this._waitingForClick = false;
    /** @type {number | null} */
    this._waitId = null;

    this._handleClickBound = this.handleClick.bind(this);
    this.storyEl.addEventListener('click', this._handleClickBound);
  }

  // ---------------------------------------------------------------------------
  // 事件处理
  // ---------------------------------------------------------------------------

  /**
   * 点击事件：仅在等翻页时响应点击前进。
   * 打字过程中忽略所有点击。
   */
  handleClick(e) {
    // 打字过程中忽略所有点击
    if (this.isTyping) return;
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
   * 逐页展示文本数组：每段打字机效果，完成后等点击翻页。
   * @param {string[]} texts - 段落数组
   */
  async typeText(texts) {
    this.isTyping = true;

    for (let i = 0; i < texts.length; i++) {
      this.storyEl.innerHTML = '';

      const p = document.createElement('p');
      p.classList.add('visible');
      this.storyEl.appendChild(p);

      await this.typewriteParagraph(p, texts[i]);

      // 每段打完都等点击
      this._showContinueHint();
      await this._waitClick();
      this._hideContinueHint();
    }

    this.isTyping = false;
  }

  /**
   * 显示翻页提示。
   */
  _showContinueHint() {
    const p = this.storyEl.querySelector('p.visible');
    if (p) {
      const hint = document.createElement('span');
      hint.className = 'continue-hint';
      hint.textContent = ' ▼';
      p.appendChild(hint);
    }
  }

  /**
   * 隐藏翻页提示。
   */
  _hideContinueHint() {
    const hint = this.storyEl.querySelector('.continue-hint');
    if (hint) hint.remove();
  }

  /**
   * 等待用户点击翻页。
   */
  _waitClick() {
    return new Promise(resolve => {
      this._waitingForClick = true;
      this._clickResolver = resolve;
      const handler = (e) => {
        if (!this._waitingForClick) return;
        e.stopPropagation();
        e.preventDefault();
        this._waitingForClick = false;
        this._clickResolver = null;
        this.storyEl.removeEventListener('click', handler);
        resolve();
      };
      this.storyEl.addEventListener('click', handler);
    });
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
      const char = text[i];
      el.insertBefore(document.createTextNode(char), cursor);

      const delay = PUNCTUATION.has(char) ? PUNCTUATION_DELAY : CHAR_DELAY;
      await this.wait(delay);
    }

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
    this.choicesEl.style.opacity = '0';

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

    // 等待一下再淡入选项，避免和翻页动画冲突
    setTimeout(() => {
      this.choicesEl.style.transition = 'opacity 0.3s ease';
      this.choicesEl.style.opacity = '1';
    }, 100);
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
    this.isTransitioning = true;
    this.isTyping = true; // 防止过渡期间点击干扰
    this._cancelWait();
    this.storyEl.style.opacity = '0';
    await this.wait(PAGE_FADE_MS);

    this.storyEl.innerHTML = '';
    this.storyEl.style.opacity = '1';
    this.isTransitioning = false;
    this.isTyping = false; // 交给 typeText 重置
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
   * 等待指定毫秒。返回可用于取消的 Promise。
   * @param {number} ms
   * @returns {Promise<void>}
   */
  wait(ms) {
    return new Promise(resolve => {
      const id = setTimeout(() => {
        if (this._waitId === id) {
          this._waitId = null;
        }
        resolve();
      }, ms);
      this._waitId = id;
    });
  }

  /**
   * 取消当前等待。
   */
  _cancelWait() {
    if (this._waitId !== null) {
      clearTimeout(this._waitId);
      this._waitId = null;
    }
  }

  // ---------------------------------------------------------------------------
  // 清理
  // ---------------------------------------------------------------------------

  /**
   * 移除事件监听器，清理定时器。
   */
  destroy() {
    this.storyEl.removeEventListener('click', this._handleClickBound);
    this._cancelWait();
  }
}
