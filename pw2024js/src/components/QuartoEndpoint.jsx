import { Bar, Doughnut } from "react-chartjs-2";
import { useState, useEffect } from "react";

async function quartoEndpointPost(chosenRegion, chosenYear) {
  try {
    let fetchRes = await fetch(
      "http://localhost:80/api/worksiteNumberByRegionAndYear",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify({ region: chosenRegion, year: chosenYear }),
      }
    );

    if (!fetchRes.ok) {
      throw new Error("Network response was not ok");
    }

    let data = await fetchRes.json();
    console.log(data);

    const listaProvincie = Object.keys(data["fibra"]["Terminati"]);

    const numFibraEsecuzione = Object.values(data["fibra"]["In esecuzione"]);
    const numFibraProgettazione = Object.values(
      data["fibra"]["In progettazione"]
    );
    const numFibraTerminati = Object.values(data["fibra"]["Terminati"]);
    const anniFibra = Object.keys(data["fibra"]["Totale"]);
    const totaliFibra = Object.values(data["fibra"]["Totale"]);

    const numFwaEsecuzione = Object.values(data["fwa"]["In esecuzione"]);
    const numFwaProgettazione = Object.values(data["fwa"]["In progettazione"]);
    const numFwaTerminati = Object.values(data["fwa"]["Terminati"]);
    const anniFwa = Object.keys(data["fwa"]["Totale"]);
    const totaliFwa = Object.values(data["fwa"]["Totale"]);

    return {
      listaProvincie,
      numFibraEsecuzione,
      numFibraProgettazione,
      numFibraTerminati,
      anniFibra,
      totaliFibra,
      numFwaEsecuzione,
      numFwaProgettazione,
      numFwaTerminati,
      anniFwa,
      totaliFwa,
    };
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

export default function QuartoEndpoint() {
  const [selectedYear, setSelectedYear] = useState("Tutti gli anni");
  const [selectedRegion, setSelectedRegion] = useState("Lombardia");
  const [chartData, setChartData] = useState(null);
  const [numeroChart, setNumeroChart] = useState("due");
  const [mostraFibra, setMostraFibra] = useState(true);
  const [mostraFwa, setMostraFwa] = useState(true);
  const [chartType, setChartType] = useState("A torta");

  useEffect(() => {
    //Definisci la funzione fetchData
    async function fetchData() {
      const data = await quartoEndpointPost(selectedRegion, selectedYear);
      setChartData(data);
    }
    fetchData();
  }, [selectedRegion, selectedYear]);

  let valoriChartFibra = {};
  let valoriChartFwa = {};

  valoriChartFibra = {
    labels: chartData ? chartData.listaProvincie : [],
    datasets: [
      {
        label: "In esecuzione",
        backgroundColor: "rgba(25, 174, 104, 1)",
        borderColor: "rgba(25, 174, 104, 1)",
        data: chartData ? chartData.numFibraEsecuzione : [],
      },
      {
        label: "In progettazione",
        backgroundColor: "rgba(39, 105, 68, 1)",
        borderColor: "rgba(39, 105, 68, 1)",
        data: chartData ? chartData.numFibraProgettazione : [],
      },
      {
        label: "Terminati",
        backgroundColor: "rgba(81, 212, 139, 1)",
        borderColor: "rgba(81, 212, 139, 1)",
        data: chartData ? chartData.numFibraTerminati : [],
      },
    ],
  };

  const valoriDonutChartFibra = {
    labels: chartData ? chartData.anniFibra : [],
    datasets: [
      {
        data: chartData ? chartData.totaliFibra : [],
        backgroundColor: [
          "rgba(13, 94, 56, 1)",
          "rgba(9, 63, 37, 1)",
          "rgba(48, 182, 119, 1)",
          "rgba(4, 31, 18, 1)",
          "rgba(117, 206, 164, 1)",
          "rgba(2, 15, 9, 1)",
        ],
        borderColor: ["rgba(255, 255, 255, 0)"],
      },
    ],
  };

  valoriChartFwa = {
    labels: chartData ? chartData.listaProvincie : [],
    datasets: [
      {
        label: "In esecuzione",
        backgroundColor: "rgba(132, 87, 255, 1)",
        borderColor: "rgba(132, 87, 255, 1)",
        data: chartData ? chartData.numFwaEsecuzione : [],
      },
      {
        label: "In progettazione",
        backgroundColor: "rgba(85, 61, 161, 1)",
        borderColor: "rgba(85, 61, 161, 1)",
        data: chartData ? chartData.numFwaProgettazione : [],
      },
      {
        label: "Terminati",
        backgroundColor: "rgba(159, 125, 255, 1)",
        borderColor: "rgba(159, 125, 255, 1)",
        data: chartData ? chartData.numFwaTerminati : [],
      },
    ],
  };

  const valoriDonutChartFwa = {
    labels: chartData ? chartData.anniFwa : [],
    datasets: [
      {
        data: chartData ? chartData.totaliFwa : [],
        backgroundColor: [
          "rgba(102, 57, 225, 1)",
          "rgba(62, 17, 185, 1)",
          "rgba(192, 147, 255, 1)",
          "rgba(72, 27, 195, 1)",
          "rgba(152, 107, 255, 1)",
          "rgba(212, 167, 255, 1)",
        ],
        borderColor: ["rgba(255, 255, 255, 0)"],
      },
    ],
  };

  return (
    <div className="endpoint-body">
      <p className="heading">
        Endpoint 4 - Numero di cantieri per regione e anno
      </p>
      <p className="subheading">
        L'endpoint restituisce il numero di cantieri terminati, in progettazione
        e in esecuzione divisi per capoluogo. Il risultato può essere filtrato
        in base alla regione e in base all'anno. Viene mostrato anche il numero
        totale di cantieri in tutta Italia per ogni anno.
      </p>
      <div className="action-bar">
        <div className="combobox-container">
          <div className="label-and-combobox">
            <p className="label">Seleziona un anno:</p>
            <select
              className="custom-select"
              name=""
              id=""
              defaultValue={selectedYear}
              onChange={(e) => {
                setSelectedYear(e.target.value);
              }}
            >
              <option value="Tutti gli anni">Tutti gli anni</option>
              <option value="2019">2019</option>
              <option value="2020">2020</option>
              <option value="2021">2021</option>
              <option value="2022">2022</option>
              <option value="2023">2023</option>
            </select>
          </div>
          <div className="label-and-combobox">
            <p className="label">Selezione una regione:</p>
            <select
              className="custom-select"
              name=""
              id=""
              defaultValue={selectedRegion}
              onChange={(e) => {
                setSelectedRegion(e.target.value);
              }}
            >
              <option value="Abruzzo">Abruzzo</option>
              <option value="Basilicata">Basilicata</option>
              <option value="Calabria">Calabria</option>
              <option value="Campania">Campania</option>
              <option value="Emilia Romagna">Emilia Romagna</option>
              <option value="Friuli Venezia Giulia">
                Friuli Venezia Giulia
              </option>
              <option value="Lazio">Lazio</option>
              <option value="Liguria">Liguria</option>
              <option value="Lombardia">Lombardia</option>
              <option value="Marche">Marche</option>
              <option value="Molise">Molise</option>
              <option value="Piemonte">Piemonte</option>
              <option value="Puglia">Puglia</option>
              <option value="Sardegna">Sardegna</option>
              <option value="Sicilia">Sicilia</option>
              <option value="Toscana">Toscana</option>
              <option value="Trentino Alto Adige-Trento">
                Trentino Alto Adige
              </option>
              <option value="Umbria">Umbria</option>
              <option value="Valle d'Aosta">Valle d'Aosta</option>
              <option value="Veneto">Veneto</option>
            </select>
          </div>
        </div>
        <div className="label-and-radio-field">
          <p className="label">Visualizza:</p>
          <div className="radio-choices">
            <input
              type="radio"
              id="entrambe"
              name="visualizza"
              value="entrambe"
              defaultChecked={true}
              onChange={() => {
                setNumeroChart("due");
                setMostraFibra(true);
                setMostraFwa(true);
              }}
            />
            <label className="radio-label" for="entrambe">
              Entrambe
            </label>
            <input
              type="radio"
              id="solofibra"
              name="visualizza"
              value="solofibra"
              onChange={() => {
                setNumeroChart("uno");
                setMostraFibra(true);
                setMostraFwa(false);
              }}
            />
            <label className="radio-label" for="solofibra">
              Solo Fibra
            </label>
            <input
              type="radio"
              id="solofwa"
              name="visualizza"
              value="solofwa"
              onChange={() => {
                setNumeroChart("uno");
                setMostraFibra(false);
                setMostraFwa(true);
              }}
            />
            <label className="radio-label" for="solofwa">
              Solo FWA
            </label>
          </div>
        </div>
      </div>
      {numeroChart === "due" && (
        <div className="two-chart-container">
          {mostraFibra && (
            <div className="chart-card">
              <Bar
                options={{
                  indexAxis: "y",
                  plugins: {
                    title: {
                      display: true,
                      text: "Cantieri Fibra " + selectedRegion,
                      color: "rgba(238, 238, 238, 1)",
                    },
                    legend: {
                      labels: {
                        color: "rgba(180, 180, 180, 1)",
                      },
                    },
                  },
                }}
                data={valoriChartFibra}
              />
            </div>
          )}
          {mostraFwa && (
            <div className="chart-card">
              <Bar
                options={{
                  indexAxis: "y",
                  plugins: {
                    title: {
                      display: true,
                      text: "Cantieri FWA " + selectedRegion,
                      color: "rgba(238, 238, 238, 1)",
                    },
                    legend: {
                      labels: {
                        color: "rgba(180, 180, 180, 1)",
                      },
                    },
                  },
                }}
                data={valoriChartFwa}
              />
            </div>
          )}
        </div>
      )}
      {numeroChart !== "due" && (
        <div className="one-chart-container">
          {mostraFibra && (
            <div className="chart-card">
              <Bar
                options={{
                  indexAxis: "y",
                  plugins: {
                    title: {
                      display: true,
                      text: "Cantieri Fibra " + selectedRegion,
                      color: "rgba(238, 238, 238, 1)",
                    },
                    legend: {
                      labels: {
                        color: "rgba(180, 180, 180, 1)",
                      },
                    },
                  },
                }}
                data={valoriChartFibra}
              />
            </div>
          )}
          {mostraFwa && (
            <div className="chart-card">
              <Bar
                options={{
                  indexAxis: "y",
                  plugins: {
                    title: {
                      display: true,
                      text: "Cantieri FWA " + selectedRegion,
                      color: "rgba(238, 238, 238, 1)",
                    },
                    legend: {
                      labels: {
                        color: "rgba(180, 180, 180, 1)",
                      },
                    },
                  },
                }}
                data={valoriChartFwa}
              />
            </div>
          )}
        </div>
      )}
      <hr style={{ marginTop: 32 }}></hr>
      {numeroChart === "due" && (
        <div className="two-chart-container">
          {mostraFibra && (
            <div className="chart-card">
              <Doughnut
                options={{
                  plugins: {
                    title: {
                      display: true,
                      text: "Totale cantieri Fibra - " + selectedRegion,
                      color: "rgba(238, 238, 238, 1)",
                    },
                    legend: {
                      labels: {
                        color: "rgba(180, 180, 180, 1)",
                      },
                    },
                  },
                }}
                data={valoriDonutChartFibra}
              />
            </div>
          )}
          {mostraFwa && (
            <div className="chart-card">
              <Doughnut
                options={{
                  plugins: {
                    title: {
                      display: true,
                      text: "Totale cantieri Fwa - " + selectedRegion,
                      color: "rgba(238, 238, 238, 1)",
                    },
                    legend: {
                      labels: {
                        color: "rgba(180, 180, 180, 1)",
                      },
                    },
                  },
                }}
                data={valoriDonutChartFwa}
              />
            </div>
          )}
        </div>
      )}
      {numeroChart !== "due" && (
        <div className="one-chart-container">
          {mostraFibra && (
            <div className="chart-card">
              <Doughnut
                options={{
                  plugins: {
                    title: {
                      display: true,
                      text: "Totale cantieri Fibra - " + selectedRegion,
                      color: "rgba(238, 238, 238, 1)",
                    },
                    legend: {
                      labels: {
                        color: "rgba(180, 180, 180, 1)",
                      },
                    },
                  },
                }}
                data={valoriDonutChartFibra}
              />
            </div>
          )}
          {mostraFwa && (
            <div className="chart-card">
              <Doughnut
                options={{
                  plugins: {
                    title: {
                      display: true,
                      text: "Totale cantieri Fwa - " + selectedRegion,
                      color: "rgba(238, 238, 238, 1)",
                    },
                    legend: {
                      labels: {
                        color: "rgba(180, 180, 180, 1)",
                      },
                    },
                  },
                }}
                data={valoriDonutChartFwa}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
