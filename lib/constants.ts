import { Product, CompanyInfo } from './types';

export const COMPANY_INFO = {
  name: "VIDO VIET NAM FURNITURE JOINT STOCK COMPANY (VIDO FURNITURE JSC)",
  address: "Phuong La Village, Thai Phuong Commune, Hung Ha District, Thai Binh Province, Vietnam",
  hotline: "0914.717.866",
  contacts: [
    { name: "Sales 01", nameVi: "Sales 01", email: "sales01@vidointernational.com", phone: "(+86) 13960794413" },
    { name: "Sales 02", nameVi: "Sales 02", email: "sales02@vidointernational.com", phone: "(+84) 792089618" }
  ],
  taxCode: "1001297080",
  email: "sales01@vidointernational.com",
  whatsappNumber: "8613960794413"
};

export const PRODUCTS: Product[] = [
  {
    id: '1',
    itemNo: "VWF22A1091LX-9C",
    category: "Bench",
    name: {
      en: "Minimalist Gold-Leg Bench",
      vi: "Băng Ghế Minimalist Gold-Leg"
    },
    images: [
      { url: 'Picture/1.jpg', isMain: true, displayOrder: 1 }
    ],
    dimensions: {
      en: ["L144 x W49 x H47 cm"],
      vi: ["L144 x W49 x H47 cm"]
    },
    material: {
      en: ["Velvet Fabric (Standard)", "Metal Legs"],
      vi: ["Vải nhung (Như cũ)", "Chân kim loại"]
    }
  },
  {
    id: '2',
    itemNo: "VWF24A1317 (5)",
    category: "Ottoman",
    name: {
      en: "Macaron Multi-purpose Ottoman - Flip Top Version",
      vi: "Ghế Đôn Macaron Đa Năng - Phiên Bản Lật Nắp"
    },
    images: [
      { url: 'Picture/5.jpg', isMain: true, displayOrder: 1 }
    ],
    dimensions: {
      en: ["Ø30 x H45 cm", "Seat depth: 15cm"],
      vi: ["Ø30 x H45 cm", "Độ sâu ghế: 15cm"]
    },
    material: {
      en: ["Malaysian Felt fabric", "Industrial Wood Core", "Eucalyptus Wood legs"],
      vi: ["Vải nỉ Malaysia", "Gỗ công nghiệp lõi", "Chân gỗ Tần Bạch đàn"]
    },
    description: {
      en: [
        "2-tier rounded body design, creating a soft, elegant look",
        "Reversible lid: one side cushioned for sitting, the other is flat wood for use as a tea table",
        "Splayed natural wood legs for stability"
      ],
      vi: [
        "Thiết kế thân ghế chia 2 tầng bo tròn, tạo cảm giác mềm mại",
        "Nắp ghế lật 2 mặt: một mặt bọc nệm để ngồi, mặt kia là gỗ phẳng làm bàn trà",
        "Chân gỗ tự nhiên dáng choe ra vững chãi"
      ]
    }
  },
  {
    id: '3',
    itemNo: "VWF23A1691YR-1A (5)",
    category: "Stool",
    name: {
      en: "Scandinavian Decor Wooden Leg Stool",
      vi: "Ghế Đôn Decor Scandinavian Chân Gỗ"
    },
    images: [
      { url: 'Picture/9.jpg', isMain: true, displayOrder: 1 }
    ],
    dimensions: {
      en: ["38x38cm", "H38cm", "Seat depth: 20cm"],
      vi: ["38x38cm", "H38cm", "Độ sâu ghế: 20cm"]
    },
    material: {
      en: ["Bouclé Fabric (Faux Lambswool)", "Plywood or Reinforced Plastic frame", "Natural Pine Wood legs"],
      vi: ["Vải Bouclé (lông cừu giả)", "Khung gỗ ván ép hoặc nhựa chịu lực", "Chân gỗ Thông tự nhiên"]
    },
    description: {
      en: [
        "Smart flip-top design converts stool into a small table",
        "Spacious storage compartment inside to save space",
        "Rounded shape fits many interior styles"
      ],
      vi: [
        "Thiết kế lật nắp thông minh chuyển đổi ghế và bàn trà",
        "Ngăn chứa đồ rộng rãi, tiết kiệm diện tích",
        "Kiểu dáng bo tròn phù hợp nhiều phong cách nội thất"
      ]
    }
  },
  {
    id: '4',
    itemNo: "VWF22A1317CG-2A",
    category: "Collection",
    name: {
      en: "Bubble Storage Furniture Collection",
      vi: "Bộ Sưu Tập Nội Thất Bubble Storage"
    },
    images: [
      { url: 'Picture/13.jpg', isMain: true, displayOrder: 1 }
    ],
    material: {
      en: ["Corduroy Fabric", "Oak Veneer MDF top", "Pine wood & Load-bearing plywood frame", "Oak Wood legs"],
      vi: ["Vải Gân (Corduroy)", "Mặt MDF phủ veneer sồi", "Khung gỗ thông và ván chịu lực", "Chân gỗ Sồi"]
    },
    setComponents: {
      ottoman: {
        diameter: 40,
        heights: [45, 35],
        storageCapacity: "10-15L"
      },
      bench: {
        length: 100,
        width: 50,
        height: 45
      }
    },
    description: {
      en: [
        "Available individually or as a combo set",
        "Flip top transforms the seat into a tea table",
        "Rounded design is safe for families with small children"
      ],
      vi: [
        "Có thể bán lẻ hoặc bán theo combo",
        "Nắp lật biến ghế thành bàn trà",
        "Thiết kế bo tròn an toàn cho gia đình có trẻ nhỏ"
      ]
    }
  },
  {
    id: '5',
    itemNo: "VWF-DUO-CIRCLE",
    category: "Table",
    name: {
      en: "Duo-Circle Natural Wood Tea Table",
      vi: "Bàn Trà Duo-Circle Gỗ Tự Nhiên"
    },
    images: [
      { url: 'Picture/17.jpg', isMain: true, displayOrder: 1 }
    ],
    dimensions: {
      en: ["Large: Ø60xH50cm", "Small: Ø40xH40cm"],
      vi: ["Lớn: Ø60xH50cm", "Nhỏ: Ø40xH40cm"]
    },
    material: {
      en: ["Oak Veneer MDF tabletop with NC or Matte PU Paint", "Natural Oak Wood frame and legs"],
      vi: ["Mặt bàn MDF phủ Veneer Sồi với sơn NC hoặc PU mờ", "Khung và chân gỗ Sồi tự nhiên"]
    },
    description: {
      en: [
        "2-tier design optimizes living space",
        "Rustic style that is easy to coordinate with interiors",
        "Multi-purpose: sofa table, balcony tea table, or bedside table"
      ],
      vi: [
        "Thiết kế 2 tầng tối ưu diện tích",
        "Phong cách mộc mạc dễ phối nội thất",
        "Đa năng: bàn sofa, bàn trà ban công, tab đầu giường"
      ]
    }
  },
  {
    id: '6',
    itemNo: "VWF22A1214-11",
    category: "Armchair",
    name: {
      en: "Sunny Yellow Kids Armchair",
      vi: "Ghế Armchair Kids Sunny Yellow"
    },
    images: [
      { url: 'Picture/21.jpg', isMain: true, displayOrder: 1 }
    ],
    dimensions: {
      en: ["W55 x D50 x H60 cm", "Seat height: 25cm", "Side pocket: 15x15cm"],
      vi: ["W55 x D50 x H60 cm", "Chiều cao ghế: 25cm", "Túi bên: 15x15cm"]
    },
    material: {
      en: ["PU Leather or Simili upholstery", "Monolithic Foam D30/D40", "Anti-termite Natural Wood frame", "Rubber Wood or Oak legs"],
      vi: ["Vỏ bọc da PU hoặc Simili", "Đệm mút nguyên khối D30/D40", "Khung gỗ tự nhiên chống mối mọt", "Chân gỗ Cao su hoặc Gỗ Sồi"]
    },
    description: {
      en: [
        "Convenient side pocket for kids",
        "Classic button-tufted back decoration",
        "Rounded design ensures absolute safety",
        "Lemon yellow color stimulates child development"
      ],
      vi: [
        "Túi hông tiện lợi cho bé",
        "Nút lưng trang trí phong cách cổ điển",
        "Thiết kế bo tròn an toàn tuyệt đối",
        "Màu vàng chanh kích thích trí não trẻ em"
      ]
    }
  }
];