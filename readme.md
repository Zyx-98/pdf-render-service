# DOC GALLERY SERVICE

## Development Setup

1. **Start the development environment**:  
   Run the following command to start the services in the development environment.

   ```bash
   docker compose -f docker-compose.dev.yml up -d
   ```

2. **Start the development environment**:  
   To stop the services:

   ```bash
   docker compose -f docker-compose.dev.yml down
   ```

## Production Setup

1. **Start the production environment**:  
   Run the following command to start the services in production mode.

   ```bash
   docker compose -f docker-compose.dev.yml up -d
   ```

2. **Start the production environment**:  
   To stop the services:

   ```bash
   docker compose down
   ```

## Testing

- In Postman, click `Import` and select the JSON file (`doc-gallery.postman_collection.json`).
- Check the API responses for correct status codes and data.
