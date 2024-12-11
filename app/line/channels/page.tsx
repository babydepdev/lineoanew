import { getAllLineChannels } from '@/lib/services/lineService';
import { ChannelManager } from '@/app/components/line/ChannelManager';

export default async function LineChannelsPage() {
  const initialChannels = await getAllLineChannels();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">
          LINE Channel Management
        </h1>
        <ChannelManager initialChannels={initialChannels} />
      </div>
    </div>
  );
}