/**
 * Geração de horários livres CIENTE DA DURAÇÃO do serviço
 * -------------------------------------------------------
 * Contexto: um slot só pode ser oferecido se o serviço inteiro couber antes
 * do próximo agendamento e dentro do expediente. Ex.: às 10:30 um serviço de
 * 60 min (10:30–11:30) conflita com um evento às 11:00 — então NÃO é ofertado,
 * mesmo que "10:30" pareça livre num grid de 30 min.
 *
 * Entrada: eventos ocupados do dia + data + duração real do serviço.
 * Saída: lista de faixas livres agrupadas por período.
 *
 * Sem credenciais, sem dados de cliente — código genérico de exemplo.
 */
const SLOT_BASE_MIN = 30;                       // granularidade do grid
const EXPEDIENTE = { inicio: '09:00', fim: '20:00' };

const addMin = (d, m) => new Date(d.getTime() + m * 60000);
const hhmm = (d) => `${String(d.getUTCHours()).padStart(2, '0')}:${String(d.getUTCMinutes()).padStart(2, '0')}`;
const setHHMM = (base, s) => { const [h, m] = s.split(':').map(Number); const d = new Date(base); d.setUTCHours(h, m, 0, 0); return d; };

/**
 * @param {Array<{iniMs:number, fimMs:number}>} eventos  agendamentos existentes no dia
 * @param {Date} dataBase   00:00 do dia alvo
 * @param {number} duracaoMin  duração REAL do serviço (30, 60, 90, ...)
 * @param {Date|null} agora  para filtrar horários já passados (se for hoje)
 */
function gerarHorariosLivres(eventos, dataBase, duracaoMin, agora = null) {
  const inicioDia = setHHMM(dataBase, EXPEDIENTE.inicio);
  const fimDia = setHHMM(dataBase, EXPEDIENTE.fim);
  const mesmoDia = agora && dataBase.toISOString().slice(0, 10) === agora.toISOString().slice(0, 10);

  const livres = [];
  for (let t = new Date(inicioDia); ; t = addMin(t, SLOT_BASE_MIN)) {
    const fim = addMin(t, duracaoMin);
    if (fim > fimDia) break;                       // não estoura o expediente
    if (mesmoDia && t <= agora) continue;          // não oferece horário passado

    // conflita com algum evento? (sobreposição real considerando a duração)
    const conflito = eventos.some((e) => t.getTime() < e.fimMs && fim.getTime() > e.iniMs);
    if (!conflito) livres.push(`${hhmm(t)} às ${hhmm(fim)}`);
  }
  return livres;
}

// Exemplo:
// eventos = [{ iniMs: <11:00>, fimMs: <12:00> }]
// gerarHorariosLivres(eventos, dataBase, 60)  -> "10:30 às 11:30" NÃO aparece (conflito)
module.exports = { gerarHorariosLivres };
