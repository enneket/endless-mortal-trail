/**
 * app.js - 应用主入口
 * 人间无尽途 · 应用入口模块
 *
 * 导入所有引擎模块并将其连接在一起，
 * 管理屏幕切换、事件绑定和游玩计时。
 */

import { GameState } from './engine/state.js';
import { Renderer } from './engine/renderer.js';
import { SaveManager } from './engine/save-manager.js';
import { StoryEngine } from './engine/story-engine.js';

const MAX_SLOTS = 3;
const SAVE_WATCH_INTERVAL = 5000;

export class App {
  constructor() {
    /** @type {GameState} */
    this.gameState = new GameState();
    /** @type {Renderer} */
    this.renderer = new Renderer();
    /** @type {SaveManager} */
    this.saveManager = new SaveManager(this.gameState);
    /** @type {StoryEngine} */
    this.storyEngine = new StoryEngine(this.gameState, this.renderer, this.saveManager);

    /** @type {number | null} */
    this._playTimeInterval = null;
    /** @type {number | null} */
    this._saveWatchInterval = null;

    this.init();
  }

  // ---------------------------------------------------------------------------
  // 初始化
  // ---------------------------------------------------------------------------

  /**
   * 初始化应用：绑定事件、更新标题屏、显示标题屏。
   */
  init() {
    this.bindEvents();
    this.updateTitleScreen();
    this.renderer.showScreen('title-screen');
    this._startSaveWatcher();
  }

  // ---------------------------------------------------------------------------
  // 事件绑定
  // ---------------------------------------------------------------------------

  /**
   * 绑定所有按钮事件。
   */
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
      this.updateTitleScreen();
      this.renderer.showScreen('title-screen');
    });
  }

  // ---------------------------------------------------------------------------
  // 标题屏
  // ---------------------------------------------------------------------------

  /**
   * 根据存档状态显示/隐藏"继续旅途"和"读取存档"按钮。
   */
  updateTitleScreen() {
    const hasSave = this.saveManager.hasSave();
    document.getElementById('btn-continue').classList.toggle('hidden', !hasSave);
    document.getElementById('btn-load').classList.toggle('hidden', !hasSave);
  }

  // ---------------------------------------------------------------------------
  // 游戏流程
  // ---------------------------------------------------------------------------

  /**
   * 开始新游戏：重置状态、切换到游戏屏、启动计时、开始故事。
   */
  async startNewGame() {
    this.gameState.reset();
    this.renderer.showScreen('game-screen');
    this._startPlayTimeTracker();
    await this.storyEngine.start();
  }

  /**
   * 继续游戏：读取存档位 1、切换到游戏屏、启动计时、播放当前场景。
   */
  async continueGame() {
    const loaded = this.saveManager.load(1);
    if (!loaded) {
      return;
    }

    this.renderer.showScreen('game-screen');
    this._startPlayTimeTracker();
    await this._playCurrentScene();
  }

  // ---------------------------------------------------------------------------
  // 存档屏
  // ---------------------------------------------------------------------------

  /**
   * 显示存档屏，渲染所有存档位。
   */
  showSaveScreen() {
    const container = document.getElementById('save-slots');
    container.innerHTML = '';

    const saves = this.saveManager.getAllSaves();

    for (const { slot, info } of saves) {
      const el = document.createElement('div');
      el.className = 'save-slot';

      const title = document.createElement('div');
      title.className = 'save-slot-title';
      title.textContent = `存档 ${slot}`;

      const infoEl = document.createElement('div');
      infoEl.className = 'save-slot-info';

      if (info) {
        infoEl.textContent = `${info.mood} · ${this.formatTime(info.playTime)} · ${this._formatTimestamp(info.savedAt)}`;
      } else {
        infoEl.textContent = '空';
      }

      el.appendChild(title);
      el.appendChild(infoEl);

      el.addEventListener('click', async () => {
        const loaded = this.saveManager.load(slot);
        if (!loaded) {
          return;
        }

        this.renderer.showScreen('game-screen');
        this._startPlayTimeTracker();
        await this._playCurrentScene();
      });

      container.appendChild(el);
    }

    this.renderer.showScreen('save-screen');
  }

  // ---------------------------------------------------------------------------
  // 计时
  // ---------------------------------------------------------------------------

  /**
   * 启动游玩计时器。每秒递增 playTime。
   * 若已有计时器则先清除，避免重复。
   */
  _startPlayTimeTracker() {
    if (this._playTimeInterval !== null) {
      clearInterval(this._playTimeInterval);
    }

    this._playTimeInterval = setInterval(() => {
      const current = this.gameState.get('playTime') ?? 0;
      this.gameState.set('playTime', current + 1);
    }, 1000);
  }

  /**
   * 格式化秒数为 "X分Y秒"。
   * @param {number} seconds
   * @returns {string}
   */
  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}分${secs}秒`;
  }

  // ---------------------------------------------------------------------------
  // 内部方法
  // ---------------------------------------------------------------------------

  /**
   * 播放当前状态中的场景。
   */
  async _playCurrentScene() {
    const scene = this.gameState.get('currentScene');
    if (!scene) {
      return;
    }

    try {
      await this.storyEngine.playScene(scene);
    } catch (err) {
      console.error('[App] Failed to play scene:', err);
    }
  }

  /**
   * 格式化时间戳为本地日期时间字符串。
   * @param {number} timestamp
   * @returns {string}
   */
  _formatTimestamp(timestamp) {
    if (!timestamp) {
      return '';
    }
    return new Date(timestamp).toLocaleString('zh-CN', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  /**
   * 定期检查存档变化，自动更新标题屏按钮状态。
   * 仅在标题屏可见时检查。
   */
  _startSaveWatcher() {
    this._saveWatchInterval = setInterval(() => {
      const titleScreen = document.getElementById('title-screen');
      if (titleScreen && !titleScreen.classList.contains('hidden')) {
        this.updateTitleScreen();
      }
    }, SAVE_WATCH_INTERVAL);
  }
}

// ---------------------------------------------------------------------------
// 启动
// ---------------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
  new App();
});
