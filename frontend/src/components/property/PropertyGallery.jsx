import { useState } from 'react';
import { ChevronLeft, ChevronRight, Expand, X } from 'lucide-react';

export function PropertyGallery({ images, name }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const safeImages = images && images.length ? images : ['/images/ahmedabad-property-1.jpg'];

  const next = () => setCurrentIndex((p) => (p + 1) % safeImages.length);
  const prev = () => setCurrentIndex((p) => (p - 1 + safeImages.length) % safeImages.length);

  return (
    <>
      <div className="relative bg-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-2 h-[400px] md:h-[500px]">
            <div className="relative md:col-span-3 md:row-span-2 overflow-hidden group">
              <img
                src={safeImages[currentIndex]}
                alt={`${name} - Image ${currentIndex + 1}`}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />

              <button
                onClick={prev}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-all opacity-0 group-hover:opacity-100"
                type="button"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={next}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-all opacity-0 group-hover:opacity-100"
                type="button"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              <button
                onClick={() => setIsFullscreen(true)}
                className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20"
                type="button"
              >
                <Expand className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 left-4 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-white text-sm font-medium">
                {currentIndex + 1} / {safeImages.length}
              </div>
            </div>

            {safeImages.slice(0, 2).map((image, index) => (
              <button
                key={`${image}-${index}`}
                onClick={() => setCurrentIndex(index)}
                className={`relative hidden md:block overflow-hidden cursor-pointer group/thumb ${
                  currentIndex === index ? 'ring-2 ring-amber-400' : ''
                }`}
                type="button"
              >
                <img
                  src={image}
                  alt={`${name} - Thumbnail ${index + 1}`}
                  className="absolute inset-0 w-full h-full object-cover group-hover/thumb:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-slate-900/30 group-hover/thumb:bg-slate-900/10 transition-colors" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-slate-900/95 backdrop-blur-xl flex items-center justify-center">
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            type="button"
          >
            <X className="w-6 h-6" />
          </button>

          <button
            onClick={prev}
            className="absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            type="button"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>

          <div className="relative w-full max-w-5xl h-[80vh] mx-4">
            <img
              src={safeImages[currentIndex]}
              alt={`${name} - Image ${currentIndex + 1}`}
              className="absolute inset-0 w-full h-full object-contain"
            />
          </div>

          <button
            onClick={next}
            className="absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            type="button"
          >
            <ChevronRight className="w-8 h-8" />
          </button>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
            {safeImages.map((image, index) => (
              <button
                key={`fs-${image}-${index}`}
                onClick={() => setCurrentIndex(index)}
                className={`relative w-20 h-14 rounded-lg overflow-hidden ${
                  currentIndex === index ? 'ring-2 ring-amber-400' : 'opacity-60 hover:opacity-100'
                } transition-all`}
                type="button"
              >
                <img src={image} alt={`Thumbnail ${index + 1}`} className="absolute inset-0 w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
