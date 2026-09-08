/**
 * Dataset anonimizado — Levantamento do Nível de Atividade Física e Perfil
 * Epidemiológico dos Estudantes Universitários da Unijorge (Campus Paralela).
 *
 * Fonte: fichas físicas do Questionário Simplificado de Atividades Físicas
 * (Adrian Bauman) aplicadas por alunos da disciplina "Atividade Física, Saúde
 * e Qualidade de Vida" (Prof. Robson) — Curso de Educação Física.
 *
 * IMPORTANTE — nome e telefone dos respondentes NÃO foram digitalizados aqui:
 * o próprio Termo de Consentimento nas fichas garante anonimato, então o
 * dataset público guarda só o código de coleta (id_coleta) e os dados
 * sociodemográficos/comportamentais.
 *
 * Dataset fechado: todos os 21 registros têm os campos analíticos completos
 * (idade, sexo, modalidade, curso, semestre, turno, ocupação, peso, altura,
 * tela, deslocamento, sono, escoreA, escoreB) e vieram do mesmo instrumento
 * padrão — o Questionário Simplificado de Atividades Físicas (Bauman). As 3
 * fichas coletadas com o instrumento alternativo "Perfil do Estilo de Vida"
 * (Nahas) foram removidas da amostra: formulário diferente, não comparável
 * ponto a ponto com o restante da base.
 *
 * `obs`, quando presente, documenta a PROVENIÊNCIA do dado — caligrafia
 * difícil resolvida pra leitura mais provável, ou campo complementado depois
 * diretamente com o respondente — nunca um valor em aberto. A única lacuna
 * real que resta é `id_coleta` em 2 registros (código interno de quem
 * coletou; não é algo que o respondente saiba, e não entra em nenhuma
 * análise). peso/altura são "aproximados" (autorreportados), como o próprio
 * formulário pede a todos os respondentes.
 */

