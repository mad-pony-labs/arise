# Arise Backend

This package covers the general backend for the Arise Laparoscopic surgery backend. 

### Clone the repository

run `git clone https://github.com/mad-pony-labs/arise.git`

### Install the dependancies

> [NodeJS](https://nodejs.dev/) is required
> [Docker](https://www.docker.com/) is required

```
cd arise
pnpm install
```

### Start the database

In the root of the project run
```
docker compose up postgres
```

### Connect the created server

Create a _.env_ file in the root of the server package (`/packages/server`) and populate it with the following url.

```
DATABASE_URL="postgresql://postgres:postgres@localhost:6500/arise?schema=public"
```

### Add the Firebase Service credentials
Create a file in the root of the server package (`/packages/server`) and put a service account credential file titles `service-account.json`. [Look here for instructions](https://firebase.google.com/support/guides/service-accounts). To do this you must be added to the Firebase. Otherwise ask Josh for the file.

### Run the project locally

Navigate into the server package and install the dependencies
```
cd packages/server
pnpm install
```

Start development
run `pnpm run dev`

## Advanced usage

### Prisma

### Format the Prisma schema

```bash
npm run prisma:format
```

### Migrate the SQL schema

```bash
prisma migrate dev --name added_job_title
```

### Update the Prisma Client

```bash
npm run prisma:generate
```

_with watch option_

```bash
npm run prisma:generate:watch
```

### Seed the database

```bash
npm run prisma:seed
```

### Launch Prisma Studio

```bash
npm run prisma:studio
```

### Reset the database

- Drop the database
- Create a new database
- Apply migrations
- Seed the database with data

```bash
npm run prisma:reset
```

# Production

A docker compose file is located at the root of the project. To run a production instance of both the database and the api run the following at the root of the project

```
docker compose up -d
```

To just start the api run
```
docker compose up api -d
```