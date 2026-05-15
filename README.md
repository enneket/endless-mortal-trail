# 人间无尽途

文字冒险游戏。玩家扮演渡途人，在人间行走，经历不同的故事。

## 分支章节系统

```
Chapter 1: 裂隙初醒 (3结局)
    ├─ Chapter 2a: 山间小镇 (坦然)
    ├─ Chapter 2b: 迷雾森林 (犹豫)
    └─ Chapter 2c: 战火边关 (抗拒)
        └─ 每个Chapter 2 → 3个Chapter 3 → 3个Chapter 4
            └─ 共81种结局
```

每个章节包含：
- 8个随机NPC
- 6个随机物品
- 12个场景模板
- 3个结局分支

## Docker 部署

### 配置端口

编辑 `.env` 文件：

```bash
HOST_PORT=8080
```

### 启动

```bash
docker compose up -d
```

访问 `http://localhost:${HOST_PORT}`

### 停止

```bash
docker compose down
```

### 重新构建

```bash
docker compose up -d --build
```

## 本地开发

直接用浏览器打开 `index.html`，或启动任意 HTTP 服务器：

```bash
python3 -m http.server 8080
```

## 文件结构

```
├── index.html          # 入口页面
├── css/                # 样式文件
├── js/                 # 游戏引擎
│   ├── app.js          # 主程序
│   ├── story-engine.js # 场景引擎
│   ├── game-state.js   # 状态管理
│   └── save-manager.js # 存档系统
└── story/              # 剧情数据
    ├── chapter1/       # 裂隙初醒
    ├── chapter2a/      # 山间小镇
    ├── chapter2b/      # 迷雾森林
    ├── chapter2c/      # 战火边关
    ├── chapter3aa/ ~ chapter3cc/  # 9个变体
    └── chapter4aaa/ ~ chapter4ccc/ # 27个变体
```
