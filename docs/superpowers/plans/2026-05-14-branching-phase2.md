# 分支章节系统 - Phase 2 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 创建 Chapter 3 的9个变体，每个变体包含完整的数据文件和场景模板

**Architecture:** 每个 Chapter 3 变体继承 Chapter 2 的结构模式：meta.json + npcs.json + items.json + skeleton.json + 12个场景模板

**Tech Stack:** JSON数据驱动，SceneAssembler随机生成引擎

---

## Chapter 3 变体列表

| 变体 ID | 来源 | 主题 | 地点 |
|---------|------|------|------|
| chapter3aa | chapter2a 留在小镇 | 隐世与纷争 | 山中村落 |
| chapter3ab | chapter2a 离开小镇 | 旅途与相遇 | 山间古道 |
| chapter3ac | chapter2a 探索深山 | 探索与发现 | 深山密林 |
| chapter3ba | chapter2b 跟随指引 | 信仰与怀疑 | 山间古刹 |
| chapter3bb | chapter2b 继续迷惘 | 迷茫与觉醒 | 迷途荒野 |
| chapter3bc | chapter2b 觉醒 | 清醒与代价 | 灵境之地 |
| chapter3ca | chapter2c 参战 | 战争与牺牲 | 战场前线 |
| chapter3cb | chapter2c 逃离 | 逃亡与新生 | 流亡之路 |
| chapter3cc | chapter2c 谈判 | 和平与代价 | 谈判桌前 |

---

## Task 1: 创建 Chapter 3aa 数据文件 (山中村落)

**Files:**
- Create: `story/chapter3aa/meta.json`
- Create: `story/chapter3aa/npcs.json`
- Create: `story/chapter3aa/items.json`
- Create: `story/chapter3aa/skeleton.json`

- [ ] **Step 1: 创建 meta.json**

```json
{
  "id": "chapter3aa",
  "title": "山中村落",
  "description": "留在小镇后，发现附近山中有个隐秘村落",
  "sceneCount": 12,
  "startScene": "01_village_entrance",
  "randomized": true
}
```

- [ ] **Step 2: 创建 npcs.json (8个NPC)**

NPC池：
1. village_chief (村长) - 山村村长
2. mountain_hunter (猎户) - 村中猎人
3. herb_farmer (药农) - 种药为生
4. blacksmith (铁匠) - 村中铁匠
5. traveling_merchant (外来商人) - 来收购药材
6. hermit (隐士) - 隐居山中的高人
7. village_child (孩童) - 村中儿童
8. mysterious_elder (神秘老人) - 似曾相识

- [ ] **Step 3: 创建 items.json (6个物品)**

物品池：
1. mountain_goods (山货) - 山中特产
2. herbs (药材) - 珍贵草药
3. hunting_tools (猎具) - 猎人工具
4. iron_works (铁器) - 铁匠打造
5. ancient_artifact (古物) - 村中旧物
6. mysterious_letter (信件) - 神秘信件

- [ ] **Step 4: 创建 skeleton.json**

场景骨架 (12个)：
1. 01_village_entrance - 村口 (slot_1, slot_a)
2. 02_village_center - 村中心 (slot_2)
3. 03_hunting_ground - 猎场 (slot_3, slot_b)
4. 04_herb_garden - 药园 (slot_4)
5. 05_blacksmith - 铁匠铺 (slot_5, slot_c)
6. 06_mountain_spring - 山泉 (slot_6)
7. 07_night_village - 夜村 (slot_7, slot_d)
8. 08_discovery - 发现 (slot_8)
9. 09_truth_revealed - 真相大白
10. 10a_harmony - 和解
11. 10b_conflict - 冲突
12. 10c_leave - 离开

- [ ] **Step 5: 验证并Commit**

```bash
for f in story/chapter3aa/*.json; do python3 -c "import json; json.load(open('$f')); print('✓ $f')" 2>&1 || echo "✗ $f"; done
git add story/chapter3aa/
git commit -m "feat(chapter3aa): create mountain village chapter data files"
```

---

## Task 2: 创建 Chapter 3aa 场景模板

**Files:**
- Create: `story/chapter3aa/templates/` (12个场景模板)

- [ ] **Step 1: 创建目录并创建所有场景模板**

场景模板：
- 01_village_entrance.json - 村口
- 02_village_center.json - 村中心
- 03_hunting_ground.json - 猎场
- 04_herb_garden.json - 药园
- 05_blacksmith.json - 铁匠铺
- 06_mountain_spring.json - 山泉
- 07_night_village.json - 夜村
- 08_discovery.json - 发现
- 09_truth_revealed.json - 真相大白
- 10a_harmony.json - 和解 → chapter4aaa
- 10b_conflict.json - 冲突 → chapter4aab
- 10c_leave.json - 离开 → chapter4aac

