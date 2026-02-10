import type {StructureResolver} from 'sanity/structure'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      // Journal Entries
      S.listItem()
        .title('Journal Entries')
        .icon(() => '📔')
        .child(
          S.documentTypeList('journalEntry')
            .title('All Journal Entries')
            .filter('_type == "journalEntry"')
            .defaultOrdering([{field: 'publishedAt', direction: 'desc'}])
            .child((documentId) =>
              S.document()
                .documentId(documentId)
                .schemaType('journalEntry')
            )
        ),

      S.divider(),

      // Posts
      S.listItem()
        .title('Posts')
        .icon(() => '📝')
        .child(
          S.documentTypeList('post')
            .title('All Posts')
            .filter('_type == "post"')
            .defaultOrdering([{field: 'publishedAt', direction: 'desc'}])
            .child((documentId) =>
              S.document()
                .documentId(documentId)
                .schemaType('post')
            )
        ),
      
      // Featured Posts
      S.listItem()
        .title('Featured Posts')
        .icon(() => '⭐')
        .child(
          S.documentTypeList('post')
            .title('Featured Posts')
            .filter('_type == "post" && featured == true')
            .defaultOrdering([{field: 'publishedAt', direction: 'desc'}])
        ),
      
      // Draft Posts
      S.listItem()
        .title('Draft Posts')
        .icon(() => '📄')
        .child(
          S.documentTypeList('post')
            .title('Draft Posts')
            .filter('_type == "post" && !defined(publishedAt)')
        ),

      S.divider(),

      // Authors
      S.listItem()
        .title('Authors')
        .icon(() => '👤')
        .schemaType('author')
        .child(S.documentTypeList('author').title('All Authors')),
      
      // Categories
      S.listItem()
        .title('Categories')
        .icon(() => '🏷️')
        .schemaType('category')
        .child(S.documentTypeList('category').title('All Categories')),

      S.divider(),

      // Documentation Sections
      S.listItem()
        .title('Documentation')
        .icon(() => '📖')
        .child(
          S.documentTypeList('documentationSection')
            .title('Documentation Sections')
            .defaultOrdering([{field: 'order', direction: 'asc'}])
        ),

      S.divider(),

      // La Familia Photo Gallery (singleton)
      S.listItem()
        .title('La Familia')
        .icon(() => '📸')
        .child(
          S.document()
            .documentId('photoGallery')
            .schemaType('photoGallery')
        ),

      // Puttering Poems (singleton)
      S.listItem()
        .title('Puttering')
        .icon(() => '✍️')
        .child(
          S.document()
            .documentId('putteringPoems')
            .schemaType('putteringPoems')
        ),
    ])