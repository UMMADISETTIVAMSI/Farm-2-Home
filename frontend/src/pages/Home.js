import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="pt-20" style={{background: 'linear-gradient(to bottom right, var(--bg-primary), var(--bg-secondary), var(--bg-tertiary))'}}>
        <div className="container mx-auto px-6 py-20">
          <div className="text-center animate-fade-in">
            <h1 className="text-6xl md:text-7xl font-bold mb-6 theme-text-primary">
              <i className="fas fa-seedling mr-4 animate-bounce-slow"></i>
              Farm2Home
            </h1>
            <p className="text-2xl md:text-3xl mb-8 theme-text-primary font-light">
              Connecting Farmers & Consumers Directly
            </p>
            <p className="text-lg mb-12 theme-text-secondary max-w-2xl mx-auto">
              Skip the middleman. Get fresh, organic produce straight from local farms to your table.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="theme-card theme-text-accent px-8 py-4 rounded-full font-semibold text-lg hover:opacity-90 transition-all duration-300 hover:scale-105 shadow-xl">
                <i className="fas fa-rocket mr-2"></i>Start Your Journey
              </Link>
              <Link to="/login" className="border-2 theme-border theme-text-primary px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/10 transition-all duration-300 hover:scale-105">
                <i className="fas fa-sign-in-alt mr-2"></i>Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20" style={{backgroundColor: 'var(--bg-card)'}}>
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold theme-text-primary mb-4">Why Choose Farm2Home?</h2>
            <p className="text-xl theme-text-secondary">Experience the difference of direct farm-to-table shopping</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="theme-card p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 animate-slide-up">
              <div className="text-4xl mb-4 theme-text-accent">
                <i className="fas fa-leaf"></i>
              </div>
              <h3 className="text-2xl font-bold mb-4 theme-text-primary">Fresh & Organic</h3>
              <p className="theme-text-secondary leading-relaxed">Get the freshest, pesticide-free produce harvested just for you from certified organic farms.</p>
            </div>
            <div className="theme-card p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 animate-slide-up" style={{animationDelay: '0.2s'}}>
              <div className="text-4xl mb-4 theme-text-accent">
                <i className="fas fa-truck"></i>
              </div>
              <h3 className="text-2xl font-bold mb-4 theme-text-primary">Fast Delivery</h3>
              <p className="theme-text-secondary leading-relaxed">Quick and reliable delivery from local farms in your area, ensuring maximum freshness.</p>
            </div>
            <div className="theme-card p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 animate-slide-up" style={{animationDelay: '0.4s'}}>
              <div className="text-4xl mb-4 theme-text-accent">
                <i className="fas fa-heart"></i>
              </div>
              <h3 className="text-2xl font-bold mb-4 theme-text-primary">Support Local</h3>
              <p className="theme-text-secondary leading-relaxed">Directly support local farmers and contribute to your community's economic growth.</p>
            </div>
          </div>
        </div>
      </div>


    </div>
  );
};

export default Home;