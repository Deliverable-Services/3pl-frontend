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
          title: "product",
          link: "/product/products",
        },
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
       

        // {
        //   title: "Variant",
        //   link: "/product/product",
        // },
      ],
      link: "/",
      menuIcon: "icon icon-op-task",
    },

    {
      title: "purchasing",
      children: [
        {
          title: "poList",
          link: "/business/purchase-order",
          disabled: false
        },
        {
          title: "shipmentAndShipping",
          link: "/business/shipment-and-shipping",
          disabled: false
        },
        {
          title: "asnList",
          link: "#",
          disabled: true
        },
         {
          title: "payments",
          link: "#",
          disabled: true
        },
        {
          title: "vendor",
          link: "/business/vendor",
        },
        {
          title: "sPartner",
          link: "/business/shipping-partner",
        },
        // {
        //   title: "Trade Terms",
        //   link: "/business/trade-terms",
        // },
      ],
      link: "/",
      menuIcon: "icon icon-more-func",
    },
    {
      title: "inventory",
      menuIcon: "icon icon-go-story",
      children:[
        {
          title:"inventoryList",
          
          link: "/inventory"
        },
        {
          title:"inventoryOnlineList",
          link: "/inventory-online"
        },
        {
          title: "connectionLocationList",
          link: "/connection-location",
        },
        {
          title:"RfidSearch",
          link: "#",
          disabled: true
        }
      ],
    },

    {
      title: "transfers",
      menuIcon: "icon icon-go-story",
      children:[
        {
            title: "transferOrder",
            link: "/business/transfer-order",
        }
      ],
    },
    {
      title: "userManagement",
      menuIcon: "icon icon-go-story",
      children:[
        {
          title: "company",
          link: "/business/company",
        },
        {
          title:"user",
          link: "/user-management/user"
        },
        {
          title: "currency",
          link: "/business/currency",
        },
        {
          title: "creditTerms",
          link: "/credit-terms",
        },
        {
          title: "integration",
          link: "/business/shopify-connector",
        },
      ],
    }
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
