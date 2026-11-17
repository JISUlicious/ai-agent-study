(() => {
  const { lanes, tiers, nodes, edges, views, highlights } = window.GRAPH;
  const NS = "http://www.w3.org/2000/svg";
  const LABEL_W = 130, AXIS_H = 34, NODE_H = 38, ROW_GAP = 8, LANE_PAD = 12, LANE_GAP = 4, PAD_R = 170;
  // 사례가 몰린 최근 구간을 넓게 그리는 구간별 시간축 [연도, x]
  const KNOTS = [[1966, 0], [1990, 90], [2013, 200], [2017, 340], [2020, 480], [2022, 640], [2023, 860], [2024, 1130], [2025, 1400], [2026, 1780], [2027, 2000]];
  const TICKS = [1966, 1990, 2013, 2017, 2020, 2022, 2023, 2024, 2025, 2026];

  const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));
  const active = { confirmed: true, weak: true, guess: true };
  let selected = null, view = null, zoom = 1;
  const DEFAULT_KEYS = Object.keys(highlights);
  const LOCAL_KEY = "ai-agent-highlights";
  const pick = { ids: new Set(DEFAULT_KEYS), confirmedIds: null, confirmedAt: null, state: "loading" };
  let keyLinks = [];
  const isKeyName = (name) => name === "key" || name === "links";
  const isKey = () => view === "key" || view === "links";

  const el = (name, attrs = {}, parent) => {
    const e = document.createElementNS(NS, name);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  };
  const html = (name, props = {}, parent) => {
    const e = Object.assign(document.createElement(name), props);
    if (parent) parent.appendChild(e);
    return e;
  };
  const timeX = (date) => {
    const [y, m = 1] = date.split("-").map(Number);
    const t = y + (m - 1) / 12;
    for (let i = 1; i < KNOTS.length; i++) {
      if (t <= KNOTS[i][0]) {
        const [a, xa] = KNOTS[i - 1], [b, xb] = KNOTS[i];
        return LABEL_W + xa + ((t - a) / (b - a)) * (xb - xa);
      }
    }
    return LABEL_W + KNOTS[KNOTS.length - 1][1];
  };
  const textWidth = (s) => [...s].reduce((w, c) => w + (c.charCodeAt(0) > 255 ? 12.5 : 7.4), 0);

  // 레인마다 시간순으로 놓되 겹치면 아래 줄로 내린다
  let y = AXIS_H;
  const laneBoxes = lanes.map((lane) => {
    const items = nodes.filter((n) => n.lane === lane.id).sort((a, b) => a.date.localeCompare(b.date));
    const rowEnds = [];
    for (const n of items) {
      n.x = timeX(n.date);
      n.w = Math.max(textWidth(n.label) + 22, 84);
      let r = rowEnds.findIndex((end) => end + 10 <= n.x);
      if (r < 0) r = rowEnds.length;
      rowEnds[r] = n.x + n.w;
      n.row = r;
    }
    const rows = Math.max(rowEnds.length, 1);
    const h = LANE_PAD * 2 + rows * NODE_H + (rows - 1) * ROW_GAP;
    for (const n of items) n.y = y + LANE_PAD + n.row * (NODE_H + ROW_GAP);
    const box = { ...lane, y, h };
    y += h + LANE_GAP;
    return box;
  });
  const W = LABEL_W + KNOTS[KNOTS.length - 1][1] + PAD_R;
  const H = y;

  const canvas = document.getElementById("canvas");
  const svg = el("svg", { viewBox: `0 0 ${W} ${H}`, role: "img", "aria-label": "시간과 영역으로 배치한 AI 에이전트 영향 그래프" }, canvas);
  const addMarkers = (target, prefix) => {
    const defs = el("defs", {}, target);
    for (const t of Object.keys(tiers)) {
      const m = el("marker", { id: `${prefix}-${t}`, class: `mk-${t}`, viewBox: "0 0 10 10", refX: 9, refY: 5, markerWidth: 7, markerHeight: 7, markerUnits: "userSpaceOnUse", orient: "auto" }, defs);
      el("path", { d: "M1 1L9 5L1 9", fill: "none", "stroke-width": 1.6 }, m);
    }
  };
  addMarkers(svg, "ah");
  const edgePath = (a, b) => {
    const forward = a.x + a.w <= b.x;
    const x1 = forward ? a.x + a.w : a.x + a.w / 2, y1 = forward ? a.y + NODE_H / 2 : a.y + (b.y > a.y ? NODE_H : 0);
    const x2 = forward ? b.x : b.x + b.w / 2, y2 = forward ? b.y + NODE_H / 2 : b.y + (b.y > a.y ? 0 : NODE_H);
    const bend = Math.max(24, (x2 - x1) / 2);
    const [cx1, cy1, cx2, cy2] = forward ? [x1 + bend, y1, x2 - bend, y2] : [x1, (y1 + y2) / 2, x2, (y1 + y2) / 2];
    return { d: `M${x1} ${y1} C${cx1} ${cy1} ${cx2} ${cy2} ${x2} ${y2}`, mx: (x1 + 3 * cx1 + 3 * cx2 + x2) / 8, my: (y1 + 3 * cy1 + 3 * cy2 + y2) / 8 };
  };
  for (const b of laneBoxes) el("rect", { class: "band", x: 0, y: b.y, width: W, height: b.h }, svg);
  for (const yr of TICKS) {
    const x = timeX(String(yr));
    el("line", { class: "tick", x1: x, x2: x, y1: AXIS_H - 6, y2: H }, svg);
    el("text", { class: "year", x, y: 18 }, svg).textContent = yr;
  }

  const edgeLayer = el("g", {}, svg);
  const edgeViews = edges.map((e, i) => {
    const a = byId[e.s], b = byId[e.t];
    const { d } = edgePath(a, b);
    const g = el("g", { class: "edge-group" }, edgeLayer);
    const line = el("path", { class: `edge ${e.tier}`, d, "marker-end": `url(#ah-${e.tier})` }, g);
    const hit = el("path", { class: "hit", d }, g);
    hit.addEventListener("click", () => select({ edge: i }));
    el("title", {}, hit).textContent = `${a.label} → ${b.label}`;
    return { g, line };
  });

  const overlay = el("g", {}, svg);
  const nodeViews = {};
  for (const n of nodes) {
    const g = el("g", { class: "node", "data-id": n.id, tabindex: 0, role: "button", "aria-label": `${n.label}, ${n.dateText || n.date}` }, svg);
    el("rect", { x: n.x, y: n.y, width: n.w, height: NODE_H, rx: 4 }, g);
    const name = el("text", { class: "name", x: n.x + 9, y: n.y + 16 }, g);
    name.textContent = n.label;
    const when = el("text", { class: "when", x: n.x + 9, y: n.y + 31 }, g);
    when.textContent = (n.dateText || n.date) + (n.dateNote ? " *" : "");
    const star = el("g", { class: "star", "aria-hidden": "true" }, g);
    el("title", {}, star).textContent = "강조 켜고 끄기";
    el("circle", { cx: n.x + n.w - 2, cy: n.y + 2, r: 10 }, star);
    n.starText = el("text", { x: n.x + n.w - 2, y: n.y + 2 }, star);
    star.addEventListener("click", (ev) => { ev.stopPropagation(); toggleKey(n.id); });
    g.addEventListener("click", () => select({ node: n.id }));
    g.addEventListener("keydown", (ev) => {
      if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); select({ node: n.id }); }
    });
    nodeViews[n.id] = g;
  }

  // 스크롤해도 레인 이름이 왼쪽에 남도록 별도 그룹으로 옮긴다
  const stick = el("g", {}, svg);
  for (const b of laneBoxes) {
    el("rect", { class: "band", x: 0, y: b.y, width: LABEL_W - 12, height: b.h }, stick);
    el("text", { class: "lane-label", x: 12, y: b.y + 24 }, stick).textContent = b.label;
  }
  const pinLabels = () => stick.setAttribute("transform", `translate(${canvas.scrollLeft / zoom} 0)`);
  canvas.addEventListener("scroll", pinLabels, { passive: true });

  const applyZoom = () => {
    svg.setAttribute("width", W * zoom);
    svg.setAttribute("height", H * zoom);
    pinLabels();
  };
  const setZoom = (z) => { zoom = Math.min(1.6, Math.max(0.3, z)); applyZoom(); };

  const visible = (e) => active[e.tier];
  // 선택한 항목의 조상과 후손을 표시 중인 화살표로만 따라간다
  const walk = (start, next) => {
    const seen = new Set([start]), used = new Set(), stack = [start];
    while (stack.length) {
      const cur = stack.pop();
      edges.forEach((e, i) => {
        if (!visible(e)) return;
        const to = next(e, cur);
        if (!to) return;
        used.add(i);
        if (!seen.has(to)) { seen.add(to); stack.push(to); }
      });
    }
    return { seen, used };
  };

  // 강조 항목 쌍마다, 흐린 항목만 거치는 가장 짧은 경로를 찾는다
  const findKeyLinks = () => {
    const found = [];
    for (const from of pick.ids) {
      const prev = new Map([[from, null]]), queue = [from];
      while (queue.length) {
        const cur = queue.shift();
        edges.forEach((e, i) => {
          if (!visible(e) || e.s !== cur || prev.has(e.t)) return;
          prev.set(e.t, i);
          if (!pick.ids.has(e.t)) { queue.push(e.t); return; }
          const path = [];
          for (let at = e.t; prev.get(at) !== null; at = edges[prev.get(at)].s) path.unshift(prev.get(at));
          found.push({ from, to: e.t, path });
        });
      }
    }
    return found;
  };
  const order = (ids) => [...ids].sort((a, b) => byId[a].date.localeCompare(byId[b].date));

  // 선택은 artifact db에 저장해 세션이 읽게 하고, db가 없는 화면에서는 브라우저에만 남긴다
  let store = null, saving = false, dirty = false, saveTimer = null;
  const body = () => ({
    ids: order(pick.ids),
    status: pick.confirmedIds && pick.confirmedIds.join() === order(pick.ids).join() ? "confirmed" : "draft",
    confirmedIds: pick.confirmedIds,
    confirmedAt: pick.confirmedAt,
    updatedAt: new Date().toISOString(),
  });
  const known = (list) => (Array.isArray(list) ? list.filter((id) => byId[id]) : null);
  const adopt = (data) => {
    const ids = known(data?.ids);
    if (ids) pick.ids = new Set(ids);
    pick.confirmedIds = known(data?.confirmedIds);
    pick.confirmedAt = data?.confirmedAt || null;
  };
  const flush = async () => {
    if (saving) return;
    saving = true;
    while (dirty) {
      dirty = false;
      try {
        await store.set(body());
        pick.state = "saved";
      } catch (err) {
        if (err?.code === "invalid_argument") { pick.state = "readonly"; dirty = false; }
        else {
          try { await new Promise((r) => setTimeout(r, 1000)); await store.set(body()); pick.state = "saved"; }
          catch { pick.state = "failed"; }
        }
      }
    }
    saving = false;
    if (isKey()) renderKeepingFocus();
  };
  const persist = (now = false) => {
    if (store) {
      if (pick.state === "readonly") return;
      pick.state = "saving";
      dirty = true;
      clearTimeout(saveTimer);
      saveTimer = setTimeout(flush, now ? 0 : 500);
    } else {
      try { localStorage.setItem(LOCAL_KEY, JSON.stringify(body())); } catch {}
    }
  };
  const toggleKey = (id) => {
    if (pick.ids.has(id)) pick.ids.delete(id); else pick.ids.add(id);
    persist();
    renderKeepingFocus();
  };
  const renderKeepingFocus = () => {
    const focusId = document.activeElement?.id, top = panel.scrollTop;
    render();
    panel.scrollTop = top;
    if (focusId) document.getElementById(focusId)?.focus();
  };
  const initStore = async () => {
    let db = null;
    try { db = await window.claude?.use?.("db"); } catch {}
    if (!db) {
      try { adopt(JSON.parse(localStorage.getItem(LOCAL_KEY))); } catch {}
      pick.state = "local";
      renderKeepingFocus();
      return;
    }
    const ref = db.doc("highlights/selection");
    const timer = setTimeout(() => { if (pick.state === "loading") { pick.state = "slow"; renderKeepingFocus(); } }, 10000);
    try {
      const snap = await ref.get();
      if (snap.exists) adopt(snap.data());
      store = ref;
      pick.state = "saved";
    } catch { pick.state = "failed"; }
    clearTimeout(timer);
    renderKeepingFocus();
  };
  const saveMessages = {
    loading: "저장된 선택을 불러오는 중입니다.",
    slow: "저장된 선택을 아직 불러오지 못했습니다. 바꾼 내용은 저장되지 않습니다.",
    saving: "저장하는 중입니다.",
    saved: "저장됨. 세션에서 이 선택을 읽을 수 있습니다.",
    readonly: "이 계정은 선택을 저장할 수 없습니다. 바꾼 내용은 이 화면에만 남습니다.",
    failed: "저장하지 못했습니다. 페이지를 다시 열어 확인해 주세요.",
    local: "이 화면은 세션과 연결되지 않아 브라우저에만 남습니다. 아래 목록을 세션에 붙여 넣어 주세요.",
  };

  const worstTier = (path) => {
    const rank = { confirmed: 0, weak: 1, guess: 2 };
    return path.map((i) => edges[i].tier).sort((a, b) => rank[b] - rank[a])[0];
  };
  const linkLit = (link) => {
    if (!selected) return true;
    if (selected.node) return link.from === selected.node || link.to === selected.node;
    if (selected.link) return link.from === selected.link.from && link.to === selected.link.to;
    return link.path.includes(selected.edge);
  };
  // 핵심 연결: 기존 그래프 위에 강조 항목 사이의 연결만 별도 층으로 그리고, 경유 경로는 화살표 하나로 줄인다
  const renderOverlay = () => {
    overlay.replaceChildren();
    if (view !== "links") return;
    const labels = [];
    for (const link of keyLinks) {
      const on = linkLit(link);
      const tier = worstTier(link.path), via = link.path.length > 1;
      const p = edgePath(byId[link.from], byId[link.to]);
      const g = el("g", { class: `clink${on ? "" : " dim"}${via ? " via" : ""}` }, overlay);
      el("path", { class: `edge lit ${tier}`, d: p.d, "marker-end": `url(#ah-${tier})` }, g);
      const hit = el("path", { class: "hit", d: p.d }, g);
      hit.addEventListener("click", () => select(via ? { link: { from: link.from, to: link.to } } : { edge: link.path[0] }));
      const middle = link.path.slice(1).map((i) => byId[edges[i].s].label);
      el("title", {}, hit).textContent = `${byId[link.from].label} → ${byId[link.to].label}${via ? ` (${middle.join(", ")} 경유)` : ""}`;
      if (via) labels.push({ on, p, text: `${middle.length > 1 ? `${middle.length}개` : middle[0]} 경유` });
    }
    for (const n of labels) el("text", { class: `via-label${n.on ? "" : " dim"}`, x: n.p.mx, y: n.p.my - 3 }, overlay).textContent = n.text;
  };

  const viewBox = document.getElementById("views");
  const viewNames = { key: "핵심 항목", links: "핵심 연결" };
  const viewButtons = [["", "전체"], ["key", viewNames.key], ["links", viewNames.links], ...Object.entries(views).map(([k, v]) => [k, v.label])].map(([key, label]) => {
    const b = html("button", { type: "button", textContent: label }, viewBox);
    b.dataset.view = key;
    b.addEventListener("click", () => setView(key || null));
    return b;
  });
  const setView = (key) => {
    view = key;
    selected = null;
    render();
    const lit = nodes.filter((n) => nodeViews[n.id].classList.contains("lit"));
    if (key && lit.length) {
      canvas.scrollTo({
        left: (Math.min(...lit.map((n) => n.x)) - LABEL_W - 20) * zoom,
        top: (Math.min(...lit.map((n) => n.y)) - AXIS_H - 20) * zoom,
      });
    }
    try { history.replaceState(null, "", key ? `#${key}` : location.pathname + location.search); } catch {}
  };

  const render = () => {
    edges.forEach((e, i) => { edgeViews[i].g.toggleAttribute("hidden", !visible(e)); edgeViews[i].line.classList.remove("lit", "selected"); });
    edgeViews.forEach((v) => v.line.classList.remove("via"));
    for (const id in nodeViews) {
      nodeViews[id].classList.remove("lit", "selected", "via");
      nodeViews[id].classList.toggle("key", pick.ids.has(id));
      byId[id].starText.textContent = pick.ids.has(id) ? "★" : "☆";
    }
    svg.classList.toggle("focusing", !!selected || !!view);
    svg.classList.toggle("keymode", isKey());
    svg.classList.toggle("linksmode", view === "links");
    for (const b of viewButtons) b.setAttribute("aria-pressed", String(b.dataset.view === (view || "")));
    if (isKey()) keyLinks = findKeyLinks();
    renderOverlay();
    if (view === "links") {
      if (!selected) for (const id of pick.ids) nodeViews[id].classList.add("lit");
      for (const link of keyLinks) {
        if (selected && linkLit(link) && !("edge" in selected)) for (const id of [link.from, link.to]) nodeViews[id].classList.add("lit");
      }
      if (selected?.node) nodeViews[selected.node].classList.add("lit", "selected");
      const shown = selected?.link ? keyLinks.find((l) => l.from === selected.link.from && l.to === selected.link.to)?.path || [] : selected && "edge" in selected ? [selected.edge] : [];
      for (const i of shown) {
        edgeViews[i].line.classList.add("lit");
        if (selected.link) edgeViews[i].line.classList.add("selected");
        for (const id of [edges[i].s, edges[i].t]) nodeViews[id].classList.add("lit");
      }
    } else if (!selected && isKey()) {
      for (const id of pick.ids) nodeViews[id].classList.add("lit");
      for (const link of keyLinks) {
        const direct = link.path.length === 1;
        for (const i of link.path) {
          edgeViews[i].line.classList.add(direct ? "lit" : "via");
          for (const id of [edges[i].s, edges[i].t]) if (!pick.ids.has(id)) nodeViews[id].classList.add("via");
        }
      }
    } else if (!selected && view) {
      const ids = new Set(views[view].ids || []);
      const staged = views[view].stages && new Set(views[view].stages.flatMap((s) => s.edges));
      edges.forEach((e, i) => {
        if (!visible(e)) return;
        const hit = staged ? staged.has(`${e.s}>${e.t}`) : view === "bridge" ? e.bridge : ids.has(e.s) && ids.has(e.t);
        if (!hit) return;
        edgeViews[i].line.classList.add("lit");
        ids.add(e.s);
        ids.add(e.t);
      });
      for (const id of ids) nodeViews[id].classList.add("lit");
    } else if (selected?.node) {
      const up = walk(selected.node, (e, c) => (e.t === c ? e.s : null));
      const down = walk(selected.node, (e, c) => (e.s === c ? e.t : null));
      for (const id of [...up.seen, ...down.seen]) nodeViews[id].classList.add("lit");
      for (const i of [...up.used, ...down.used]) edgeViews[i].line.classList.add("lit");
      nodeViews[selected.node].classList.add("selected");
    } else if (selected && "edge" in selected) {
      const e = edges[selected.edge];
      nodeViews[e.s].classList.add("lit");
      nodeViews[e.t].classList.add("lit");
      edgeViews[selected.edge].line.classList.add("lit", "selected");
    }
    renderPanel();
  };

  const panel = document.getElementById("panel");
  const edgeButton = (list, e, other) => {
    const li = html("li", {}, list);
    const btn = html("button", { className: "link", type: "button" }, li);
    btn.addEventListener("click", () => select({ edge: edges.indexOf(e) }));
    html("b", { textContent: other.label }, btn);
    html("span", { textContent: `${tiers[e.tier].label} · ${e.kind}` }, btn);
  };
  const renderKeyPanel = () => {
    html("h2", { textContent: "핵심 항목" }, panel);
    html("p", { textContent: view === "links"
      ? "기존 연결을 흐리게 두고, 강조한 항목 사이의 연결만 위에 따로 그렸습니다. 흐린 항목을 거치는 연결은 화살표 하나로 줄이고 경유한 항목을 적었습니다."
      : "중요한 개념, 전환점, 발견, 공개, 출시를 모았습니다. 그래프의 별이나 아래 체크박스로 강조를 켜고 끌 수 있습니다." }, panel);
    const direct = keyLinks.filter((l) => l.path.length === 1).length;
    const stats = html("div", { className: "stats" }, panel);
    html("span", { textContent: `강조 ${pick.ids.size}개` }, stats);
    html("span", { textContent: `직접 연결 ${direct}개` }, stats);
    html("span", { textContent: `경유 연결 ${keyLinks.length - direct}개` }, stats);
    const linked = new Set(keyLinks.flatMap((l) => [l.from, l.to]));
    const lone = order(pick.ids).filter((id) => !linked.has(id));
    if (lone.length) html("p", { className: "caveat", textContent: `연결 없는 항목: ${lone.map((id) => byId[id].label).join(", ")}` }, panel);

    const final = pick.confirmedIds && pick.confirmedIds.join() === order(pick.ids).join();
    const actions = html("div", { className: "actions" }, panel);
    const confirm = html("button", { type: "button", id: "hl-confirm", textContent: final ? "확정됨" : "이 선택으로 확정" }, actions);
    confirm.disabled = !!final;
    confirm.addEventListener("click", () => {
      pick.confirmedIds = order(pick.ids);
      pick.confirmedAt = new Date().toISOString();
      persist(true);
      renderKeepingFocus();
    });
    const restore = html("button", { type: "button", id: "hl-restore", textContent: "초안으로 되돌리기" }, actions);
    restore.addEventListener("click", () => { pick.ids = new Set(DEFAULT_KEYS); persist(true); renderKeepingFocus(); });
    const bad = ["slow", "readonly", "failed", "local"].includes(pick.state);
    html("p", { className: `save${bad ? " bad" : ""}`, textContent: saveMessages[pick.state] }, panel);
    if (pick.state === "local") html("p", { className: "path", textContent: order(pick.ids).join(", ") }, panel);
    if (pick.confirmedIds && !final) html("p", { className: "caveat", textContent: "확정한 뒤에 선택을 바꿨습니다. 다시 확정하기 전까지는 이전 확정본이 유지됩니다." }, panel);

    html("h3", { textContent: "강조 항목" }, panel);
    const items = html("ul", {}, panel);
    for (const id of order(pick.ids)) {
      const n = byId[id];
      const row = html("li", { className: "pick" }, items);
      const box = html("input", { type: "checkbox", id: `hl-${id}`, checked: true }, row);
      box.setAttribute("aria-label", `${n.label} 강조`);
      box.addEventListener("change", () => toggleKey(id));
      const btn = html("button", { className: "link", type: "button" }, row);
      btn.addEventListener("click", () => select({ node: id }, { scroll: true }));
      html("b", { textContent: n.label }, btn);
      html("span", { textContent: `${n.date.slice(0, 4)} · ${highlights[id]?.kind || "직접 추가"}` }, btn);
    }

    html("h3", { textContent: "강조 항목 사이의 연결" }, panel);
    if (!keyLinks.length) html("p", { className: "meta", textContent: "표시할 연결 없음" }, panel);
    const list = html("ul", {}, panel);
    const sorted = [...keyLinks].sort((a, b) => a.path.length - b.path.length || byId[a.from].date.localeCompare(byId[b.from].date));
    for (const link of sorted) {
      const chain = [link.from, ...link.path.map((i) => edges[i].t)].map((id) => byId[id].label).join(" → ");
      const worst = worstTier(link.path);
      const btn = html("button", { className: "link", type: "button" }, html("li", {}, list));
      btn.addEventListener("click", () => select(link.path.length > 1 ? { link: { from: link.from, to: link.to } } : { edge: link.path[0] }));
      html("b", { textContent: chain }, btn);
      html("span", { textContent: tiers[worst].label + (link.path.length > 1 ? " 포함" : "") }, btn);
    }
    html("p", { className: "caveat", textContent: "경유 연결은 근거가 가장 약한 구간의 등급으로 표시합니다. 누르면 구간별 근거를 볼 수 있으니 전체 경로를 하나의 계보로 읽지 마세요." }, panel);
  };
  const renderPanel = () => {
    panel.replaceChildren();
    if (!selected && isKey()) { renderKeyPanel(); return; }
    if (selected && view) {
      const back = html("button", { type: "button", textContent: `← ${viewNames[view] || views[view].label}` }, panel);
      back.style.justifySelf = "start";
      back.addEventListener("click", () => select(null));
    }
    if (selected?.link) {
      const link = keyLinks.find((l) => l.from === selected.link.from && l.to === selected.link.to);
      if (!link) { html("p", { className: "meta", textContent: "현재 조건에서는 이 경로가 없습니다." }, panel); return; }
      const tier = worstTier(link.path);
      html("span", { className: `chip ${tier}`, textContent: `${tiers[tier].label} 포함` }, panel);
      html("h2", { textContent: `${byId[link.from].label} → ${byId[link.to].label}` }, panel);
      html("p", { textContent: "강조하지 않은 항목을 거치는 연결입니다. 구간마다 근거가 다르며, 이어진 전체 경로를 밝힌 문헌이 있다는 뜻은 아닙니다." }, panel);
      html("h3", { textContent: "구간별 근거" }, panel);
      const segments = html("ul", {}, panel);
      for (const i of link.path) {
        const btn = html("button", { className: "link", type: "button" }, html("li", {}, segments));
        btn.addEventListener("click", () => select({ edge: i }));
        html("b", { textContent: `${byId[edges[i].s].label} → ${byId[edges[i].t].label}` }, btn);
        html("span", { textContent: `${tiers[edges[i].tier].label} · ${edges[i].kind}` }, btn);
      }
      return;
    }
    if (!selected && view) {
      const v = views[view];
      html("h2", { textContent: v.title }, panel);
      html("p", { textContent: v.text }, panel);
      const lit = edges.map((e, i) => [e, edgeViews[i].line.classList.contains("lit")]).filter(([, on]) => on).map(([e]) => e);
      const stats = html("div", { className: "stats" }, panel);
      for (const t of Object.keys(tiers)) html("span", { textContent: `${tiers[t].label} ${lit.filter((e) => e.tier === t).length}개` }, stats);
      const group = (title, text, items) => {
        html("h3", { textContent: title }, panel);
        if (text) html("p", { textContent: text }, panel);
        const list = html("ul", {}, panel);
        for (const e of items) {
          const btn = html("button", { className: "link", type: "button" }, html("li", {}, list));
          btn.addEventListener("click", () => select({ edge: edges.indexOf(e) }));
          html("b", { textContent: `${byId[e.s].label} → ${byId[e.t].label}` }, btn);
          html("span", { textContent: v.stages ? `${tiers[e.tier].label} · ${e.kind}` : tiers[e.tier].label }, btn);
        }
      };
      if (v.stages) for (const s of v.stages) group(s.title, s.text, s.edges.map((k) => lit.find((e) => `${e.s}>${e.t}` === k)).filter(Boolean));
      else group("이 보기의 관계", "", lit);
      return;
    }
    if (!selected) {
      html("h2", { textContent: "근거 살펴보기" }, panel);
      html("p", { textContent: "항목을 누르면 조상과 후손을 따라 강조하고, 화살표를 누르면 그 관계의 근거를 보여 줍니다." }, panel);
      const stats = html("div", { className: "stats" }, panel);
      html("span", { textContent: `항목 ${nodes.length}개` }, stats);
      for (const t of Object.keys(tiers)) html("span", { textContent: `${tiers[t].label} ${edges.filter((e) => e.tier === t).length}개` }, stats);
      html("p", { className: "caveat", textContent: "날짜 옆 *는 공개일의 정밀도가 낮다는 표시입니다." }, panel);
      return;
    }
    if (selected.node) {
      const n = byId[selected.node];
      html("h2", { textContent: n.label }, panel);
      html("p", { className: "meta", textContent: n.dateText || n.date }, panel);
      const keyRow = html("label", { className: "pick" }, panel);
      const keyBox = html("input", { type: "checkbox", id: `hl-node-${n.id}`, checked: pick.ids.has(n.id) }, keyRow);
      keyBox.addEventListener("change", () => toggleKey(n.id));
      keyRow.append("핵심 항목으로 강조");
      const toBoard = html("button", { type: "button", textContent: "작업 캔버스에 넣기" }, html("div", { className: "actions" }, panel));
      toBoard.addEventListener("click", () => window.BOARD?.add(n.id));
      if (highlights[n.id]) html("p", { className: "why", textContent: `${highlights[n.id].kind}: ${highlights[n.id].why}` }, panel);
      if (n.dateNote) html("p", { className: "caveat", textContent: n.dateNote }, panel);
      html("p", { textContent: n.desc }, panel);
      if (n.url) html("a", { href: n.url, target: "_blank", rel: "noopener", textContent: "원문 보기" }, panel);
      const sections = [["영향을 준 것", (e) => e.t === n.id, (e) => byId[e.s]], ["영향을 받은 것", (e) => e.s === n.id, (e) => byId[e.t]]];
      for (const [title, match, other] of sections) {
        html("h3", { textContent: title }, panel);
        const found = edges.filter((e) => match(e) && visible(e));
        if (!found.length) { html("p", { className: "meta", textContent: "표시할 관계 없음" }, panel); continue; }
        const list = html("ul", {}, panel);
        for (const e of found) edgeButton(list, e, other(e));
      }
      html("p", { className: "path", textContent: `wiki/${n.wiki}` }, panel);
      return;
    }
    const e = edges[selected.edge], a = byId[e.s], b = byId[e.t];
    html("span", { className: `chip ${e.tier}`, textContent: tiers[e.tier].label }, panel);
    html("h2", { textContent: `${a.label} → ${b.label}` }, panel);
    html("p", { className: "meta", textContent: e.kind }, panel);
    html("p", { textContent: e.note }, panel);
    html("h3", { textContent: "근거 위치" }, panel);
    if (e.url) html("a", { href: e.url, target: "_blank", rel: "noopener", textContent: e.where }, panel);
    else html("p", { textContent: e.where }, panel);
    html("h3", { textContent: "이 등급의 뜻" }, panel);
    html("p", { textContent: tiers[e.tier].desc }, panel);
    const links = html("ul", {}, panel);
    for (const n of [a, b]) {
      const btn = html("button", { className: "link", type: "button" }, html("li", {}, links));
      btn.addEventListener("click", () => select({ node: n.id }));
      html("b", { textContent: n.label }, btn);
      html("span", { textContent: n.dateText || n.date }, btn);
    }
  };

  function select(next, { scroll = false } = {}) {
    selected = next;
    render();
    if (scroll && next?.node) {
      const n = byId[next.node];
      canvas.scrollTo({
        left: (n.x + n.w / 2) * zoom - canvas.clientWidth / 2,
        top: (n.y + NODE_H / 2) * zoom - canvas.clientHeight / 2,
      });
    }
    const hash = next?.node || (next ? "" : view);
    try { history.replaceState(null, "", hash ? `#${hash}` : location.pathname + location.search); } catch {}
  }

  const tierBox = document.getElementById("tiers");
  for (const t of Object.keys(tiers)) {
    const label = html("label", { title: tiers[t].desc }, tierBox);
    const box = html("input", { type: "checkbox", id: `tier-${t}`, checked: true }, label);
    box.addEventListener("change", () => {
      active[t] = box.checked;
      if (selected && "edge" in selected && edges[selected.edge].tier === t && !box.checked) selected = null;
      render();
    });
    const sample = el("svg", { viewBox: "0 0 30 10", "aria-hidden": "true" }, label);
    el("line", { class: `edge ${t}`, x1: 0, x2: 30, y1: 5, y2: 5 }, sample);
    label.append(tiers[t].label);
  }

  const list = document.getElementById("node-list");
  for (const n of nodes) html("option", { value: n.label }, list);
  const search = document.getElementById("search");
  search.addEventListener("input", () => {
    const n = nodes.find((x) => x.label.toLowerCase() === search.value.trim().toLowerCase());
    if (n) select({ node: n.id }, { scroll: true });
  });
  document.getElementById("zoom-in").addEventListener("click", () => setZoom(zoom * 1.2));
  document.getElementById("zoom-out").addEventListener("click", () => setZoom(zoom / 1.2));
  document.getElementById("fit").addEventListener("click", () => { setZoom(canvas.clientWidth / W); canvas.scrollTo({ left: 0 }); });
  document.getElementById("reset").addEventListener("click", () => { search.value = ""; setView(null); });

  setZoom(1);
  const start = location.hash.slice(1);
  if (byId[start]) select({ node: start }, { scroll: true });
  else if (views[start] || isKeyName(start)) setView(start);
  else setView("links");
  initStore();
})();
