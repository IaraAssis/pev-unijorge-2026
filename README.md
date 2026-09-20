# PEV: Perfil do Estilo de Vida, Estudantes Unijorge (Campus Paralela)

Trabalho da disciplina **Atividade Física, Saúde e Qualidade de Vida** (Prof. Robson),
Curso de Bacharelado em Educação Física, Centro Universitário Jorge Amado (Unijorge).

Site estático (sem build) com a análise de **39 respostas** de um formulário digital
único que junta dois instrumentos:

- **Questionário**: dados sociodemográficos e acadêmicos, indicadores antropométricos
  e hábitos de vida, e o **Questionário Simplificado de Atividades Físicas** (Adrian
  Bauman): escore de 0 a 8 que classifica cada pessoa como suficientemente ou
  insuficientemente ativa.
- **PEV: Perfil do Estilo de Vida**: o "Pentáculo do Bem-Estar" de Markus Nahas, 5
  domínios (Alimentação, Atividade Física, Comportamento Preventivo, Relacionamentos,
  Controle do Estresse), 3 perguntas cada, 0 a 9 pontos por domínio.

13 alunos da disciplina entrevistaram 3 pessoas cada. Ter os dois instrumentos na
mesma pessoa permite cruzar a autopercepção de estilo de vida (PEV) com a frequência
real de exercício (Questionário), a pergunta central do trabalho.

**Página publicada:** https://pev-unijorge-2026.vercel.app

## Estrutura

```
index.html            # página única, todas as seções
css/style.css          # estilo (tokens de cor claro/escuro automáticos)
js/pevi-data.js         # dataset anonimizado (39 registros)
js/pevi-charts.js       # gráficos (Chart.js via CDN)
js/nav.js               # menu com scroll inteligente, barra de progresso e scroll-spy
```

Sem framework, sem etapa de build: é só HTML/CSS/JS servido como estático.

## Rodar localmente

Qualquer servidor estático funciona, por exemplo:

```bash
npx serve .
# ou
python -m http.server 8080
```

Depois abra `http://localhost:8080` (ou a porta indicada).

## Sobre os dados

- Fonte: formulário digital (Google Forms) preenchido pelos próprios entrevistadores.
  Fichas físicas em papel foram usadas numa etapa inicial da coleta, mas tinham
  inconsistências de preenchimento (caligrafia difícil, campos em branco); só os
  dados do formulário digital entram na análise.
- **Nome e e-mail dos entrevistados não estão nesta base**: só o código do
  entrevistador (`idColeta`/`coletor`, rastreável a quem coletou) e as respostas.
- Peso/altura/curso tiveram grafias inconsistentes no formulário (vírgula vs. ponto
  decimal, "kg"/"m" no valor, maiúsculas inconsistentes), normalizados por código,
  sem alterar o valor numérico ou o curso informado.
- Os arquivos e variáveis internas mantêm o prefixo histórico `pevi` (`PEVI_DATA`,
  `js/pevi-data.js`): o texto da página usa o nome correto do instrumento, **PEV**.

## Deploy

1. Suba este diretório para um repositório no GitHub.
2. Em [vercel.com/new](https://vercel.com/new), importe o repositório: não precisa
   configurar build command nem output directory (projeto estático puro).
3. Cada push na branch principal gera um novo deploy automaticamente.
