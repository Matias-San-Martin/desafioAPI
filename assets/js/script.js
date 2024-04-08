const inputMonedas = document.getElementById("inputMonedas").value;
const selectorMoneda = document.getElementById("selectorMoneda");
const buttonConvertirMoneda = document.getElementById("convertirMoneda");
const cotizacionMoneda = document.getElementById("cotizacionMoneda");
const conversionMoneda = document.getElementById("conversionMoneda");
const graficoMoneda = document.querySelector(".graficoMoneda");
const apiURL = "https://mindicador.cl/api";
let myChart = null;

const formatDate = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    return `${day} / ${month} / ${year}`
}

async function buscarValor() {
  try {
    const cantidad = inputMonedas.value;
    const moneda = selectorMoneda.value;
    const fetching = await fetch(`${apiURL}/${moneda}`);
    const data = await fetching.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}

function renderGrafico(data) {
  console.log(data);
  const config = {
    type: "line",
    data: {
      labels: data.map((elem) => formatDate(new Date(elem.fecha))),
      datasets: [
        {
          label: "Ultimos 10 dias",
          backgroundColor: "red",
          data: data.map((elem) => elem.valor),
        },
      ],
    },
  };

  if (myChart) {
    myChart.destroy();
  }
  myChart = new Chart(graficoMoneda, config);
}

buttonConvertirMoneda.addEventListener("click", async () => {
  const result = await buscarValor();
  const serie = result.serie;
  const lastValue = serie[0].valor;
  const monedaConvertida = inputMonedas * (1 / lastValue);
  cotizacionMoneda.innerHTML = `
    La cotizacion del dia es: $ ${lastValue} <br> 
    La conversion al valor del dia es: <br> $ ${monedaConvertida}
    `;
  const data = serie.slice(0, 10).reverse();
  renderGrafico(data);
});

