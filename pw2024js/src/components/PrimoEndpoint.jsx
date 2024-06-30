import { Bar } from "react-chartjs-2";
import { useState, useEffect } from "react";

async function primoEndpointGet() {
  try {
    let fetchRes = await fetch("http://localhost:80/api/worksiteStatusByYear");

    if (!fetchRes.ok) {
      throw new Error("Network response was not ok");
    }
    let data = await fetchRes.json();

    //Dati relativi alla FIBRA - ANNI asse Y, NUMERO CANTIERI asse X
    const anniFibra = Object.keys(data["fibra"]["In esecuzione"]);
    const numFibraEsecuzione = Object.values(data["fibra"]["In esecuzione"]);
    const numFibraProgettazione = Object.values(
      data["fibra"]["In progettazione"]
    );
    const numFibraTerminati = Object.values(data["fibra"]["Terminati"]);

    //Dati relativi alla FWA - ANNI asse Y, NUMERO CANTIERI asse X
    const anniFwa = Object.keys(data["fwa"]["In esecuzione"]);
    const numFwaEsecuzione = Object.values(data["fwa"]["In esecuzione"]);
    const numFwaProgettazione = Object.values(data["fwa"]["In progettazione"]);
    const numFwaTerminati = Object.values(data["fwa"]["Terminati"]);

    return {
      anniFibra,
      numFibraEsecuzione,
      numFibraProgettazione,
      numFibraTerminati,
      anniFwa,
      numFwaEsecuzione,
      numFwaProgettazione,
      numFwaTerminati,
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

async function primoEndpointPost(chosenYear) {
  try {
    let fetchRes = await fetch("http://localhost:80/api/worksiteStatusByYear", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify({ year: chosenYear }),
    });

    if (!fetchRes.ok) {
      throw new Error("Network response was not ok");
    }

    let data = await fetchRes.json();

    const tipoCantieriFibra = Object.keys(data["fibra"]);
    const numeroCantieriFibra = Object.values(data["fibra"]);

    const tipoCantieriFwa = Object.keys(data["fwa"]);
    const numeroCantieriFwa = Object.values(data["fwa"]);

    return {
      tipoCantieriFibra,
      numeroCantieriFibra,
      tipoCantieriFwa,
      numeroCantieriFwa,
    };
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

export default function PrimoEndpoint() {
  const [selectedYear, setSelectedYear] = useState("Tutti gli anni");
  const [chartData, setChartData] = useState(null);
  const [numeroChart, setNumeroChart] = useState("due");
  const [mostraFibra, setMostraFibra] = useState(true);
  const [mostraFwa, setMostraFwa] = useState(true);

  useEffect(() => {
    //Definisci la funzione fetchData - viene chiamata ogni volta che selectedYear cambia
    //Se la scelta è "Tutti gli anni" chiami l'endpoint in GET, altrimenti in POST
    async function fetchData() {
      if (selectedYear === "Tutti gli anni") {
        const data = await primoEndpointGet();
        setChartData(data);
      } else {
        const data = await primoEndpointPost(selectedYear);
        setChartData(data);
      }
    }
    fetchData();
  }, [selectedYear]);

  let valoriChartFibra = {};
  let valoriChartFwa = {};

  if (selectedYear === "Tutti gli anni") {
    valoriChartFibra = {
      labels: chartData ? chartData.anniFibra : [],
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

    valoriChartFwa = {
      labels: chartData ? chartData.anniFwa : [],
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
  } else {
    valoriChartFibra = {
      labels: chartData ? chartData.tipoCantieriFibra : [],
      datasets: [
        {
          label: "Numero lavori",
          backgroundColor: "rgba(25, 174, 104, 1)",
          borderColor: "rgba(25, 174, 104, 1)",
          data: chartData ? chartData.numeroCantieriFibra : [],
        },
      ],
    };
    valoriChartFwa = {
      labels: chartData ? chartData.tipoCantieriFwa : [],
      datasets: [
        {
          label: "Numero lavori",
          backgroundColor: "rgba(132, 87, 255, 1)",
          borderColor: "rgba(132, 87, 255, 1)",
          data: chartData ? chartData.numeroCantieriFwa : [],
        },
      ],
    };
  }

  return (
    <div className="endpoint-body">
      <p className="heading">Endpoint 1 - Stato cantieri per anno</p>
      <p className="subheading">
        L'endpoint restituisce il numero totale di cantieri in esecuzione, in
        progettazione e terminati. Il risultato può essere filtrato in base ad
        un anno specifico, altrimenti viene visualizzato il numero di cantieri
        per tutti gli anni presenti nel dataset.
      </p>
      <div className="action-bar">
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
            <option value="2018">2018</option>
            <option value="2019">2019</option>
            <option value="2020">2020</option>
            <option value="2021">2021</option>
            <option value="2022">2022</option>
            <option value="2023">2023</option>
          </select>
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
                  plugins: {
                    title: {
                      display: true,
                      text: "Cantieri Fibra",
                      color: "rgba(238, 238, 238, 1)",
                    },
                    legend: {
                      labels: {
                        color: "rgba(180, 180, 180, 1)",
                      },
                    },
                  },
                  scales: {
                    x: {
                      ticks: {
                        color: "rgba(238, 238, 238, 1)",
                      },
                      grid: {
                        color: "rgba(58, 58, 58, 1)",
                      },
                    },
                    y: {
                      ticks: {
                        color: "rgba(238, 238, 238, 1)",
                      },
                      grid: {
                        color: "rgba(58, 58, 58, 1)",
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
                  plugins: {
                    title: {
                      display: true,
                      text: "Cantieri FWA",
                      color: "rgba(238, 238, 238, 1)",
                    },
                    legend: {
                      labels: {
                        color: "rgba(180, 180, 180, 1)",
                      },
                    },
                  },
                  scales: {
                    x: {
                      ticks: {
                        color: "rgba(238, 238, 238, 1)",
                      },
                      grid: {
                        color: "rgba(58, 58, 58, 1)",
                      },
                    },
                    y: {
                      ticks: {
                        color: "rgba(238, 238, 238, 1)",
                      },
                      grid: {
                        color: "rgba(58, 58, 58, 1)",
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
                  plugins: {
                    title: {
                      display: true,
                      text: "Cantieri Fibra",
                      color: "rgba(238, 238, 238, 1)",
                    },
                    legend: {
                      labels: {
                        color: "rgba(180, 180, 180, 1)",
                      },
                    },
                  },
                  scales: {
                    x: {
                      ticks: {
                        color: "rgba(238, 238, 238, 1)",
                      },
                      grid: {
                        color: "rgba(58, 58, 58, 1)",
                      },
                    },
                    y: {
                      ticks: {
                        color: "rgba(238, 238, 238, 1)",
                      },
                      grid: {
                        color: "rgba(58, 58, 58, 1)",
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
                  plugins: {
                    title: {
                      display: true,
                      text: "Cantieri FWA",
                      color: "rgba(238, 238, 238, 1)",
                    },
                    legend: {
                      labels: {
                        color: "rgba(180, 180, 180, 1)",
                      },
                    },
                  },
                  scales: {
                    x: {
                      ticks: {
                        color: "rgba(238, 238, 238, 1)",
                      },
                      grid: {
                        color: "rgba(58, 58, 58, 1)",
                      },
                    },
                    y: {
                      ticks: {
                        color: "rgba(238, 238, 238, 1)",
                      },
                      grid: {
                        color: "rgba(58, 58, 58, 1)",
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
    </div>
  );
}
