# Replication bucket
Replica arquivos fakes de um bucket para outro

## Variáveis de ambiente
Criar um arquivo .env na raiz do projeto
```env
NODE_ENV=development
TZ=America/Sao_Paulo
S3_ACCESS_KEY=************************
S3_SECRET_KEY=************************
SCHEDULE=0 0 03 * * *
FROM_BUCKET=_nome_bucket_origem_
TO_BUCKET=_nome_bucket_destino_
```

## Padrão do Cron

> Formato: * * * * * *
* `*` Segundos: 0-59
* `*` Minutos: 0-59
* `*` Horas: 0-23
* `*` Dias do mes: 1-31
* `*` Meses: 0-11 (Janeiro-Dezembro)
* `*` Dias da semana: 0-6 (Domingo-Sabado)

>Exemplo: 00 00 03 * * 1-5 Executa todos os dias as 03:00PM de segunda a sexta

## Comandos 
```sh
# executar em desenvolvimento
npm run dev

# executar em produção
npm start

# eslint
npm run lint
```

## Docker
```sh
# build a imagem
docker image build -t replication .

# cria um container
docker container run -d --name replication --env-file=.env replication 
```
