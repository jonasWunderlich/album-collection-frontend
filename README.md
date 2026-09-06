# Album-Collection-Frontend

This is the Angular frontend for the album-collection-backend.

It is a further development of a static website originally generated using a Python crawle (music_crawler).

## Project Context & Evolution

The project started as a complete rewrite of the static solution created by the Python script. It maintains the original look and feel while inheriting all of its core functionality.

The original static version relied heavily on AI code generation, making it increasingly difficult to refactor or change implementation details across a growing and complex codebase. While the new backend and this Angular frontend adapt many solutions from the Python prototype, the codebase has now been written primarily by hand.

The previous static version pre-rendered HTML pages for release years, decades, and specific curated lists (owned vinyl, favorite records, personal samplers, and wishlists).

## Why a Modern Frontend?

Moving away from a purely static approach to a modern frontend framework opens up much greater flexibility—particularly when it comes to dynamically connecting, filtering, and displaying the extensive metadata collected for each album.

## New Key Features

Enhanced Filtering: Advanced options to filter through the album collection efficiently.

Optimized Performance: Drastically reduced data traffic and faster load times via server-side pagination.

## Dynamic Views

As the metadata within the collection grows, cross-references and connections between records are established automatically.
The new implementation links and presents rich album metadata. Dedicated views are generated for:

- Entities & Metadata: Individual Artists, Labels, Genres, Styles, Cities, and Countries.
- Special Filters: Special pages for boolean filters (e.g., Wire recommendations, Tino's picks).

## Roadmap & Planned Features

- Improved Navigation
- Advanced Filtering UI: Combining multiple filter parameters with an intuitive user experience.
- Custom Collections: Ability to create and manually sort custom album lists.

## Connected Projects

### Pyhton Crawler

- for Metadata retrieval and processing.
- https://github.com/jonasWunderlich/music_crawler

### Quarkus Backend

- REST API and backend services
- https://github.com/jonasWunderlich/album-collection-backend
