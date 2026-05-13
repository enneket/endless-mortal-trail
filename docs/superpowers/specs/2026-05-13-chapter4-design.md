# 第四章「烟雨镇」设计文档

> 日期：2026-05-13
> 状态：设计完成，待实现

## 一、概述

第四章是「人间无尽途」随机生成系统的第三次实现。渡途人踏入第四个人间——江南水乡烟雨镇。小镇上恩怨纠葛，世仇与报恩交织。骨架固定，NPC 和物品从池中随机抽取，每次游玩体验不同。

### 核心决策

- **创作方式：** 随机生成（骨架固定 + NPC/物品随机）
- **主题：** 江南水乡——烟雨、古镇、恩怨情仇
- **场景规模：** 12 个骨架节点
- **NPC 池：** 8 个，每次随机抽取 4 个
- **物品池：** 6 个，随机抽取 4 个
- **状态继承：** 第三章的物品/标记/属性影响第四章开局

---

## 二、随机生成系统

### 生成流程

1. 玩家从第三章结束进入第四章
2. 引擎加载第四章骨架（12 个固定节点）
3. 从 NPC 池（8 个）中随机抽取 4 个，分配到骨架的 NPC 槽位
4. 从物品池（6 个）中随机抽取 4 个，分配到探索路径节点
5. 根据第三章继承的状态，调整开局文本和可选项
6. 运行时动态组装场景 JSON（骨架 + NPC 数据 + 物品数据）

### 数据结构

#### 骨架定义 `story/chapter4/skeleton.json`

```json
{
  "chapterId": "chapter4",
  "title": "烟雨镇",
  "startScene": "01_dock",
  "npcSlots": {
    "slot_1": { "candidates": ["old_boatman", "blind_fortune"], "scene": "02_old_street" },
    "slot_2": { "candidates": ["medicine_owner", "scholar"], "scene": "03_medicine_shop" },
    "slot_3": { "candidates": ["fishing_girl", "embroiderer"], "scene": "04_riverside" },
    "slot_4": { "candidates": ["storyteller", "blind_fortune"], "scene": "05_teahouse" },
    "slot_5": { "candidates": ["embroiderer", "medicine_owner"], "scene": "06_embroidery_shop" },
    "slot_6": { "candidates": ["enemy_descendant", "old_boatman"], "scene": "07_ancestral_hall" },
    "slot_7": { "candidates": ["scholar", "fishing_girl"], "scene": "07_ancestral_hall" },
    "slot_8": { "candidates": ["storyteller", "enemy_descendant"], "scene": "07_ancestral_hall" }
  },
  "itemSlots": {
    "slot_a": { "candidates": ["old_letter", "tea_tin"], "scene": "05_teahouse" },
    "slot_b": { "candidates": ["jade_pendant", "medicine_pack"], "scene": "06_embroidery_shop" },
    "slot_c": { "candidates": ["fishing_net", "opera_mask"], "scene": "07_ancestral_hall" },
    "slot_d": { "candidates": ["old_letter", "jade_pendant"], "scene": "07_ancestral_hall" }
  },
  "scenes": [
    "01_dock",
    "02_old_street",
    "03_medicine_shop",
    "04_riverside",
    "05_teahouse",
    "06_embroidery_shop",
    "07_ancestral_hall",
    "08_opera_stage",
    "09_truth_revealed",
    "10a_mediate",
    "10b_revenge",
    "10c_leave"
  ]
}
```

#### NPC 池 `story/chapter4/npcs.json`

