---
title: 闲置的旧手机、旧平板和旧电脑还能做什么
description: 一份旧设备再利用的调研笔记：平板适合做常亮的信息屏，手机适合做传感器和小服务器，旧电脑适合做家庭服务器。文中给出 100 多个开源项目和 app 的链接，标明哪些是现成方案、哪些是我还没验证的设想，以及长期插电的电池和安全问题。
pubDate: 2026-11-17
tags: ['self-hosting', 'home-server', 'hardware']
---

我想给手边闲置的旧手机、旧平板和旧电脑找点事做，于是翻了一圈中英文测评和教程，包括 Android Central、Tom's Guide、PCWorld、HackerNoon、IT 之家和 B 站专栏，又自己补了一些想法。[1][4][7][8][12] 这篇是整理后的笔记。

## 三类设备各有一个最合适的角色

把几十种玩法摆在一起看，三类设备的分工相当清楚：

<figure class="viz">
<div class="viz-row">
<div class="viz-card"><div class="viz-kicker">旧平板</div><div class="viz-title">常亮的信息屏</div><div class="viz-chips"><span>相框</span><span>家庭看板</span><span>电脑副屏</span><span>控制面板</span></div></div>
<div class="viz-card"><div class="viz-kicker">旧手机</div><div class="viz-title">小传感器 + 小服务器</div><div class="viz-chips"><span>监控摄像头</span><span>网络摄像头</span><span>Termux 服务器</span><span>本地小模型</span></div></div>
<div class="viz-card"><div class="viz-kicker">旧电脑</div><div class="viz-title">家庭服务器</div><div class="viz-chips"><span>Home Assistant</span><span>相册</span><span>影音库</span><span>自托管服务</span></div></div>
</div>
<figcaption>三类设备各自最合适的角色和典型用途</figcaption>
</figure>

平板的优势是屏幕大、可以立着摆。手机的优势是摄像头、麦克风、传感器和蜂窝网络都齐全，而且待机只有几瓦。旧电脑有 x86 处理器和大硬盘，能跑完整的服务器软件；如果是笔记本，自带的电池还相当于一台免费的不间断电源。

整理过程中我还注意到一个规律：大多数「屏」类玩法，做法都是一个全屏常亮的浏览器加一个网页。相框、日历、家居面板、状态屏，换的只是网页的内容。所以选择顺序可以很简单：先用现成的 app，不够用了再自己写网页。

## 旧平板：做一块常亮的屏

### 相框、日历和家居面板

