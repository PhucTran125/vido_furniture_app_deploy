export interface LocalizedContent {
  en: string;
  vi: string;
}

export interface Product {
  id: string;
  name: LocalizedContent;
  itemNo: string;
  image: string;
  category: string;
  
  // Flexible fields
  dimensions?: any; 
  material?: any; // Values can be LocalizedContent
  description?: { en: string[]; vi: string[] }; 
  setComponents?: any; 
}

export interface NavItem {
  label: string;
  href: string;
}

export interface CompanyInfo {
  name: string;
  address: string;
  hotline: string;
  taxCode: string;
  email?: string;
}

export type PageType = 'home' | 'about' | 'blog' | 'export-quality' | 'customer-service' | 'factory';