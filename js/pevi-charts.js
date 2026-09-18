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

  // ============================================================
  // Metodologia — stat tiles
  // ============================================================
  function renderStatGridPevi() {
    const n = data.length;
    const idadeMedia = mean(data.map((d) => d.idade));
    const cursos = new Set(data.map((d) => d.curso));
    const ativos = data.filter((d) => d.classificacao === "Suficientemente Ativo").length;

    const tiles = [
      { label: "Entrevistados (PEVI)", value: n },
      { label: "Idade média", value: `${idadeMedia.toFixed(1)} anos` },
      { label: "Cursos representados", value: cursos.size },
      { label: "Suficientemente ativos (Bauman)", value: `${Math.round((ativos / n) * 100)}% (${ativos}/${n})` },
    ];

    $("statGridPevi").innerHTML = tiles.map((t) => `
      <div class="stat-tile">
        <div class="stat-label">${t.label}</div>
        <div class="stat-value">${t.value}</div>
      </div>
    `).join("");
  }

  // ============================================================
  // Pentáculo médio — radar
  // ============================================================
  function renderPentaculoRadar(t) {
    const medias = dominios.map((dom) => mean(data.map((d) => d[dom.key])));
    const canvas = $("chartPentaculoRadar");
    canvas.getBoundingClientRect(); // força o layout a assentar antes do Chart.js medir o canvas
    return new Chart(canvas, {
      type: "radar",
      data: {
        labels: dominios.map((d) => d.label),
        datasets: [{
          label: "Média da turma",
          data: medias,
          backgroundColor: t.s1wash,
          borderColor: t.s1,
          borderWidth: 2,
          pointBackgroundColor: t.s1,
          pointRadius: 4,
        }],
      },
      options: {
        responsive: false,
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: (c) => `${c.label}: ${c.parsed.r.toFixed(1)} / 9` } },
        },
        scales: {
          r: {
            min: 0,
            max: 9,
            ticks: { stepSize: 3, color: t.muted, backdropColor: "transparent" },
            grid: { color: t.grid },
            angleLines: { color: t.grid },
            pointLabels: { color: t.inkSecondary, font: { size: 11.5 } },
          },
        },
      },
    });
  }

  // ============================================================
  // Domínio mais comprometido
  // ============================================================
  function renderDominioFraco(t) {
    const counts = new Map(dominios.map((d) => [d.label, 0]));
    data.forEach((d) => counts.set(d.dominioMaisFraco, (counts.get(d.dominioMaisFraco) || 0) + 1));
    const rows = [...counts.entries()].sort((a, b) => b[1] - a[1]);

    $("insightDominioFraco").textContent =
      `Vemos que "${rows[0][0]}" é o ponto mais fraco pra ${Math.round((rows[0][1] / data.length) * 100)}% da turma — é o que mais aparece como o elo mais baixo do estilo de vida de cada um.`;

    const canvasFraco = $("chartDominioFraco");
    canvasFraco.getBoundingClientRect();
    return new Chart(canvasFraco, {
      type: "bar",
      data: {
        labels: rows.map((r) => r[0]),
        datasets: [{ data: rows.map((r) => Math.round((r[1] / data.length) * 100)), backgroundColor: t.s1, borderRadius: 4, maxBarThickness: 30 }],
      },
      options: {
        indexAxis: "y",
        responsive: false,
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: (c) => `${c.parsed.x}% da amostra` } },
        },
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
  const GAP_LIMIAR = 3; // pontos (escala 0-9) que definem "isolada"

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

  function pearson(xs, ys) {
    const n = xs.length;
    const mx = mean(xs), my = mean(ys);
    let num = 0, dx2 = 0, dy2 = 0;
    for (let i = 0; i < n; i++) {
      const dx = xs[i] - mx, dy = ys[i] - my;
      num += dx * dy; dx2 += dx * dx; dy2 += dy * dy;
    }
    return num / Math.sqrt(dx2 * dy2);
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

    const canvasAfIsolada = $("chartAfIsolada");
    canvasAfIsolada.getBoundingClientRect();
    return new Chart(canvasAfIsolada, {
      type: "bar",
      data: {
        labels: grupos.map((g) => g.label),
        datasets: [{ data: grupos.map((g) => g.pct), backgroundColor: [t.s2, t.s1], borderRadius: 4, maxBarThickness: 46 }],
      },
      options: {
        responsive: false,
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: (c) => `${c.parsed.y}% suficientemente ativos` } },
        },
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

    const canvasAfFaixa = $("chartAfFaixa");
    canvasAfFaixa.getBoundingClientRect();
    return new Chart(canvasAfFaixa, {
      type: "bar",
      data: {
        labels: rows.map((r) => `${r.cat} (n=${r.n})`),
        datasets: [{ data: rows.map((r) => r.pct), backgroundColor: t.s1, borderRadius: 4, maxBarThickness: 46 }],
      },
      options: {
        responsive: false,
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
  // Tabela de dados
  // ============================================================
  function renderTabelaPevi() {
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

  function renderAllPevi() {
    instances.forEach((c) => c.destroy());
    instances = [];
    const t = theme();

    renderStatGridPevi();
    instances.push(renderPentaculoRadar(t));
    instances.push(renderDominioFraco(t));

    const precomputed = renderStatGridAfIsolada();
    instances.push(renderAfIsolada(t, precomputed));
    instances.push(renderAfFaixa(t));
    renderExemplo(precomputed);

    renderTabelaPevi();
  }

  // A página já cria 11 gráficos na Parte 1 (js/charts.js) na mesma
  // passada de DOMContentLoaded. Criar mais 4 logo em seguida, no mesmo
  // tick, faz alguns (o radar em especial) desenharem com a área errada —
  // um `load` (dispara depois que o layout de tudo acima já assentou) evita
  // o problema sem precisar mexer na versão do Chart.js de novo.
  window.addEventListener("load", renderAllPevi);
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", renderAllPevi);
})();
