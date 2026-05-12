/**
 * state.js - 游戏状态管理器
 * 人间无尽途 · 状态管理模块
 *
 * 使用发布-订阅模式通知 UI 层状态变化。
 * 支持点分路径访问嵌套属性（如 'stats.mood'）。
 */

const DEFAULT_STATE = Object.freeze({
  player: { name: '渡途人', title: '无名行者' },
  stats: { experience: 0, wisdom: 0, courage: 0, karma: 0, mood: '迷茫' },
  inventory: [],
  history: [],
  currentScene: '01_awakening',
  currentChapter: 'chapter1',
  flags: {},
  playTime: 0,
  createdAt: null,
  savedAt: null,
});

/** 深拷贝：处理对象、数组和冻结的不可变源 */
function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(deepClone);
  const clone = {};
  for (const key of Object.keys(obj)) {
    clone[key] = deepClone(obj[key]);
  }
  return clone;
}

export class GameState {
  /** @param {object} [initialState] - 可选的初始状态覆盖 */
  constructor(initialState) {
    /** @type {Set<function>} */
    this._listeners = new Set();
    /** @type {object} */
    this._state = initialState ? this._merge(deepClone(DEFAULT_STATE), initialState) : this.createDefault();
  }

  // ---------------------------------------------------------------------------
  // 状态操作
  // ---------------------------------------------------------------------------

  /**
   * 返回 DEFAULT_STATE 的深拷贝，不做任何通知。
   * @returns {object}
   */
  createDefault() {
    return deepClone(DEFAULT_STATE);
  }

  /**
   * 重置状态为默认值，设置 createdAt 并通知所有订阅者。
   */
  reset() {
    this._state = this.createDefault();
    this._state.createdAt = Date.now();
    this.notify();
  }

  /**
   * 从存档加载状态：以默认状态为基础，用 savedState 覆盖可识别字段。
   * @param {object} savedState
   */
  load(savedState) {
    const base = this.createDefault();
    this._state = this._merge(base, savedState);
    this.notify();
  }

  /**
   * 通过点分路径获取值。
   * @param {string} key - 例如 'stats.mood', 'player.name'
   * @returns {*}
   */
  get(key) {
    const parts = key.split('.');
    let current = this._state;
    for (const part of parts) {
      if (current == null || typeof current !== 'object') return undefined;
      current = current[part];
    }
    return current;
  }

