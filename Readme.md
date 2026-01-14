# Time Logging System

A simple time-logging system built with PostgreSQL and two microservices communicating via REST and JSON-RPC.

---

## Architecture

- **PostgreSQL** – stores users, projects, time logs, and collected data
- **Collector Service**
  - REST API
  - Reads and aggregates data from the database
  - Sends data to Storage Service via JSON-RPC
- **Storage Service**
  - JSON-RPC API
  - Stores collected data chronologically as immutable snapshots

---

## How to Run

### 1. Start PostgreSQL

docker compose up -d
2. Create schema

Get-Content database/schema.sql |
  docker exec -i timelog-postgres psql -U postgres -d timelog
3. Create procedure and seed data

Get-Content database/init_database.sql |
  docker exec -i timelog-postgres psql -U postgres -d timelog

docker exec -it timelog-postgres psql -h localhost -U postgres timelog

CALL init_database();
4. Start services
Storage service 

cd services/storage-service
npm install
npm run build
npm start
Collector service:


cd services/collector-service
npm install
npm run build
npm start
Test the System

curl "http://localhost:3000/collect?from=2025-01-01&to=2025-12-31"
Expected response:
