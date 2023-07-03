export default function (values: any) {
  return [
    {
      title: "product",
      children: [
        // {
        //   title: "Brand",
        //   link: "/product/brand",
        // },
        {
          title: "category",
          link: "/product/category",
        },
        // {
        //   title: "Material",
        //   link: "/product/material",
        // },
        // {
        //   title: "Unit",
        //   link: "/product/unit",
        // },
        {
          title: "product",
          link: "/product/products",
        },

        // {
        //   title: "Variant",
        //   link: "/product/product",
        // },
      ],
      link: "/",
      menuIcon: "icon icon-console",
    },

    {
      title: "resources",
      children: [
        {
          title: "company",
          link: "/business/company",
        },
        // {
        //   title: "Department",
        //   link: "/business/department",
        // },
        // {
        //   title: "Vendor",
        //   link: "/business/vendor",
        // },
        // {
        //   title: "Trade Terms",
        //   link: "/business/trade-terms",
        // },
        {
          title: "currency",
          link: "/business/currency",
        },
        {
          title: "creditTerms",
          link: "/credit-terms",
        },
        {
          title: "connectionLocationList",
          link: "/connection-location",
        },
        {
          title: "shopifyConnector",
          link: "/business/shopify-connector",
        },
      ],
      link: "/",
      menuIcon: "icon icon-console",
    },
    {
      title: "inventory",
      link: "/business/inventory",
      menuIcon: "icon icon-console",
    },
    // {
    //   title: "Connection Location",
    //   link: "/connection-location",
    //   // children: [],
    //   menuIcon: "icon icon-console",
    // },
    // {
    //   title: "Operation",
    //   children: [
    //     {
    //       title: "Purchase Order",menuIcon
    //       link: "/operation/purchase-order",
    //     },
    //     {
    //       title: "Shipment",
    //       link: "/operation/shipment",
    //     },
    //   ],
    //   link: "/",
    //   menuIcon: "icon icon-console",
    // },
  ];
}
