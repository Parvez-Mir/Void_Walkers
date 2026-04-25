import { useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

const carouselImages = [
  { src: '/images/ahmedabad-property-1.jpg', title: 'Skyline Residences', location: 'SG Highway, Ahmedabad' },
  { src: '/images/ahmedabad-property-2.jpg', title: 'Palm Grove Villas', location: 'Bodakdev, Ahmedabad' },
  { src: '/images/ahmedabad-property-3.jpg', title: 'The Crown Penthouse', location: 'Prahlad Nagar, Ahmedabad' },
  { src: '/images/ahmedabad-property-4.jpg', title: 'Elite Gardens', location: 'Satellite, Ahmedabad' },
  { src: '/images/ahmedabad-property-5.jpg', title: 'Harmony Township', location: 'Thaltej, Ahmedabad' },
];

export function HeroCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'center' }, [
    Autoplay({ delay: 4000, stopOnInteraction: false, stopOnMouseEnter: true }),
  ]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl">
      <div className="h-full overflow-hidden" ref={emblaRef}>
        <div className="flex h-full">
          {carouselImages.map((image, index) => (
            <div key={image.src} className="relative h-full min-w-0 flex-[0_0_100%]">
              <img src={image.src} alt={image.title} className="h-full w-full object-cover" loading={index === 0 ? 'eager' : 'lazy'} />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <span className="mb-3 inline-block rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-amber-400">
                  Featured Property
                </span>
                <h3 className="mb-2 text-2xl font-bold text-white drop-shadow-lg md:text-3xl">{image.title}</h3>
                <p className="text-white/80">{image.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button onClick={scrollPrev} className="absolute left-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition hover:bg-white/20" aria-label="Previous slide">
        ‹
      </button>
      <button onClick={scrollNext} className="absolute right-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition hover:bg-white/20" aria-label="Next slide">
        ›
      </button>
    </div>
  );
}
