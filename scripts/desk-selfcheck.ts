import {
  articleBySlug,
  articleCategory,
  articleDate,
  articleIsFresh,
  articleLang,
  articleSlug,
  articles,
} from '../src/lib/articles';
import { loadInbox, loadWatchlist } from '../src/lib/desk/store';

const errors: string[] = [];

const slugs = articles.map((a) => articleSlug(a));
const unique = new Set(slugs);
if (unique.size !== slugs.length) errors.push('duplicate article slugs');
if (slugs.some((s) => !s)) errors.push('empty article slug');

const badDate = articles.find((a) => articleDate(a).getUTCFullYear() < 2010);
if (badDate) errors.push(`unrepaired date on ${badDate.id} ${articleDate(badDate).toISOString()}`);

const china = articles.find((a) => /china's religious crackdown/i.test(a.title));
if (china && articleLang(china) !== 'en') errors.push('English China title misclassified');

const kana = articles.find((a) => /[\u3040-\u309F]/.test(a.title));
if (kana && articleLang(kana) !== 'ja') errors.push('kana title not Japanese');

const hangul = articles.find((a) => /[\uAC00-\uD7AF]/.test(a.title));
if (hangul && articleLang(hangul) !== 'ko') errors.push('hangul title not Korean');

const hanTitle = articles.find(
  (a) => /[\u4E00-\u9FFF]/.test(a.title) && !/[\u3040-\u309F\u30A0-\u30FF\uAC00-\uD7AF]/.test(a.title),
);
if (hanTitle && articleLang(hanTitle) !== 'zh') {
  errors.push(`Han-only title classified as ${articleLang(hanTitle)}: ${hanTitle.title}`);
}

const koreaReligion = articles.find((a) => /hak ja han/i.test(a.title + a.previewText) && !/japan/i.test(a.title));
if (koreaReligion && articleCategory(koreaReligion) === 'japan') {
  errors.push('Korean Family Federation story categorized as Japan');
}

const featured = articles.find((a) => articleSlug(a) === slugs[0]);
if (featured && !articleBySlug(articleSlug(featured))) errors.push('articleBySlug miss');

if (articleIsFresh({ ...articles[0], createdAt: '2020-01-01T00:00:00.000Z', tweetId: '1', id: 'old' })) {
  errors.push('stale article marked fresh');
}

const watchlist = loadWatchlist();
for (const beat of watchlist.beats) {
  if (beat.handles.length > 20) errors.push(`${beat.id} exceeds 20 handles`);
  if (beat.handles.includes('business')) errors.push(`${beat.id} has placeholder handle`);
}

const inbox = loadInbox();
if (inbox.events.some((event) => event.reviewState === 'approved' && !event.title)) {
  errors.push('approved event missing title');
}

if (errors.length) {
  console.error('desk-selfcheck failed:');
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(
  `desk-selfcheck ok articles=${articles.length} slugs=${unique.size} beats=${watchlist.beats.length} inbox=${inbox.rawItems.length}`,
);
