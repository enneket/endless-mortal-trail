# 分支章节系统设计规格

## 目标

将游戏从线性结构改为树状结构，让玩家的不同选择导致完全不同的后续章节，最终形成81种结局。

## 整体结构

```
Chapter 1: 裂隙初醒 (3结局)
    ↓         ↓         ↓
Chapter 2a  Chapter 2b  Chapter 2c
(坦然→)     (犹豫→)     (抗拒→)
    ↓         ↓         ↓
9个 Chapter 3 变体 (每个3结局)
    ↓
27个 Chapter 4 变体 (每个3结局)
    ↓
81种最终结局
```

## 命名规范

### Chapter 2 变体
- `chapter2a` - 对应 Chapter 1 "坦然"结局
- `chapter2b` - 对应 Chapter 1 "犹豫"结局
- `chapter2c` - 对应 Chapter 1 "抗拒"结局

### Chapter 3 变体
- `chapter3aa` - 对应 chapter2a 结局a
- `chapter3ab` - 对应 chapter2a 结局b
- `chapter3ac` - 对应 chapter2a 结局c
- `chapter3ba` - 对应 chapter2b 结局a
- `chapter3bb` - 对应 chapter2b 结局b
- `chapter3bc` - 对应 chapter2b 结局c
- `chapter3ca` - 对应 chapter2c 结局a
- `chapter3cb` - 对应 chapter2c 结局b
- `chapter3cc` - 对应 chapter2c 结局c

### Chapter 4 变体
- `chapter4aaa` 到 `chapter4ccc` (27个)

---

## Chapter 1 改造

### 现状
Chapter 1 "裂隙初醒" 目前只有1个结局（12_departure.json）。

### 改造方案
将第12个场景改为分支点，根据玩家之前的选择（通过flag判断）进入不同结局。

**新增场景：**
- `12a_acceptance.json` - 坦然接受
- `12b_hesitation.json` - 犹豫不决
- `12c_resistance.json` - 抗拒命运

**Chapter 1 现有场景影响：**
通过前面场景的选择设置flag，决定最终结局：
- `accepting` flag - 多次选择接受/顺从
- `hesitating` flag - 多次选择犹豫/观望
- `resisting` flag - 多次选择抗拒/反抗

---

## Chapter 2 变体详情

### Chapter 2a: 山间小镇（坦然之路）

**背景：** 坦然接受命运后，渡途人来到一个宁静的山间小镇。

**主题：** 平静与选择

**NPC池 (8个):**
1. 老镇长 - 镇上长者，睿智
2. 药铺掌柜 - 开药铺的商人
3. 猎户 - 山中猎人
4. 教书先生 - 私塾老师
5. 茶馆老板娘 - 经营茶馆
6. 游方郎中 - 流浪医者
7. 樵夫 - 砍柴为生
8. 旅人 - 路过的旅人

**物品池 (6个):**
1. 山参 - 珍贵药材
2. 茶叶 - 当地特产
3. 猎弓 - 猎户工具
4. 古书 - 教书先生之物
5. 药方 - 治病良方
6. 山路图 - 山中地图

**场景骨架 (12个):**
1. 01_town_gate - 镇口
2. 02_main_street - 主街
3. 03_teahouse - 茶馆
4. 04_medicine_shop - 药铺
5. 05_school - 私塾
6. 06_hunting_lodge - 猎户家
7. 07_mountain_path - 山路
8. 08_night_town - 夜镇
9. 09_truth_revealed - 真相大白
10. 10a_stay - 留在小镇
11. 10b_leave - 离开小镇
12. 10c_explore - 探索深山

**结局target:**
- 留在小镇 → chapter3aa:01_town_center
- 离开小镇 → chapter3ab:01_road
- 探索深山 → chapter3ac:01_mountain

---

### Chapter 2b: 迷雾森林（犹豫之路）

**背景：** 犹豫不决中，渡途人走入一片迷雾笼罩的森林。

**主题：** 迷茫与发现

**NPC池 (8个):**
1. 守林人 - 森林守护者
2. 采药女 - 采集草药的女子
3. 迷路书生 - 在森林中迷路
4. 猎人 - 森林猎人
5. 木匠 - 伐木工人
6. 神婆 - 通灵的老妇
7. 偷猎者 - 非法捕猎者
8. 精灵 - 森林中的神秘存在

**物品池 (6个):**
1. 灵芝 - 珍贵药材
2. 罗盘 - 指引方向
3. 荧光石 - 发光的石头
4. 树皮画 - 森林地图
5. 兽皮 - 猎人之物
6. 符咒 - 神婆所赠