- [ ] **Step 2: 验证并Commit**

```bash
for f in story/chapter3aa/templates/*.json; do python3 -c "import json; json.load(open('$f')); print('✓ $f')" 2>&1 || echo "✗ $f"; done
git add story/chapter3aa/templates/
git commit -m "feat(chapter3aa): add scene templates for mountain village"
```

---

## Task 3: 创建 Chapter 3ab 数据文件 (山间古道)

**Files:**
- Create: `story/chapter3ab/meta.json`
- Create: `story/chapter3ab/npcs.json`
- Create: `story/chapter3ab/items.json`
- Create: `story/chapter3ab/skeleton.json`

- [ ] **Step 1: 创建 meta.json**

```json
{
  "id": "chapter3ab",
  "title": "山间古道",
  "description": "离开小镇后，踏上一条古老的山间道路",
  "sceneCount": 12,
  "startScene": "01_road_start",
  "randomized": true
}
```

- [ ] **Step 2: 创建 npcs.json (8个NPC)**

NPC池：
1. fellow_traveler (同行旅人) - 路上遇到的旅伴
2. merchant_caravan (商队) - 路过的商队
3. street_performer (卖艺人) - 流浪艺人
4. wandering_monk (僧人) - 云游僧人
5. road_hunter (猎人) - 山中猎人
6. beggar (乞丐) - 路边乞丐
7. government_officer (官差) - 路上官兵
8. mysterious_stranger (神秘人) - 似曾相识

- [ ] **Step 3: 创建 items.json (6个物品)**

物品池：
1. dried_food (干粮) - 路上食物
2. water_bag (水囊) - 装水之物
3. road_map (地图) - 路线图
4. fire_starter (火折子) - 生火工具
5. rope (绳索) - 登山工具
6. copper_coins (铜钱) - 盘缠

- [ ] **Step 4: 创建 skeleton.json**

场景骨架 (12个)：
1. 01_road_start - 出发 (slot_1, slot_a)
2. 02_mountain_pass - 山口 (slot_2)
3. 03_river_crossing - 渡河 (slot_3, slot_b)
4. 04_small_village - 路边村庄 (slot_4)
5. 05_inn - 客栈 (slot_5, slot_c)
6. 06_market - 集市 (slot_6)
7. 07_forest - 森林 (slot_7, slot_d)
8. 08_night_camp - 露营 (slot_8)
9. 09_truth_revealed - 真相大白
10. 10a_continue - 继续前行
11. 10b_settle - 定居
12. 10c_return - 返回小镇

- [ ] **Step 5: 验证并Commit**

```bash
for f in story/chapter3ab/*.json; do python3 -c "import json; json.load(open('$f')); print('✓ $f')" 2>&1 || echo "✗ $f"; done
git add story/chapter3ab/
git commit -m "feat(chapter3ab): create mountain path chapter data files"
```

---

## Task 4: 创建 Chapter 3ab 场景模板

**Files:**
- Create: `story/chapter3ab/templates/` (12个场景模板)

- [ ] **Step 1: 创建目录并创建所有场景模板**

场景模板：
- 01_road_start.json - 出发
- 02_mountain_pass.json - 山口
- 03_river_crossing.json - 渡河
- 04_small_village.json - 路边村庄
- 05_inn.json - 客栈
- 06_market.json - 集市
- 07_forest.json - 森林
- 08_night_camp.json - 露营
- 09_truth_revealed.json - 真相大白
- 10a_continue.json - 继续前行 → chapter4aba
- 10b_settle.json - 定居 → chapter4abb
- 10c_return.json - 返回小镇 → chapter4abc

- [ ] **Step 2: 验证并Commit**

```bash
for f in story/chapter3ab/templates/*.json; do python3 -c "import json; json.load(open('$f')); print('✓ $f')" 2>&1 || echo "✗ $f"; done
git add story/chapter3ab/templates/
git commit -m "feat(chapter3ab): add scene templates for mountain path"
```

---

## Task 5: 创建 Chapter 3ac 数据文件 (深山密林)

**Files:**
- Create: `story/chapter3ac/meta.json`
- Create: `story/chapter3ac/npcs.json`
- Create: `story/chapter3ac/items.json`
- Create: `story/chapter3ac/skeleton.json`

- [ ] **Step 1: 创建 meta.json**

