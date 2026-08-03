const toggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".main-nav");

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const heroMedia = document.querySelector(".hero-media");
if (heroMedia) {
  const heroImage = new Image();
  const revealHero = () => heroMedia.classList.add("is-loaded");
  heroImage.addEventListener("load", revealHero, { once: true });
  heroImage.addEventListener("error", revealHero, { once: true });
  heroImage.src = "assets/hero/el-tornillo-20260729-framed.webp";
  if (heroImage.complete) revealHero();
}

const heroIntro = document.querySelectorAll(".hero-copy > h1, .hero-copy > h2, .hero-copy > p");
heroIntro.forEach((element) => element.classList.add("hero-intro"));

const revealSelectors = [
  ".section h2",
  ".red-block",
  ".team-route",
  ".investment-row",
  ".competency-list > div",
  ".contact-building",
  ".contact-directory",
  ".page-title",
  ".portfolio-sheet-title",
  ".group-title",
  ".profile",
  ".portfolio-table tbody tr",
  ".fund-summary",
  ".fund-entity-card",
  ".brand-intro",
  ".brand-card",
  ".press-card",
  ".proposals",
  ".portfolio-stat-grid > div",
  ".fund-snapshot > a",
  ".portfolio-entity-block",
  ".editorial-columns > div",
  ".consulting-proposal",
  ".supply-chain-copy",
  ".supply-chain-competencies",
  ".leadership-panel",
  ".accomplishment-list > li",
  ".brand-family-hero h1",
  ".brand-family-hero p",
  ".brand-division-header",
  ".brand-family-card",
];

const revealElements = document.querySelectorAll(revealSelectors.join(","));
revealElements.forEach((element) => {
  element.classList.add("reveal");
  const siblings = element.parentElement
    ? [...element.parentElement.children].filter((child) =>
        child.matches(revealSelectors.join(","))
      )
    : [];
  const siblingIndex = Math.max(0, siblings.indexOf(element));
  element.style.setProperty("--reveal-delay", `${Math.min(siblingIndex, 4) * 70}ms`);
  if (element.matches(".contact-building")) element.classList.add("reveal-left");
  if (element.matches(".contact-directory")) element.classList.add("reveal-right");
});

const activateReveals = () => {
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealElements.forEach((element) => element.classList.add("is-visible"));
    return;
  }

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        requestAnimationFrame(() => entry.target.classList.add("is-visible"));
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px 12% 0px", threshold: 0.01 }
  );
  revealElements.forEach((element) => revealObserver.observe(element));
};

requestAnimationFrame(() => {
  requestAnimationFrame(() => {
    document.documentElement.classList.add("page-ready");
    requestAnimationFrame(activateReveals);
  });
});

if (toggle && nav) {
  const mobileNavQuery = window.matchMedia("(max-width: 1120px)");
  const submenuParents = [...nav.querySelectorAll(".submenu")].map((submenu) => {
    const parent = submenu.parentElement;
    const parentLink = parent.querySelector(":scope > a");
    const button = document.createElement("button");
    const label = parentLink?.textContent.trim() || "navigation";

    parent.classList.add("has-submenu");
    button.className = "submenu-toggle";
    button.type = "button";
    button.setAttribute("aria-expanded", "false");
    button.setAttribute("aria-label", `Open ${label} submenu`);
    button.innerHTML = '<span aria-hidden="true"></span>';
    parent.insertBefore(button, submenu);

    button.addEventListener("click", () => {
      const willOpen = !parent.classList.contains("submenu-open");
      submenuParents.forEach(({ parent: openParent, button: openButton }) => {
        if (openParent === parent) return;
        openParent.classList.remove("submenu-open");
        openButton.setAttribute("aria-expanded", "false");
      });
      parent.classList.toggle("submenu-open", willOpen);
      button.setAttribute("aria-expanded", String(willOpen));
      button.setAttribute("aria-label", `${willOpen ? "Close" : "Open"} ${label} submenu`);
    });

    return { parent, button };
  });

  const closeMenu = () => {
    nav.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.textContent = "Menu";
    document.body.classList.remove("menu-open");
    submenuParents.forEach(({ parent, button }) => {
      parent.classList.remove("submenu-open");
      button.setAttribute("aria-expanded", "false");
    });
  };

  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.textContent = open ? "Close" : "Menu";
    document.body.classList.toggle("menu-open", open);
    if (open) nav.scrollTop = 0;
  });

  nav.addEventListener("click", (event) => {
    if (!event.target.closest("a")) return;
    closeMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && nav.classList.contains("open")) {
      closeMenu();
      toggle.focus();
    }
  });

  mobileNavQuery.addEventListener("change", (event) => {
    if (!event.matches) closeMenu();
  });
}

document.querySelectorAll(".brand-card").forEach((card) => {
  const trigger = card.querySelector(".brand-card-trigger");
  const close = card.querySelector(".brand-card-close");
  if (!trigger || !close) return;

  const setFlipped = (flipped) => {
    card.classList.toggle("is-flipped", flipped);
    trigger.setAttribute("aria-expanded", String(flipped));
  };

  trigger.addEventListener("click", () => {
    const willFlip = !card.classList.contains("is-flipped");
    document.querySelectorAll(".brand-card.is-flipped").forEach((openCard) => {
      openCard.classList.remove("is-flipped");
      openCard.querySelector(".brand-card-trigger")?.setAttribute("aria-expanded", "false");
    });
    setFlipped(willFlip);
  });

  close.addEventListener("click", () => {
    setFlipped(false);
    trigger.focus();
  });

  card.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    setFlipped(false);
    trigger.focus();
  });
});
