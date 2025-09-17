export default function JunkDrawer() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-sdm-text mb-4">
          Junk Drawer
        </h1>
      </div>

      {/* YouTube Video Section */}
      <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
        <div className="aspect-video">
          <iframe 
            className="w-full h-full rounded-lg"
            src="https://www.youtube.com/embed/2FpUrWEbr3w"
            title="YouTube video player" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
            allowFullScreen
          ></iframe>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
        <div className="text-center mb-8">
          <h2 className="font-display text-3xl font-bold text-sdm-text mb-2">
            Suspicious Minds Reading Group
          </h2>
          <p className="font-cooper text-lg text-sdm-text-light mb-1">
            Providence Athenaeum • 4th Tuesday of the Month
          </p>
          <p className="font-cooper text-sm text-sdm-text-light">
            5:00-7:00pm • Social time 5:00-5:30pm • Discussion 5:30-7:00pm
          </p>
        </div>

        <div className="grid gap-4 md:gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center p-4 bg-warm-gray-50 rounded-lg border-l-4 border-sdm-primary">
            <div className="flex-shrink-0 mb-2 sm:mb-0 sm:mr-4">
              <span className="inline-block bg-sdm-primary text-white px-3 py-1 rounded-full text-sm font-bold">
                SEP 23
              </span>
            </div>
            <div className="flex-grow">
              <h3 className="font-cooper font-bold text-lg text-sdm-text">Medea</h3>
              <p className="text-sdm-text-light">by Euripides (431 BCE)</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center p-4 bg-warm-gray-50 rounded-lg border-l-4 border-sdm-primary">
            <div className="flex-shrink-0 mb-2 sm:mb-0 sm:mr-4">
              <span className="inline-block bg-sdm-primary text-white px-3 py-1 rounded-full text-sm font-bold">
                OCT 28
              </span>
            </div>
            <div className="flex-grow">
              <h3 className="font-cooper font-bold text-lg text-sdm-text">Macbeth</h3>
              <p className="text-sdm-text-light">by William Shakespeare (1606ish)</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center p-4 bg-warm-gray-50 rounded-lg border-l-4 border-sdm-primary">
            <div className="flex-shrink-0 mb-2 sm:mb-0 sm:mr-4">
              <span className="inline-block bg-sdm-primary text-white px-3 py-1 rounded-full text-sm font-bold">
                NOV 25
              </span>
            </div>
            <div className="flex-grow">
              <h3 className="font-cooper font-bold text-lg text-sdm-text">&ldquo;The Nose&rdquo; & The Double</h3>
              <p className="text-sdm-text-light">by Nicolai Gogol (1836) & Fyodor Dostoevsky (1846)</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center p-4 bg-warm-gray-50 rounded-lg border-l-4 border-sdm-primary">
            <div className="flex-shrink-0 mb-2 sm:mb-0 sm:mr-4">
              <span className="inline-block bg-sdm-primary text-white px-3 py-1 rounded-full text-sm font-bold">
                DEC 16
              </span>
            </div>
            <div className="flex-grow">
              <h3 className="font-cooper font-bold text-lg text-sdm-text">The Turn of the Screw</h3>
              <p className="text-sdm-text-light">by Henry James (1898)</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center p-4 bg-warm-gray-50 rounded-lg border-l-4 border-sdm-accent">
            <div className="flex-shrink-0 mb-2 sm:mb-0 sm:mr-4">
              <span className="inline-block bg-sdm-accent text-white px-3 py-1 rounded-full text-sm font-bold">
                JAN 27
              </span>
            </div>
            <div className="flex-grow">
              <h3 className="font-cooper font-bold text-lg text-sdm-text">Julian</h3>
              <p className="text-sdm-text-light">by Gore Vidal (1964)</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center p-4 bg-warm-gray-50 rounded-lg border-l-4 border-sdm-accent">
            <div className="flex-shrink-0 mb-2 sm:mb-0 sm:mr-4">
              <span className="inline-block bg-sdm-accent text-white px-3 py-1 rounded-full text-sm font-bold">
                FEB 24
              </span>
            </div>
            <div className="flex-grow">
              <h3 className="font-cooper font-bold text-lg text-sdm-text">Gargoyles</h3>
              <p className="text-sdm-text-light">by Thomas Bernhard (1964)</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center p-4 bg-warm-gray-50 rounded-lg border-l-4 border-sdm-accent">
            <div className="flex-shrink-0 mb-2 sm:mb-0 sm:mr-4">
              <span className="inline-block bg-sdm-accent text-white px-3 py-1 rounded-full text-sm font-bold">
                MAR 24
              </span>
            </div>
            <div className="flex-grow">
              <h3 className="font-cooper font-bold text-lg text-sdm-text">The Crying of Lot 49</h3>
              <p className="text-sdm-text-light">by Thomas Pynchon (1969)</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center p-4 bg-warm-gray-50 rounded-lg border-l-4 border-sdm-accent">
            <div className="flex-shrink-0 mb-2 sm:mb-0 sm:mr-4">
              <span className="inline-block bg-sdm-accent text-white px-3 py-1 rounded-full text-sm font-bold">
                APR 28
              </span>
            </div>
            <div className="flex-grow">
              <h3 className="font-cooper font-bold text-lg text-sdm-text">The Third Reich</h3>
              <p className="text-sdm-text-light">by Roberto Bolaño (1989)</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center p-4 bg-warm-gray-50 rounded-lg border-l-4 border-sdm-accent">
            <div className="flex-shrink-0 mb-2 sm:mb-0 sm:mr-4">
              <span className="inline-block bg-sdm-accent text-white px-3 py-1 rounded-full text-sm font-bold">
                MAY 26
              </span>
            </div>
            <div className="flex-grow">
              <h3 className="font-cooper font-bold text-lg text-sdm-text">Foucault&apos;s Pendulum</h3>
              <p className="text-sdm-text-light">by Umberto Eco (first half) (1988)</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center p-4 bg-warm-gray-50 rounded-lg border-l-4 border-sdm-accent">
            <div className="flex-shrink-0 mb-2 sm:mb-0 sm:mr-4">
              <span className="inline-block bg-sdm-accent text-white px-3 py-1 rounded-full text-sm font-bold">
                JUN 23
              </span>
            </div>
            <div className="flex-grow">
              <h3 className="font-cooper font-bold text-lg text-sdm-text">Foucault&apos;s Pendulum</h3>
              <p className="text-sdm-text-light">by Umberto Eco (second half) (1988)</p>
            </div>
          </div>
        </div>

        <div className="mt-8 p-4 bg-sdm-primary/10 rounded-lg">
          <p className="text-sm text-sdm-text-light font-cooper text-center">
            <strong>Location:</strong> Bound at the Athenæum • <strong>Time:</strong> 5:00-7:00pm<br />
            Social time: 5:00-5:30pm • Discussion: 5:30-7:00pm
          </p>
        </div>
      </div>
    </div>
  );
}