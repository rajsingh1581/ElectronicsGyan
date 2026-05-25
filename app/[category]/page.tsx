import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Lightbulb } from 'lucide-react';

// Define valid categories and their metadata
const categoriesData: Record<string, { title: string; description: string; icon: React.ReactNode; sub: string[] }> = {
  ideas: {
    title: 'Project Ideas',
    description: 'Inspiration for your next build, categorized by domain and difficulty level.',
    icon: <Lightbulb className="h-10 w-10 text-brand" />,
    sub: ['electronics', 'electrical', 'software', 'mechanical', 'android', 'communication'],
  },
};

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  
  const data = categoriesData[category];
  
  if (!data) {
    // If it's something like contact or partner just render a generic view
    if (['partner'].includes(category)) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
          <h1 className="text-4xl font-bold text-white capitalize mb-4">{category}</h1>
          <p className="text-gray-400">Content for this section is coming soon.</p>
        </div>
      );
    }
    notFound();
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      
      {/* Category Header */}
      <div className="flex items-center gap-6 mb-12 bg-panel p-8 rounded-3xl border border-panel-border">
        <div className="p-4 bg-background rounded-2xl border border-panel-border">
          {data.icon}
        </div>
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold font-heading text-white mb-2">
            {data.title} <span className="text-brand">Hub</span>
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl">
            {data.description}
          </p>
        </div>
      </div>

      {/* Sub-categories */}
      {data.sub.length > 0 && (
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-6 font-heading">Explore Specializations</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {data.sub.map((subItem) => (
              <Link 
                key={subItem} 
                href={`/${category}/${subItem}`}
                className="flex items-center justify-between p-4 bg-panel border border-panel-border hover:border-brand rounded-xl group transition-all"
              >
                <span className="font-medium text-gray-200 capitalize group-hover:text-brand transition-colors">
                  {subItem.replace('-', ' ')}
                </span>
                <ArrowRight className="h-4 w-4 text-gray-500 group-hover:text-brand transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Featured Projects in this Category */}
      <div>
        <h2 className="text-3xl font-bold font-heading text-white mb-8 border-b border-panel-border pb-4">
          Latest in {data.title}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <ProjectCard 
            title={`${data.title} Research System`}
            category={data.title}
            date="Oct 14, 2026"
            image={`https://picsum.photos/seed/${category}1/600/400`}
          />
          <ProjectCard 
            title={`Advanced ${data.title} Controller`}
            category={data.title}
            date="Oct 10, 2026"
            image={`https://picsum.photos/seed/${category}2/600/400`}
          />
          <ProjectCard 
            title={`${data.title} Analysis Tool`}
            category={data.title}
            date="Oct 05, 2026"
            image={`https://picsum.photos/seed/${category}3/600/400`}
          />
        </div>
      </div>
    </div>
  );
}

function ProjectCard({ title, category, date, image }: { title: string, category: string, date: string, image: string }) {
  return (
    <div className="flex flex-col bg-panel border border-panel-border rounded-2xl overflow-hidden hover:border-gray-600 transition-colors cursor-pointer group">
      <div className="relative h-48 w-full overflow-hidden">
        <Image src={image} alt={title} fill className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-black/60 backdrop-blur-sm text-xs font-medium text-white rounded-full border border-white/10">
            {category}
          </span>
        </div>
      </div>
      <div className="p-6">
        <p className="text-xs text-gray-500 mb-2">{date}</p>
        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-brand transition-colors line-clamp-2">{title}</h3>
        <p className="text-sm text-gray-400">View complete BOM, circuit schematics, and source code for this project.</p>
      </div>
    </div>
  );
}
