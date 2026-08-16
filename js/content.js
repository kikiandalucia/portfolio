/*
 * 作品集内容配置
 * ------------------------------------------------------------------
 * 以后只需要修改这个文件，就能更新页面上的所有文字、图片和链接。
 * 改完保存后刷新浏览器即可看到效果。
 */

const CONTENT = {
  // 页面标题（浏览器标签页显示）
  siteTitle: "kikiandalucia Portfolio.",

  // 名字 / 品牌名
  name: "kikiandalucia Portfolio.",

  // 首页大标语：渲染时会自动换行并给第 3、5 段加上强调色
  headerTagline: [
    "I want to innovate",
    "the way we ",
    "Build on Silicon",
    "and ",
    "Compute Beyond Limits."
  ],

  // 联系邮箱
  contactEmail: "kikiandalucia@outlook.com.",

  // 关于我
  about: {
    // 主标题
    heading: "I'm kikiandalucia.",

    // 第一段：介绍（可点击的链接会用 bold 样式显示）
    intro: [
      { text: "A student " },
      { text: " studying " },
      { text: "YSYX", url: "https://ysyx.oscc.cc/", bold: true },
      { text: " & " },
      { text: "CSDIY.", url: "https://csdiy.wiki/", bold: true }
    ],

    // 之后的段落ss
    paragraphs: [
      // {
      //   parts: [
      //     { text: "I just finished my internship as a Software Engineer" },
      //     { text: "@dooboolab", url: "https://dooboolab.com/" }
      //   ]
      // },
      // {
      //   parts: [
      //     { text: "At school I'm part of " },
      //     { text: "Cornell Data Science Insights Team", url: "https://cornelldata.science/" },
      //     { text: " working on " },
      //     { text: "MyCourseIndex.com", url: "https://www.mycourseindex.com/" }
      //   ]
      // }
    ],

    // 头像图片（设为空字符串 "" 则不显示）
    image: "https://s2.loli.net/2025/11/23/PWJNrLwvsR7FtqS.jpg",
    showImage: true,

    // 灵感来源
    inspirationsTitle: "The inspiration for my website design.",
    inspirations: [
      { text: "unicorn", url: "https://www.unicorn.studio/", color: "orange" },
      { text: "zhongguose", url: "https://zhongguose.com/", color: "seagreen" },
      { text: "iamkailash", url: "https://www.iamkailash.xyz/", color: "royalblue" },
      { text: "shljessie", url: "https://shljessie.github.io/portfolio", color: "royalblue" }
    ]
  },

  // 作品集
  projects: [
    {
      id: 1,
      title: "MyBlog",
      service: "Life",
      stacks: "Hexo",
      image: "https://files.seeusercontent.com/2026/08/16/do8Y/pasted-image-1786877566796.webp",
      url: "https://kikiandalucia.github.io/"
    }
  ],

  // 社交链接（会自动出现在 Contact 区块）
  social: [
    { name: "Github", url: "https://kikiandalucia.github.io/" },
    { name: "Bilibili", url: "https://space.bilibili.com/3494377466890522?spm_id_from=333.1007.0.0" },
    { name: "Zhihu", url: "https://www.zhihu.com/people/jwhs-55-48" }
  ]
};