  /**
   * 通过点分路径设置值并通知。
   * @param {string} key - 例如 'stats.mood'
   * @param {*} value
   */
  set(key, value) {
    const parts = key.split('.');
    let current = this._state;
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (current[part] == null || typeof current[part] !== 'object') {
        current[part] = {};
      }
      current = current[part];
    }
    current[parts[parts.length - 1]] = value;
    this.notify();
  }

  // ---------------------------------------------------------------------------
  // 效果应用
  // ---------------------------------------------------------------------------

  /**
   * 应用一组效果到当前状态。
   *
   * 支持的效果键：
   *   karma / wisdom / courage / experience : number（增量）
   *   mood : string（直接赋值）
   *   addItem : string（物品 ID）
   *   removeItem : string（物品 ID）
   *   setFlag : string（标记名）
   *
   * 每次调用始终 experience += 1（经历即成长）。
   * @param {object} effects - 效果对象
   */
  applyEffects(effects) {
    if (!effects || typeof effects !== 'object') return;

    // 经历即成长
    this._state.stats.experience += 1;

    // 数值增量字段
    for (const field of ['karma', 'wisdom', 'courage', 'experience']) {
      if (effects[field] !== undefined) {
        this._state.stats[field] += effects[field];
      }
    }

    // 心境直接赋值
    if (effects.mood !== undefined) {
      this._state.stats.mood = effects.mood;
    }

    // 物品操作
    if (effects.addItem !== undefined && !this.hasItem(effects.addItem)) {
      this._state.inventory.push(effects.addItem);
    }
    if (effects.removeItem !== undefined) {
      this._state.inventory = this._state.inventory.filter(id => id !== effects.removeItem);
    }

    // 标记
    if (effects.setFlag !== undefined) {
      this._state.flags[effects.setFlag] = true;
    }

    this.notify();
  }

  // ---------------------------------------------------------------------------
  // 历史与查询
  // ---------------------------------------------------------------------------

  /**
   * 将场景 ID 添加到历史记录（去重）。
   * @param {string} sceneId
   */
  addToHistory(sceneId) {
    if (!this._state.history.includes(sceneId)) {
      this._state.history.push(sceneId);
    }
  }

  /**
   * 检查物品是否在背包中。
   * @param {string} itemId
   * @returns {boolean}
   */
  hasItem(itemId) {
    return this._state.inventory.includes(itemId);
  }

  /**
   * 检查标记是否已设置。
   * @param {string} flag
   * @returns {boolean}
   */
  hasFlag(flag) {
    return this._state.flags[flag] === true;
  }

  /**
   * 检查一组条件是否全部满足。
   *
   * 支持的条件键：
   *   hasItem : string（背包中包含该物品）
   *   hasFlag : string（标记已设置）
   *   minKarma : number（业力 >= 该值）
   *   mood : string（心境匹配）
   * @param {object} condition
   * @returns {boolean}
   */
  checkCondition(condition) {
    if (!condition || typeof condition !== 'object') return true;

    if (condition.hasItem !== undefined && !this.hasItem(condition.hasItem)) {
      return false;
    }
    if (condition.hasFlag !== undefined && !this.hasFlag(condition.hasFlag)) {
      return false;
    }
    if (condition.minKarma !== undefined && this._state.stats.karma < condition.minKarma) {
      return false;
    }
    if (condition.mood !== undefined && this._state.stats.mood !== condition.mood) {
      return false;
    }

    return true;
  }

  // ---------------------------------------------------------------------------
  // 发布-订阅
  // ---------------------------------------------------------------------------

  /**
   * 订阅状态变化。返回取消订阅函数。
   * @param {function} listener - 接收当前状态对象
   * @returns {function} unsubscribe
   */
  subscribe(listener) {
    this._listeners.add(listener);
    return () => {
      this._listeners.delete(listener);
    };
  }

  /**
   * 通知所有订阅者，传递当前状态的只读深拷贝。
   */
  notify() {
    const snapshot = this.toJSON();
    for (const listener of this._listeners) {
      try {
        listener(snapshot);
      } catch (err) {
        console.error('[GameState] listener error:', err);
      }
    }
  }

  // ---------------------------------------------------------------------------
  // 序列化
  // ---------------------------------------------------------------------------

  /**
   * 返回当前状态的深拷贝（可安全用于 JSON 序列化）。
   * @returns {object}
   */
  toJSON() {
    return deepClone(this._state);
  }

  // ---------------------------------------------------------------------------
  // 内部工具
  // ---------------------------------------------------------------------------

  /**
   * 将 source 中存在于 target 结构中的字段递归合并到 target 上。
   * 保留 target 的默认结构，仅覆盖 source 中提供的叶子值和子对象。
   * @param {object} target - 基础对象（深拷贝）
   * @param {object} source - 覆盖数据
   * @returns {object} 合并后的对象（修改 target）
   */
  _merge(target, source) {
    if (!source || typeof source !== 'object') return target;

    for (const key of Object.keys(source)) {
      const srcVal = source[key];
      const tgtVal = target[key];

      // 两边都是普通对象 → 递归合并
      if (
        tgtVal !== null && typeof tgtVal === 'object' && !Array.isArray(tgtVal) &&
        srcVal !== null && typeof srcVal === 'object' && !Array.isArray(srcVal)
      ) {
        this._merge(tgtVal, srcVal);
      } else {
        // 叶子值或数组：直接覆盖
        target[key] = deepClone(srcVal);
      }
    }

    return target;
  }
}
