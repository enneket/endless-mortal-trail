/**
 * story-engine.js - 故事引擎
 * 人间无尽途 · 故事调度核心
 *
 * 负责加载章节、场景、NPC 与物品数据，
 * 协调 GameState、Renderer 和 SaveManager 完成故事推进。
 */

import { SceneAssembler } from './scene-assembler.js';

export class StoryEngine {
  /**
   * @param {import('./state.js').GameState} gameState
   * @param {import('./renderer.js').Renderer} renderer
   * @param {import('./save-manager.js').SaveManager} saveManager
   */
  constructor(gameState, renderer, saveManager) {
    this.gameState = gameState;
    this.renderer = renderer;
    this.saveManager = saveManager;

    /** @type {Record<string, object>} */
    this.sceneCache = {};
    /** @type {Record<string, object>} */
    this.npcData = {};
    /** @type {Record<string, object>} */
    this.itemData = {};
    /** @type {object | null} */
    this.chapterMeta = null;
    /** @type {import('./scene-assembler.js').SceneAssembler | null} */
    this.assembler = null;
  }

  // ---------------------------------------------------------------------------
  // 数据加载
  // ---------------------------------------------------------------------------

  /**
   * 加载章节元数据、NPC 和物品数据。
   * @param {string} chapterId - 章节 ID（如 'chapter1'）
   */
  async loadChapter(chapterId) {
    const base = `story/${chapterId}`;

    const meta = await this._fetchJSON(`${base}/meta.json`);
    this.chapterMeta = meta;

    if (meta && meta.randomized) {
      // 随机生成章节：加载骨架、NPC 池、物品池
      const [skeleton, npcs, items] = await Promise.all([
        this._fetchJSON(`${base}/skeleton.json`),
        this._fetchJSON(`${base}/npcs.json`),
        this._fetchJSON(`${base}/items.json`),
      ]);

      this.assembler = new SceneAssembler(skeleton, npcs ?? {}, items ?? {});
      this.npcData = npcs ?? {};
      this.itemData = items ?? {};
    } else {
      // 手写章节：加载共享 NPC/物品数据
      const [npcs, items] = await Promise.all([
        this._fetchJSON('story/shared/npcs.json'),
        this._fetchJSON('story/shared/items.json'),
      ]);

      this.assembler = null;
      this.npcData = npcs ?? {};
      this.itemData = items ?? {};
    }
  }

  /**
   * 加载指定场景的 JSON 数据并缓存。
   * @param {string} sceneId - 场景 ID
   * @returns {Promise<object>} 场景数据
   */
  async loadScene(sceneId) {
    if (this.sceneCache[sceneId]) {
      return this.sceneCache[sceneId];
    }

    const chapterId = this.gameState.get('currentChapter');
    let scene;

    if (this.assembler) {
      // 随机生成章节：从模板组装
      const templateUrl = `story/${chapterId}/templates/${sceneId}.json`;
      const template = await this._fetchJSON(templateUrl);

      if (!template) {
        throw new Error(`[StoryEngine] Template not found: ${sceneId}`);
      }

      scene = this.assembler.assemble(sceneId, template, this.gameState);
    } else {
      // 手写章节：直接加载
      const url = `story/${chapterId}/scenes/${sceneId}.json`;
      scene = await this._fetchJSON(url);
    }

    if (!scene) {
      throw new Error(`[StoryEngine] Scene not found: ${sceneId}`);
    }

    this.sceneCache[sceneId] = scene;
    return scene;
  }

  // ---------------------------------------------------------------------------
  // 场景播放
  // ---------------------------------------------------------------------------

