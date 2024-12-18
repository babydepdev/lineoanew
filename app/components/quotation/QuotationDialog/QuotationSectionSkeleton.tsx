interface QuotationSectionSkeletonProps {
    name: string;
  }
  
  export function QuotationSectionSkeleton({ name }: QuotationSectionSkeletonProps) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">{name}</h3>
          <div className="h-5 w-20 bg-slate-100 rounded animate-pulse" />
        </div>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div 
              key={i} 
              className="h-[88px] bg-slate-50 rounded-lg animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }