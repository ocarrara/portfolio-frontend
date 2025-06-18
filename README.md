# PortfolioFrontend

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.2.19.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Docker

This project includes a Dockerfile to containerize the application.

### Building the Docker image

```bash
docker build -t portfolio-frontend .
```

### Running the Docker container

```bash
docker run -p 4000:4000 portfolio-frontend
```

The application will be available at `http://localhost:4000`.

### Connecting to the backend

By default, the application expects the backend API to be available at `http://localhost:8080/api`. 
If your backend is running on a different host or port, you can use Docker networking or environment variables to configure the connection.

There are two ways to configure the backend connection:

1. Using `API_URL`: This sets the API path relative to the frontend server (e.g., `/api`).
2. Using `BACKEND_BASE_URL`: This sets the complete backend URL including host, port, and base path (e.g., `http://backend-host:8080/api`).

For example, if you're running both frontend and backend in Docker containers:

```bash
# Create a network
docker network create portfolio-network

# Run the backend (assuming it's also containerized)
docker run --name portfolio-backend --network portfolio-network portfolio-backend

# Run the frontend with the backend container name as the host
docker run -p 4000:4000 --network portfolio-network -e BACKEND_BASE_URL=http://portfolio-backend:8080/api portfolio-frontend
```

### Using Docker Compose

You can also use Docker Compose to run the frontend and backend together:

```yaml
version: "3.9"
services:
  backend:
    container_name: portfolio-backend
    image: portfolio-backend:latest
    networks:
      - portfolio-network

  frontend:
    container_name: portfolio-frontend
    image: portfolio-frontend:latest
    ports:
      - "4000:4000"
    networks:
      - portfolio-network
    environment:
      BACKEND_BASE_URL: "http://portfolio-backend:8080/api"

networks:
  portfolio-network:
    driver: bridge
```

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
