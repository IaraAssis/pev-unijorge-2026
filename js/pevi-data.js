/**
 * PEV — Perfil do Estilo de Vida (Pentáculo do Bem-Estar, Nahas), coletado
 * junto com o Questionário Simplificado de Atividades Físicas (Bauman) num
 * único formulário digital. (Variável/arquivo mantém o nome histórico
 * "pevi"/"PEVI_DATA" no código — só o texto da página usa o nome certo, PEV.)
 *
 * Base oficial do trabalho: 39 respostas coletadas digitalmente via
 * formulário Google — 13 alunos da disciplina, cada um entrevistou 3
 * pessoas. (As fichas físicas em papel coletadas antes deste formulário
 * tinham inconsistências de preenchimento — caligrafia difícil, campos em
 * branco — e foram descartadas da análise; só os dados do formulário digital
 * entram aqui.)
 *
 * O formulário embute as mesmas 2 perguntas do Questionário Simplificado de
 * Bauman (escoreA/escoreB) e mais 15 perguntas do PEV (0 a 3 pontos cada),
 * agrupadas em 5 domínios de 3 perguntas cada (0-9 pontos por domínio):
 *
 *   Alimentação · Atividade Física · Comportamento Preventivo ·
 *   Relacionamentos · Controle do Estresse
 *
 * Nome/e-mail dos entrevistados não entraram aqui — só o ID do entrevistador
 * (rastreável a quem coletou) e as respostas.
 */