  /**
   * 播放一个完整场景：过渡 → 标题 → 文本 → 选项 → 效果 → 自动存档 → 下一场景。
   * @param {string} sceneId - 场景 ID
   */
  async playScene(sceneId) {
    const scene = await this.loadScene(sceneId);

    // 更新状态
    this.gameState.set('currentScene', sceneId);
    this.gameState.addToHistory(sceneId);

    // 场景过渡动画
    await this.renderer.transitionToScene();

    // 设置标题
    if (scene.title) {
      this.renderer.setTitle(scene.title);
    }

    // 打字机展示文本（逐段播放，段间插入自定义延迟）
    if (scene.texts && scene.texts.length > 0) {
      for (let i = 0; i < scene.texts.length; i++) {
        const entry = scene.texts[i];
        // 段间自定义延迟（第一段前的延迟由 typeText 内部处理）
        if (i > 0 && entry.delay) {
          await this.renderer.wait(entry.delay);
        }
        await this.renderer.typeText([entry.content]);
      }
    }

    // 过滤并显示选项
    const available = this._filterChoices(scene.choices);

    if (available.length === 0) {
      // 没有选项，故事结束
      return;
    }

    this.renderer.showChoices(available, (index) => {
      this._handleChoice(available[index]).catch((err) => {
        console.error('[StoryEngine] Choice handling failed:', err);
      });
    });
  }

  /**
   * 切换到下一章：更新章节 ID、清空场景缓存、加载新章节、播放起始场景。
   * @param {string} nextChapterId
   */
  async switchChapter(nextChapterId) {
    this.gameState.set('currentChapter', nextChapterId);
    this.sceneCache = {};
    await this.loadChapter(nextChapterId);

    const startScene = this.chapterMeta?.startScene ?? '01_arrival';
    this.gameState.set('currentScene', startScene);
    await this.playScene(startScene);
  }

  /**
   * 开始游戏：加载第一章并播放起始场景。
   */
  async start() {
    const chapterId = this.gameState.get('currentChapter');
    await this.loadChapter(chapterId);

    const startScene = this.chapterMeta?.startScene ?? this.gameState.get('currentScene');
    await this.playScene(startScene);
  }

  // ---------------------------------------------------------------------------
  // 数据查询
  // ---------------------------------------------------------------------------

  /**
   * 获取 NPC 数据。
   * @param {string} npcId
   * @returns {object | undefined}
   */
  getNpc(npcId) {
    return this.npcData[npcId];
  }

  /**
   * 获取物品数据。
   * @param {string} itemId
   * @returns {object | undefined}
   */
  getItem(itemId) {
    return this.itemData[itemId];
  }

  // ---------------------------------------------------------------------------
  // 内部方法
  // ---------------------------------------------------------------------------

  /**
   * 根据条件过滤可用选项。
   * @param {Array<object>} choices
   * @returns {Array<object>}
   */
  _filterChoices(choices) {
    if (!Array.isArray(choices)) return [];

    return choices.filter((choice) => {
      // condition 为 null 或 undefined 时视为无条件
      if (!choice.condition) return true;
      return this.gameState.checkCondition(choice.condition);
    });
  }

  /**
   * 处理玩家选择：应用效果 → 更新状态栏 → 自动存档 → 播放下一场景。
   * @param {object} choice - 选项数据
   */
  async _handleChoice(choice) {
    // 应用效果
    if (choice.effects) {
      this.gameState.applyEffects(choice.effects);
    }

    // 更新状态栏
    this.renderer.updateStats({
      experience: this.gameState.get('stats.experience'),
      mood: this.gameState.get('stats.mood'),
    });

    // 自动存档
    this.saveManager.autoSave();

    // 播放下一场景
    if (choice.target) {
      // 检查是否需要切换章节（target 包含 chapter 前缀）
      const targetChapter = this._detectChapterSwitch(choice.target);
      if (targetChapter) {
        await this.switchChapter(targetChapter);
      } else {
        await this.playScene(choice.target);
      }
    }
  }

  /**
   * 检测是否需要章节切换。
   * 如果 target 格式为 "chapter2:scene_id"，返回目标章节 ID。
   * @param {string} target
   * @returns {string|null}
   */
  _detectChapterSwitch(target) {
    if (target.includes(':')) {
      const [chapterId] = target.split(':');
      return chapterId;
    }
    return null;
  }

  /**
   * 通用 JSON 获取封装。
   * @param {string} url
   * @returns {Promise<object | null>}
   */
  async _fetchJSON(url) {
    try {
      const res = await fetch(url);
      if (!res.ok) return null;
      return await res.json();
    } catch (err) {
      console.error(`[StoryEngine] Failed to fetch ${url}:`, err);
      return null;
    }
  }
}
