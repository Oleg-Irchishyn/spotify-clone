import type { Metadata } from 'next';

import ContributorsView from '@/app/components/ContributorsView/ContributorsView';

export const metadata: Metadata = {
  title: 'Contributors - Music Platform',
  description: 'Browse the users who can upload and edit content.',
};

export default function ContributorsPage() {
  return <ContributorsView />;
}
