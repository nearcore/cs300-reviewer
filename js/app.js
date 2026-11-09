/* CS300 Reviewer app: tabs, notes + search, flashcards, quiz, outline.
   Progress lives in this browser's localStorage only. */
(function () {
  "use strict";

  var D = window.CS300;
  var TOPICS = D.topics;
  var ALL = { sections: D.sections, flashcards: D.flashcards, questions: D.questions, outline: D.outline, terms: D.terms || [], drills: D.drills || [] };
  ALL.questions.forEach(function (q) { if (D.examples && D.examples[q.id]) q.ex = D.examples[q.id]; });
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  /* ---------- storage (never trusted to exist) ---------- */
  var store = {
    get: function (k, d) {
      try { var v = localStorage.getItem("cs300:" + k); return v ? JSON.parse(v) : d; } catch (e) { return d; }
    },
    set: function (k, v) {
      try { localStorage.setItem("cs300:" + k, JSON.stringify(v)); } catch (e) { /* storage unavailable */ }
    }
  };

  var cardMarks = store.get("cards", {});          // id -> "known" | "learning"
  var outlineDone = store.get("outline", {});      // id -> true
  var quizStats = store.get("quiz", { history: [], missed: {} });
  if (!quizStats.history) quizStats.history = [];
  if (!quizStats.missed) quizStats.missed = {};

  /* ---------- exam scope: Midterm 1, Midterm 2, or both ---------- */
  var exam = store.get("exam", "m2");
  var EXAMS = {
    m1: { name: "Midterm 1", title: "Mobile app development reviewer", outline: "Midterm 1 outline",
      intro: "Java packages, design patterns, Android Views and graphics, Handler, nested classes, Holub, and the CS202 fundamentals. Answers confirmed in class are marked green. Where the record only kept a paraphrase, the notes say so.",
      outlineNote: "All 17 study-guide items, grouped as in the midterm outline. Check an item off once you can explain it without notes." },
    m2: { name: "Midterm 2", title: "Midterm 2 reviewer", outline: "Midterm 2 outline",
      intro: "var, static, null pointers, try/catch, polymorphism, nested classes, lambdas, streams, method chaining, concurrent modification, seven design patterns, the activity lifecycle, Handler, and intersection math. Midterm 1 is fair game too, so switch to Both when you have time.",
      outlineNote: "Every topic on the Midterm 2 study guide. Check an item off once you can explain it without notes." },
    both: { name: "Both midterms", title: "Midterm 1 and 2 reviewer", outline: "Midterm 1 and 2 outline",
      intro: "Everything from both study guides in one place. Midterm 2 can test any of the Midterm 1 material.",
      outlineNote: "Every item from both study guides. Check an item off once you can explain it without notes." }
  };
  function examOf(topic) { return /^m\d/.test(topic) ? "m2" : "m1"; }
  function inExam(topic) { return exam === "both" || examOf(topic) === exam; }
  function applyExam() {
    D.sections = ALL.sections.filter(function (s) { return inExam(s.id); });
    D.flashcards = ALL.flashcards.filter(function (c) { return inExam(c.topic); });
    D.questions = ALL.questions.filter(function (q) { return inExam(q.topic); });
    D.outline = ALL.outline.filter(function (o) { return inExam(o.topics[0]); });
    D.terms = ALL.terms.filter(function (t) { return exam === "both" || t.exam === "both" || t.exam === exam; });
    D.drills = ALL.drills.filter(function (d) { return inExam(d.topic); });
  }
  applyExam();

  /* ---------- helpers ---------- */
  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  function fmt(s) { // escape, then `code`
    return esc(s).replace(/`([^`]+)`/g, "<code>$1</code>");
  }
  function shuffle(a) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function exampleBlock(ex) {
    if (!ex) return "";
    return '<div class="q-example"><span class="eyebrow">Example</span>' +
      (ex.charAt(0) === "~" ? "<p>" + fmt(ex.slice(1)) + "</p>" : codeBlock(ex)) + "</div>";
  }
  function highlight(root) {
    if (window.Prism && Prism.languages && Prism.languages.java) {
      $$("pre.code code", root).forEach(function (el) { Prism.highlightElement(el); });
    }
  }
  function codeBlock(src) {
    return '<pre class="code"><code class="language-java">' + esc(src) + "</code></pre>";
  }
  function plural(n, word) { return n + " " + word + (n === 1 ? "" : "s"); }
  function topicsLabel(ids) { return ids.map(function (t) { return TOPICS[t]; }).join(", "); }
  function inSet(topics, t) { return !topics || topics.indexOf(t) !== -1; }

  /* Two-step confirm inside the page (no confirm() in the viewer). */
  function armConfirm(btn, label, onConfirm) {
    if (btn.dataset.armed) {
      clearTimeout(+btn.dataset.armed);
      delete btn.dataset.armed;
      btn.classList.remove("inline-confirm");
      onConfirm();
      return;
    }
    var original = btn.textContent;
    btn.textContent = label;
    btn.classList.add("inline-confirm");
    btn.dataset.armed = String(setTimeout(function () {
      delete btn.dataset.armed;
      btn.textContent = original;
      btn.classList.remove("inline-confirm");
    }, 3500));
  }

  /* ---------- tabs ---------- */
  var TABS = ["notes", "terms", "cards", "quiz", "drills", "outline"];
  if (D.walkthroughs) TABS.push("classcode", "labcode");
  var currentTab = "notes";

  function showTab(name, opts) {
    if (TABS.indexOf(name) === -1) name = "notes";
    currentTab = name;
    TABS.forEach(function (t) {
      $("#panel-" + t).hidden = t !== name;
      var tab = $("#tab-" + t);
      tab.setAttribute("aria-selected", String(t === name));
      tab.tabIndex = t === name ? 0 : -1;
    });
    store.set("tab", name);
    if (location.hash.slice(1) !== name) {
      try { history.replaceState(null, "", "#" + name); } catch (e) { /* ignore */ }
    }
    if (!opts || !opts.keepScroll) window.scrollTo(0, 0);
  }

  function updateChips() {
    var known = D.flashcards.filter(function (c) { return cardMarks[c.id] === "known"; }).length;
    $("#chip-cards b").textContent = known + "/" + D.flashcards.length;
    var done = D.outline.filter(function (o) { return outlineDone[o.id]; }).length;
    $("#chip-outline b").textContent = done + "/" + D.outline.length;
    var last = quizStats.history[quizStats.history.length - 1];
    $("#chip-quiz b").textContent = last ? Math.round(100 * last.s / last.n) + "%" : "—";
    $("#tab-cards .count").textContent = D.flashcards.length;
    $("#tab-quiz .count").textContent = D.questions.length;
    $("#tab-terms .count").textContent = D.terms.length;
    $("#tab-drills .count").textContent = D.drills.length;
  }

  /* ---------- NOTES ---------- */
  function countFor(topic) {
    return {
      q: D.questions.filter(function (q) { return q.topic === topic; }).length,
      c: D.flashcards.filter(function (c) { return c.topic === topic; }).length
    };
  }

  var notesObserver = null;
  function renderNotes() {
    var E = EXAMS[exam];
    $("#intro-eyebrow").textContent = "CS300 · " + E.name;
    $("#intro-title").textContent = E.title;
    $("#intro-text").textContent = E.intro;
    var toc = $("#toc");
    var jump = $("#toc-jump");
    var reading = $("#topics");
    toc.innerHTML = D.sections.map(function (s) {
      return '<li><button type="button" data-goto="' + s.id + '"><span class="n">' + esc(s.num) + "</span><span>" + esc(s.title) + "</span></button></li>";
    }).join("");
    jump.innerHTML = '<option value="">Jump to a topic…</option>' + D.sections.map(function (s) {
      return '<option value="' + s.id + '">' + esc(s.num) + ". " + esc(s.title) + "</option>";
    }).join("");
    reading.innerHTML = D.sections.map(function (s) {
      var n = countFor(s.id);
      var foot = "";
      if (n.q || n.c) {
        foot = '<div class="topic-foot">' +
          (n.q ? '<button class="btn small" type="button" data-quiz-topic="' + s.id + '">Practice ' + plural(n.q, "question") + "</button>" : "") +
          (n.c ? '<button class="btn small" type="button" data-cards-topic="' + s.id + '">Study ' + plural(n.c, "flashcard") + "</button>" : "") +
          "</div>";
      }
      return '<article class="topic" id="sec-' + s.id + '" data-id="' + s.id + '">' +
        '<header class="topic-head"><span class="topic-num">' + esc(s.num) + "</span><h2>" + esc(s.title) + "</h2></header>" +
        '<div class="topic-body" style="display:grid;gap:14px">' + s.html + "</div>" + foot + "</article>";
    }).join("");
    highlight(reading);

    // Track which section is in view for the rail.
    if (notesObserver) notesObserver.disconnect();
    if ("IntersectionObserver" in window) {
      notesObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) setActiveToc(en.target.dataset.id);
        });
      }, { rootMargin: "-130px 0px -65% 0px" });
      $$(".topic", reading).forEach(function (el) { notesObserver.observe(el); });
    }
  }

  function initNotes() {
    var toc = $("#toc");
    var jump = $("#toc-jump");
    var reading = $("#topics");
    renderNotes();
    toc.addEventListener("click", function (e) {
      var b = e.target.closest("[data-goto]");
      if (b) gotoSection(b.dataset.goto);
    });
    jump.addEventListener("change", function () {
      if (jump.value) gotoSection(jump.value);
      jump.value = "";
    });
    reading.addEventListener("click", function (e) {
      var q = e.target.closest("[data-quiz-topic]");
      if (q) { startQuizFor([q.dataset.quizTopic], TOPICS[q.dataset.quizTopic]); return; }
      var c = e.target.closest("[data-cards-topic]");
      if (c) { openCardsFor([c.dataset.cardsTopic], TOPICS[c.dataset.cardsTopic]); }
    });

    var search = $("#notes-search");
    var t;
    search.addEventListener("input", function () {
      clearTimeout(t);
      t = setTimeout(function () { applySearch(search.value); }, 120);
    });
  }

  function setActiveToc(id) {
    $$("#toc button").forEach(function (b) { b.classList.toggle("active", b.dataset.goto === id); });
  }

  function gotoSection(id) {
    if (currentTab !== "notes") showTab("notes");
    var search = $("#notes-search");
    if (search.value) { search.value = ""; applySearch(""); }
    var el = $("#sec-" + id);
    if (!el) return;
    var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    setActiveToc(id);
  }

  function clearMarks(root) {
    $$("mark.sr", root).forEach(function (m) {
      var p = m.parentNode;
      p.replaceChild(document.createTextNode(m.textContent), m);
      p.normalize();
    });
  }

  function markText(root, q) {
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) {
        if (!n.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        if (n.parentNode.closest("pre")) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    var nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    var lq = q.toLowerCase();
    nodes.forEach(function (node) {
      var text = node.nodeValue;
      var lower = text.toLowerCase();
      var idx = lower.indexOf(lq);
      if (idx === -1) return;
      var frag = document.createDocumentFragment();
      var pos = 0;
      while (idx !== -1) {
        frag.appendChild(document.createTextNode(text.slice(pos, idx)));
        var m = document.createElement("mark");
        m.className = "sr";
        m.textContent = text.slice(idx, idx + q.length);
        frag.appendChild(m);
        pos = idx + q.length;
        idx = lower.indexOf(lq, pos);
      }
      frag.appendChild(document.createTextNode(text.slice(pos)));
      node.parentNode.replaceChild(frag, node);
    });
  }

  function applySearch(raw) {
    var q = raw.trim();
    var status = $("#search-status");
    var sections = $$("#topics .topic");
    sections.forEach(function (el) { clearMarks(el); });
    $("#notes-intro").hidden = !!q;
    if (!q) {
      sections.forEach(function (el) { el.hidden = false; });
      $$("#toc li").forEach(function (li) { li.hidden = false; });
      status.textContent = "";
      return;
    }
    var lq = q.toLowerCase();
    var hits = 0;
    sections.forEach(function (el) {
      var match = el.textContent.toLowerCase().indexOf(lq) !== -1;
      el.hidden = !match;
      var li = $('#toc [data-goto="' + el.dataset.id + '"]').parentNode;
      li.hidden = !match;
      if (match) { hits++; markText(el, q); }
    });
    status.textContent = hits ? plural(hits, "section") + " mention “" + q + "”" : "No sections mention “" + q + "”";
  }

  /* ---------- FLASHCARDS ---------- */
  var deck = {
    topics: null, label: "", status: "all", shuffled: false,
    order: [], idx: 0, flipped: false
  };

  function deckSource() {
    return D.flashcards.filter(function (c) {
      if (!inSet(deck.topics, c.topic)) return false;
      var m = cardMarks[c.id];
      if (deck.status === "learning") return m === "learning";
      if (deck.status === "unmarked") return !m;
      if (deck.status === "known") return m === "known";
      return true;
    });
  }

  function rebuildDeck(keepId) {
    var list = deckSource();
    if (deck.shuffled) list = shuffle(list);
    deck.order = list.map(function (c) { return c.id; });
    var i = keepId != null ? deck.order.indexOf(keepId) : -1;
    deck.idx = i >= 0 ? i : 0;
    deck.flipped = false;
  }

  function cardById(id) {
    for (var i = 0; i < D.flashcards.length; i++) if (D.flashcards[i].id === id) return D.flashcards[i];
    return null;
  }

  function renderCardTopicSelect() {
    var sel = $("#cards-topic");
    var html = '<option value="all">All topics</option>';
    var used = {};
    D.flashcards.forEach(function (c) { used[c.topic] = (used[c.topic] || 0) + 1; });
    Object.keys(TOPICS).forEach(function (t) {
      if (used[t]) html += '<option value="' + t + '">' + esc(TOPICS[t]) + " (" + used[t] + ")</option>";
    });
    if (deck.topics && deck.topics.length > 1) html += '<option value="custom">' + esc(deck.label) + "</option>";
    sel.innerHTML = html;
    sel.value = !deck.topics ? "all" : deck.topics.length > 1 ? "custom" : deck.topics[0];
  }

  function renderCards() {
    var counts = { known: 0, learning: 0, none: 0 };
    D.flashcards.forEach(function (c) {
      var m = cardMarks[c.id];
      if (m === "known") counts.known++; else if (m === "learning") counts.learning++; else counts.none++;
    });
    $("#deck-legend").innerHTML =
      '<span class="k">' + counts.known + " known</span>" +
      '<span class="l">' + counts.learning + " still learning</span>" +
      "<span>" + counts.none + " not marked</span>";

    var currentId = deck.order[deck.idx];
    $("#deck-strip").setAttribute("aria-label", "All " + D.flashcards.length + " cards. Pick one to jump to it.");
    $("#deck-strip").innerHTML = D.flashcards.map(function (c) {
      var m = cardMarks[c.id] || "";
      var inDeck = deck.order.indexOf(c.id) !== -1;
      return '<button type="button" data-card="' + c.id + '" class="' + m + (c.id === currentId ? " current" : "") + '"' +
        (inDeck ? "" : ' style="opacity:.3"') +
        ' title="Card ' + c.id + ": " + esc(c.front) + '" aria-label="Card ' + c.id + (m ? ", " + m : "") + '"></button>';
    }).join("");

    $$("#cards-status button").forEach(function (b) { b.setAttribute("aria-pressed", String(b.dataset.status === deck.status)); });
    $("#cards-shuffle").setAttribute("aria-pressed", String(deck.shuffled));
    $("#cards-shuffle").textContent = deck.shuffled ? "Shuffled" : "Shuffle";

    var stage = $("#card-area");
    if (!deck.order.length) {
      var msg = deck.status === "learning" ? "No cards marked “still learning” in this set." :
        deck.status === "unmarked" ? "Every card in this set is marked. Nice work." :
        deck.status === "known" ? "No cards marked “known” in this set yet." : "No cards in this set.";
      stage.innerHTML = '<div class="empty"><p>' + msg + '</p><button class="btn" type="button" data-act="show-all">Show all cards</button></div>';
      return;
    }
    var c = cardById(currentId);
    var mark = cardMarks[c.id];
    stage.innerHTML =
      '<div class="card-stage">' +
        '<button type="button" class="card' + (deck.flipped ? " flipped" : "") + '" id="flashcard" aria-label="Flashcard. Press to flip.">' +
          '<div class="face front" aria-hidden="' + deck.flipped + '">' +
            '<div class="face-meta"><span>#' + c.id + " · " + esc(TOPICS[c.topic]) + "</span><span>" + (deck.idx + 1) + " / " + deck.order.length + "</span></div>" +
            '<div class="face-body">' + fmt(c.front) + "</div>" +
            '<div class="face-hint">Say the answer out loud, then flip. <span class="kbd">Space</span></div>' +
          "</div>" +
          '<div class="face back" aria-hidden="' + !deck.flipped + '">' +
            '<div class="face-meta"><span>Answer</span><span>' + (deck.idx + 1) + " / " + deck.order.length + "</span></div>" +
            '<div class="face-body">' + fmt(c.back) + "</div>" +
            '<div class="face-hint">' + esc(c.front) + "</div>" +
          "</div>" +
        "</button>" +
      "</div>" +
      '<div class="card-controls">' +
        '<div class="group">' +
          '<button class="btn" type="button" data-act="prev" aria-label="Previous card">← Prev</button>' +
          '<button class="btn" type="button" data-act="flip">Flip</button>' +
          '<button class="btn" type="button" data-act="next" aria-label="Next card">Next →</button>' +
        "</div>" +
        '<div class="group">' +
          '<button class="btn learn' + (mark === "learning" ? " on" : "") + '" type="button" data-act="learning">Still learning <span class="kbd">L</span></button>' +
          '<button class="btn know' + (mark === "known" ? " on" : "") + '" type="button" data-act="known">Know it <span class="kbd">K</span></button>' +
        "</div>" +
      "</div>";
  }

  function cardStep(d) {
    if (!deck.order.length) return;
    deck.idx = (deck.idx + d + deck.order.length) % deck.order.length;
    deck.flipped = false;
    renderCards();
  }

  function cardFlip() {
    var el = $("#flashcard");
    if (!el) return;
    deck.flipped = !deck.flipped;
    el.classList.toggle("flipped", deck.flipped);
    $(".face.front", el).setAttribute("aria-hidden", String(deck.flipped));
    $(".face.back", el).setAttribute("aria-hidden", String(!deck.flipped));
  }

  function cardMark(kind) {
    var id = deck.order[deck.idx];
    if (id == null) return;
    if (cardMarks[id] === kind) delete cardMarks[id]; else cardMarks[id] = kind;
    store.set("cards", cardMarks);
    updateChips();
    var stillIn = deckSource().some(function (c) { return c.id === id; });
    if (stillIn) {
      // advance to next card
      deck.idx = (deck.idx + 1) % deck.order.length;
      deck.flipped = false;
      renderCards();
    } else {
      // card left the filtered deck; keep position
      var nextId = deck.order[deck.idx + 1];
      rebuildDeck(nextId);
      renderCards();
    }
  }

  function openCardsFor(topics, label) {
    deck.topics = topics;
    deck.label = label || topicsLabel(topics);
    deck.status = "all";
    rebuildDeck();
    renderCardTopicSelect();
    renderCards();
    showTab("cards");
  }

  function initCards() {
    renderCardTopicSelect();
    rebuildDeck();
    renderCards();

    $("#cards-topic").addEventListener("change", function (e) {
      var v = e.target.value;
      if (v === "custom") return;
      deck.topics = v === "all" ? null : [v];
      deck.label = "";
      rebuildDeck();
      renderCardTopicSelect();
      renderCards();
    });
    $("#cards-status").addEventListener("click", function (e) {
      var b = e.target.closest("[data-status]");
      if (!b) return;
      deck.status = b.dataset.status;
      rebuildDeck();
      renderCards();
    });
    $("#cards-shuffle").addEventListener("click", function () {
      deck.shuffled = !deck.shuffled;
      rebuildDeck(deck.order[deck.idx]);
      if (deck.shuffled) deck.idx = 0;
      renderCards();
    });
    $("#cards-reset").addEventListener("click", function (e) {
      armConfirm(e.currentTarget, "Click again to clear all marks", function () {
        cardMarks = {};
        store.set("cards", cardMarks);
        rebuildDeck();
        renderCards();
        updateChips();
      });
    });
    $("#deck-strip").addEventListener("click", function (e) {
      var b = e.target.closest("[data-card]");
      if (!b) return;
      var id = +b.dataset.card;
      if (deck.order.indexOf(id) === -1) {
        deck.topics = null; deck.status = "all"; deck.label = "";
        rebuildDeck(id);
        renderCardTopicSelect();
      } else {
        deck.idx = deck.order.indexOf(id);
        deck.flipped = false;
      }
      renderCards();
    });
    $("#card-area").addEventListener("click", function (e) {
      if (e.target.closest("#flashcard")) { cardFlip(); return; }
      var b = e.target.closest("[data-act]");
      if (!b) return;
      var a = b.dataset.act;
      if (a === "prev") cardStep(-1);
      else if (a === "next") cardStep(1);
      else if (a === "flip") cardFlip();
      else if (a === "known" || a === "learning") cardMark(a);
      else if (a === "show-all") {
        deck.status = "all"; deck.topics = null; deck.label = "";
        rebuildDeck(); renderCardTopicSelect(); renderCards();
      }
    });
  }

  /* ---------- QUIZ ---------- */
  var quizCfg = store.get("quizCfg", { src: "all", topic: "all", len: 10, missedOnly: false });
  if (!quizCfg.kind) quizCfg.kind = "all";
  var KINDS = { print: "What prints?", compile: "Does it compile?", bug: "Find the bug", pattern: "Which pattern?", concept: "Concepts" };
  function kindOf(q) { return q.kind || "concept"; }
  var quizCustom = null; // {topics, label} when launched from notes/outline
  var quiz = null;       // active run

  function quizPool() {
    var topics = quizCustom ? quizCustom.topics : (quizCfg.topic === "all" ? null : [quizCfg.topic]);
    return D.questions.filter(function (q) {
      if (quizCfg.src !== "all" && q.src !== quizCfg.src) return false;
      if (quizCfg.kind !== "all" && kindOf(q) !== quizCfg.kind) return false;
      if (!inSet(topics, q.topic)) return false;
      if (quizCfg.missedOnly && !quizStats.missed[q.id]) return false;
      return true;
    });
  }

  function missedCount() { return D.questions.filter(function (q) { return quizStats.missed[q.id]; }).length; }

  function renderQuizSetup() {
    var pool = quizPool();
    var n = quizCfg.len === 0 ? pool.length : Math.min(quizCfg.len, pool.length);
    var classN = D.questions.filter(function (q) { return q.src === "class"; }).length;
    var pracN = D.questions.length - classN;
    var used = {};
    D.questions.forEach(function (q) { used[q.topic] = (used[q.topic] || 0) + 1; });
    var topicOpts = '<option value="all">All topics</option>' + Object.keys(TOPICS).filter(function (t) { return used[t]; }).map(function (t) {
      return '<option value="' + t + '">' + esc(TOPICS[t]) + " (" + used[t] + ")</option>";
    }).join("") + (quizCustom ? '<option value="custom">' + esc(quizCustom.label) + "</option>" : "");

    var hist = quizStats.history.slice(-6).reverse();
    var histHtml = hist.length ? '<ul class="history">' + hist.map(function (h) {
      var pct = Math.round(100 * h.s / h.n);
      var d = new Date(h.d);
      var when = isNaN(d) ? "" : d.toLocaleDateString(undefined, { month: "short", day: "numeric" }) + " " + d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
      return "<li><span>" + esc(when) + " · " + esc(h.label || "Quiz") + '</span><span class="bar"><span class="meter"><span style="width:' + pct + '%"></span></span></span><span>' + h.s + "/" + h.n + " <b>" + pct + "%</b></span></li>";
    }).join("") + "</ul>" : '<p class="pool-count">No quizzes yet. Your last six scores will show here.</p>';

    $("#quiz-area").innerHTML =
      '<section class="panel" aria-labelledby="quiz-setup-h">' +
        '<div style="display:grid;gap:6px"><h2 id="quiz-setup-h">Practice quiz</h2>' +
        '<p class="pool-count">' + (classN ? classN + " questions recovered from class quizzes and discussions, plus " + pracN + " practice questions written from the notes." : pracN + " practice questions written from the study guide.") + " After each answer you get the reason and an example.</p></div>" +
        '<div class="field"><p class="eyebrow">Questions from</p><div class="segmented" id="q-src" role="group" aria-label="Question source">' +
          seg("all", "Everything", quizCfg.src) + seg("class", "From class only", quizCfg.src) + seg("practice", "Practice only", quizCfg.src) +
        "</div></div>" +
        '<div class="field"><p class="eyebrow">Question type</p><div class="segmented" id="q-kind" role="group" aria-label="Question type">' +
          seg("all", "All types", quizCfg.kind) + Object.keys(KINDS).map(function (k) { return seg(k, KINDS[k], quizCfg.kind); }).join("") +
        "</div></div>" +
        '<div class="field"><label class="eyebrow" for="q-topic">Topic</label><select id="q-topic">' + topicOpts + "</select></div>" +
        '<div class="field"><p class="eyebrow">Length</p><div class="segmented" id="q-len" role="group" aria-label="Quiz length">' +
          seg("10", "10", String(quizCfg.len)) + seg("20", "20", String(quizCfg.len)) + seg("0", "All", String(quizCfg.len)) +
        "</div></div>" +
        '<label class="check"><input type="checkbox" id="q-missed"' + (quizCfg.missedOnly ? " checked" : "") + (missedCount() ? "" : " disabled") + "> Only questions I’ve missed (" + missedCount() + ")</label>" +
        '<div class="setup-foot"><span class="pool-count">' + (pool.length ? n + " of " + plural(pool.length, "matching question") : "No questions match these settings.") + "</span>" +
          '<button class="btn primary" type="button" id="q-start"' + (pool.length ? "" : " disabled") + ">Start quiz</button></div>" +
      "</section>" +
      '<section class="panel"><h2 style="font-size:var(--step-1)">Recent scores</h2>' + histHtml + "</section>";

    $("#q-topic").value = quizCustom ? "custom" : quizCfg.topic;
  }

  function seg(val, label, cur) {
    return '<button type="button" data-v="' + val + '" aria-pressed="' + (String(val) === String(cur)) + '">' + label + "</button>";
  }

  function saveCfg() { store.set("quizCfg", quizCfg); }

  function startQuiz() {
    var pool = shuffle(quizPool());
    if (quizCfg.len) pool = pool.slice(0, quizCfg.len);
    beginRun(pool, quizLabel());
  }

  function quizLabel() {
    var parts = [];
    if (quizCustom) parts.push(quizCustom.label);
    else if (quizCfg.topic !== "all") parts.push(TOPICS[quizCfg.topic]);
    else parts.push("All topics");
    if (quizCfg.src === "class") parts.push("from class");
    if (quizCfg.src === "practice") parts.push("practice");
    if (quizCfg.kind !== "all") parts.push(KINDS[quizCfg.kind]);
    if (quizCfg.missedOnly) parts.push("missed");
    return parts.join(" · ");
  }

  function beginRun(list, label) {
    quiz = {
      label: label,
      items: list.map(function (q) {
        var idx = q.options.map(function (_, i) { return i; });
        return { q: q, order: q.fixed ? idx : shuffle(idx), pick: null };
      }),
      i: 0
    };
    renderQuestion();
  }

  function renderQuestion() {
    var it = quiz.items[quiz.i];
    var q = it.q;
    var answered = it.pick !== null;
    var pct = Math.round(100 * quiz.i / quiz.items.length);
    var srcBadge = q.src === "class" ?
      '<span class="badge recovered">From class</span>' :
      '<span class="badge practice">Practice</span>';
    var srcNote = q.src === "class" ?
      (q.verbatim ? "Statement quoted from the class quiz; answer confirmed in class." : "Wording paraphrased; answer confirmed in class.") :
      (q.kind === "print" || q.kind === "compile" ? "Practice question. Answer checked by running this code with Java." : "Written from the notes for practice. Not from a class quiz.");

    var opts = it.order.map(function (oi, k) {
      var cls = "opt";
      if (answered) {
        if (oi === 0) cls += " correct";
        else if (oi === it.pick) cls += " wrong";
        else cls += " dim";
      }
      return '<button type="button" class="' + cls + '" data-oi="' + oi + '"' + (answered ? " disabled" : "") + '>' +
        '<span class="letter">' + "ABCD".charAt(k) + "</span><span>" + fmt(q.options[oi]) + "</span></button>";
    }).join("");

    var fb = "";
    if (answered) {
      var ok = it.pick === 0;
      fb = '<div class="feedback ' + (ok ? "ok" : "no") + '" role="status"><span class="verdict">' +
        (ok ? "Correct." : "Not quite. The answer is: " + fmt(q.options[0])) + "</span><span class=\"eyebrow\">Why this is the answer</span><p>" + fmt(q.why) + "</p>" + exampleBlock(q.ex) + "</div>";
    }

    var last = quiz.i === quiz.items.length - 1;
    $("#quiz-area").innerHTML =
      '<section class="panel">' +
        '<div class="q-progress"><span>Question ' + (quiz.i + 1) + " of " + quiz.items.length + "</span>" +
          '<button class="linkish" type="button" data-qa="quit">End quiz</button></div>' +
        '<div class="meter" aria-hidden="true"><span style="width:' + pct + '%;background:var(--accent)"></span></div>' +
        '<div class="q-head">' + srcBadge + '<span class="badge topic">' + esc(TOPICS[q.topic]) + "</span>" +
          (q.kind ? '<span class="badge topic">' + esc(KINDS[q.kind]) + "</span>" : "") + "</div>" +
        '<h2 class="q-text">' + fmt(q.q) + "</h2>" +
        (q.code ? codeBlock(q.code) : "") +
        '<div class="options" role="group" aria-label="Answer choices">' + opts + "</div>" +
        fb +
        '<div class="q-actions"><span class="q-note">' + srcNote + "</span>" +
          (answered ?
            '<span style="display:flex;gap:10px;align-items:center;flex-wrap:wrap"><button class="linkish" type="button" data-qa="read">Read this in the notes</button>' +
            '<button class="btn primary" type="button" data-qa="next" id="q-next">' + (last ? "See results" : "Next question") + ' <span class="kbd" style="color:inherit;border-color:currentColor">Enter</span></button></span>' :
            '<span class="q-note">Press <span class="kbd">1</span>–<span class="kbd">' + q.options.length + "</span> to answer</span>") +
        "</div>" +
      "</section>";
    highlight($("#quiz-area"));
    var nextBtn = $("#q-next");
    if (nextBtn) nextBtn.focus({ preventScroll: true });
  }

  function pickAnswer(oi) {
    var it = quiz.items[quiz.i];
    if (it.pick !== null) return;
    it.pick = oi;
    if (oi === 0) delete quizStats.missed[it.q.id];
    else quizStats.missed[it.q.id] = (quizStats.missed[it.q.id] || 0) + 1;
    store.set("quiz", quizStats);
    renderQuestion();
  }

  function finishQuiz(early) {
    var answered = quiz.items.filter(function (it) { return it.pick !== null; });
    var score = answered.filter(function (it) { return it.pick === 0; }).length;
    if (answered.length) {
      quizStats.history.push({ d: new Date().toISOString(), s: score, n: answered.length, label: quiz.label });
      if (quizStats.history.length > 30) quizStats.history = quizStats.history.slice(-30);
      store.set("quiz", quizStats);
      updateChips();
    }
    var missed = answered.filter(function (it) { return it.pick !== 0; });
    var pct = answered.length ? Math.round(100 * score / answered.length) : 0;
    var head = answered.length ?
      '<div class="score-head"><span class="score-big">' + pct + '%</span><div><p><strong>' + score + " of " + answered.length + " correct</strong>" + (early ? " (ended early)" : "") + '</p><p class="score-sub">' + esc(quiz.label) + "</p></div></div>" :
      "<p>You ended the quiz before answering any questions.</p>";
    var list = missed.length ?
      '<h2 style="font-size:var(--step-1)">Review what you missed</h2><ul class="missed-list">' + missed.map(function (it) {
        return '<li><span class="q">' + fmt(it.q.q) + '</span><span class="yours">Your answer: ' + fmt(it.q.options[it.pick]) + '</span><span class="right">Correct: ' + fmt(it.q.options[0]) + '</span><span class="why">' + fmt(it.q.why) + "</span>" + exampleBlock(it.q.ex) + "</li>";
      }).join("") + "</ul>" :
      (answered.length ? "<p>Every answer was right. Try a longer quiz or a different topic.</p>" : "");
    $("#quiz-area").innerHTML =
      '<section class="panel">' + head + list +
        '<div class="setup-foot">' +
          (missed.length ? '<button class="btn" type="button" data-qa="retry">Retry the ' + plural(missed.length, "missed question") + "</button>" : "<span></span>") +
          '<button class="btn primary" type="button" data-qa="new">New quiz</button>' +
        "</div>" +
      "</section>";
    highlight($("#quiz-area"));
    quiz.missedList = missed.map(function (it) { return it.q; });
    quiz.done = true;
  }

  function startQuizFor(topics, label) {
    quizCustom = { topics: topics, label: label };
    quizCfg.missedOnly = false;
    quizCfg.kind = "all";
    showTab("quiz");
    var pool = shuffle(quizPool());
    if (quizCfg.len) pool = pool.slice(0, quizCfg.len);
    beginRun(pool, quizLabel());
  }

  function initQuiz() {
    renderQuizSetup();
    var area = $("#quiz-area");
    area.addEventListener("click", function (e) {
      var t = e.target;
      var s = t.closest("#q-src [data-v]");
      if (s) { quizCfg.src = s.dataset.v; saveCfg(); renderQuizSetup(); return; }
      var l = t.closest("#q-len [data-v]");
      if (l) { quizCfg.len = +l.dataset.v; saveCfg(); renderQuizSetup(); return; }
      var kd = t.closest("#q-kind [data-v]");
      if (kd) { quizCfg.kind = kd.dataset.v; saveCfg(); renderQuizSetup(); return; }
      if (t.closest("#q-start")) { startQuiz(); return; }
      var o = t.closest("[data-oi]");
      if (o && quiz) { pickAnswer(+o.dataset.oi); return; }
      var a = t.closest("[data-qa]");
      if (!a) return;
      var act = a.dataset.qa;
      if (act === "next") {
        if (quiz.i < quiz.items.length - 1) { quiz.i++; renderQuestion(); window.scrollTo(0, 0); }
        else finishQuiz(false);
      } else if (act === "quit") {
        finishQuiz(true);
      } else if (act === "read") {
        gotoSection(quiz.items[quiz.i].q.topic);
      } else if (act === "retry") {
        beginRun(shuffle(quiz.missedList), quiz.label + " · retry");
      } else if (act === "new") {
        quiz = null;
        renderQuizSetup();
      }
    });
    area.addEventListener("change", function (e) {
      if (e.target.id === "q-topic") {
        var v = e.target.value;
        if (v !== "custom") { quizCustom = null; quizCfg.topic = v; saveCfg(); }
        renderQuizSetup();
      } else if (e.target.id === "q-missed") {
        quizCfg.missedOnly = e.target.checked; saveCfg(); renderQuizSetup();
      }
    });
  }

  /* ---------- OUTLINE ---------- */
  function renderOutline() {
    $("#outline-title").textContent = EXAMS[exam].outline;
    $("#outline-note").textContent = EXAMS[exam].outlineNote;
    var done = D.outline.filter(function (o) { return outlineDone[o.id]; }).length;
    var pct = Math.round(100 * done / D.outline.length);
    $("#outline-count").textContent = done + " of " + D.outline.length + " reviewed";
    $("#outline-meter").style.width = pct + "%";
    $("#outline-list").innerHTML = D.outline.map(function (o) {
      var qn = D.questions.filter(function (q) { return o.topics.indexOf(q.topic) !== -1; }).length;
      var cn = D.flashcards.filter(function (c) { return o.topics.indexOf(c.topic) !== -1; }).length;
      var isDone = !!outlineDone[o.id];
      return '<li class="' + (isDone ? "done" : "") + '">' +
        '<input type="checkbox" id="ol-' + o.id + '" data-ol="' + o.id + '"' + (isDone ? " checked" : "") + ">" +
        '<div style="min-width:0"><span class="item-num">' + (o.id.charAt(0) === "m" ? "Midterm 2 · " : "Midterm 1 · ") + "item " + o.items + '</span><br><label class="item-title" for="ol-' + o.id + '">' + esc(o.title) + "</label>" +
          '<div class="where">' + o.topics.map(function (t) {
            return '<button type="button" class="topic-link" data-read="' + t + '">' + esc(TOPICS[t]) + "</button>";
          }).join("") + "</div></div>" +
        '<div class="acts">' +
          (cn ? '<button class="btn small" type="button" data-ocards="' + o.id + '">' + plural(cn, "card") + "</button>" : "") +
          (qn ? '<button class="btn small" type="button" data-oquiz="' + o.id + '">Quiz ' + qn + "</button>" : "") +
        "</div></li>";
    }).join("");
  }

  function outlineById(id) {
    for (var i = 0; i < D.outline.length; i++) if (D.outline[i].id === id) return D.outline[i];
    return null;
  }

  function initOutline() {
    renderOutline();
    var list = $("#outline-list");
    list.addEventListener("change", function (e) {
      var id = e.target.dataset.ol;
      if (!id) return;
      if (e.target.checked) outlineDone[id] = true; else delete outlineDone[id];
      store.set("outline", outlineDone);
      renderOutline();
      updateChips();
      var el = $("#ol-" + id);
      if (el) el.focus();
    });
    list.addEventListener("click", function (e) {
      var r = e.target.closest("[data-read]");
      if (r) { gotoSection(r.dataset.read); return; }
      var c = e.target.closest("[data-ocards]");
      if (c) { var o = outlineById(c.dataset.ocards); openCardsFor(o.topics, "Outline " + o.items + ": " + o.title); return; }
      var q = e.target.closest("[data-oquiz]");
      if (q) { var o2 = outlineById(q.dataset.oquiz); startQuizFor(o2.topics, "Outline " + o2.items + ": " + o2.title); }
    });
    $("#outline-reset").addEventListener("click", function (e) {
      armConfirm(e.currentTarget, "Click again to uncheck all", function () {
        outlineDone = {};
        store.set("outline", outlineDone);
        renderOutline();
        updateChips();
      });
    });
  }

  /* ---------- TERMS ---------- */
  function renderTerms() {
    var q = $("#terms-search").value.trim().toLowerCase();
    var list = D.terms.filter(function (t) { return !q || (t.term + " " + t.def + " " + t.ex).toLowerCase().indexOf(q) !== -1; });
    $("#terms-count").textContent = plural(list.length, "term");
    $("#terms-list").innerHTML = list.length ? list.map(function (t) {
      return '<div class="term"><dt>' + esc(t.term) + "</dt><dd>" + fmt(t.def) + '<span class="term-ex">' + fmt(t.ex) + "</span></dd></div>";
    }).join("") : '<div class="empty"><p>No terms match that search.</p></div>';
  }
  function initTerms() {
    renderTerms();
    $("#terms-search").addEventListener("input", renderTerms);
  }

  /* ---------- DRILLS ---------- */
  var drillOpen = {};
  function renderDrills() {
    var area = $("#drills-list");
    area.innerHTML = D.drills.map(function (d) {
      var open = !!drillOpen[d.id];
      return '<article class="panel drill"><div class="q-head"><span class="badge practice">Write it</span><span class="badge topic">' + esc(TOPICS[d.topic]) + "</span></div>" +
        "<h2>" + esc(d.title) + "</h2><p>" + fmt(d.task) + "</p>" + codeBlock(d.start) +
        '<label class="eyebrow" for="drill-' + d.id + '">Your answer</label>' +
        '<textarea id="drill-' + d.id + '" rows="6" spellcheck="false" placeholder="Type it from memory, then compare."></textarea>' +
        '<div><button class="btn" type="button" data-drill="' + d.id + '" aria-expanded="' + open + '">' + (open ? "Hide the answer" : "Show the answer") + "</button></div>" +
        (open ? '<div class="feedback ok"><span class="eyebrow">Answer</span>' + codeBlock(d.answer) + '<span class="eyebrow">Why</span><p>' + fmt(d.why) + "</p></div>" : "") +
        "</article>";
    }).join("") || '<div class="empty"><p>No drills for this exam yet.</p></div>';
    highlight(area);
  }
  function initDrills() {
    renderDrills();
    $("#drills-list").addEventListener("click", function (e) {
      var b = e.target.closest("[data-drill]");
      if (!b) return;
      var typed = {};
      $$("#drills-list textarea").forEach(function (t) { typed[t.id] = t.value; });
      drillOpen[b.dataset.drill] = !drillOpen[b.dataset.drill];
      renderDrills();
      Object.keys(typed).forEach(function (k) { var el = document.getElementById(k); if (el) el.value = typed[k]; });
    });
  }

  /* ---------- CODE WALKTHROUGHS (private version only) ---------- */
  var wtState = { classcode: 0, labcode: 0 };
  function renderWalk(tab) {
    var part = D.walkthroughs[tab];
    var root = $("#" + tab + "-area");
    var idx = wtState[tab];
    var g = part.groups[idx];
    var q = ($("#" + tab + "-search") ? $("#" + tab + "-search").value : "").trim().toLowerCase();
    var groups = part.groups.map(function (gr, i) {
      return '<li><button type="button" data-wt-group="' + i + '" class="' + (i === idx ? "active" : "") + '"><span class="n">' + (i + 1) + "</span><span>" + esc(gr.title) + "</span></button></li>";
    }).join("");
    var body = g.blocks.map(function (b) {
      if (b.html !== undefined) return q ? "" : '<div class="wt-prose">' + b.html + "</div>";
      var rows = b.rows.filter(function (r) {
        return !q || (r.lines.map(function (l) { return l[1]; }).join(" ") + " " + r.what + " " + r.why + " " + r.tags.join(" ")).toLowerCase().indexOf(q) !== -1;
      });
      if (!rows.length) return "";
      return '<section class="wt-file"><h3>' + esc(b.title) + "</h3>" + (b.note ? '<p class="wt-note">' + fmt(b.note) + "</p>" : "") +
        rows.map(function (r) {
          return '<div class="wt-row"><pre class="code"><code class="language-java">' + r.lines.map(function (l) {
            return esc(l[1]);
          }).join("\n") + '</code></pre><p class="wt-nums">Line' + (r.lines.length > 1 ? "s " + r.lines[0][0] + "–" + r.lines[r.lines.length - 1][0] : " " + r.lines[0][0]) + "</p>" +
            '<div class="wt-text">' +
              (r.tags.length ? '<div class="wt-tags">' + r.tags.map(function (t) { return '<span class="badge topic">' + esc(t) + "</span>"; }).join("") + "</div>" : "") +
              (r.what ? '<p><b>What it does:</b> ' + fmt(r.what).replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>") + "</p>" : "") +
              (r.why ? '<p><b>Why it\u2019s written this way, here:</b> ' + fmt(r.why) + "</p>" : "") +
              (r.syntax.length ? '<details class="wt-syntax"><summary>Syntax on this line (' + r.syntax.length + ")</summary><dl>" + r.syntax.map(function (s) {
                return "<dt><code>" + esc(s[0]) + "</code></dt><dd>" + fmt(s[1]) + "</dd>";
              }).join("") + "</dl></details>" : "") +
            "</div></div>";
        }).join("") + "</section>";
    }).join("") || '<div class="empty"><p>Nothing in this section matches that search.</p></div>';
    var keep = q;
    root.innerHTML =
      '<div class="notes"><aside class="rail" aria-label="Sections">' +
        '<input type="search" id="' + tab + '-search" placeholder="Search this section (e.g. static)" aria-label="Search this section" autocomplete="off">' +
        '<select class="toc-jump" data-wt-jump>' + part.groups.map(function (gr, i) { return '<option value="' + i + '"' + (i === idx ? " selected" : "") + ">" + (i + 1) + ". " + esc(gr.title) + "</option>"; }).join("") + "</select>" +
        '<ol class="toc">' + groups + "</ol></aside>" +
      '<div class="reading"><section class="intro"><p class="eyebrow">' + esc(part.label) + "</p><h1>" + esc(g.title) + "</h1><p>" + esc(part.blurb) + "</p></section>" + body + "</div></div>";
    var s = $("#" + tab + "-search");
    s.value = keep;
    highlight(root);
    return s;
  }
  function initWalk(tab) {
    renderWalk(tab);
    var root = $("#" + tab + "-area");
    root.addEventListener("click", function (e) {
      var b = e.target.closest("[data-wt-group]");
      if (!b) return;
      wtState[tab] = +b.dataset.wtGroup;
      $("#" + tab + "-search").value = "";
      renderWalk(tab);
      window.scrollTo(0, 0);
    });
    root.addEventListener("change", function (e) {
      if (e.target.matches("[data-wt-jump]")) { wtState[tab] = +e.target.value; $("#" + tab + "-search").value = ""; renderWalk(tab); window.scrollTo(0, 0); }
    });
    var t;
    root.addEventListener("input", function (e) {
      if (e.target.id !== tab + "-search") return;
      clearTimeout(t);
      t = setTimeout(function () {
        var s = renderWalk(tab);
        s.focus();
        s.setSelectionRange(s.value.length, s.value.length);
      }, 200);
    });
  }

  /* ---------- exam switch ---------- */
  function setExam(next) {
    exam = next;
    store.set("exam", exam);
    applyExam();
    $$("#exam-switch button").forEach(function (b) { b.setAttribute("aria-pressed", String(b.dataset.exam === exam)); });
    $("#notes-search").value = "";
    applySearch("");
    renderNotes();
    deck.topics = null; deck.label = ""; deck.status = "all";
    renderCardTopicSelect(); rebuildDeck(); renderCards();
    quiz = null; quizCustom = null; quizCfg.topic = "all"; quizCfg.missedOnly = false; saveCfg();
    renderQuizSetup();
    renderOutline();
    renderTerms();
    renderDrills();
    updateChips();
  }

  /* ---------- keyboard ---------- */
  document.addEventListener("keydown", function (e) {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    var tag = (e.target.tagName || "").toLowerCase();
    if (tag === "input" || tag === "select" || tag === "textarea") return;
    if (currentTab === "cards") {
      if (e.key === " " || e.key === "Enter") {
        if (tag === "button") return; // let the focused button's own click run
        e.preventDefault(); cardFlip();
      } else if (e.key === "ArrowRight") cardStep(1);
      else if (e.key === "ArrowLeft") cardStep(-1);
      else if (e.key === "k" || e.key === "K") cardMark("known");
      else if (e.key === "l" || e.key === "L") cardMark("learning");
    } else if (currentTab === "quiz" && quiz && !quiz.done) {
      var it = quiz.items[quiz.i];
      var n = parseInt(e.key, 10);
      if (it.pick === null && n >= 1 && n <= it.order.length) {
        e.preventDefault();
        pickAnswer(it.order[n - 1]);
      } else if (it.pick !== null && e.key === "Enter" && e.target.id !== "q-next") {
        e.preventDefault();
        var nb = $("#q-next");
        if (nb) nb.click();
      }
    }
  });

  /* ---------- boot ---------- */
  function boot() {
    initNotes();
    initCards();
    initQuiz();
    initOutline();
    initTerms();
    initDrills();
    if (D.walkthroughs) {
      $$(".private-only").forEach(function (el) { el.hidden = false; });
      initWalk("classcode");
      initWalk("labcode");
    }
    updateChips();
    $$("#exam-switch button").forEach(function (b) { b.setAttribute("aria-pressed", String(b.dataset.exam === exam)); });
    $("#exam-switch").addEventListener("click", function (e) {
      var b = e.target.closest("[data-exam]");
      if (b) setExam(b.dataset.exam);
    });

    $("#tabs").addEventListener("click", function (e) {
      var b = e.target.closest("[data-tab]");
      if (b) showTab(b.dataset.tab);
    });
    $("#tabs").addEventListener("keydown", function (e) {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      var i = TABS.indexOf(currentTab) + (e.key === "ArrowRight" ? 1 : -1);
      var next = TABS[(i + TABS.length) % TABS.length];
      showTab(next);
      $("#tab-" + next).focus();
    });
    $$(".chip").forEach(function (c) {
      c.addEventListener("click", function () { showTab(c.dataset.tab); });
    });
    $$("[data-goto-tab]").forEach(function (b) {
      b.addEventListener("click", function () { showTab(b.dataset.gotoTab); });
    });
    window.addEventListener("hashchange", function () {
      var h = location.hash.slice(1);
      if (TABS.indexOf(h) !== -1 && h !== currentTab) showTab(h);
    });

    var fromHash = location.hash.slice(1);
    showTab(TABS.indexOf(fromHash) !== -1 ? fromHash : store.get("tab", "notes"), { keepScroll: true });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