```json
{
  "id": "chapter3ac",
  "title": "深山密林",
  "description": "探索深山时，发现一片神秘的密林",
  "sceneCount": 12,
  "startScene": "01_forest_edge",
  "randomized": true
}
```

- [ ] **Step 2: 创建 npcs.json (8个NPC)**

NPC池：
1. forest_keeper (守林人) - 森林守护者
2. herb_gatherer (采药人) - 采集草药
3. deep_hunter (猎人) - 森林猎人
4. woodcutter (樵夫) - 砍柴人
5. botanist (学者) - 来研究植物
6. poacher (偷猎者) - 非法捕猎
7. forest_spirit (精灵) - 森林神秘存在
8. mountain_hermit (隐士) - 隐居林中

- [ ] **Step 3: 创建 items.json (6个物品)**

物品池：
1. lingzhi (灵芝) - 珍贵药材
2. glow_stone (荧光石) - 发光石头
3. ancient_bark (古木片) - 记录信息
4. beast_skin (兽皮) - 猎人之物
5. mystical_seed (种子) - 神秘种子
6. forest_compass (罗盘) - 指引方向

- [ ] **Step 4: 创建 skeleton.json**

场景骨架 (12个)：
1. 01_forest_edge - 森林边缘 (slot_1, slot_a)
2. 02_deep_forest - 森林深处 (slot_2)
3. 03_ancient_tree - 古树 (slot_3, slot_b)
4. 04_hidden_spring - 隐秘泉眼 (slot_4)
5. 05_ruins - 废墟 (slot_5, slot_c)
6. 06_cave - 山洞 (slot_6)
7. 07_night_forest - 夜林 (slot_7, slot_d)
8. 08_discovery - 重大发现 (slot_8)
9. 09_truth_revealed - 真相大白
10. 10a_explore - 深入探索
11. 10b_retreat - 撤退
12. 10c_settle - 在林中定居

- [ ] **Step 5: 验证并Commit**

```bash
for f in story/chapter3ac/*.json; do python3 -c "import json; json.load(open('$f')); print('✓ $f')" 2>&1 || echo "✗ $f"; done
git add story/chapter3ac/
git commit -m "feat(chapter3ac): create deep forest chapter data files"
```

---

## Task 6: 创建 Chapter 3ac 场景模板

**Files:**
- Create: `story/chapter3ac/templates/` (12个场景模板)

- [ ] **Step 1: 创建目录并创建所有场景模板**

场景模板：
- 01_forest_edge.json - 森林边缘
- 02_deep_forest.json - 森林深处
- 03_ancient_tree.json - 古树
- 04_hidden_spring.json - 隐秘泉眼
- 05_ruins.json - 废墟
- 06_cave.json - 山洞
- 07_night_forest.json - 夜林
- 08_discovery.json - 重大发现
- 09_truth_revealed.json - 真相大白
- 10a_explore.json - 深入探索 → chapter4aca
- 10b_retreat.json - 撤退 → chapter4acb
- 10c_settle.json - 在林中定居 → chapter4acc

- [ ] **Step 2: 验证并Commit**

```bash
for f in story/chapter3ac/templates/*.json; do python3 -c "import json; json.load(open('$f')); print('✓ $f')" 2>&1 || echo "✗ $f"; done
git add story/chapter3ac/templates/
git commit -m "feat(chapter3ac): add scene templates for deep forest"
```

---

## Task 7: 创建 Chapter 3ba 数据文件 (山间古刹)

**Files:**
- Create: `story/chapter3ba/meta.json`
- Create: `story/chapter3ba/npcs.json`
- Create: `story/chapter3ba/items.json`
- Create: `story/chapter3ba/skeleton.json`

- [ ] **Step 1: 创建 meta.json**

```json
{
  "id": "chapter3ba",
  "title": "山间古刹",
  "description": "跟随指引后，渡途人走入深山，发现一座古寺",
  "sceneCount": 12,
  "startScene": "01_mountain_path",
  "randomized": true
}
```

- [ ] **Step 2: 创建 npcs.json (8个NPC)**

NPC池：
1. old_abbot (老方丈) - 寺庙住持，睿智但沉默
2. young_monk (小沙弥) - 年轻僧人，好奇爱问
3. female_pilgrim (香客) - 来祈福的妇人，心事重重
4. temple_woodcutter (樵夫) - 山中砍柴人，知道山中秘密
5. failed_scholar (书生) - 落榜书生，在寺中借宿
6. herb_merchant (药商) - 来采药的商人，见多识广
7. wandering_performer (流浪艺人) - 卖艺为生，消息灵通
8. mysterious_elder (神秘老者) - 似曾相识的身影

