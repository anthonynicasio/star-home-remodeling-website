export const siteConfig = {
  name: 'Star Home Remodeling',
  shortName: 'Star',
  tagline: 'Roofs, siding & windows, done right the first time.',
  description:
    'Family-run home improvement contractor serving Fairfax, VA and the greater DMV. Roofing, siding, windows, doors, gutters, and remodeling.',
  url: 'https://starhrc.com',
  phone: {
    primary: '703-863-1919',
    primaryTel: '+17038631919',
    secondary: '703-228-9525', // TODO: confirm with client    still in use?
    secondaryTel: '+17032289525',
  },
  email: 'info@starhrc.com', // TODO: confirm with client
  address: {
    street: '', // TODO: confirm with client    not published on current site
    city: 'Fairfax',
    state: 'VA',
    zip: '', // TODO: confirm with client
    country: 'US',
  },
  hours: {
    weekdays: 'Mon–Fri: 8:00 AM – 6:00 PM',
    saturday: 'Sat: 9:00 AM – 2:00 PM',
    sunday: 'Sun: Closed',
  },
  social: {
    facebook: 'https://www.facebook.com/1104128769453901', // TODO: confirm vanity URL
    instagram: '', // TODO: confirm with client
    google: '', // TODO: confirm with client
  },
  // Positioning that is standard for licensed contractors. The license NUMBER is
  // only displayed when provided below, so nothing fabricated is ever shown.
  licensedAndInsured: true,
  license: {
    number: '', // Add the state license # to display it in the footer.
    insurance: '',
  },
  warranty: '', // Add warranty wording once confirmed to surface it on the site.
  // Star rating + review count are only rendered when both are filled in.
  reviewCount: '',
  rating: '',
  promo: {
    enabled: false, // TODO: confirm any current seasonal offer
    message: 'Free roof & gutter inspection this season.',
    href: '/get-estimate',
  },
  serviceArea: [
    'Fairfax',
    'Arlington',
    'Alexandria',
    'Loudoun County',
    'Fairfax County',
    'Prince William County',
    'Montgomery County, MD',
    'Prince George\'s County, MD',
    'Washington, DC',
  ], // TODO: confirm exact cities/counties with client
  dmvZipPrefixes: ['20', '21', '22', '20'], // DC, MD, Northern VA ZIP prefixes (approximate)
  ga4Id: '', // TODO: client GA4 ID
  leadEmail: '', // TODO: confirm client's preferred CRM/email destination
} as const;

export function formatPhone(phone: string): string {
  return phone;
}

export function getNapString(): string {
  const { street, city, state, zip } = siteConfig.address;
  const line1 = street ? `${street}, ` : '';
  return `${line1}${city}, ${state}${zip ? ` ${zip}` : ''}`;
}