const PEVI_DATA = [
  { id: "Q01", idColeta: "IR01", coletor: "IR", idade: 25, sexo: "Masculino", modalidade: "Presencial", curso: "Direito", semestre: 7, turno: "Noturno", ocupacao: "Meio período", peso: 70, altura: 1.86, tela: "4-8h", deslocamento: "Carro/Moto/Aplicativo", sono: "6-8h", escoreA: 2, escoreB: 2, nutricao: 6, atividadeFisica: 5, comportamentoPreventivo: 5, relacionamentos: 4, controleEstresse: 5 },
  { id: "Q02", idColeta: "IR02", coletor: "IR", idade: 62, sexo: "Masculino", modalidade: "EAD", curso: "Mecânica", semestre: 1, turno: "Noturno", ocupacao: "Tempo integral", peso: 83, altura: 1.82, tela: "4-8h", deslocamento: "Carro/Moto/Aplicativo", sono: "<6h", escoreA: 4, escoreB: 2, nutricao: 3, atividadeFisica: 8, comportamentoPreventivo: 7, relacionamentos: 6, controleEstresse: 6 },
  { id: "Q03", idColeta: "IR03", coletor: "IR", idade: 27, sexo: "Feminino", modalidade: "Presencial", curso: "Odontologia", semestre: 2, turno: "Noturno", ocupacao: "Meio período", peso: 60, altura: 1.55, tela: "4-8h", deslocamento: "Transporte coletivo", sono: "6-8h", escoreA: 0, escoreB: 0, nutricao: 6, atividadeFisica: 3, comportamentoPreventivo: 9, relacionamentos: 9, controleEstresse: 4 },
  { id: "Q04", idColeta: "GS01", coletor: "GS", idade: 25, sexo: "Masculino", modalidade: "Presencial", curso: "ADS", semestre: 4, turno: "Noturno", ocupacao: "Tempo integral", peso: 93, altura: 1.83, tela: "<4h", deslocamento: "Carro/Moto/Aplicativo", sono: ">8h", escoreA: 4, escoreB: 4, nutricao: 6, atividadeFisica: 9, comportamentoPreventivo: 8, relacionamentos: 5, controleEstresse: 5 },
  { id: "Q05", idColeta: "GS02", coletor: "GS", idade: 23, sexo: "Masculino", modalidade: "Presencial", curso: "Engenharia Elétrica", semestre: 2, turno: "Noturno", ocupacao: "Tempo integral", peso: 81, altura: 1.77, tela: "<4h", deslocamento: "Carro/Moto/Aplicativo", sono: "6-8h", escoreA: 4, escoreB: 4, nutricao: 6, atividadeFisica: 8, comportamentoPreventivo: 5, relacionamentos: 5, controleEstresse: 5 },
  { id: "Q06", idColeta: "GS03", coletor: "GS", idade: 19, sexo: "Feminino", modalidade: "Presencial", curso: "Enfermagem", semestre: 1, turno: "Noturno", ocupacao: "Tempo integral", peso: 62, altura: 1.55, tela: "4-8h", deslocamento: "Transporte coletivo", sono: "6-8h", escoreA: 0, escoreB: 1, nutricao: 4, atividadeFisica: 5, comportamentoPreventivo: 4, relacionamentos: 3, controleEstresse: 2 },
  { id: "Q07", idColeta: "RN01", coletor: "RN", idade: 21, sexo: "Feminino", modalidade: "Presencial", curso: "Nutrição", semestre: 3, turno: "Matutino", ocupacao: "Não trabalha", peso: 68, altura: 1.67, tela: "4-8h", deslocamento: "Carro/Moto/Aplicativo", sono: ">8h", escoreA: 4, escoreB: 4, nutricao: 6, atividadeFisica: 7, comportamentoPreventivo: 9, relacionamentos: 7, controleEstresse: 6 },
  { id: "Q08", idColeta: "LS01", coletor: "LS", idade: 22, sexo: "Feminino", modalidade: "Presencial", curso: "Medicina Veterinária", semestre: 2, turno: "Noturno", ocupacao: "Tempo integral", peso: 65, altura: 1.62, tela: "4-8h", deslocamento: "Transporte coletivo", sono: "6-8h", escoreA: 0, escoreB: 0, nutricao: 3, atividadeFisica: 1, comportamentoPreventivo: 5, relacionamentos: 3, controleEstresse: 3 },
  { id: "Q09", idColeta: "RN02", coletor: "RN", idade: 19, sexo: "Feminino", modalidade: "Presencial", curso: "Fisioterapia", semestre: 4, turno: "Noturno", ocupacao: "Meio período", peso: 65, altura: 1.56, tela: ">8h", deslocamento: "Transporte coletivo", sono: "<6h", escoreA: 2, escoreB: 2, nutricao: 3, atividadeFisica: 6, comportamentoPreventivo: 2, relacionamentos: 8, controleEstresse: 1 },
  { id: "Q10", idColeta: "LS02", coletor: "LS", idade: 19, sexo: "Feminino", modalidade: "Presencial", curso: "ADS", semestre: 4, turno: "Noturno", ocupacao: "Não trabalha", peso: 58, altura: 1.65, tela: "4-8h", deslocamento: "Transporte coletivo", sono: "6-8h", escoreA: 4, escoreB: 2, nutricao: 5, atividadeFisica: 7, comportamentoPreventivo: 5, relacionamentos: 4, controleEstresse: 6 },
  { id: "Q11", idColeta: "LS03", coletor: "LS", idade: 20, sexo: "Feminino", modalidade: "EAD", curso: "Gestão Financeira", semestre: 3, turno: "Noturno", ocupacao: "Tempo integral", peso: 58, altura: 1.67, tela: "4-8h", deslocamento: "Carro/Moto/Aplicativo", sono: ">8h", escoreA: 4, escoreB: 4, nutricao: 5, atividadeFisica: 6, comportamentoPreventivo: 6, relacionamentos: 7, controleEstresse: 4 },
  { id: "Q12", idColeta: "VC01", coletor: "VC", idade: 19, sexo: "Masculino", modalidade: "Presencial", curso: "Engenharia Elétrica", semestre: 4, turno: "Noturno", ocupacao: "Meio período", peso: 67, altura: 1.72, tela: "<4h", deslocamento: "Transporte coletivo", sono: "6-8h", escoreA: 4, escoreB: 4, nutricao: 4, atividadeFisica: 7, comportamentoPreventivo: 6, relacionamentos: 7, controleEstresse: 8 },
  { id: "Q13", idColeta: "VC02", coletor: "VC", idade: 19, sexo: "Feminino", modalidade: "Presencial", curso: "Engenharia de Produção", semestre: 4, turno: "Noturno", ocupacao: "Não trabalha", peso: 58, altura: 1.62, tela: "4-8h", deslocamento: "Transporte coletivo", sono: "6-8h", escoreA: 0, escoreB: 0, nutricao: 1, atividadeFisica: 0, comportamentoPreventivo: 6, relacionamentos: 5, controleEstresse: 7 },
  { id: "Q14", idColeta: "VC03", coletor: "VC", idade: 19, sexo: "Feminino", modalidade: "Presencial", curso: "Engenharia de Produção", semestre: 4, turno: "Noturno", ocupacao: "Não trabalha", peso: 55, altura: 1.58, tela: "4-8h", deslocamento: "Transporte coletivo", sono: "6-8h", escoreA: 4, escoreB: 1, nutricao: 5, atividadeFisica: 7, comportamentoPreventivo: 6, relacionamentos: 5, controleEstresse: 2 },
  { id: "Q15", idColeta: "KM01", coletor: "KM", idade: 21, sexo: "Feminino", modalidade: "Presencial", curso: "Enfermagem", semestre: 4, turno: "Noturno", ocupacao: "Tempo integral", peso: 79, altura: 1.72, tela: "4-8h", deslocamento: "Transporte coletivo", sono: "6-8h", escoreA: 4, escoreB: 2, nutricao: 6, atividadeFisica: 8, comportamentoPreventivo: 6, relacionamentos: 8, controleEstresse: 8 },
  { id: "Q16", idColeta: "KM02", coletor: "KM", idade: 20, sexo: "Feminino", modalidade: "Presencial", curso: "Comunicação e Design", semestre: 6, turno: "Matutino", ocupacao: "Tempo integral", peso: 48, altura: 1.55, tela: "4-8h", deslocamento: "Transporte coletivo", sono: "6-8h", escoreA: 4, escoreB: 2, nutricao: 4, atividadeFisica: 9, comportamentoPreventivo: 6, relacionamentos: 8, controleEstresse: 5 },
  { id: "Q17", idColeta: "RN03", coletor: "RN", idade: 20, sexo: "Feminino", modalidade: "Presencial", curso: "Contabilidade", semestre: 6, turno: "Noturno", ocupacao: "Tempo integral", peso: 68, altura: 1.59, tela: ">8h", deslocamento: "Transporte coletivo", sono: "6-8h", escoreA: 0, escoreB: 0, nutricao: 2, atividadeFisica: 3, comportamentoPreventivo: 5, relacionamentos: 5, controleEstresse: 7 },
  { id: "Q18", idColeta: "KM03", coletor: "KM", idade: 18, sexo: "Masculino", modalidade: "EAD", curso: "Engenharia Elétrica", semestre: 2, turno: "Noturno", ocupacao: "Meio período", peso: 66, altura: 1.8, tela: "<4h", deslocamento: "Transporte coletivo", sono: "6-8h", escoreA: 4, escoreB: 1, nutricao: 3, atividadeFisica: 6, comportamentoPreventivo: 5, relacionamentos: 8, controleEstresse: 4 },
  { id: "Q19", idColeta: "LP01", coletor: "LP", idade: 26, sexo: "Feminino", modalidade: "Presencial", curso: "Engenharia Elétrica", semestre: 3, turno: "Noturno", ocupacao: "Tempo integral", peso: 60, altura: 1.65, tela: "<4h", deslocamento: "Transporte coletivo", sono: "<6h", escoreA: 2, escoreB: 1, nutricao: 8, atividadeFisica: 2, comportamentoPreventivo: 5, relacionamentos: 3, controleEstresse: 8 },
  { id: "Q20", idColeta: "LP02", coletor: "LP", idade: 47, sexo: "Masculino", modalidade: "EAD", curso: "Educação Física", semestre: 3, turno: "Noturno", ocupacao: "Tempo integral", peso: 80, altura: 1.83, tela: "<4h", deslocamento: "Carro/Moto/Aplicativo", sono: "<6h", escoreA: 4, escoreB: 2, nutricao: 8, atividadeFisica: 3, comportamentoPreventivo: 4, relacionamentos: 5, controleEstresse: 8 },
  { id: "Q21", idColeta: "LP03", coletor: "LP", idade: 55, sexo: "Feminino", modalidade: "EAD", curso: "Pedagogia", semestre: 4, turno: "Noturno", ocupacao: "Tempo integral", peso: 60, altura: 1.63, tela: "<4h", deslocamento: "Transporte coletivo", sono: "6-8h", escoreA: 0, escoreB: 0, nutricao: 7, atividadeFisica: 0, comportamentoPreventivo: 8, relacionamentos: 5, controleEstresse: 6 },
  { id: "Q22", idColeta: "Ah01", coletor: "Ah", idade: 18, sexo: "Feminino", modalidade: "Presencial", curso: "Arquitetura e Urbanismo", semestre: 2, turno: "Noturno", ocupacao: "Meio período", peso: 68, altura: 1.64, tela: "4-8h", deslocamento: "Transporte coletivo", sono: "6-8h", escoreA: 2, escoreB: 1, nutricao: 2, atividadeFisica: 1, comportamentoPreventivo: 6, relacionamentos: 5, controleEstresse: 7 },
  { id: "Q23", idColeta: "Ah02", coletor: "Ah", idade: 20, sexo: "Feminino", modalidade: "Presencial", curso: "Arquitetura e Urbanismo", semestre: 2, turno: "Noturno", ocupacao: "Tempo integral", peso: 65, altura: 1.65, tela: ">8h", deslocamento: "Transporte coletivo", sono: "6-8h", escoreA: 0, escoreB: 0, nutricao: 7, atividadeFisica: 7, comportamentoPreventivo: 4, relacionamentos: 4, controleEstresse: 8 },
  { id: "Q24", idColeta: "Ah03", coletor: "Ah", idade: 19, sexo: "Feminino", modalidade: "Presencial", curso: "Arquitetura e Urbanismo", semestre: 2, turno: "Noturno", ocupacao: "Meio período", peso: 60, altura: 1.63, tela: "4-8h", deslocamento: "A pé/Bicicleta", sono: "<6h", escoreA: 2, escoreB: 1, nutricao: 1, atividadeFisica: 6, comportamentoPreventivo: 4, relacionamentos: 3, controleEstresse: 7 },
  { id: "Q25", idColeta: "DL01", coletor: "DL", idade: 21, sexo: "Feminino", modalidade: "Presencial", curso: "Enfermagem", semestre: 2, turno: "Noturno", ocupacao: "Tempo integral", peso: 72, altura: 1.71, tela: ">8h", deslocamento: "Transporte coletivo", sono: "<6h", escoreA: 2, escoreB: 1, nutricao: 0, atividadeFisica: 1, comportamentoPreventivo: 4, relacionamentos: 4, controleEstresse: 1 },
  { id: "Q26", idColeta: "BS01", coletor: "BS", idade: 19, sexo: "Masculino", modalidade: "Presencial", curso: "Psicologia", semestre: 2, turno: "Noturno", ocupacao: "Meio período", peso: 81, altura: 1.8, tela: ">8h", deslocamento: "Transporte coletivo", sono: "<6h", escoreA: 4, escoreB: 1, nutricao: 0, atividadeFisica: 5, comportamentoPreventivo: 1, relacionamentos: 3, controleEstresse: 5 },
  { id: "Q27", idColeta: "DL", coletor: "DL", idade: 22, sexo: "Masculino", modalidade: "Presencial", curso: "Engenharia Elétrica", semestre: 6, turno: "Noturno", ocupacao: "Tempo integral", peso: 99, altura: 1.75, tela: ">8h", deslocamento: "Carro/Moto/Aplicativo", sono: "6-8h", escoreA: 2, escoreB: 2, nutricao: 5, atividadeFisica: 5, comportamentoPreventivo: 5, relacionamentos: 3, controleEstresse: 4 },
  { id: "Q28", idColeta: "DL03", coletor: "DL", idade: 37, sexo: "Feminino", modalidade: "Presencial", curso: "Enfermagem", semestre: 4, turno: "Noturno", ocupacao: "Tempo integral", peso: 72, altura: 1.6, tela: "<4h", deslocamento: "Carro/Moto/Aplicativo", sono: "6-8h", escoreA: 2, escoreB: 1, nutricao: 7, atividadeFisica: 4, comportamentoPreventivo: 5, relacionamentos: 8, controleEstresse: 5 },
  { id: "Q29", idColeta: "Afs01", coletor: "Afs", idade: 19, sexo: "Feminino", modalidade: "Presencial", curso: "Biomedicina", semestre: 2, turno: "Noturno", ocupacao: "Meio período", peso: 55, altura: 1.54, tela: "4-8h", deslocamento: "Transporte coletivo", sono: "6-8h", escoreA: 0, escoreB: 1, nutricao: 2, atividadeFisica: 4, comportamentoPreventivo: 5, relacionamentos: 6, controleEstresse: 4 },
  { id: "Q30", idColeta: "BS02", coletor: "BS", idade: 19, sexo: "Masculino", modalidade: "Presencial", curso: "Nutrição", semestre: 2, turno: "Matutino", ocupacao: "Não trabalha", peso: 95, altura: 1.96, tela: "<4h", deslocamento: "Transporte coletivo", sono: "6-8h", escoreA: 4, escoreB: 2, nutricao: 3, atividadeFisica: 6, comportamentoPreventivo: 0, relacionamentos: 6, controleEstresse: 6 },
  { id: "Q31", idColeta: "Afs02", coletor: "Afs", idade: 21, sexo: "Masculino", modalidade: "Presencial", curso: "Engenharia Elétrica", semestre: 8, turno: "Noturno", ocupacao: "Meio período", peso: 79.05, altura: 1.72, tela: ">8h", deslocamento: "Transporte coletivo", sono: "<6h", escoreA: 4, escoreB: 4, nutricao: 3, atividadeFisica: 8, comportamentoPreventivo: 7, relacionamentos: 5, controleEstresse: 6 },
  { id: "Q32", idColeta: "Afs03", coletor: "Afs", idade: 26, sexo: "Masculino", modalidade: "Presencial", curso: "Direito", semestre: 2, turno: "Noturno", ocupacao: "Meio período", peso: 63, altura: 1.7, tela: "<4h", deslocamento: "Transporte coletivo", sono: ">8h", escoreA: 4, escoreB: 4, nutricao: 6, atividadeFisica: 8, comportamentoPreventivo: 7, relacionamentos: 5, controleEstresse: 7 },
  { id: "Q33", idColeta: "BS03", coletor: "BS", idade: 19, sexo: "Feminino", modalidade: "Presencial", curso: "Biomedicina", semestre: 2, turno: "Matutino", ocupacao: "Não trabalha", peso: 64, altura: 1.68, tela: "<4h", deslocamento: "Transporte coletivo", sono: ">8h", escoreA: 2, escoreB: 2, nutricao: 5, atividadeFisica: 6, comportamentoPreventivo: 6, relacionamentos: 6, controleEstresse: 7 },
  { id: "Q34", idColeta: "ILS01", coletor: "ILS", idade: 32, sexo: "Feminino", modalidade: "Presencial", curso: "Enfermagem", semestre: 4, turno: "Noturno", ocupacao: "Tempo integral", peso: 57, altura: 1.55, tela: "4-8h", deslocamento: "Transporte coletivo", sono: "6-8h", escoreA: 0, escoreB: 0, nutricao: 7, atividadeFisica: 0, comportamentoPreventivo: 6, relacionamentos: 3, controleEstresse: 7 },
  { id: "Q35", idColeta: "ILS02", coletor: "ILS", idade: 18, sexo: "Feminino", modalidade: "Presencial", curso: "Direito", semestre: 4, turno: "Noturno", ocupacao: "Tempo integral", peso: 67, altura: 1.65, tela: "<4h", deslocamento: "Transporte coletivo", sono: "<6h", escoreA: 2, escoreB: 1, nutricao: 3, atividadeFisica: 9, comportamentoPreventivo: 2, relacionamentos: 2, controleEstresse: 4 },
  { id: "Q36", idColeta: "AS3", coletor: "AS", idade: 18, sexo: "Feminino", modalidade: "Presencial", curso: "Engenharia Elétrica", semestre: 2, turno: "Noturno", ocupacao: "Meio período", peso: 47, altura: 1.55, tela: ">8h", deslocamento: "Transporte coletivo", sono: "6-8h", escoreA: 2, escoreB: 1, nutricao: 5, atividadeFisica: 4, comportamentoPreventivo: 3, relacionamentos: 6, controleEstresse: 4 },
  { id: "Q37", idColeta: "ILS03", coletor: "ILS", idade: 19, sexo: "Feminino", modalidade: "Presencial", curso: "Direito", semestre: 4, turno: "Noturno", ocupacao: "Tempo integral", peso: 76, altura: 1.62, tela: ">8h", deslocamento: "Carro/Moto/Aplicativo", sono: "<6h", escoreA: 4, escoreB: 0, nutricao: 3, atividadeFisica: 6, comportamentoPreventivo: 0, relacionamentos: 0, controleEstresse: 8 },
  { id: "Q38", idColeta: "AS2", coletor: "AS", idade: 27, sexo: "Masculino", modalidade: "EAD", curso: "Direito", semestre: 10, turno: "Noturno", ocupacao: "Tempo integral", peso: 65, altura: 1.76, tela: ">8h", deslocamento: "Transporte coletivo", sono: "6-8h", escoreA: 0, escoreB: 0, nutricao: 0, atividadeFisica: 4, comportamentoPreventivo: 8, relacionamentos: 7, controleEstresse: 4 },
  { id: "Q39", idColeta: "AS1", coletor: "AS", idade: 18, sexo: "Masculino", modalidade: "Presencial", curso: "Engenharia Elétrica", semestre: 3, turno: "Noturno", ocupacao: "Tempo integral", peso: 80, altura: 1.9, tela: "4-8h", deslocamento: "Transporte coletivo", sono: "6-8h", escoreA: 0, escoreB: 4, nutricao: 5, atividadeFisica: 6, comportamentoPreventivo: 3, relacionamentos: 4, controleEstresse: 4 },
];

