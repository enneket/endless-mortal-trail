/**
 * scene-assembler.js - 场景组装器
 * 人间无尽途 · 随机生成核心
 *
 * 从骨架 + NPC池 + 物品池运行时组装完整场景 JSON。
 * 模板中使用 {{NPC_SLOT_N:field}} 和 {{ITEM_SLOT_X:field}} 占位符。
 */

export class SceneAssembler {
  /**
   * @param {object} skeleton - 骨架定义
   * @param {object} npcPool - NPC 池
   * @param {object} itemPool - 物品池
   */
  constructor(skeleton, npcPool, itemPool) {
    this.skeleton = skeleton;
    this.npcPool = npcPool;
    this.itemPool = itemPool;

    /** @type {Record<string, string>} slot → npcId */
    this.npcAssignments = {};
    /** @type {Record<string, string>} slot → itemId */
    this.itemAssignments = {};

    this._assignSlots();
  }

  // ---------------------------------------------------------------------------
  // 槽位分配
  // ---------------------------------------------------------------------------

  /**
   * 从候选池中随机抽取，分配到各槽位。
   * 确保同一个 NPC 不会被分配到多个槽位。
   */
  _assignSlots() {
    const usedNpcs = new Set();
    const usedItems = new Set();

    for (const [slotId, slot] of Object.entries(this.skeleton.npcSlots)) {
      const available = slot.candidates.filter(id => !usedNpcs.has(id));
      const picked = this._pickRandom(available);
      this.npcAssignments[slotId] = picked;
      if (picked) usedNpcs.add(picked);
    }

    for (const [slotId, slot] of Object.entries(this.skeleton.itemSlots)) {
      const available = slot.candidates.filter(id => !usedItems.has(id));
      const picked = this._pickRandom(available);
      this.itemAssignments[slotId] = picked;
      if (picked) usedItems.add(picked);
    }
  }

  /**
   * 从数组中随机选取一个元素。
   * @param {Array} arr
   * @returns {*|null}
   */
  _pickRandom(arr) {
    if (!arr || arr.length === 0) return null;
    return arr[Math.floor(Math.random() * arr.length)];
  }

  // ---------------------------------------------------------------------------
  // 场景组装
  // ---------------------------------------------------------------------------

  /**
   * 组装指定场景的完整 JSON。
   * @param {string} sceneId - 场景 ID
   * @param {object} template - 场景模板
   * @param {object} gameState - 当前游戏状态（用于状态继承）
   * @returns {object} 完整的场景 JSON
   */
  assemble(sceneId, template, gameState) {
    const scene = JSON.parse(JSON.stringify(template));

    // 替换文本中的占位符
    if (scene.texts) {
      scene.texts = scene.texts.map(entry => ({
        ...entry,
        content: this._replacePlaceholders(entry.content, gameState)
      }));
    }

    // 替换选项中的占位符
    if (scene.choices) {
      scene.choices = scene.choices.map(choice => ({
        ...choice,
        text: this._replacePlaceholders(choice.text, gameState)
      }));

      // 过滤掉条件不满足的选项
      scene.choices = scene.choices.filter(choice => {
        if (!choice.condition) return true;
        return this._checkCondition(choice.condition, gameState);
      });
    }

    // 注入物品获取效果
    this._injectItemEffects(scene);

    return scene;
  }

  // ---------------------------------------------------------------------------
  // 占位符替换
  // ---------------------------------------------------------------------------

  /**
   * 替换文本中的 {{SLOT:field}} 占位符。
   *
   * NPC 占位符: {{NPC_SLOT_N:field}} where N=1-6, field=name|identity|greeting|reveal|gift
   * 物品占位符: {{ITEM_SLOT_X:field}} where X=a-c, field=name|description
   * 状态占位符: {{STATE:key}} - mood returns current mood, flags return empty if set
   *
   * @param {string} text
   * @param {object} gameState
   * @returns {string}
   */
  _replacePlaceholders(text, gameState) {
    if (!text) return text;

    // NPC 占位符
    text = text.replace(/\{\{NPC_SLOT_(\d+):(\w+)\}\}/g, (match, slotNum, field) => {
      const slotId = `slot_${slotNum}`;
      const npcId = this.npcAssignments[slotId];
      if (!npcId) return match;
      const npc = this.npcPool[npcId];
      if (!npc) return match;

      if (field === 'name') return npc.name;
      if (field === 'identity') return npc.identity;
      if (npc.dialogues && npc.dialogues[field]) return npc.dialogues[field];
      return match;
    });

    // 物品占位符
    text = text.replace(/\{\{ITEM_SLOT_([a-c]):(\w+)\}\}/g, (match, slotLetter, field) => {
      const slotId = `slot_${slotLetter}`;
      const itemId = this.itemAssignments[slotId];
      if (!itemId) return match;
      const item = this.itemPool[itemId];
      if (!item) return match;

      if (field === 'name') return item.name;
      if (field === 'description') return item.description;
      return match;
    });

    // 状态占位符
    text = text.replace(/\{\{STATE:(\w+)\}\}/g, (match, key) => {
      if (!gameState) return match;

      if (key === 'mood') return gameState.get('stats.mood') || '迷茫';

      // 标记检查：如果标记存在，返回空字符串
      if (gameState.hasFlag(key)) return '';
      return match;
    });

    return text;
  }

  // ---------------------------------------------------------------------------
  // 条件检查
  // ---------------------------------------------------------------------------

  /**
   * 检查条件是否满足。
   * @param {object} condition
   * @param {object} gameState
   * @returns {boolean}
   */
  _checkCondition(condition, gameState) {
    if (!condition || !gameState) return true;

    if (condition.hasItem && !gameState.hasItem(condition.hasItem)) return false;
    if (condition.hasFlag && !gameState.hasFlag(condition.hasFlag)) return false;
    if (condition.minKarma !== undefined && gameState.get('stats.karma') < condition.minKarma) return false;
    if (condition.mood && gameState.get('stats.mood') !== condition.mood) return false;

    return true;
  }

  // ---------------------------------------------------------------------------
  // 物品注入
  // ---------------------------------------------------------------------------

  /**
   * 将分配的物品效果注入到场景选项中。
   * Choices with `_itemSlot: "a"` get the item assigned to slot_a injected.
   * @param {object} scene
   */
  _injectItemEffects(scene) {
    if (!scene.choices) return;

    for (const choice of scene.choices) {
      if (choice._itemSlot) {
        const slotId = `slot_${choice._itemSlot}`;
        const itemId = this.itemAssignments[slotId];
        if (itemId) {
          const item = this.itemPool[itemId];
          if (item && item.effects) {
            choice.effects = { ...choice.effects, ...item.effects, addItem: itemId };
          }
        }
        delete choice._itemSlot;
      }
    }
  }

  // ---------------------------------------------------------------------------
  // 查询
  // ---------------------------------------------------------------------------

  /**
   * 获取指定槽位分配的 NPC ID。
   * @param {string} slotId
   * @returns {string|null}
   */
  getNpcForSlot(slotId) {
    return this.npcAssignments[slotId] || null;
  }

  /**
   * 获取指定槽位分配的物品 ID。
   * @param {string} slotId
   * @returns {string|null}
   */
  getItemForSlot(slotId) {
    return this.itemAssignments[slotId] || null;
  }

  /**
   * 获取指定 NPC 的完整数据。
   * @param {string} npcId
   * @returns {object|null}
   */
  getNpcData(npcId) {
    return this.npcPool[npcId] || null;
  }
}