**场景骨架 (12个):**
1. 01_forest_edge - 森林边缘
2. 02_foggy_path - 迷雾小径
3. 03_clearing - 林中空地
4. 04_cave - 山洞
5. 05_river - 林中小溪
6. 06_old_tree - 古树
7. 07_night_forest - 夜林
8. 08_deep_forest - 森林深处
9. 09_truth_revealed - 真相大白
10. 10a_follow - 跟随指引
11. 10b_wander - 继续迷惘
12. 10c_awaken - 觉醒

**结局target:**
- 跟随指引 → chapter3ba:01_guide_post
- 继续迷惘 → chapter3bb:01_lost_path
- 觉醒 → chapter3bc:01_clearing

---

### Chapter 2c: 战火边关（抗拒之路）

**背景：** 试图抗拒命运后，渡途人被推入战火纷飞的边关。

**主题：** 冲突与抉择

**NPC池 (8个):**
1. 将军 - 守关将领
2. 士兵 - 普通士兵
3. 难民 - 逃难百姓
4. 商人 - 战争商人
5. 医者 - 军医
6. 间谍 - 敌方间谍
7. 老兵 - 退伍老兵
8. 将军遗孀 - 将军夫人

**物品池 (6个):**
1. 军令 - 将军手令
2. 伤药 - 治伤之物
3. 家书 - 士兵家信
4. 地图 - 边关地图
5. 军牌 - 身份证明
6. 粮食 - 军粮

**场景骨架 (12个):**
1. 01_arrival - 到达边关
2. 02_camp - 军营
3. 03_village - 边关村庄
4. 04_fortress - 要塞
5. 05_battlefield - 战场
6. 06_medical_tent - 医帐
7. 07_night_camp - 夜营
8. 08_revelation - 揭露
9. 09_truth_revealed - 真相大白
10. 10a_fight - 参战
11. 10b_flee - 逃离
12. 10c_negotiate - 谈判

**结局target:**
- 参战 → chapter3ca:01_battlefield
- 逃离 → chapter3cb:01_road
- 谈判 → chapter3cc:01_negotiation_table

---

## Chapter 3 变体详情 (9个)

### Chapter 3aa: 山中村落（小镇·留下）

**背景：** 留在小镇后，发现附近山中有个隐秘村落。

**主题：** 隐世与纷争

**NPC池 (8个):**
1. 村长 - 山村村长
2. 猎户 - 村中猎人
3. 药农 - 种药为生
4. 铁匠 - 村中铁匠
5. 外来商人 - 来收购药材
6. 隐士 - 隐居山中的高人
7. 孩童 - 村中儿童
8. 神秘老人 - 似曾相识

**物品池 (6个):**
1. 山货 - 山中特产
2. 药材 - 珍贵草药
3. 猎具 - 猎人工具
4. 铁器 - 铁匠打造
5. 古物 - 村中旧物
6. 信件 - 神秘信件

**场景骨架 (12个):**
1. 01_village_entrance - 村口
2. 02_village_center - 村中心
3. 03_hunting_ground - 猎场
4. 04_herb_garden - 药园
5. 05_blacksmith - 铁匠铺
6. 06_mountain_spring - 山泉
7. 07_night_village - 夜村
8. 08_discovery - 发现
9. 09_truth_revealed - 真相大白
10. 10a_harmony - 和解
11. 10b_conflict - 冲突
12. 10c_leave - 离开

**结局target:**
- 和解 → chapter4aaa:01_peace
- 冲突 → chapter4aab:01_conflict
- 离开 → chapter4aac:01_departure

---

### Chapter 3ab: 山间古道（小镇·离开）

**背景：** 离开小镇后，踏上一条古老的山间道路。

**主题：** 旅途与相遇

**NPC池 (8个):**
1. 同行旅人 - 路上遇到的旅伴
2. 商队 - 路过的商队
3. 卖艺人 - 流浪艺人
4. 僧人 - 云游僧人
5. 猎人 - 山中猎人
6. 乞丐 - 路边乞丐
7. 官差 - 路上官兵
8. 神秘人 - 似曾相识

**物品池 (6个):**
1. 干粮 - 路上食物
2. 水囊 - 装水之物
3. 地图 - 路线图
4. 火折子 - 生火工具
5. 绳索 - 登山工具
6. 铜钱 - 盘缠

**场景骨架 (12个):**
1. 01_road_start - 出发
2. 02_mountain_pass - 山口
3. 03_river_crossing - 渡河
4. 04_small_village - 路边村庄
5. 05_inn - 客栈
6. 06_market - 集市
7. 07_forest - 森林
8. 08_night_camp - 露营
9. 09_truth_revealed - 真相大白
10. 10a_continue - 继续前行
11. 10b_settle - 定居
12. 10c_return - 返回小镇

**结局target:**
- 继续前行 → chapter4aba:01_road
- 定居 → chapter4abb:01_new_home
- 返回小镇 → chapter4abc:01_town_gate