```json
{
  "old_boatman": {
    "id": "old_boatman",
    "name": "老船夫",
    "identity": "在烟雨镇摆渡三十年的老艄公",
    "personality": "沉默寡言、看透世事、偶尔感慨",
    "dialogueStyle": "缓慢、简短、带着水乡口音",
    "dialogues": {
      "greeting": "上船吧。这河，我渡了三十年了。",
      "reveal": "镇上的事……我都知道。但我不说。",
      "gift": "这船桨跟了我很多年了。你拿着，兴许有用。"
    }
  },
  "embroiderer": {
    "id": "embroiderer",
    "name": "绣娘",
    "identity": "绣坊主人，手艺精湛，绣品远近闻名",
    "personality": "温柔、心思细腻、藏着心事",
    "dialogueStyle": "轻声细语、偶尔停顿、欲言又止",
    "dialogues": {
      "greeting": "客官要绣点什么？还是……只是来看看？",
      "reveal": "我绣的每一针，都是在等一个人。",
      "gift": "这方帕子……是我绣的。你带着吧。"
    }
  },
  "medicine_owner": {
    "id": "medicine_owner",
    "name": "药铺掌柜",
    "identity": "药铺老板，知晓镇上所有秘辛",
    "personality": "精明、守口如瓶、内心有愧",
    "dialogueStyle": "慢条斯理、话里有话、偶尔叹息",
    "dialogues": {
      "greeting": "抓药？还是……打听什么事？",
      "reveal": "当年的事……我也有份。但我不能说。",
      "gift": "这包药……能治百病。你留着吧。"
    }
  },
  "scholar": {
    "id": "scholar",
    "name": "落魄书生",
    "identity": "屡试不第的穷书生，寄居在镇上",
    "personality": "傲气、怀才不遇、心有不甘",
    "dialogueStyle": "文绉绉、引经据典、偶尔激昂",
    "dialogues": {
      "greeting": "兄台也是来避雨的？这烟雨镇，雨多。",
      "reveal": "我写了一篇赋，是关于这镇上的冤屈。",
      "gift": "这本手稿……是我写的。你看看吧。"
    }
  },
  "fishing_girl": {
    "id": "fishing_girl",
    "name": "渔家女",
    "identity": "以打鱼为生的姑娘，水性极好",
    "personality": "泼辣、心地善良、嘴硬心软",
    "dialogueStyle": "直爽、带着水乡口音、偶尔害羞",
    "dialogues": {
      "greeting": "买鱼？今天打的鱼新鲜着呢！",
      "reveal": "我爹……就是被他们害死的。",
      "gift": "这渔网……是我爹留下的。你拿着吧。"
    }
  },
  "blind_fortune": {
    "id": "blind_fortune",
    "name": "算命瞎子",
    "identity": "街头算命的盲人，来历不明",
    "personality": "神秘、说话半真半假、似乎能看见什么",
    "dialogueStyle": "缓慢、玄妙、偶尔惊人",
    "dialogues": {
      "greeting": "我虽看不见，但我能感觉到你。",
      "reveal": "这镇上的恩怨……三十年了。该了结了。",
      "gift": "这签筒……你摇一支吧。"
    }
  },
  "storyteller": {
    "id": "storyteller",
    "name": "茶楼说书人",
    "identity": "茶楼里讲古的先生，知道很多旧事",
    "personality": "诙谐、暗藏玄机、真假难辨",
    "dialogueStyle": "说书腔、抑扬顿挫、偶尔压低声音",
    "dialogues": {
      "greeting": "来来来，坐，听我讲一段古。",
      "reveal": "我讲的不是故事……是真事。",
      "gift": "这把折扇……是当年说书用的。你拿着。"
    }
  },
  "enemy_descendant": {
    "id": "enemy_descendant",
    "name": "仇家后人",
    "identity": "世仇家族的后代，背负着祖辈的恩怨",
    "personality": "压抑、渴望和解、又放不下仇恨",
    "dialogueStyle": "低沉、矛盾、偶尔激动",
    "dialogues": {
      "greeting": "你……不是本地人吧？",
      "reveal": "我恨他们。但我也恨这仇恨。",
      "gift": "这封信……是我爷爷留下的。你看看吧。"
    }
  }
}
```

#### 物品池 `story/chapter4/items.json`

```json
{
  "old_letter": {
    "id": "old_letter",
    "name": "泛黄家书",
    "description": "一封褪色的信，纸张已经发脆。上面的字迹模糊，但依稀能辨认出当年的真相。",
    "effects": { "setFlag": "has_old_letter" }
  },
  "jade_pendant": {
    "id": "jade_pendant",
    "name": "碎玉佩",
    "description": "一枚断裂的玉佩，只剩半边。断口处隐约有血迹。另一半不知在谁手中。",
    "effects": { "setFlag": "has_jade_pendant" }
  },
  "medicine_pack": {
    "id": "medicine_pack",
    "name": "药包",
    "description": "一包罕见的药材，散发着淡淡的草药香。据说能治百病，也能解百毒。",
    "effects": { "setFlag": "has_medicine_pack" }
  },
  "fishing_net": {
    "id": "fishing_net",
    "name": "渔网",
    "description": "一张修补过无数次的旧渔网。网上打着各种各样的结，每一个结都是一个故事。",
    "effects": { "setFlag": "has_fishing_net" }
  },
  "opera_mask": {
    "id": "opera_mask",
    "name": "戏面具",
    "description": "一个精致的戏曲面具，半边笑脸半边哭脸。喜怒哀乐，尽在一面。",
    "effects": { "setFlag": "has_opera_mask" }
  },
  "tea_tin": {
    "id": "tea_tin",
    "name": "老茶罐",
    "description": "一罐陈年老茶，封口处已经泛黄。打开盖子，茶香扑鼻，似乎藏着什么秘密。",
    "effects": { "setFlag": "has_tea_tin" }
  }
}
```

---

