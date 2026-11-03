// Official Aurenstar social profiles. Change the URLs here and every place that shows them updates.
export interface SocialLink {
  key: 'facebook' | 'instagram' | 'pinterest' | 'youtube' | 'tiktok';
  label: string;
  url: string;
}

export const SOCIAL_LINKS: SocialLink[] = [
  { key: 'facebook', label: 'Facebook', url: 'https://www.facebook.com/aurenstarofficial' },
  { key: 'instagram', label: 'Instagram', url: 'https://www.instagram.com/aurenstarofficial/' },
  { key: 'pinterest', label: 'Pinterest', url: 'https://br.pinterest.com/Aurenstarbysafare/' },
  { key: 'youtube', label: 'YouTube', url: 'https://www.youtube.com/@Aurenstarbysafare' },
  { key: 'tiktok', label: 'TikTok', url: 'https://www.tiktok.com/@aurenstar.com' },
];