- [ ] **Step 3: 创建 items.json (6个物品)**

物品池：
1. buddhist_beads (佛珠) - 寺庙开光之物
2. sutra_book (经书) - 手抄经卷
3. incense_burner (香炉) - 古铜香炉
4. wooden_fish (木鱼) - 僧人念经之物
5.素食食盒 (素食食盒) - 寺庙特色食物
6. mountain_herbs (山中草药) - 珍贵药材

- [ ] **Step 4: 创建 skeleton.json**

场景骨架 (12个)：
1. 01_mountain_path - 山路 (slot_1, slot_a)
2. 02_temple_gate - 寺门 (slot_2)
3. 03_main_hall - 大殿 (slot_3, slot_b)
4. 04_garden - 寺院花园 (slot_4)
5. 05_library - 藏经阁 (slot_5, slot_c)
6. 06_meditation_room - 禅房 (slot_6)
7. 07_mountain_peak - 山顶 (slot_7, slot_d)
8. 08_night_meditation - 夜禅 (slot_8)
9. 09_truth_revealed - 真相大白
10. 10a_accept - 皈依佛门
11. 10b_reject - 离开寺庙
12. 10c_secrets - 揭开秘密

- [ ] **Step 5: 验证并Commit**

```bash
for f in story/chapter3ba/*.json; do python3 -c "import json; json.load(open('$f')); print('✓ $f')" 2>&1 || echo "✗ $f"; done
git add story/chapter3ba/
git commit -m "feat(chapter3ba): create ancient temple chapter data files"
```

---

## Task 8: 创建 Chapter 3ba 场景模板

**Files:**
- Create: `story/chapter3ba/templates/` (12个场景模板)

- [ ] **Step 1: 创建目录并创建所有场景模板**

场景模板：
- 01_mountain_path.json - 山路
- 02_temple_gate.json - 寺门
- 03_main_hall.json - 大殿
- 04_garden.json - 寺院花园
- 05_library.json - 藏经阁
- 06_meditation_room.json - 禅房
- 07_mountain_peak.json - 山顶
- 08_night_meditation.json - 夜禅
- 09_truth_revealed.json - 真相大白
- 10a_accept.json - 皈依佛门 → chapter4baa
- 10b_reject.json - 离开寺庙 → chapter4bab
- 10c_secrets.json - 揭开秘密 → chapter4bac

- [ ] **Step 2: 验证并Commit**

```bash
for f in story/chapter3ba/templates/*.json; do python3 -c "import json; json.load(open('$f')); print('✓ $f')" 2>&1 || echo "✗ $f"; done
git add story/chapter3ba/templates/
git commit -m "feat(chapter3ba): add scene templates for ancient temple"
```

---

## Task 9: 创建 Chapter 3bb 数据文件 (迷途荒野)

**Files:**
- Create: `story/chapter3bb/meta.json`
- Create: `story/chapter3bb/npcs.json`
- Create: `story/chapter3bb/items.json`
- Create: `story/chapter3bb/skeleton.json`

- [ ] **Step 1: 创建 meta.json**

```json
{
  "id": "chapter3bb",
  "title": "迷途荒野",
  "description": "继续迷惘中，渡途人走入一片荒芜的野地",
  "sceneCount": 12,
  "startScene": "01_wasteland",
  "randomized": true
}
```

- [ ] **Step 2: 创建 npcs.json (8个NPC)**

NPC池：
1. wandering_merchant (流浪商人) - 走南闯北的商人
2. lost_child (迷路孩童) - 与家人失散的孩子
3. old_wanderer (老流浪者) - 漂泊多年的老人
4. desert_hermit (荒野隐士) - 隐居荒野的怪人
5. traveling_healer (游方医者) - 流浪的医者
6. bandit (土匪) - 拦路抢劫的强盗
7. ghost_woman (幽灵女子) - 神秘的女子
8. fate_weaver (命运织者) - 掌控命运的神秘存在

- [ ] **Step 3: 创建 items.json (6个物品)**

物品池：
1. survival_kit (生存工具) - 求生之物
2. old_journal (旧日记) - 记录着秘密
3. compass (指南针) - 指引方向
4. dried_rations (干粮) - 充饥之物
5. mysterious_talisman (神秘符咒) - 辟邪之物
6. memory_shard (记忆碎片) - 过去的回忆

- [ ] **Step 4: 创建 skeleton.json**

