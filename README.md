

## Panel for managing an order for PME
This is a panel for "PMEs" (small & medium enterprises) and their clients to create a feeling of security
for the client. They can follow up on what you do, find all their documents in there and have all of your 
contacts. 

### 👾 Features 
- Document upload (up to 4.5mb) all serverless with vercel Blob
- User creation/deletion directly in the admin panel 
- Everything is managed securely within the webapp (project & updates creation/deletion, etc.)
- Great front-end 

### Roadmap (todo)
- Mobile UI/UX
- No project deletion (user deletion only) 
- No possibility for multiple projects
- No archive (weak DB)
- message feature 
- expanding this tool to create a tool to manage the orders, invoice, taxes, etc. directly in the app. 



## Getting Started

First, run the development server:

```bash
npm run dev
```

Then, create a Neon Database, create the tables with the following arguments: 
```sql

  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL DEFAULT 'client',
    created_at TIMESTAMP DEFAULT NOW(),
    contact VARCHAR(255)
  );

  CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
  );

  CREATE TABLE IF NOT EXISTS updates (
    id SERIAL PRIMARY KEY,
    project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    error BOOLEAN DEFAULT FALSE,
    error_name TEXT,
    planned BOOLEAN DEFAULT FALSE,
    date VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW()
  );
  
  CREATE TABLE documents (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  url VARCHAR(500) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```
Copy the URL and add it into the .env with `DATABASE_URL=[yourURL].`

Then, create a Blob on vercel Blob and paste the secret into the .env with `BLOB_READ_WRITE_TOKEN=[yourURL].`

Restart the server

And you're all set! 