数字相框是门槛最低的玩法，SlashGear 和 BGR 各有一篇完整的教程。[2][3] 做法是在平板上打开一个共享相簿的幻灯片：[Google 相册](https://www.google.com/photos/about/)和 [iCloud 共享相簿](https://support.apple.com/en-us/108314)都支持，家人往相簿里加照片，相框上的内容会跟着更新。安卓平板可以装专门的相框 app [Fotoo](https://play.google.com/store/apps/details?id=com.bo.fotoo)。不想把照片放在云上的话，自建相册 [Immich](https://immich.app)（[GitHub](https://github.com/immich-app/immich)）的网页端也能轮播。

日历和待办屏的做法类似。最省事的是把 Google 日历的周视图全屏打开。想要更像成品的界面，可以用 [DAKboard](https://dakboard.com)（商业服务，有免费档），或者开源的 [MagicMirror²](https://magicmirror.builders)（[GitHub](https://github.com/MagicMirrorOrg/MagicMirror)），它原本是为「魔镜」项目写的，用浏览器打开一样能用。[Notion](https://www.notion.com) 和[滴答清单](https://dida365.com)的页面也可以直接挂在屏上。

智能家居控制面板需要两样东西：[Home Assistant](https://www.home-assistant.io)（[GitHub](https://github.com/home-assistant/core)，下文简称 HA）的仪表盘，以及一个能把平板锁定在这个页面上的浏览器。安卓上最常被推荐的是 [Fully Kiosk Browser](https://www.fully-kiosk.com)，它支持检测到动作时自动亮屏、按时间熄屏和防止退出。[1] iPad 没有对应的 app，可以用系统自带的[引导式访问](https://support.apple.com/en-us/111795)把设备锁在 Safari 里。

还有几种用法不需要专门的软件：放在厨房看菜谱、计时和记买菜清单；放在床头显示大字时钟、播白噪音；放在门口显示 Wi-Fi 二维码、天气和「带钥匙」之类的提醒。

下面三个是我的设想，都还没有做：

- 家庭留言板：自建一个共享白板，用 [Excalidraw](https://github.com/excalidraw/excalidraw) 或 [tldraw](https://github.com/tldraw/tldraw)，家人在手机上写，平板上显示。
- 孩子的作息和积分墙：每天的任务打卡换星星，完成后屏幕放一段庆祝动画。
- 老人陪伴屏：大字时钟、吃药提醒，再加一个一键视频通话的大按钮，用引导式访问或 Fully Kiosk 屏蔽其他所有 app。

### 语音助手

最简单的做法是给平板配一个支架，装上 [ChatGPT](https://chatgpt.com)、[Claude](https://claude.com/download) 或[豆包](https://www.doubao.com)的 app，用它们的语音模式。

家里有 HA 的话，可以装 [Home Assistant Companion](https://companion.home-assistant.io) 并把它设成系统默认助手，说「打开客厅灯」就能控制设备。HA 的[语音助手 Assist](https://www.home-assistant.io/voice_control/) 还可以接大模型做对话代理。

再往下是我的设想。一个是「家庭管家」屏：平板平时显示看板，听到唤醒词后调用大模型 API 回答问题，同时能操作 HA、往家庭待办里写东西。如果要让全家设备共用一个模型入口，可以在家里的服务器上放一个 [LiteLLM](https://github.com/BerriAI/litellm) 这类开源网关。另外两个设想是固定提示词的儿童英语陪练页面（限定话题和时长），以及放在桌边的实时字幕屏，用 [Whisper](https://github.com/openai/whisper) 或 [whisper.cpp](https://github.com/ggml-org/whisper.cpp) 转写跨语言的视频会议。这三个的难度都比前面的玩法高，我只想过大致做法。

### 电脑副屏和宏按键板

把平板当电脑的第二块屏幕，方案取决于设备组合。下表里除 Sidecar 以外的条目来自 Parkablogs 的横评和 AlternativeTo 的列表。[5][6]

| 方案 | 适用 | 说明 |
| --- | --- | --- |
| [Sidecar（随航）](https://support.apple.com/en-us/102597) | iPad + Mac | 系统自带，不花钱，还能用 Apple Pencil 把 iPad 当数位板 |
| [Deskreen](https://deskreen.com)（[GitHub](https://github.com/pavlobu/deskreen)） | 任何带浏览器的设备 | 免费开源，平板端只需要打开浏览器 |
| [Side Screen](https://github.com/tranvuongquocdat/SideScreen) | 安卓 + Mac | 开源（MIT），支持 USB-C 有线连接和 Wi-Fi |
| [Tab Display](https://tab-display.enfpdev.com) | 安卓或 iPad + Mac / Windows | 价格比 Duet 低，功能也更少 |
| [Duet Display](https://www.duetdisplay.com) | 多平台 | 老牌方案，已改为订阅制 |
| [Spacedesk](https://www.spacedesk.net) | 仅 Windows 主机 | Mac 用不了 |

另一个现成的方向是宏按键板，也就是用触屏代替 Elgato 的实体 Stream Deck。PCWorld 有一篇文章专门讲这件事。[7] 可选的软件有四个：

- [Macro Deck](https://macro-deck.app)（[GitHub](https://github.com/Macro-Deck-App/Macro-Deck)）：开源，平板端用浏览器访问。
- [Touch Portal](https://www.touch-portal.com)：一次买断。
- [Deckboard](https://deckboard.app)：安卓设备配 Windows。
- [Elgato Stream Deck Mobile](https://www.elgato.com/us/en/s/downloads)：官方 app，免费版有 6 个按键。

宏按键板放在旧手机上同样合适，手机屏幕刚好放 6 到 12 个按键。

除了这些，副屏这个方向上我还有几个设想：

- 开发者驾驶舱：显示 CI 状态、PR 列表、Cloudflare Workers 的请求量和报错。
- AI agent 监控屏：显示正在运行的 Claude Code 或 Codex 会话、token 消耗和任务进度，有会话在等待人工确认时高亮提醒。
- 专注灯：开会或专注时整屏变红，挂在门口，并和 Mac 的专注模式联动。
- 常驻参考屏：快捷键速查表、API 文档、设计稿，或者录视频时当提词器。

### 我最想做的一个：Mac 状态屏

在平板上显示电脑的状态，是这次调研里我最想落地的想法。我整理出三条路线，定制程度依次升高。

路线 A 不需要写代码。用 Sidecar 或 Deskreen 把平板接成扩展屏，在 macOS 的「系统设置 → 桌面与程序坞」里打开「显示器具有单独的空间」，菜单栏就会出现在每块屏幕上。然后把 [Stats](https://github.com/exelban/stats)（开源）或 [iStat Menus](https://bjango.com/mac/istatmenus/) 的状态窗口拖到平板上常驻。这条路线的代价是平板必须一直连着 Mac，并且占用 Mac 的一路显示输出。

路线 B 是在 Mac 上跑一个本地网页仪表盘，平板只负责显示：

<figure class="viz">
<div class="viz-card"><div class="viz-kicker">Mac · 采集</div><div class="viz-title">一个小服务读取这些状态</div><div class="viz-chips"><span>CPU</span><span>内存</span><span>网速</span><span>电池</span><span>前台 app</span><span>正在播放的音乐</span><span>下一个日历会议</span><span>未读消息数</span><span>AI agent 会话状态</span></div></div>
<div class="viz-link">↓</div>
<div class="viz-card"><div class="viz-kicker">Mac · 暴露</div><div class="viz-title">http://mac.local:8080</div><div class="viz-note">用 Python 或 Node 写的自适应网页，通过 SSE 或 WebSocket 实时刷新</div></div>
<div class="viz-link">↓ 局域网里打开网页　·　↑ 触控按钮反向控制 Mac</div>
<div class="viz-card"><div class="viz-kicker">平板 · 显示</div><div class="viz-title">全屏打开这个地址</div><div class="viz-chips"><span>安卓：Fully Kiosk Browser</span><span>iPad：Safari + 引导式访问</span></div></div>
<figcaption>路线 B 的数据流向：Mac 采集并提供网页，平板只负责显示</figcaption>
</figure>

这样做，平板只是一个浏览器，任何新旧设备都能用，Mac 也不用多带一块显示器。网页上还可以放触控按钮反过来控制 Mac，比如锁屏、切歌、静音麦克风。动手之前可以先借用现成的东西：[Glances](https://github.com/nicolargo/glances) 自带网页界面，运行 `glances -w` 就能得到一个系统监控页面。我打算先用它看效果，不满意再自己写。

路线 C 适合已经在用 HA 的家庭。Mac 上装 HA Companion，它会把电池、活跃状态、摄像头和麦克风的占用情况作为传感器上报；HA 自己的 [System Monitor 集成](https://www.home-assistant.io/integrations/systemmonitor/)负责监控 HA 所在的那台主机。平板显示 HA 仪表盘，电脑状态、灯光、门锁和天气就在同一块屏上。

我给自己定的顺序是先走路线 A 摆一周。如果那块屏确实会经常看，再投入时间做路线 B 或 C；如果一周里没看几眼，这个想法就到此为止。

## 旧手机：做传感器和小服务器

### 摄像头类

家用监控和宠物摄像头是旧手机最常见的去处。[1] [Alfred Camera](https://alfred.camera) 和国内的[掌上看家](https://www.ichano.cn)都是一部手机当采集端、另一部当观看端。[IP Webcam](https://play.google.com/store/apps/details?id=com.pas.webcam) 会在局域网里开一个地址，用浏览器就能看画面，也方便接入 HA 或开源的 [Frigate](https://frigate.video)（[GitHub](https://github.com/blakeblackshear/frigate)）做移动侦测。打开声音检测和夜视补光，就是一台婴儿监视器。

旧手机的后置摄像头通常比笔记本自带的摄像头好很多，所以它也适合当电脑的网络摄像头。iPhone 配 Mac 可以直接用系统自带的[连续互通相机](https://support.apple.com/en-us/102546)。安卓手机用 [DroidCam](https://droidcam.app) 或 [Camo](https://camo.com)，再接到 OBS 或 Zoom 里。

我还想过把手机贴在门内侧、摄像头对准猫眼，配合移动侦测和推送做一个智能猫眼。这个只是设想，对焦、供电和固定方式都要实际试过才知道行不行。

### 小服务器和本地模型

安卓手机装上 [Termux](https://termux.dev)（[GitHub](https://github.com/termux/termux-app)，建议从 [F-Droid](https://f-droid.org/packages/com.termux/) 安装）之后，就是一台待机只有几瓦的 Linux 小机器，可以跑 Python 和 Node 脚本、定时任务、爬虫和聊天机器人。[8][12]

在这个基础上还能跑本地小模型。一条路是在 Termux 里装 [Ollama](https://ollama.com)（[GitHub](https://github.com/ollama/ollama)）或 [llama.cpp](https://github.com/ggml-org/llama.cpp)。[10] 另一条路是开源 app [OlliteRT](https://github.com/NightMean/OlliteRT)：它基于 Google 的 LiteRT-LM 运行时，把手机变成局域网里一个兼容 OpenAI 接口的模型服务，自己不带聊天界面，要求 Android 12 以上。[19] 对硬件的预期要放低：InsiderLLM 的指南给出的范围是 6GB 以上内存、2021 年之后的机型，能跑 0.5B 到 2B 参数的小模型。[9]

让手机 24 小时跑 AI agent 也有人做。社区里有几个把 OpenClaw 装到安卓上的脚本，例如 [openclaw-android](https://github.com/AidanPark/openclaw-android)。[11] 这些都是社区维护的安装脚本，我没有读过它们的内容，运行之前先把脚本下载下来看一遍比较稳妥。

折腾程度最高的是刷成真正的 Linux。HackerNoon 上有人把一部 OnePlus 3T 刷成了 postmarketOS 家用服务器。[8] 核对链接时我发现这个项目已经改名：postmarketos.org 现在跳转到 [Nura](https://nura.eco)，首页写着它的前身就是 postmarketOS。[18] 刷机之前要先查[设备支持列表](https://wiki.nura.eco/wiki/Devices)，不在列表里的机型基本不用考虑。

### 不联网也有用的几种用法

- 车载导航：装一个支架，放一份离线地图，例如开源的 [Organic Maps](https://organicmaps.app)，再配一个行车记录 app。
- 纯净设备：不插 SIM 卡、不装社交 app，只当音乐播放器、电子书或遥控器。带红外的老机型还能当万能遥控。
- 公益计算：用 [BOINC](https://boinc.berkeley.edu)（[GitHub](https://github.com/BOINC/boinc)）把算力贡献给科研项目。[Rainforest Connection](https://rfcx.org) 早期就是用旧手机在雨林里监听非法砍伐的电锯声。[12]
- 测试真机：自己做 app 或网站时，用它测低端机上的表现，比模拟器真实。

### 我想到的几个用法

下面这些是我自己列的，除了标注来源的，都没有验证过。

短信和验证码转发器：给旧手机插一张备用 SIM 卡常年放在家里，用开源的 [SmsForwarder](https://github.com/pppscn/SmsForwarder) 把短信转到 Telegram 或邮箱。对海外号码和副卡，这个用法特别实际。

「专注手机」：只装电话、微信和地图，晚上出门或陪孩子时带它，主力机留在家里。

家庭网络探针：定时测网速、ping 网关，断网时推送通知，顺便记录各个房间的 Wi-Fi 信号。

环境传感器站：手机自带光线、气压、加速度传感器和麦克风，可以记录噪音，或者贴在洗衣机上，震动停止就推送「洗完了」。想先看看传感器读数长什么样，可以装亚琛工业大学的 [phyphox](https://phyphox.org)。

自动化执行机：用 [Tasker](https://tasker.joaoapps.com) 或 Auto.js 的社区分支 [AutoX](https://github.com/aiselp/AutoX) 跑签到、降价提醒这类重复操作。Engineered.at 还有一篇文章，写的是让本地模型直接操作安卓上的 app。[17]

### 长期插电之前先处理电池

手机 24 小时插着电，锂电池长期处于满电状态，有鼓包的风险。我整理到的处理办法有三种：在系统里打开充电保护或 80% 充电上限；用智能插座定时断电；有动手能力的话拆掉电池改成直接供电。另外，设备要放在通风的地方，不要塞进封闭的抽屉。电池一旦鼓包就停用。

## 旧电脑：做家庭服务器

### 先选底座

旧电脑变成服务器的第一步是决定装什么系统。常见的选择有三档：

- 只想要 HA：官方支持在普通的 64 位 x86 电脑上直接装 [Home Assistant OS](https://www.home-assistant.io/installation/generic-x86-64)（[GitHub](https://github.com/home-assistant/operating-system)），整台机器就是智能家居的大脑。[16]
- 想省心地跑一批 Docker 应用：[CasaOS](https://casaos.zimaspace.com)（[GitHub](https://github.com/IceWhaleTech/CasaOS)）、[ZimaOS](https://www.zimaspace.com/zimaos) 和 [HexOS](https://hexos.com) 都提供应用商店式的界面。Level1Techs 论坛有一个帖子专门比较第一台家用服务器该选哪个。[15]
- 想要完整的虚拟化：装 [Proxmox VE](https://www.proxmox.com/en/products/proxmox-virtual-environment/overview)，在上面开多个虚拟机和容器，分别跑 HA、Pi-hole、Docker。学习成本最高，灵活度也最高。

### 值得跑的服务

| 用途 | 项目 | 说明 |
| --- | --- | --- |
| 家庭相册 | [Immich](https://immich.app)、[PhotoPrism](https://www.photoprism.app)（[GitHub](https://github.com/photoprism/photoprism)） | Immich 是 Google 相册的自建替代，带人脸识别和语义搜索 |
| 影音库 | [Jellyfin](https://jellyfin.org)（[GitHub](https://github.com/jellyfin/jellyfin)）、[Plex](https://www.plex.tv) | Jellyfin 开源；自动整理片库可以配 [Sonarr](https://sonarr.tv)、[Radarr](https://radarr.video) 等，统称 *arr，文档在 [Servarr Wiki](https://wiki.servarr.com) |
| 文件共享与同步 | [Samba](https://www.samba.org)、[Syncthing](https://syncthing.net)（[GitHub](https://github.com/syncthing/syncthing)） | Samba 共享目录还可以作为 Mac 的时间机器网络备份目标 |
| 全屋去广告 | [Pi-hole](https://pi-hole.net)（[GitHub](https://github.com/pi-hole/pi-hole)）、[AdGuard Home](https://github.com/AdguardTeam/AdGuardHome) | 在 DNS 层面拦截广告和跟踪域名 |
| 远程访问 | [Tailscale](https://tailscale.com)（[GitHub](https://github.com/tailscale/tailscale)）、[Cloudflare Tunnel](https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/) | 在外面访问家里的服务，不用在路由器上开端口 |
| 密码管理 | [Vaultwarden](https://github.com/dani-garcia/vaultwarden) | 兼容 Bitwarden 客户端的轻量服务端 |
| 文件与协作 | [Nextcloud](https://nextcloud.com)（[GitHub](https://github.com/nextcloud/server)） | 自建网盘、日历和通讯录 |
| 纸质文件归档 | [Paperless-ngx](https://github.com/paperless-ngx/paperless-ngx) | 扫描件自动 OCR、打标签、全文检索 |

关于 NAS 要多说一句。笔记本的硬盘位很少，不适合做大容量的磁盘阵列，更适合当轻量的共享和备份节点。几篇文章都提到同一个容易混淆的地方：把文件从一个地方挪到服务器上只是迁移，数据仍然只有一份，算不上备份。[13][14]

### 笔记本的电池是一台免费的 UPS

笔记本当服务器有一个台式机没有的好处：停电时电池能撑一段时间。它的待机功耗也低，ZimaSpace 的文章里有一个实测数字，一台旧笔记本同时跑多个服务大约 3.5W。[13] 这是厂商博客里的单个案例，我没有自己测过，只能当作量级参考。

电池的问题和手机一样，可以让 HA 自己处理：读取笔记本的电量，充到 80% 时让智能插座断电，降到 20% 时再通电。

### 开发和 AI 相关

有两个现成的用法。一个是把旧电脑注册成 [GitHub Actions 的自托管 runner](https://docs.github.com/en/actions/concepts/runners/self-hosted-runners)，跑测试不消耗云端的分钟数。另一个需要一块 8GB 以上显存的显卡，旧台式机可以用 Ollama 跑 7B 到 14B 的模型，用 Whisper 做语音转写，或者用 [ComfyUI](https://github.com/Comfy-Org/ComfyUI)、[Stable Diffusion WebUI](https://github.com/AUTOMATIC1111/stable-diffusion-webui) 生成图片。

我自己想到的还有四个：

- 浏览器自动化专用机：7×24 小时跑 [Playwright](https://playwright.dev)（[GitHub](https://github.com/microsoft/playwright)）任务，和主力机隔离，崩了也不影响工作。
- Agent 沙箱：给 AI agent 一台可以随便折腾的物理机，放开权限跑长任务，坏了重装。
- 局域网模型网关：用 LiteLLM 这类网关统一全家设备调用大模型的入口，顺便统一记账和限额。
- 监控站：[FreshRSS](https://freshrss.org)（[GitHub](https://github.com/FreshRSS/FreshRSS)）聚合订阅，[changedetection.io](https://github.com/dgtlmoon/changedetection.io) 监控页面变化，用来盯机票价格和商品降价。

### 其他去处

- 复古游戏机：装 [Batocera](https://batocera.org) 或 [RetroArch](https://www.retroarch.com)（[GitHub](https://github.com/libretro/RetroArch)），接电视和手柄。
- 游戏串流：旧电脑带独立显卡的话，用 [Sunshine](https://github.com/SunshineStream/Sunshine) 做主机端，[Moonlight](https://moonlight-stream.org)（[GitHub](https://github.com/moonlight-stream/moonlight-qt)）做客户端，把游戏串流到电视或平板上。
- 家庭影院电脑：装 [Kodi](https://kodi.tv)（[GitHub](https://github.com/xbmc/xbmc)）接电视。
- 给孩子或老人的上网机：装 [ChromeOS Flex](https://support.google.com/chromeosflex/answer/11552529) 或轻量 Linux，老机器也流畅，也不容易中毒。
- 第二台工作机：这是我的设想，旧 MacBook 合上盖子接显示器，专门跑 [Obsidian](https://obsidian.md)、日程和微信，主力机只做开发。
- 拆机再利用：笔记本屏幕配一块几十元的驱动板可以改成便携显示器，旧硬盘装进硬盘盒当冷备份。
- 捐赠或回收：不想折腾的话，可以捐给学校或公益项目，或者走 [Apple](https://www.apple.com/shop/trade-in)、[三星](https://www.samsung.com/us/trade-in/)的以旧换新。交出去之前先抹掉数据。

## 把几台设备串起来

单独用一台旧设备，得到的是一个小工具。几台串起来，可以组成一套家庭系统。下面是我画的设想图，还没有搭出来：

<figure class="viz">
<div class="viz-card"><div class="viz-kicker">旧笔记本 · 大脑</div><div class="viz-title">跑所有服务的家庭服务器</div><div class="viz-chips"><span>Home Assistant</span><span>Immich</span><span>Jellyfin</span><span>Pi-hole</span><span>Tailscale</span><span>小服务 / 爬虫</span></div></div>
<div class="viz-link">↓ 局域网 + Tailscale</div>
<div class="viz-row">
<div class="viz-card"><div class="viz-kicker">旧平板 A · 客厅</div><div class="viz-chips"><span>家庭看板</span><span>相框</span><span>语音管家</span></div></div>
<div class="viz-card"><div class="viz-kicker">旧平板 B · 书桌</div><div class="viz-chips"><span>Mac 状态屏</span><span>宏按键</span><span>AI agent 监控</span></div></div>
<div class="viz-card"><div class="viz-kicker">旧手机 × N</div><div class="viz-chips"><span>监控摄像头</span><span>短信转发</span><span>网络探针</span></div></div>
</div>
<figcaption>设想中的组合：一台旧笔记本当大脑，平板和手机各司其职</figcaption>
</figure>

各部分之间的关系是这样的：

- 客厅平板的相框照片来自笔记本上的 Immich，不依赖云服务。
- 手机摄像头的画面进 HA，有人移动时推送到主力手机，客厅平板同时弹出画面。
- 书桌平板显示 Mac 状态和正在跑的 AI 任务，需要人工确认时整屏变黄。
- 所有设备都接入 Tailscale，出门也能访问。

## 我打算按什么顺序试

顺序的原则是先做零成本、十分钟能见效的，用结果决定要不要继续投入。

<figure class="viz">
<ol class="viz-steps">
<li>平板用 Sidecar 或 Deskreen 当 Mac 副屏，摆一周看用不用<div class="viz-chips"><span>成本 0</span><span>10 分钟</span></div></li>
<li>另一台平板或手机做共享相簿相框<div class="viz-chips"><span>成本 0</span><span>10 分钟</span></div></li>
<li>一部旧手机用 Alfred Camera 当监控，或用连续互通相机当网络摄像头<div class="viz-chips"><span>成本 0</span><span>15 分钟</span></div></li>
<li>旧笔记本装 CasaOS 或 HA OS，跑 Immich 和 Pi-hole<div class="viz-chips"><span>成本 0</span><span>半天</span></div></li>
<li>确认状态屏会常看之后，写 Mac 本地仪表盘网页<div class="viz-chips"><span>成本 0</span><span>1 到 2 天</span></div></li>
<li>语音管家、AI agent 监控屏、短信转发<div class="viz-chips"><span>0 到几十元（支架、SIM 卡）</span><span>按需</span></div></li>
</ol>
<figcaption>从零成本、十分钟能见效的开始</figcaption>
</figure>

图里的时间是我的估计。通用的配件只有三样：支架或磁吸墙挂、短的 USB-C 线，以及用来控制充电的智能插座。

## 动手之前的四件事

1. 先恢复出厂设置、抹掉数据，只装必需的 app，并关掉自动更新，避免老系统被新版本拖慢。
2. 常亮的屏幕要考虑烧屏和耗电。OLED 屏用深色界面，让内容轻微漂移，夜间自动熄屏。Fully Kiosk 可以按时间或检测到动作时亮屏。
3. 长期插电的设备要限制充电或定时断电，电池鼓包立即停用。
4. 已经停止系统更新的设备，不登录主力账号，不暴露到公网，只在局域网或 Tailscale 里使用。

第四条我认为是最容易被省略的一条。一台不再收到安全补丁的手机挂在公网上，等于给家里的网络多开了一扇没人看管的门。

## 还没验证的部分

回头看这份清单，「现成」的部分我比较有把握：相框、副屏、监控、HA 和自托管服务都有成熟的软件，也有多篇独立的教程互相印证。

「设想」的部分只说明这些组合在原理上说得通。Mac 状态屏会不会常看、语音管家的延迟能不能接受、手机贴在猫眼上能不能对上焦，这些都要等实际摆上一周才有答案。我会从上面那份顺序的前三步开始。

## 参考资料

1. [8 easy ways to reuse your old Android phone or tablet — Android Central](https://www.androidcentral.com/eight-ways-easily-reuse-your-old-android-phone-tablet)
2. [How To Repurpose Your Old Tablet Into A Digital Picture Frame — SlashGear](https://www.slashgear.com/1226041/how-to-repurpose-your-old-tablet-into-a-digital-picture-frame)
3. [Turn Your Old Android Tablet Into A Digital Picture Frame — BGR](https://bgr.com/2053298/how-to-use-old-android-tablet-digital-picture-frame-guide)
4. [Your old iPad is more useful than you think — Tom's Guide](https://www.tomsguide.com/computing/ipads/your-old-ipad-is-more-useful-than-you-think-5-ways-to-give-it-new-life)
5. [How to use a tablet as a second monitor — Parkablogs](https://www.parkablogs.com/content/how-use-tablet-second-monitor)
6. [Spacedesk Alternatives for Mac — AlternativeTo](https://alternativeto.net/software/spacedesk/?platform=mac)
7. [Who needs a fancy Stream Deck when you have your phone — PCWorld](https://www.pcworld.com/article/3268834/who-needs-a-fancy-stream-deck-when-you-have-your-phone.html)
8. [How I Turned a OnePlus 3T into a postmarketOS Home Server — HackerNoon](https://hackernoon.com/lite/how-i-turned-a-oneplus-3t-into-a-postmarketos-home-server)
9. [Run LLMs on Old Phones — InsiderLLM](https://insiderllm.com/guides/run-llms-old-phones-mobile-inference/)
10. [Converting an Android phone into a personal LLM server — DEV](https://dev.to/danny_odii/run-ai-locally-converting-an-android-phone-into-into-a-personal-llm-server-31po)
11. [Build a 24/7 Headless AI Agent Server on an Old Phone — RoboRhythms](https://www.roborhythms.com/build-headless-ai-agent-server-old-phone/)
12. [IT 之家：旧手机再利用相关报道](https://www.ithome.com/0/964/204.htm)
13. [Can you use an old laptop as a home server — ZimaSpace](https://shop.zimaspace.com/pl/blogs/support-tips/can-you-use-an-old-laptop-as-a-home-server)
14. [Repurposed laptop home server setup — Geeky Gadgets](https://www.geeky-gadgets.com/repurposed-laptop-home-server-setup/)
15. [HexOS, FygoOS or Proxmox — Level1Techs 论坛](https://forum.level1techs.com/t/our-first-home-server-doesn-t-have-to-be-complicated-hexos-fygoos-or-proxmox-old-hardware/257747)
16. [Generic x86-64 安装指南 — Home Assistant](https://www.home-assistant.io/installation/generic-x86-64)
17. [Using a local LLM to automate an Android device — Engineered.at](https://engineered.at/articles/using-a-local-llm-to-automate-an-android-device)
18. [Nura（原 postmarketOS）官网](https://nura.eco)
19. [OlliteRT: Turn Old Android Phones into Local LLM API Servers — BestHub](https://www.besthub.dev/articles/ollitert-turn-old-android-phones-into-local-llm-api-servers-955f868e6527)
