---
title: What to Do with an Old Phone, Tablet or Laptop
description: Research notes on putting retired devices back to work. A tablet suits an always-on screen, a phone suits sensor and small-server jobs, and an old computer suits a home server. Links to more than 100 open-source projects and apps, with ready-made options kept apart from ideas I have not tested, plus the battery and security issues of leaving old hardware plugged in.
pubDate: 2026-11-17
tags: ['self-hosting', 'home-server', 'hardware']
---

I wanted to find work for the old phones, tablets and computers I have lying around, so I read through a round of reviews and tutorials in English and Chinese, from Android Central, Tom's Guide, PCWorld and HackerNoon to ITHome and Bilibili columns, and added some ideas of my own. [1][4][7][8][12] These are my notes.

## Each kind of device has one role it fits best

With a few dozen uses laid side by side, the division of labour is fairly clear:

<figure class="viz">
<div class="viz-row">
<div class="viz-card"><div class="viz-kicker">Old tablet</div><div class="viz-title">An always-on screen</div><div class="viz-chips"><span>Photo frame</span><span>Family dashboard</span><span>Second display</span><span>Control panel</span></div></div>
<div class="viz-card"><div class="viz-kicker">Old phone</div><div class="viz-title">Small sensor + small server</div><div class="viz-chips"><span>Security camera</span><span>Webcam</span><span>Termux server</span><span>Small local models</span></div></div>
<div class="viz-card"><div class="viz-kicker">Old computer</div><div class="viz-title">Home server</div><div class="viz-chips"><span>Home Assistant</span><span>Photo library</span><span>Media library</span><span>Self-hosted services</span></div></div>
</div>
<figcaption>The role each kind of device fits best, with typical uses</figcaption>
</figure>

A tablet has a large screen and can stand upright. A phone has a camera, a microphone, sensors and a mobile connection, and idles at a few watts. An old computer has an x86 processor and a large disk, so it can run full server software; if it is a laptop, the built-in battery also works as a free uninterruptible power supply.

I noticed one pattern while sorting the material: most of the screen uses come down to a full-screen, always-on browser showing a web page. A photo frame, a calendar, a home control panel and a status screen differ only in what the page shows. That gives a simple order of preference: use an existing app first, and write a web page only when the app falls short.

## Old tablets: an always-on screen

### Photo frames, calendars and home panels

