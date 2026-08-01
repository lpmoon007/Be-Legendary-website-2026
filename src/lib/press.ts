// Single source of truth for press coverage — shared by the /press/ page and
// the reusable PressStrip. Real, linkable features only; nothing invented.
// The oldest piece (CNN, 2012) is the longevity anchor: being covered this long
// ago is the point — you don't get written up for something extraordinary until
// you've done it enough times to be great at it.

export interface PressItem {
  outlet: string;
  year: string;
  date: string;
  title: string;
  url: string;
  blurb?: string;
}

// The year the press first took notice — drives the "since 2012" framing.
export const PRESS_SINCE = '2012';

export const PRESS: PressItem[] = [
  { outlet: 'CNN', year: '2012', date: 'Mar 2012', title: 'Extreme retreats: Fire walks and snow survival with your workmates', url: 'https://edition.cnn.com/2012/03/26/business/extreme-retreats/index.html', blurb: 'On team retreats taken to the extreme — and what they’re really for.' },
  { outlet: 'CNN Money', year: '2018', date: 'Aug 2018', title: 'Where high-level executives go to recharge', url: 'https://web.archive.org/web/20180827210716/https://money.cnn.com/2018/08/27/pf/executive-retreats/index.html', blurb: 'Featuring Be Legendary. Archived from money.cnn.com, which has since retired.' },
  { outlet: 'Business Insider', year: '2018', date: 'Sep 2018', title: 'CEOs Are Going on $25,000 Executive Getaways to De-Stress', url: 'https://www.businessinsider.com/ceos-executive-getaways-de-stress-luxury-resorts-2018-9', blurb: 'By Katie Warren. Features Be Legendary’s executive retreats.' },
  { outlet: 'Business Destinations', year: '', date: '', title: 'Risky business', url: 'https://www.businessdestinations.com/work/risky-business/', blurb: 'By Nash Riggins. Quotes James Carter, founder of Be Legendary.' },
];
