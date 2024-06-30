import pandas as pd
import numpy as np
import geopandas as gpd
import json
from flask import Flask, request
import flask_cors

app = Flask(__name__)
flask_cors.CORS(app)

#Crei un dataframe leggendo il file csv
df = pd.read_csv('stato_lavori.csv', sep=';', encoding='UTF-8')
df['Piano fibra (anno)'] = df['Piano fibra (anno)'].fillna(0)
df['Piano FWA (anno)'] = df['Piano FWA (anno)'].fillna(0)
df['Piano fibra (anno)'] = df['Piano fibra (anno)'].astype('int64')
df['Piano FWA (anno)'] = df['Piano FWA (anno)'].astype('int64')

#Crei dataframe geografico
df_geo = pd.read_csv('italy_geo.csv', sep=';', encoding='UTF-8')
df_geo_citta = df_geo.copy()
df_geo_citta_filter = df_geo_citta['comune'].isin(df['Citta'].unique())
df_geo_citta = df_geo_citta[df_geo_citta_filter]

#Stringhe per filtrare i lavori in base al loro stato
str_prog = 'in programmazione|in progettazione|in progettazione definitiva'
str_esec = 'in esecuzione'
str_term = 'terminato|lavori chiusi|in collaudo'


#GET - Numero cantieri FIBRA in progettazione, in esecuzione e terminati divisi per anno
#POST - Numero cantieri FIBRA in progettazione, in esecuzione e terminati per anno SPECIFICATO
@app.route("/api/worksiteStatusByYear", methods=['GET', 'POST'])
def worksiteStatusByYear():
  #Cantieri FIBRA
  fibra_terminati = df[(df['Stato Fibra'].str.contains(str_term, na=False)) & (df['Fibra'] != 0)]['Piano fibra (anno)'].value_counts().sort_index()
  fibra_in_esecuzione = df[(df['Stato Fibra'].str.contains(str_esec, na=False)) & (df['Fibra'] != 0)]['Piano fibra (anno)'].value_counts().sort_index()
  fibra_in_progettazione = df[(df['Stato Fibra'].str.contains(str_prog, na=False)) & (df['Fibra'] != 0)]['Piano fibra (anno)'].value_counts().sort_index()
  fibra_conteggio_combinato_lavori = pd.DataFrame({'In progettazione': fibra_in_progettazione, 'In esecuzione': fibra_in_esecuzione, 'Terminati': fibra_terminati})
  fibra_conteggio_combinato_lavori_json = json.loads(fibra_conteggio_combinato_lavori.to_json())

  #Cantieri FWA
  fwa_terminati = df[(df['Stato FWA'].str.contains(str_term, na=False)) & (df['FWA'] != 0)]['Piano FWA (anno)'].value_counts().sort_index()
  fwa_in_esecuzione = df[(df['Stato FWA'].str.contains(str_esec, na=False)) & (df['FWA'] != 0)]['Piano FWA (anno)'].value_counts().sort_index()
  fwa_in_progettazione = df[(df['Stato FWA'].str.contains(str_prog, na=False)) & (df['FWA'] != 0)]['Piano FWA (anno)'].value_counts().sort_index()
  fwa_conteggio_combinato_lavori = pd.DataFrame({'In progettazione': fwa_in_progettazione, 'In esecuzione': fwa_in_esecuzione, 'Terminati': fwa_terminati})
  fwa_conteggio_combinato_lavori_json = json.loads(fwa_conteggio_combinato_lavori.to_json())

  if request.method == 'GET':
        res = {
                 "fibra" : fibra_conteggio_combinato_lavori_json,
                 "fwa" : fwa_conteggio_combinato_lavori_json
            } 
        return json.dumps(res)
  elif request.method == 'POST':
        #year = request.form['year'] THIS IS WHEN YOU SEND A REQUEST FROM POSTMAN
        year = request.json['year'] #THIS IS WHEN YOU SEND A REQUEST WITH FETCH
        #Risultato fibra
        fibra_res = {'In progettazione': "", 'In esecuzione': "", 'Terminati': ""}
        for key in fibra_conteggio_combinato_lavori_json:
             if (year != "2018"):
               fibra_res[key] = fibra_conteggio_combinato_lavori_json[key][year]
        #Risultato FWA
        fwa_res = {'In progettazione': "", 'In esecuzione': "", 'Terminati': ""}
        for key in fwa_conteggio_combinato_lavori_json:
             if (year != "2023"):
               fwa_res[key] = fwa_conteggio_combinato_lavori_json[key][year]

        res = {
                 "fibra" : fibra_res,
                 "fwa" : fwa_res
            }
        
        return json.dumps(res)