A digital photo frame has the lowest barrier to entry, and SlashGear and BGR each have a full tutorial. [2][3] The method is to open a slideshow of a shared album on the tablet. [Google Photos](https://www.google.com/photos/about/) and [iCloud Shared Albums](https://support.apple.com/en-us/108314) both support this, and when family members add photos to the album, the frame picks them up. On Android there is a dedicated frame app, [Fotoo](https://play.google.com/store/apps/details?id=com.bo.fotoo). To keep photos off the cloud, the web client of the self-hosted library [Immich](https://immich.app) ([GitHub](https://github.com/immich-app/immich)) can also run a slideshow.

Calendar and to-do screens work the same way. The least effort is opening the Google Calendar week view in full screen. For something that looks more like a finished product, there is [DAKboard](https://dakboard.com), a commercial service with a free tier, and the open-source [MagicMirror²](https://magicmirror.builders) ([GitHub](https://github.com/MagicMirrorOrg/MagicMirror)), which was written for smart-mirror builds and works just as well in a browser. Pages from [Notion](https://www.notion.com) or [TickTick](https://ticktick.com) can go straight on the screen too.

A smart-home control panel needs two things: a [Home Assistant](https://www.home-assistant.io) dashboard ([GitHub](https://github.com/home-assistant/core); HA from here on), and a browser that can lock the tablet to that page. The one most often recommended on Android is [Fully Kiosk Browser](https://www.fully-kiosk.com), which can wake the screen on motion, switch it off on a schedule and prevent users from leaving the page. [1] The iPad has no equivalent app, but the built-in [Guided Access](https://support.apple.com/en-us/111795) can lock the device to Safari.

A few other uses need no special software: recipes, timers and the shopping list in the kitchen; a large clock and white noise on the bedside table; the Wi-Fi QR code, the weather and a "take your keys" reminder by the front door.

The next three are my own ideas, and I have not built any of them:

- A family message board: self-host a shared whiteboard with [Excalidraw](https://github.com/excalidraw/excalidraw) or [tldraw](https://github.com/tldraw/tldraw); the family writes on their phones and the tablet displays it.
- A routine and points wall for children: daily tasks earn stars, and the screen plays a short celebration when the list is done.
- A companion screen for an elderly relative: a large clock, medication reminders and one big button for a video call, with every other app blocked by Guided Access or Fully Kiosk.

### Voice assistants

The simplest setup is a stand plus the [ChatGPT](https://chatgpt.com), [Claude](https://claude.com/download) or [Doubao](https://www.doubao.com) app in voice mode.

In a home that runs HA, install [Home Assistant Companion](https://companion.home-assistant.io) and set it as the system's default assistant; saying "turn on the living-room light" then controls the device. HA's own voice assistant, [Assist](https://www.home-assistant.io/voice_control/), can also use a large language model as its conversation agent.

Beyond that are my own ideas. One is a household-butler screen: the tablet normally shows a dashboard, and on a wake word it calls a model API to answer, operate HA and add items to the family to-do list. If every device in the house should share one model endpoint, an open-source gateway such as [LiteLLM](https://github.com/BerriAI/litellm) can run on the home server. The other two are an English-practice page for children with a fixed prompt, a limited set of topics and a time limit, and a live-caption screen beside the desk that transcribes cross-language video calls with [Whisper](https://github.com/openai/whisper) or [whisper.cpp](https://github.com/ggml-org/whisper.cpp). All three are harder than anything above, and I have only sketched how they would work.

### Second displays and macro pads

Which tool turns a tablet into a second display depends on the device pairing. Every row below except Sidecar comes from the Parkablogs comparison and the AlternativeTo listing. [5][6]

| Option | Works with | Notes |
| --- | --- | --- |
| [Sidecar](https://support.apple.com/en-us/102597) | iPad + Mac | Built into the system and free; also turns the iPad into a drawing tablet with Apple Pencil |
| [Deskreen](https://deskreen.com) ([GitHub](https://github.com/pavlobu/deskreen)) | Any device with a browser | Free and open source; the tablet only needs a browser |
| [Side Screen](https://github.com/tranvuongquocdat/SideScreen) | Android + Mac | Open source (MIT); wired over USB-C or wireless over Wi-Fi |
| [Tab Display](https://tab-display.enfpdev.com) | Android or iPad + Mac / Windows | Cheaper than Duet, with fewer features |
| [Duet Display](https://www.duetdisplay.com) | Multiple platforms | The long-established option, now subscription-based |
| [Spacedesk](https://www.spacedesk.net) | Windows hosts only | Not usable with a Mac |

The other ready-made direction is a macro pad: a touchscreen standing in for Elgato's physical Stream Deck. PCWorld has an article on exactly this. [7] There are four apps to choose from:

- [Macro Deck](https://macro-deck.app) ([GitHub](https://github.com/Macro-Deck-App/Macro-Deck)): open source; the tablet connects through a browser.
- [Touch Portal](https://www.touch-portal.com): a one-off purchase.
- [Deckboard](https://deckboard.app): Android devices paired with Windows.
- [Elgato Stream Deck Mobile](https://www.elgato.com/us/en/s/downloads): the official app; the free version has 6 keys.

A macro pad suits an old phone equally well, since a phone screen holds 6 to 12 keys comfortably.

I have a few more ideas of my own in the second-display direction:

- A developer cockpit: CI status, the pull-request list, and Cloudflare Workers request volume and errors.
- An AI agent monitor: running Claude Code or Codex sessions, token usage and task progress, with a highlight when a session is waiting for human confirmation.
- A focus light: the whole screen turns red during a meeting or a focus block, hangs by the door, and follows the Mac's Focus mode.
- A permanent reference screen: a shortcut cheat sheet, API documentation, a design file, or a teleprompter while recording video.

### The one I most want to build: a Mac status screen

Showing the computer's status on a tablet is the idea from this research that I most want to make real. I worked out three routes, each more customised than the last.

Route A needs no code. Connect the tablet as an extended display with Sidecar or Deskreen, then turn on "Displays have separate Spaces" under System Settings → Desktop & Dock so that the menu bar appears on every screen. Then drag the status window of [Stats](https://github.com/exelban/stats) (open source) or [iStat Menus](https://bjango.com/mac/istatmenus/) onto the tablet and leave it there. The cost of this route is that the tablet has to stay connected to the Mac and takes up one of its display outputs.

Route B runs a local web dashboard on the Mac, and the tablet only displays it:

<figure class="viz">
<div class="viz-card"><div class="viz-kicker">Mac · collect</div><div class="viz-title">A small service reads these states</div><div class="viz-chips"><span>CPU</span><span>Memory</span><span>Network speed</span><span>Battery</span><span>Frontmost app</span><span>Now playing</span><span>Next calendar event</span><span>Unread count</span><span>AI agent sessions</span></div></div>
<div class="viz-link">↓</div>
<div class="viz-card"><div class="viz-kicker">Mac · serve</div><div class="viz-title">http://mac.local:8080</div><div class="viz-note">A responsive page written in Python or Node, refreshed live over SSE or WebSocket</div></div>
<div class="viz-link">↓ page opened over the local network　·　↑ touch buttons control the Mac</div>
<div class="viz-card"><div class="viz-kicker">Tablet · display</div><div class="viz-title">Open the address in full screen</div><div class="viz-chips"><span>Android: Fully Kiosk Browser</span><span>iPad: Safari + Guided Access</span></div></div>
<figcaption>Data flow in Route B: the Mac collects and serves the page, and the tablet only displays it</figcaption>
</figure>

With this design the tablet is only a browser, so a device of any age will do, and the Mac does not have to drive another display. The page can also carry touch buttons that control the Mac in return: lock the screen, skip a track, mute the microphone. Before writing anything, there is an existing tool to borrow: [Glances](https://github.com/nicolargo/glances) ships with a web interface, and running `glances -w` produces a system-monitoring page. I plan to look at that first and write my own only if it is not enough.

Route C suits a home that already runs HA. HA Companion on the Mac reports battery level, active state, and camera and microphone use as sensors; HA's own [System Monitor integration](https://www.home-assistant.io/integrations/systemmonitor/) covers the machine HA itself runs on. The tablet shows the HA dashboard, so computer status, lights, door locks and weather share one screen.

The order I have set for myself is Route A for a week. If I do look at that screen often, I will put time into Route B or C; if I barely glance at it, the idea stops there.

## Old phones: sensors and small servers

### Cameras

Home security and pet cameras are the most common destination for an old phone. [1] [Alfred Camera](https://alfred.camera) and [AtHome Camera](https://www.ichano.cn), which is popular in China, both use one phone as the camera and another as the viewer. [IP Webcam](https://play.google.com/store/apps/details?id=com.pas.webcam) opens an address on the local network that any browser can watch, which also makes it easy to feed into HA or the open-source [Frigate](https://frigate.video) ([GitHub](https://github.com/blakeblackshear/frigate)) for motion detection. With sound detection and a night light switched on, the same setup is a baby monitor.

The rear camera of an old phone is usually far better than a laptop's built-in one, so the phone also makes a good webcam. An iPhone with a Mac can use the built-in [Continuity Camera](https://support.apple.com/en-us/102546). An Android phone can use [DroidCam](https://droidcam.app) or [Camo](https://camo.com) and feed OBS or Zoom.

I have also thought about fixing a phone to the inside of the front door with its camera lined up with the peephole, and adding motion detection and notifications to make a smart peephole. This is only an idea; focus, power and mounting all need a real test before I know whether it works.

### Small servers and local models

With [Termux](https://termux.dev) installed ([GitHub](https://github.com/termux/termux-app); the [F-Droid](https://f-droid.org/packages/com.termux/) build is the recommended one), an Android phone becomes a small Linux machine that idles at a few watts and can run Python and Node scripts, scheduled jobs, scrapers and chat bots. [8][12]

Small local models can run on top of that. One path is installing [Ollama](https://ollama.com) ([GitHub](https://github.com/ollama/ollama)) or [llama.cpp](https://github.com/ggml-org/llama.cpp) inside Termux. [10] The other is the open-source app [OlliteRT](https://github.com/NightMean/OlliteRT): built on Google's LiteRT-LM runtime, it turns the phone into an OpenAI-compatible model server on the local network, has no chat interface of its own, and requires Android 12 or later. [19] Hardware expectations should stay modest: the InsiderLLM guide gives a range of 6 GB of RAM or more, on phones from 2021 onwards, for models of 0.5B to 2B parameters. [9]

People also run AI agents on a phone around the clock. The community has several scripts that install OpenClaw on Android, for example [openclaw-android](https://github.com/AidanPark/openclaw-android). [11] These are community-maintained install scripts and I have not read their contents, so downloading a script and reading it before running it is the safer course.

The most involved option is flashing real Linux. A HackerNoon author turned a OnePlus 3T into a postmarketOS home server. [8] While checking links I found that the project has been renamed: postmarketos.org now redirects to [Nura](https://nura.eco), whose home page says it was formerly known as postmarketOS. [18] The [device support list](https://wiki.nura.eco/wiki/Devices) is the first thing to check before flashing; a model that is not on it is generally not worth attempting.

### Uses that work offline

- Car navigation: a mount, an offline map such as the open-source [Organic Maps](https://organicmaps.app), and a dashcam app.
- A clean device: no SIM and no social apps, used only as a music player, an e-reader or a remote. Older models with an infrared emitter can act as a universal remote.
- Volunteer computing: donate processing power to research projects through [BOINC](https://boinc.berkeley.edu) ([GitHub](https://github.com/BOINC/boinc)). [Rainforest Connection](https://rfcx.org) started out using old phones to listen for the chainsaws of illegal logging in rainforests. [12]
- A real test device: when building an app or a website, it shows low-end performance more truthfully than an emulator.

### A few uses I came up with

The items below are my own list, and apart from the ones with a cited source, none has been tested.

An SMS and verification-code forwarder: put a spare SIM in the old phone, leave it at home, and use the open-source [SmsForwarder](https://github.com/pppscn/SmsForwarder) to pass messages on to Telegram or email. For an overseas number or a secondary SIM this is especially practical.

A "focus phone": only calls, messaging and maps installed, taken out in the evening or while spending time with the children, with the main phone left at home.

A home network probe: run speed tests and ping the gateway on a schedule, send a notification when the connection drops, and log the Wi-Fi signal in each room along the way.

An environment sensor station: a phone has light, pressure and acceleration sensors and a microphone, so it can log noise, or sit on the washing machine and send "the wash is done" when the vibration stops. To see what the sensor readings look like first, there is [phyphox](https://phyphox.org) from RWTH Aachen University.

An automation runner: use [Tasker](https://tasker.joaoapps.com), or [AutoX](https://github.com/aiselp/AutoX), a community fork of Auto.js, for repetitive jobs such as daily check-ins and price-drop alerts. Engineered.at also has an article on letting a local model operate Android apps directly. [17]

### Deal with the battery before leaving it plugged in

A phone that stays plugged in around the clock keeps its lithium battery at full charge, which risks swelling. I found three ways to handle it: turn on charge protection or an 80% charge limit in the system; cut power on a schedule with a smart plug; or, for those comfortable opening the device, remove the battery and power the phone directly. The device should also sit somewhere ventilated, not in a closed drawer. A swollen battery means the device is retired.

## Old computers: a home server

### Choose the base first

The first step in turning an old computer into a server is deciding which system to install. There are three common tiers:

- HA only: [Home Assistant OS](https://www.home-assistant.io/installation/generic-x86-64) ([GitHub](https://github.com/home-assistant/operating-system)) is officially supported on an ordinary 64-bit x86 computer, and the whole machine becomes the brain of the smart home. [16]
- A set of Docker apps with little effort: [CasaOS](https://casaos.zimaspace.com) ([GitHub](https://github.com/IceWhaleTech/CasaOS)), [ZimaOS](https://www.zimaspace.com/zimaos) and [HexOS](https://hexos.com) all offer an app-store style interface. A Level1Techs forum thread compares the choices for a first home server. [15]
- Full virtualisation: install [Proxmox VE](https://www.proxmox.com/en/products/proxmox-virtual-environment/overview) and run several virtual machines and containers for HA, Pi-hole and Docker. It has the steepest learning curve and the most flexibility.

### Services worth running

| Purpose | Project | Notes |
| --- | --- | --- |
| Family photos | [Immich](https://immich.app), [PhotoPrism](https://www.photoprism.app) ([GitHub](https://github.com/photoprism/photoprism)) | Immich is a self-hosted alternative to Google Photos, with face recognition and semantic search |
| Media library | [Jellyfin](https://jellyfin.org) ([GitHub](https://github.com/jellyfin/jellyfin)), [Plex](https://www.plex.tv) | Jellyfin is open source; library automation uses [Sonarr](https://sonarr.tv), [Radarr](https://radarr.video) and the rest of the *arr family, documented on the [Servarr Wiki](https://wiki.servarr.com) |
| File sharing and sync | [Samba](https://www.samba.org), [Syncthing](https://syncthing.net) ([GitHub](https://github.com/syncthing/syncthing)) | A Samba share can also be a network Time Machine destination for a Mac |
| Network-wide ad blocking | [Pi-hole](https://pi-hole.net) ([GitHub](https://github.com/pi-hole/pi-hole)), [AdGuard Home](https://github.com/AdguardTeam/AdGuardHome) | Blocks advertising and tracking domains at the DNS level |
| Remote access | [Tailscale](https://tailscale.com) ([GitHub](https://github.com/tailscale/tailscale)), [Cloudflare Tunnel](https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/) | Reach home services from outside without opening ports on the router |
| Passwords | [Vaultwarden](https://github.com/dani-garcia/vaultwarden) | A lightweight server compatible with Bitwarden clients |
| Files and collaboration | [Nextcloud](https://nextcloud.com) ([GitHub](https://github.com/nextcloud/server)) | Self-hosted file storage, calendar and contacts |
| Paper documents | [Paperless-ngx](https://github.com/paperless-ngx/paperless-ngx) | OCR, tagging and full-text search for scanned documents |

NAS use needs one more note. A laptop has very few drive bays, so it is a poor base for a large disk array and a better fit as a light sharing and backup node. Several articles make the same distinction: moving files from one place onto the server is a migration, and the data still exists in one copy only, so it does not count as a backup. [13][14]

### A laptop battery is a free UPS

A laptop has one advantage over a desktop as a server: the battery carries it through a power cut for a while. Its idle power draw is also low. The ZimaSpace article quotes a measured figure of about 3.5 W for an old laptop running several services. [13] That is a single case from a vendor blog and I have not measured it myself, so I treat it as an order of magnitude.

The battery problem is the same as with phones, and HA can handle it: read the laptop's charge level, have a smart plug cut power at 80%, and restore it at 20%.

### Development and AI

Two uses are ready-made. One is registering the old computer as a [self-hosted runner for GitHub Actions](https://docs.github.com/en/actions/concepts/runners/self-hosted-runners), so tests no longer consume hosted minutes. The other needs a graphics card with 8 GB of VRAM or more: an old desktop can then run 7B to 14B models with Ollama, transcribe speech with Whisper, or generate images with [ComfyUI](https://github.com/Comfy-Org/ComfyUI) or [Stable Diffusion WebUI](https://github.com/AUTOMATIC1111/stable-diffusion-webui).

I thought of four more:

- A dedicated browser-automation machine: [Playwright](https://playwright.dev) ([GitHub](https://github.com/microsoft/playwright)) jobs running 24/7, isolated from the main computer, so a crash does not interrupt work.
- An agent sandbox: a physical machine an AI agent is free to break, running long tasks with loose permissions and reinstalled when it goes wrong.
- A LAN model gateway: a gateway such as LiteLLM gives every device in the house one entry point for model calls, with shared accounting and quotas.
- A monitoring station: [FreshRSS](https://freshrss.org) ([GitHub](https://github.com/FreshRSS/FreshRSS)) aggregates feeds and [changedetection.io](https://github.com/dgtlmoon/changedetection.io) watches pages for changes, for tracking flight prices and product discounts.

### Other destinations

- A retro games console: install [Batocera](https://batocera.org) or [RetroArch](https://www.retroarch.com) ([GitHub](https://github.com/libretro/RetroArch)) and connect a TV and a controller.
- Game streaming: if the old computer has a dedicated graphics card, [Sunshine](https://github.com/SunshineStream/Sunshine) is the host and [Moonlight](https://moonlight-stream.org) ([GitHub](https://github.com/moonlight-stream/moonlight-qt)) the client, streaming games to a TV or tablet.
- A home-theatre PC: install [Kodi](https://kodi.tv) ([GitHub](https://github.com/xbmc/xbmc)) and connect it to the TV.
- A web machine for a child or an elderly relative: [ChromeOS Flex](https://support.google.com/chromeosflex/answer/11552529) or a lightweight Linux runs smoothly on old hardware and is hard to infect.
- A second work machine: this one is my idea. An old MacBook, lid closed and connected to a monitor, runs only [Obsidian](https://obsidian.md), the calendar and messaging, while the main machine does nothing but development.
- Reuse the parts: a laptop panel plus an inexpensive driver board becomes a portable monitor, and an old drive in an enclosure becomes cold backup storage.
- Donate or recycle: for those who would rather not tinker, give it to a school or a charity, or use the [Apple](https://www.apple.com/shop/trade-in) or [Samsung](https://www.samsung.com/us/trade-in/) trade-in programmes. Wipe the data before handing it over.

## Linking several devices together

One old device on its own is a small tool. Several linked together can form a household system. The diagram below is my sketch of one, and I have not built it:

<figure class="viz">
<div class="viz-card"><div class="viz-kicker">Old laptop · the brain</div><div class="viz-title">The home server that runs every service</div><div class="viz-chips"><span>Home Assistant</span><span>Immich</span><span>Jellyfin</span><span>Pi-hole</span><span>Tailscale</span><span>Small services / scrapers</span></div></div>
<div class="viz-link">↓ local network + Tailscale</div>
<div class="viz-row">
<div class="viz-card"><div class="viz-kicker">Tablet A · living room</div><div class="viz-chips"><span>Family dashboard</span><span>Photo frame</span><span>Voice butler</span></div></div>
<div class="viz-card"><div class="viz-kicker">Tablet B · desk</div><div class="viz-chips"><span>Mac status screen</span><span>Macro keys</span><span>AI agent monitor</span></div></div>
<div class="viz-card"><div class="viz-kicker">Old phones × N</div><div class="viz-chips"><span>Security camera</span><span>SMS forwarding</span><span>Network probe</span></div></div>
</div>
<figcaption>The planned combination: an old laptop as the brain, with tablets and phones each doing one job</figcaption>
</figure>

The parts relate to each other like this:

- The photo frame on the living-room tablet draws from Immich on the laptop, with no cloud service involved.
- Phone camera feeds go into HA; when someone moves, the main phone gets a notification and the living-room tablet pops up the feed.
- The desk tablet shows Mac status and running AI tasks, and the whole screen turns yellow when one needs human confirmation.
- Every device joins Tailscale, so all of it is reachable away from home.

## The order I plan to try things in

The principle is to start with what costs nothing and shows a result in ten minutes, and let the result decide whether to invest more.

<figure class="viz">
<ol class="viz-steps">
<li>Use a tablet as a Mac second display with Sidecar or Deskreen, and leave it out for a week to see whether it gets used<div class="viz-chips"><span>Cost 0</span><span>10 minutes</span></div></li>
<li>Turn another tablet or phone into a shared-album photo frame<div class="viz-chips"><span>Cost 0</span><span>10 minutes</span></div></li>
<li>Use an old phone as a security camera with Alfred Camera, or as a webcam with Continuity Camera<div class="viz-chips"><span>Cost 0</span><span>15 minutes</span></div></li>
<li>Install CasaOS or HA OS on the old laptop and run Immich and Pi-hole<div class="viz-chips"><span>Cost 0</span><span>Half a day</span></div></li>
<li>Once the status screen has proved it gets looked at, write the local Mac dashboard page<div class="viz-chips"><span>Cost 0</span><span>1 to 2 days</span></div></li>
<li>Voice butler, AI agent monitor, SMS forwarding<div class="viz-chips"><span>From 0 to a few dollars (stand, SIM)</span><span>As needed</span></div></li>
</ol>
<figcaption>Start with what costs nothing and works in ten minutes</figcaption>
</figure>

The times in the figure are my estimates. Only three accessories are common to all of this: a stand or magnetic wall mount, a short USB-C cable, and a smart plug to control charging.

## Four things to do before starting

1. Factory-reset and wipe the device first, install only the apps it needs, and turn off automatic updates so that newer versions do not slow an old system down.
2. An always-on screen raises burn-in and power questions. On an OLED panel, use a dark interface, let the content shift slightly, and switch the screen off automatically at night. Fully Kiosk can wake the screen on a schedule or on motion.
3. A device that stays plugged in needs a charge limit or scheduled power cuts, and a swollen battery means it is retired at once.
4. A device that no longer receives system updates does not get the main account, is not exposed to the public internet, and is used only on the local network or inside Tailscale.

I think the fourth is the one most easily skipped. A phone that no longer gets security patches, left reachable from the internet, is one more unattended door into the home network.

## What I have not verified

Looking back over the list, I am fairly confident about the ready-made part: photo frames, second displays, cameras, HA and self-hosted services all have mature software and several independent tutorials that agree with each other.

The ideas only show that the combinations make sense in principle. Whether I will look at a Mac status screen often, whether the voice butler's latency is acceptable, whether a phone taped to a peephole can focus: each of these needs a week of real use to answer. I will start with the first three steps of the order above.

## References

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
12. [ITHome: coverage of reusing old phones (in Chinese)](https://www.ithome.com/0/964/204.htm)
13. [Can you use an old laptop as a home server — ZimaSpace](https://shop.zimaspace.com/pl/blogs/support-tips/can-you-use-an-old-laptop-as-a-home-server)
14. [Repurposed laptop home server setup — Geeky Gadgets](https://www.geeky-gadgets.com/repurposed-laptop-home-server-setup/)
15. [HexOS, FygoOS or Proxmox — Level1Techs forum](https://forum.level1techs.com/t/our-first-home-server-doesn-t-have-to-be-complicated-hexos-fygoos-or-proxmox-old-hardware/257747)
16. [Generic x86-64 installation guide — Home Assistant](https://www.home-assistant.io/installation/generic-x86-64)
17. [Using a local LLM to automate an Android device — Engineered.at](https://engineered.at/articles/using-a-local-llm-to-automate-an-android-device)
18. [Nura (formerly postmarketOS)](https://nura.eco)
19. [OlliteRT: Turn Old Android Phones into Local LLM API Servers — BestHub](https://www.besthub.dev/articles/ollitert-turn-old-android-phones-into-local-llm-api-servers-955f868e6527)
