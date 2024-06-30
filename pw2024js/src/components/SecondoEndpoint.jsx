import { Bar, Pie } from "react-chartjs-2";
import { useState, useEffect } from "react";

async function secondoEndpointPost(chosenType) {
  try {
    let fetchRes = await fetch("http://localhost:80/api/worksiteNumberByType", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify({ choice: chosenType }),
    });

    if (!fetchRes.ok) {
      throw new Error("Network response was not ok");
    }

    let data = await fetchRes.json();

    const listaRegioni = Object.keys(data["Fibra"]);
    const numeroCantieriFibra = Object.values(data["Fibra"]);
    const numeroCantieriFwa = Object.values(data["FWA"]);

    return {
      listaRegioni,
      numeroCantieriFibra,
      numeroCantieriFwa,
    };
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

export default function SecondoEndpoint() {
  const [selectedType, setSelectedType] = useState("Numero lavori");
  const [chartData, setChartData] = useState(null);
  const [numeroChart, setNumeroChart] = useState("due");
  const [mostraFibra, setMostraFibra] = useState(true);
  const [mostraFwa, setMostraFwa] = useState(true);
  const [chartType, setChartType] = useState("A torta");

  useEffect(() => {
    //Definisci la funzione fetchData
    async function fetchData() {
      const data = await secondoEndpointPost(selectedType);
      setChartData(data);
    }
    fetchData();
  }, [selectedType]);

  let valoriChartFibra = {};
  let valoriChartFwa = {};

  valoriChartFibra = {
    labels: chartData ? chartData.listaRegioni : [],
    datasets: [
      {
        label: "Numero lavori",
        backgroundColor:
          chartType === "A torta"
            ? [
                "rgba(13, 94, 56, 1)",
                "rgba(9, 63, 37, 1)",
                "rgba(48, 182, 119, 1)",
                "rgba(163, 222, 194, 1)",
                "rgba(4, 31, 18, 1)",
                "rgba(71, 190, 134, 1)",
                "rgba(15, 110, 66, 1)",
                "rgba(18, 126, 75, 1)",
                "rgba(209, 238, 224, 1)",
                "rgba(117, 206, 164, 1)",
                "rgba(232, 246, 239, 1)",
                "rgba(6, 47, 28, 1)",
                "rgba(20, 142, 85, 1)",
                "rgba(11, 79, 47, 1)",
                "rgba(94, 198, 149, 1)",
                "rgba(140, 214, 179, 1)",
                "rgba(186, 230, 209, 1)",
                "rgba(22, 158, 94, 1)",
                "rgba(25, 174, 104, 1)",
                "rgba(2, 15, 9, 1)",
              ]
            : "rgba(25, 174, 104, 1)",
        borderColor: ["rgba(255, 255, 255, 0)"],
        data: chartData ? chartData.numeroCantieriFibra : [],
      },
    ],
  };

  valoriChartFwa = {
    labels: chartData ? chartData.listaRegioni : [],
    datasets: [
      {
        label: "Numero lavori",
        backgroundColor:
          chartType === "A torta"
            ? [
                "rgba(102, 57, 225, 1)",
                "rgba(62, 17, 185, 1)",
                "rgba(192, 147, 255, 1)",
                "rgba(152, 107, 255, 1)",
                "rgba(142, 97, 255, 1)",
                "rgba(92, 47, 215, 1)",
              ]
            : "rgba(132, 87, 255, 1)",
        borderColor: "rgba(255, 255, 255, 0)",
        data: chartData ? chartData.numeroCantieriFwa : [],
      },
    ],
  };

  return (
    <div className="endpoint-body">
      <p className="heading">Endpoint 2 - Numero di cantieri per tipo</p>
      <p className="subheading">
        L'endpoint restituisce il numero totale di lavori, il numero di lavori
        terminati e di quelli programmati per tutti gli anni presenti nel
        dataset. Il risultato può essere filtrato in base al tipo di lavori da
        visualizzare e viene mostrato in due tipi di grafico, a barre o a torta.
      </p>
      <div className="action-bar">
        <div className="combobox-container">
          <div className="label-and-combobox">
            <p className="label">Seleziona un'opzione:</p>
            <select
              className="custom-select"
              name=""
              id=""
              defaultValue={selectedType}
              onChange={(e) => {
                setSelectedType(e.target.value);
              }}
            >
              <option value="Numero lavori">Numero lavori</option>
              <option value="Lavori terminati">Lavori terminati</option>
              <option value="Lavori programmati">Lavori programmati</option>
            </select>
          </div>
          <div className="label-and-combobox">
            <p className="label">Tipo di grafico:</p>
            <select
              className="custom-select"
              name=""
              id=""
              defaultValue={chartType}
              onChange={(e) => {
                setChartType(e.target.value);
              }}
            >
              <option value="A torta">A torta</option>
              <option value="A barre">A barre</option>
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
              {chartType === "A torta" ? (
                <Pie
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
                  }}
                  data={valoriChartFibra}
                />
              ) : (
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
                  }}
                  data={valoriChartFibra}
                />
              )}
            </div>
          )}
          {mostraFwa && (
            <div className="chart-card">
              {chartType === "A torta" ? (
                <Pie
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
                  }}
                  data={valoriChartFwa}
                />
              ) : (
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
                  }}
                  data={valoriChartFwa}
                />
              )}
            </div>
          )}
        </div>
      )}
      {numeroChart !== "due" && (
        <div className="one-chart-container">
          {mostraFibra && (
            <div className="chart-card">
              {chartType === "A torta" ? (
                <Pie
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
                  }}
                  data={valoriChartFibra}
                />
              ) : (
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
                  }}
                  data={valoriChartFibra}
                />
              )}
            </div>
          )}
          {mostraFwa && (
            <div className="chart-card">
              {chartType === "A torta" ? (
                <Pie
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
                  }}
                  data={valoriChartFwa}
                />
              ) : (
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
                  }}
                  data={valoriChartFwa}
                />
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