const PEVI_DOMINIOS = [
  { key: "nutricao", label: "Alimentação" },
  { key: "atividadeFisica", label: "Atividade Física" },
  { key: "comportamentoPreventivo", label: "Comportamento Preventivo" },
  { key: "relacionamentos", label: "Relacionamentos" },
  { key: "controleEstresse", label: "Controle do Estresse" },
];

PEVI_DATA.forEach((d) => {
  d.escoreTotal = d.escoreA + d.escoreB;
  d.classificacao = d.escoreTotal >= 4 ? "Suficientemente Ativo" : "Insuficientemente Ativo";
  d.imc = +(d.peso / (d.altura * d.altura)).toFixed(1);
  d.imcCategoria = d.imc < 18.5 ? "Abaixo do peso" : d.imc < 25 ? "Peso normal" : d.imc < 30 ? "Sobrepeso" : "Obesidade";
  d.pentaculoTotal = PEVI_DOMINIOS.reduce((s, dom) => s + d[dom.key], 0);

  // Domínio mais comprometido (menor pontuação; empate resolvido pela
  // ordem acima, que segue a ordem do próprio Pentáculo no livro).
  d.dominioMaisFraco = PEVI_DOMINIOS.reduce((min, dom) => (d[dom.key] < d[min.key] ? dom : min)).label;

  // "AF isolada": o domínio de Atividade Física fica abaixo da média dos
  // outros 4 — o resto do estilo de vida "compensa" um AF baixo, que só
  // aparece isolado quando se olha domínio a domínio.
  const outros = PEVI_DOMINIOS.filter((dom) => dom.key !== "atividadeFisica");
  d.mediaOutrosDominios = +(outros.reduce((s, dom) => s + d[dom.key], 0) / outros.length).toFixed(2);
  d.gapAF = +(d.mediaOutrosDominios - d.atividadeFisica).toFixed(2);
});
