const DEFAULT_AVATAR = 'https://api.realworld.io/images/smiley-cyrus.jpeg';

export function defaultImage(image: string | null | undefined): string {
  if (!image || image === 'null') return DEFAULT_AVATAR;
  return image;
}