## 三、场景骨架

### 场景流程图

```
01_dock (渡口)
    │  从第三章的轮回中走出，踏入江南水乡
    │
    ├──→ 02_old_street (老街) ──→ 05_teahouse (茶楼)
    │    [NPC槽位1]                    [NPC槽位4] [物品槽位A]
    │
    ├──→ 03_medicine_shop (药铺) ──→ 06_embroidery_shop (绣坊)
    │    [NPC槽位2]                    [NPC槽位5] [物品槽位B]
    │
    └──→ 04_riverside (河畔) ──→ 07_ancestral_hall (祠堂)
         [NPC槽位3]                    [NPC槽位6] [物品槽位C]
                                       [NPC槽位7] [物品槽位D]
                                            │
                              08_opera_stage (戏台)
                                   [说书人·固定]
                                            │
                              09_truth_revealed (真相大白)
                                            │
                        ┌───────────────────┼───────────────────┐
                   10a_mediate         10b_revenge         10c_leave
                   (调解恩怨)          (报仇雪恨)          (离开烟雨镇)
```

### 各节点概要

| 节点 | 标题 | 核心内容 | NPC/物品 |
|------|------|----------|----------|
| 01 | 渡口 | 从第三章的轮回中走出，踏上江南水乡的土地 | 无（根据继承状态变化） |
| 02 | 老街 | 烟雨镇的老街，青石板路，两旁是百年老店 | [NPC槽位1] |
| 03 | 药铺 | 飘着草药香的药铺，掌柜似乎知道很多 | [NPC槽位2] |
| 04 | 河畔 | 烟雨蒙蒙的河畔，有人在洗衣，有人在打鱼 | [NPC槽位3] |
| 05 | 茶楼 | 热闹的茶楼，说书人在讲古 | [NPC槽位4] [物品槽位A] |
| 06 | 绣坊 | 安静的绣坊，绣娘在绣一幅未完成的绣品 | [NPC槽位5] [物品槽位B] |
| 07 | 祠堂 | 古老的祠堂，墙上挂着泛黄的族谱 | [NPC槽位6] [物品槽位C] [NPC槽位7] [物品槽位D] |
| 08 | 戏台 | 镇上的戏台，说书人在这里讲述镇上的旧事 | 说书人（固定） |
| 09 | 真相大白 | 在戏台前听到真相，玩家必须做出选择 | 无 |
| 10a | 调解恩怨 | 化解世仇，小镇重归平静 | 结局 |
| 10b | 报仇雪恨 | 帮助一方复仇，恩怨更深 | 结局 |
| 10c | 离开烟雨镇 | 不介入纷争，继续漂泊 | 结局 |

### 结局分支条件

- **调解恩怨（10a）：** 需要 `has_flag: reconciled`（在探索中表达过和解意愿）
- **报仇雪恨（10b）：** 需要 `has_flag: sided`（在探索中选择过站队）
- **离开烟雨镇（10c）：** 默认结局，无特殊条件

---

## 四、状态继承

### 从第三章继承的数据

| 数据类型 | 影响 |
|----------|------|
| `stats.mood` | 影响 01_dock 的开局文本基调 |
| `items.meng_po_soup` | 影响 08_opera_stage 中说书人的额外对话 |
| `items.past_token` | 在 07_ancestral_hall 中可触发隐藏选项 |
| `flags.has_forget_river_water` | 影响 09_truth_revealed 中的旁白 |
| `flags.has_reincarnation_pearl` | 影响 01_dock 的开局氛围描写 |

### 开局文本变体

01_dock 根据继承状态有 3 种开局变体：
- **心境平和（mood=淡然）：** 平静地踏上江南水乡
- **心境好奇（mood=好奇）：** 充满探索欲地进入小镇
- **心境桀骜（mood=桀骜）：** 无所畏惧地闯入烟雨镇

---

## 五、引擎扩展需求

### 不需要改动的部分

- SceneAssembler（组装器已支持任意章节）
- Renderer（打字机渲染不变）
- SaveManager（存档格式不变）
- GameState（已支持 flags、items、stats）
- story-engine（已支持 randomized 章节）

### 唯一改动

- `story/chapter3/templates/` 中的结局场景需要添加 `chapter4:01_dock` target 格式，实现第三章到第四章的跳转

---

## 六、文件结构

```
story/chapter4/
├── meta.json              # 章节元数据
├── skeleton.json          # 骨架定义（节点、NPC槽位、物品槽位）
├── npcs.json              # NPC 池（8个）
├── items.json             # 物品池（6个）
└── templates/             # 场景文本模板
    ├── 01_dock.json       # 开局模板（含状态变体）
    ├── 02_old_street.json
    ├── ...
    └── 10c_leave.json
```
