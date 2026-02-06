import { Product, CompanyInfo } from './types';

export const COMPANY_INFO = {
  name: "VIDO VIET NAM FURNITURE JOINT STOCK COMPANY (VIDO FURNITURE JSC)",
  address: "Phuong La Village, Thai Phuong Commune, Hung Ha District, Thai Binh Province, Vietnam",
  hotline: "0914.717.866",
  contacts: [
    { name: "MR. HUY", nameVi: "MR. HUY", phone: "0927656111" },
    { name: "MS. BẢO YẾN", nameVi: "MS. BẢO YẾN", phone: "0968959859" }
  ],
  taxCode: "1001297080",
  email: "sales@vidofurniture.com"
};

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: {
      en: "Minimalist Gold-Leg Bench",
      vi: "Băng Ghế Minimalist Gold-Leg"
    },
    itemNo: "VWF22A1091LX-9C",
    image: 'Picture/1.jpg',
    category: "Bench",
    dimensions: {
      dai: 144,
      rong: 49,
      cao: 47
    },
    material: [
      { en: "Velvet Fabric (Standard)", vi: "Vải nhung (Như cũ)" },
      { en: "Metal Legs", vi: "Chân kim loại" }
    ]
  },
  {
    id: '2',
    name: {
      en: "Macaron Multi-purpose Ottoman – Flip Top Version",
      vi: "Ghế Đôn Macaron Đa Năng – Phiên Bản Lật Nắp"
    },
    itemNo: "VWF24A1317 (5)",
    image: 'Picture/5.jpg',
    category: "Ottoman",
    dimensions: {
      duong_kinh_mat_ghe: 30,
      chieu_cao_tong_the: 45,
      do_sau_long_ghe: 15
    },
    material: {
      vai: { en: "Malaysian Felt", vi: "Vải nỉ Malaysia" },
      go: { en: "Industrial Wood Core", vi: "Gỗ công nghiệp lõi" },
      chan_ghe: { en: "Eucalyptus Wood", vi: "Gỗ Tần Bạch đàn" }
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
    name: {
      en: "Scandinavian Decor Wooden Leg Stool",
      vi: "Ghế Đôn Decor Scandinavian Chân Gỗ"
    },
    itemNo: "VWF23A1691YR-1A (5)",
    image: 'Picture/9.jpg',
    category: "Stool",
    dimensions: {
      mat_ghe: "38x38",
      chieu_cao: 38,
      do_sau_long_ghe: 20
    },
    material: {
      vai: { en: "Bouclé Fabric (Faux Lambswool)", vi: "Vải Bouclé (lông cừu giả)" },
      khung: { en: "Plywood or Reinforced Plastic", vi: "Gỗ ván ép (Plywood) hoặc nhựa chịu lực" },
      chan_ghe: { en: "Natural Pine Wood", vi: "Gỗ Thông tự nhiên" }
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
    name: {
      en: "Bubble Storage Furniture Collection",
      vi: "Bộ Sưu Tập Nội Thất Bubble Storage"
    },
    itemNo: "VWF22A1317CG-2A",
    image: 'Picture/13.jpg',
    category: "Collection",
    setComponents: {
      ghe_don: {
        duong_kinh: 40,
        chieu_cao: [45, 35],
        dung_tich_luu_tru_lit: "10-15"
      },
      ghe_bang: {
        dai: 100,
        rong: 50,
        cao: 45
      }
    },
    material: {
      vai_boc: { en: "Corduroy Fabric", vi: "Vải Gân (Corduroy)" },
      mat_ban: { en: "Oak Veneer MDF", vi: "MDF phủ veneer sồi" },
      khung: { en: "Pine wood & Load-bearing plywood", vi: "Gỗ thông và ván chịu lực" },
      chan_ghe: { en: "Oak Wood", vi: "Gỗ Sồi" }
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
    name: {
      en: "Duo-Circle Natural Wood Tea Table",
      vi: "Bàn Trà Duo-Circle Gỗ Tự Nhiên"
    },
    itemNo: "VWF-DUO-CIRCLE",
    image: 'Picture/17.jpg',
    category: "Table",
    dimensions: {
      ban_lon: {
        duong_kinh: 60,
        chieu_cao: 50
      },
      ban_nho: {
        duong_kinh: 40,
        chieu_cao: 40
      }
    },
    material: {
      mat_ban: { en: "Oak Veneer MDF", vi: "MDF phủ Veneer Sồi" },
      be_mat: { en: "NC or Matte PU Paint", vi: "Sơn NC hoặc PU mờ" },
      khung_va_chan: { en: "Natural Oak Wood", vi: "Gỗ Sồi tự nhiên" }
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
    name: {
      en: "Sunny Yellow Kids Armchair",
      vi: "Ghế Armchair Kids Sunny Yellow"
    },
    itemNo: "VWF22A1214-11",
    image: 'Picture/21.jpg',
    category: "Armchair",
    dimensions: {
      rong: 55,
      sau: 50,
      cao: 60,
      chieu_cao_mat_ngoi: 25,
      tui_hong: "15x15"
    },
    material: {
      vo_boc: { en: "PU Leather or Simili", vi: "Da PU hoặc Simili" },
      dem_mut: { en: "Monolithic Foam D30/D40", vi: "Mút nguyên khối D30/D40" },
      khung: { en: "Anti-termite Natural Wood", vi: "Gỗ tự nhiên chống mối mọt" },
      chan_ghe: { en: "Rubber Wood or Oak", vi: "Gỗ Cao su hoặc Gỗ Sồi" }
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