---

### Chapter 3ac: 深山密林（小镇·探索）

**背景：** 探索深山时，发现一片神秘的密林。

**主题：** 探索与发现

**NPC池 (8个):**
1. 守林人 - 森林守护者
2. 采药人 - 采集草药
3. 猎人 - 森林猎人
4. 樵夫 - 砍柴人
5. 学者 - 来研究植物
6. 偷猎者 - 非法捕猎
7. 精灵 - 森林神秘存在
8. 隐士 - 隐居林中

**物品池 (6个):**
1. 灵芝 - 珍贵药材
2. 荧光石 - 发光石头
3. 古木片 - 记录信息
4. 兽皮 - 猎人之物
5. 种子 - 神秘种子
6. 罗盘 - 指引方向

**场景骨架 (12个):**
1. 01_forest_edge - 森林边缘
2. 02_deep_forest - 森林深处
3. 03_ancient_tree - 古树
4. 04_hidden_spring - 隐秘泉眼
5. 05_ruins - 废墟
6. 06_cave - 山洞
7. 07_night_forest - 夜林
8. 08_discovery - 重大发现
9. 09_truth_revealed - 真相大白
10. 10a_explore - 深入探索
11. 10b_retreat - 撤退
12. 10c_settle - 在林中定居

**结局target:**
- 深入探索 → chapter4aca:01_depths
- 撤退 → chapter4acb:01_exit
- 在林中定居 → chapter4acc:01_cabin

---

(以下省略其余6个Chapter 3变体的详细设计，实际实现时补充)

---

## Chapter 4 变体概览 (27个)

Chapter 4 变体命名规则：`chapter4` + Chapter 3 变体后缀 + 结局后缀

例如：
- `chapter4aaa` - 对应 chapter3aa 的结局a
- `chapter4aab` - 对应 chapter3aa 的结局b
- `chapter4aac` - 对应 chapter3aa 的结局c
- ...以此类推

每个 Chapter 4 变体都有：
- 独立主题和地点
- 8个NPC
- 6个物品
- 12个场景
- 3个结局（共81种最终结局）

---

## 文件结构

```
story/
├── chapter1/              # 改造：增加3个结局
│   ├── meta.json
│   ├── scenes/
│   │   ├── 01_awakening.json
│   │   ├── ...
│   │   ├── 11_mountain_peak.json
│   │   ├── 12a_acceptance.json    # 新增
│   │   ├── 12b_hesitation.json    # 新增
│   │   └── 12c_resistance.json    # 新增
│   └── shared/
├── chapter2a/             # 新建：山间小镇
├── chapter2b/             # 新建：迷雾森林
├── chapter2c/             # 新建：战火边关
├── chapter3aa/            # 新建
├── chapter3ab/            # 新建
├── chapter3ac/            # 新建
├── chapter3ba/            # 新建
├── chapter3bb/            # 新建
├── chapter3bc/            # 新建
├── chapter3ca/            # 新建
├── chapter3cb/            # 新建
├── chapter3cc/            # 新建
├── chapter4aaa/           # 新建
├── chapter4aab/           # 新建
├── ...                    # 共27个
└── chapter4ccc/           # 新建
```

## 实现步骤

### Phase 1: 改造 Chapter 1
- 修改 Chapter 1，增加3个结局
- 设置flag机制决定进入哪个结局

### Phase 2: 创建 Chapter 2 变体 (3个)
- 创建 chapter2a, chapter2b, chapter2c
- 每个变体12场景、8NPC、6物品

### Phase 3: 创建 Chapter 3 变体 (9个)
- 创建 chapter3aa 到 chapter3cc
- 每个变体12场景、8NPC、6物品

### Phase 4: 创建 Chapter 4 变体 (27个)
- 创建 chapter4aaa 到 chapter4ccc
- 每个变体12场景、8NPC、6物品

### Phase 5: 测试
- 验证所有JSON文件格式正确
- 测试所有分支路径可正常跳转
- 验证状态继承正常工作

## 引擎兼容性

现有引擎已支持：
- 章节切换：`chapterId:sceneId` 格式
- 随机生成：`meta.randomized` 标志
- 状态继承：mood、flags、items 跨章保留
- 条件选项：`condition` 字段过滤可用选项

**无需修改引擎代码。**

## 内容量估算

- Chapter 1 改造：3个新场景
- Chapter 2 变体：3 × (12场景 + 8NPC + 6物品) = 78个文件
- Chapter 3 变体：9 × (12场景 + 8NPC + 6物品) = 234个文件
- Chapter 4 变体：27 × (12场景 + 8NPC + 6物品) = 702个文件

**总计：约1,017个新文件**
