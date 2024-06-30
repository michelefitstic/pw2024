import { Line } from "react-chartjs-2";
import { useState, useEffect } from "react";
import { EyeOpenIcon, EyeClosedIcon } from "@radix-ui/react-icons";

async function terzoEndpointGet() {
  try {
    let fetchRes = await fetch("http://localhost:80/api/incrementOverTime");

    if (!fetchRes.ok) {
      throw new Error("Network response was not ok");
    }
    let data = await fetchRes.json();

    //Dati relativi alla FIBRA - ANNI asse Y, NUMERO CANTIERI asse X
    const anniFibra = Object.keys(data["andamento"]["Fibra"]);
    const numFibra = Object.values(data["andamento"]["Fibra"]);
    const anniPercentualiFibra = Object.keys(
      data["incrementoFibra"]["Incremento %"]
    );
    const percentualiFibra = Object.values(
      data["incrementoFibra"]["Incremento %"]
    );

    //Dati relativi alla FWA - ANNI asse Y, NUMERO CANTIERI asse X
    const anniFwa = Object.keys(data["andamento"]["FWA"]);
    const numFwa = Object.values(data["andamento"]["FWA"]);
    const anniPercentualiFwa = Object.keys(
      data["incrementoFWA"]["Incremento %"]
    );
    const percentualiFwa = Object.values(data["incrementoFWA"]["Incremento %"]);

    return {
      anniFibra,
      numFibra,
      anniFwa,
      numFwa,
      percentualiFwa,
      anniPercentualiFwa,
      anniPercentualiFibra,
      percentualiFibra,
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

export default function TerzoEndpoint() {
  const [chartData, setChartData] = useState(null);
  const [numeroChart, setNumeroChart] = useState("due");
  const [mostraFibra, setMostraFibra] = useState(true);
  const [mostraFwa, setMostraFwa] = useState(true);
  const [mostraPercentuali, setMostraPercentuali] = useState(false);

  useEffect(() => {
    //Definisci la funzione fetchData
    async function fetchData() {
      const data = await terzoEndpointGet();
      setChartData(data);
    }
    fetchData();
  }, []);

  let valoriChartFibra = {};
  let valoriChartFwa = {};

  valoriChartFibra = {
    labels: chartData ? chartData.anniFibra : [],
    datasets: [
      {
        label: "Numero lavori",
        backgroundColor: "rgba(25, 174, 104, 1)",
        borderColor: "rgba(25, 174, 104, 1)",
        data: chartData ? chartData.numFibra : [],
      },
    ],
  };

  valoriChartFwa = {
    labels: chartData ? chartData.anniFwa : [],
    datasets: [
      {
        label: "Numero lavori",
        backgroundColor: "rgba(132, 87, 255, 1)",
        borderColor: "rgba(132, 87, 255, 1)",
        data: chartData ? chartData.numFwa : [],
      },
    ],
  };

  return (
    <div className="endpoint-body">
      <p className="heading">Endpoint 3 - Andamento cantieri per anno</p>
      <p className="subheading">
        L'endpoint restituisce l'andamento del numero di cantieri di Fibra e FWA
        durante i vari anni presenti nel dataset. Vengono calcolate anche le
        percentuali di incremento o diminuzione del numero di cantieri per ogni
        anno.
      </p>
      <div className="action-bar">
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
              <Line
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
            </div>
          )}
          {mostraFwa && (
            <div className="chart-card">
              <Line
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
            </div>
          )}
        </div>
      )}
      {numeroChart !== "due" && (
        <div className="one-chart-container">
          {mostraFibra && (
            <div className="chart-card">
              <Line
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
            </div>
          )}
          {mostraFwa && (
            <div className="chart-card">
              <Line
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
            </div>
          )}
        </div>
      )}
      <div className="button-container">
        <div
          className="show-percentages"
          onClick={() => setMostraPercentuali(!mostraPercentuali)}
        >
          {mostraPercentuali ? (
            <EyeClosedIcon color="#181818" height={16} width={16} />
          ) : (
            <EyeOpenIcon color="#181818" height={16} width={16} />
          )}
          <p className="button-label">
            {mostraPercentuali ? "Nascondi percentuali" : "Mostra percentuali"}
          </p>
        </div>
      </div>
      {numeroChart === "due" && mostraPercentuali && (
        <div className="two-chart-container">
          {mostraFibra && (
            <>
              <div className="percentage-card">
                <p className="percentage-card-title">Andamento % Fibra</p>
                {chartData.anniPercentualiFibra.map((e, i) => {
                  return (
                    <div className="percentage-box">
                      <p className="percentage-year">{e}</p>
                      <p
                        className="percentage"
                        style={{
                          color:
                            chartData.percentualiFibra[i] > 0
                              ? "#EEEEEE"
                              : "#FF4326",
                        }}
                      >
                        {chartData.percentualiFibra[i] === null
                          ? ""
                          : chartData.percentualiFibra[i].toFixed(2) + "%"}
                      </p>
                    </div>
                  );
                })}
              </div>
            </>
          )}
          {mostraFwa && (
            <>
              <div className="percentage-card">
                <p className="percentage-card-title">Andamento % FWA</p>
                {chartData.anniPercentualiFwa.map((e, i) => {
                  return (
                    <div className="percentage-box">
                      <p className="percentage-year">{e}</p>
                      <p
                        className="percentage"
                        style={{
                          color:
                            chartData.percentualiFwa[i] > 0
                              ? "#EEEEEE"
                              : "#FF4326",
                        }}
                      >
                        {chartData.percentualiFwa[i] === null
                          ? ""
                          : chartData.percentualiFwa[i].toFixed(2) + "%"}
                      </p>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}
      {numeroChart === "uno" && mostraPercentuali && (
        <div className="one-chart-container">
          {mostraFibra && (
            <>
              <div className="percentage-card">
                <p className="percentage-card-title">Andamento % Fibra</p>
                {chartData.anniPercentualiFibra.map((e, i) => {
                  return (
                    <div className="percentage-box">
                      <p className="percentage-year">{e}</p>
                      <p
                        className="percentage"
                        style={{
                          color:
                            chartData.percentualiFibra[i] > 0
                              ? "#EEEEEE"
                              : "#FF4326",
                        }}
                      >
                        {chartData.percentualiFibra[i] === null
                          ? ""
                          : chartData.percentualiFibra[i].toFixed(2) + "%"}
                      </p>
                    </div>
                  );
                })}
              </div>
            </>
          )}
          {mostraFwa && (
            <>
              <div className="percentage-card">
                <p className="percentage-card-title">Andamento % FWA</p>
                {chartData.anniPercentualiFwa.map((e, i) => {
                  return (
                    <div className="percentage-box">
                      <p className="percentage-year">{e}</p>
                      <p
                        className="percentage"
                        style={{
                          color:
                            chartData.percentualiFwa[i] > 0
                              ? "#EEEEEE"
                              : "#FF4326",
                        }}
                      >
                        {chartData.percentualiFwa[i] === null
                          ? ""
                          : chartData.percentualiFwa[i].toFixed(2) + "%"}
                      </p>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
