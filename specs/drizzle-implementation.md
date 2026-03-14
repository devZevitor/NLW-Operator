# Especificação de Implementação do Drizzle ORM (Atualizado)

Esta especificação define a estrutura do banco de dados e os passos necessários para configurar o Drizzle ORM com PostgreSQL (via Docker Compose) no projeto DevRoast.

> **Nota:** Atualizado conforme solicitação do usuário: sem tabela `users`, com tabela separada para `code_analyses`, e uso de Enums.

## Stack Tecnológico

-   **ORM:** Drizzle ORM
-   **Banco de Dados:** PostgreSQL (via Docker Compose)
-   **Migrações:** Drizzle Kit
-   **Driver:** `postgres` (ou `pg`)

## Estrutura do Banco de Dados (Schema)

### 1. Enums (Cruel Phrases)

Usaremos um Enum no Postgres para categorizar o nível de "crueldade" baseado na pontuação.

-   `cruel_phrase_enum`:
    -   `CRITICAL`: "Isso precisa de ajuda urgentemente" (0-2)
    -   `BAD`: "Ainda tem salvação?" (3-5)
    -   `MEDIOCRE`: "Funciona, mas a que custo?" (6-8)
    -   `DECENT`: "Até que não está horrível" (9-10)

### 2. Tabela `roasts` (Código Original)
Armazena o código submetido pelo usuário.

| Coluna          | Tipo        | Descrição                                      |
| :-------------- | :---------- | :--------------------------------------------- |
| `id`            | UUID        | Chave primária (default: `gen_random_uuid()`)  |
| `original_code` | Text        | O código original submetido                    |
| `language`      | Varchar     | Linguagem detectada/selecionada (e.g., 'ts')   |
| `sarcasm_mode`  | Boolean     | Se o modo sarcasmo estava ativado (default: false) |
| `created_at`    | Timestamp   | Data de submissão (default: `now()`)           |

### 3. Tabela `code_analyses` (Análise da IA)
Armazena o resultado da análise feita pela IA, relacionada à tabela `roasts`.

| Coluna             | Tipo        | Descrição                                      |
| :----------------- | :---------- | :--------------------------------------------- |
| `id`               | UUID        | Chave primária (default: `gen_random_uuid()`)  |
| `roast_id`         | UUID        | FK para `roasts.id` (Relacionamento 1:1)       |
| `improved_code`    | Text        | O código refatorado/melhorado pela IA          |
| `sarcastic_phrase` | Text        | A frase sarcástica gerada pela IA              |
| `loc`              | Integer     | Quantidade de linhas de código (LOC)           |
| `shame_score`      | Integer     | Pontuação de "vergonha" (0-10)                 |
| `cruel_phrase`     | Enum        | Classificação baseada no score (CruelPhrase)   |
| `created_at`       | Timestamp   | Data da análise (default: `now()`)             |

## Configuração do Docker Compose

Arquivo `docker-compose.yml` na raiz do projeto para subir o banco localmente.

```yaml
version: '3.8'

services:
  db:
    image: postgres:15-alpine
    container_name: devroast-db
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
      POSTGRES_DB: devroast
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```

## To-Dos de Implementação

- [ ] **Configuração Inicial**
    - [ ] Criar arquivo `docker-compose.yml`.
    - [ ] Instalar dependências: `drizzle-orm`, `postgres`, `dotenv`, `drizzle-kit`, `@types/pg`.
    - [ ] Criar arquivo `.env`.

- [ ] **Definição do Schema**
    - [ ] Criar `src/db/schema.ts` com as tabelas e enums.
    - [ ] Configurar `drizzle.config.ts`.
    - [ ] Configurar conexão em `src/lib/db.ts`.

- [ ] **Migrações**
    - [ ] Rodar `drizzle-kit generate`.
    - [ ] Rodar `drizzle-kit migrate`.
