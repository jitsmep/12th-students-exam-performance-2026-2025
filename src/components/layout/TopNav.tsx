import { Bell, Search, User } from 'lucide-react';

export function TopNav() {
  return (
    <header className="h-16 px-6 border-b border-sidebar-border bg-background/80 backdrop-blur-md flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-64 hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input 
            type="text" 
            placeholder="Search students, subjects..." 
            className="w-full bg-card border border-sidebar-border rounded-full pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 text-gray-200 placeholder:text-gray-500 transition-all"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-full hover:bg-card-hover transition-colors text-gray-400 hover:text-gray-200">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-background"></span>
        </button>
        <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary cursor-pointer hover:bg-primary/30 transition-colors">
          <User className="w-4 h-4" />
        </div>
      </div>
    </header>
  );
}
