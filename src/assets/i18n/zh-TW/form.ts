export default {
  'form': {
    'breadcrumb': {
      'home': '家',
      'formPage': '形式',
      'basicForm': '基本形式',
      'formLayout': '表單佈局',
      'advancedForm': '高級表格',
      'dynamicForm': '動態表格'
    },
    common: {
      create: '創造',
      update: '更新'
    },
    category: {
      add_category: '添加類別',
      edit_category: '編輯類別',
      fields: {category_name: '分類名稱'}
    },
    product: {
      edit_product: '編輯產品',
      addMore: '添加更多',
      fields: {styleName: '款式名稱', collection: '收藏', fabricComposition: '面料成分', fabricSwatch: '面料樣本',
      logisticDescription: '物流說明', unitWeight: '單位重量', category: '類別', image: '圖像', productSKU: '產品SKU',
      color: '顏色', size: '尺寸', label: '標籤', hastagColor: '標籤顏色', localCurrency: '當地貨幣', localExwPrice: '本地出廠價',
      companyExwPrice: '公司出廠價'}
    },
    company: {
      title: '公司',
      edit_company: '編輯公司',
      fields: {companyName: '公司名稱', companyAddress: '公司地址', primaryCurrency: '主要貨幣', primaryCurrencyCode: '主要貨幣代碼',
      contactPerson: '聯絡人', contactPhone: '聯繫電話', contactEmail: '聯繫電子郵件', createdAt: '創建於', updatedAt: '更新於'}
    },
    currency: {
      edit_currency: '編輯貨幣',
      fields: {currencyName: '貨幣名稱', currencyCode: '貨幣代碼', exchangeRate: '匯率', remarks: '評論'}
    },
    creditTerms: {
      edit_currency: '編輯信用條款',
      fields: {termsSubject: '條款主題', creditDay: '信用日', termsDescription: '術語 說明'}
    },
    connectionLocationList: {
      edit_location: '編輯連接位置',
      fields: {nodeId: '節點號', nodeType: '節點類型', shopifyLocationId: 'Shopify 位置 ID', remarks: '評論',
      nodeDescription: '節點說明', nodeName: '節點名稱', lGStoreOwnerId: 'LG 店主 ID', physicalAddress: '實際地址'}
    },
    shopifyConnector: {
      edit: '編輯 Shopify 連接器',
      fields: {connectorName: '連接器名稱', baseUrl: '基本網址', token: '代幣'}
    },
    'basicForm':{
      'title': '基本形式',
      'description': '表單頁面用於收集或驗證用戶信息。 基本表單可用於收集、驗證和提交數據。'
    },
    'formLayout':{
      'title': '表單佈局',
      'description': '表單佈局頁面顯示各種表單，包括水平、垂直、彈出和多列佈局。',
      'horizontalForm': '臥式',
      'verticalForm': '立式',
      'modalForm': '彈出窗體',
      'multiForm': '多列表格'
    },
    'advancedForm': {
      'title': '高級表格',
      'description': '高級表單用於編輯列表中的相關信息。'
    },
    'dynamicForm': {
      'title': '動態表格',
      'description': '可以基於業務對像模型的元數據 (JSON) 創建動態表單。 創建快速、結構化且易於維護。 形式與普通形式的區別詳見實際代碼。'
    }
  }
}
