// 작업 캔버스: 그래프에서 끌어온 항목을 직접 연결하고 Mermaid로 내보낸다
(() => {
  const NS = "http://www.w3.org/2000/svg";
  const KEY = "ai-agent-board";
  const H = 34, PORT = 6;
  const RESERVED = new Set(["end", "graph", "subgraph", "style", "class", "click", "default", "flowchart", "direction", "call"]);
  const byId = Object.fromEntries(window.GRAPH.nodes.map((n) => [n.id, n]));

  const board = document.getElementById("board");
  const area = document.getElementById("board-area");
  const code = document.getElementById("board-code");
  const hint = document.getElementById("board-hint");
  const dirBox = document.getElementById("board-dir");
  const delBtn = document.getElementById("board-del");
  const clearBtn = document.getElementById("board-clear");
  const toggleBtn = document.getElementById("board-toggle");
  const copyBtn = document.getElementById("board-copy");
  const newBtn = document.getElementById("board-new");
  const tallBtn = document.getElementById("board-tall");
  const presetBtn = document.getElementById("board-preset");
  const groupBox = document.getElementById("board-group");
  const legend = document.getElementById("board-legend");
  const editBtn = document.getElementById("board-edit");
  const HINT = hint.textContent;

  const el = (name, attrs = {}, parent) => {
    const e = document.createElementNS(NS, name);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  };
  const width = (s) => [...s].reduce((w, c) => w + (c.charCodeAt(0) > 255 ? 12.5 : 7.4), 0) + 34;

  // state.nodes: [{ id, x, y, text? }], state.edges: [[from, to]]
  // text가 있으면 그 글을 이름으로 쓴다. 직접 만든 항목은 id가 u_로 시작하고 text만 가진다
  const state = { nodes: [], edges: [], dir: "LR", open: true, tall: false };
  let sel = null; // { node: id } | { edge: index }
  try {
    const saved = JSON.parse(localStorage.getItem(KEY));
    if (saved) {
      state.nodes = (saved.nodes || []).filter((n) => byId[n.id] || (n.id?.startsWith("u_") && typeof n.text === "string"));
      const has = new Set(state.nodes.map((n) => n.id));
      state.edges = (saved.edges || []).filter(([s, t]) => has.has(s) && has.has(t));
      state.dir = saved.dir === "TD" ? "TD" : "LR";
      state.open = saved.open !== false;
      state.tall = !!saved.tall;
    }
  } catch {}
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {} };

  const svg = el("svg", {}, area);
  const defs = el("defs", {}, svg);
  for (const id of ["b-arrow", "b-arrow-sel"]) {
    const m = el("marker", { id, viewBox: "0 0 10 10", refX: 9, refY: 5, markerWidth: 8, markerHeight: 8, orient: "auto-start-reverse" }, defs);
    el("path", { d: "M0 0 10 5 0 10z" }, m);
  }
  const edgeLayer = el("g", {}, svg), nodeLayer = el("g", {}, svg);
  const draft = el("line", { class: "bedge draft", "marker-end": "url(#b-arrow-sel)", visibility: "hidden" }, svg);
  const empty = document.createElement("div");
  empty.className = "board-empty";
  empty.textContent = "아직 비어 있습니다. 위 그래프에서 항목을 끌어다 놓거나, 빈 곳을 두 번 눌러 직접 개념을 적어 보세요.";
  area.appendChild(empty);

  // 구성요소 분류. 색 띠와 범례에 쓴다
  const GROUPS = { model: "모델", context: "컨텍스트", tool: "도구", loop: "루프", harness: "하네스", mix: "합쳐진 개념", eval: "평가" };
  // 개념 그래프 초안. 연결은 설명을 위한 편집 해석이며 문헌 근거 등급이 아니다
  const C = (id, text, g, x, y) => ({ id: `u_${id}`, text, g, x, y });
  const PRESET = {
    nodes: [
      C("transformer", "Transformer", "model", 20, 20), C("icl", "문맥 내 학습 (GPT-3)", "model", 230, 20),
      C("instruct", "지시 따르기 (InstructGPT)", "model", 450, 20), C("toolmodel", "도구 호출을 학습한 모델", "model", 700, 20),
      C("prompt", "프롬프트 엔지니어링", "context", 250, 90), C("cot", "단계별 추론 (CoT)", "context", 470, 90),
      C("rag", "검색 결합 (RAG)", "context", 20, 160), C("memory", "메모리", "context", 700, 160),
      C("ctxeng", "컨텍스트 엔지니어링", "context", 1150, 100),
      C("exttool", "외부 도구 연결 (WebGPT, MRKL)", "tool", 300, 240), C("fc", "function calling", "tool", 700, 240), C("mcp", "MCP", "tool", 930, 240),
      C("aima", "지각-행동 에이전트 (AIMA)", "loop", 20, 330), C("react", "추론+행동 루프 (ReAct)", "loop", 450, 330),
      C("auto", "자율 루프 (AutoGPT)", "loop", 690, 310), C("formula", "에이전트 = LLM+메모리+도구+계획", "mix", 760, 380),
      C("coding", "코딩 에이전트 (SWE-agent, Claude Code)", "mix", 1020, 320), C("goal", "목표 루프 (/goal)", "loop", 1430, 330),
      C("framework", "프레임워크 (LangChain)", "harness", 560, 450), C("aci", "에이전트-컴퓨터 인터페이스 (ACI)", "harness", 880, 450),
      C("hooks", "훅, 권한, 샌드박스", "harness", 1180, 450), C("harness", "하네스 엔지니어링", "harness", 1430, 450),
      C("skill", "스킬", "mix", 1330, 200), C("asearch", "agentic search", "mix", 1150, 250), C("subagent", "서브에이전트", "mix", 1340, 380),
      C("swebench", "저장소 수준 평가 (SWE-bench)", "eval", 720, 520),
    ],
    edges: [
      ["transformer", "icl"], ["icl", "instruct"], ["instruct", "toolmodel"], ["icl", "prompt"], ["prompt", "cot"], ["cot", "react"],
      ["exttool", "react"], ["exttool", "fc"], ["toolmodel", "fc"], ["fc", "mcp"], ["aima", "react"], ["react", "auto"], ["react", "framework"],
      ["react", "formula"], ["auto", "formula"], ["memory", "formula"], ["fc", "formula"], ["formula", "coding"], ["swebench", "coding"], ["mcp", "coding"],
      ["prompt", "ctxeng"], ["rag", "ctxeng"], ["memory", "ctxeng"], ["rag", "asearch"], ["fc", "asearch"], ["coding", "asearch"],
      ["coding", "aci"], ["framework", "hooks"], ["coding", "hooks"], ["aci", "harness"], ["hooks", "harness"], ["ctxeng", "harness"],
      ["coding", "goal"], ["hooks", "goal"], ["ctxeng", "skill"], ["mcp", "skill"], ["hooks", "skill"], ["coding", "subagent"], ["ctxeng", "subagent"],
    ].map(([s, t]) => [`u_${s}`, `u_${t}`]),
  };
  const find = (id) => state.nodes.find((n) => n.id === id);
  const label = (n) => (typeof n === "string" ? (find(n) ? label(find(n)) : byId[n]?.label || n) : n.text?.trim() || byId[n.id]?.label || "빈 항목");
  const own = (n) => n.id.startsWith("u_");
  const box = (n) => ({ x: n.x, y: n.y, w: width(label(n)), h: H });
  // 중심을 잇는 선이 상자 테두리와 만나는 점
  const clip = (b, tx, ty) => {
    const cx = b.x + b.w / 2, cy = b.y + b.h / 2, dx = tx - cx, dy = ty - cy;
    if (!dx && !dy) return [cx, cy];
    const k = Math.min(dx ? b.w / 2 / Math.abs(dx) : Infinity, dy ? b.h / 2 / Math.abs(dy) : Infinity);
    return [cx + dx * k, cy + dy * k];
  };
  const point = (ev) => {
    const r = area.getBoundingClientRect();
    return [ev.clientX - r.left + area.scrollLeft, ev.clientY - r.top + area.scrollTop];
  };
  const inside = (ev) => {
    const r = area.getBoundingClientRect();
    return state.open && ev.clientX >= r.left && ev.clientX <= r.right && ev.clientY >= r.top && ev.clientY <= r.bottom;
  };
  const nodeAt = (ev, except) => {
    const hit = document.elementFromPoint(ev.clientX, ev.clientY)?.closest?.(".bnode");
    return hit && hit.dataset.id !== except ? hit.dataset.id : null;
  };

  const mermaid = () => {
    if (!state.nodes.length) return "";
    const name = (id) => (RESERVED.has(id) ? `n_${id}` : id);
    const lines = [`flowchart ${state.dir}`];
    for (const n of state.nodes) lines.push(`  ${name(n.id)}["${label(n).replace(/"/g, "#quot;")}"]`);
    for (const [s, t] of state.edges) lines.push(`  ${name(s)} --> ${name(t)}`);
    return lines.join("\n");
  };

  const say = (text, bad) => {
    hint.textContent = text || HINT;
    hint.classList.toggle("bad", !!bad);
  };

  // 연결선만 다시 그린다. 끌고 있는 항목의 요소는 건드리지 않아야 터치 끌기가 끊기지 않는다
  const drawEdges = () => {
    edgeLayer.textContent = "";
    const boxes = Object.fromEntries(state.nodes.map((n) => [n.id, box(n)]));
    state.edges.forEach(([s, t], i) => {
      const a = boxes[s], b = boxes[t];
      const [x1, y1] = clip(a, b.x + b.w / 2, b.y + b.h / 2), [x2, y2] = clip(b, a.x + a.w / 2, a.y + a.h / 2);
      const on = sel?.edge === i;
      el("line", { class: `bedge${on ? " sel" : ""}`, x1, y1, x2, y2, "marker-end": `url(#${on ? "b-arrow-sel" : "b-arrow"})` }, edgeLayer);
      const hit = el("line", { class: "bedge-hit", x1, y1, x2, y2 }, edgeLayer);
      el("title", {}, hit).textContent = `${label(s)} → ${label(t)}`;
      hit.addEventListener("click", () => { sel = { edge: i }; render(); area.focus({ preventScroll: true }); });
    });
  };
  const fit = () => {
    const right = Math.max(0, ...state.nodes.map((n) => n.x + box(n).w)) + 80;
    const bottom = Math.max(0, ...state.nodes.map((n) => n.y + H)) + 60;
    svg.setAttribute("width", Math.max(right, area.clientWidth));
    svg.setAttribute("height", Math.max(bottom, area.clientHeight));
  };
  const syncGroup = () => {
    const n = sel?.node && find(sel.node);
    groupBox.disabled = !n;
    groupBox.value = (n && GROUPS[n.g] && n.g) || "";
  };
  const markSel = () => {
    syncGroup();
    for (const g of nodeLayer.children) g.classList.toggle("sel", sel?.node === g.dataset.id);
    delBtn.disabled = !sel;
    editBtn.disabled = !sel?.node;
  };

  const render = () => {
    drawEdges();
    nodeLayer.textContent = "";
    for (const n of state.nodes) {
      const w = box(n).w;
      // 항목은 원점 기준으로 그리고 위치는 transform으로 옮긴다
      const g = el("g", { class: `bnode${own(n) && !n.g ? " own" : ""}${sel?.node === n.id ? " sel" : ""}`, "data-id": n.id, transform: `translate(${n.x} ${n.y})` }, nodeLayer);
      el("rect", { width: w, height: H, rx: 4 }, g);
      if (GROUPS[n.g]) el("rect", { class: `stripe g-${n.g}`, width: 5, height: H, rx: 2 }, g);
      el("text", { x: 12, y: 22 }, g).textContent = label(n);
      if (n.text != null && !own(n)) el("title", {}, g).textContent = `원래 이름: ${byId[n.id].label}`;
      const port = el("g", { class: "port-wrap" }, g);
      el("title", {}, port).textContent = "끌어서 다른 항목에 연결";
      el("circle", { class: "port-hit", cx: w, cy: H / 2, r: 13 }, port);
      el("circle", { class: "port", cx: w, cy: H / 2, r: PORT }, port);
      port.addEventListener("pointerdown", (ev) => startLink(ev, n));
      g.addEventListener("pointerdown", (ev) => startMove(ev, n, g));
    }
    fit();
    empty.hidden = state.nodes.length > 0;
    code.textContent = mermaid() || "여기에 Mermaid 코드가 나타납니다.";
    delBtn.disabled = !sel;
    editBtn.disabled = !sel?.node;
    copyBtn.disabled = !state.nodes.length;
    clearBtn.disabled = !state.nodes.length;
    board.classList.toggle("closed", !state.open);
    board.classList.toggle("tall", state.tall);
    tallBtn.textContent = state.tall ? "작게" : "크게";
    legend.hidden = !state.nodes.some((n) => GROUPS[n.g]);
    syncGroup();
    document.body.classList.toggle("board-open", state.open);
    toggleBtn.textContent = state.open ? "접기" : `펼치기${state.nodes.length ? ` (${state.nodes.length})` : ""}`;
    toggleBtn.setAttribute("aria-expanded", state.open);
    dirBox.value = state.dir;
  };
  const commit = () => { save(); render(); };

  let dragging = false;
  const track = (onMove, onEnd, pointerId) => {
    dragging = true;
    const move = (ev) => { if (ev.pointerId !== pointerId) return; ev.preventDefault(); onMove(ev); };
    const end = (ev) => {
      if (ev.pointerId !== pointerId) return;
      dragging = false;
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", end);
      window.removeEventListener("pointercancel", end);
      document.body.classList.remove("dragging");
      onEnd(ev, ev.type === "pointercancel");
    };
    window.addEventListener("pointermove", move, { passive: false });
    window.addEventListener("pointerup", end);
    window.addEventListener("pointercancel", end);
  };
  // 캔버스 안에서 끄는 동안 브라우저가 화면을 스크롤하거나 글자를 선택하지 않게 막는다
  area.addEventListener("touchstart", (ev) => { if (ev.target.closest?.(".bnode")) ev.preventDefault(); }, { passive: false });
  window.addEventListener("touchmove", (ev) => { if (dragging) ev.preventDefault(); }, { passive: false });
  area.addEventListener("dragstart", (ev) => ev.preventDefault());

  function startMove(ev, n, g) {
    if (ev.button || dragging) return;
    ev.preventDefault();
    const [px, py] = point(ev), ox = px - n.x, oy = py - n.y, x0 = n.x, y0 = n.y;
    sel = { node: n.id };
    markSel();
    area.focus({ preventScroll: true });
    document.body.classList.add("dragging");
    track((e) => {
      const [x, y] = point(e);
      n.x = Math.max(4, x - ox);
      n.y = Math.max(4, y - oy);
      g.setAttribute("transform", `translate(${n.x} ${n.y})`);
      drawEdges();
      fit();
    }, (e, cancelled) => {
      commit();
      // 움직이지 않고 두 번 누르면 글을 고친다 (마우스와 터치 모두)
      const now = Date.now(), still = Math.hypot(n.x - x0, n.y - y0) < 4;
      if (!cancelled && still && lastTap.id === n.id && now - lastTap.t < 400) { lastTap = {}; edit(n.id); }
      else lastTap = still ? { id: n.id, t: now } : {};
    }, ev.pointerId);
  }

  function startLink(ev, n) {
    if (ev.button || dragging) return;
    ev.preventDefault();
    ev.stopPropagation();
    const b = box(n), x1 = b.x + b.w, y1 = b.y + b.h / 2;
    for (const [k, v] of Object.entries({ x1, y1, x2: x1, y2: y1, visibility: "visible" })) draft.setAttribute(k, v);
    document.body.classList.add("dragging");
    let over = null;
    const mark = (id) => {
      if (over === id) return;
      nodeLayer.querySelector(".target")?.classList.remove("target");
      over = id;
      if (id) nodeLayer.querySelector(`[data-id="${id}"]`)?.classList.add("target");
    };
    track((e) => {
      const [x, y] = point(e);
      draft.setAttribute("x2", x);
      draft.setAttribute("y2", y);
      mark(nodeAt(e, n.id));
    }, (e, cancelled) => {
      draft.setAttribute("visibility", "hidden");
      const to = cancelled ? null : nodeAt(e, n.id);
      if (to && state.edges.some(([s, t]) => s === n.id && t === to)) say("이미 있는 연결입니다.", true);
      else if (to) { state.edges.push([n.id, to]); sel = { edge: state.edges.length - 1 }; say(); }
      commit();
    }, ev.pointerId);
  }

  const place = (id, x, y) => {
    const have = find(id);
    if (have) { sel = { node: id }; say(`${label(have)}은(는) 이미 캔버스에 있습니다.`, true); commit(); return; }
    if (x == null) {
      // 놓을 자리를 정하지 않았으면 빈 줄을 찾아 차례로 놓는다
      const i = state.nodes.length;
      x = 24 + (i % 4) * 190 + area.scrollLeft;
      y = 20 + Math.floor(i / 4) * 56 + area.scrollTop;
    }
    state.nodes.push({ id, x: Math.max(4, x), y: Math.max(4, y) });
    sel = { node: id };
    say();
    commit();
  };

  // 빈 항목 만들기와 글 고치기. 입력 칸을 항목 위에 겹쳐 띄운다
  let lastTap = {};
  const input = Object.assign(document.createElement("input"), { className: "board-input", type: "text", hidden: true });
  input.setAttribute("aria-label", "항목 이름");
  input.maxLength = 80;
  area.appendChild(input);
  let editing = null; // { id, fresh }
  const edit = (id, fresh = false) => {
    const n = find(id);
    if (!n) return;
    editing = { id, fresh };
    sel = { node: id };
    markSel();
    input.value = n.text ?? (own(n) ? "" : byId[id].label);
    input.placeholder = own(n) ? "개념 이름" : byId[id].label;
    Object.assign(input.style, { left: `${n.x}px`, top: `${n.y}px`, width: `${Math.max(180, box(n).w + 40)}px`, height: `${H}px` });
    input.hidden = false;
    input.focus();
    input.select();
    say("이름을 적고 Enter를 누르세요. Esc는 취소입니다." + (own(n) ? "" : " 비우면 원래 이름으로 돌아갑니다."));
  };
  const finish = (keep) => {
    if (!editing) return;
    const { id, fresh } = editing, n = find(id), v = input.value.trim();
    editing = null;
    input.hidden = true;
    say();
    if (n) {
      if (own(n)) {
        if (keep && v) n.text = v;
        else if (fresh || (keep && !v)) {
          // 이름 없이 끝낸 새 항목은 남기지 않는다
          state.nodes = state.nodes.filter((m) => m !== n);
          state.edges = state.edges.filter(([s, t]) => s !== id && t !== id);
          sel = null;
        }
      } else if (keep) {
        if (v && v !== byId[id].label) n.text = v;
        else delete n.text;
      }
    }
    commit();
    area.focus({ preventScroll: true });
  };
  input.addEventListener("keydown", (ev) => {
    ev.stopPropagation();
    if (ev.key === "Enter" && !ev.isComposing) { ev.preventDefault(); finish(true); }
    else if (ev.key === "Escape") { ev.preventDefault(); finish(false); }
  });
  input.addEventListener("blur", () => finish(true));
  input.addEventListener("pointerdown", (ev) => ev.stopPropagation());
  const create = (x, y) => {
    if (x == null) {
      const i = state.nodes.length;
      x = 24 + (i % 4) * 190 + area.scrollLeft;
      y = 20 + Math.floor(i / 4) * 56 + area.scrollTop;
    }
    const id = `u_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`;
    state.nodes.push({ id, x: Math.max(4, x), y: Math.max(4, y), text: "" });
    if (!state.open) state.open = true;
    commit();
    edit(id, true);
  };

  const remove = () => {
    if (!sel) return;
    if ("edge" in sel) state.edges.splice(sel.edge, 1);
    else {
      state.nodes = state.nodes.filter((n) => n.id !== sel.node);
      state.edges = state.edges.filter(([s, t]) => s !== sel.node && t !== sel.node);
    }
    sel = null;
    commit();
  };

  // 그래프의 항목을 끌어 캔버스에 놓기 (마우스와 펜. 터치는 패널의 버튼을 쓴다)
  document.getElementById("canvas").addEventListener("pointerdown", (ev) => {
    const g = ev.target.closest?.(".node");
    if (!g || ev.button || ev.pointerType === "touch" || ev.target.closest(".star")) return;
    const id = g.dataset.id, x0 = ev.clientX, y0 = ev.clientY;
    let ghost = null;
    track((e) => {
      if (!ghost) {
        if (Math.hypot(e.clientX - x0, e.clientY - y0) < 6) return;
        ghost = document.createElement("div");
        ghost.className = "drag-ghost";
        ghost.textContent = byId[id].label;
        document.body.appendChild(ghost);
        document.body.classList.add("dragging");
        if (!state.open) { state.open = true; render(); }
      }
      ghost.style.left = `${e.clientX}px`;
      ghost.style.top = `${e.clientY}px`;
      area.classList.toggle("over", inside(e));
    }, (e, cancelled) => {
      area.classList.remove("over");
      if (!ghost) return;
      ghost.remove();
      if (cancelled || !inside(e)) return;
      const [x, y] = point(e);
      place(id, x - width(byId[id].label) / 2, y - H / 2);
    }, ev.pointerId);
  });

  let lastBlank = 0;
  area.addEventListener("pointerdown", (ev) => {
    if (ev.target !== svg) return;
    // 빈 곳을 두 번 누르면 그 자리에 새 항목을 만든다
    const now = Date.now();
    if (now - lastBlank < 400) {
      lastBlank = 0;
      ev.preventDefault();
      const [x, y] = point(ev);
      create(x - 60, y - H / 2);
      return;
    }
    lastBlank = now;
    if (sel) { sel = null; render(); }
  });
  area.addEventListener("keydown", (ev) => {
    if ((ev.key === "Delete" || ev.key === "Backspace") && sel) { ev.preventDefault(); remove(); }
    else if ((ev.key === "Enter" || ev.key === "F2") && sel?.node) { ev.preventDefault(); edit(sel.node); }
  });
  delBtn.addEventListener("click", remove);
  newBtn.addEventListener("click", () => create());
  tallBtn.addEventListener("click", () => { state.tall = !state.tall; commit(); });
  for (const [k, v] of [["", "분류 없음"], ...Object.entries(GROUPS)]) groupBox.add(new Option(v, k));
  for (const [k, v] of Object.entries(GROUPS)) {
    const item = document.createElement("span");
    item.innerHTML = `<i class="g-${k}"></i>`;
    item.append(v);
    legend.appendChild(item);
  }
  groupBox.addEventListener("change", () => {
    const n = sel?.node && find(sel.node);
    if (!n) return;
    if (groupBox.value) n.g = groupBox.value; else delete n.g;
    commit();
  });
  presetBtn.addEventListener("click", () => {
    // 지금 내용은 지우지 않고, 없는 개념만 그 아래에 더한다
    const have = new Set(state.nodes.map((n) => n.id));
    const dy = state.nodes.length ? Math.max(...state.nodes.map((n) => n.y + H)) + 50 : 0;
    const added = PRESET.nodes.filter((n) => !have.has(n.id));
    for (const n of added) state.nodes.push({ ...n, y: n.y + dy });
    let links = 0;
    for (const [a, b] of PRESET.edges) {
      if (state.edges.some(([x, y]) => x === a && y === b)) continue;
      state.edges.push([a, b]);
      links++;
    }
    state.open = true;
    state.tall = true;
    sel = null;
    commit();
    if (added.length) {
      area.scrollTo({ left: 0, top: Math.max(0, dy - 20) });
      board.scrollIntoView({ block: "nearest" });
      say(`개념 ${added.length}개와 연결 ${links}개를 ${dy ? "지금 내용 아래에 " : ""}더했습니다. 연결은 설명을 위한 해석입니다.`);
    } else say(links ? `빠진 연결 ${links}개를 되살렸습니다.` : "초안의 개념이 이미 모두 캔버스에 있습니다.", !links);
  });
  editBtn.addEventListener("click", () => sel?.node && edit(sel.node));
  dirBox.addEventListener("change", () => { state.dir = dirBox.value; commit(); });
  toggleBtn.addEventListener("click", () => { state.open = !state.open; commit(); });

  let armed = 0;
  clearBtn.addEventListener("click", () => {
    if (!armed) {
      clearBtn.textContent = "정말 비우기";
      armed = setTimeout(() => { armed = 0; clearBtn.textContent = "비우기"; }, 3000);
      return;
    }
    clearTimeout(armed);
    armed = 0;
    clearBtn.textContent = "비우기";
    state.nodes = [];
    state.edges = [];
    sel = null;
    commit();
  });

  copyBtn.addEventListener("click", async () => {
    const text = mermaid();
    let ok = false;
    try { await navigator.clipboard.writeText(text); ok = true; } catch {}
    if (!ok) {
      // 클립보드 API가 막힌 환경에서는 선택 후 복사 명령으로 시도한다
      const ta = Object.assign(document.createElement("textarea"), { value: text });
      ta.style.cssText = "position:fixed;opacity:0";
      document.body.appendChild(ta);
      ta.select();
      try { ok = document.execCommand("copy"); } catch {}
      ta.remove();
    }
    if (ok) say(`Mermaid 코드를 복사했습니다. 항목 ${state.nodes.length}개, 연결 ${state.edges.length}개`);
    else {
      say("복사가 막혀 있습니다. 오른쪽 코드를 눌러 선택한 뒤 직접 복사하세요.", true);
      const range = document.createRange();
      range.selectNodeContents(code);
      const s = getSelection();
      s.removeAllRanges();
      s.addRange(range);
    }
  });

  window.addEventListener("resize", () => { if (!editing) render(); });
  window.BOARD = {
    add: (id) => {
      if (!state.open) state.open = true;
      place(id);
      board.scrollIntoView({ block: "nearest" });
    },
  };
  render();
})();
