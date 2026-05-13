# 第二章「边关战火」设计文档

> 日期：2026-05-13
> 状态：设计完成，待实现

## 一、概述

第二章是「人间无尽途」随机生成系统的首次实现。渡途人踏入第二个人间——一个战火纷飞的边关。骨架固定，NPC 和物品从池中随机抽取，每次游玩体验不同。

### 核心决策

- **创作方式：** 随机生成（骨架固定 + NPC/物品随机）
- **主题：** 边关战火——战乱、流民、将军遗恨
- **场景规模：** 12 个骨架节点
- **NPC 池：** 6 个，每次随机抽取 3 个
- **物品池：** 5 个，随机分布
- **状态继承：** 第一章的物品/标记/属性影响第二章开局

---

## 二、随机生成系统

### 生成流程

1. 玩家从第一章结束进入第二章
2. 引擎加载第二章骨架（12 个固定节点）
3. 从 NPC 池（6 个）中随机抽取 3 个，分配到骨架的 NPC 槽位
4. 从物品池（5 个）中随机抽取 3 个，分配到探索路径节点
5. 根据第一章继承的状态，调整开局文本和可选项
6. 运行时动态组装场景 JSON（骨架 + NPC 数据 + 物品数据）

### 数据结构

#### 骨架定义 `story/chapter2/skeleton.json`

```json
{
  "chapterId": "chapter2",
  "title": "边关战火",
  "description": "渡途人踏入战火纷飞的边关人间",
  "startScene": "01_arrival",
  "npcSlots": {
    "slot_camp": { "candidates": ["veteran", "refugee_girl"], "scene": "02_camp" },
    "slot_village": { "candidates": ["refugee_girl", "physician"], "scene": "03_village" },
    "slot_fortress": { "candidates": ["strategist", "deserter"], "scene": "04_fortress" },
    "slot_path_a": { "candidates": ["veteran", "deserter"], "scene": "05_path_a" },
    "slot_path_b": { "candidates": ["refugee_girl", "physician"], "scene": "06_path_b" },
    "slot_path_c": { "candidates": ["strategist", "deserter"], "scene": "07_path_c" }
  },
  "itemSlots": {
    "slot_item_a": { "candidates": ["military_tag", "letter_home"], "scene": "05_path_a" },
    "slot_item_b": { "candidates": ["embroidered_pouch", "prescription"], "scene": "06_path_b" },
    "slot_item_c": { "candidates": ["secret_letter", "letter_home"], "scene": "07_path_c" }
  }
}
```

#### NPC 池 `story/chapter2/npcs.json`

```json
{
  "veteran": {
    "id": "veteran",
    "name": "老兵",
    "identity": "断臂老兵，守着废弃烽火台",
    "personality": "沉默、执拗、偶尔爆发",
    "dialogueStyle": "短句，军事术语，偶尔粗犷"
  },
  "refugee_girl": {
    "id": "refugee_girl",
    "name": "流民少女",
    "identity": "逃难路上与家人失散的女孩",
    "personality": "警惕、倔强、内心柔软",
    "dialogueStyle": "简短、方言味、偶尔哽咽"
  },
  "strategist": {
    "id": "strategist",
    "name": "军师",
    "identity": "将军府中的幕僚",
    "personality": "冷静、算计、话中有话",
    "dialogueStyle": "文雅、暗藏机锋、喜欢引用典故"
  },
  "physician": {
    "id": "physician",
    "name": "郎中",
    "identity": "战地赤脚医生",
    "personality": "慈悲、疲惫、苦中作乐",
    "dialogueStyle": "温和、带药理比喻、自嘲"
  },
  "deserter": {
    "id": "deserter",
    "name": "逃兵",
    "identity": "从战场上跑出来的小兵",
    "personality": "恐惧、愧疚、想回家",
    "dialogueStyle": "断续、颤抖、偶尔语无伦次"
  },
  "general_widow": {
    "id": "general_widow",
    "name": "将军遗孀",
    "identity": "已故将军的夫人",
    "personality": "高傲、悲伤、决绝",
    "dialogueStyle": "古雅、克制、偶尔锋利"
  }
}
```

#### 物品池 `story/chapter2/items.json`

```json
{
  "military_tag": {
    "id": "military_tag",
    "name": "军牌",
    "description": "一枚铜制军牌，刻着一个已经模糊的名字。握在手中，能感受到主人最后的执念。",
    "effects": { "setFlag": "has_military_tag" }
  },
  "embroidered_pouch": {
    "id": "embroidered_pouch",
    "name": "绣囊",
    "description": "粗布绣成的香囊，针脚歪斜却用心。里面装着干枯的艾草，是家乡的味道。",
    "effects": { "setFlag": "has_embroidered_pouch" }
  },
  "secret_letter": {
    "id": "secret_letter",
    "name": "密信",
    "description": "一封用暗语写成的信，字迹工整。上面盖着一个你认不出的印章。",
    "effects": { "setFlag": "has_secret_letter" }
  },
  "prescription": {
    "id": "prescription",
    "name": "药方",
    "description": "一张发黄的药方，上面的药名你大多不认识。角落里写着一行小字：'此方可救一人，亦可误一人。'",
    "effects": { "setFlag": "has_prescription" }
  },
  "letter_home": {
    "id": "letter_home",
    "name": "家书",
    "description": "一封没寄出的家书。'娘，孩儿不孝……'后面的字被泪水洇开了。",
    "effects": { "setFlag": "has_letter_home" }
  }
}
```