@app.route("/api/worksiteNumberByType", methods=['GET', 'POST'])
def worksiteNumberByType():
     #choice = request.form['choice']
     choice = request.json['choice']
     res = {"results" : []}

     #Numero di cantieri sia per la FIBRA che per la FWA in ogni regione
     if (choice == 'Numero lavori'):
          fibra_cablata = df[df['Fibra'] == 1]['Regione'].value_counts() # df.loc[df['Fibra'] == 1, ['Regione', 'Fibra']].groupby(by='Regione').sum()
          fwa = df[df['FWA'] == 1]['Regione'].value_counts()
          conteggio_cantieri = pd.DataFrame({'Fibra': fibra_cablata, 'FWA': fwa})
          #print(conteggio_cantieri.to_json())
          res = json.loads(conteggio_cantieri.to_json())
     #Numero di lavori chiusi o in collaudo sia per la FIBRA che per la FWA in ogni regione
     elif (choice == 'Lavori terminati'):
          fibra_cablata = df[df['Stato Fibra'].str.contains(str_term, na=False)]['Regione'].value_counts() 
          fwa = df[df['Stato FWA'].str.contains(str_term, na=False)]['Regione'].value_counts()
          conteggio_chiusi_collaudo = pd.DataFrame({'Fibra': fibra_cablata, 'FWA': fwa})
          #print(conteggio_chiusi_collaudo.to_json())
          res = json.loads(conteggio_chiusi_collaudo.to_json())
     #Numero di lavori in programmazione sia per la FIBRA che per la FWA in ogni regione
     elif (choice == 'Lavori programmati'):
          fibra_cablata = df[df['Stato Fibra'].str.contains(str_prog, na=False)]['Regione'].value_counts() 
          fwa = df[df['Stato FWA'].str.contains(str_prog, na=False)]['Regione'].value_counts()
          conteggio_programmazione = pd.DataFrame({'Fibra': fibra_cablata, 'FWA': fwa})
          #print(conteggio_programmazione.to_json())
          #res = conteggio_programmazione.to_dict()
          res = json.loads(conteggio_programmazione.to_json())
     
     return json.dumps(res) #jsonify(res)


@app.route("/api/incrementOverTime", methods=['GET', 'POST'])
def incrementOverTime():
     res = {
          "andamento" : {},
          "incrementoFibra" : 0,
          "incrementoFWA" : 0
     }
     #Andamento dei piani della FIBRA e FWA durante gli anni
     valori_fibra = df[(df['Fibra'] == 1) & (df['Piano fibra (anno)'] != 0)]['Piano fibra (anno)'].value_counts().sort_index()
     valori_fwa = df[(df['FWA'] == 1) & (df['Piano FWA (anno)'] != 0)]['Piano FWA (anno)'].value_counts().sort_index()
     andamento_fibra_fwa = pd.DataFrame({'Fibra': valori_fibra, 'FWA': valori_fwa})
     #print(andamento_fibra_fwa.to_json())

     #Calcolo della percentuale di incremento dei piani della FIBRA durante gli anni
     df_incr_fibra = pd.DataFrame({'Valori': valori_fibra})
     df_incr_fibra.loc[2019, 'Incremento %'] = np.nan
     for i in range(2020, 2024):
          nuovo_valore = ((df_incr_fibra.loc[i,'Valori'] - df_incr_fibra.loc[i-1,'Valori'])/df_incr_fibra.loc[i-1,'Valori']) * 100 
          df_incr_fibra.loc[i,'Incremento %'] = nuovo_valore
     #print(df_incr_fibra)
     print(df_incr_fibra.to_json())

