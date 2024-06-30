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

'''Endpoint 2'''
#Numero di cantieri sia per la FIBRA che per la FWA in ogni regione
fibra_cablata = df[df['Fibra'] == 1]['Regione'].value_counts() # df.loc[df['Fibra'] == 1, ['Regione', 'Fibra']].groupby(by='Regione').sum()
fwa = df[df['FWA'] == 1]['Regione'].value_counts()
conteggio_cantieri = pd.DataFrame({'Fibra': fibra_cablata, 'FWA': fwa})
print(conteggio_cantieri.to_json())

#Numero di lavori chiusi o in collaudo sia per la FIBRA che per la FWA in ogni regione
fibra_cablata = df[df['Stato Fibra'].str.contains(str_term, na=False)]['Regione'].value_counts() 
fwa = df[df['Stato FWA'].str.contains(str_term, na=False)]['Regione'].value_counts()
conteggio_chiusi_collaudo = pd.DataFrame({'Fibra': fibra_cablata, 'FWA': fwa})
print(conteggio_chiusi_collaudo.to_json())

#Numero di lavori in programmazione sia per la FIBRA che per la FWA in ogni regione
fibra_cablata = df[df['Stato Fibra'].str.contains(str_prog, na=False)]['Regione'].value_counts() 
fwa = df[df['Stato FWA'].str.contains(str_prog, na=False)]['Regione'].value_counts()
conteggio_programmazione = pd.DataFrame({'Fibra': fibra_cablata, 'FWA': fwa})
print(conteggio_programmazione.to_json())

#Consider sending the result back like this depending on the chart used
res = {
  "Abruzzo" : {
    "Fibra" : 154,
    "FWA" : 48
  }
}

'''Endpoint 3'''
#Andamento dei piani della FIBRA e FWA durante gli anni
valori_fibra = df[(df['Fibra'] == 1) & (df['Piano fibra (anno)'] != 0)]['Piano fibra (anno)'].value_counts().sort_index()
valori_fwa = df[(df['FWA'] == 1) & (df['Piano FWA (anno)'] != 0)]['Piano FWA (anno)'].value_counts().sort_index()
andamento_fibra_fwa = pd.DataFrame({'Fibra': valori_fibra, 'FWA': valori_fwa})
print(andamento_fibra_fwa.to_json())

#Calcolo della percentuale di incremento dei piani della FIBRA durante gli anni
df_incr_fibra = pd.DataFrame({'Valori': valori_fibra})
df_incr_fibra.loc[2019, 'Incremento %'] = np.nan
for i in range(2020, 2024):
    nuovo_valore = ((df_incr_fibra.loc[i,'Valori'] - df_incr_fibra.loc[i-1,'Valori'])/df_incr_fibra.loc[i-1,'Valori']) * 100 
    df_incr_fibra.loc[i,'Incremento %'] = nuovo_valore
print(df_incr_fibra)
print(df_incr_fibra.to_json())

#Calcolo della percentuale di incremento dei piani della FWA durante gli anni
df_incr_fwa = pd.DataFrame({'Valori': valori_fwa})
df_incr_fwa.loc[2018, 'Incremento %'] = np.nan
for i in range(2019, 2023):
    nuovo_valore = ((df_incr_fwa.loc[i,'Valori'] - df_incr_fwa.loc[i-1,'Valori'])/df_incr_fwa.loc[i-1,'Valori']) * 100 
    df_incr_fwa.loc[i,'Incremento %'] = nuovo_valore
print(df_incr_fwa)



'''Endpoint 1'''
# terminati = df[(df['Stato FWA'].str.contains(str_term, na=False)) & (df['FWA'] != 0)]['Piano FWA (anno)'].value_counts().sort_index()
# in_esecuzione = df[(df['Stato FWA'].str.contains(str_esec, na=False)) & (df['FWA'] != 0)]['Piano FWA (anno)'].value_counts().sort_index()
# in_progettazione = df[(df['Stato FWA'].str.contains(str_prog, na=False)) & (df['FWA'] != 0)]['Piano FWA (anno)'].value_counts().sort_index()
# conteggio_combinato_lavori = pd.DataFrame({'In progettazione': in_progettazione, 'In esecuzione': in_esecuzione, 'Terminati': terminati})
# conteggio_combinato_lavori_json = json.loads(conteggio_combinato_lavori.to_json())

# print(conteggio_combinato_lavori_json)