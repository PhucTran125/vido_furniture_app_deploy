import { AboutUs } from '@/components/AboutUs';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us | VIDO Furniture',
  description: 'Learn about VIDO Vietnam Furniture Joint Stock Company - an export-oriented manufacturer with experienced personnel and commitment to quality and sustainability.',
};

export default function AboutPage() {
  return <AboutUs />;
}
