export default {
  list: {
    breadcrumb: {
      home: 'Home',
      formPage: 'List',
      basicList: 'Basic List',
      cardList: 'Card List',
      editableList: 'Editable List',
      advanceList: 'Advance List',
      treeList: 'Tree List'
    },
    resources: {
      title: 'Resources',
    },
    company: {
      title: 'Company',
    },
    category: {
      title: 'Category Setup',
      categoryList: 'Category List',
      buttonTitle: 'Add Category',
      table: {categoryName: 'Category Name', createdAt: 'Created At', createdBy: 'Created By', 
      lastUpdatedDateTime: 'Last Updated Date Time', lastUpdatedBy: 'Last Updated By'},
      search: 'Search with Category Name'
    },
    product: {
      title: 'Product List',
      list: 'Product List',
      buttonTitle: 'Add Product',
      searchOne: 'Filter By Status',
      searchTwo: 'Search with Style Name',
      table: {styleName: 'Style Name', collection: 'Collection', logisticDescription: 'Logistic Description', activeStatus: 'Active Status',
      updatedDate: 'Updated Date'}
    },
    currency: {
      title: 'Currency',
      list: 'Currency List',
      buttonTitle: 'Add Currency',
      searchOne: 'Search for Currency Code',
      table: {currencyName: 'Currency Name', currencyCode: 'currency Code', rate: 'Rate'}
    },
    creditTerms: {
      title: 'Credit Terms',
      list: 'Credit Terms List',
      buttonTitle: 'Add Credit Terms',
      table: {subject: 'Subject', details: 'Details', creditDay: 'Credit Day'}
    },
    connectionLocationList: {
      title: 'Node Setup',
      list: 'Inventory Node List',
      buttonTitle: 'Add Inventory Node',
      table: {nodeName: 'Node Name', nodeType: 'Node Type', lGStoreOwnerId: 'LG Store Owner Id', lGWMSID: 'LG WMS ID', shopifyLocationId: 'Shopify Location Id',
      lastUpdatedDateTime: 'Last Updated Date Time', lastUpdatedBy: 'Last Updated By'}
    },
    vendor: {
      title: 'Vendor Setup',
      list: 'Vendor List',
      buttonTitle: 'Add',
      searchOne: 'Search with Vendor Name',
      searchTwo: 'Search with Vendor Code',
      table: {companyName: 'Company Name', generalPhone: 'General Phone', primaryContactName: 'Primary Contact Name', primaryContactPhone1: 'Primary Contact Phone 1',
      status: 'Status'}
    },
    shopifyConnector: {
      title: 'Shopify Connector',
      list: 'Shopify Connector List',
      buttonTitle: 'Add Shopify Connector',
      table: {connectorName: 'Connector Name', baseURL: 'Base URL', token: 'Token'}
    },
    inventory: {
      title: 'Inventory',
      inventoryList:"Inventory List",
      dropdown:"Select a Inventory Node",
      inventoryNode:"Inventory Node",
      TtQty:"Total Qty",
      AvlQty:"Avl. Qty",
      UnavlQty:"Unavl. Qty",
      TrQty:"Transf. Qty",
      POQty:"PO Qty",
      sku:"SKU",
      skuType:"SKU Type",
      skuDesc:"SKU Desc",
      styleName:"Style Name",
      skuSearch:"Search with SKU",
      styleSearch:"Search with Style Name",
      list: 'Inventory List'
    },
    inventoryList:{
      title:"Overview",
    },
    inventoryOnlineList: {
      title: 'Online Stock Cross Check',
      dropdown:"Select a Inventory Node",
      stockOwnerId:"Stock Owner ID",
      color:"Color",
      warehouseId:"WH ID",
      wmsAvailableQty:"WMS Avl Qty",
      wmsQcQty:"WMS Qc Qty",
      wmsLockedQty:"WMS Lock Qty",
      shpSohQty:"Shop Soh Qty",
      shpAvlQty:"Shop Avl Qty",
      shpCommittedQty:"Shop Com. Qty",
      shpReservedQty:"Shop Res Qty",
      size:"Size",
      sku:"SKU",
      shopifyVariantId:"Shopify Variant ID",
      styleName:"Style Name",
      skuSearch:"Search with SKU",
      styleSearch:"Search with Style Name",
      list: 'Inventory Online List'
    },
    userManagement: {
      title: 'Administration',
    },
    RfidSearch:{
      title: 'RFID Search',
    },
    integration:{
      title: 'Integration',
    },
    purchasing:{
      title: 'Purchasing',
    },
    poList:{
      title:"PO List"
    },
    shipmentAndShipping:{
      title:"Shipment & Shipping"
    },
    asnList:{
      title: "ASN List"
    },
    payments:{
      title: "Payments",
    },
    businessCategory:{
      title: 'Business'
    },
    transfers:{
      title: "Transfers"
    },
    user: {
      title: 'User',
      list: 'User List',
      searchOne: 'Search with Username',
      searchTwo: 'Search with Department',
      searchThree: 'Search with Title',
      searchFour: 'Select a Group',
      table: {userId: 'User Id', username: 'Username', department: 'Department', title: 'Title', group: 'Group', roles: 'Roles'}
    },
    basicList: {
      title: 'Basic List',
      description: 'Allows users to adjust the list size and spacing.'
    },
    cardList: {
      title: 'Card List',
      description: 'Information can be displayed in card format and the search function is supported.'
    },
    editableList: {
      title: 'Editable List',
      description: 'Supports table extension and table editing.'
    },
    advanceList: {
      title: 'Advance List',
      description: 'Allows users to select multiple items in the list and delete them in batches. Allows users to adjust the column width by dragging and dragging. Supports virtual scrolling, lazy loading, and filtering.'
    },
    treeList: {
      title: 'Tree List',
      description: 'Tree table rendering is supported.'
    },
    sPartner: {
      title: 'Shipping Setup',
      categoryList: 'Shipping Partner List',
      buttonTitle: 'Add',
      searchOne: 'Search for Currency Code',
      table: {companyName: 'Company Name', generalEmail: 'General Email', generalPhone: 'General Phone', primaryContactName: 'Primary Contact Name',
      primaryContactEmail: 'Primary Contact Email', primaryContactPhone1: 'Primary Contact Phone 1', primaryContactPhone2: 'Primary Contact Phone 2'}
    },
    common: {
      buttonTitleAdd: 'Add',
      buttonTitleEdit: 'Edit'
    },
    transferOrder:{
        status: "Status",
        id: "TO No.",
        nodeName:"Destination",
        nodeName2:"Origin",
        receiptDiscrepancy:"Discrepancy",
        list:"Transfer Order",
        title:"TO List",
        buttonTitle:"Create Transfer Order",
        actions:"Actions",
        lastModifiedDate: "Updated Date",
        lastModifiedBy: "Updated By"
    },
    purchaseOrder:{
      status: "Status",
      id: "PO No.",
      nodeName:"Vendor",
      nodeName2:"Shipping to Department",
      receiptDiscrepancy:"Sample Status",
      list:"Transfer Order",
      title:"PO List",
      buttonTitle:"Create Purchase Order",
      actions:"Actions",
      lastModifiedDate: "Updated Date",
      lastModifiedBy: "Updated By"
  },
  sAndS:{
    status: "Status",
    id: "Shipment No.",
    nodeName:"Vendor",
    nodeName2:"Shipping to Department",
    receiptDiscrepancy:"Sample Status",
    list:"Shipment & Shipping",
    title:"Shipping Order List",
    buttonTitle:"Create Shipping Order",
    actions:"Actions",
    lastModifiedDate: "Updated Date",
    lastModifiedBy: "Updated By"
  }
  },
};
