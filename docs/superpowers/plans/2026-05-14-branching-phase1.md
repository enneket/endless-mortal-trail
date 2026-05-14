# 分支章节系统 - Phase 1 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 改造 Chapter 1 增加3个结局，创建 Chapter 2 的3个变体（chapter2a, chapter2b, chapter2c）

**Architecture:** 修改 Chapter 1 现有场景添加flag机制，创建3个新结局场景；为 Chapter 2 创建3个独立变体，每个包含完整的随机生成章节结构。

**Tech Stack:** JSON数据驱动，SceneAssembler随机生成引擎

---

## 文件结构

### Chapter 1 改造
- Modify: `story/chapter1/scenes/11_mountain_peak.json` - 添加设置flag的选项
- Create: `story/chapter1/scenes/12a_acceptance.json` - 坦然结局
- Create: `story/chapter1/scenes/12b_hesitation.json` - 犹豫结局
- Create: `story/chapter1/scenes/12c_resistance.json` - 抗拒结局

### Chapter 2a (山间小镇)
- Create: `story/chapter2a/meta.json`
- Create: `story/chapter2a/npcs.json`
- Create: `story/chapter2a/items.json`
- Create: `story/chapter2a/skeleton.json`
- Create: `story/chapter2a/templates/01_town_gate.json`
- Create: `story/chapter2a/templates/02_main_street.json`
- Create: `story/chapter2a/templates/03_teahouse.json`
- Create: `story/chapter2a/templates/04_medicine_shop.json`
- Create: `story/chapter2a/templates/05_school.json`
- Create: `story/chapter2a/templates/06_hunting_lodge.json`
- Create: `story/chapter2a/templates/07_mountain_path.json`
- Create: `story/chapter2a/templates/08_night_town.json`
- Create: `story/chapter2a/templates/09_truth_revealed.json`
- Create: `story/chapter2a/templates/10a_stay.json`
- Create: `story/chapter2a/templates/10b_leave.json`
- Create: `story/chapter2a/templates/10c_explore.json`

### Chapter 2b (迷雾森林)
- Create: `story/chapter2b/meta.json`
- Create: `story/chapter2b/npcs.json`
- Create: `story/chapter2b/items.json`
- Create: `story/chapter2b/skeleton.json`
- Create: `story/chapter2b/templates/` (12个场景模板)

### Chapter 2c (战火边关)
- Create: `story/chapter2c/meta.json`
- Create: `story/chapter2c/npcs.json`
- Create: `story/chapter2c/items.json`
- Create: `story/chapter2c/skeleton.json`
- Create: `story/chapter2c/templates/` (12个场景模板)

---

## Task 1: 修改 Chapter 1 第11场景，添加flag设置

**Files:**
- Modify: `story/chapter1/scenes/11_mountain_peak.json`

- [ ] **Step 1: 读取当前第11场景内容**

```bash
cat story/chapter1/scenes/11_mountain_peak.json
```

- [ ] **Step 2: 修改选项，添加flag设置**

将现有选项修改为设置不同flag：

```json
{
  "choices": [
    {
      "text": "坦然接受这一切",
      "target": "12a_acceptance",
      "effects": { "setFlag": "accepting", "mood": "平静" },
      "condition": null
    },
    {
      "text": "犹豫不决，不知如何是好",
      "target": "12b_hesitation",
      "effects": { "setFlag": "hesitating", "mood": "迷茫" },
      "condition": null
    },
    {
      "text": "抗拒命运，想要回头",
      "target": "12c_resistance",
      "effects": { "setFlag": "resisting", "mood": "愤怒" },
      "condition": null
    }
  ]
}
```

- [ ] **Step 3: 验证JSON格式**

```bash
python3 -c "import json; json.load(open('story/chapter1/scenes/11_mountain_peak.json')); print('✓ Valid')"
```

- [ ] **Step 4: Commit**

```bash
git add story/chapter1/scenes/11_mountain_peak.json
git commit -m "feat(chapter1): add branching choices to scene 11"
```

---

## Task 2: 创建 Chapter 1 坦然结局场景

**Files:**
- Create: `story/chapter1/scenes/12a_acceptance.json`

