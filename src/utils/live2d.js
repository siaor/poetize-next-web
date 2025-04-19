/*
 * Live2D Widget
 * https://github.com/stevenjoezhang/live2d-widget
 */


import constant from "./constant";


// 注意：live2d_path 参数应使用绝对路径
const live2d_path = "/sys/live2d/";

// 加载 waifu.css live2d.min.js
if (screen.width > 768) {
  Promise.all([
    loadExternalResource(live2d_path + "waifu.css", "css"),
    loadExternalResource(live2d_path + "live2d.min.js", "js")
  ]).then(() => {
    let modelPath = localStorage.getItem("modelPath");
    if (!modelPath) {
      modelPath = constant.modelPath;
    }

    initWidget({
      waifuPath: constant.baseURL + constant.waifuPath,
      modelPath: modelPath
    });
  });
}

// 封装异步加载资源的方法
function loadExternalResource(url, type) {
  return new Promise((resolve, reject) => {
    let tag;

    if (type === "css") {
      tag = document.createElement("link");
      tag.rel = "stylesheet";
      tag.href = url;
    } else if (type === "js") {
      tag = document.createElement("script");
      tag.src = url;
    }

    if (tag) {
      tag.onload = () => resolve(url);
      tag.onerror = () => reject(url);
      document.head.appendChild(tag);
    }
  });
}

function initWidget(config) {
  document.body.insertAdjacentHTML("beforeend", `<div id="waifu-toggle"><span>Poo ↑ </span></div>`);
  const toggle = document.getElementById("waifu-toggle");
  toggle.addEventListener("click", () => {
    toggle.classList.remove("waifu-toggle-active");
    if (toggle.getAttribute("first-time")) {
      loadWidget(config);
      toggle.removeAttribute("first-time");
    } else {
      localStorage.removeItem("waifu-display");
      document.getElementById("waifu").style.display = "";
      setTimeout(() => {
        document.getElementById("waifu").style.bottom = 0;
      }, 0);
    }
  });
  if (localStorage.getItem("waifu-display") && Date.now() - localStorage.getItem("waifu-display") <= 86400000) {
    toggle.setAttribute("first-time", true);
    setTimeout(() => {
      toggle.classList.add("waifu-toggle-active");
    }, 0);
  } else {
    loadWidget(config);
  }
}