const PEV_DATA = [
  { id: "P01", coletor: "Kaylane Maia", id_coleta: "Km02", idade: 20, sexo: "Masculino", modalidade: "Presencial", curso: "Engenharia da Computação", semestre: 3, turno: "Noturno", ocupacao: "Meio período", peso: 118, altura: 1.86, tela: "4-8h", deslocamento: "Transporte coletivo", sono: "<6h", escoreA: 0, escoreB: 0 },
  { id: "P02", coletor: "Kaylane Maia", id_coleta: "Km03", idade: 19, sexo: "Masculino", modalidade: "EAD", curso: "Engenharia Elétrica", semestre: 2, turno: "Noturno", ocupacao: "Meio período", peso: 66, altura: 1.90, tela: "<4h", deslocamento: "Transporte coletivo", sono: "6-8h", escoreA: 4, escoreB: 1 },
  { id: "P03", coletor: "Iara Reis", id_coleta: "K01", idade: 25, sexo: "Feminino", modalidade: "EAD", curso: "Engenharia de Produção", semestre: 1, turno: "Noturno", ocupacao: "Tempo integral", peso: 45, altura: 1.54, tela: "4-8h", deslocamento: "Transporte coletivo", sono: "<6h", escoreA: 0, escoreB: 0 },
  { id: "P04", coletor: "Iara Reis", id_coleta: "YS", idade: 21, sexo: "Feminino", modalidade: "Presencial", curso: "Enfermagem", semestre: 2, turno: "Noturno", ocupacao: "Tempo integral", peso: 74, altura: 1.71, tela: ">8h", deslocamento: "Transporte coletivo", sono: "<6h", escoreA: 4, escoreB: 1, obs: "ficha sem cabeçalho padrão (nome só no campo ID)" },
  { id: "P05", coletor: "Iara Reis", id_coleta: "IR02", idade: 27, sexo: "Feminino", modalidade: "Presencial", curso: "Odontologia", semestre: 2, turno: "Noturno", ocupacao: "Meio período", peso: 60, altura: 1.55, tela: "4-8h", deslocamento: "Transporte coletivo", sono: "6-8h", escoreA: 0, escoreB: 0 },
  { id: "P06", coletor: "Iara Reis", id_coleta: "IR01", idade: 62, sexo: "Masculino", modalidade: "EAD", curso: "Mecânica", semestre: 1, turno: "Noturno", ocupacao: "Tempo integral", peso: 83, altura: 1.82, tela: "4-8h", deslocamento: "Carro/Moto/Aplicativo", sono: "<6h", escoreA: 4, escoreB: 2 },
  { id: "P07", coletor: "Iara Reis", id_coleta: "IR03", idade: 25, sexo: "Masculino", modalidade: "Presencial", curso: "Direito", semestre: 7, turno: "Noturno", ocupacao: "Meio período", peso: 70, altura: 1.86, tela: "4-8h", deslocamento: "Carro/Moto/Aplicativo", sono: "6-8h", escoreA: 2, escoreB: 2 },
  { id: "P08", coletor: "Adriano Souza", id_coleta: "A51", idade: 18, sexo: "Masculino", modalidade: "Presencial", curso: "Engenharia Elétrica", semestre: 3, turno: "Noturno", ocupacao: "Tempo integral", peso: 90, altura: 1.86, tela: "4-8h", deslocamento: "Transporte coletivo", sono: "6-8h", escoreA: 0, escoreB: 1 },
  { id: "P09", coletor: "Adriano Souza", id_coleta: "A52", idade: 26, sexo: "Masculino", modalidade: "Presencial", curso: "Direito", semestre: 4, turno: "Noturno", ocupacao: "Tempo integral", peso: 64, altura: 1.76, tela: ">8h", deslocamento: "Transporte coletivo", sono: "6-8h", escoreA: 0, escoreB: 0 },
  { id: "P10", coletor: "Rian Almeida", id_coleta: "RN1", idade: 20, sexo: "Feminino", modalidade: "Presencial", curso: "Contabilidade", semestre: 6, turno: "Noturno", ocupacao: "Tempo integral", peso: 68, altura: 1.59, tela: ">8h", deslocamento: "Transporte coletivo", sono: "6-8h", escoreA: 0, escoreB: 0 },
  { id: "P11", coletor: "Rian Almeida", id_coleta: "RN2", idade: 19, sexo: "Feminino", modalidade: "Presencial", curso: "Fisioterapia", semestre: 4, turno: "Noturno", ocupacao: "Tempo integral", peso: 62, altura: 1.54, tela: ">8h", deslocamento: "Transporte coletivo", sono: "<6h", escoreA: 0, escoreB: 4 },
  { id: "P12", coletor: "Vitor Cunha", id_coleta: "RN3", idade: 27, sexo: "Feminino", modalidade: "Presencial", curso: "Nutrição", semestre: 3, turno: "Matutino", ocupacao: "Não trabalha", peso: 68, altura: 1.67, tela: "4-8h", deslocamento: "Transporte coletivo", sono: ">8h", escoreA: 4, escoreB: 4 },
  { id: "P13", coletor: "Larissa Souza", id_coleta: "LS-01", idade: 22, sexo: "Feminino", modalidade: "Presencial", curso: "Medicina Veterinária", semestre: 2, turno: "Noturno", ocupacao: "Tempo integral", peso: 65, altura: 1.60, tela: "4-8h", deslocamento: "Transporte coletivo", sono: "6-8h", escoreA: 0, escoreB: 0 },
  { id: "P14", coletor: "Larissa Souza", id_coleta: "LS9", idade: 19, sexo: "Feminino", modalidade: "Presencial", curso: "ADS", semestre: 4, turno: "Noturno", ocupacao: "Não trabalha", peso: 58, altura: 1.65, tela: "4-8h", deslocamento: "Transporte coletivo", sono: "6-8h", escoreA: 4, escoreB: 2 },
  { id: "P15", coletor: "Larissa Souza / Bianca Santos", id_coleta: "LS1", idade: 20, sexo: "Feminino", modalidade: "EAD", curso: "Gestão Financeira", semestre: 3, turno: "Noturno", ocupacao: "Tempo integral", peso: 58, altura: 1.67, tela: "4-8h", deslocamento: "Carro/Moto/Aplicativo", sono: ">8h", escoreA: 4, escoreB: 4 },
  { id: "P16", coletor: "Bianca Santos", id_coleta: "BS2", idade: 21, sexo: "Feminino", modalidade: "Presencial", curso: "Enfermagem", semestre: 6, turno: "Noturno", ocupacao: "Meio período", peso: 73, altura: 1.73, tela: "<4h", deslocamento: "Transporte coletivo", sono: "<6h", escoreA: 2, escoreB: 2 },
  { id: "P17", coletor: "Bianca Santos", id_coleta: "BS1", idade: 57, sexo: "Feminino", modalidade: "Presencial", curso: "Enfermagem", semestre: 2, turno: "Matutino", ocupacao: "Meio período", peso: 68, altura: 1.75, tela: "4-8h", deslocamento: "Transporte coletivo", sono: "6-8h", escoreA: 2, escoreB: 4, obs: "idade/curso/peso/altura/ID de coleta informados pelo grupo (ficha original ilegível nesses campos)" },
  { id: "P18", coletor: "Bianca Santos", id_coleta: "BS3", idade: 19, sexo: "Feminino", modalidade: "Presencial", curso: "Direito", semestre: 2, turno: "Noturno", ocupacao: "Não trabalha", peso: 64, altura: 1.62, tela: "<4h", deslocamento: "Transporte coletivo", sono: ">8h", escoreA: 4, escoreB: 1 },
  { id: "P19", coletor: "Ismael (provável — combina com o padrão do ID)", id_coleta: "IS01", idade: 34, sexo: "Feminino", modalidade: "Presencial", curso: "Odontologia", semestre: 2, turno: "Noturno", ocupacao: "Tempo integral", peso: 68, altura: 1.56, tela: "<4h", deslocamento: "Transporte coletivo", sono: "<6h", escoreA: 0, escoreB: 0, obs: "curso/turno/modalidade/deslocamento/semestre/ocupação e ID de coleta informados pelo grupo (não constavam legíveis na ficha física)" },
  { id: "P20", coletor: "Não identificado", id_coleta: null, idade: 26, sexo: "Feminino", modalidade: "Presencial", curso: "Engenharia Elétrica", semestre: 3, turno: "Noturno", ocupacao: "Tempo integral", peso: 61, altura: 1.63, tela: "<4h", deslocamento: "Transporte coletivo", sono: "<6h", escoreA: 0, escoreB: 0, obs: "modalidade/semestre informados pelo grupo; ID de coleta não tem como recuperar (é um código interno de quem coletou, não algo que a respondente saiba de cabeça) — não afeta nenhuma análise" },
  { id: "P21", coletor: "Não identificado", id_coleta: null, idade: 48, sexo: "Masculino", modalidade: "Presencial", curso: "Educação Física", semestre: 6, turno: "Noturno", ocupacao: "Tempo integral", peso: 80, altura: 1.83, tela: "<4h", deslocamento: "Carro/Moto/Aplicativo", sono: "<6h", escoreA: 4, escoreB: 2, obs: "modalidade/semestre/ocupação/tempo de tela informados pelo grupo; ID de coleta não tem como recuperar (código interno de quem coletou) — não afeta nenhuma análise" },
];

// Deriva escoreTotal, classificação e IMC a partir dos campos brutos —
// nunca hardcoded, sempre calculado (evita inconsistência entre os campos).
PEV_DATA.forEach((d) => {
  d.escoreTotal = d.escoreA + d.escoreB;
  d.classificacao = d.escoreTotal >= 4 ? "Suficientemente Ativo" : "Insuficientemente Ativo";
  d.imc = d.peso && d.altura ? +(d.peso / (d.altura * d.altura)).toFixed(1) : null;
});
