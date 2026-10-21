export default function Home() {
  return (
    <div className="site">
      <header>
        <a className="brand" href="/" aria-label="Parcel home">
          <svg width="28" height="30" viewBox="0 0 28 30" fill="none" aria-hidden="true">
            <path d="m14 2 12 7v13l-12 7L2 22V9L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
            <path d="m2 9 12 7 12-7M14 16v13M8 5.5l12 7V18" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
          </svg>
          parcel<span className="brand-dot">.</span>
        </a>
        <span className="header-note">A better delivery experience</span>
      </header>

      <main>
        <div className="eyebrow"><span className="dot" /> COMING SOON</div>
        <h1>Every parcel.<br /><span>A little more clarity.</span></h1>
        <p className="intro">From the first assignment to the final doorstep.<br className="desktop-break" /> A simpler way to bring customers, drivers, and deliveries together.</p>
        <a className="primary" href="#whats-ahead">See what’s ahead <span aria-hidden="true">↗</span></a>

        <section id="whats-ahead" aria-labelledby="ahead-heading">
          <div className="section-top"><h2 id="ahead-heading">One connected delivery journey</h2><span>WHAT WE’RE BUILDING</span></div>
          <div className="features">
            <article><span className="number">01 / CUSTOMERS</span><h3>Stay in the loop.</h3><p>Check your parcel’s latest delivery status with a tracking code.</p></article>
            <article><span className="number">02 / DRIVERS</span><h3>A clearer day ahead.</h3><p>Find daily assignments, delivery details, and instructions in one place.</p></article>
            <article><span className="number">03 / OPERATIONS</span><h3>Keep things moving.</h3><p>Organize parcels, manage drivers, and coordinate delivery assignments.</p></article>
          </div>
          <p className="availability">We’re getting things ready. Parcel tracking and staff tools are not available yet.</p>
        </section>
      </main>
      <footer><span>Parcel delivery management &amp; tracking</span><span>Built for the journey.</span></footer>
    </div>
  );
}
