import pandas as pd
import numpy as np
import geopandas as gpd
import json

df = pd.read_csv('stato_lavori.csv', sep=';', encoding='UTF-8')
df['Piano fibra (anno)'] = df['Piano fibra (anno)'].fillna(0)
df['Piano FWA (anno)'] = df['Piano FWA (anno)'].fillna(0)
df['Piano fibra (anno)'] = df['Piano fibra (anno)'].astype('int64')
df['Piano FWA (anno)'] = df['Piano FWA (anno)'].astype('int64')
str_prog = 'in programmazione|in progettazione definitiva'
str_esec = 'in esecuzione'
str_term = 'terminato|lavori chiusi|in collaudo'

df_geo = pd.read_csv('italy_geo.csv', sep=';', encoding='UTF-8')
df_geo.info()
df_geo_citta = df_geo.copy()
df_geo_citta_filter = df_geo_citta['comune'].isin(df['Citta'].unique())
df_geo_citta = df_geo_citta[df_geo_citta_filter]


#Analisi FWA regione
df_regione = df[df['Regione'] == 'Lombardia']
terminati = df_regione[(df_regione['Stato FWA'].str.contains(str_term, na=False)) & (df_regione['FWA'] != 0)]['Provincia'].value_counts().sort_index()
in_esecuzione = df_regione[(df_regione['Stato FWA'].str.contains(str_esec, na=False)) & (df_regione['FWA'] != 0)]['Provincia'].value_counts().sort_index()
in_progettazione = df_regione[(df_regione['Stato FWA'].str.contains(str_prog, na=False)) & (df_regione['FWA'] != 0)]['Provincia'].value_counts().sort_index()
conteggio_combinato_lavori_fwa_regione = pd.DataFrame({'In progettazione': in_progettazione, 'In esecuzione': in_esecuzione, 'Terminati': terminati})
conteggio_combinato_lavori_fwa_regione_json = json.loads(conteggio_combinato_lavori_fwa_regione.to_json())
#Calcolo del totale dei cantieri con suddivisione per anno
totale = df_regione[df_regione['FWA'] == 1]['Piano FWA (anno)'].value_counts()
conteggio_combinato_lavori_fwa_regione_json["Totale"] = json.loads(totale.to_json())
print(conteggio_combinato_lavori_fwa_regione_json)
#print(json.loads(totale.to_json()))

#Analisi Fibra regione
df_regione = df[df['Regione'] == 'Lombardia']
terminati = df_regione[(df_regione['Stato Fibra'].str.contains(str_term, na=False)) & (df_regione['Fibra'] != 0)]['Provincia'].value_counts().sort_index()
in_esecuzione = df_regione[(df_regione['Stato Fibra'].str.contains(str_esec, na=False)) & (df_regione['Fibra'] != 0)]['Provincia'].value_counts().sort_index()
in_progettazione = df_regione[(df_regione['Stato Fibra'].str.contains(str_prog, na=False)) & (df_regione['Fibra'] != 0)]['Provincia'].value_counts().sort_index()
conteggio_combinato_lavori_fibra_regione = pd.DataFrame({'In progettazione': in_progettazione, 'In esecuzione': in_esecuzione, 'Terminati': terminati})
conteggio_combinato_lavori_fibra_regione_json = json.loads(conteggio_combinato_lavori_fibra_regione.to_json())
#Calcolo del totale dei cantieri con suddivisione per anno
totale = df_regione[df_regione['Fibra'] == 1]['Piano fibra (anno)'].value_counts()
conteggio_combinato_lavori_fibra_regione_json["Totale"] = json.loads(totale.to_json())
print(conteggio_combinato_lavori_fibra_regione_json)
#print(json.loads(totale.to_json()))





'''#Totale lavori terminati
tot_terminati = 0
for x in conteggio_combinato_lavori_regione_json['Terminati']:
  if (conteggio_combinato_lavori_regione_json['Terminati'][x] is not None):
    tot_terminati = tot_terminati + conteggio_combinato_lavori_regione_json['Terminati'][x]
print(tot_terminati)

#Totale lavori in esecuzione
tot_esecuzione = 0
for x in conteggio_combinato_lavori_regione_json['In esecuzione']:
  if (conteggio_combinato_lavori_regione_json['In esecuzione'][x] is not None):
    tot_esecuzione = tot_esecuzione + conteggio_combinato_lavori_regione_json['In esecuzione'][x]
print(tot_esecuzione)

#Totale lavori in progettazione
tot_progettazione = 0
for x in conteggio_combinato_lavori_regione_json['In progettazione']:
  if (conteggio_combinato_lavori_regione_json['In progettazione'][x] is not None):
    tot_progettazione = tot_progettazione + conteggio_combinato_lavori_regione_json['In progettazione'][x]
print(tot_progettazione)'''