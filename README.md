
# Movie App

A Node.js application to manage movies with notes and tags. This project allows users to register, create movie notes, and associate tags with movies. The application uses SQLite as the database and includes features such as password hashing and email validation.

## Features

- User Registration with password hashing
- CRUD operations for movie notes
- Tag management with cascading delete
- Email validation

## Getting Started

### Prerequisites

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

### Installation

1. Clone the repository:

   ```bash
   git clone [https://github.com/yourusername/movie-app.git](https://github.com/lucasgoesss/desafionode.git)
   cd movie-app
   ```

2. Build and start the Docker containers:

   ```bash
   docker-compose up --build
   ```

3. The application should now be running at `http://localhost:3000`.

### API Endpoints

Here are some examples of how to interact with the API using `curl`.

#### 1. Register a New User

```bash
curl -X POST http://localhost:3000/users \
-H "Content-Type: application/json" \
-d '{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securepassword",
  "avatar": "https://example.com/avatar.jpg"
}'
```

#### 2. Create a New Movie Note

```bash
curl -X POST http://localhost:3000/movies \
-H "Content-Type: application/json" \
-d '{
  "title": "Inception",
  "description": "A mind-bending thriller",
  "rating": 5,
  "user_id": 1,
  "tags": ["thriller", "sci-fi"]
}'
```

#### 3. Get All Movie Notes

```bash
curl -X GET http://localhost:3000/movies
```

#### 4. Update a Movie Note

```bash
curl -X PUT http://localhost:3000/movies/1 \
-H "Content-Type: application/json" \
-d '{
  "title": "Inception (Updated)",
  "description": "A mind-bending thriller about dreams",
  "rating": 4
}'
```

#### 5. Delete a Movie Note

```bash
curl -X DELETE http://localhost:3000/movies/1
```

#### 6. Get All Tags for a Movie Note

```bash
curl -X GET http://localhost:3000/movies/1/tags
```

#### 7. Add a Tag to a Movie Note

```bash
curl -X POST http://localhost:3000/movies/1/tags \
-H "Content-Type: application/json" \
-d '{
  "name": "action"
}'
```

#### 8. Delete a Tag from a Movie Note

```bash
curl -X DELETE http://localhost:3000/movies/1/tags/1
```

### Docker Commands

To run the application using Docker, use the following commands:

- **Build and Run the Containers**: Builds the Docker images and starts the containers.

  ```bash
  docker-compose up --build
  ```

- **Stop the Containers**: Stops the running containers.

  ```bash
  docker-compose down
  ```

- **Rebuild Containers Without Cache**: Rebuilds the Docker images without using cache.

  ```bash
  docker-compose build --no-cache
  ```
