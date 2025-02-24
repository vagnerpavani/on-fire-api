# On fire API

Esse projeto é a API para o serviço Web de contagem de streak do desafio técnico.

## Rodando em desenvolvimento

- Crie um arquivo .env.development copiando de .env.example com as credenciais para seu banco de dados Postgres.

- Em seguida use o arquivo `src/scripts/CREATE_TABLES.sql` para criar as tabelas do banco.

- Em seguida rode:

```
npm install
npm run start:dev
```

# Camadas arquiteturais

## Modules

- Os modulos estão separados por dominio. Nesse caso, só há o dominio dos streaks.

## Controller

- Essa camada serve apenas para gerenciar as entradas e saídas e lidar com as requisições HTTP.
- Essa camada é responsavel por lidar com as possiveis respostas de Erro para as requisições HTTP.

## Use cases

- Essa é a camada que implementa as regras de negocio da aplicação.
- Ela tende a ser o mais agnóstica possível (embora nesse projeto tenha depencias concretas que deveriam virar interfaces.)
- Essa camada deve receber o payload da controller e efetuar o processamento necessario seguindo as regras de negócio.
- Ela não tem nenhum conhecimento sobre a entrada e saída. (Responsabilidade da controller.)

## Repositories

- Essa camada foi adotada para abstrair as queries para o banco de dados e manter os casos de uso agnósticos.
- Essa camada não deve implementar regras de négocio, apenas chamadas especificadas para o banco de dados.
- Idealmente eu teria feito uma interface para esses repositories, para os casos de uso não dependerem diretamente deles. \*fica a nota de melhoria...

## Entities

- Classes para representar as tabelas do banco de dados.
- São as classes mais abstratas, e são principalmente usadas para mapear as saídas dos repositories.
