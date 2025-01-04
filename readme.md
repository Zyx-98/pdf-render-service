# DOC GALLERY SERVICE

The service supports generating pdf from provided json data, based on a DOCX to PDF conversion.

## Overview

The service uses [dox-template](https://www.npmjs.com/package/docx-templates) and [docx](https://www.npmjs.com/package/docx) libraries to create templates and the `libreoffice` to convert docx templates to pdf files.  

## Goals

1. **Strategies implementations**

<table style="margin-left: 30px">
   <thead>
      <tr>
         <th>Strategy</th>
         <th>Status</th>
      </tr>
   </thead>
   <tbody>
      <tr>
       <td>docx-template</td>
       <td style="text-align:center;">✅</td>
      </tr>
      <tr>
       <td>docx</td>
       <td style="text-align:center;">🛠️</td>
      </tr>

   </tbody>
</table>

2. **Performances**

- ✅ Easy to setup and scale.
- ✅ Operates well and stably on low configurations servers (2 cores CPU and 512 MB of memory).
- ✅ High fault tolerance ensures stability and consistency.

3. **TODO**

- [] Implement tests.
- [] Setup ci/cd on google cloud.

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