- [ ] **Step 1: 创建坦然结局场景**

```json
{
  "id": "12a_acceptance",
  "title": "坦然接受",
  "atmosphere": { "time": "黎明", "weather": "晴朗", "mood": "平静" },
  "texts": [
    { "content": "你深吸一口气，坦然接受了这一切。", "delay": 0 },
    { "content": "裂缝在你面前展开，像一扇通往未知的门。你没有犹豫，迈步走了进去。", "delay": 1500 },
    { "content": "光芒包围了你。你感到一种从未有过的平静。", "delay": 2000 },
    { "content": "当你再次睁开眼睛，你站在一个宁静的山间小镇前。", "delay": 2000 },
    { "content": "——第一章·完——", "delay": 1500 }
  ],
  "choices": [
    {
      "text": "继续旅途",
      "target": "chapter2a:01_town_gate",
      "effects": { "experience": 3 },
      "condition": null
    }
  ],
  "onEnter": [],
  "onExit": []
}
```

- [ ] **Step 2: 验证JSON格式**

```bash
python3 -c "import json; json.load(open('story/chapter1/scenes/12a_acceptance.json')); print('✓ Valid')"
```

- [ ] **Step 3: Commit**

```bash
git add story/chapter1/scenes/12a_acceptance.json
git commit -m "feat(chapter1): add acceptance ending scene"
```

---

## Task 3: 创建 Chapter 1 犹豫结局场景

**Files:**
- Create: `story/chapter1/scenes/12b_hesitation.json`

- [ ] **Step 1: 创建犹豫结局场景**

```json
{
  "id": "12b_hesitation",
  "title": "犹豫不决",
  "atmosphere": { "time": "黄昏", "weather": "迷雾", "mood": "迷茫" },
  "texts": [
    { "content": "你站在裂缝前，犹豫不决。", "delay": 0 },
    { "content": "进去？还是不进去？你不知道。", "delay": 1500 },
    { "content": "裂缝似乎在召唤你，又似乎在警告你。", "delay": 2000 },
    { "content": "最终，你还是迈出了那一步。不是因为勇气，而是因为别无选择。", "delay": 2000 },
    { "content": "当你再次睁开眼睛，你站在一片迷雾笼罩的森林边缘。", "delay": 2000 },
    { "content": "——第一章·完——", "delay": 1500 }
  ],
  "choices": [
    {
      "text": "继续旅途",
      "target": "chapter2b:01_forest_edge",
      "effects": { "experience": 3 },
      "condition": null
    }
  ],
  "onEnter": [],
  "onExit": []
}
```

- [ ] **Step 2: 验证JSON格式**

```bash
python3 -c "import json; json.load(open('story/chapter1/scenes/12b_hesitation.json')); print('✓ Valid')"
```

- [ ] **Step 3: Commit**

```bash
git add story/chapter1/scenes/12b_hesitation.json
git commit -m "feat(chapter1): add hesitation ending scene"
```

---

## Task 4: 创建 Chapter 1 抗拒结局场景

**Files:**
- Create: `story/chapter1/scenes/12c_resistance.json`

- [ ] **Step 1: 创建抗拒结局场景**

```json
{
  "id": "12c_resistance",
  "title": "抗拒命运",
  "atmosphere": { "time": "夜晚", "weather": "狂风", "mood": "愤怒" },
  "texts": [
    { "content": "你转身想要离开。你不想进去，你不想接受这个命运。", "delay": 0 },
    { "content": "但裂缝不会让你走。一股无形的力量把你推了进去。", "delay": 1500 },
    { "content": "你挣扎，你反抗，但一切都是徒劳。", "delay": 2000 },
    { "content": "当你再次睁开眼睛，你站在一片战火纷飞的边关。", "delay": 2000 },
    { "content": "——第一章·完——", "delay": 1500 }
  ],
  "choices": [
    {
      "text": "继续旅途",
      "target": "chapter2c:01_arrival",
      "effects": { "experience": 3 },
      "condition": null
    }
  ],
  "onEnter": [],
  "onExit": []
}
```

- [ ] **Step 2: 验证JSON格式**

```bash
python3 -c "import json; json.load(open('story/chapter1/scenes/12c_resistance.json')); print('✓ Valid')"
```

