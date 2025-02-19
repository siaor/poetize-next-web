export default {
  // 测试环境，todo:抽离到系统配置
  //baseURL: "http://localhost:5241",
  //imBaseURL: "http://localhost:81/im",
  //webURL: "http://localhost",

  // 生产环境
  baseURL: location.protocol + "//" + location.hostname + (location.port ? ':' + location.port : '') + "/api",
  imBaseURL: location.protocol + "//" + location.hostname + (location.port ? ':' + location.port : '') + "/im",
  webURL: location.protocol + "//" + location.hostname + (location.port ? ':' + location.port : ''),

  host: location.hostname + (location.port ? ':' + location.port : ''),

  live2d_path: "https://cdn.jsdelivr.net/gh/stevenjoezhang/live2d-widget@latest/",
  cdnPath: "https://cdn.jsdelivr.net/gh/fghrsh/live2d_api/",
  waifuPath: "/webInfo/getWaifuJson",
  hitokoto: "https://v1.hitokoto.cn",
  shehui: "https://api.oick.cn/yulu/api.php",
  tocbot: "https://cdnjs.cloudflare.com/ajax/libs/tocbot/4.18.2/tocbot.min.js",
  jinrishici: "https://v1.jinrishici.com/all.json",
  //前后端定义的密钥，AES使用16位
  cryptojs_key: "poetize-next2025",

  friendWebName: "POETIZE-NEXT",
  friendIntroduction: "遇见最美博客，下一站，出发！诗与远方~",
  friendUrl: location.protocol + "//" + location.hostname + (location.port ? ':' + location.port : ''),
  friendAvatar: location.protocol + "//" + location.hostname + (location.port ? ':' + location.port : '') + "/res/sys/poetize-next.png",
  friendCover: location.protocol + "//" + location.hostname + (location.port ? ':' + location.port : '') + "/res/sys/poetize-next-home.png",

  before_color_list: ["black", "rgb(131, 123, 199)", "#ee7752", "#e73c7e", "#23a6d5", "#23d5ab"],

  tree_hole_color: ["rgb(180, 224, 255)", "rgb(180, 203, 255)", "rgb(246, 223, 255)", "rgb(255, 214, 198)", "rgb(255, 205, 143)", "rgb(238, 255, 143)", "rgb(220, 255, 165)", "rgb(164, 234, 192)", "rgb(202, 241, 233)", "rgb(230, 230, 250)"],

  before_color_1: "black",
  after_color_1: "linear-gradient(45deg, #f43f3b, #ec008c)",

  before_color_2: "rgb(131, 123, 199)",
  after_color_2: "linear-gradient(45deg, #f43f3b, #ec008c)",

  sortColor: ["linear-gradient(to right, #358bff, #15c6ff)",
    "linear-gradient(to right, #18e7ae, #1eebeb)",
    "linear-gradient(to right, #ff6655, #ffbf37)",
    "linear-gradient(120deg, rgba(255, 39, 232, 1) 0%, rgba(255, 128, 0, 1) 100%)",
    "linear-gradient(120deg, rgba(91, 39, 255, 1) 0%, rgba(0, 212, 255, 1) 100%)"
  ],

  pageColor: "#ee7752",
  commentPageColor: "#23d5ab",
  userId: 1,
  source: 0,

  emojiList: ['嘻嘻', '笑哭了', '哈哈', '大笑', '苦笑', '笑翻', '天使笑', '恶魔笑', '眨眼', '冷漠', '无语', '不高兴', '流汗', '沉思', '困扰', '困惑', '亲亲', '飞吻', '笑着亲', '生气', '愤怒', '想哭', '痛苦', '傲慢', '失望', '啊', '啊？', '害怕', '累死了', '冷汗']
}
