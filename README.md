# WayNIR

Aplicação web interna para operação, governança e análise do Núcleo Interno de Regulação de uma UPA.

## Stack

- Next.js 16.4.2, React 19.3 e TypeScript;
- PostgreSQL local;
- Drizzle ORM e migrations SQL versionadas;
- autenticação local com Argon2id e sessões persistidas no banco;
- Tailwind CSS 4, CSS do produto, Phosphor Icons e Recharts.

## Pré-requisitos

- Node.js compatível com o projeto;
- Docker Desktop com Docker Compose, ou uma instalação local do PostgreSQL 17 ou superior;
- porta `3000` e uma porta livre para o PostgreSQL no ambiente de desenvolvimento.

## Configuração inicial

1. Instale as dependências:

```powershell
npm install
```

2. Copie o arquivo de ambiente e defina senhas locais fortes:

```powershell
Copy-Item .env.example .env.local
```

Edite `.env.local`. O valor de `POSTGRES_PASSWORD` precisa corresponder à senha presente em `DATABASE_URL`, e `POSTGRES_PORT` precisa ser a mesma porta da URL. `ADMIN_INITIAL_PASSWORD` será usado apenas para criar o primeiro administrador e deverá ser trocado no primeiro login.

Se a porta `5432` já estiver ocupada por outra instalação do PostgreSQL, use outra porta nos dois campos, por exemplo:

```env
DATABASE_URL=postgresql://waynir:sua_senha@127.0.0.1:55432/waynir
POSTGRES_PASSWORD=sua_senha
POSTGRES_PORT=55432
```

3. Inicie o PostgreSQL:

```powershell
docker compose --env-file .env.local up -d postgres
docker compose --env-file .env.local ps
```

O serviço estará pronto quando o estado exibido for `healthy`.

4. Aplique as migrations e crie os papéis, permissões e administrador inicial:

```powershell
npm run db:setup
```

5. Inicie a aplicação:

```powershell
npm run dev
```

A landing page estará em `http://localhost:3000` e o acesso seguro em `http://localhost:3000/login`.

## Fluxo de autenticação implementado

- não existe cadastro público;
- nomes de usuário são normalizados e únicos;
- senhas são armazenadas com Argon2id;
- o administrador inicial recebe uma senha temporária;
- a troca da senha é obrigatória no primeiro acesso;
- sessões usam tokens aleatórios e apenas o hash é salvo no PostgreSQL;
- cookies são `HttpOnly`, `SameSite=Strict` e podem ser marcados como `Secure` por ambiente;
- sessões expiram após 30 minutos de inatividade e têm limite absoluto configurável;
- tentativas inválidas recebem bloqueio progressivo;
- páginas internas e ações de servidor validam autenticação e permissão;
- login, logout, falhas, bloqueios e troca de senha são auditados.

## Papéis iniciais

- **Operador:** censo, pacientes e movimentações operacionais;
- **Gestor:** operação, fechamento/reabertura, análises, importações e auditoria;
- **Administrador:** usuários, configurações, auditoria e saúde técnica, sem acesso clínico identificado por padrão.

Permissões individuais já estão representadas no esquema do banco, mas a interface para administrá-las será implementada numa feature posterior.

## Comandos

```powershell
npm run lint
npm test
npm run build
npm run db:generate
npm run db:migrate
npm run db:seed
npm run db:studio
```

## Segurança do ambiente

O piloto foi projetado para a rede interna, mas ainda depende de decisões institucionais sobre criptografia de disco, backups externos, recuperação da máquina servidora e HTTPS local. Não use dados reais de pacientes antes de essas pendências serem avaliadas.
