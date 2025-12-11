import React from 'react';
import Header from '../components/layout/Header';
import BottomNavBar from '../components/layout/BottomNavBar';
import CategoryCard from '../components/layout/CategoryCard';
import { useLiveStore } from '../store/liveStore';
import { useNavigate } from 'react-router-dom';
import { useFocusable } from '@noriginmedia/norigin-spatial-navigation';

const CategoriesPage: React.FC = () => {
  const { categories } = useLiveStore();
  const navigate = useNavigate();
  const { ref } = useFocusable();

  const onCategoryPress = (categoryId: string) => {
    // This will be implemented in a later step
    console.log('Navigate to category:', categoryId);
     navigate(`/live?categoryId=${categoryId}`);
  };

  return (
    <div ref={ref} className="flex flex-col h-screen w-full overflow-hidden bg-background-dark text-white">
      <Header title="Categories" subtitle="All Categories" />
      <main className="flex-1 overflow-y-auto no-scrollbar px-8 pb-32 pt-4">
        {categories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            {categories.map((category) => (
              <CategoryCard
                key={category.category_id}
                category={{
                  id: category.category_id,
                  name: category.category_name,
                }}
                onEnterPress={() => onCategoryPress(category.category_id)}
              />
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-slate-400 text-lg">No categories found.</p>
          </div>
        )}
      </main>
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background-dark to-transparent pointer-events-none z-10" />
      <BottomNavBar />
    </div>
  );
};

export default CategoriesPage;