---

## 三、场景骨架

### 场景流程图

```
01_arrival (初入边关)
    │  继承第一章状态，开局文本因 flags/items 而异
    │
    ├──→ 02_camp (军营残迹) ──→ 05_path_a (烽火台)
    │    [NPC槽位1]                [NPC槽位4] [物品槽位A]
    │
    ├──→ 03_village (战后荒村) ──→ 06_path_b (逃难路)
    │    [NPC槽位2]                [NPC槽位5] [物品槽位B]
    │
    └──→ 04_fortress (将军府) ──→ 07_path_c (暗巷)
         [NPC槽位3]                [NPC槽位6] [物品槽位C]
                                          │
                             08_convergence (汇合)
                                   [将军遗孀·固定]
                                          │
                             09_revelation (真相大白)
                                          │
                        ┌─────────────────┼─────────────────┐
                   10a_departure     10b_stay         10b_resist
                   (离去)            (留下)            (抗争)
```

### 各节点概要

| 节点 | 标题 | 核心内容 | NPC/物品 |
|------|------|----------|----------|
| 01 | 初入边关 | 从第一章的裂缝中走出，踏入战后边关 | 无（根据继承状态变化） |
| 02 | 军营残迹 | 废弃军营，残破旗帜，偶遇第一个NPC | [NPC槽位1] |
| 03 | 战后荒村 | 被战火摧毁的村庄，断壁残垣 | [NPC槽位2] |
| 04 | 将军府 | 空荡的将军府邸，墙上挂着战甲 | [NPC槽位3] |
| 05 | 烽火台 | 荒废的烽火台，远眺边关全景 | [NPC槽位4] [物品槽位A] |
| 06 | 逃难路 | 流民逃难的古道，路有饿殍 | [NPC槽位5] [物品槽位B] |
| 07 | 暗巷 | 城中暗巷，藏着不为人知的秘密 | [NPC槽位6] [物品槽位C] |
| 08 | 汇合 | 三条路径汇合，遇到将军遗孀 | 将军遗孀（固定） |
| 09 | 真相大白 | 战争的真相揭开，玩家必须做出选择 | 无 |
| 10a | 离去 | 离开边关，继续旅途 | 结局 |
| 10b | 留下 | 留在边关，试图做些什么 | 结局 |
| 10c | 抗争 | 挑战命运，试图改变结局 | 结局 |

### 结局分支条件

- **离去（10a）：** 默认结局，无特殊条件
- **留下（10b）：** 需要 `has_flag: sympathized`（在探索中表达过同情）
- **抗争（10c）：** 需要 `has_flag: defied`（在探索中挑战过权威）

---

## 四、状态继承

### 从第一章继承的数据

| 数据类型 | 影响 |
|----------|------|
| `stats.mood` | 影响 01_arrival 的开局文本基调 |
| `items.jade_pendant` | 触发 08_convergence 中将军遗孀的额外对话 |
| `items.old_book` | 在 04_fortress 中可触发军师的隐藏选项 |
| `flags.read_stele` | 影响 09_revelation 中的旁白 |
| `flags.opened_well` | 影响 01_arrival 的开局氛围描写 |

### 开局文本变体

01_arrival 根据继承状态有 3 种开局变体：
- **心境平和（mood=淡然）：** 平静地踏入边关
- **心境好奇（mood=好奇）：** 充满探索欲地进入
- **心境桀骜（mood=桀骜）：** 无所畏惧地闯入

---

## 五、引擎扩展需求

### 新增功能

1. **场景组装器（SceneAssembler）：** 根据骨架 + NPC池 + 物品池，运行时组装完整场景JSON
2. **随机抽取器：** 从池中随机选取 N 个不重复元素
3. **章节切换：** story-engine 支持 `loadChapter('chapter2')` 加载新章节
4. **状态继承：** 跨章节读取 GameState 的 flags/items/stats

### 不需要改动的部分

- Renderer（打字机渲染不变）
- SaveManager（存档格式不变，GameState 已支持所有需要的字段）
- GameState（已支持 flags、items、stats）

---

## 六、文件结构

```
story/chapter2/
├── meta.json              # 章节元数据
├── skeleton.json          # 骨架定义（节点、NPC槽位、物品槽位）
├── npcs.json              # NPC 池（6个）
├── items.json             # 物品池（5个）
├── templates/             # 场景文本模板
│   ├── 01_arrival.json    # 开局模板（含状态变体）
│   ├── 02_camp.json       # 军营模板（含NPC槽位）
│   ├── ...
│   └── 10c_resist.json
└── scenes/                # 运行时生成（不提交到git）
js/engine/
├── scene-assembler.js     # 新增：场景组装器
└── story-engine.js        # 修改：支持章节切换和随机生成
```
