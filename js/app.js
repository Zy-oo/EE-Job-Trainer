/* =========================================================================
   EE II Prep Trainer — app logic (vanilla JS, no build step, no backend)
   All persistence is localStorage only. Nothing leaves the browser.
   ========================================================================= */

const STORAGE_KEY = "eeprep_state_v1";

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) { /* ignore corrupt state */ }
  return { quiz: {}, flash: {}, planner: {}, starAnswers: {} };
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

let state = loadState();

/* ------------------------------------------------------------------ util */

function el(tag, attrs, children) {
  const node = document.createElement(tag);
  if (attrs) {
    for (const [k, v] of Object.entries(attrs)) {
      if (k === "class") node.className = v;
      else if (k === "html") node.innerHTML = v;
      else if (k.startsWith("on") && typeof v === "function") node.addEventListener(k.slice(2), v);
      else node.setAttribute(k, v);
    }
  }
  (children || []).forEach((c) => {
    if (c === null || c === undefined) return;
    node.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
  });
  return node;
}

function moduleById(id) {
  return MODULES.find((m) => m.id === id);
}

function scorePctFor(moduleId) {
  const rec = state.quiz[moduleId];
  return rec ? rec.best : null;
}

function overallReadiness() {
  const scores = MODULES.map((m) => scorePctFor(m.id)).filter((s) => s !== null);
  if (scores.length === 0) return 0;
  const attemptedAvg = scores.reduce((a, b) => a + b, 0) / scores.length;
  return Math.round((attemptedAvg * scores.length) / MODULES.length);
}

function badgeForScore(score) {
  if (score === null) return { cls: "", label: "Not started" };
  if (score >= 80) return { cls: "ok", label: score + "%" };
  if (score >= 50) return { cls: "warn", label: score + "%" };
  return { cls: "danger", label: score + "%" };
}

function priorityOrderedModules() {
  return [...MODULES].sort((a, b) => {
    const sa = scorePctFor(a.id);
    const sb = scorePctFor(b.id);
    const va = sa === null ? -1 : sa;
    const vb = sb === null ? -1 : sb;
    return va - vb;
  });
}

/* ---------------------------------------------------------------- router */

const ROUTES = {
  dashboard: renderDashboard,
  role: renderRole,
  modules: renderModulesList,
  module: renderModuleDetail,
  flashcards: renderFlashcards,
  quiz: renderQuiz,
  planner: renderPlanner,
  star: renderStar,
  resume: renderResume,
  glossary: renderGlossary,
};

const NAV_ITEMS = [
  ["dashboard", "Dashboard"],
  ["role", "Role Overview"],
  ["modules", "Learning Modules"],
  ["flashcards", "Flashcards"],
  ["quiz", "Quiz"],
  ["planner", "Study Planner"],
  ["star", "Interview Prep"],
  ["resume", "Resume Gap Bridge"],
  ["glossary", "Glossary"],
];

function navigate(hash) {
  window.location.hash = hash;
}

