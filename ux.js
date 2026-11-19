(function () {
  const style = document.createElement("style");
  style.textContent = `
    .ux-skip{position:fixed;left:1rem;top:1rem;z-index:1000;padding:.65rem .85rem;background:var(--ink,#16171a);color:var(--paper,#ece9e2);transform:translateY(-180%);transition:transform .2s}
    .ux-skip:focus{transform:translateY(0)}
    body.ux-modal-open{overflow:hidden}
    #uxContact{width:min(560px,calc(100% - 2rem));border:1px solid var(--rule,#d8d4cb);background:var(--paper,#ece9e2);color:var(--ink,#16171a);padding:clamp(1.4rem,4vw,2.7rem);box-shadow:0 24px 80px #16171a33}
    #uxContact::backdrop{background:#16171a99;backdrop-filter:blur(4px)}
    #uxContact h2{margin:.25rem 0 .6rem;font:500 clamp(2rem,5vw,3.3rem)/1 var(--display,Georgia,serif)}
    #uxContact p{max-width:38ch}
    #uxContact .ux-close{float:right;border:0;background:transparent;font-size:1.6rem;line-height:1;cursor:pointer}
    #uxContact form{display:grid;gap:1rem;margin-top:1.5rem}
    #uxContact label{display:grid;gap:.35rem;font-size:.72rem;letter-spacing:.08em;text-transform:uppercase}
    #uxContact input,#uxContact textarea{width:100%;border:0;border-bottom:1px solid var(--rule,#d8d4cb);background:transparent;color:inherit;padding:.45rem 0;font:inherit;resize:vertical}
    #uxContact input:focus,#uxContact textarea:focus{outline:0;border-color:currentColor}
    #uxContact .ux-submit{justify-self:start;border:1px solid var(--ink,#16171a);background:var(--ink,#16171a);color:var(--paper,#ece9e2);padding:.7rem 1rem;cursor:pointer}
    .ux-request{display:inline-block;margin-top:.65rem}
  `;
  document.head.append(style);

  const skip = document.createElement("a");
  skip.className = "ux-skip";
  skip.href = "#series";
  skip.textContent = "Skip to works";
  document.body.prepend(skip);

  const dialog = document.createElement("dialog");
  dialog.id = "uxContact";
  dialog.setAttribute("aria-labelledby", "uxContactTitle");
  dialog.innerHTML = `
    <button class="ux-close" type="button" aria-label="Close">×</button>
    <p class="eyebrow">A personal note</p>
    <h2 id="uxContactTitle">Write to us.</h2>
    <p>Tell us what caught your eye. We’ll reply from <a href="mailto:hello@le-ha.com">hello@le-ha.com</a>.</p>
    <form>
      <label>Name <input name="name" autocomplete="name" required></label>
      <label>Email <input name="email" type="email" autocomplete="email" required></label>
      <label>Message <textarea name="message" rows="4" required></textarea></label>
      <button class="ux-submit" type="submit">Open email ↗</button>
    </form>`;
  document.body.append(dialog);

  const message = dialog.querySelector("[name=message]");
  const title = () => document.querySelector("#lbTitle")?.textContent?.trim();
  function openContact(work) {
    if (work) message.value = `I’d like to know more about “${work}”.\n\n`;
    else message.value = "";
    if (work) document.querySelector("#lb")?.close();
    if (typeof dialog.showModal === "function") dialog.showModal();
    else dialog.setAttribute("open", "");
    document.body.classList.add("ux-modal-open");
  }
  function closeContact() {
    dialog.close?.();
    dialog.removeAttribute("open");
    document.body.classList.remove("ux-modal-open");
  }

  document.addEventListener("click", (event) => {
    const link = event.target.closest("a");
    if (!link) return;
    const text = link.textContent.trim().toLowerCase();
    const isContact = link.getAttribute("href") === "mailto:hello@le-ha.com" ||
      (link.getAttribute("href") === "#contact" && text.includes("write to us"));
    if (!isContact) return;
    event.preventDefault();
    openContact(link.closest("#lb") ? title() : "");
  });
  dialog.querySelector(".ux-close").addEventListener("click", closeContact);
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) closeContact();
  });
  dialog.querySelector("form").addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const subject = encodeURIComponent(`Enquiry from ${data.get("name")}`);
    const body = encodeURIComponent(`Name: ${data.get("name")}\nEmail: ${data.get("email")}\n\n${data.get("message")}`);
    closeContact();
    window.location.href = `mailto:hello@le-ha.com?subject=${subject}&body=${body}`;
  });

  const sectionLinks = [...document.querySelectorAll("header a[href^='#']")];
  const sections = sectionLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);
  if ("IntersectionObserver" in window && sections.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        sectionLinks.forEach((link) => link.removeAttribute("aria-current"));
        document.querySelectorAll(`header a[href="#${entry.target.id}"]`).forEach((link) => {
          link.setAttribute("aria-current", "page");
        });
      });
    }, { rootMargin: "-35% 0px -55% 0px", threshold: 0 });
    sections.forEach((section) => observer.observe(section));
  }
})();

