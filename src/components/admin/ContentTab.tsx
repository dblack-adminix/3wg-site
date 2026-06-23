import { useState } from 'react';
import { FileText, Layout, BookOpen, FileCode } from 'lucide-react';
import { HomePageContentTab } from './content/HomePageContentTab';
import { BlogContentTab } from './content/BlogContentTab';
import { PagesContentTab } from './content/PagesContentTab';

type ContentSubTab = 'homepage' | 'blog' | 'pages';

export function ContentTab() {
  const [activeSubTab, setActiveSubTab] = useState<ContentSubTab>('homepage');

  const subTabs = [
    { id: 'homepage' as ContentSubTab, label: 'Главная страница', icon: Layout },
    { id: 'blog' as ContentSubTab, label: 'Блог', icon: BookOpen },
    { id: 'pages' as ContentSubTab, label: 'Страницы', icon: FileCode },
  ];

  return (
    <div className="space-y-6">
      {/* Sub-navigation */}
      <div className="flex items-center gap-2 p-1 bg-card rounded-lg border border-border w-fit">
        {subTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md font-mono text-sm transition-all ${
              activeSubTab === tab.id
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div>
        {activeSubTab === 'homepage' && <HomePageContentTab />}
        
        {activeSubTab === 'blog' && <BlogContentTab />}
        
        {activeSubTab === 'pages' && <PagesContentTab />}
      </div>
    </div>
  );
}