function currentRoute() {
  const raw = window.location.hash.replace(/^#/, "") || "dashboard";
  const [base, arg] = raw.split("/");
  return { base, arg };
}

function route() {
  const { base, arg } = currentRoute();
  const fn = ROUTES[base] || renderDashboard;
  renderShell(base);
  const main = document.getElementById("main");
  main.innerHTML = "";
  main.appendChild(fn(arg));
  window.scrollTo(0, 0);
}

window.addEventListener("hashchange", route);

/* ----------------------------------------------------------------- shell */

function renderShell(activeBase) {
  const sidebar = document.getElementById("sidebar");
  sidebar.innerHTML = "";
  sidebar.appendChild(
    el("div", { class: "brand" }, [
      "EE II Prep Trainer",
      el("small", null, ["for the LivaNova Electrical Engineer II role"]),
    ])
  );
  NAV_ITEMS.forEach(([key, label]) => {
    sidebar.appendChild(
      el("button", {
        class: "nav-btn" + (key === activeBase ? " active" : ""),
        onclick: () => navigate(key),
      }, [label])
    );
  });
}

/* -------------------------------------------------------------- dashboard */

function renderDashboard() {
  const wrap = el("div", null, []);
  wrap.appendChild(el("h1", null, ["Dashboard"]));
  wrap.appendChild(el("p", { class: "subtitle" }, [
    "Your prep progress for the ", el("b", null, ["Electrical Engineer II"]),
    " role — RF & Electrical Engineering, Neuromodulation.",
  ]));

  const readiness = overallReadiness();
  const attempted = MODULES.filter((m) => scorePctFor(m.id) !== null).length;

  const statsGrid = el("div", { class: "grid cols-3" }, [
    el("div", { class: "card stat" }, [
      el("div", { class: "value" }, [readiness + "%"]),
      el("div", { class: "label" }, ["Overall readiness (best quiz scores)"]),
    ]),
    el("div", { class: "card stat" }, [
      el("div", { class: "value" }, [attempted + " / " + MODULES.length]),
      el("div", { class: "label" }, ["Modules attempted"]),
    ]),
    el("div", { class: "card stat" }, [countdownNode(), el("div", { class: "label" }, ["Until target date (set in Planner)"])]),
  ]);
  wrap.appendChild(statsGrid);

  wrap.appendChild(el("h2", null, ["Focus this week"]));
  const focus = priorityOrderedModules().slice(0, 3);
  const focusCard = el("div", { class: "card" }, []);
  focus.forEach((m) => {
    const score = scorePctFor(m.id);
    const b = badgeForScore(score);
    focusCard.appendChild(
      el("div", { class: "module-card", style: "padding:10px 0;border-bottom:1px solid var(--border);cursor:pointer" , onclick: () => navigate("module/" + m.id) }, [
        el("div", { class: "row" }, [
          el("strong", null, [m.title]),
          el("span", { class: "badge " + b.cls }, [b.label]),
        ]),
        el("div", { class: "jd-ref" }, [m.jdRef]),
      ])
    );
  });
  wrap.appendChild(focusCard);

  wrap.appendChild(el("h2", null, ["Quick links"]));
  wrap.appendChild(
    el("div", { class: "grid cols-3" }, [
      linkCard("Role Overview", "See the full JD broken down.", "role"),
      linkCard("Study Planner", "Build a week-by-week plan to your target date.", "planner"),
      linkCard("Interview Prep", "STAR-format behavioral question bank.", "star"),
    ])
  );

  wrap.appendChild(footerNote());
  return wrap;
}

function countdownNode() {
  const target = state.planner.targetDate;
  if (!target) return el("div", { class: "value" }, ["—"]);
  const days = Math.ceil((new Date(target) - new Date()) / 86400000);
  return el("div", { class: "value" }, [days >= 0 ? days + "d" : "past"]);
}

function linkCard(title, desc, hash) {
  return el("div", { class: "card module-card", onclick: () => navigate(hash) }, [
    el("strong", null, [title]),
    el("div", { class: "jd-ref" }, [desc]),
  ]);
}

function footerNote() {
  return el("footer", { class: "note" }, [
    "All progress is stored locally in this browser (localStorage) only — nothing is uploaded anywhere.",
  ]);
}

/* -------------------------------------------------------------- role tab */

function renderRole() {
  const wrap = el("div", null, []);
  wrap.appendChild(el("h1", null, [ROLE_INFO.title + " — " + ROLE_INFO.company]));
  wrap.appendChild(el("p", { class: "subtitle" }, [ROLE_INFO.department + " · Reports to: " + ROLE_INFO.reportsTo]));

  wrap.appendChild(el("div", { class: "card" }, [el("h3", null, ["Purpose"]), el("p", null, [ROLE_INFO.purpose])]));

  const respCard = el("div", { class: "card" }, [el("h3", null, ["Responsibilities"])]);
  const respList = el("ul", { class: "concepts" }, ROLE_INFO.responsibilities.map((r) => el("li", null, [r])));
  respCard.appendChild(respList);
  wrap.appendChild(respCard);

  const qualCard = el("div", { class: "card" }, [el("h3", null, ["Qualifications"])]);
  const qualList = el("ul", { class: "concepts" }, ROLE_INFO.qualifications.map((r) => el("li", null, [r])));
  qualCard.appendChild(qualList);
  wrap.appendChild(qualCard);

  wrap.appendChild(el("div", { class: "card" }, [
    el("h3", null, ["How this maps to the training modules"]),
    el("p", { class: "jd-ref" }, ["Every module in this app is written directly against a line of this JD — check the \"maps to\" tag on each module."]),
    el("button", { class: "btn secondary", onclick: () => navigate("modules") }, ["Go to modules →"]),
  ]));

  return wrap;
}

/* ---------------------------------------------------------- modules list */

function renderModulesList() {
  const wrap = el("div", null, []);
  wrap.appendChild(el("h1", null, ["Learning Modules"]));
  wrap.appendChild(el("p", { class: "subtitle" }, ["13 modules, each built from a specific line in the job description. Ordered roughly as the JD flows: design → tools → test/automation → risk/quality → process."]));

  MODULES.forEach((m) => {
    const score = scorePctFor(m.id);
    const b = badgeForScore(score);
    const badges = [el("span", { class: "badge " + b.cls }, [b.label])];
    if (m.status === "strength") badges.push(el("span", { class: "badge ok" }, ["Already have this"]));
    const card = el("div", { class: "card module-card", onclick: () => navigate("module/" + m.id) }, [
      el("div", { class: "row" }, [
        el("strong", null, [m.title]),
        el("div", { style: "display:flex;gap:6px" }, badges),
      ]),
      el("div", { class: "jd-ref" }, ["Maps to: " + m.jdRef]),
    ]);
    if (score !== null) {
      const bar = el("div", { class: "progress-bar" }, [el("div", { style: "width:" + score + "%" })]);
      card.appendChild(bar);
    }
    wrap.appendChild(card);
  });

  wrap.appendChild(footerNote());
  return wrap;
}

/* -------------------------------------------------------- module detail */

function renderModuleDetail(id) {
  const m = moduleById(id);
  const wrap = el("div", null, []);
  if (!m) {
    wrap.appendChild(el("p", null, ["Module not found."]));
    return wrap;
  }
  wrap.appendChild(el("span", { class: "back-link", onclick: () => navigate("modules") }, ["← All modules"]));
  wrap.appendChild(el("h1", null, [m.title]));
  wrap.appendChild(el("p", { class: "subtitle" }, ["Maps to JD: " + m.jdRef]));
  if (m.status === "strength") {
    wrap.appendChild(el("span", { class: "badge ok", style: "margin-bottom:14px;display:inline-block" }, ["You already have hands-on experience here — this is polish, not a gap"]));
  }

  wrap.appendChild(el("div", { class: "card" }, [el("p", null, [m.summary])]));

  const conceptsCard = el("div", { class: "card" }, [el("h3", null, ["Key concepts"])]);
  conceptsCard.appendChild(el("ul", { class: "concepts" }, m.concepts.map((c) => el("li", null, [c]))));
  wrap.appendChild(conceptsCard);

  wrap.appendChild(el("div", { class: "card" }, [
    el("h3", null, ["Hands-on practice"]),
    el("p", null, [m.practice]),
  ]));

  const actions = el("div", { class: "grid cols-2" }, [
    el("button", { class: "btn", onclick: () => navigate("flashcards/" + m.id) }, ["Study flashcards (" + m.flashcards.length + ")"]),
    el("button", { class: "btn secondary", onclick: () => navigate("quiz/" + m.id) }, ["Take quiz (" + m.quiz.length + " questions)"]),
  ]);
  wrap.appendChild(actions);

  return wrap;
}

/* -------------------------------------------------------------- pill nav */

function modulePillNav(activeId, onSelect) {
  const nav = el("div", { class: "pill-nav" }, []);
  nav.appendChild(el("button", { class: activeId === "all" ? "active" : "", onclick: () => onSelect("all") }, ["All modules"]));
  MODULES.forEach((m) => {
    nav.appendChild(el("button", { class: activeId === m.id ? "active" : "", onclick: () => onSelect(m.id) }, [m.title]));
  });
  return nav;
}

/* -------------------------------------------------------------- flashcards */

function renderFlashcards(argId) {
  const wrap = el("div", null, []);
  wrap.appendChild(el("h1", null, ["Flashcards"]));
  wrap.appendChild(el("p", { class: "subtitle" }, ["Click a card to flip it. Mark yourself honestly — this only affects what's shown to you."]));

  const activeId = argId || "all";
  wrap.appendChild(modulePillNav(activeId, (id) => navigate("flashcards/" + id)));

  let cards = [];
  if (activeId === "all") {
    MODULES.forEach((m) => m.flashcards.forEach((c, i) => cards.push({ ...c, key: m.id + ":" + i, moduleTitle: m.title })));
  } else {
    const m = moduleById(activeId);
    if (m) m.flashcards.forEach((c, i) => cards.push({ ...c, key: m.id + ":" + i, moduleTitle: m.title }));
  }

  const known = cards.filter((c) => state.flash[c.key] === "known").length;
  wrap.appendChild(el("p", { class: "jd-ref" }, [known + " / " + cards.length + " marked known"]));

  const grid = el("div", { class: "grid cols-2" }, []);
  cards.forEach((c) => grid.appendChild(flashcardNode(c)));
  wrap.appendChild(grid);

  wrap.appendChild(footerNote());
  return wrap;
}

function flashcardNode(card) {
  const status = state.flash[card.key];
  const container = el("div", null, []);
  const fc = el("div", { class: "flashcard" }, [
    el("div", { class: "flashcard-inner" }, [
      el("div", { class: "flashcard-face front" }, [
        el("div", null, [card.f, el("div", { class: "flashcard-hint" }, ["click to flip · " + card.moduleTitle])]),
      ]),
      el("div", { class: "flashcard-face back" }, [card.b]),
    ]),
  ]);
  fc.addEventListener("click", () => fc.classList.toggle("flipped"));
  container.appendChild(fc);

  const controls = el("div", { style: "display:flex;gap:8px;margin-top:8px;justify-content:center" }, [
    el("button", {
      class: "btn small " + (status === "unsure" ? "" : "secondary"),
      onclick: () => { state.flash[card.key] = "unsure"; saveState(); container.replaceWith(flashcardNode(card)); },
    }, ["Still unsure"]),
    el("button", {
      class: "btn small " + (status === "known" ? "" : "secondary"),
      onclick: () => { state.flash[card.key] = "known"; saveState(); container.replaceWith(flashcardNode(card)); },
    }, ["I know this"]),
  ]);
  container.appendChild(controls);
  return container;
}

/* -------------------------------------------------------------------- quiz */

function renderQuiz(argId) {
  const wrap = el("div", null, []);
  wrap.appendChild(el("h1", null, ["Quiz"]));
  wrap.appendChild(el("p", { class: "subtitle" }, ["Multiple choice. Pick a module, or 'All modules' for a mixed exam. Your best score per module is saved."]));

  const activeId = argId || "all";
  wrap.appendChild(modulePillNav(activeId, (id) => navigate("quiz/" + id)));

  let questions = [];
  if (activeId === "all") {
    MODULES.forEach((m) => m.quiz.forEach((q) => questions.push({ ...q, moduleId: m.id, moduleTitle: m.title })));
  } else {
    const m = moduleById(activeId);
    if (m) questions = m.quiz.map((q) => ({ ...q, moduleId: m.id, moduleTitle: m.title }));
  }

  const quizArea = el("div", null, []);
  wrap.appendChild(quizArea);
  quizArea.appendChild(buildQuizRunner(questions, activeId));

  return wrap;
}

function buildQuizRunner(questions, scopeId) {
  const container = el("div", null, []);
  const answers = new Array(questions.length).fill(null);

  const list = el("div", null, []);
  questions.forEach((q, qi) => {
    const qCard = el("div", { class: "card" }, []);
    qCard.appendChild(el("div", { class: "jd-ref" }, [q.moduleTitle]));
    qCard.appendChild(el("div", { class: "quiz-question" }, [(qi + 1) + ". " + q.q]));
    const optsWrap = el("div", { class: "quiz-options" }, []);
    q.options.forEach((opt, oi) => {
      const optNode = el("div", { class: "quiz-option" }, [opt]);
      optNode.addEventListener("click", () => {
        if (answers[qi] !== null) return; // lock after first answer
        answers[qi] = oi;
        Array.from(optsWrap.children).forEach((child, ci) => {
          if (ci === q.correct) child.classList.add("correct");
          else if (ci === oi) child.classList.add("incorrect");
        });
        qCard.appendChild(el("div", { class: "quiz-explain" }, [q.explain]));
        updateProgress();
      });
      optsWrap.appendChild(optNode);
    });
    qCard.appendChild(optsWrap);
    list.appendChild(qCard);
  });
  container.appendChild(list);

  const resultBar = el("div", { class: "card", style: "position:sticky;bottom:12px" }, []);
  const progressLine = el("div", null, ["0 / " + questions.length + " answered"]);
  resultBar.appendChild(progressLine);
  const submitBtn = el("button", { class: "btn", style: "margin-top:8px" }, ["Finish & score"]);
  resultBar.appendChild(submitBtn);
  container.appendChild(resultBar);

  function updateProgress() {
    const answered = answers.filter((a) => a !== null).length;
    progressLine.textContent = answered + " / " + questions.length + " answered";
  }

  submitBtn.addEventListener("click", () => {
    const answered = answers.filter((a) => a !== null).length;
    if (answered < questions.length) {
      progressLine.textContent = "Answer all questions first (" + answered + " / " + questions.length + ")";
      return;
    }
    const correctCount = questions.reduce((acc, q, i) => acc + (answers[i] === q.correct ? 1 : 0), 0);
    const pct = Math.round((correctCount / questions.length) * 100);

    // Save best score per touched module
    const touched = {};
    questions.forEach((q) => { touched[q.moduleId] = true; });
    if (scopeId !== "all") {
      const rec = state.quiz[scopeId] || { best: 0, attempts: 0 };
      rec.best = Math.max(rec.best, pct);
      rec.attempts = (rec.attempts || 0) + 1;
      rec.lastDate = new Date().toISOString();
      state.quiz[scopeId] = rec;
    } else {
      // mixed exam: distribute per-module score based on that module's subset
      Object.keys(touched).forEach((mid) => {
        const subQs = questions.filter((q) => q.moduleId === mid);
        const subCorrect = subQs.reduce((acc, q) => {
          const idxInAll = questions.indexOf(q);
          return acc + (answers[idxInAll] === q.correct ? 1 : 0);
        }, 0);
        const subPct = Math.round((subCorrect / subQs.length) * 100);
        const rec = state.quiz[mid] || { best: 0, attempts: 0 };
        rec.best = Math.max(rec.best, subPct);
        rec.attempts = (rec.attempts || 0) + 1;
        rec.lastDate = new Date().toISOString();
        state.quiz[mid] = rec;
      });
    }
    saveState();

    resultBar.innerHTML = "";
    const b = badgeForScore(pct);
    resultBar.appendChild(el("div", { style: "font-size:1.1rem;font-weight:700" }, ["Score: " + correctCount + " / " + questions.length + " (" + pct + "%)"]));
    resultBar.appendChild(el("span", { class: "badge " + b.cls, style: "margin-top:6px;display:inline-block" }, [pct >= 80 ? "Strong" : pct >= 50 ? "Getting there" : "Needs more study"]));
    resultBar.appendChild(el("div", { style: "margin-top:10px;display:flex;gap:8px" }, [
      el("button", { class: "btn secondary", onclick: () => route() }, ["Retake"]),
      el("button", { class: "btn secondary", onclick: () => navigate("modules") }, ["Back to modules"]),
    ]));
  });

  return container;
}

/* ---------------------------------------------------------------- planner */

function renderPlanner() {
  const wrap = el("div", null, []);
  wrap.appendChild(el("h1", null, ["Study Planner"]));
  wrap.appendChild(el("p", { class: "subtitle" }, ["Set a target date (application deadline or interview date) and how many hours/week you can realistically study. The plan below prioritizes your lowest-scoring modules first."]));

  const targetDate = state.planner.targetDate || "";
  const hoursPerWeek = state.planner.hoursPerWeek || 5;

  const form = el("div", { class: "card grid cols-2" }, []);
  const dateField = el("div", null, [
    el("label", { style: "font-size:0.8rem;color:var(--text-muted)" }, ["Target date"]),
    el("br"),
  ]);
  const dateInput = el("input", { type: "date", value: targetDate });
  dateField.appendChild(dateInput);

  const hoursField = el("div", null, [
    el("label", { style: "font-size:0.8rem;color:var(--text-muted)" }, ["Hours available per week"]),
    el("br"),
  ]);
  const hoursInput = el("input", { type: "number", min: "1", max: "40", value: hoursPerWeek });
  hoursField.appendChild(hoursInput);

  form.appendChild(dateField);
  form.appendChild(hoursField);
  wrap.appendChild(form);

  const genBtn = el("button", { class: "btn", style: "margin:12px 0" }, ["Generate plan"]);
  wrap.appendChild(genBtn);

  const planArea = el("div", null, []);
  wrap.appendChild(planArea);

  function renderPlanTable() {
    planArea.innerHTML = "";
    if (!state.planner.targetDate) return;
    const weeksLeft = Math.max(1, Math.ceil((new Date(state.planner.targetDate) - new Date()) / (7 * 86400000)));
    const hrs = state.planner.hoursPerWeek || 5;
    const ordered = priorityOrderedModules();

    // Roughly 2-3 hours per module for a first pass; spread modules across available weeks.
    const modulesPerWeek = Math.max(1, Math.round((hrs / 2.5) ));
    const weeks = [];
    let idx = 0;
    let weekNum = 1;
    while (idx < ordered.length && weekNum <= weeksLeft) {
      const chunk = ordered.slice(idx, idx + modulesPerWeek);
      weeks.push({ week: weekNum, modules: chunk });
      idx += modulesPerWeek;
      weekNum += 1;
    }
    // If modules remain but weeks ran out, pile the rest into the last week.
    if (idx < ordered.length && weeks.length > 0) {
      weeks[weeks.length - 1].modules = weeks[weeks.length - 1].modules.concat(ordered.slice(idx));
    }

    const card = el("div", { class: "card" }, []);
    card.appendChild(el("p", { class: "jd-ref" }, [
      weeksLeft + " week(s) until target date · ~" + hrs + " hrs/week · lowest-scoring modules scheduled first",
    ]));
    const table = el("table", { class: "planner-table" }, []);
    table.appendChild(el("tr", null, [el("th", null, ["Week"]), el("th", null, ["Focus modules"]), el("th", null, ["Suggested activities"])]));
    weeks.forEach((w) => {
      table.appendChild(
        el("tr", null, [
          el("td", null, ["Week " + w.week]),
          el("td", null, [w.modules.map((m) => m.title).join(", ")]),
          el("td", null, ["Read concepts, flashcards, then quiz for each"]),
        ])
      );
    });
    card.appendChild(table);
    planArea.appendChild(card);

    if (idx < ordered.length && weeksLeft < ordered.length) {
      planArea.appendChild(el("p", { class: "jd-ref" }, [
        "Note: your timeline is tight relative to the full module list — the plan above compresses multiple modules per week accordingly. Prioritize Cadence, Altium, C#, and dFMEA first — they're the most explicit qualification gaps.",
      ]));
    }
  }

  genBtn.addEventListener("click", () => {
    state.planner.targetDate = dateInput.value;
    state.planner.hoursPerWeek = parseInt(hoursInput.value, 10) || 5;
    saveState();
    renderPlanTable();
  });

  renderPlanTable();

  wrap.appendChild(el("h2", null, ["Suggested priority order"]));
  wrap.appendChild(el("p", { class: "subtitle" }, ["Based on your current quiz scores (lowest first). Unattempted modules rank highest since they're an unknown risk."]));
  const priorityCard = el("div", { class: "card" }, []);
  priorityOrderedModules().forEach((m, i) => {
    const score = scorePctFor(m.id);
    const b = badgeForScore(score);
    priorityCard.appendChild(
      el("div", { class: "module-card", style: "padding:8px 0;border-bottom:1px solid var(--border);cursor:pointer", onclick: () => navigate("module/" + m.id) }, [
        el("div", { class: "row" }, [
          el("span", null, [(i + 1) + ". " + m.title]),
          el("span", { class: "badge " + b.cls }, [b.label]),
        ]),
      ])
    );
  });
  wrap.appendChild(priorityCard);

  return wrap;
}

/* -------------------------------------------------------------------- star */

function renderStar() {
  const wrap = el("div", null, []);
  wrap.appendChild(el("h1", null, ["Interview Prep — STAR Bank"]));
  wrap.appendChild(el("p", { class: "subtitle" }, ["Behavioral questions tied directly to this role's responsibilities. Draft answers in Situation / Task / Action / Result form — your notes save automatically in this browser."]));

  STAR_BANK.forEach((item, i) => {
    const key = "star_" + i;
    const box = el("div", { class: "card" }, []);
    box.appendChild(el("div", { class: "tag-row" }, [el("span", { class: "badge" }, [item.topic])]));
    box.appendChild(el("div", { class: "star-q" }, [item.question]));
    box.appendChild(el("div", { class: "star-tip" }, [item.tips]));
    const ta = el("textarea", { rows: "4", placeholder: "Draft your STAR answer here..." }, []);
    ta.value = state.starAnswers[key] || "";
    ta.addEventListener("input", () => {
      state.starAnswers[key] = ta.value;
      saveState();
    });
    box.appendChild(ta);
    wrap.appendChild(box);
  });

  wrap.appendChild(footerNote());
  return wrap;
}

/* ------------------------------------------------------------------ resume */

function renderResume() {
  const wrap = el("div", null, []);
  wrap.appendChild(el("h1", null, ["Resume & Positioning: Gap Bridge"]));
  wrap.appendChild(el("p", { class: "subtitle" }, ["How to frame your existing EE Technician II experience and Computer Engineering degree against this specific JD, and how to talk honestly about the gaps."]));

  wrap.appendChild(el("div", { class: "card" }, [
    el("h3", null, ["Your existing strengths, in this role's language"]),
    el("ul", { class: "concepts" }, [
      el("li", null, ["Years of hands-on EE Technician work translate directly to \"circuit design, system bring-up, integration, and debug\" — the JD's top qualification line. Make this concrete with specific projects, not just years of tenure."]),
      el("li", null, [el("b", null, ["Altium schematic capture and PCB layout"]), " — you've already designed several boards for the EE R&D team in Altium, spanning RF, digital/logic, and automation-related boards, plus a battery installation board. This is a named qualification, fully satisfied, and the RF/logic breadth lines up directly with the team name (\"RF & Electrical Engineering\") and this JD's telemetry-adjacent work. Bring 2-3 specific boards to talk through (stack-up/layout decisions, DRC/ERC catches, tradeoffs) — see the Altium module and the \"Altium Layout Decisions\" question in Interview Prep."]),
      el("li", null, [el("b", null, ["The ~1cm × 1cm fix/patch board"]), " you designed to install onto an existing board is a standout, memorable story — it demonstrates extreme space-constrained layout, careful mechanical/electrical integration onto a pre-existing design, and almost certainly hands-on rework/rebuild-adjacent debug skill. Lead an interview answer with this when asked about a hard layout or bring-up challenge; it's more specific and more impressive than a generic \"I designed a board\" answer."]),
      el("li", null, ["The battery installation board is directly relevant to the JD's \"low-power circuit design\" qualification and to a Neuromodulation (implant/battery-powered) product line — even if your role was mechanical/electrical integration rather than power-supply topology design, describe what you learned about the battery interface, connector/mechanical constraints, and any protection circuitry involved."]),
      el("li", null, ["Direct familiarity with oscilloscopes, multimeters, and logic analyzers already satisfies a named qualification — lead with specific debug stories, not just tool names."]),
      el("li", null, ["Working inside a medical device R&D team already gives you exposure to the \"highly regulated industry\" preference, even without owning design controls yourself — describe what you've seen/followed."]),
      el("li", null, ["Finishing a Bachelor's in Computer Engineering this December satisfies the degree requirement outright and signals you can learn formal EE/CE theory (including the C#, embedded, and systems topics this role needs) while working full-time — that's a strong, provable growth signal."]),
    ]),
  ]));

  wrap.appendChild(el("div", { class: "card" }, [
    el("h3", null, ["The 3 remaining gaps to close before you apply/interview"]),
    el("p", { class: "jd-ref" }, ["Altium moved to strengths above — your own board designs already cover that named qualification."]),
    el("ul", { class: "concepts" }, [
      el("li", null, [el("b", null, ["Cadence simulation"]), " — named explicitly, and distinct from Altium (simulation vs. layout). Do the LTspice practice project in the Cadence module so you can speak to at least one concrete simulation you ran (transient + AC/loop-gain)."]),
      el("li", null, [el("b", null, ["C# for test automation"]), " — a hard 2+ year qualification. Build the small IInstrument/mock/NUnit project from the C# module; it gives you a real, specific example instead of a resume claim."]),
      el("li", null, [el("b", null, ["dFMEA (independently)"]), " — do the mini dFMEA practice exercise on a real circuit you've worked on, ideally one of your own boards, so you can walk through the S/O/D/RPN process live if asked."]),
    ]),
  ]));

  wrap.appendChild(el("div", { class: "card" }, [
    el("h3", null, ["Framing for an internal move"]),
    el("p", null, [
      "If you're preparing for this role within the same company, your biggest edge is context: you already know the products, the team's quality processes, and likely some of the people involved. ",
      "Use that directly — reference specific programs or issues you've supported as an EE Technician, and be ready to explain, concretely, how you'd carry that context into a design-ownership role rather than a support role.",
    ]),
  ]));

  wrap.appendChild(footerNote());
  return wrap;
}

/* --------------------------------------------------------------- glossary */

function renderGlossary() {
  const wrap = el("div", null, []);
  wrap.appendChild(el("h1", null, ["Glossary"]));
  wrap.appendChild(el("p", { class: "subtitle" }, ["Quick reference for the acronyms and terms used throughout this app and likely to come up in interviews."]));

  const search = el("input", { class: "searchbox", type: "text", placeholder: "Search terms..." });
  wrap.appendChild(search);

  const list = el("div", { class: "card" }, []);
  wrap.appendChild(list);

  function renderList(filter) {
    list.innerHTML = "";
    const f = (filter || "").toLowerCase();
    GLOSSARY.filter((g) => !f || g.term.toLowerCase().includes(f) || g.def.toLowerCase().includes(f)).forEach((g) => {
      list.appendChild(
        el("div", { class: "glossary-item" }, [
          el("div", { class: "glossary-term" }, [g.term]),
          el("div", { class: "glossary-def" }, [g.def]),
        ])
      );
    });
  }
  search.addEventListener("input", () => renderList(search.value));
  renderList("");

  return wrap;
}

/* ------------------------------------------------------------------ init */

document.addEventListener("DOMContentLoaded", () => {
  route();
});
