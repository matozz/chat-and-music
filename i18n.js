import * as Localization from "expo-localization";
import i18n from "i18n-js";

// Set the key-value pairs for the different languages you want to support.
i18n.translations = {
  en: {
    home: {
      title: "Music & Chat",
      search: "Search",
      actions: {
        create: "Create",
        join: "Join",
        ideas: "Ideas",
        playground: "PlayGround",
      },
      subTitle1: "Latest Pack",
      subTitle2: "Popular Preset",
    },
    music: {
      title: "PlayGround",
      info: {
        pack: "Pack",
        speed: "Speed",
        beats: "Beats",
      },
      options: {
        bpm: "BPM",
        pack: "Packs",
      },
    },
    ideas: {
      title: "Ideas",
      tabs: {
        popular: "Popular",
        my: "My ideas",
      },
      idea: {
        title: "New Recording",
        from: "from",
      },
      actions: {
        send: "Send",
        del: "Delete",
        cancel: "Cancel",
      },
    },
    genre: {
      electronica: "Electronica",
      pop: "Pop",
      trap: "Trap",
      experimental: "Experimental",
    },
    notification: {
      action_failed: "Action Failed",
      connect_success: "Successfully connect to Socket server",
      connect_error:
        "Socket connect failed, please check your internet connection",
      socket_error: "Please check your Socket connection",
      database_error: "Please login to access",
    },
  },
  zh: {
    home: {
      title: "聊音",
      search: "搜索",
      actions: {
        create: "创建",
        join: "加入",
        ideas: "灵感",
        playground: "自由创作",
      },
      subTitle1: "最新素材包",
      subTitle2: "流行预制",
    },
    music: {
      title: "自由创作",
      info: {
        pack: "当前素材包",
        speed: "速度",
        beats: "节拍",
      },
      options: {
        bpm: "BPM（每分钟节拍数）",
        pack: "素材包",
      },
    },
    ideas: {
      title: "灵感",
      tabs: {
        popular: "热门",
        my: "我的灵感",
      },
      idea: {
        title: "新录音",
        from: "来自",
      },
      actions: {
        send: "发布",
        del: "删除",
        cancel: "取消",
      },
    },
    genre: {
      electronica: "电子",
      pop: "流行",
      trap: "嘻哈",
      experimental: "实验",
    },
    notification: {
      action_failed: "操作失败",
      connect_success: "Socket 服务连接成功",
      connect_error: "Socket 服务连接失败，请检查网络连接状态",
      socket_error: "请检查 Socket 连接状态",
      database_error: "请检查登录状态",
    },
  },
};
// Set the locale once at the beginning of your app.
i18n.locale = Localization.locale;
// When a value is missing from a language it'll fallback to another language with the key present.
i18n.fallbacks = true;

export default i18n;
