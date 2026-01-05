import slugify from 'slugify';

export function createSlug(text: string) {
  //@ts-ignore
  return slugify(text, {
    lower: true,
    strict: true,
    trim: true,
  });
}
