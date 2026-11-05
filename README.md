# Music-Collection-Frontend

This is the Angular frontend for my Music Collection Application.

It is a further development of a static website originally generated using a Python crawler script.

## Connected Projects

### Pyhton Crawler

- for Metadata retrieval and processing.
- https://github.com/jonasWunderlich/music_crawler

### Quarkus Backend

- REST API and backend services
- Includes Data and Frontend in native executable
- https://github.com/jonasWunderlich/album-collection-backend

## Project Context & Evolution

The project started as a complete rewrite of the static solution created by a Python script. It maintains the original look and feel while inheriting all of its core functionality but enhancing it with modern and dynamic frontend features.

The original static version relied heavily on AI code generation, making it increasingly difficult to refactor or change implementation details across a growing and complex codebase. While the new Quarkus backend and this Angular frontend adapt many solutions from the Python prototype, the codebase has now been written primarily by hand adapting ideas of AI-Prototypes.

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
- Custom Collections: Ability to import curated custom sorted album lists.

## Further Development

- Sort by Year, Month & Day of Release
- Show Personal Reviews in Grid
- More Sort Options: Popularity, etc.
- Simplify Sort Filter as one Button (Asc/Desc)
- Group: Rating, Genre, Style, Country, City, etc.
- Custom Collections: Ability to import curated custom sorted album lists.
- Current Recommendation: Show custom Recommendations for this month & All Recommendations
- Enhance Artist Page: About Text, related & similar Artists, All releases
- Enhance Label Page: About Text, related & similar Artists, All releases
- Add Album Details Page: Track List, Reviews, Involved Staff, related & similar Artists, User Album Art with higher resolution
- Public & Private Mode: rerender images for public mode and show original art in private mode after login
- User Features: Bookmark records