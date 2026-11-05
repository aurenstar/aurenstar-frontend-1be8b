/**
 * Prints "old WordPress address -> new address" for every imported article (CSV).
 *   npm run wp:redirects > redirects.csv
 * Use it when blog.aurenstar.com is switched off, so old links and Google keep working.
 */
import { BLOG_ARTICLES } from '../src/data/blogArticles';
import { getArticleSlug } from '../src/utils/articleSlug';

console.log('old_address,new_address');
for (const a of BLOG_ARTICLES as any[]) {
  if (!a.wordpress) continue;
  console.log(`https://blog.aurenstar.com/?p=${a.wordpress.id},https://aurenstar.com/blog/${getArticleSlug(a)}`);
}
