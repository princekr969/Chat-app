"use client"
import { Pencil, Zap, Users, Download, Share2, Layers } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function App() {
  const router = useRouter();

  function navigateToSignin(){
    router.push("/auth/signin");
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <nav className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Pencil className="w-8 h-8 text-blue-400" />
            <span className="text-2xl font-bold">Excelidraw</span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="hover:text-blue-400 transition-colors">Features</a>
            <button onClick={navigateToSignin} className="bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded-lg font-semibold transition-colors">
              Get Started
            </button>
          </div>
        </div>
      </nav>

      <main>
        <section className="container mx-auto px-6 py-20 md:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Create Beautiful Diagrams Effortlessly
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed">
              A powerful, intuitive drawing tool for sketching diagrams, wireframes, and illustrations.
              Simple enough for everyone, powerful enough for professionals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={navigateToSignin} className="bg-blue-500 hover:bg-blue-600 px-8 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105 shadow-lg shadow-blue-500/50">
                Start Drawing Now
              </button>
              {/* <button className="bg-gray-700 hover:bg-gray-600 px-8 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105">
                View Examples
              </button> */}
            </div>
          </div>
        </section>

        <section id="features" className="container mx-auto px-6 py-20">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            Everything You Need to Create
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl border border-gray-700 hover:border-blue-500 transition-all hover:shadow-xl hover:shadow-blue-500/20">
              <div className="w-14 h-14 bg-blue-500/20 rounded-lg flex items-center justify-center mb-6">
                <Zap className="w-7 h-7 text-blue-400" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Lightning Fast</h3>
              <p className="text-gray-400 leading-relaxed">
                Blazing fast performance with smooth canvas interactions. No lag, no delays, just pure creativity.
              </p>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl border border-gray-700 hover:border-cyan-500 transition-all hover:shadow-xl hover:shadow-cyan-500/20">
              <div className="w-14 h-14 bg-cyan-500/20 rounded-lg flex items-center justify-center mb-6">
                <Users className="w-7 h-7 text-cyan-400" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Real-time Collaboration</h3>
              <p className="text-gray-400 leading-relaxed">
                Work together with your team in real-time. See changes instantly and communicate seamlessly.
              </p>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl border border-gray-700 hover:border-blue-500 transition-all hover:shadow-xl hover:shadow-blue-500/20">
              <div className="w-14 h-14 bg-blue-500/20 rounded-lg flex items-center justify-center mb-6">
                <Layers className="w-7 h-7 text-blue-400" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Infinite Canvas</h3>
              <p className="text-gray-400 leading-relaxed">
                Never run out of space. Pan, zoom, and create without boundaries on an unlimited canvas.
              </p>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl border border-gray-700 hover:border-cyan-500 transition-all hover:shadow-xl hover:shadow-cyan-500/20">
              <div className="w-14 h-14 bg-cyan-500/20 rounded-lg flex items-center justify-center mb-6">
                <Download className="w-7 h-7 text-cyan-400" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Export Anywhere</h3>
              <p className="text-gray-400 leading-relaxed">
                Export your creations as PNG, SVG, or JSON. Perfect for presentations, documentation, and more.
              </p>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl border border-gray-700 hover:border-blue-500 transition-all hover:shadow-xl hover:shadow-blue-500/20">
              <div className="w-14 h-14 bg-blue-500/20 rounded-lg flex items-center justify-center mb-6">
                <Share2 className="w-7 h-7 text-blue-400" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Easy Sharing</h3>
              <p className="text-gray-400 leading-relaxed">
                Share your work with a single link. No sign-ups required for viewers, just instant access.
              </p>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl border border-gray-700 hover:border-cyan-500 transition-all hover:shadow-xl hover:shadow-cyan-500/20">
              <div className="w-14 h-14 bg-cyan-500/20 rounded-lg flex items-center justify-center mb-6">
                <Pencil className="w-7 h-7 text-cyan-400" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Hand-drawn Style</h3>
              <p className="text-gray-400 leading-relaxed">
                Give your diagrams a unique, sketchy look that stands out from traditional boring diagrams.
              </p>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-6 py-20">
          <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-2xl p-12 md:p-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Start Creating?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of creators who trust Excelidraw for their visual communication needs.
            </p>
            <button className="bg-blue-500 hover:bg-blue-600 px-10 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105 shadow-lg shadow-blue-500/50">
              Launch Excelidraw
            </button>
          </div>
        </section>
      </main>

      <footer className="container mx-auto px-6 py-12 border-t border-gray-800">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Pencil className="w-6 h-6 text-blue-400" />
            <span className="text-xl font-bold">Excelidraw</span>
          </div>
          <div className="text-gray-400">
            © 2024 Excelidraw. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

