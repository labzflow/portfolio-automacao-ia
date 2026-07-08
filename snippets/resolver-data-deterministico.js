/**
 * Resolvedor de data determinístico (fuso America/Sao_Paulo)
 * -----------------------------------------------------------
 * Contexto: LLMs erram cálculo de data ("hoje", "amanhã", "sábado que vem").
 * Em vez de deixar o modelo calcular, ele só informa a REFERÊNCIA e o código
 * resolve a data exata (AAAA-MM-DD). Isso remove uma classe inteira de erro.
 *
 * Entrada (JSON): { referencia, dia_semana?, dia?, mes?, ano? }
 *   referencia: hoje | amanha | depois_amanha | dia_semana |
 *               semana_que_vem | mes_que_vem | ano_que_vem | data_especifica
 * Saída (JSON): { data, dia_semana, domingo, hoje, aviso }
 *
 * Sem credenciais, sem dados de cliente — código genérico de exemplo.
 */
function resolverData(input, agora = new Date()) {
  const tz = 'America/Sao_Paulo';
  const ymd = new Intl.DateTimeFormat('en-CA', { timeZone: tz }).format(agora);
  const [Y, M, D] = ymd.split('-').map(Number);
  const base = new Date(Date.UTC(Y, M - 1, D)); // "hoje" no fuso local

  const FMT = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira',
               'quinta-feira', 'sexta-feira', 'sábado'];
  const KEY = ['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'];
  const iso = (d) => d.toISOString().slice(0, 10);
  const addDays = (d, n) => { const x = new Date(d); x.setUTCDate(x.getUTCDate() + n); return x; };
  const norm = (s) => (s == null ? '' : String(s))
    .toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim();

  const ref = norm(input.referencia);
  let target = null;

  if (ref === 'hoje') target = base;
  else if (ref === 'amanha') target = addDays(base, 1);
  else if (ref === 'depois_amanha') target = addDays(base, 2);
  else if (ref === 'dia_semana' || ref === 'semana_que_vem') {
    const alvo = KEY.indexOf(norm(input.dia_semana));
    if (alvo < 0) return { erro: 'informe dia_semana' };
    const hd = base.getUTCDay();
    if (ref === 'dia_semana') {
      let dl = (alvo - hd + 7) % 7; if (dl === 0) dl = 7; // próxima ocorrência
      target = addDays(base, dl);
    } else {
      const ih = hd === 0 ? 7 : hd;
      const ateSegunda = ((8 - ih) % 7) || 7;
      const proxSegunda = addDays(base, ateSegunda);
      const ai = alvo === 0 ? 7 : alvo;
      target = addDays(proxSegunda, ai - 1); // dia na semana civil seguinte
    }
  }
  else if (ref === 'mes_que_vem') {
    const dia = Number(input.dia);
    if (!dia) return { precisa: 'dia' };
    const ult = new Date(Date.UTC(Y, M + 1, 0)).getUTCDate();
    target = new Date(Date.UTC(Y, M, Math.min(dia, ult)));
  }
  else if (ref === 'data_especifica') {
    const dia = Number(input.dia);
    const mes = input.mes ? Number(input.mes) : null;
    if (!dia) return { erro: 'informe dia' };
    if (mes) {
      let yy = Y;
      if (new Date(Date.UTC(yy, mes - 1, Math.min(dia, 28))) < base) yy = Y + 1;
      const ult = new Date(Date.UTC(yy, mes, 0)).getUTCDate();
      target = new Date(Date.UTC(yy, mes - 1, Math.min(dia, ult)));
    } else {
      let mm = M - 1, yy = Y;
      if (dia <= D) { mm = M; if (mm > 11) { mm = 0; yy = Y + 1; } }
      const ult = new Date(Date.UTC(yy, mm + 1, 0)).getUTCDate();
      target = new Date(Date.UTC(yy, mm, Math.min(dia, ult)));
    }
  }
  else return { erro: 'referencia desconhecida' };

  const dow = target.getUTCDay();
  let aviso = '';
  if (iso(target) < ymd) aviso = 'data no passado';          // guard determinístico
  if (dow === 0) aviso = (aviso ? aviso + '; ' : '') + 'domingo: fechado';

  return { data: iso(target), dia_semana: FMT[dow], domingo: dow === 0, hoje: ymd, aviso };
}

// Exemplos:
// resolverData({ referencia: 'hoje' })
// resolverData({ referencia: 'dia_semana', dia_semana: 'sabado' })
// resolverData({ referencia: 'mes_que_vem', dia: 15 })
module.exports = { resolverData };
