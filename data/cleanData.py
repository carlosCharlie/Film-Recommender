import pandas as pd

chunksize = 10000
header = True
i = 0
for df in pd.read_csv('data/title.basics.tsv', sep='\t', header=0,chunksize=chunksize):
    df = df[df["isAdult"]==0]
    df = df[df.titleType=="movie"]
    df = df[df["startYear"]!=None]
    df = df[df["startYear"]!='\\N']
    df = df[df["startYear"].astype(int)>2015]
    df.to_csv("data/cleanedData.tsv", sep='\t',header=header, mode='a')
    header = False
    i = i+chunksize
    print(i)

print("done!")
    