场景骨架 (12个)：
1. 01_wasteland - 荒野入口 (slot_1, slot_a)
2. 02_dust_storm - 沙尘暴 (slot_2)
3. 03_oasis - 绿洲 (slot_3, slot_b)
4. 04_ruined_temple - 废弃神庙 (slot_4)
5. 05_night_desert - 夜荒 (slot_5, slot_c)
6. 06_mirage - 海市蜃楼 (slot_6)
7. 07_canyon - 峡谷 (slot_7, slot_d)
8. 08_revelation - 启示 (slot_8)
9. 09_truth_revealed - 真相大白
10. 10a_follow_light - 追随光明
11. 10b_embrace_darkness - 拥抱黑暗
12. 10c_find_middle - 寻找中间道路

- [ ] **Step 5: 验证并Commit**

```bash
for f in story/chapter3bb/*.json; do python3 -c "import json; json.load(open('$f')); print('✓ $f')" 2>&1 || echo "✗ $f"; done
git add story/chapter3bb/
git commit -m "feat(chapter3bb): create wasteland chapter data files"
```

---

## Task 10: 创建 Chapter 3bb 场景模板

**Files:**
- Create: `story/chapter3bb/templates/` (12个场景模板)

- [ ] **Step 1: 创建目录并创建所有场景模板**

场景模板：
- 01_wasteland.json - 荒野入口
- 02_dust_storm.json - 沙尘暴
- 03_oasis.json - 绿洲
- 04_ruined_temple.json - 废弃神庙
- 05_night_desert.json - 夜荒
- 06_mirage.json - 海市蜃楼
- 07_canyon.json - 峡谷
- 08_revelation.json - 启示
- 09_truth_revealed.json - 真相大白
- 10a_follow_light.json - 追随光明 → chapter4bba
- 10b_embrace_darkness.json - 拥抱黑暗 → chapter4bbb
- 10c_find_middle.json - 寻找中间道路 → chapter4bbc

- [ ] **Step 2: 验证并Commit**

```bash
for f in story/chapter3bb/templates/*.json; do python3 -c "import json; json.load(open('$f')); print('✓ $f')" 2>&1 || echo "✗ $f"; done
git add story/chapter3bb/templates/
git commit -m "feat(chapter3bb): add scene templates for wasteland"
```

---

## Task 11: 创建 Chapter 3bc 数据文件 (灵境之地)

**Files:**
- Create: `story/chapter3bc/meta.json`
- Create: `story/chapter3bc/npcs.json`
- Create: `story/chapter3bc/items.json`
- Create: `story/chapter3bc/skeleton.json`

- [ ] **Step 1: 创建 meta.json**

```json
{
  "id": "chapter3bc",
  "title": "灵境之地",
  "description": "觉醒之后，渡途人进入一个超凡脱俗的灵境",
  "sceneCount": 12,
  "startScene": "01_spirit_gate",
  "randomized": true
}
```

- [ ] **Step 2: 创建 npcs.json (8个NPC)**

NPC池：
1. spirit_guide (灵境向导) - 引导渡途人的灵体
2. ancient_guardian (远古守护者) - 守护灵境的存在
3. memory_keeper (记忆守护者) - 保管着所有记忆
4. dream_weaver (梦境织者) - 编织梦境的灵体
5. time_watcher (时间观察者) - 看守时间的存在
6. shadow_whisperer (暗影低语者) - 低语着秘密
7. light_bearer (光明使者) - 带来光明的灵体
8. balance_keeper (平衡守护者) - 维持灵境平衡

- [ ] **Step 3: 创建 items.json (6个物品)**

物品池：
1. spirit_essence (灵境精华) - 灵境的能量结晶
2. memory_crystal (记忆水晶) - 封存着记忆
3. time_hourglass (时间沙漏) - 掌控时间之物
4. dream_catcher (捕梦网) - 捕捉梦境
5. shadow_cloak (暗影斗篷) - 隐身之物
6. light_staff (光明法杖) - 驱散黑暗

- [ ] **Step 4: 创建 skeleton.json**

场景骨架 (12个)：
1. 01_spirit_gate - 灵境之门 (slot_1, slot_a)
2. 02_memory_lake - 记忆之湖 (slot_2)
3. 03_dream_forest - 梦境森林 (slot_3, slot_b)
4. 04_time_tower - 时间之塔 (slot_4)
5. 05_shadow_valley - 暗影山谷 (slot_5, slot_c)
6. 06_light_peak - 光明之巅 (slot_6)
7. 07_balance_temple - 平衡神殿 (slot_7, slot_d)
8. 08_core - 灵境核心 (slot_8)
9. 09_truth_revealed - 真相大白
10. 10a_transcend - 超越
11. 10b_return_mortal - 回归凡尘
12. 10c_become_guardian - 成为守护者

