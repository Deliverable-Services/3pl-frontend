export default {
  'form': {
    'breadcrumb': {
      'home': 'Home',
      'formPage': 'Form',
      'basicForm': 'Basic Form',
      'formLayout': 'Form Layout',
      'advancedForm': 'Advanced Form',
      'dynamicForm': 'Dynamic Form'
    },
    common: {
      create: 'Create',
      update: 'Update'
    },
    category: {
      add_category: 'Add Category',
      edit_category: 'Edit Category',
      fields: {category_name: 'Category Name'}
    },
    product: {
      edit_product: 'Edit Product',
      addMore: 'Add More',
      fields: {styleName: 'Style Name', collection: 'Collection', fabricComposition: 'Fabric Composition', fabricSwatch: 'Fabric Swatch',
      logisticDescription: 'Logistic Description', unitWeight: 'Unit Weight', category: 'Category', optionType: 'Option Type', image: 'Image', productSKU: 'Product SKU',
      color: 'Color', size: 'Size', label: 'Label', hangtagColor: 'Hangtag Color', localCurrency: 'Local Currency', localExwPrice: 'Local Exw Price',
      companyExwPrice: 'Company Exw Price', retailPrice: 'Retail Price', barcode: 'Barcode'}
    },
    company: {
      title: 'Company',
      edit_company: 'Edit Company',
      fields: {companyName: 'Company Name', companyAddress: 'Company address', primaryCurrency: 'Primary Currency', primaryCurrencyCode: 'Primary Currency Code',
      contactPerson: 'Contact Person', contactPhone: 'Contact Phone', contactEmail: 'Contact Email', createdAt: 'Created At', updatedAt: 'Updated At'}
    },
    currency: {
      edit_currency: 'Edit Currency',
      fields: {currencyName: 'Currency Name', currencyCode: 'Currency Code', exchangeRate: 'Exchange Rate', remarks: 'Remarks'}
    },
    creditTerms: {
      edit_currency: 'Edit Credit Terms',
      fields: {termsSubject: 'Terms Subject', creditDay: 'Credit Day', termsDescription: 'Terms Description'}
    },
    connectionLocationList: {
      edit_location: 'Edit Inventory Node',
      fields: {nodeId: 'Node Id', nodeType: 'Node Type', shopifyLocationId: 'Shopify Location Id', shopifyConnectorId: 'Shopify Connector Id', remarks: 'Remarks',
      nodeDescription: 'Node Description', nodeName: 'Node Name', lGStoreOwnerId: 'LG Store Owner Id', lgStoreWhsId: 'LG Store WHS Id', physicalAddress: 'Physical Address'}
    },
    shopifyConnector: {
      edit: 'Edit Shopify Connector',
      fields: {connectorName: 'Connector Name', baseUrl: 'Base URL', token: 'Token'}
    },
    'basicForm':{
      'title': 'Basic Form',
      'description': 'The form page is used to collect or verify user information. Basic forms can be used to collect, verify, and submit data.'
    },
    'formLayout':{
      'title': 'Form Layout',
      'description': 'The form layout page displays various forms, including horizontal, vertical, pop-up, and multi-column layouts.',
      'horizontalForm': 'Horizontal Form',
      'verticalForm': 'Vertical Form',
      'modalForm': 'Pop-up Form',
      'multiForm': 'Multi-column Form'
    },
    'advancedForm': {
      'title': 'Advanced Form',
      'description': 'Advanced forms are used to edit related information in the list.'
    },
    'dynamicForm': {
      'title': 'Dynamic Form',
      'description': 'Dynamic forms can be created based on the metadata (JSON) of the business object model. The creation is quick, structured, and easy to maintain. For details about the differences between forms and normal forms, see the actual code.'
    }
  }
}