(function () {
  const home = document.querySelector("#home");
  const series = document.querySelector("#series");
  const about = document.querySelector("#about");
  const prints = document.querySelector("#prints");
  const contact = document.querySelector("#contact");
  const objects = document.querySelector("#objects");
  if (!home || !series || !prints) return;

  const style = document.createElement("style");
  style.textContent = `
    .ux-modebar{display:flex;justify-content:center;gap:2rem;padding:.7rem 1rem;border-bottom:1px solid var(--rule,#d8d4cb);font-size:.76rem;letter-spacing:.08em;text-transform:uppercase}
    .ux-modebar button{border:0;border-bottom:1px solid transparent;background:transparent;color:var(--graphite,#6f6b65);padding:.25rem .1rem;cursor:pointer}
    .ux-modebar button[aria-selected="true"]{border-color:currentColor;color:var(--ink,#16171a)}
    header .ux-contact-link{font-size:.8rem;text-decoration:none}
    #home{display:grid;grid-template-columns:10rem minmax(0,1fr);column-gap:3rem;--W:min(calc(100vw - 2*var(--pad) - 13rem),1360px)}
    #home>.ux-rail{grid-column:1;grid-row:1 / span 8;position:sticky;top:8.5rem;align-self:start;margin:3rem 0 0;width:10rem;font-size:.78rem}
    #home>section,#home>.objband{grid-column:2}
    .ux-rail h3{margin:0 0 .8rem;font:500 .68rem var(--mono,monospace);letter-spacing:.1em;text-transform:uppercase;color:var(--graphite,#6f6b65)}
    .ux-rail-section{margin:0 0 1.4rem}
    .ux-rail-section p{margin:.8rem 0 .3rem;font-size:.68rem;letter-spacing:.08em;text-transform:uppercase;color:var(--graphite,#6f6b65)}
    .ux-rail a{display:flex;justify-content:space-between;gap:.5rem;padding:.25rem 0;color:var(--ink,#16171a);text-decoration:none}
    .ux-rail a span{color:var(--graphite,#6f6b65);font-size:.65rem}
    .ux-rail a:hover,.ux-rail a[aria-current="page"]{text-decoration:underline;text-underline-offset:.25rem}
    .ux-rail-shop{display:none}
    .h3-idx{display:none!important}
    body.ux-gallery-mode #prints,body.ux-gallery-mode #contact,body.ux-gallery-mode #objects,body.ux-gallery-mode .objband{display:none!important}
    body.ux-shop-mode #home>.h3,body.ux-shop-mode #series,body.ux-shop-mode #about{display:none!important}
    body.ux-shop-mode .objband{display:none!important}
    body.ux-shop-mode #prints,body.ux-shop-mode #contact,body.ux-shop-mode #objects{display:block!important}
    body.ux-shop-mode #objects[hidden]{display:block!important}
    body.ux-shop-mode .ux-rail-gallery{display:none}
    body.ux-shop-mode .ux-rail-shop{display:block}
    @media(max-width:700px){.ux-modebar{gap:1.4rem;font-size:.68rem}}
    @media(max-width:900px){#home{display:block;--W:calc(100vw - 2*var(--pad))}.ux-rail{position:relative;top:auto;width:auto;margin:0 1rem;padding:.85rem 0;border-bottom:1px solid var(--rule,#d8d4cb);display:flex;gap:1rem;overflow:auto;white-space:nowrap}.ux-rail h3,.ux-rail-section p{display:none}.ux-rail-section{display:flex;gap:1rem;margin:0}.ux-rail a{display:block;padding:0}.ux-rail a span{display:none}}
  `;
  document.head.append(style);

  const bar = document.createElement("div");
  bar.className = "ux-modebar";
  bar.setAttribute("role", "tablist");
  bar.innerHTML = `
    <button type="button" role="tab" aria-selected="true" data-mode="gallery">Gallery</button>
    <button type="button" role="tab" aria-selected="false" data-mode="shop">Shop</button>`;
  document.querySelector("header")?.after(bar);
  const rail = document.createElement("aside");
  rail.className = "ux-rail";
  rail.setAttribute("aria-label", "Browse categories");
  rail.innerHTML = `
    <div class="ux-rail-gallery">
      <h3>Gallery</h3>
      <div class="ux-rail-section"><a href="#series" aria-current="page">All works <span>55</span></a></div>
      <div class="ux-rail-section"><p>Graphics</p><a href="#small-fables">Small Fables <span>17</span></a><a href="#crowns">Crowns <span>18</span></a></div>
      <div class="ux-rail-section"><p>Acrylic</p><a href="#enfilade">Enfilade <span>4</span></a><a href="#subjects">Subjects <span>9</span></a><a href="#landscape">Landscape <span>4</span></a><a href="#abstract">Abstract <span>3</span></a></div>
    </div>
    <div class="ux-rail-shop">
      <h3>Shop</h3>
      <div class="ux-rail-section"><a href="#prints" aria-current="page">All products</a></div>
      <div class="ux-rail-section"><p>Prints</p><a href="#prints">A4 prints</a><a href="#prints">Framed prints</a><a href="#prints">Digital downloads <span>Soon</span></a></div>
      <div class="ux-rail-section"><p>Objects</p><a href="#objects">T-shirts</a><a href="#objects">Mugs</a></div>
    </div>`;
  home.prepend(rail);
  const headerNav = document.querySelector("header nav");
  if (headerNav) {
    headerNav.innerHTML = '<a class="ux-contact-link" href="#contact">Contact</a>';
  }

  function setMode(mode, scroll) {
    document.body.classList.toggle("ux-gallery-mode", mode === "gallery");
    document.body.classList.toggle("ux-shop-mode", mode === "shop");
    bar.querySelectorAll("[data-mode]").forEach((button) => {
      button.setAttribute("aria-selected", String(button.dataset.mode === mode));
    });
    if (mode === "shop") objects?.removeAttribute("hidden");
    else objects?.setAttribute("hidden", "");
    if (scroll) (mode === "shop" ? prints : series).scrollIntoView({ behavior: "smooth", block: "start" });
  }

  bar.addEventListener("click", (event) => {
    const button = event.target.closest("[data-mode]");
    if (button) setMode(button.dataset.mode, true);
  });

  rail.addEventListener("click", (event) => {
    const link = event.target.closest("a");
    if (!link) return;
    event.preventDefault();
    rail.querySelectorAll("a").forEach((item) => item.removeAttribute("aria-current"));
    link.setAttribute("aria-current", "page");
    const target = link.getAttribute("href");
    if (link.closest(".ux-rail-gallery")) {
      setMode("gallery", false);
      if (target === "#series") series.scrollIntoView({ behavior: "smooth", block: "start" });
      else window.location.hash = target.slice(1);
    } else {
      setMode("shop", false);
      document.querySelector(target)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });

  document.addEventListener("click", (event) => {
    const link = event.target.closest('header a[href^="#"],.obj-link');
    if (!link) return;
    const href = link.getAttribute("href");
    if (link.matches(".obj-link") || href === "#objects") {
      event.preventDefault();
      event.stopImmediatePropagation();
      setMode("shop", true);
    } else if (href === "#prints" || href === "#contact") {
      event.preventDefault();
      event.stopImmediatePropagation();
      setMode("shop", false);
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else if (href === "#about") {
      event.preventDefault();
      event.stopImmediatePropagation();
      setMode("gallery", false);
      about?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, true);

  setMode("gallery", false);
})();
