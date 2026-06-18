import type { ImageMetadata } from 'astro';
import heroHomeSvg from '../assets/images/hero-home.svg';
import roofingSvg from '../assets/images/roofing.svg';
import sidingSvg from '../assets/images/siding.svg';
import windowsSvg from '../assets/images/windows.svg';
import doorsSvg from '../assets/images/doors.svg';
import guttersSvg from '../assets/images/gutters.svg';
import remodelingSvg from '../assets/images/remodeling.svg';

const assetModules = import.meta.glob<{ default: ImageMetadata }>(
  '../assets/images/*.{jpg,jpeg,png,webp,svg}',
  { eager: true }
);

function pickImage(stem: string, svgFallback: ImageMetadata): ImageMetadata {
  // Prefer real photos (jpg/jpeg/png/webp) over the SVG placeholder.
  for (const ext of ['jpg', 'jpeg', 'png', 'webp']) {
    const key = Object.keys(assetModules).find((k) => k.endsWith(`/${stem}.${ext}`));
    if (key) return assetModules[key].default;
  }
  const svgKey = Object.keys(assetModules).find((k) => k.endsWith(`/${stem}.svg`));
  if (svgKey) return assetModules[svgKey].default;
  return svgFallback;
}

export type ServiceSlug =
  | 'roofing'
  | 'siding'
  | 'windows'
  | 'doors'
  | 'gutters'
  | 'remodeling';

export interface Service {
  slug: ServiceSlug;
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  icon: string;
  cardDescription: string;
  subServices: string[];
  heroImage: ImageMetadata;
  showcaseImage: ImageMetadata;
  showcaseHeadline: string;
  showcaseBody: string;
  benefits: string[];
  faqs: { question: string; answer: string }[];
  metaTitle: string;
  metaDescription: string;
}

