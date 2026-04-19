import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="bg-surface-container/60 min-h-screen py-20 px-8">
      <div className="max-w-4xl mx-auto bg-surface-highest rounded-2xl p-10 md:p-16 shadow-float">
        <h1 className="text-4xl md:text-5xl font-black text-on-background mb-8 tracking-tight">About Crowdly</h1>
        <div className="space-y-6 text-text-secondary text-lg leading-relaxed">
          <p>
            Welcome to <strong className="text-primary">Crowdly</strong>, the ultimate platform designed to bring your ideas to life. Whether you are an aspiring entrepreneur, an artist with a vision, or a community leader looking to make a difference, we provide the tools and exposure you need to turn dreams into reality.
          </p>
          <p>
            Our mission is simple: to connect creators with backers who believe in them. We understand that behind every great project is a passionate individual or team, and we are here to support that journey every step of the way. 
          </p>
          <div className="py-6 border-y border-outline-variant my-8">
            <h2 className="text-2xl font-bold text-on-background mb-4">Why choose Crowdly?</h2>
            <ul className="list-disc pl-6 space-y-3">
              <li><strong>Global Reach:</strong> Your campaign is visible to backers from around the world, expanding your potential audience.</li>
              <li><strong>Secure Transactions:</strong> We partner with industry leaders to ensure every donation is processed safely.</li>
              <li><strong>Community Driven:</strong> Discover and back projects that align with your values and interests.</li>
            </ul>
          </div>
          <p>
            Since our inception, we have helped fund thousands of projects, raising millions of dollars for causes that matter. We believe that when people come together, incredible things happen. Join us in building a brighter, more innovative future.
          </p>
        </div>
        <div className="mt-12 text-center">
          <Link to="/explore">
            <button className="btn-primary">Explore Campaigns</button>
          </Link>
        </div>
      </div>
    </div>
  );
}