- [ ] **Step 3: Commit**

```bash
git add story/chapter1/scenes/12c_resistance.json
git commit -m "feat(chapter1): add resistance ending scene"
```

---

## Task 5: 创建 Chapter 2a 数据文件

**Files:**
- Create: `story/chapter2a/meta.json`
- Create: `story/chapter2a/npcs.json`
- Create: `story/chapter2a/items.json`
- Create: `story/chapter2a/skeleton.json`

- [ ] **Step 1: 创建 meta.json**

```json
{
  "id": "chapter2a",
  "title": "山间小镇",
  "description": "坦然接受命运后，渡途人来到一个宁静的山间小镇",
  "sceneCount": 12,
  "startScene": "01_town_gate",
  "randomized": true
}
```

- [ ] **Step 2: 创建 npcs.json**

```json
{
  "npcs": [
    {
      "id": "old_mayor",
      "name": "老镇长",
      "identity": "镇上长者，睿智沉稳",
      "personality": "温和、有耐心、善于倾听",
      "dialogueStyle": "缓慢、沉稳、富有哲理",
      "dialogues": {
        "greeting": "\"年轻人，你来了。\"老镇长看着你，眼里带着笑意。",
        "reveal": "\"这镇子啊，有太多故事了。\"",
        "gift": "\"拿着吧，这是镇上的特产。\""
      }
    },
    {
      "id": "herbalist",
      "name": "药铺掌柜",
      "identity": "开药铺的商人，精通药理",
      "personality": "谨慎、细心、有些固执",
      "dialogueStyle": "专业、详细、偶尔唠叨",
      "dialogues": {
        "greeting": "\"要买药吗？\"药铺掌柜抬起头，推了推眼镜。",
        "reveal": "\"这山里的药材，可都是宝贝。\"",
        "gift": "\"这副药你拿着，以备不时之需。\""
      }
    },
    {
      "id": "hunter",
      "name": "猎户",
      "identity": "山中猎人，熟悉山路",
      "personality": "豪爽、直率、重义气",
      "dialogueStyle": "粗犷、直接、偶尔幽默",
      "dialogues": {
        "greeting": "\"嘿！你是新来的？\"猎户大声问道。",
        "reveal": "\"山里的事，我最清楚。\"",
        "gift": "\"拿着这把弓，防身用。\""
      }
    },
    {
      "id": "teacher",
      "name": "教书先生",
      "identity": "私塾老师，博学多才",
      "personality": "严谨、认真、有些迂腐",
      "dialogueStyle": "文雅、引经据典",
      "dialogues": {
        "greeting": "\"有朋自远方来，不亦乐乎？\"教书先生拱手行礼。",
        "reveal": "\"这镇上的历史，都在书里记载着。\"",
        "gift": "\"这本书送你，望你勤学不辍。\""
      }
    },
    {
      "id": "teahouse_owner",
      "name": "茶馆老板娘",
      "identity": "经营茶馆，消息灵通",
      "personality": "热情、健谈、善于察言观色",
      "dialogueStyle": "热情、亲切、话多",
      "dialogues": {
        "greeting": "\"客官，进来喝杯茶吧！\"老板娘热情地招呼。",
        "reveal": "\"我这茶馆啊，什么消息都能听到。\"",
        "gift": "\"这茶叶你拿着，路上喝。\""
      }
    },
    {
      "id": "traveling_doctor",
      "name": "游方郎中",
      "identity": "流浪医者，医术高明",
      "personality": "神秘、寡言、心地善良",
      "dialogueStyle": "简短、含蓄、偶尔深奥",
      "dialogues": {
        "greeting": "\"你身体可好？\"游方郎中看了你一眼。",
        "reveal": "\"病从心生，药从心来。\"",
        "gift": "\"这药方你收好，日后或许用得上。\""
      }
    },
    {
      "id": "woodcutter",
      "name": "樵夫",
      "identity": "砍柴为生，勤劳朴实",
      "personality": "老实、勤劳、话不多",
      "dialogueStyle": "简单、直接、朴实",
      "dialogues": {
        "greeting": "\"嗯。\"樵夫点点头，继续砍柴。",
        "reveal": "\"山上的事，我知道一些。\"",
        "gift": "\"这柴你拿着，晚上取暖。\""
      }
    },
    {
      "id": "traveler",
      "name": "旅人",
      "identity": "路过的旅人，见多识广",
      "personality": "开朗、健谈、喜欢交朋友",
      "dialogueStyle": "热情、有趣、故事多",
      "dialogues": {
        "greeting": "\"你好啊！我也是旅人。\"他热情地打招呼。",
        "reveal": "\"我走过很多地方，见过很多事。\"",
        "gift": "\"这地图送你，或许对你有用。\""
      }
    }
  ]
}
```

