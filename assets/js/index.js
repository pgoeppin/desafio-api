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
/* FUNCION PARA OBTENER INFORMACION PARA LOS GRAFICOS */
async function getGraphData(url) {
    const request = await fetch(url);
    const data = await request.json();
    return data;
}
/* FUNCION PARA LA CONFIGURACION DE LOS GRAFICOS */
function configGrafica(monedas) {
const graphicType = "line";
const fechasMoneda = monedas.serie.map((moneda) => new Date(moneda.fecha).toDateString());
const titulo = monedas.nombre;
const lineColor = "red";
const valores = monedas.serie.map((moneda) => moneda.valor);
const config = {
  type: graphicType,
  data: {
    labels: fechasMoneda,
    datasets: [
      {
        label: titulo,
        backgroundColor: lineColor,
        borderColor: "rgb(255, 99, 132)",
        color: "white",
        data: valores,
      },
    ],
  },
  options: {
    plugins: {
        legend: {
            labels: {
                color: 'white',
            }
    },
    },
    scales: {
        x: {
            grid: {
                display: false,
                borderColor: 'white',
            },
            ticks: {
                color:'white',
            }
        },
        y: {
            grid: {
                borderColor: 'white',
            },
            ticks: {
                color: 'white',
            }
        }
    }
  }
};
return config;
}
/* DEFINIMOS LA VARIABLE CHART COMO NULA*/
let chart;
/* FUNCION PARA RENDERIZAR EL GRAFICO */
async function renderGrafica() {
const apiUrlGraph = apiURL + currencyType.value;
const currency = await getGraphData(apiUrlGraph);
const configChart = configGrafica(currency);
const chartDOM = document.getElementById("myGraph");
graph.setAttribute("style","background-color: #3a3a49da;");
if (chart) {
    chart.destroy()
}
chart = new Chart(chartDOM, configChart);
}
/* EVENTO DE CAMBIO DE TIPO DE MONEDA PARA LOS DISTINTOS GRAFICOS */
currencyType.addEventListener("change", async () => {
    renderGrafica()    
});