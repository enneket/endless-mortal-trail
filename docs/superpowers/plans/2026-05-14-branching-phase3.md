# 分支章节系统 - Phase 3 实现计划

**Goal:** 创建 Chapter 4 的27个变体，每个包含完整数据文件和场景模板

**每个变体结构:** meta.json + npcs.json + items.json + skeleton.json + 12场景模板 = 16文件

**总计:** 27 × 16 = 432个JSON文件

---

## Chapter 4 变体列表

### 来自 chapter3aa (山中村落)
| 变体 | 主题 | 地点 | 来源结局 |
|------|------|------|----------|
| chapter4aaa | 和谐新生 | 重建村庄 | 和解 |
| chapter4aab | 冲突再起 | 战火村庄 | 冲突 |
| chapter4aac | 远行之路 | 离村道路 | 离开 |

### 来自 chapter3ab (山间古道)
| 变体 | 主题 | 地点 | 来源结局 |
|------|------|------|----------|
| chapter4aba | 前方未知 | 未知远方 | 继续前行 |
| chapter4abb | 安居乐业 | 新家园 | 定居 |
| chapter4abc | 归途重逢 | 小镇归途 | 返回小镇 |

### 来自 chapter3ac (深山密林)
| 变体 | 主题 | 地点 | 来源结局 |
|------|------|------|----------|
| chapter4aca | 深渊探秘 | 地下洞穴 | 深入探索 |
| chapter4acb | 撤退重生 | 林外世界 | 撤退 |
| chapter4acc | 林中隐居 | 林中小屋 | 定居 |

### 来自 chapter3ba (山间古刹)
| 变体 | 主题 | 地点 | 来源结局 |
|------|------|------|----------|
| chapter4baa | 修行悟道 | 寺庙深处 | 皈依 |
| chapter4bab | 红尘再入 | 山下城镇 | 离开寺庙 |
| chapter4bac | 真相大白 | 密室 | 揭开秘密 |

### 来自 chapter3bb (迷途荒野)
| 变体 | 主题 | 地点 | 来源结局 |
|------|------|------|----------|
| chapter4bba | 光明彼岸 | 光明之地 | 追随光明 |
| chapter4bbb | 暗影深处 | 暗影之地 | 拥抱黑暗 |
| chapter4bbc | 平衡之道 | 平衡之地 | 中间道路 |

### 来自 chapter3bc (灵境之地)
| 变体 | 主题 | 地点 | 来源结局 |
|------|------|------|----------|
| chapter4bca | 超越凡尘 | 天界 | 超越 |
| chapter4bcb | 凡尘回归 | 人间 | 回归凡尘 |
| chapter4bcc | 守护使命 | 灵境 | 成为守护者 |

### 来自 chapter3ca (战场前线)
| 变体 | 主题 | 地点 | 来源结局 |
|------|------|------|----------|
| chapter4caa | 决战到底 | 最终战场 | 战斗到底 |
| chapter4cab | 战略撤退 | 后方基地 | 撤退 |
| chapter4cac | 和平谈判 | 谈判帐 | 谈判 |

### 来自 chapter3cb (流亡之路)
| 变体 | 主题 | 地点 | 来源结局 |
|------|------|------|----------|
| chapter4cba | 新天地 | 新大陆 | 新天地 |
| chapter4cbb | 归乡路 | 故乡 | 返回家园 |
| chapter4cbc | 永恒漂泊 | 无尽道路 | 继续漂泊 |

### 来自 chapter3cc (谈判桌前)
| 变体 | 主题 | 地点 | 来源结局 |
|------|------|------|----------|
| chapter4cca | 和平年代 | 和平之城 | 实现和平 |
| chapter4ccb | 背叛代价 | 暗夜 | 背叛 |
| chapter4ccc | 独行天下 | 荒野 | 拂袖而去 |

---

## 执行策略

每个变体由一个subagent完成（数据文件+场景模板），共27个任务。

**批次执行：**
- Batch 1: chapter4aaa, chapter4aab, chapter4aac (来自chapter3aa)
- Batch 2: chapter4aba, chapter4abb, chapter4abc (来自chapter3ab)
- Batch 3: chapter4aca, chapter4acb, chapter4acc (来自chapter3ac)
- Batch 4: chapter4baa, chapter4bab, chapter4bac (来自chapter3ba)
- Batch 5: chapter4bba, chapter4bbb, chapter4bbc (来自chapter3bb)
- Batch 6: chapter4bca, chapter4bcb, chapter4bcc (来自chapter3bc)
- Batch 7: chapter4caa, chapter4cab, chapter4cac (来自chapter3ca)
- Batch 8: chapter4cba, chapter4cbb, chapter4cbc (来自chapter3cb)
- Batch 9: chapter4cca, chapter4ccb, chapter4ccc (来自chapter3cc)

每个变体模板结构：
```json
{
  "id": "chapter4xxx",
  "title": "中文标题",
  "description": "描述",
  "sceneCount": 12,
  "startScene": "01_xxx",
  "randomized": true
}
```

场景骨架通用结构：
- 01-08: 探索场景（带NPC/item槽位）
- 09_truth_revealed: 真相大白
- 10a/10b/10c: 三个最终结局（无后续章节）