- [ ] **Step 5: 验证并Commit**

```bash
for f in story/chapter3bc/*.json; do python3 -c "import json; json.load(open('$f')); print('✓ $f')" 2>&1 || echo "✗ $f"; done
git add story/chapter3bc/
git commit -m "feat(chapter3bc): create spirit realm chapter data files"
```

---

## Task 12: 创建 Chapter 3bc 场景模板

**Files:**
- Create: `story/chapter3bc/templates/` (12个场景模板)

- [ ] **Step 1: 创建目录并创建所有场景模板**

场景模板：
- 01_spirit_gate.json - 灵境之门
- 02_memory_lake.json - 记忆之湖
- 03_dream_forest.json - 梦境森林
- 04_time_tower.json - 时间之塔
- 05_shadow_valley.json - 暗影山谷
- 06_light_peak.json - 光明之巅
- 07_balance_temple.json - 平衡神殿
- 08_core.json - 灵境核心
- 09_truth_revealed.json - 真相大白
- 10a_transcend.json - 超越 → chapter4bca
- 10b_return_mortal.json - 回归凡尘 → chapter4bcb
- 10c_become_guardian.json - 成为守护者 → chapter4bcc

- [ ] **Step 2: 验证并Commit**

```bash
for f in story/chapter3bc/templates/*.json; do python3 -c "import json; json.load(open('$f')); print('✓ $f')" 2>&1 || echo "✗ $f"; done
git add story/chapter3bc/templates/
git commit -m "feat(chapter3bc): add scene templates for spirit realm"
```

---

## Task 13: 创建 Chapter 3ca 数据文件 (战场前线)

**Files:**
- Create: `story/chapter3ca/meta.json`
- Create: `story/chapter3ca/npcs.json`
- Create: `story/chapter3ca/items.json`
- Create: `story/chapter3ca/skeleton.json`

- [ ] **Step 1: 创建 meta.json**

```json
{
  "id": "chapter3ca",
  "title": "战场前线",
  "description": "参战后，渡途人来到战火纷飞的前线",
  "sceneCount": 12,
  "startScene": "01_frontline",
  "randomized": true
}
```

- [ ] **Step 2: 创建 npcs.json (8个NPC)**

NPC池：
1. frontline_general (前线将领) - 指挥作战的将军
2. veteran_soldier (老兵) - 身经百战的战士
3. field_medic (战地医者) - 救治伤员的医者
4. war_correspondent (战地记者) - 记录战争的文人
5. supply_officer (后勤官) - 负责补给的官员
6. prisoner (俘虏) - 被抓的敌军
7. spy (间谍) - 潜伏的间谍
8. civilian_refugee (平民难民) - 逃离战火的百姓

- [ ] **Step 3: 创建 items.json (6个物品)**

物品池：
1. battle_orders (军令) - 作战命令
2. field_medicine (战地药品) - 治伤之物
3. soldier_tag (士兵牌) - 身份证明
4. weapon (武器) - 战斗工具
5. supply_crate (补给箱) - 物资
6. war_map (作战地图) - 战场地图

- [ ] **Step 4: 创建 skeleton.json**

场景骨架 (12个)：
1. 01_frontline - 前线阵地 (slot_1, slot_a)
2. 02_command_post - 指挥所 (slot_2)
3. 03_trenches - 战壕 (slot_3, slot_b)
4. 04_field_hospital - 野战医院 (slot_4)
5. 05_night_watch - 夜间警戒 (slot_5, slot_c)
6. 06_battle - 战斗 (slot_6)
7. 07_aftermath - 战后 (slot_7, slot_d)
8. 08_revelation - 揭露 (slot_8)
9. 09_truth_revealed - 真相大白
10. 10a_fight_to_end - 战斗到底
11. 10b_retreat - 撤退
12. 10c_negotiate - 谈判

- [ ] **Step 5: 验证并Commit**

```bash
for f in story/chapter3ca/*.json; do python3 -c "import json; json.load(open('$f')); print('✓ $f')" 2>&1 || echo "✗ $f"; done
git add story/chapter3ca/
git commit -m "feat(chapter3ca): create frontline chapter data files"
```

---

## Task 14: 创建 Chapter 3ca 场景模板

**Files:**
- Create: `story/chapter3ca/templates/` (12个场景模板)

- [ ] **Step 1: 创建目录并创建所有场景模板**

