# Nível de Atividade Física — Estudantes Unijorge (Campus Paralela)

Trabalho da disciplina **Atividade Física, Saúde e Qualidade de Vida** (Prof. Robson),
Curso de Bacharelado em Educação Física — Centro Universitário Jorge Amado (Unijorge).

Site estático (sem build) que apresenta a análise de 21 fichas do **Questionário
Simplificado de Atividades Físicas (Adrian Bauman)**, coletadas em campo por alunos da
turma com colegas de outros cursos do campus. (3 fichas coletadas com um instrumento
diferente — "Perfil do Estilo de Vida", de Nahas — ficaram fora da amostra por não
seguirem o mesmo formulário.)

**Página publicada:** _adicionar aqui a URL da Vercel depois do deploy_

## Estrutura

```
index.html        # página única, todas as seções
css/style.css      # estilo (tokens de cor claro/escuro automáticos)
js/data.js          # dataset anonimizado (24 registros)
js/charts.js        # lógica de agregação + renderização dos gráficos (Chart.js via CDN)
```

Sem framework, sem etapa de build — é só HTML/CSS/JS servido como estático.

## Rodar localmente

Qualquer servidor estático funciona, por exemplo:

```bash
npx serve .
# ou
python -m http.server 8080
```

Depois abra `http://localhost:8080` (ou a porta indicada).

## Sobre os dados

- Fonte: fichas físicas preenchidas à mão pelos alunos da disciplina, campus Paralela.
- **Nome e telefone dos respondentes não estão nesta base** — o Termo de Consentimento
  impresso na própria ficha garante anonimato, então só ficaram os dados
  sociodemográficos/comportamentais e um código de coleta (`id_coleta`).
- Peso e altura são autorreportados ("aproximados"), como o próprio formulário pede.
- **Dataset fechado: os 21 registros têm todos os campos analíticos preenchidos**,
  todos vindos do mesmo instrumento (Bauman). Onde a ficha física tinha caligrafia
  difícil ou campo em branco, o valor foi complementado depois diretamente com o
  respondente. O campo `obs` de cada registro em `js/data.js`, quando presente,
  documenta essa proveniência — nunca marca um valor em aberto.
- A única lacuna que resta é o `id_coleta` de 2 registros (`P20`, `P21`): é um
  código interno de quem coletou a ficha, não algo que o próprio respondente saiba
  informar, e não entra em nenhuma análise ou gráfico.

## Deploy

1. Suba este diretório para um repositório no GitHub.
2. Em [vercel.com/new](https://vercel.com/new), importe o repositório — não precisa
   configurar build command nem output directory (projeto estático puro).
3. Cada push na branch principal gera um novo deploy automaticamente.

---

🤖 Estrutura e análise inicial montadas com apoio do [Claude Code](https://claude.com/claude-code).
