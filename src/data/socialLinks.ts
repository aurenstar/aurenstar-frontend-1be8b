// Official Aurenstar social profiles. Change the URLs here and every place that shows them updates.
// NOTE: provisional handles (@aurenstar). Confirm each link before publishing.
export interface SocialLink {
  key: 'facebook' | 'instagram' | 'pinterest' | 'youtube' | 'tiktok';
  label: string;
  url: string;
}

export const SOCIAL_LINKS: SocialLink[] = [
  { key: 'facebook', label: 'Facebook', url: 'https://www.facebook.com/aurenstar' },
  { key: 'instagram', label: 'Instagram', url: 'https://www.instagram.com/aurenstar' },
  { key: 'pinterest', label: 'Pinterest', url: 'https://www.pinterest.com/aurenstar' },
  { key: 'youtube', label: 'YouTube', url: 'https://www.youtube.com/@aurenstar' },
  { key: 'tiktok', label: 'TikTok', url: 'https://www.tiktok.com/@aurenstar' },
];