function loadWidget(config) {
  // 配置路径
  let { waifuPath, modelPath } = config;
  let modelList, idx = 0;

  // 插入html
  localStorage.removeItem("waifu-display");
  localStorage.removeItem("waifu-text");
  document.body.insertAdjacentHTML("beforeend",
    `<div id="waifu">
			<div id="waifu-tips"></div>
			<canvas id="live2d" width="800" height="800"></canvas>
      <!-- 工具 -->
			<div id="waifu-tool">
				<span class="fa fa-lg fa-comment" title="听我说"></span>
				<span class="fa fa-lg fa-street-view" title="换肤"></span>
				<span class="fa fa-lg fa-mouse-pointer" title="鼠标特效"></span>
				<span class="fa fa-lg fa-times" title="隐藏"></span>
			</div>
		</div>`);
  setTimeout(() => {
    const waifuDom = document.getElementById("waifu");
    waifuDom.style.bottom = 0;
    buildDrag(waifuDom);
  }, 0);

  // 检测用户活动状态，并在空闲时显示消息
  let userAction = false,
    userActionTimer,
    messageTimer,
    messageArray = [
      "我是一个特别固执的人，我从来不会在意别人跟我说什么，让我去做，让我去怎么做，我不管。如果，你也可以像我一样，那我觉得，这件事情，太酷辣!!!",
      "我厉害，你给我大拇哥！",
      "那些说我们的网站土的人，说抄袭的人，说我们文章拉的人，说我吃饱了撑的人，你给我大拇哥！",
      "好久不见，日子过得好快呢……",
      "嘤嘤嘤～",
      "嗨～快来逗我玩吧！",
      "退、退、退",
      "很喜欢上班，有种上坟的感觉。",
      "很喜欢放假，有种刑满释放的感觉。",
      "很喜欢看评论，有一种批阅奏折的感觉。",
      "很喜欢发工资，有一种领低保的感觉。",
      "记得把我加入 Adblock 白名单哦！"
    ];
  window.addEventListener("mousemove", () => userAction = true);
  window.addEventListener("keydown", () => userAction = true);
  setInterval(() => {
    if (userAction) {
      userAction = false;
      clearInterval(userActionTimer);
      userActionTimer = null;
    } else if (!userActionTimer) {
      userActionTimer = setInterval(() => {
        showMessage(randomSelection(messageArray), 6000, 9);
      }, 20000);
    }
  }, 1000);

  // 监听器
  (function registerEventListener() {
    document.querySelector("#waifu-tool .fa-comment").addEventListener("click", showHitokoto);
    document.querySelector("#waifu-tool .fa-street-view").addEventListener("click", loadRandModel);
    document.querySelector("#waifu-tool .fa-mouse-pointer").addEventListener("click", changeMouseAnimation);
    document.querySelector("#waifu-tool .fa-times").addEventListener("click", () => {
      localStorage.setItem("waifu-display", Date.now());
      showMessage("[Poo]小的就退下啦~可以在左下角再唤醒我哟", 2000, 11);
      document.getElementById("waifu").style.bottom = "-500px";
      setTimeout(() => {
        document.getElementById("waifu").style.display = "none";
        document.getElementById("waifu-toggle").classList.add("waifu-toggle-active");
      }, 3000);
    });

    const devtools = () => {
    };
    console.log("%c", devtools);
    devtools.toString = () => {
      showMessage("哈哈，你打开了控制台，是想要看看我的小秘密吗？", 6000, 9);
    };
    window.addEventListener("copy", () => {
      showMessage("你都复制了些什么呀，转载要记得加上出处哦！", 6000, 9);
    });
    window.addEventListener("visibilitychange", () => {
      if (!document.hidden) showMessage("哇，你终于回来了～", 6000, 9);
    });

    localStorage.setItem("showMouseAnimation", "1");
    document.querySelector("body").addEventListener("click", mouseAnimation);
  })();

  // 欢迎语
  (function welcomeMessage() {
    let text;
    if (location.pathname === "/") {
      // 主页
      const now = new Date().getHours();
      if (now > 5 && now <= 7) text = "早上好！一日之计在于晨，美好的一天就要开始了。";
      else if (now > 7 && now <= 11) text = "上午好！工作顺利嘛，不要久坐，多起来走动走动哦！";
      else if (now > 11 && now <= 13) text = "中午了，工作了一个上午，现在是午餐时间！";
      else if (now > 13 && now <= 17) text = "午后很容易犯困呢，今天的运动目标完成了吗？";
      else if (now > 17 && now <= 19) text = "傍晚了！窗外夕阳的景色很美丽呢，最美不过夕阳红～";
      else if (now > 19 && now <= 21) text = "晚上好，今天过得怎么样？";
      else if (now > 21 && now <= 23) text = ["已经这么晚了呀，早点休息吧，晚安～", "深夜时要爱护眼睛呀！"];
      else text = "你是夜猫子呀？这么晚还不睡觉，明天起的来嘛？";
    } else if (document.referrer !== "") {
      //文章页
      const referrer = new URL(document.referrer),
        domain = referrer.hostname.split(".")[1];
      if (location.hostname === referrer.hostname) text = `欢迎阅读<span>「${document.title.split(" - ")[0]}」</span>`;
      else if (domain === "baidu") text = `Hello！来自 百度搜索 的朋友<br>你是搜索 <span>${referrer.search.split("&wd=")[1].split("&")[0]}</span> 找到的我吗？`;
      else if (domain === "so") text = `Hello！来自 360搜索 的朋友<br>你是搜索 <span>${referrer.search.split("&q=")[1].split("&")[0]}</span> 找到的我吗？`;
      else if (domain === "google") text = `Hello！来自 谷歌搜索 的朋友<br>欢迎阅读<span>「${document.title.split(" - ")[0]}」</span>`;
      else text = `Hello！来自 <span>${referrer.hostname}</span> 的朋友`;
    } else {
      text = `欢迎阅读<span>「${document.title.split(" - ")[0]}」</span>`;
    }
    showMessage(text, 7000, 8);
  })();

  // 初始化模型
  (function initModel() {
    //加载自定义提示语
    fetch(waifuPath)
      .then(response => response.json())
      .then(result => {
        //配置有变更时的标记
        const waifuJsonCode = getHashCode(JSON.stringify(result));
        const waifuJsonCodeOld = localStorage.getItem("waifuJsonCode");
        if (!waifuJsonCodeOld || (waifuJsonCodeOld && waifuJsonCodeOld !== waifuJsonCode)) {
          //重刷模型位置
          localStorage.removeItem("modelX");
          localStorage.removeItem("modelY");

          //重刷默认模型
          if (result.defaultModel) {
            localStorage.setItem("modelName", result.defaultModel);
          }

          //是否隐藏
          if (result.isHidden) {
            localStorage.setItem("waifu-display", Date.now());
            document.getElementById("waifu").style.bottom = "-500px";
            document.getElementById("waifu").style.display = "none";
            document.getElementById("waifu-toggle").classList.add("waifu-toggle-active");
          }

          localStorage.setItem("waifuJsonCode", waifuJsonCode);
        }

        //自定义模型地址
        if (result.modelPath) {
          modelPath = result.modelPath;
          if (!modelPath.endsWith("/")) modelPath += "/";
          localStorage.setItem("modelPath", modelPath);
        }

        //加载模型
        loadModel();

        //默认欢迎语
        if (result.welcomeMsg) {
          setTimeout(() => {
            showMessage(result.welcomeMsg, 4000, 8);
          }, 7000);
        }

        //鼠标移动触发
        if (result.mouseover) {
          window.addEventListener("mouseover", event => {
            for (let { selector, text } of result.mouseover) {
              if (!event.target.matches(selector)) continue;
              text = randomSelection(text);
              text = text.replace("{text}", event.target.innerText);
              showMessage(text, 4000, 8);
              return;
            }
          });
        }

        //鼠标点击触发
        if (result.click) {
          window.addEventListener("click", event => {
            for (let { selector, text } of result.click) {
              if (!event.target.matches(selector)) continue;
              text = randomSelection(text);
              text = text.replace("{text}", event.target.innerText);
              showMessage(text, 4000, 8);
              return;
            }
          });
        }

        //每年的指定时间段触发
        if (result.seasons) {
          let msgCount = 1;
          result.seasons.forEach(({ date, text, boot }) => {
            const now = new Date(),
              after = date.split("-")[0],
              before = date.split("-")[1] || after;
            if ((after.split("/")[0] <= now.getMonth() + 1 && now.getMonth() + 1 <= before.split("/")[0]) && (after.split("/")[1] <= now.getDate() && now.getDate() <= before.split("/")[1])) {
              text = randomSelection(text);
              text = text.replace("{year}", now.getFullYear());
              messageArray.push(text);
              if (boot) {
                setTimeout(() => {
                  showMessage(text, 4000, 8);
                }, 4000 * msgCount + 7000);
                msgCount++;
              }
            }
          });
        }
      });
  })();

  function buildDrag(draggable) {

    let isDragging = false;
    let startX, startY, initialX, initialY;

    const modelX = localStorage.getItem("modelX");
    const modelY = localStorage.getItem("modelY");
    if (modelX && modelY) {
      draggable.style.left = modelX;
      draggable.style.top = modelY;
    }

    draggable.addEventListener('mousedown', (e) => {
      isDragging = true;

      startX = e.clientX;
      startY = e.clientY;
      initialX = draggable.offsetLeft;
      initialY = draggable.offsetTop;

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    });

    function onMouseMove(e) {
      if (!isDragging) return;

      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      draggable.style.left = `${initialX + dx}px`;
      draggable.style.top = `${initialY + dy}px`;
    }

    function onMouseUp() {
      isDragging = false;
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);

      localStorage.setItem("modelX", draggable.style.left);
      localStorage.setItem("modelY", draggable.style.top);
    }
  }

  //计算文本哈希摘要
  function getHashCode(str) {
    let h = 0x811C9DC5;
    const prime = 0x01000193;
    const TWO_POWER_32 = 4294967296;
    for (let i = 0; i < str.length; i++) {
      h = (h ^ str.charCodeAt(i)) * prime;
    }
    return (
      (h >>> 0).toString(16).padStart(8, '0') +
      ((h * TWO_POWER_32) >>> 0).toString(16).padStart(8, '0')
    );
  }

  // 模型集合
  async function loadModelList() {
    const response = await fetch(`${modelPath}model_list.json`);
    const modelJson = await response.json();
    modelList = [];
    if (modelJson) {
      for (let mods of modelJson.models) {
        Array.isArray(mods) ? modelList.push(...mods) : modelList.push(mods);
      }
    }
  }

  // 载入模型
  async function loadModel() {
    if (!modelList) await loadModelList();
    let modelName = localStorage.getItem("modelName");
    if (!modelName) {
      modelName = "Potion-Maker/Pio";
      localStorage.setItem("modelName", modelName);
    }
    loadlive2d("live2d", `${modelPath}model/${modelName}/index.json`);
  }

  // 换人、换肤
  async function loadRandModel() {
    if (!modelList) await loadModelList();
    const modelName = randomSelection(modelList);
    localStorage.setItem("modelName", modelName);
    loadlive2d("live2d", `${modelPath}model/${modelName}/index.json`);
    showMessage("我的新衣服好看嘛？", 4000, 10);
  }

  // 转换鼠标动画
  function changeMouseAnimation() {
    if (localStorage.getItem("showMouseAnimation") === "0") {
      localStorage.setItem("showMouseAnimation", "1");
      document.querySelector("body").addEventListener("click", mouseAnimation);
      showMessage("哈哈，要牢记社会主义核心价值观哦！", 6000, 9);
    } else {
      localStorage.setItem("showMouseAnimation", "0");
      document.querySelector("body").removeEventListener("click", mouseAnimation);
      showMessage("已关闭鼠标点击动画", 6000, 9);
    }
  }

  // 鼠标动画
  function mouseAnimation(e) {
    let list = new Array("富强", "民主", "文明", "和谐", "自由", "平等", "公正", "法治", "爱国", "敬业", "诚信", "友善");
    let span = $("<span>").text(list[idx]);
    idx = (idx + 1) % list.length;
    let x = e.pageX, y = e.pageY;
    span.css({
      "z-index": 9999,
      "top": y - 20,
      "left": x,
      "position": "absolute",
      "pointer-events": "none",
      "font-weight": "bold",
      "color": "#ff6651"
    });
    $("body").append(span);
    span.animate({ "top": y - 180, "opacity": 0 }, 1500, function () {
      span.remove();
    });
  }

  // 随机选择
  function randomSelection(obj) {
    return Array.isArray(obj) ? obj[Math.floor(Math.random() * obj.length)] : obj;
  }

  // 随机词
  function showHitokoto() {
    // 增加 hitokoto.cn 的 API
    fetch(constant.hitokoto)
      .then(response => response.json())
      .then(result => {
        showMessage(result.hitokoto, 6000, 9);
      }).catch(() => {
        showMessage(randomSelection(messageArray), 6000, 9);
      });
  }

  // 显示消息
  function showMessage(text, timeout, priority) {
    if (!text || (localStorage.getItem("waifu-text") && localStorage.getItem("waifu-text") > priority)) return;
    if (messageTimer) {
      clearTimeout(messageTimer);
      messageTimer = null;
    }
    text = randomSelection(text);
    localStorage.setItem("waifu-text", priority);
    const tips = document.getElementById("waifu-tips");
    tips.innerHTML = text;
    tips.classList.add("waifu-tips-active");
    messageTimer = setTimeout(() => {
      localStorage.removeItem("waifu-text");
      tips.classList.remove("waifu-tips-active");
    }, timeout);
  }
}