场景模板：
- 01_frontline.json - 前线阵地
- 02_command_post.json - 指挥所
- 03_trenches.json - 战壕
- 04_field_hospital.json - 野战医院
- 05_night_watch.json - 夜间警戒
- 06_battle.json - 战斗
- 07_aftermath.json - 战后
- 08_revelation.json - 揭露
- 09_truth_revealed.json - 真相大白
- 10a_fight_to_end.json - 战斗到底 → chapter4caa
- 10b_retreat.json - 撤退 → chapter4cab
- 10c_negotiate.json - 谈判 → chapter4cac

- [ ] **Step 2: 验证并Commit**

```bash
for f in story/chapter3ca/templates/*.json; do python3 -c "import json; json.load(open('$f')); print('✓ $f')" 2>&1 || echo "✗ $f"; done
git add story/chapter3ca/templates/
git commit -m "feat(chapter3ca): add scene templates for frontline"
```

---

## Task 15: 创建 Chapter 3cb 数据文件 (流亡之路)

**Files:**
- Create: `story/chapter3cb/meta.json`
- Create: `story/chapter3cb/npcs.json`
- Create: `story/chapter3cb/items.json`
- Create: `story/chapter3cb/skeleton.json`

- [ ] **Step 1: 创建 meta.json**

```json
{
  "id": "chapter3cb",
  "title": "流亡之路",
  "description": "逃离战场后，渡途人踏上漫长的流亡之路",
  "sceneCount": 12,
  "startScene": "01_escape",
  "randomized": true
}
```

- [ ] **Step 2: 创建 npcs.json (8个NPC)**

NPC池：
1. fellow_refugee (同行难民) - 一起逃难的人
2. deserting_soldier (逃兵) - 逃离军队的士兵
3. refugee_camp_leader (难民营首领) - 难民营的领导者
4. relief_worker (救济者) - 来救援的好心人
5. black_market_dealer (黑市商人) - 趁火打劫的商人
6. border_guard (边境守卫) - 守卫边境的人
7. smuggler (走私者) - 帮助偷渡的人
8. refugee_child (难民儿童) - 流离失所的孩子

- [ ] **Step 3: 创建 items.json (6个物品)**

物品池：
1. refugee_pass (难民证) - 身份证明
2. survival_supplies (生存物资) - 基本生活用品
3. hidden_gold (藏金) - 私藏的财物
4. fake_papers (假证件) - 伪造的身份文件
5. family_photo (全家福) - 家人的照片
6. hope_token (希望信物) - 给予希望的东西

- [ ] **Step 4: 创建 skeleton.json**

场景骨架 (12个)：
1. 01_escape - 逃亡 (slot_1, slot_a)
2. 02_road - 路上 (slot_2)
3. 03_refugee_camp - 难民营 (slot_3, slot_b)
4. 04_border - 边境 (slot_4)
5. 05_night_hiding - 夜藏 (slot_5, slot_c)
6. 06_pursuit - 追捕 (slot_6)
7. 07_safe_house - 安全屋 (slot_7, slot_d)
8. 08_revelation - 揭露 (slot_8)
9. 09_truth_revealed - 真相大白
10. 10a_new_land - 新天地
11. 10b_return_home - 返回家园
12. 10c_keep_wandering - 继续漂泊

- [ ] **Step 5: 验证并Commit**

```bash
for f in story/chapter3cb/*.json; do python3 -c "import json; json.load(open('$f')); print('✓ $f')" 2>&1 || echo "✗ $f"; done
git add story/chapter3cb/
git commit -m "feat(chapter3cb): create refugee path chapter data files"
```

---

## Task 16: 创建 Chapter 3cb 场景模板

**Files:**
- Create: `story/chapter3cb/templates/` (12个场景模板)

- [ ] **Step 1: 创建目录并创建所有场景模板**

场景模板：
- 01_escape.json - 逃亡
- 02_road.json - 路上
- 03_refugee_camp.json - 难民营
- 04_border.json - 边境
- 05_night_hiding.json - 夜藏
- 06_pursuit.json - 追捕
- 07_safe_house.json - 安全屋
- 08_revelation.json - 揭露
- 09_truth_revealed.json - 真相大白
- 10a_new_land.json - 新天地 → chapter4cba
- 10b_return_home.json - 返回家园 → chapter4cbb
- 10c_keep_wandering.json - 继续漂泊 → chapter4cbc

- [ ] **Step 2: 验证并Commit**

```bash
for f in story/chapter3cb/templates/*.json; do python3 -c "import json; json.load(open('$f')); print('✓ $f')" 2>&1 || echo "✗ $f"; done
git add story/chapter3cb/templates/
git commit -m "feat(chapter3cb): add scene templates for refugee path"
```

---

## Task 17: 创建 Chapter 3cc 数据文件 (谈判桌前)