- [ ] **Step 3: 创建 items.json**

```json
{
  "items": [
    {
      "id": "ginseng",
      "name": "山参",
      "description": "珍贵的山中人参，有滋补功效",
      "effects": { "setFlag": "has_ginseng" }
    },
    {
      "id": "tea",
      "name": "茶叶",
      "description": "当地特产的高山茶叶",
      "effects": { "setFlag": "has_tea" }
    },
    {
      "id": "hunting_bow",
      "name": "猎弓",
      "description": "猎户常用的弓箭",
      "effects": { "setFlag": "has_bow" }
    },
    {
      "id": "ancient_book",
      "name": "古书",
      "description": "教书先生珍藏的古籍",
      "effects": { "setFlag": "has_book" }
    },
    {
      "id": "prescription",
      "name": "药方",
      "description": "治疗疑难杂症的药方",
      "effects": { "setFlag": "has_prescription" }
    },
    {
      "id": "mountain_map",
      "name": "山路图",
      "description": "详细的山中路线图",
      "effects": { "setFlag": "has_map" }
    }
  ]
}
```

- [ ] **Step 4: 创建 skeleton.json**

```json
{
  "scenes": [
    { "id": "01_town_gate", "npcSlots": ["slot_1"], "itemSlots": [] },
    { "id": "02_main_street", "npcSlots": ["slot_2"], "itemSlots": ["slot_a"] },
    { "id": "03_teahouse", "npcSlots": ["slot_3"], "itemSlots": [] },
    { "id": "04_medicine_shop", "npcSlots": ["slot_4"], "itemSlots": ["slot_b"] },
    { "id": "05_school", "npcSlots": ["slot_5"], "itemSlots": [] },
    { "id": "06_hunting_lodge", "npcSlots": ["slot_6"], "itemSlots": ["slot_c"] },
    { "id": "07_mountain_path", "npcSlots": ["slot_7"], "itemSlots": [] },
    { "id": "08_night_town", "npcSlots": ["slot_8"], "itemSlots": ["slot_d"] },
    { "id": "09_truth_revealed", "npcSlots": [], "itemSlots": [] },
    { "id": "10a_stay", "npcSlots": [], "itemSlots": [] },
    { "id": "10b_leave", "npcSlots": [], "itemSlots": [] },
    { "id": "10c_explore", "npcSlots": [], "itemSlots": [] }
  ],
  "npcSlots": {
    "slot_1": { "candidates": ["old_mayor", "hunter"] },
    "slot_2": { "candidates": ["herbalist", "teahouse_owner"] },
    "slot_3": { "candidates": ["teahouse_owner", "traveler"] },
    "slot_4": { "candidates": ["herbalist", "traveling_doctor"] },
    "slot_5": { "candidates": ["teacher", "old_mayor"] },
    "slot_6": { "candidates": ["hunter", "woodcutter"] },
    "slot_7": { "candidates": ["woodcutter", "traveler"] },
    "slot_8": { "candidates": ["traveling_doctor", "teahouse_owner"] }
  },
  "itemSlots": {
    "slot_a": { "candidates": ["tea", "mountain_map"] },
    "slot_b": { "candidates": ["ginseng", "prescription"] },
    "slot_c": { "candidates": ["hunting_bow", "ancient_book"] },
    "slot_d": { "candidates": ["prescription", "mountain_map"] }
  }
}
```

- [ ] **Step 5: 验证所有JSON文件**

