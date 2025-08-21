/***** AJUSTES BÁSICOS *****/
const SHEET_NAME = 'Disney_Premium'; // tu hoja
const COL_ALERTA = 1;                // A
const COL_DIAS   = 10;               // J
const FIRST_DATA_ROW = 4;            // primera fila con datos reales

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Pagos')
    .addItem('Reinstalar reglas de Alertas', 'reinstalarReglasAlertas')
    .addItem('Limpiar reglas sueltas (Alertas)', 'limpiarReglasSueltasAlertas')
    .addItem('Reparar alertas (toda la hoja)', 'repararAlertasHoja')
    .addToUi();
}

function onEdit(e) {
  try {
    if (!e || !e.range) return;
    const sh = e.range.getSheet();
    if (!sh || sh.getName() !== SHEET_NAME) return;

    // Filas afectadas por el pegado/movido
    const start = Math.max(e.range.getRow(), FIRST_DATA_ROW);
    const end   = Math.max(e.range.getLastRow(), FIRST_DATA_ROW);

    // 0) Si se rompieron las reglas globales en A, reinstálalas
    if (!tieneReglasGlobalesAlertas_(sh)) {
      reinstalarReglasAlertas(sh);
    }

    // 1) Borra formato DIRECTO en A (evita que quede verde/rojo fijo al pegar filas completas)
    sh.getRange(start, COL_ALERTA, end - start + 1, 1)
      .setBackground(null)
      .setFontColor(null)
      .setFontWeight('normal');

    // 2) Elimina cualquier regla NOT_BLANK pegada en A (aunque sea A11:A200)
    limpiarReglasSueltasAlertas(sh);

    // 3) Recolorea A según J por si el formato condicional aún no aplicó
    for (let r = start; r <= end; r++) {
      corregirAlertaFila_(sh, r);
    }
  } catch (err) {
    console.error(err);
  }
}

/** Reinstala SIEMPRE las 3 reglas globales sobre A4:A (rojo J<0; amarillo J=0; verde J>0) */
function reinstalarReglasAlertas(sh) {
  if (!sh) sh = SpreadsheetApp.getActive().getSheetByName(SHEET_NAME);
  if (!sh) return;

  // Rango largo para cubrir nuevas filas
  const last = Math.max(sh.getMaxRows(), sh.getLastRow() + 200);
  const rangoA = sh.getRange(FIRST_DATA_ROW, COL_ALERTA, last - FIRST_DATA_ROW + 1, 1);

  const ruleRed = SpreadsheetApp.newConditionalFormatRule()
    .whenFormulaSatisfied(`=$J${FIRST_DATA_ROW}<0`)
    .setBackground('#f8d7da').setBold(true).setRanges([rangoA]).build();

  const ruleYellow = SpreadsheetApp.newConditionalFormatRule()
    .whenFormulaSatisfied(`=$J${FIRST_DATA_ROW}=0`)
    .setBackground('#fff3cd').setBold(true).setRanges([rangoA]).build();

  const ruleGreen = SpreadsheetApp.newConditionalFormatRule()
    .whenFormulaSatisfied(`=$J${FIRST_DATA_ROW}>0`)
    .setBackground('#d7f0db').setBold(true).setRanges([rangoA]).build();

  // Conserva reglas que NO toquen la col A; reemplaza las de A
  const old = sh.getConditionalFormatRules();
  const keep = old.filter(r => !r.getRanges().some(rr => rr.getColumn() === COL_ALERTA));
  sh.setConditionalFormatRules([...keep, ruleRed, ruleYellow, ruleGreen]);

  SpreadsheetApp.getActive().toast('Reglas de Alertas reinstaladas ✔');
}

/** Comprueba si hay al menos una regla condicional que afecte la columna A desde FIRST_DATA_ROW */
function tieneReglasGlobalesAlertas_(sh) {
  const rules = sh.getConditionalFormatRules();
  return rules.some(rule =>
    rule.getRanges().some(rr =>
      rr.getColumn() === COL_ALERTA &&
      rr.getNumColumns() === 1 &&
      rr.getRow() <= FIRST_DATA_ROW &&
      (rr.getRow() + rr.getNumRows() - 1) >= FIRST_DATA_ROW
    )
  );
}

/** Elimina cualquier regla condicional NOT_BLANK aplicada solo a la col A (datos), de uno o muchos rows */
function limpiarReglasSueltasAlertas(sh) {
  if (!sh) sh = SpreadsheetApp.getActive().getSheetByName(SHEET_NAME);
  if (!sh) return;

  const rules = sh.getConditionalFormatRules();
  const kept = [];

  for (const rule of rules) {
    const bc = rule.getBooleanCondition && rule.getBooleanCondition();
    const isNotBlank = bc && bc.getType && bc.getType().toString() === 'NOT_BLANK';

    // ¿Todos los rangos de esta regla están SOLO en col A (desde FIRST_DATA_ROW) y ancho 1?
    let onlyColAData = true;
    for (const r of rule.getRanges()) {
      if (!(r.getColumn() === COL_ALERTA && r.getNumColumns() === 1 && r.getRow() >= FIRST_DATA_ROW)) {
        onlyColAData = false; break;
      }
    }

    // Si es “No está vacío” y solo afecta tramos de la col A → eliminar
    if (isNotBlank && onlyColAData) continue;

    kept.push(rule);
  }

  if (kept.length !== rules.length) sh.setConditionalFormatRules(kept);
}

/** Repara TODA la hoja (uso manual si pegaste muchas filas) */
function repararAlertasHoja() {
  const sh = SpreadsheetApp.getActive().getSheetByName(SHEET_NAME);
  if (!sh) return;
  if (!tieneReglasGlobalesAlertas_(sh)) reinstalarReglasAlertas(sh);
  limpiarReglasSueltasAlertas(sh);
  const last = sh.getLastRow();
  for (let r = FIRST_DATA_ROW; r <= last; r++) corregirAlertaFila_(sh, r);
  SpreadsheetApp.getActive().toast('Alertas reparadas ✔');
}

/** Re-sincroniza el color de A leyendo J (NO toca tu fórmula en A) */
function corregirAlertaFila_(sh, row) {
  const cA = sh.getRange(row, COL_ALERTA);
  const vJ = sh.getRange(row, COL_DIAS).getValue();

  if (vJ === '' || vJ === null) {
    cA.setBackground(null).setFontColor(null).setFontWeight('normal');
    return;
  }
  const dias = Number(vJ);
  if (isNaN(dias)) { cA.setBackground('#fce8b2'); return; } // aviso suave

  if (dias < 0)      cA.setBackground('#f8d7da').setFontColor('#000000'); // rojo
  else if (dias==0)  cA.setBackground('#fff3cd').setFontColor('#000000'); // amarillo
  else               cA.setBackground('#d7f0db').setFontColor('#000000'); // verde
}
