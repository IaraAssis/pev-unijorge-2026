(function () {
  const data = PEVI_DATA;
  const dominios = PEVI_DOMINIOS;
  const $ = (id) => document.getElementById(id);
  const notNull = (v) => v !== null && v !== undefined;
  const mean = (arr) => (arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : null);

  function cssVar(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }

  function theme() {
    return {
      ink: cssVar("--text-primary"),
      inkSecondary: cssVar("--text-secondary"),
      muted: cssVar("--text-muted"),
      grid: cssVar("--grid"),
      surface: cssVar("--surface"),
      s1: cssVar("--series-1"),
      s2: cssVar("--series-2"),
      s1wash: cssVar("--series-1-wash"),
    };
  }

  function pearson(xs, ys) {
    const n = xs.length;
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

  function countByOrder(rows, keyFn, order) {
    const counts = new Map(order.map((k) => [k, 0]));
    rows.forEach((r) => {
      const k = keyFn(r);
      if (notNull(k) && counts.has(k)) counts.set(k, counts.get(k) + 1);
    });
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
  // Perfil da amostra
  // ============================================================
  function renderStatGridAmostra() {
    const n = data.length;
    const idadeMedia = mean(data.map((d) => d.idade));
    const cursos = new Set(data.map((d) => d.curso));
    const presencial = data.filter((d) => d.modalidade === "Presencial").length;

    const tiles = [
      { label: "Entrevistados", value: n },
      { label: "Idade média", value: `${idadeMedia.toFixed(1)} anos` },
      { label: "Cursos representados", value: cursos.size },
      { label: "Ensino presencial", value: `${Math.round((presencial / n) * 100)}%` },
    ];

    $("statGridAmostra").innerHTML = tiles.map((t) => `
      <div class="stat-tile">
        <div class="stat-label">${t.label}</div>
        <div class="stat-value">${t.value}</div>
      </div>
    `).join("");

    $("chipN").textContent = `n = ${n}`;
  }

  function renderDemoBar(containerId, title, keyFn, order, colors, t) {
    const counts = countByOrder(data, keyFn, order);
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

  function renderCursoChart(t) {
    const cursoCounts = new Map();
    data.forEach((d) => cursoCounts.set(d.curso, (cursoCounts.get(d.curso) || 0) + 1));
    const entries = [...cursoCounts.entries()].sort((a, b) => b[1] - a[1]);
    $("chartCursoSub").textContent = `Número de entrevistados por curso (n = ${data.length})`;
    const canvas = $("chartCurso");
    canvas.getBoundingClientRect();
    return new Chart(canvas, {
      type: "bar",
      data: {
        labels: entries.map((e) => e[0]),
        datasets: [{ data: entries.map((e) => e[1]), backgroundColor: t.s1, borderRadius: 4, maxBarThickness: 20 }],
      },
      options: {
        indexAxis: "y",
        responsive: false,
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: (c) => `${c.parsed.x} pessoa(s)` } } },
        scales: {
          x: { beginAtZero: true, ticks: { stepSize: 1, color: t.muted }, grid: { color: t.grid } },
          y: { ticks: { color: t.inkSecondary, font: { size: 11.5 } }, grid: { display: false } },
        },
      },
    });
  }

  function renderIdade(t) {
    const idades = data.map((d) => d.idade);
    const bins = [
      { label: "18–20", test: (a) => a >= 18 && a <= 20 },
      { label: "21–25", test: (a) => a >= 21 && a <= 25 },
      { label: "26–34", test: (a) => a >= 26 && a <= 34 },
      { label: "35+", test: (a) => a >= 35 },
    ];
    const counts = bins.map((b) => idades.filter(b.test).length);
    const canvas = $("chartIdade");
    canvas.getBoundingClientRect();
    return new Chart(canvas, {
      type: "bar",
      data: { labels: bins.map((b) => b.label), datasets: [{ data: counts, backgroundColor: t.s1, borderRadius: 4, maxBarThickness: 34 }] },
      options: {
        responsive: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false }, ticks: { color: t.inkSecondary } },
          y: { beginAtZero: true, ticks: { stepSize: 2, color: t.muted }, grid: { color: t.grid } },
        },
      },
    });
  }

  // ============================================================
  // Resultado geral
  // ============================================================
  function renderClassificacao(t) {
    const ativos = data.filter((d) => d.classificacao === "Suficientemente Ativo").length;
    const inativos = data.length - ativos;
    const pct = Math.round((ativos / data.length) * 100);
    $("statActivePct").innerHTML = `<strong style="color:${t.s1}; font-weight:600;">${pct}%</strong> (${ativos} de ${data.length}) foram classificados como <strong>suficientemente ativos</strong>.`;
    const canvas = $("chartClassificacao");
    canvas.getBoundingClientRect();
    return new Chart(canvas, {
      type: "doughnut",
      data: {
        labels: ["Suficientemente Ativo", "Insuficientemente Ativo"],
        datasets: [{ data: [ativos, inativos], backgroundColor: [t.s1, t.s2], borderColor: t.surface, borderWidth: 2 }],
      },
      options: {
        responsive: false,
        cutout: "62%",
        plugins: { legend: { position: "bottom", labels: { color: t.inkSecondary, boxWidth: 10, boxHeight: 10, padding: 14, font: { size: 12.5 } } } },
      },
    });
  }

  function renderEscoreTotal(t) {
    const possible = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    const counts = possible.map((v) => data.filter((d) => d.escoreTotal === v).length);
    const colors = possible.map((v) => (v >= 4 ? t.s1 : t.s2));
    const canvas = $("chartEscoreGrid");
    canvas.getBoundingClientRect();
    return new Chart(canvas, {
      type: "bar",
      data: { labels: possible.map(String), datasets: [{ data: counts, backgroundColor: colors, borderRadius: 4, maxBarThickness: 28 }] },
      options: {
        responsive: false,
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: (c) => `${c.parsed.y} pessoa(s) · escore ${c.label}` } } },
        scales: {
          x: { title: { display: true, text: "Escore total (A + B)", color: t.muted, font: { size: 11.5 } }, grid: { display: false }, ticks: { color: t.inkSecondary } },
          y: { beginAtZero: true, ticks: { stepSize: 1, color: t.muted }, grid: { color: t.grid } },
        },
      },
    });
  }

  // ============================================================
  // Cruzamentos — frases simples, sem jargão no meio do texto
  // ============================================================
  function describeCross(rows) {
    if (rows.length === 0) return "Ainda não temos dado suficiente aqui.";
    const reliable = rows.filter((r) => r.n >= 3);
    const pool = reliable.length >= 2 ? reliable : rows;
    if (pool.length === 1) {
      return `Só temos um grupo com dado confiável aqui (${pool[0].cat}), então ainda não dá pra comparar.`;
    }
    const sorted = [...pool].sort((a, b) => b.pct - a.pct);
    const high = sorted[0];
    const low = sorted[sorted.length - 1];
    if (high.pct === low.pct) {
      return `Não vemos diferença entre os grupos aqui — todos ficam perto de ${high.pct}% de pessoas ativas.`;
    }
    return `Vemos que quem está no grupo "${low.cat}" é bem menos ativo — só ${low.pct}% se exercitam o suficiente — enquanto no grupo "${high.cat}" isso sobe pra ${high.pct}%.`;
  }

  function renderCrossBar(canvasId, insightId, keyFn, order, t) {
    const rows = pctActiveByGroup(data, keyFn, order);
    if (insightId) $(insightId).textContent = describeCross(rows);
    const canvas = $(canvasId);
    canvas.getBoundingClientRect();
    return new Chart(canvas, {
      type: "bar",
      data: {
        labels: rows.map((r) => `${r.cat} (n=${r.n})`),
        datasets: [{ data: rows.map((r) => r.pct), backgroundColor: t.s1, borderRadius: 4, maxBarThickness: 30 }],
      },
      options: {
        responsive: false,
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: (c) => `${c.parsed.y}% suficientemente ativos` } } },
        scales: {
          x: { grid: { display: false }, ticks: { color: t.inkSecondary, font: { size: 11 } } },
          y: { beginAtZero: true, max: 100, ticks: { callback: (v) => v + "%", color: t.muted }, grid: { color: t.grid } },
        },
      },
    });
  }

  // ============================================================
  // IMC × Escore
  // ============================================================
  function describeImcSpread() {
    const sorted = [...data.map((d) => d.imc)].sort((a, b) => a - b);
    let maxGap = 0, gapIndex = -1;
    for (let i = 1; i < sorted.length; i++) {
      const gap = sorted[i] - sorted[i - 1];
      if (gap > maxGap) { maxGap = gap; gapIndex = i; }
    }
    const isolados = sorted.length - gapIndex;
    if (maxGap < 3 || isolados > 3) return "";
    const clusterMax = sorted[gapIndex - 1];
    const valores = sorted.slice(gapIndex).map((v) => v.toFixed(1)).join(", ");
    return `${gapIndex} de ${sorted.length} registros têm IMC até ${clusterMax.toFixed(1)} kg/m² — ${isolados === 1 ? `o ponto isolado (${valores})` : `os pontos isolados (${valores})`} ${isolados === 1 ? "puxa" : "puxam"} o eixo pra direita, então a nuvem de pontos parece mais concentrada na metade esquerda do gráfico.`;
  }

  function renderImcStats() {
    const imcMedio = mean(data.map((d) => d.imc));
    const acimaDoPeso = data.filter((d) => d.imcCategoria === "Sobrepeso" || d.imcCategoria === "Obesidade");
    const r = pearson(data.map((d) => d.imc), data.map((d) => d.escoreTotal));
    const tiles = [
      { label: "IMC médio da amostra", value: `${imcMedio.toFixed(1)} kg/m²` },
      { label: "Sobrepeso ou obesidade (OMS)", value: `${Math.round((acimaDoPeso.length / data.length) * 100)}% (${acimaDoPeso.length}/${data.length})` },
      { label: `Correlação IMC × escore (${correlationStrength(r)})`, value: `r = ${r.toFixed(2)}` },
    ];
    $("statGridImc").innerHTML = tiles.map((t) => `
      <div class="stat-tile">
        <div class="stat-label">${t.label}</div>
        <div class="stat-value">${t.value}</div>
      </div>
    `).join("");
    $("insightImc").textContent = describeImcSpread();
  }

  function renderImc(t) {
    const ativos = data.filter((d) => d.classificacao === "Suficientemente Ativo");
    const inativos = data.filter((d) => d.classificacao === "Insuficientemente Ativo");
    const canvas = $("chartImc");
    canvas.getBoundingClientRect();
    return new Chart(canvas, {
      type: "scatter",
      data: {
        datasets: [
          { label: "Suficientemente Ativo", data: ativos.map((d) => ({ x: d.imc, y: d.escoreTotal })), backgroundColor: t.s1, pointRadius: 6, pointHoverRadius: 7, borderWidth: 2, borderColor: t.surface },
          { label: "Insuficientemente Ativo", data: inativos.map((d) => ({ x: d.imc, y: d.escoreTotal })), backgroundColor: t.s2, pointRadius: 6, pointHoverRadius: 7, borderWidth: 2, borderColor: t.surface },
        ],
      },
      options: {
        responsive: false,
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
  // Pentáculo do Bem-Estar
  // ============================================================
  function renderPentaculoRadar(t) {
    const medias = dominios.map((dom) => mean(data.map((d) => d[dom.key])));
    const canvas = $("chartPentaculoRadar");
    canvas.getBoundingClientRect();
    return new Chart(canvas, {
      type: "radar",
      data: {
        labels: dominios.map((d) => d.label),
        datasets: [{ label: "Média da turma", data: medias, backgroundColor: t.s1wash, borderColor: t.s1, borderWidth: 2, pointBackgroundColor: t.s1, pointRadius: 4 }],
      },
      options: {
        responsive: false,
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: (c) => `${c.label}: ${c.parsed.r.toFixed(1)} / 9` } },
        },
        scales: {
          r: {
            min: 0, max: 9,
            ticks: { stepSize: 3, color: t.muted, backdropColor: "transparent" },
            grid: { color: t.grid },
            angleLines: { color: t.grid },
            pointLabels: { color: t.inkSecondary, font: { size: 11.5 } },
          },
        },
      },
    });
  }

  function renderDominioFraco(t) {
    const counts = new Map(dominios.map((d) => [d.label, 0]));
    data.forEach((d) => counts.set(d.dominioMaisFraco, (counts.get(d.dominioMaisFraco) || 0) + 1));
    const rows = [...counts.entries()].sort((a, b) => b[1] - a[1]);
    $("insightDominioFraco").textContent =
      `Vemos que "${rows[0][0]}" é o ponto mais fraco pra ${Math.round((rows[0][1] / data.length) * 100)}% da turma — é o que mais aparece como o elo mais baixo do estilo de vida de cada um.`;
    const canvas = $("chartDominioFraco");
    canvas.getBoundingClientRect();
    return new Chart(canvas, {
      type: "bar",
      data: {
        labels: rows.map((r) => r[0]),
        datasets: [{ data: rows.map((r) => Math.round((r[1] / data.length) * 100)), backgroundColor: t.s1, borderRadius: 4, maxBarThickness: 30 }],
      },
      options: {
        indexAxis: "y",
        responsive: false,
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: (c) => `${c.parsed.x}% da amostra` } } },
        scales: {
          x: { beginAtZero: true, max: 100, ticks: { callback: (v) => v + "%", color: t.muted }, grid: { color: t.grid } },
          y: { ticks: { color: t.inkSecondary, font: { size: 11.5 } }, grid: { display: false } },
        },
      },
    });
  }

  // ============================================================
  // AF isolada — o núcleo da análise
  // ============================================================
  const GAP_LIMIAR = 3;

  function renderStatGridAfIsolada() {
    const isolados = data.filter((d) => d.gapAF >= GAP_LIMIAR);
    const resto = data.filter((d) => d.gapAF < GAP_LIMIAR);
    const pctIsoladosInativos = Math.round((isolados.filter((d) => d.classificacao === "Insuficientemente Ativo").length / isolados.length) * 100);
    const pctGeralAtivos = Math.round((data.filter((d) => d.classificacao === "Suficientemente Ativo").length / data.length) * 100);
    const rAF = pearson(data.map((d) => d.atividadeFisica), data.map((d) => d.escoreTotal));
    const rTotal = pearson(data.map((d) => d.pentaculoTotal), data.map((d) => d.escoreTotal));
    const tiles = [
      { label: "Pessoas com AF isolada (gap ≥ 3)", value: `${isolados.length} de ${data.length}` },
      { label: "Insuficientemente ativas entre elas", value: `${pctIsoladosInativos}%` },
      { label: "Suficientemente ativos no geral", value: `${pctGeralAtivos}%` },
      { label: "O quanto cada um combina com o Bauman: só AF vs Pentáculo todo", value: `${rAF.toFixed(2)} vs ${rTotal.toFixed(2)}` },
    ];
    $("statGridAfIsolada").innerHTML = tiles.map((t) => `
      <div class="stat-tile">
        <div class="stat-label">${t.label}</div>
        <div class="stat-value">${t.value}</div>
      </div>
    `).join("");
    return { isolados, resto, rAF, rTotal };
  }

  function renderAfIsolada(t, precomputed) {
    const { isolados, resto } = precomputed;
    const pct = (arr) => Math.round((arr.filter((d) => d.classificacao === "Suficientemente Ativo").length / arr.length) * 100);
    const grupos = [
      { label: `AF isolada (n=${isolados.length})`, pct: pct(isolados) },
      { label: `Resto da amostra (n=${resto.length})`, pct: pct(resto) },
    ];
    $("insightAfIsolada").textContent =
      `Vemos que quando a Atividade Física fica isolada — o resto do estilo de vida bem avaliado "escondendo" esse ponto fraco — a chance de a pessoa se exercitar o suficiente despenca de ${grupos[1].pct}% pra só ${grupos[0].pct}%. Ou seja: comer bem e não fumar não substitui exercício de verdade nem ir a pé ou de bike pra faculdade.`;
    const canvas = $("chartAfIsolada");
    canvas.getBoundingClientRect();
    return new Chart(canvas, {
      type: "bar",
      data: { labels: grupos.map((g) => g.label), datasets: [{ data: grupos.map((g) => g.pct), backgroundColor: [t.s2, t.s1], borderRadius: 4, maxBarThickness: 46 }] },
      options: {
        responsive: false,
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: (c) => `${c.parsed.y}% suficientemente ativos` } } },
        scales: {
          x: { grid: { display: false }, ticks: { color: t.inkSecondary, font: { size: 11.5 } } },
          y: { beginAtZero: true, max: 100, ticks: { callback: (v) => v + "%", color: t.muted }, grid: { color: t.grid } },
        },
      },
    });
  }

  function renderAfFaixa(t) {
    const faixaDe = (v) => (v <= 3 ? "Baixo (0-3)" : v <= 6 ? "Médio (4-6)" : "Alto (7-9)");
    const order = ["Baixo (0-3)", "Médio (4-6)", "Alto (7-9)"];
    const rows = order.map((cat) => {
      const subset = data.filter((d) => faixaDe(d.atividadeFisica) === cat);
      const ativos = subset.filter((d) => d.classificacao === "Suficientemente Ativo").length;
      return { cat, n: subset.length, pct: subset.length ? Math.round((ativos / subset.length) * 100) : 0 };
    });
    $("insightAfFaixa").textContent =
      `Vemos uma relação bem direta: só ${rows[0].pct}% de quem pontua baixo em Atividade Física no Pentáculo também é ativo pelo Bauman, contra ${rows[1].pct}% na faixa média e ${rows[2].pct}% na faixa alta. Quanto melhor a pessoa se avalia nesse domínio, maior a chance dela realmente se exercitar o suficiente.`;
    const canvas = $("chartAfFaixa");
    canvas.getBoundingClientRect();
    return new Chart(canvas, {
      type: "bar",
      data: { labels: rows.map((r) => `${r.cat} (n=${r.n})`), datasets: [{ data: rows.map((r) => r.pct), backgroundColor: t.s1, borderRadius: 4, maxBarThickness: 46 }] },
      options: {
        responsive: false,
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: (c) => `${c.parsed.y}% suficientemente ativos` } } },
        scales: {
          x: { grid: { display: false }, ticks: { color: t.inkSecondary, font: { size: 11 } } },
          y: { beginAtZero: true, max: 100, ticks: { callback: (v) => v + "%", color: t.muted }, grid: { color: t.grid } },
        },
      },
    });
  }

  function renderExemplo(precomputed) {
    const { isolados } = precomputed;
    if (!isolados.length) { $("calloutExemplo").innerHTML = ""; return; }
    const exemplo = [...isolados].sort((a, b) => b.gapAF - a.gapAF)[0];
    $("calloutExemplo").innerHTML = `
      <strong>Um exemplo real da turma (${exemplo.id}).</strong> Essa pessoa vai bem em quase tudo: come bem,
      cuida da saúde, tem boas relações e controla o estresse — uma média de ${exemplo.mediaOutrosDominios}/9
      nesses 4 domínios. Só que na Atividade Física ela tira <strong>${exemplo.atividadeFisica}/9</strong>. Pelo
      escore de Bauman, essa pessoa é <strong>${exemplo.classificacao}</strong>. Olhando só o total do Pentáculo
      (${exemplo.pentaculoTotal}/45) isso passaria batido — é abrindo domínio por domínio que o problema aparece.
    `;
  }

  // ============================================================
  // Dados brutos
  // ============================================================
  function renderDataTable() {
    $("tbodyDados").innerHTML = data.map((d) => `
      <tr>
        <td>${d.id}</td>
        <td>${d.coletor}</td>
        <td>${d.curso}</td>
        <td>${d.idade}</td>
        <td>${d.sexo}</td>
        <td>${d.modalidade}</td>
        <td>${d.turno}</td>
        <td>${d.imc}</td>
        <td>${d.tela}</td>
        <td>${d.sono}</td>
        <td>${d.deslocamento}</td>
        <td>${d.escoreTotal}</td>
        <td><span class="tag ${d.classificacao === "Suficientemente Ativo" ? "active" : "inactive"}">${d.classificacao === "Suficientemente Ativo" ? "Ativo" : "Insuf."}</span></td>
      </tr>
    `).join("");
  }

  function renderPentaculoTable() {
    $("tbodyPevi").innerHTML = data.map((d) => `
      <tr>
        <td>${d.id}</td>
        <td>${d.coletor}</td>
        <td>${d.curso}</td>
        <td>${d.idade}</td>
        <td>${d.sexo}</td>
        <td>${d.nutricao}</td>
        <td>${d.atividadeFisica}</td>
        <td>${d.comportamentoPreventivo}</td>
        <td>${d.relacionamentos}</td>
        <td>${d.controleEstresse}</td>
        <td>${d.pentaculoTotal}</td>
        <td>${d.escoreTotal}</td>
        <td><span class="tag ${d.classificacao === "Suficientemente Ativo" ? "active" : "inactive"}">${d.classificacao === "Suficientemente Ativo" ? "Ativo" : "Insuf."}</span></td>
      </tr>
    `).join("");
  }

  // ============================================================
  // Boot
  // ============================================================
  let instances = [];

  function renderAll() {
    instances.forEach((c) => c.destroy());
    instances = [];
    const t = theme();
    Chart.defaults.font.family = getComputedStyle(document.body).fontFamily;

    renderStatGridAmostra();
    instances.push(renderCursoChart(t));
    instances.push(renderIdade(t));
    renderDemoBar("demoSexo", "Sexo", (d) => d.sexo, ["Feminino", "Masculino"], [t.s1, t.s2], t);
    renderDemoBar("demoModalidade", "Modalidade", (d) => d.modalidade, ["Presencial", "EAD"], [t.s1, t.s2], t);
    renderDemoBar("demoTurno", "Turno", (d) => d.turno, ["Matutino", "Noturno"], [t.s1, t.s2], t);

    instances.push(renderClassificacao(t));
    instances.push(renderEscoreTotal(t));

    instances.push(renderCrossBar("chartTela", "insightTela", (d) => d.tela, ["<4h", "4-8h", ">8h"], t));
    instances.push(renderCrossBar("chartSono", "insightSono", (d) => d.sono, ["<6h", "6-8h", ">8h"], t));
    instances.push(renderCrossBar("chartOcupacao", "insightOcupacao", (d) => d.ocupacao, ["Não trabalha", "Meio período", "Tempo integral"], t));
    instances.push(renderCrossBar("chartModalidade", "insightModalidade", (d) => d.modalidade, ["Presencial", "EAD"], t));
    instances.push(renderCrossBar("chartDeslocamento", "insightDeslocamento", (d) => d.deslocamento, ["Transporte coletivo", "Carro/Moto/Aplicativo", "A pé/Bicicleta"], t));
    instances.push(renderCrossBar("chartImcFaixa", "insightImcFaixa", (d) => d.imcCategoria, ["Abaixo do peso", "Peso normal", "Sobrepeso", "Obesidade"], t));

    renderImcStats();
    instances.push(renderImc(t));

    instances.push(renderPentaculoRadar(t));
    instances.push(renderDominioFraco(t));

    const precomputed = renderStatGridAfIsolada();
    instances.push(renderAfIsolada(t, precomputed));
    instances.push(renderAfFaixa(t));
    renderExemplo(precomputed);

    renderDataTable();
    renderPentaculoTable();
  }

  window.addEventListener("load", renderAll);
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", renderAll);
})();
