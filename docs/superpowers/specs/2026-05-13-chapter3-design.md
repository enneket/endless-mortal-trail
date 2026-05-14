# 第三章「潮汐村」设计文档

> 日期：2026-05-14
> 状态：设计完成，替换原「幽冥渡」

## 一、概述

第三章是「人间无尽途」随机生成系统的第二次实现。渡途人踏入第三个人间——海岛渔村潮汐村。渔场争夺、家族世仇、外来者闯入，恩怨纠葛。骨架固定，NPC 和物品从池中随机抽取，每次游玩体验不同。

### 核心决策

- **创作方式：** 随机生成（骨架固定 + NPC/物品随机）
- **主题：** 海岛渔村——潮汐、渔场、恩怨情仇
- **场景规模：** 12 个骨架节点
- **NPC 池：** 8 个，每次随机抽取 4 个
- **物品池：** 6 个，随机抽取 4 个
- **状态继承：** 第二章的物品/标记/属性影响第三章开局

---

## 二、随机生成系统

### 生成流程

1. 玩家从第二章结束进入第三章
2. 引擎加载第三章骨架（12 个固定节点）
3. 从 NPC 池（8 个）中随机抽取 4 个，分配到骨架的 NPC 槽位
4. 从物品池（6 个）中随机抽取 4 个，分配到探索路径节点
5. 根据第二章继承的状态，调整开局文本和可选项
6. 运行时动态组装场景 JSON（骨架 + NPC 数据 + 物品数据）

### 数据结构

#### 骨架定义 `story/chapter3/skeleton.json`

```json
{
  "chapterId": "chapter3",
  "title": "潮汐村",
  "startScene": "01_dock",
  "npcSlots": {
    "slot_1": { "candidates": ["old_fisher", "outsider"], "scene": "02_fishing_port" },
    "slot_2": { "candidates": ["shipwright", "seafood_merchant"], "scene": "03_shipyard" },
    "slot_3": { "candidates": ["fishing_girl", "shaman"], "scene": "04_beach" },
    "slot_4": { "candidates": ["village_chief", "outsider"], "scene": "05_tavern" },
    "slot_5": { "candidates": ["shaman", "old_fisher"], "scene": "06_temple" },
    "slot_6": { "candidates": ["pirate_descendant", "shipwright"], "scene": "07_lighthouse" },
    "slot_7": { "candidates": ["fishing_girl", "seafood_merchant"], "scene": "07_lighthouse" },
    "slot_8": { "candidates": ["village_chief", "pirate_descendant"], "scene": "07_lighthouse" }
  },
  "itemSlots": {
    "slot_a": { "candidates": ["old_compass", "shell_flute"], "scene": "05_tavern" },
    "slot_b": { "candidates": ["pearl", "fishing_hook"], "scene": "06_temple" },
    "slot_c": { "candidates": ["sea_map", "anchor_pendant"], "scene": "07_lighthouse" },
    "slot_d": { "candidates": ["old_compass", "pearl"], "scene": "07_lighthouse" }
  },
  "scenes": [
    "01_dock",
    "02_fishing_port",
    "03_shipyard",
    "04_beach",
    "05_tavern",
    "06_temple",
    "07_lighthouse",
    "08_storm_night",
    "09_truth_revealed",
    "10a_mediate",
    "10b_revenge",
    "10c_leave"
  ]
}
```

#### NPC 池 `story/chapter3/npcs.json`

