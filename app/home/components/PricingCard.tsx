interface PricingCardProps {
    title: string;
    price: string;
    description: string;
    features: string[];
    buttonText: string;
    isPopular?: boolean;
  }
  
  export function PricingCard({
    title,
    price,
    description,
    features,
    buttonText,
    isPopular
  }: PricingCardProps) {
    return (
      <div className={`backdrop-blur-lg ${isPopular ? 'bg-purple-900/20' : 'bg-black/30'} rounded-xl p-8 border ${isPopular ? 'border-purple-500/50' : 'border-white/10'} relative transition-all duration-300 hover:transform hover:scale-105`}>
        {isPopular && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500/80 backdrop-blur-sm text-white px-4 py-1 rounded-full text-sm border border-blue-400/50">
            Popular Choice
          </div>
        )}
        <div className="text-sm text-gray-400">{title}</div>
        <div className="mt-6 mb-8">
          <span className="text-4xl font-bold text-white">{price}</span>
          <span className="text-gray-400"> / month</span>
        </div>
        <p className="text-gray-300 mb-8">{description}</p>
        <ul className="space-y-4 mb-8">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-3 text-gray-300">
              <span className="text-purple-400">•</span>
              {feature}
            </li>
          ))}
        </ul>
        <button className={`w-full ${isPopular ? 'bg-purple-500/80' : 'bg-white/10'} hover:bg-opacity-90 text-white py-3 rounded-lg transition-all duration-300 backdrop-blur-sm border ${isPopular ? 'border-purple-400/50' : 'border-white/10'}`}>
          {buttonText}
        </button>
      </div>
    );
  }