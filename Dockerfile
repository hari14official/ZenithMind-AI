# Stage 1: Build the Next.js frontend
FROM node:20-alpine AS builder
WORKDIR /app/apps/web

# Copy package management files and install dependencies
COPY apps/web/package.json apps/web/package-lock.json* ./
RUN npm install

# Copy the rest of the frontend source
COPY apps/web/ ./

# Build the Next.js app (creates the /out static directory)
RUN npm run build


# Stage 2: Python Backend and Serving
FROM python:3.10-slim-bookworm
WORKDIR /app

# Install system libraries needed for OpenCV and other ML packages
RUN apt-get update && apt-get install -y \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Install python dependencies
WORKDIR /app/apps/api
COPY apps/api/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the backend source
COPY apps/api /app/apps/api/

# Copy the environment file so the API has its API keys (Optional copy using wildcard trick)
COPY apps/web/.env.loca[l] /app/apps/web/

# Copy the pre-built frontend from stage 1
COPY --from=builder /app/apps/web/out /app/apps/web/out

# Pre-train the ML model during the image build step if necessary
RUN python -m app.ml.train

# Expose the single application port
EXPOSE 8000

# Start Unified System (Frontend served via FastAPI)
CMD ["python", "-m", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