```bash
for f in story/chapter2a/*.json; do python3 -c "import json; json.load(open('$f')); print('✓ $f')" 2>&1 || echo "✗ $f"; done
```

- [ ] **Step 6: Commit**

```bash
git add story/chapter2a/
git commit -m "feat(chapter2a): create mountain town chapter data files"
```

---

## Task 6: 创建 Chapter 2a 场景模板

**Files:**
- Create: `story/chapter2a/templates/` (12个场景模板)

- [ ] **Step 1: 创建目录**

```bash
mkdir -p story/chapter2a/templates
```

- [ ] **Step 2: 创建 01_town_gate.json**

```json
{
  "id": "01_town_gate",
  "title": "镇口",
  "atmosphere": { "time": "黄昏", "weather": "晴朗", "mood": "宁静" },
  "texts": [
    { "content": "你站在一座山间小镇的入口。镇子不大，但很整洁。", "delay": 0 },
    { "content": "青石板路蜿蜒向前，两旁是低矮的房屋。远处传来鸡鸣狗吠的声音。", "delay": 2000 },
    { "content": "{{NPC_SLOT_1:greeting}}", "delay": 1500 },
    { "content": "是{{NPC_SLOT_1:name}}。{{NPC_SLOT_1:identity}}。", "delay": 1000 },
    { "content": "{{NPC_SLOT_1:reveal}}", "delay": 2000 }
  ],
  "choices": [
    {
      "text": "\"我想在这里休息一下。\"",
      "target": "03_teahouse",
      "effects": { "mood": "平静" },
      "condition": null
    },
    {
      "text": "\"我想四处看看。\"",
      "target": "02_main_street",
      "effects": { "wisdom": 1 },
      "condition": null
    }
  ],
  "onEnter": [],
  "onExit": []
}
```

- [ ] **Step 3: 创建其余11个场景模板**

按照设计文档中的场景骨架，创建以下模板：
- 02_main_street.json
- 03_teahouse.json
- 04_medicine_shop.json
- 05_school.json
- 06_hunting_lodge.json
- 07_mountain_path.json
- 08_night_town.json
- 09_truth_revealed.json
- 10a_stay.json
- 10b_leave.json
- 10c_explore.json

每个模板都使用 `{{NPC_SLOT_N:field}}` 和 `{{ITEM_SLOT_X:field}}` 占位符。

- [ ] **Step 4: 验证所有场景模板**

```bash
for f in story/chapter2a/templates/*.json; do python3 -c "import json; json.load(open('$f')); print('✓ $f')" 2>&1 || echo "✗ $f"; done
```

- [ ] **Step 5: Commit**

```bash
git add story/chapter2a/templates/
git commit -m "feat(chapter2a): add scene templates for mountain town"
```

---

## Task 7: 创建 Chapter 2b 数据文件

**Files:**
- Create: `story/chapter2b/meta.json`
- Create: `story/chapter2b/npcs.json`
- Create: `story/chapter2b/items.json`
- Create: `story/chapter2b/skeleton.json`

- [ ] **Step 1: 创建 meta.json**

```json
{
  "id": "chapter2b",
  "title": "迷雾森林",
  "description": "犹豫不决中，渡途人走入一片迷雾笼罩的森林",
  "sceneCount": 12,
  "startScene": "01_forest_edge",
  "randomized": true
}
```

- [ ] **Step 2: 创建 npcs.json (8个NPC)**

按照设计文档创建守林人、采药女、迷路书生、猎人、木匠、神婆、偷猎者、精灵的NPC数据。

- [ ] **Step 3: 创建 items.json (6个物品)**

按照设计文档创建灵芝、罗盘、荧光石、树皮画、兽皮、符咒的物品数据。

- [ ] **Step 4: 创建 skeleton.json**

按照设计文档的12个场景创建骨架定义。

- [ ] **Step 5: 验证并Commit**

```bash
for f in story/chapter2b/*.json; do python3 -c "import json; json.load(open('$f')); print('✓ $f')" 2>&1 || echo "✗ $f"; done
git add story/chapter2b/
git commit -m "feat(chapter2b): create misty forest chapter data files"
```

---

## Task 8: 创建 Chapter 2b 场景模板

**Files:**
- Create: `story/chapter2b/templates/` (12个场景模板)