```json
{
  "old_fisher": {
    "id": "old_fisher",
    "name": "老渔民",
    "identity": "打了一辈子鱼的老渔民",
    "personality": "沉默寡言、看透大海、偶尔感慨",
    "dialogueStyle": "缓慢、简短、带着海腥味",
    "dialogues": {
      "greeting": "又一个外来的。坐吧，喝口茶。",
      "reveal": "这海……我打了一辈子鱼，还是看不透它。",
      "gift": "这罗盘跟了我很多年了。你拿着，兴许有用。"
    }
  },
  "fishing_girl": {
    "id": "fishing_girl",
    "name": "渔家姑娘",
    "identity": "渔民的女儿，水性极好",
    "personality": "泼辣、心地善良、嘴硬心软",
    "dialogueStyle": "直爽、带着海风、偶尔害羞",
    "dialogues": {
      "greeting": "买鱼？今天打的鱼新鲜着呢！",
      "reveal": "我爹……就是被他们害死的。",
      "gift": "这鱼钩……是我爹留下的。你拿着吧。"
    }
  },
  "shipwright": {
    "id": "shipwright",
    "name": "船匠",
    "identity": "造船修船的老师傅",
    "personality": "稳重、手艺精湛、不爱说话",
    "dialogueStyle": "简短、实在、偶尔叹气",
    "dialogues": {
      "greeting": "要修船？还是造船？",
      "reveal": "这村里的船……有一半是我造的。包括那条沉了的。",
      "gift": "这海图……是我年轻时候画的。你留着吧。"
    }
  },
  "seafood_merchant": {
    "id": "seafood_merchant",
    "name": "海鲜商人",
    "identity": "收购海鲜的外地商人",
    "personality": "精明、见利忘义、偶尔流露真情",
    "dialogueStyle": "圆滑、讨价还价、偶尔坦诚",
    "dialogues": {
      "greeting": "客官，要买点什么？鱼？还是虾？",
      "reveal": "我来这村子十年了。还是个外人。",
      "gift": "这夜明珠……是海底捞的。你拿着吧。"
    }
  },
  "village_chief": {
    "id": "village_chief",
    "name": "村长",
    "identity": "渔村的管理者",
    "personality": "威严、左右为难、疲惫",
    "dialogueStyle": "官腔、简短、偶尔叹息",
    "dialogues": {
      "greeting": "你是外来的？报上名来。",
      "reveal": "这村里的事……我管不了了。",
      "gift": "这印章……是村长的信物。你留着吧。"
    }
  },
  "outsider": {
    "id": "outsider",
    "name": "外来旅人",
    "identity": "偶然来到渔村的外人",
    "personality": "好奇、格格不入、渴望融入",
    "dialogueStyle": "生疏、客气、偶尔困惑",
    "dialogues": {
      "greeting": "你好……我也是刚来的。",
      "reveal": "我来这村子三个月了。还是不懂他们的规矩。",
      "gift": "这海螺笛……是我捡的。你拿着吧。"
    }
  },
  "shaman": {
    "id": "shaman",
    "name": "神婆",
    "identity": "能预测风暴的神婆",
    "personality": "神秘、说话含糊、似乎能看见什么",
    "dialogueStyle": "缓慢、玄妙、偶尔惊人",
    "dialogues": {
      "greeting": "我虽看不见，但我能感觉到你。",
      "reveal": "这村子……有风暴要来了。",
      "gift": "这锚形坠子……你戴着吧。能保平安。"
    }
  },
  "pirate_descendant": {
    "id": "pirate_descendant",
    "name": "海盗后人",
    "identity": "海盗的后代，被村民排挤",
    "personality": "压抑、渴望被接纳、又放不下仇恨",
    "dialogueStyle": "低沉、矛盾、偶尔激动",
    "dialogues": {
      "greeting": "你……不是本地人吧？",
      "reveal": "我爷爷是海盗。但我不是。",
      "gift": "这锚形坠子……是我爷爷留下的。你看看吧。"
    }
  }
}
```

#### 物品池 `story/chapter3/items.json`

```json
{
  "old_compass": {
    "id": "old_compass",
    "name": "老罗盘",
    "description": "一个生锈的罗盘，指针始终指向大海深处。据说它能指引迷途的人找到回家的路。",
    "effects": { "setFlag": "has_old_compass" }
  },
  "pearl": {
    "id": "pearl",
    "name": "夜明珠",
    "description": "一颗在黑暗中发光的珍珠，来自深海。据说它能照亮最深的黑暗。",
    "effects": { "setFlag": "has_pearl" }
  },
  "fishing_hook": {
    "id": "fishing_hook",
    "name": "鱼钩",
    "description": "一枚弯曲的鱼钩，据说能钓起任何东西。包括……真相。",
    "effects": { "setFlag": "has_fishing_hook" }
  },
  "sea_map": {
    "id": "sea_map",
    "name": "海图",
    "description": "一张褪色的海图，标注着未知的岛屿。据说那里藏着海盗的宝藏。",
    "effects": { "setFlag": "has_sea_map" }
  },
  "shell_flute": {
    "id": "shell_flute",
    "name": "海螺笛",
    "description": "一个能吹出海浪声的海螺。据说它能召唤海里的生灵。",
    "effects": { "setFlag": "has_shell_flute" }
  },
  "anchor_pendant": {
    "id": "anchor_pendant",
    "name": "锚形坠子",
    "description": "一枚铁锚形状的坠子，沉甸甸的。据说它能让人在风暴中保持镇定。",
    "effects": { "setFlag": "has_anchor_pendant" }
  }
}
```

---

## 三、场景骨架

