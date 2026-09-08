(function () {
  const data = PEV_DATA;
  const $ = (id) => document.getElementById(id);

  function cssVar(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }

  function theme() {
    return {
      ink: cssVar("--text-primary"),
      inkSecondary: cssVar("--text-secondary"),
      muted: cssVar("--text-muted"),
      grid: cssVar("--grid"),
      baseline: cssVar("--baseline"),
      surface: cssVar("--surface"),
      s1: cssVar("--series-1"), // Suficientemente Ativo
      s2: cssVar("--series-2"), // Insuficientemente Ativo
      s1wash: cssVar("--series-1-wash"),
      s2wash: cssVar("--series-2-wash"),
    };
  }

  // ---------- small stats helpers ----------
  const notNull = (v) => v !== null && v !== undefined;
  const mean = (arr) => (arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : null);

  // Correlação de Pearson (r) entre dois vetores numéricos pareados.
  function pearson(xs, ys) {
    const n = xs.length;
    if (n < 3) return null;
    const mx = mean(xs), my = mean(ys);
    let num = 0, dx2 = 0, dy2 = 0;
    for (let i = 0; i < n; i++) {
      const dx = xs[i] - mx, dy = ys[i] - my;
      num += dx * dy; dx2 += dx * dx; dy2 += dy * dy;
    }
    const denom = Math.sqrt(dx2 * dy2);
    return denom === 0 ? null : num / denom;
  }

  function correlationStrength(r) {
    const abs = Math.abs(r);
    const strength = abs < 0.1 ? "praticamente nula" : abs < 0.3 ? "fraca" : abs < 0.5 ? "moderada" : abs < 0.7 ? "forte" : "muito forte";
    const direction = r < 0 ? "negativa" : "positiva";
    return abs < 0.1 ? strength : `${direction}, ${strength}`;
  }

  function countByOrder(rows, keyFn, order, fallbackLabel) {
    const counts = new Map(order.map((k) => [k, 0]));
    let missing = 0;
    rows.forEach((r) => {
      const k = keyFn(r);
      if (!notNull(k)) { missing++; return; }
      counts.set(k, (counts.get(k) || 0) + 1);
    });
    if (missing && fallbackLabel) counts.set(fallbackLabel, missing);
    return counts;
  }

  function pctActiveByGroup(rows, keyFn, order) {
    return order.map((cat) => {
      const subset = rows.filter((r) => keyFn(r) === cat);
      const n = subset.length;
      const active = subset.filter((r) => r.classificacao === "Suficientemente Ativo").length;
      return { cat, n, pct: n ? Math.round((active / n) * 100) : null };
    }).filter((d) => d.n > 0);
  }

  // ============================================================
  // Section 02 — Amostra
  // ============================================================
  function renderStatTiles() {
    const n = data.length;
    const idades = data.map((d) => d.idade).filter(notNull);
    const idadeMedia = mean(idades);
    const cursos = new Set(data.map((d) => d.curso).filter(notNull));
    const comModalidade = data.filter((d) => notNull(d.modalidade));
    const presencial = comModalidade.filter((d) => d.modalidade === "Presencial").length;

    const tiles = [
      { label: "Respondentes", value: n },
      { label: "Idade média", value: idadeMedia ? `${idadeMedia.toFixed(1)} anos` : "—" },
      { label: "Cursos representados", value: cursos.size },
      { label: "Ensino presencial", value: comModalidade.length ? `${Math.round((presencial / comModalidade.length) * 100)}%` : "—" },
    ];

    $("statGridAmostra").innerHTML = tiles.map((t) => `
      <div class="stat-tile">
        <div class="stat-label">${t.label}</div>
        <div class="stat-value">${t.value}</div>
      </div>
    `).join("");

    $("chipN").textContent = `amostra: n = ${n}`;
    $("chartCursoSub").textContent = `Número de respondentes por curso (n = ${n})`;
  }

  function renderDemoBar(containerId, title, rows, keyFn, order, colors) {
    const counts = countByOrder(rows, keyFn, order);
    const total = [...counts.values()].reduce((a, b) => a + b, 0) || 1;
    const segs = order
      .map((label, i) => ({ label, n: counts.get(label) || 0, color: colors[i % colors.length] }))
      .filter((s) => s.n > 0);

    const bar = segs.map((s) => `<div class="demo-seg" style="width:${(s.n / total) * 100}%; background:${s.color};"></div>`).join("");
    const breakdown = segs.map((s) => `<span>${s.label}: ${s.n} (${Math.round((s.n / total) * 100)}%)</span>`).join("");

    $(containerId).innerHTML = `
      <div class="demo-label"><span>${title}</span></div>
      <div class="demo-bar">${bar}</div>
      <div class="demo-breakdown">${breakdown}</div>
    `;
  }

  function renderAmostra(t) {
    renderStatTiles();

    renderDemoBar("demoSexo", "Sexo", data, (d) => d.sexo, ["Feminino", "Masculino"], [t.s1, t.s2]);
    renderDemoBar("demoModalidade", "Modalidade", data, (d) => d.modalidade, ["Presencial", "EAD"], [t.s1, t.s2]);
    renderDemoBar("demoTurno", "Turno", data, (d) => d.turno, ["Matutino", "Noturno"], [t.s1, t.s2]);

    // Curso — horizontal bar, single hue (magnitude only)
    const cursoCounts = new Map();
    data.forEach((d) => {
      const k = d.curso || "Não informado";
      cursoCounts.set(k, (cursoCounts.get(k) || 0) + 1);
    });
    const cursoEntries = [...cursoCounts.entries()].sort((a, b) => b[1] - a[1]);

    return new Chart($("chartCurso"), {
      type: "bar",
      data: {
        labels: cursoEntries.map((e) => e[0]),
        datasets: [{
          data: cursoEntries.map((e) => e[1]),
          backgroundColor: t.s1,
          borderRadius: 4,
          maxBarThickness: 20,
        }],
      },
      options: {
        indexAxis: "y",
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: (c) => `${c.parsed.x} respondente(s)` } } },
        scales: {
          x: { beginAtZero: true, ticks: { stepSize: 1, color: t.muted }, grid: { color: t.grid } },
          y: { ticks: { color: t.inkSecondary, font: { size: 11.5 } }, grid: { display: false } },
        },
      },
    });
  }

  function renderIdade(t) {
    const idades = data.map((d) => d.idade).filter(notNull);
    const bins = [
      { label: "18–20", test: (a) => a >= 18 && a <= 20 },
      { label: "21–25", test: (a) => a >= 21 && a <= 25 },
      { label: "26–34", test: (a) => a >= 26 && a <= 34 },
      { label: "35+", test: (a) => a >= 35 },
    ];
    const counts = bins.map((b) => idades.filter(b.test).length);

    return new Chart($("chartIdade"), {
      type: "bar",
      data: {
        labels: bins.map((b) => b.label),
        datasets: [{ data: counts, backgroundColor: t.s1, borderRadius: 4, maxBarThickness: 34 }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false }, ticks: { color: t.inkSecondary } },
          y: { beginAtZero: true, ticks: { stepSize: 1, color: t.muted }, grid: { color: t.grid } },
        },
      },
    });
  }

  // ============================================================
  // Section 03 — Resultado geral
  // ============================================================
  function renderClassificacao(t) {
    const ativos = data.filter((d) => d.classificacao === "Suficientemente Ativo").length;
    const inativos = data.length - ativos;
    const pct = Math.round((ativos / data.length) * 100);

    $("statActivePct").innerHTML = `<strong style="color:${t.s1}; font-weight:600;">${pct}%</strong> (${ativos} de ${data.length}) foram classificados como <strong>suficientemente ativos</strong>.`;

    return new Chart($("chartClassificacao"), {
      type: "doughnut",
      data: {
        labels: ["Suficientemente Ativo", "Insuficientemente Ativo"],
        datasets: [{ data: [ativos, inativos], backgroundColor: [t.s1, t.s2], borderColor: t.surface, borderWidth: 2 }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "62%",
        plugins: {
          legend: { position: "bottom", labels: { color: t.inkSecondary, boxWidth: 10, boxHeight: 10, padding: 14, font: { size: 12.5 } } },
        },
      },
    });
  }

  function renderEscoreTotal(t) {
    const possible = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    const counts = possible.map((v) => data.filter((d) => d.escoreTotal === v).length);
    const colors = possible.map((v) => (v >= 4 ? t.s1 : t.s2));

    return new Chart($("chartEscoreGrid"), {
      type: "bar",
      data: {
        labels: possible.map(String),
        datasets: [{ data: counts, backgroundColor: colors, borderRadius: 4, maxBarThickness: 28 }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: (c) => `${c.parsed.y} respondente(s) · escore ${c.label}` } },
        },
        scales: {
          x: { title: { display: true, text: "Escore total (A + B)", color: t.muted, font: { size: 11.5 } }, grid: { display: false }, ticks: { color: t.inkSecondary } },
          y: { beginAtZero: true, ticks: { stepSize: 1, color: t.muted }, grid: { color: t.grid } },
        },
      },
    });
  }

  // ============================================================
  // Section 04 — Cruzamentos (% suficientemente ativo por subgrupo)
  // ============================================================
  // Traduz a tabela de % por subgrupo numa frase de "probabilidade" —
  // a leitura que uma plateia consegue captar de cabeça, com o n exposto
  // pra não esconder que são amostras pequenas.
  function describeCross(rows) {
    if (rows.length === 0) return "Sem dados suficientes nesse grupo.";
    // Prioriza comparar subgrupos com n >= 3 — um extremo de 100%/0% baseado
    // em 1 única pessoa não é uma leitura confiável pra apresentar como achado.
    const reliable = rows.filter((r) => r.n >= 3);
    const pool = reliable.length >= 2 ? reliable : rows;
    if (pool.length === 1) {
      const r = pool[0];
      return `${r.cat}: ${r.pct}% suficientemente ativos (n=${r.n}) — só um subgrupo com dado confiável, sem comparação possível.`;
    }
    const sorted = [...pool].sort((a, b) => b.pct - a.pct);
    const high = sorted[0];
    const low = sorted[sorted.length - 1];
    if (high.pct === low.pct) {
      return `Nenhuma diferença relevante entre os grupos — todos em torno de ${high.pct}% suficientemente ativos.`;
    }
    return `Maior chance: "${high.cat}" — ${high.pct}% suficientemente ativos (n=${high.n}). Menor chance: "${low.cat}" — ${low.pct}% (n=${low.n}).`;
  }

  function renderCrossBar(canvasId, insightId, keyFn, order, t) {
    const rows = pctActiveByGroup(data, keyFn, order);
    if (insightId) $(insightId).textContent = describeCross(rows);
    return new Chart($(canvasId), {
      type: "bar",
      data: {
        labels: rows.map((r) => `${r.cat} (n=${r.n})`),
        datasets: [{ data: rows.map((r) => r.pct), backgroundColor: t.s1, borderRadius: 4, maxBarThickness: 30 }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: (c) => `${c.parsed.y}% suficientemente ativos` } },
        },
        scales: {
          x: { grid: { display: false }, ticks: { color: t.inkSecondary, font: { size: 11 } } },
          y: { beginAtZero: true, max: 100, ticks: { callback: (v) => v + "%", color: t.muted }, grid: { color: t.grid } },
        },
      },
    });
  }

  // ============================================================
  // Section 05 — IMC × Escore
  // ============================================================
  function renderImcStats() {
    const withImc = data.filter((d) => notNull(d.imc));
    const imcMedio = mean(withImc.map((d) => d.imc));
    const acimaDoPeso = withImc.filter((d) => d.imcCategoria === "Sobrepeso" || d.imcCategoria === "Obesidade");
    const r = pearson(withImc.map((d) => d.imc), withImc.map((d) => d.escoreTotal));

    const tiles = [
      { label: "IMC médio da amostra", value: imcMedio ? `${imcMedio.toFixed(1)} kg/m²` : "—" },
      { label: "Sobrepeso ou obesidade (OMS)", value: withImc.length ? `${Math.round((acimaDoPeso.length / withImc.length) * 100)}% (${acimaDoPeso.length}/${withImc.length})` : "—" },
      { label: r !== null ? `Correlação IMC × escore (${correlationStrength(r)})` : "Correlação IMC × escore", value: r !== null ? `r = ${r.toFixed(2)}` : "—" },
    ];

    $("statGridImc").innerHTML = tiles.map((t) => `
      <div class="stat-tile">
        <div class="stat-label">${t.label}</div>
        <div class="stat-value">${t.value}</div>
      </div>
    `).join("");
  }

  function renderImc(t) {
    const withImc = data.filter((d) => notNull(d.imc));
    const ativos = withImc.filter((d) => d.classificacao === "Suficientemente Ativo");
    const inativos = withImc.filter((d) => d.classificacao === "Insuficientemente Ativo");

    return new Chart($("chartImc"), {
      type: "scatter",
      data: {
        datasets: [
          { label: "Suficientemente Ativo", data: ativos.map((d) => ({ x: d.imc, y: d.escoreTotal })), backgroundColor: t.s1, pointRadius: 6, pointHoverRadius: 7, borderWidth: 2, borderColor: t.surface },
          { label: "Insuficientemente Ativo", data: inativos.map((d) => ({ x: d.imc, y: d.escoreTotal })), backgroundColor: t.s2, pointRadius: 6, pointHoverRadius: 7, borderWidth: 2, borderColor: t.surface },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: "bottom", labels: { color: t.inkSecondary, boxWidth: 10, boxHeight: 10, padding: 14, font: { size: 12.5 } } },
          tooltip: { callbacks: { label: (c) => `IMC ${c.parsed.x} · escore ${c.parsed.y}` } },
        },
        scales: {
          x: { title: { display: true, text: "IMC (kg/m²)", color: t.muted, font: { size: 11.5 } }, ticks: { color: t.inkSecondary }, grid: { color: t.grid } },
          y: { title: { display: true, text: "Escore total (A + B)", color: t.muted, font: { size: 11.5 } }, min: 0, max: 8, ticks: { stepSize: 1, color: t.inkSecondary }, grid: { color: t.grid } },
        },
      },
    });
  }

  // ============================================================
  // Section 08 — Dados brutos
  // ============================================================
  function renderDataTable() {
    $("tbodyDados").innerHTML = data.map((d) => `
      <tr>
        <td>${d.id}</td>
        <td>${d.curso || "—"}${d.obs ? " *" : ""}</td>
        <td>${d.idade ?? "—"}</td>
        <td>${d.sexo || "—"}</td>
        <td>${d.modalidade || "—"}</td>
        <td>${d.turno || "—"}</td>
        <td>${d.imc ?? "—"}</td>
        <td>${d.tela || "—"}</td>
        <td>${d.sono || "—"}</td>
        <td>${d.deslocamento || "—"}</td>
        <td>${d.escoreTotal}</td>
        <td><span class="tag ${d.classificacao === "Suficientemente Ativo" ? "active" : "inactive"}">${d.classificacao === "Suficientemente Ativo" ? "Ativo" : "Insuf."}</span></td>
      </tr>
    `).join("");
  }

  // ============================================================
  // Boot + theme-change re-render
  // ============================================================
  let instances = [];

  function renderAll() {
    instances.forEach((c) => c.destroy());
    instances = [];
    const t = theme();

    Chart.defaults.font.family = getComputedStyle(document.body).fontFamily;

    instances.push(renderAmostra(t));
    instances.push(renderIdade(t));
    instances.push(renderClassificacao(t));
    instances.push(renderEscoreTotal(t));
    instances.push(renderCrossBar("chartTela", "insightTela", (d) => d.tela, ["<4h", "4-8h", ">8h"], t));
    instances.push(renderCrossBar("chartSono", "insightSono", (d) => d.sono, ["<6h", "6-8h", ">8h"], t));
    instances.push(renderCrossBar("chartOcupacao", "insightOcupacao", (d) => d.ocupacao, ["Não trabalha", "Meio período", "Tempo integral"], t));
    instances.push(renderCrossBar("chartModalidade", "insightModalidade", (d) => d.modalidade, ["Presencial", "EAD"], t));
    instances.push(renderCrossBar("chartDeslocamento", "insightDeslocamento", (d) => d.deslocamento, ["Transporte coletivo", "Carro/Moto/Aplicativo", "A pé/Bicicleta"], t));
    instances.push(renderCrossBar("chartImcFaixa", "insightImcFaixa", (d) => d.imcCategoria, ["Abaixo do peso", "Peso normal", "Sobrepeso", "Obesidade"], t));
    instances.push(renderImc(t));
    renderImcStats();

    renderDataTable();
  }

  document.addEventListener("DOMContentLoaded", renderAll);
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", renderAll);
})();