#Calcolo della percentuale di incremento dei piani della FWA durante gli anni
     df_incr_fwa = pd.DataFrame({'Valori': valori_fwa})
     df_incr_fwa.loc[2018, 'Incremento %'] = np.nan
     for i in range(2019, 2023):
          nuovo_valore = ((df_incr_fwa.loc[i,'Valori'] - df_incr_fwa.loc[i-1,'Valori'])/df_incr_fwa.loc[i-1,'Valori']) * 100 
          df_incr_fwa.loc[i,'Incremento %'] = nuovo_valore
     print(df_incr_fwa.to_json())

     res['andamento'] = json.loads(andamento_fibra_fwa.to_json())
     res['incrementoFibra'] = json.loads(df_incr_fibra.to_json())
     res['incrementoFWA'] = json.loads(df_incr_fwa.to_json())

     return json.dumps(res)

#Numero di cantieri Fibra e FWA in base alla regione
@app.route("/api/worksiteNumberByRegionAndYear", methods=['POST'])
def worksiteNumberByRegion():
     res = {
          "fibra" : {},
          "fwa" : {}
     }
     #region = request.form['region']
     region = request.json['region']
     #year = request.form['year']
     year = request.json['year']
     df_regione = df[df['Regione'] == region]
     
     if(year == "Tutti gli anni"):
          #Analisi FWA regione
          terminati = df_regione[(df_regione['Stato FWA'].str.contains(str_term, na=False)) & (df_regione['FWA'] != 0)]['Provincia'].value_counts().sort_index()
          in_esecuzione = df_regione[(df_regione['Stato FWA'].str.contains(str_esec, na=False)) & (df_regione['FWA'] != 0)]['Provincia'].value_counts().sort_index()
          in_progettazione = df_regione[(df_regione['Stato FWA'].str.contains(str_prog, na=False)) & (df_regione['FWA'] != 0)]['Provincia'].value_counts().sort_index()
          conteggio_combinato_lavori_fwa_regione = pd.DataFrame({'In progettazione': in_progettazione, 'In esecuzione': in_esecuzione, 'Terminati': terminati})
          conteggio_combinato_lavori_fwa_regione_json = json.loads(conteggio_combinato_lavori_fwa_regione.to_json())
          #Calcolo del totale dei cantieri con suddivisione per anno
          totale = df_regione[df_regione['FWA'] == 1]['Piano FWA (anno)'].value_counts()
          conteggio_combinato_lavori_fwa_regione_json["Totale"] = json.loads(totale.to_json())
          res['fwa'] = conteggio_combinato_lavori_fwa_regione_json
          #print(conteggio_combinato_lavori_fwa_regione_json)

          #Analisi Fibra regione
          terminati = df_regione[(df_regione['Stato Fibra'].str.contains(str_term, na=False)) & (df_regione['Fibra'] != 0)]['Provincia'].value_counts().sort_index()
          in_esecuzione = df_regione[(df_regione['Stato Fibra'].str.contains(str_esec, na=False)) & (df_regione['Fibra'] != 0)]['Provincia'].value_counts().sort_index()
          in_progettazione = df_regione[(df_regione['Stato Fibra'].str.contains(str_prog, na=False)) & (df_regione['Fibra'] != 0)]['Provincia'].value_counts().sort_index()
          conteggio_combinato_lavori_fibra_regione = pd.DataFrame({'In progettazione': in_progettazione, 'In esecuzione': in_esecuzione, 'Terminati': terminati})
          conteggio_combinato_lavori_fibra_regione_json = json.loads(conteggio_combinato_lavori_fibra_regione.to_json())
          #Calcolo del totale dei cantieri con suddivisione per anno
          totale = df_regione[df_regione['Fibra'] == 1]['Piano fibra (anno)'].value_counts()
          conteggio_combinato_lavori_fibra_regione_json["Totale"] = json.loads(totale.to_json())
          res['fibra'] = conteggio_combinato_lavori_fibra_regione_json
          #print(conteggio_combinato_lavori_fibra_regione_json)
          #print(json.loads(totale.to_json()))
     else: 
          #Calcolo cantieri FWA per regione e anno specifico
          terminati = df_regione[(df_regione['Stato FWA'].str.contains(str_term, na=False)) & (df_regione['Piano FWA (anno)'] == int(year))]['Provincia'].value_counts()
          in_esecuzione = df_regione[(df_regione['Stato FWA'].str.contains(str_esec, na=False)) & (df_regione['Piano FWA (anno)'] == int(year))]['Provincia'].value_counts()
          in_progettazione = df_regione[(df_regione['Stato FWA'].str.contains(str_prog, na=False)) & (df_regione['Piano FWA (anno)'] == int(year))]['Provincia'].value_counts()
          conteggio_combinato_lavori_fwa_regione = pd.DataFrame({'In progettazione': in_progettazione, 'In esecuzione': in_esecuzione, 'Terminati': terminati})
          conteggio_combinato_lavori_fwa_regione_json = json.loads(conteggio_combinato_lavori_fwa_regione.to_json())
          #Calcolo del totale dei cantieri con suddivisione per anno
          totale_fwa = df_regione[df_regione['FWA'] == 1]['Piano FWA (anno)'].value_counts()
          conteggio_combinato_lavori_fwa_regione_json["Totale"] = json.loads(totale_fwa.to_json())
          res['fwa'] = conteggio_combinato_lavori_fwa_regione_json

          #Calcolo cantieri Fibra per regione e anno specifico
          terminati = df_regione[(df_regione['Stato Fibra'].str.contains(str_term, na=False)) & (df_regione['Piano fibra (anno)'] == int(year))]['Provincia'].value_counts()
          in_esecuzione = df_regione[(df_regione['Stato Fibra'].str.contains(str_esec, na=False)) & (df_regione['Piano fibra (anno)'] == int(year))]['Provincia'].value_counts()
          in_progettazione = df_regione[(df_regione['Stato Fibra'].str.contains(str_prog, na=False)) & (df_regione['Piano fibra (anno)'] == int(year))]['Provincia'].value_counts()
          conteggio_combinato_lavori_fibra_regione = pd.DataFrame({'In progettazione': in_progettazione, 'In esecuzione': in_esecuzione, 'Terminati': terminati})
          conteggio_combinato_lavori_fibra_regione_json = json.loads(conteggio_combinato_lavori_fibra_regione.to_json())
          #Calcolo del totale dei cantieri con suddivisione per anno
          totale_fibra = df_regione[df_regione['Fibra'] == 1]['Piano fibra (anno)'].value_counts()
          conteggio_combinato_lavori_fibra_regione_json["Totale"] = json.loads(totale_fibra.to_json())
          res['fibra'] = conteggio_combinato_lavori_fibra_regione_json
     
     return json.dumps(res)

if __name__ == "__main__":
    app.run(host='0.0.0.0')

# for key in conteggio_combinato_lavori_lomb_json:
#     print(conteggio_combinato_lavori_lomb_json[key]['2019'])
  
  #{"In progettazione": 1.0, "In esecuzione": 1.0, "Terminati": 780}

  #Per convertire il dataframe in un oggetto JSON
# dataframe_str = df.to_json()
# json_dataframe = json.loads(dataframe_str)
# print(json_dataframe['Piano fibra (anno)']['0'])
