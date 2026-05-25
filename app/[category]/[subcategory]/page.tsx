import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Layers, Terminal } from 'lucide-react';

const validCategories = ['electronics', 'software', 'mechanical', 'instrumentation', 'ideas', 'contact'];

export default async function SubCategoryPage({ params }: { params: Promise<{ category: string, subcategory: string }> }) {
  const { category, subcategory } = await params;
  
  if (!validCategories.includes(category)) {
    notFound();
  }

  const categoryTitle = category.charAt(0).toUpperCase() + category.slice(1);
  const subCategoryTitle = subcategory.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      
      {/* Breadcrumb & Header */}
      <div className="mb-12">
        <Link 
          href={`/${category}`} 
          className="inline-flex items-center text-sm font-medium text-gray-400 hover:text-brand transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to {categoryTitle}
        </Link>
        <h1 className="text-4xl md:text-5xl font-extrabold font-heading text-white mb-4">
          <span className="text-brand">{subCategoryTitle}</span> Engineering
        </h1>
        <p className="text-lg text-gray-400 max-w-3xl">
          Deep dives, complete source materials, step-by-step methodologies and expert articles focused entirely on {subCategoryTitle} within the domain of {categoryTitle}.
        </p>
      </div>

      {/* Statistics / Overviews */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <StatCard icon={<BookOpen className="h-6 w-6 text-brand" />} label="Total Articles" value="142" />
        <StatCard icon={<Layers className="h-6 w-6 text-brand" />} label="BOM Ready Projects" value="89" />
        <StatCard icon={<Terminal className="h-6 w-6 text-brand" />} label="Code Snippets" value="1,400+" />
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Left Column: Project Feed */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold text-white font-heading mb-6 border-b border-panel-border pb-2">
            Recent {subCategoryTitle} Articles
          </h2>
          <div className="space-y-6">
            <ArticleListCard 
              title={`Introduction to Advanced ${subCategoryTitle}`}
              description="Learn the fundamental equations, standard design practices, and foundational algorithms needed."
              date="Oct 20, 2026"
            />
            <ArticleListCard 
              title={`Optimizing Performance in ${categoryTitle} Systems`}
              description="A technical breakdown of removing bottlenecks in production-grade systems."
              date="Oct 18, 2026"
            />
            <ArticleListCard 
              title={`Case Study: Implementing ${subCategoryTitle} at Scale`}
              description="How top industry leaders are leveraging new standards."
              date="Oct 12, 2026"
            />
          </div>
        </div>

        {/* Right Column: Sidebar sidebar */}
        <div className="space-y-8">
          <div className="bg-panel border border-panel-border rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white font-heading mb-4">Popular Components</h3>
            <ul className="space-y-3">
              <li className="text-gray-400 hover:text-brand cursor-pointer text-sm">Microcontroller STM32</li>
              <li className="text-gray-400 hover:text-brand cursor-pointer text-sm">ESP32-S3 WROOM</li>
              <li className="text-gray-400 hover:text-brand cursor-pointer text-sm">INA219 Current Sensor</li>
              <li className="text-gray-400 hover:text-brand cursor-pointer text-sm">N-Channel MOSFETs</li>
            </ul>
          </div>
          
          <div className="bg-brand/10 border border-brand/20 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-brand font-heading mb-2">Subscribe to Topic</h3>
            <p className="text-sm text-gray-400 mb-4">Get the latest {subCategoryTitle} projects delivered to your inbox.</p>
            <input type="email" placeholder="Email Address" className="w-full bg-background border border-panel-border rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-brand mb-3" />
            <button className="w-full bg-brand text-white font-medium py-2 rounded-lg hover:bg-brand-light transition-colors">
              Subscribe
            </button>
          </div>
        </div>
        
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="flex items-center gap-4 bg-panel border border-panel-border rounded-xl p-6">
      <div className="p-3 bg-background rounded-lg border border-panel-border">
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-400">{label}</p>
        <p className="text-2xl font-bold text-white">{value}</p>
      </div>
    </div>
  );
}

function ArticleListCard({ title, description, date }: { title: string, description: string, date: string }) {
  return (
    <div className="group block bg-background border border-panel-border hover:border-brand/50 rounded-xl p-6 transition-all hover:shadow-lg hover:-translate-y-1 cursor-pointer">
      <p className="text-xs text-brand font-medium tracking-wider uppercase mb-2">{date}</p>
      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-brand transition-colors">{title}</h3>
      <p className="text-gray-400 text-sm">{description}</p>
    </div>
  );
}
