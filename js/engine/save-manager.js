/**
 * save-manager.js - 存档管理器
 * 人间无尽途 · 存档管理模块
 *
 * 管理游戏存档的保存、读取和删除。
 * 使用 localStorage 持久化游戏状态。
 */

const SAVE_PREFIX = 'emt_save_';
const MAX_SLOTS = 3;

export class SaveManager {
  /** @param {import('./state.js').GameState} gameState */
  constructor(gameState) {
    this._gameState = gameState;
  }

  // ---------------------------------------------------------------------------
  // 存档操作
  // ---------------------------------------------------------------------------

  /**
   * 保存当前状态到指定存档位。
   * @param {number} slot - 存档位（1-3）
   * @returns {boolean} 是否保存成功
   */
  save(slot) {
    if (slot < 1 || slot > MAX_SLOTS) return false;

    try {
      const data = this._gameState.toJSON();
      data.savedAt = Date.now();
      localStorage.setItem(SAVE_PREFIX + slot, JSON.stringify(data));
      return true;
    } catch (err) {
      console.error('[SaveManager] save failed:', err);
      return false;
    }
  }

  /**
   * 从指定存档位加载状态。
   * @param {number} slot - 存档位（1-3）
   * @returns {boolean} 是否加载成功
   */
  load(slot) {
    if (slot < 1 || slot > MAX_SLOTS) return false;

    try {
      const raw = localStorage.getItem(SAVE_PREFIX + slot);
      if (!raw) return false;

      const data = JSON.parse(raw);
      this._gameState.load(data);
      return true;
    } catch (err) {
      console.error('[SaveManager] load failed:', err);
      return false;
    }
  }

  /**
   * 自动保存到存档位 1。
   * @returns {boolean} 是否保存成功
   */
  autoSave() {
    return this.save(1);
  }

  // ---------------------------------------------------------------------------
  // 存档查询
  // ---------------------------------------------------------------------------

  /**
   * 获取指定存档位的摘要信息。
   * @param {number} slot - 存档位（1-3）
   * @returns {{ scene: string, mood: string, playTime: number, savedAt: number } | null}
   */
  getSaveInfo(slot) {
    if (slot < 1 || slot > MAX_SLOTS) return null;

    try {
      const raw = localStorage.getItem(SAVE_PREFIX + slot);
      if (!raw) return null;

      const data = JSON.parse(raw);
      return {
        scene: data.currentScene ?? '',
        mood: data.stats?.mood ?? '',
        playTime: data.playTime ?? 0,
        savedAt: data.savedAt ?? 0,
      };
    } catch {
      return null;
    }
  }

  /**
   * 获取所有存档位的信息。
   * @returns {Array<{ slot: number, info: { scene: string, mood: string, playTime: number, savedAt: number } | null }>}
   */
  getAllSaves() {
    const saves = [];
    for (let slot = 1; slot <= MAX_SLOTS; slot++) {
      saves.push({ slot, info: this.getSaveInfo(slot) });
    }
    return saves;
  }

  /**
   * 检查是否存在任意存档。
   * @returns {boolean}
   */
  hasSave() {
    for (let slot = 1; slot <= MAX_SLOTS; slot++) {
      if (localStorage.getItem(SAVE_PREFIX + slot) !== null) {
        return true;
      }
    }
    return false;
  }

  /**
   * 删除指定存档位的数据。
   * @param {number} slot - 存档位（1-3）
   * @returns {boolean} 是否删除成功
   */
  deleteSave(slot) {
    if (slot < 1 || slot > MAX_SLOTS) return false;

    try {
      localStorage.removeItem(SAVE_PREFIX + slot);
      return true;
    } catch (err) {
      console.error('[SaveManager] deleteSave failed:', err);
      return false;
    }
  }
}