### 场景流程图

```
01_dock (码头)
    │  从第二章的裂缝中走出，踏上渔村的土地
    │
    ├──→ 02_fishing_port (渔港) ──→ 05_tavern (酒馆)
    │    [NPC槽位1]                    [NPC槽位4] [物品槽位A]
    │
    ├──→ 03_shipyard (船厂) ──→ 06_temple (神庙)
    │    [NPC槽位2]                    [NPC槽位5] [物品槽位B]
    │
    └──→ 04_beach (海滩) ──→ 07_lighthouse (灯塔)
         [NPC槽位3]                    [NPC槽位6] [物品槽位C]
                                       [NPC槽位7] [物品槽位D]
                                            │
                              08_storm_night (风暴夜)
                                   [神婆·固定]
                                            │
                              09_truth_revealed (真相大白)
                                            │
                        ┌───────────────────┼───────────────────┐
                   10a_mediate         10b_revenge         10c_leave
                   (调解恩怨)          (报仇雪恨)          (离开渔村)
```

### 各节点概要

| 节点 | 标题 | 核心内容 | NPC/物品 |
|------|------|----------|----------|
| 01 | 码头 | 从第二章的裂缝中走出，踏上渔村的土地 | 无（根据继承状态变化） |
| 02 | 渔港 | 热闹的渔港，渔船靠岸，鱼贩叫卖 | [NPC槽位1] |
| 03 | 船厂 | 造船修船的地方，木屑纷飞 | [NPC槽位2] |
| 04 | 海滩 | 细软的沙滩，海浪拍岸，有人在捡贝壳 | [NPC槽位3] |
| 05 | 酒馆 | 渔村的酒馆，渔民们在这里喝酒聊天 | [NPC槽位4] [物品槽位A] |
| 06 | 神庙 | 古老的神庙，供奉着海神 | [NPC槽位5] [物品槽位B] |
| 07 | 灯塔 | 海边的灯塔，能看见整个渔村 | [NPC槽位6] [物品槽位C] [NPC槽位7] [物品槽位D] |
| 08 | 风暴夜 | 台风将至，神婆预言灾难 | 神婆（固定） |
| 09 | 真相大白 | 在灯塔前听到真相，玩家必须做出选择 | 无 |
| 10a | 调解恩怨 | 化解渔村恩怨，重归平静 | 结局 |
| 10b | 报仇雪恨 | 帮助一方复仇，恩怨更深 | 结局 |
| 10c | 离开渔村 | 不介入纷争，继续漂泊 | 结局 |

### 结局分支条件

- **调解恩怨（10a）：** 需要 `has_flag: reconciled`（在探索中表达过和解意愿）
- **报仇雪恨（10b）：** 需要 `has_flag: sided`（在探索中选择过站队）
- **离开渔村（10c）：** 默认结局，无特殊条件

---

## 四、状态继承

### 从第二章继承的数据

| 数据类型 | 影响 |
|----------|------|
| `stats.mood` | 影响 01_dock 的开局文本基调 |
| `items.military_tag` | 影响 08_storm_night 中神婆的额外对话 |
| `items.secret_letter` | 在 07_lighthouse 中可触发隐藏选项 |
| `flags.read_stele` | 影响 09_truth_revealed 中的旁白 |
| `flags.has_military_tag` | 影响 01_dock 的开局氛围描写 |

### 开局文本变体

01_dock 根据继承状态有 3 种开局变体：
- **心境平和（mood=淡然）：** 平静地踏上渔村
- **心境好奇（mood=好奇）：** 充满探索欲地进入
- **心境桀骜（mood=桀骜）：** 无所畏惧地闯入

---

## 五、引擎扩展需求

### 不需要改动的部分

- SceneAssembler（组装器已支持任意章节）
- Renderer（打字机渲染不变）
- SaveManager（存档格式不变）
- GameState（已支持 flags、items、stats）
- story-engine（已支持 randomized 章节）

### 唯一改动

- `story/chapter2/templates/` 中的结局场景需要添加 `chapter3:01_dock` target 格式，实现第二章到第三章的跳转

---

## 六、文件结构

```
story/chapter3/
├── meta.json              # 章节元数据
├── skeleton.json          # 骨架定义（节点、NPC槽位、物品槽位）
├── npcs.json              # NPC 池（8个）
├── items.json             # 物品池（6个）
└── templates/             # 场景文本模板
    ├── 01_dock.json       # 开局模板（含状态变体）
    ├── 02_fishing_port.json
    ├── ...
    └── 10c_leave.json
```