export const services: Service[] = [
  {
    slug: 'roofing',
    name: 'Roofing',
    shortName: 'Roofing',
    tagline: 'Stop the leaks before they start.',
    description:
      'From storm damage repairs to full roof replacements, we install quality shingles and metal systems built for Mid-Atlantic weather — wind, rain, ice, and heat.',
    icon: 'lucide:home',
    cardDescription:
      'Protect your home with durable roofing installed by reliable local crews and built for Mid-Atlantic weather.',
    subServices: [
      'Asphalt Shingle Roofing',
      'Metal Roofing',
      'Flat & Low-Slope Roofing',
      'Roof Repair',
      'Storm & Hail Damage',
    ],
    heroImage: pickImage('roofing-completed', roofingSvg),
    showcaseImage: pickImage('roofing-install', roofingSvg),
    showcaseHeadline: 'Stop the leaks before they start.',
    showcaseBody:
      'A failing roof puts everything underneath at risk. We inspect honestly, explain your options clearly, and install roofs that stand up to DMV seasons.',
    benefits: [
      'Full roof replacement & repair',
      'Storm & hail damage inspection',
      'Quality shingle & metal systems',
      'Clean job sites — we haul debris away',
    ],
    faqs: [
      {
        question: 'How do I know if I need a new roof or just a repair?',
        answer:
          'We start with a free inspection. If damage is localized — a few missing shingles or a small leak — repair may be enough. Widespread wear, curling shingles, or repeated leaks usually mean replacement is the better long-term value.',
      },
      {
        question: 'Do you help with insurance claims after storm damage?',
        answer:
          'Yes. We document damage with photos and detailed notes so you have what you need for your claim. We walk you through the process — no pressure, just straight answers.',
      },
    ],
    metaTitle: 'Roof Replacement in Fairfax, VA | Star Home Remodeling',
    metaDescription:
      'Expert roof replacement, repair, and storm damage inspection in Fairfax and the DMV. Free estimates. Local crews. Call 703-863-1919.',
  },
  {
    slug: 'siding',
    name: 'Siding',
    shortName: 'Siding',
    tagline: 'Curb appeal that holds up to four seasons.',
    description:
      'Replace worn or damaged siding with durable materials that protect your home and refresh its look — installed by crews who treat your property like their own.',
    icon: 'lucide:layers',
    cardDescription:
      'Refresh your exterior with siding that improves protection and gives your home a cleaner, updated look.',
    subServices: [
      'Vinyl Siding',
      'Fiber Cement Siding',
      'Composite Siding',
      'Siding Repair',
      'Trim, Soffit & Fascia',
    ],
    heroImage: pickImage('siding-bay', sidingSvg),
    showcaseImage: pickImage('siding-upper', sidingSvg),
    showcaseHeadline: 'Curb appeal that holds up to four seasons.',
    showcaseBody:
      'Cracked, faded, or moisture-damaged siding lets drafts and water in. New siding seals the envelope and gives your home a fresh face.',
    benefits: [
      'Vinyl, fiber cement & composite options',
      'Full replacement & targeted repair',
      'Improved energy efficiency',
      'Color & style guidance',
    ],
    faqs: [
      {
        question: 'How long does siding installation take?',
        answer:
          'Most single-family homes take several days to two weeks depending on size, material, and prep work. We give you a clear timeline before we start.',
      },
    ],
    metaTitle: 'Siding Replacement in Fairfax, VA | Star Home Remodeling',
    metaDescription:
      'Siding replacement and repair for Fairfax, Arlington, and the DMV. Quality materials, local installers. Free estimates.',
  },
  {
    slug: 'windows',
    name: 'Windows',
    shortName: 'Windows',
    tagline: 'Stop the drafts and lower your energy bills.',
    description:
      'Energy-efficient replacement windows that cut drafts, reduce noise, and brighten rooms — measured and installed for a tight, lasting fit.',
    icon: 'lucide:grid-2x2',
    cardDescription:
      'Improve comfort, curb appeal, and energy efficiency with modern replacement windows.',
    subServices: [
      'Double-Hung Windows',
      'Bow & Bay Windows',
      'Casement Windows',
      'Awning Windows',
      'Sliding Windows',
      'Picture & Specialty Windows',
    ],
    heroImage: pickImage('windows-double-hung', windowsSvg),
    showcaseImage: pickImage('windows-install', windowsSvg),
    showcaseHeadline: 'Stop the drafts and lower your energy bills.',
    showcaseBody:
      'Old windows leak air and make rooms uncomfortable. Modern replacements pay you back in comfort and lower utility costs.',
    benefits: [
      'Double & triple-pane options',
      'Custom measured & fitted',
      'Improved comfort & efficiency',
      'Manufacturer-backed products',
    ],
    faqs: [
      {
        question: 'Can you replace just a few windows?',
        answer:
          'Absolutely. We can replace one window or the whole house — whatever makes sense for your budget and priorities.',
      },
    ],
    metaTitle: 'Window Replacement in Fairfax, VA | Star Home Remodeling',
    metaDescription:
      'Replacement windows for Fairfax and the greater DMV. Energy-efficient, professionally installed. Free in-home estimates.',
  },
  {
    slug: 'doors',
    name: 'Doors',
    shortName: 'Doors',
    tagline: 'A welcoming entry that seals tight.',
    description:
      'Entry and patio doors that improve security, curb appeal, and weather sealing — installed with precision hardware and clean trim work.',
    icon: 'lucide:door-open',
    cardDescription:
      'Upgrade your entry points with secure, stylish doors that make a stronger first impression.',
    subServices: [
      'Front Entry Doors',
      'French Doors',
      'Sliding Glass Doors',
      'Patio Doors',
      'Storm Doors',
    ],
    heroImage: pickImage('doors-entry', doorsSvg),
    showcaseImage: pickImage('doors-sliding', doorsSvg),
    showcaseHeadline: 'A welcoming entry that seals tight.',
    showcaseBody:
      'A sticky, drafty front door is the first thing guests notice. We install doors that look great and close with confidence.',
    benefits: [
      'Entry & patio door replacement',
      'Improved security & weather sealing',
      'Hardware & trim included',
      'Styles to match your home',
    ],
    faqs: [],
    metaTitle: 'Door Replacement in Fairfax, VA | Star Home Remodeling',
    metaDescription:
      'Entry and replacement door installation in Fairfax, VA and the DMV. Free estimates. Call Star Home Remodeling.',
  },
  {
    slug: 'gutters',
    name: 'Gutters',
    shortName: 'Gutters',
    tagline: 'Move water away from your foundation.',
    description:
      'Seamless gutters and gutter protection that keep water flowing where it belongs — protecting your roofline, siding, and foundation.',
    icon: 'lucide:droplets',
    cardDescription:
      'Keep water moving away from your roofline and foundation with seamless gutters and gutter guards.',
    subServices: [
      'Seamless Gutters',
      'Gutter Guards & Protection',
      'Downspouts',
      'Gutter Repair',
    ],
    heroImage: pickImage('gutters', guttersSvg),
    showcaseImage: pickImage('gutters', guttersSvg),
    showcaseHeadline: 'Move water away from your foundation.',
    showcaseBody:
      'Clogged or sagging gutters cause fascia rot and basement moisture. We install systems sized right for your roof.',
    benefits: [
      'Seamless aluminum gutters',
      'Gutter guards & protection',
      'Repair & replacement',
      'Proper pitch & downspout placement',
    ],
    faqs: [],
    metaTitle: 'Gutter Installation in Fairfax, VA | Star Home Remodeling',
    metaDescription:
      'Gutters and gutter protection in Fairfax and Northern Virginia. Free inspections available.',
  },
  {
    slug: 'remodeling',
    name: 'General Remodeling',
    shortName: 'Remodeling',
    tagline: 'Thoughtful updates, room by room.',
    description:
      'Kitchen refreshes, bath updates, and interior remodeling projects managed with the same care we bring to exterior work.',
    icon: 'lucide:hammer',
    cardDescription:
      'Thoughtful interior and exterior updates managed with clear scope, clean sites, and steady communication.',
    subServices: [
      'Kitchen Remodeling',
      'Bathroom Remodeling',
      'Sunrooms & Additions',
      'Interior Updates',
    ],
    heroImage: pickImage('remodeling-bath', remodelingSvg),
    showcaseImage: pickImage('remodeling-interior', remodelingSvg),
    showcaseHeadline: 'Thoughtful updates, room by room.',
    showcaseBody:
      'Whether it is a kitchen layout or a full interior refresh, we plan with you and build to a standard we would accept in our own homes.',
    benefits: [
      'Kitchen & bath updates',
      'Interior remodeling',
      'Coordinated trades',
      'Clear scope & pricing',
    ],
    faqs: [],
    metaTitle: 'Home Remodeling in Fairfax, VA | Star Home Remodeling',
    metaDescription:
      'General remodeling and kitchen updates in Fairfax, VA. Local family-run contractor. Free consultations.',
  },
];

export const heroImage = pickImage('hero-home', heroHomeSvg);

export function getService(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}

export function getServiceSlugs(): ServiceSlug[] {
  return services.map((s) => s.slug);
}

export const quizServices = services.map((s) => ({
  id: s.slug,
  label: s.shortName,
}));
