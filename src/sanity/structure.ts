import type {StructureResolver} from 'sanity/structure'

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Ifybest')
    .items([
      S.documentTypeListItem('category').title('Categories'),
      S.documentTypeListItem('product').title('Products'),
      S.documentTypeListItem('sale').title('Sales'),
      S.documentTypeListItem('order').title('Orders'),
      S.divider(),

      ...S.documentTypeListItems().filter(
        (item) => item.getId() && !['post', 'category', 'product', 'author', 'sale', 'order'].includes(item.getId()!),
      ),
    ])
