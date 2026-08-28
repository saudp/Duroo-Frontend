import type { Metadata } from 'next'
import { getAboutPageData } from '@/lib/about'
import AboutHero from '@/components/about/AboutHero'
import StorySection from '@/components/about/StorySection'
import PhilosophyMoment from '@/components/about/PhilosophyMoment'
import AboutCTA from '@/components/about/AboutCTA'
import type { AboutPageData } from '@/lib/types'

export const metadata: Metadata = {
  title: 'About Us · Duroo',
  description:
    'Duroo is a Konkan-rooted, India-based streetwear brand from Raigad, Maharashtra — built on two generations, two loud voices, and one thread that connects them.',
}

// Fallback content — the finalized copy, used if the ACF Options Page
// hasn't been filled in yet (or the WP API is briefly unreachable). This
// means the About page is never blank in production; it just isn't
// editable from wp-admin until someone fills the real fields in.
const FALLBACK_DATA: AboutPageData = {
  hero: {
    lines: ['Two generations.', 'Two loud voices.', 'One thread that connects them.'],
    backgroundImage: null,
  },
  originStory: {
    eyebrow: 'OUR STORY',
    heading: 'Rooted in the Konkan.',
    body: `<p>Duroo was born on the western coast of Maharashtra, in Raigad — a district that carries the legacy of Chhatrapati Shivaji Maharaj and the Maratha empire in every stone of its forts and every story of its people.</p>
<p>Our founder grew up in this Konkani Marathi household, shaped by a legacy that runs deeper than land and history alone. The Maratha tradition wasn't just built on courage — it was built on deep respect for the women behind it: the mothers who raised warriors, the wives who stood beside them.</p>`,
    image: null,
  },
  nameStory: {
    eyebrow: 'THE NAME',
    heading: 'Bearer of Pearls.',
    body: `<p>Duroo takes its name from Durafsha, meaning "bearer of pearls" — the founder's wife, and the reason this brand exists at all. Naming the brand after her wasn't just a personal tribute; it was a continuation of the same legacy — where the women behind the story are never an afterthought, but the foundation.</p>`,
    image: null,
  },
  philosophy: {
    eyebrow: 'OUR PHILOSOPHY',
    intro: `<p>Every generation has a voice loud enough to define itself — millennials built theirs on reinvention and self-expression; Gen-Z is building theirs on authenticity and unapologetic identity. Both are searching for the same thing in different languages: clothing that says something true about who they are.</p>`,
    backgroundImage: null,
  },
  cta: {
    heading: 'Wear the Story.',
    buttonText: 'Shop the Collection',
    buttonLink: '/products',
  },
}

export default async function AboutPage() {
  const data = (await getAboutPageData()) ?? FALLBACK_DATA

  return (
    <main>
      <AboutHero data={data.hero} />
      <StorySection data={data.originStory} imageSide="right" />
      <StorySection data={data.nameStory} imageSide="left" />
      <PhilosophyMoment data={data.philosophy} taglinePayoff={data.hero.lines[2]} />
      <AboutCTA data={data.cta} />
    </main>
  )
}
