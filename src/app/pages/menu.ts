export default function (values: any) {
  return [
    {
      title: "Product",
      children: [
        {
          title: "Brand",
          link: "/product/brand",
        },
        {
          title: "Category",
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
          title: "Product",
          link: "/product/style",
        },

        {
          title: "Product Variant",
          link: "/product/product",
        },
      ],
      link: "/",
      menuIcon: "icon icon-console",
    },

    {
      title: "Business",
      children: [
        {
          title: "Company",
          link: "/business/company",
        },
        {
          title: "Department",
          link: "/business/department",
        },
        {
          title: "Vendor",
          link: "/business/vendor",
        },
        {
          title: "Trade Terms",
          link: "/business/trade-terms",
        },
        {
          title: "Exchange Rate",
          link: "/business/exchange-rate",
        },
      ],
      link: "/",
      menuIcon: "icon icon-console",
    },
    // {
    //   title: "Operation",
    //   children: [
    //     {
    //       title: "Purchase Order",
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
