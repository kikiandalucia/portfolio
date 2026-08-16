/*
 * 作品集渲染逻辑
 * ------------------------------------------------------------------
 * 这个文件负责把 content.js 里的数据渲染成页面。
 * 一般不需要改这里，除非你想调整页面结构或交互行为。
 */

(function () {
  "use strict";

  const app = document.getElementById("app");

  // ---------- 工具函数 ----------
  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  // 根据数据里的 { text, url, bold } 片段渲染一段文字
  function renderParts(parts) {
    const p = el("p", "paragraph");
    (parts || []).forEach(function (part) {
      if (part.url) {
        const a = el("a", "text-link", part.text);
        if (part.bold) a.classList.add("bold");
        a.href = part.url;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        p.appendChild(a);
      } else {
        p.appendChild(document.createTextNode(part.text));
      }
    });
    return p;
  }

  // ---------- 导航 ----------
  const navItems = [
    { id: "home", label: "Home" },
    { id: "about", label: "About" },
    { id: "work", label: "Work" },
    { id: "contact", label: "Contact" }
  ];

  function buildNav() {
    const nav = el("nav", "nav");
    const ul = el("ul", "nav-list");

    navItems.forEach(function (item) {
      const li = el("li");
      const a = el("a", "nav-link", item.label);
      a.href = "#" + item.id;
      li.appendChild(a);
      ul.appendChild(li);
    });

    nav.appendChild(ul);
    return nav;
  }

  // ---------- 首页 Hero ----------
  function buildHero() {
    const section = el("section", "hero");
    section.id = "home";

    const name = el("h1", "hero-name", CONTENT.name);
    const tagline = el("p", "hero-tagline");

    const t = CONTENT.headerTagline;
    const blue = el("span", "accent accent-blue", t[2]);
    const pink = el("span", "accent accent-pink", t[4]);

    tagline.appendChild(document.createTextNode(t[0]));
    tagline.appendChild(el("br"));
    tagline.appendChild(document.createTextNode(t[1]));
    tagline.appendChild(blue);
    tagline.appendChild(el("br"));
    tagline.appendChild(document.createTextNode(t[3]));
    tagline.appendChild(pink);

    section.appendChild(name);
    section.appendChild(tagline);
    return section;
  }

  // ---------- About ----------
  function buildAbout() {
    const section = el("section", "about");
    section.id = "about";

    const heading = el("h2", "section-heading", CONTENT.about.heading);

    const content = el("div", "about-content");

    // 左侧：文字
    const textCol = el("div", "about-text");
    textCol.appendChild(renderParts(CONTENT.about.intro));
    CONTENT.about.paragraphs.forEach(function (para) {
      textCol.appendChild(renderParts(para.parts));
    });

    // 右侧：头像（可选）
    let imageCol = null;
    if (CONTENT.about.showImage && CONTENT.about.image) {
      imageCol = el("div", "about-image");
      const img = el("img");
      img.src = CONTENT.about.image;
      img.alt = "Portrait";
      img.loading = "lazy";
      imageCol.appendChild(img);
    }

    // 灵感来源
    const inspirations = el("div", "inspirations");
    const inspTitle = el("h3", "inspirations-title", CONTENT.about.inspirationsTitle);
    const inspList = el("p", "inspirations-list");
    CONTENT.about.inspirations.forEach(function (item, i) {
      const a = el("a", "inspiration-link", item.text);
      a.href = item.url;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.dataset.color = item.color;
      inspList.appendChild(a);
      if (i < CONTENT.about.inspirations.length - 1) {
        inspList.appendChild(document.createTextNode(", "));
      }
    });
    inspirations.appendChild(inspTitle);
    inspirations.appendChild(inspList);

    textCol.appendChild(inspirations);

    if (imageCol) {
      content.appendChild(textCol);
      content.appendChild(imageCol);
    } else {
      content.appendChild(textCol);
    }

    section.appendChild(heading);
    section.appendChild(content);
    return section;
  }

  // ---------- Work ----------
  function buildProjectCard(project) {
    const card = el("a", "project-card");
    card.href = project.url;
    card.target = "_blank";
    card.rel = "noopener noreferrer";

    const img = el("img", "project-image");
    img.src = project.image;
    img.alt = project.title;
    img.loading = "lazy";

    const body = el("div", "project-body");
    body.appendChild(el("h3", "project-title", project.title));
    body.appendChild(el("p", "project-service", project.service));
    if (project.stacks) {
      body.appendChild(el("p", "project-stacks", project.stacks));
    }

    card.appendChild(img);
    card.appendChild(body);
    return card;
  }

  function buildWork() {
    const section = el("section", "work");
    section.id = "work";

    const heading = el("h2", "section-heading", "Work.");

    const grid = el("div", "project-grid");
    CONTENT.projects.forEach(function (project) {
      grid.appendChild(buildProjectCard(project));
    });

    section.appendChild(heading);
    section.appendChild(grid);
    return section;
  }

  // ---------- Contact ----------
  function buildContact() {
    const section = el("section", "contact");
    section.id = "contact";

    const heading = el("h2", "section-heading", "Contact.");

    const list = el("ul", "social-list");

    CONTENT.social.forEach(function (item) {
      const li = el("li");
      const a = el("a", "social-link", item.name);
      a.href = item.url;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      li.appendChild(a);
      list.appendChild(li);
    });

    const emailLi = el("li");
    const emailLink = el("a", "email-link", CONTENT.contactEmail);
    emailLink.href = "mailto:" + CONTENT.contactEmail;
    emailLi.appendChild(emailLink);
    list.appendChild(emailLi);

    section.appendChild(heading);
    section.appendChild(list);
    return section;
  }

  // ---------- Footer ----------
  function buildFooter() {
    const footer = el("footer", "footer");
    const p = el("p");
    p.textContent = "© " + new Date().getFullYear() + " " + CONTENT.name + ".";
    footer.appendChild(p);
    return footer;
  }

  // ---------- 组装页面 ----------
  function buildPage() {
    document.title = CONTENT.siteTitle;

    const layout = el("div", "layout");
    const sidebar = el("aside", "sidebar");
    sidebar.appendChild(buildNav());

    const main = el("main", "main");
    main.appendChild(buildHero());
    main.appendChild(buildAbout());
    main.appendChild(buildWork());
    main.appendChild(buildContact());
    main.appendChild(buildFooter());

    layout.appendChild(sidebar);
    layout.appendChild(main);
    app.appendChild(layout);
  }

  // ---------- 滚动高亮当前导航项 ----------
  function initScrollSpy() {
    const links = Array.prototype.slice.call(
      document.querySelectorAll(".nav-link")
    );
    const sections = navItems.map(function (item) {
      return document.getElementById(item.id);
    });

    function onScroll() {
      const y = window.scrollY + 120;
      let current = sections[0];

      sections.forEach(function (section) {
        if (section && section.offsetTop <= y) current = section;
      });

      links.forEach(function (link) {
        link.classList.toggle(
          "active",
          link.getAttribute("href") === "#" + current.id
        );
      });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  // ---------- 滚动进入视口时的淡入动画 ----------
  function initReveal() {
    const targets = document.querySelectorAll(
      ".hero, .section-heading, .about-content, .inspirations, .project-card, .social-list"
    );

    if (!("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    targets.forEach(function (target) {
      target.classList.add("reveal");
      observer.observe(target);
    });
  }

  buildPage();
  initScrollSpy();
  initReveal();
})();
