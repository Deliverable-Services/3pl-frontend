export default {
  'form': {
    'breadcrumb': {
      'home': '首页',
      'formPage': '表单页',
      'basicForm': '基础表单',
      'formLayout': '表单布局',
      'advancedForm': '高级表单',
      'dynamicForm': '动态表单'
    },
    common: {
      create: '创造',
      update: '更新'
    },
    category: {
      add_category: '添加类别',
      edit_category: '编辑类别',
      fields: {category_name: '分类名称'}
    },
    product: {
      edit_product: '编辑产品',
      addMore: '添加更多',
      fields: {styleName: '样式名称', collection: '收藏', fabricComposition: '面料成分', fabricSwatch: '面料样本',
      logisticDescription: '物流说明', unitWeight: '单位重量', category: '类别', image: '图像', productSKU: '产品库存单位',
      color: '颜色', size: '尺寸', label: '标签', hastagColor: '标签颜色', localCurrency: '当地货币', localExwPrice: '本地出厂价',
      companyExwPrice: '公司出厂价'}
    },
    company: {
      title: '公司',
      edit_company: '编辑公司',
      fields: {companyName: '公司名称', companyAddress: '公司地址', primaryCurrency: '主要货币', primaryCurrencyCode: '主要货币代码',
      contactPerson: '联络人', contactPhone: '联系电话', contactEmail: '联系电子邮件', createdAt: '创建于', updatedAt: '更新于'}
    },
    currency: {
      edit_currency: '编辑货币',
      fields: {currencyName: '货币名称', currencyCode: '货币代码', exchangeRate: '汇率', remarks: '评论'}
    },
    creditTerms: {
      edit_currency: '编辑信用条款',
      fields: {termsSubject: '条款主题', creditDay: '信用日', termsDescription: '条款说明'}
    },
    connectionLocationList: {
      edit_location: '编辑连接位置',
      fields: {nodeId: '节点编号', nodeType: '节点类型', shopifyLocationId: 'Shopify 位置 ID', remarks: '评论',
      nodeDescription: '节点说明', nodeName: '节点名称', lGStoreOwnerId: 'LG 店主 ID', physicalAddress: '实际地址'}
    },
    shopifyConnector: {
      edit: '编辑 Shopify 连接器',
      fields: {connectorName: '连接器名称', baseUrl: '基本网址', token: '代币'}
    },
    'basicForm':{
      'title': '基础表单',
      'description': '表单页用于对用户信息进行收集或校验。基础表单具备数据收集、校验和提交功能。'
    },
    'formLayout':{
      'title': '表单布局',
      'description': '表单布局页展示了多种布局形式的表单，包含横向、垂直、弹框、多列等形式。',
      'horizontalForm': '横向表单',
      'verticalForm': '垂直表单',
      'modalForm': '弹窗表单',
      'multiForm': '多列表单'
    },
    'advancedForm': {
      'title': '高级表单',
      'description': '高级表单用于列表中编辑相关信息。'
    },
    'dynamicForm': {
      'title': '动态表单',
      'description': '根据业务对象模型的元数据（JSON）来创建动态表单，创建更加快速、且结构化方便维护，与正常表单具体使用差别请查看实际代码。'
    }
  }
}