**Files:**
- Create: `story/chapter3cc/meta.json`
- Create: `story/chapter3cc/npcs.json`
- Create: `story/chapter3cc/items.json`
- Create: `story/chapter3cc/skeleton.json`

- [ ] **Step 1: 创建 meta.json**

```json
{
  "id": "chapter3cc",
  "title": "谈判桌前",
  "description": "选择谈判后，渡途人被带到谈判桌前",
  "sceneCount": 12,
  "startScene": "01_negotiation_table",
  "randomized": true
}
```

- [ ] **Step 2: 创建 npcs.json (8个NPC)**

NPC池：
1. enemy_general (敌方将领) - 敌军的指挥官
2. peace_envoy (和平使者) - 主张和平的使者
3. war_hawk (主战派) - 坚持战争的强硬派
4. diplomat (外交官) - 经验丰富的外交家
5. spy_master (情报头子) - 掌握情报的人
6. civilian_leader (平民领袖) - 代表百姓的人
7. religious_leader (宗教领袖) - 精神领袖
8. mysterious_mediator (神秘调解人) - 神秘的中间人

- [ ] **Step 3: 创建 items.json (6个物品)**

物品池：
1. peace_treaty (和平条约) - 和平协议草案
2. war_trophies (战利品) - 战争中的收获
3. secret_documents (机密文件) - 重要情报
4. hostage_list (人质名单) - 被扣押的人
5. territory_map (领土地图) - 划分边界的地图
6. ceasefire_agreement (停火协议) - 临时停火

- [ ] **Step 4: 创建 skeleton.json**

场景骨架 (12个)：
1. 01_negotiation_table - 谈判桌 (slot_1, slot_a)
2. 02_tent - 帐篷 (slot_2)
3. 03_feast - 宴会 (slot_3, slot_b)
4. 04_private_talk - 密谈 (slot_4)
5. 05_crisis - 危机 (slot_5, slot_c)
6. 06_revelation - 揭露 (slot_6)
7. 07_choice - 抉择 (slot_7, slot_d)
8. 08_truth_revealed - 真相大白 (slot_8)
9. 09_truth_revealed - 真相大白
10. 10a_peace - 实现和平
11. 10b_betrayal - 背叛
12. 10c_walk_away - 拂袖而去

- [ ] **Step 5: 验证并Commit**

```bash
for f in story/chapter3cc/*.json; do python3 -c "import json; json.load(open('$f')); print('✓ $f')" 2>&1 || echo "✗ $f"; done
git add story/chapter3cc/
git commit -m "feat(chapter3cc): create negotiation table chapter data files"
```

---

## Task 18: 创建 Chapter 3cc 场景模板

**Files:**
- Create: `story/chapter3cc/templates/` (12个场景模板)

- [ ] **Step 1: 创建目录并创建所有场景模板**

场景模板：
- 01_negotiation_table.json - 谈判桌
- 02_tent.json - 帐篷
- 03_feast.json - 宴会
- 04_private_talk.json - 密谈
- 05_crisis.json - 危机
- 06_revelation.json - 揭露
- 07_choice.json - 抉择
- 08_truth_revealed.json - 真相大白
- 09_truth_revealed.json - 真相大白
- 10a_peace.json - 实现和平 → chapter4cca
- 10b_betrayal.json - 背叛 → chapter4ccb
- 10c_walk_away.json - 拂袖而去 → chapter4ccc

- [ ] **Step 2: 验证并Commit**

```bash
for f in story/chapter3cc/templates/*.json; do python3 -c "import json; json.load(open('$f')); print('✓ $f')" 2>&1 || echo "✗ $f"; done
git add story/chapter3cc/templates/
git commit -m "feat(chapter3cc): add scene templates for negotiation table"
```

---

## Task 19: 最终验证

- [ ] **Step 1: 验证所有 Chapter 3 文件**

```bash
for chapter in chapter3aa chapter3ab chapter3ac chapter3ba chapter3bb chapter3bc chapter3ca chapter3cb chapter3cc; do
  echo "=== $chapter ==="
  for f in story/$chapter/*.json story/$chapter/templates/*.json; do
    python3 -c "import json; json.load(open('$f')); print('✓ $f')" 2>&1 || echo "✗ $f"
  done
done
```

- [ ] **Step 2: 统计文件数量**

```bash
echo "Total Chapter 3 files:"
find story/chapter3* -name "*.json" | wc -l
```

- [ ] **Step 3: Push to GitHub**

```bash
git push
```

---

## 后续计划

Phase 3: 创建 Chapter 4 变体 (27个)
每个Phase使用单独的实现计划文档。
