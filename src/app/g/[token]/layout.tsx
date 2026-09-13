import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Digital Flower Gift',
  description: 'A digital flower growing experience',
  robots: {
    index: false,
    follow: false,
  },
};

export default function GiftLayout({ children }: { children: React.ReactNode }) {
  return children;
}