- [ ] **Step 1: 创建目录并创建所有场景模板**

```bash
mkdir -p story/chapter2b/templates
```

创建12个场景模板文件。

- [ ] **Step 2: 验证并Commit**

```bash
for f in story/chapter2b/templates/*.json; do python3 -c "import json; json.load(open('$f')); print('✓ $f')" 2>&1 || echo "✗ $f"; done
git add story/chapter2b/templates/
git commit -m "feat(chapter2b): add scene templates for misty forest"
```

---

## Task 9: 创建 Chapter 2c 数据文件

**Files:**
- Create: `story/chapter2c/meta.json`
- Create: `story/chapter2c/npcs.json`
- Create: `story/chapter2c/items.json`
- Create: `story/chapter2c/skeleton.json`

- [ ] **Step 1: 创建 meta.json**

```json
{
  "id": "chapter2c",
  "title": "战火边关",
  "description": "试图抗拒命运后，渡途人被推入战火纷飞的边关",
  "sceneCount": 12,
  "startScene": "01_arrival",
  "randomized": true
}
```

- [ ] **Step 2: 创建 npcs.json (8个NPC)**

按照设计文档创建将军、士兵、难民、商人、医者、间谍、老兵、将军遗孀的NPC数据。

- [ ] **Step 3: 创建 items.json (6个物品)**

按照设计文档创建军令、伤药、家书、地图、军牌、粮食的物品数据。

- [ ] **Step 4: 创建 skeleton.json**

按照设计文档的12个场景创建骨架定义。

- [ ] **Step 5: 验证并Commit**

```bash
for f in story/chapter2c/*.json; do python3 -c "import json; json.load(open('$f')); print('✓ $f')" 2>&1 || echo "✗ $f"; done
git add story/chapter2c/
git commit -m "feat(chapter2c): create border war chapter data files"
```

---

## Task 10: 创建 Chapter 2c 场景模板

**Files:**
- Create: `story/chapter2c/templates/` (12个场景模板)

- [ ] **Step 1: 创建目录并创建所有场景模板**

```bash
mkdir -p story/chapter2c/templates
```

创建12个场景模板文件。

- [ ] **Step 2: 验证并Commit**

```bash
for f in story/chapter2c/templates/*.json; do python3 -c "import json; json.load(open('$f')); print('✓ $f')" 2>&1 || echo "✗ $f"; done
git add story/chapter2c/templates/
git commit -m "feat(chapter2c): add scene templates for border war"
```

---

## Task 11: 删除旧 Chapter 2 文件

**Files:**
- Delete: `story/chapter2/` (整个目录)

- [ ] **Step 1: 备份并删除**

```bash
# 确认新文件已创建
ls -la story/chapter2a/ story/chapter2b/ story/chapter2c/

# 删除旧目录
rm -rf story/chapter2/
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "refactor: remove old chapter2 directory, replaced by chapter2a/b/c"
```

---

## Task 12: 最终验证

- [ ] **Step 1: 验证所有新章节的JSON文件**

```bash
for chapter in chapter2a chapter2b chapter2c; do
  echo "=== $chapter ==="
  for f in story/$chapter/*.json story/$chapter/templates/*.json; do
    python3 -c "import json; json.load(open('$f')); print('✓ $f')" 2>&1 || echo "✗ $f"
  done
done
```

- [ ] **Step 2: 验证Chapter 1修改**

```bash
python3 -c "import json; json.load(open('story/chapter1/scenes/11_mountain_peak.json')); print('✓ Valid')"
python3 -c "import json; json.load(open('story/chapter1/scenes/12a_acceptance.json')); print('✓ Valid')"
python3 -c "import json; json.load(open('story/chapter1/scenes/12b_hesitation.json')); print('✓ Valid')"
python3 -c "import json; json.load(open('story/chapter1/scenes/12c_resistance.json')); print('✓ Valid')"
```

- [ ] **Step 3: Push to GitHub**

```bash
git push
```

---

## 后续计划

Phase 2: 创建 Chapter 3 变体 (9个)
Phase 3: 创建 Chapter 4 变体 (27个)

每个Phase使用单独的实现计划文档。
