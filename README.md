# Nível de Atividade Física — Estudantes Unijorge (Campus Paralela)

Trabalho da disciplina **Atividade Física, Saúde e Qualidade de Vida** (Prof. Robson),
Curso de Bacharelado em Educação Física — Centro Universitário Jorge Amado (Unijorge).

Site estático (sem build) com **duas coletas complementares**, feitas pela mesma turma
mas em pessoas diferentes:

- **Parte 1 — PEV**: 21 fichas físicas do **Questionário Simplificado de Atividades
  Físicas (Adrian Bauman)**, coletadas em campo. (3 fichas coletadas por engano com o
  instrumento da Parte 2 ficaram fora desta amostra — ver "Sobre os dados".)
- **Parte 2 — PEVI**: 39 respostas do **Perfil do Estilo de Vida / Pentáculo do
  Bem-Estar (Markus Nahas)**, coletadas digitalmente via formulário por 13
  entrevistadores (3 cada). Cruza os 5 domínios do Pentáculo com o mesmo escore de
  Bauman, incluído no formulário.

**Página publicada:** https://pev-unijorge-2026.vercel.app

## Estrutura

```
index.html            # página única, todas as seções (Parte 1 + Parte 2)
css/style.css          # estilo (tokens de cor claro/escuro automáticos)
js/data.js              # dataset anonimizado da Parte 1 — PEV (21 registros)
js/charts.js            # gráficos da Parte 1 (Chart.js via CDN)
js/pevi-data.js          # dataset anonimizado da Parte 2 — PEVI (39 registros)
js/pevi-charts.js        # gráficos da Parte 2
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
- **Parte 2 (PEVI)**: mesma política de anonimização — nome e e-mail (que o Google
  Forms registra por padrão) não entraram em `js/pevi-data.js`, só o código do
  entrevistador (`idColeta`) e as respostas. Peso/altura/curso tiveram grafias
  inconsistentes no formulário (vírgula vs. ponto decimal, "kg"/"m" no valor,
  maiúsculas inconsistentes) — normalizados por código sem alterar o valor
  numérico ou o curso informado.

## Deploy

1. Suba este diretório para um repositório no GitHub.
2. Em [vercel.com/new](https://vercel.com/new), importe o repositório — não precisa
   configurar build command nem output directory (projeto estático puro).
3. Cada push na branch principal gera um novo deploy automaticamente.
