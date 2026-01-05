export type TagType = 'default' | 'primary' | 'accent';
export type TagSize = 'sm' | 'md' | 'lg';
export interface TagProps {
  tag: string;
  type?: TagType;
  size?: TagSize;
  showIcon?: boolean;
  showHash?: boolean;
  href?: string;
}
