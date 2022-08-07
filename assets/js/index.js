/* DECLARACION DE VARIABLES */
const apiURL = "https://mindicador.cl/api/";
const inputAmount = document.querySelector("#amount");
const currencyType = document.querySelector("#currency-type");
const btn = document.querySelector("button");
const result = document.querySelector("#result");
const graph = document.querySelector(".graph")
/* FUNCION FETCH CON TRY Y CATCH */
async function getIndicators() {
  let html = "";
  try {
    const res = await fetch(apiURL);
    const indicators = await res.json();
    console.log(indicators)
    return indicators;
  } catch (error) {
    html = `¡Algo salió mal! Error: ${error.message}`;
    result.innerHTML = html;
  }
}
/* FUNCION RENDERIZAR EL CALCULO DEL TIPO DE CAMBIO DE LA CANTIDAD INGRESADA */
async function renderExchange() {
  const indicators = await getIndicators();
  const amountValue = Number(inputAmount.value);
  inputAmount.value = "";
  const currency = indicators[currencyType.value];
  if (currencyType.value == currency.codigo) {
    const exchangeValue = parseFloat(
      amountValue / currency.valor
    ).toFixed(2);
    let html = "";
    html = `Resultado:  $${exchangeValue}`;
    result.innerHTML = html;
    return exchangeValue;
  } else {
    alert("Ese codigo de moneda no existe");
  }
}
/* EVENTO CLICK DE BOTON PARA EJECUTAR LA FUNCION DE CALCULO*/
btn.addEventListener("click", () => {
  if (Number(inputAmount.value) > 0 && currencyType.value != '') {
    renderExchange();
  } else {
    alert("Ingrese una cantidad que mayor a 0 y elija una moneda.");
    inputAmount.value = "";
  }
});