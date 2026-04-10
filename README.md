<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/87502d17-c18f-450c-b37b-0cedcf5440c0

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Run with Docker (recommended for sharing)

### Teammates (pull prebuilt images)

1. Copy `.env.example` to `.env` and set `IMAGE_NAMESPACE` to the registry namespace that contains:
   - `aerchain-frontend`
   - `aerchain-backend`
2. Run:
   - `docker compose pull`
   - `docker compose up`
3. Open `http://localhost:8080`

### Developers (build locally)

This repo includes `docker-compose.override.yml` (auto-loaded by Docker Compose) which switches `frontend` and `backend` back to local `build:` so you can do:

- `docker compose up --build`

### Publishing to Docker Hub (one-time per version)

From repo root:

- `docker build -f Dockerfile.backend -t <dockerhub_user>/aerchain-backend:latest .`
- `docker push <dockerhub_user>/aerchain-backend:latest`
- `docker build -f Dockerfile.frontend -t <dockerhub_user>/aerchain-frontend:latest .`
- `docker push <dockerhub_user>/aerchain-frontend:latest`


### If the docker build fails

1. Run the code locally by ensuring that Ollama is running on your machine and the model 'kimi-k2-thinking:cloud' is pulled.
2. Run the following commands:
   - `pip install -r requirements.txt`
   - `npm run dev`