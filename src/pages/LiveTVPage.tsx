import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useLiveStore } from '../store/liveStore';
import LiveService from '../services/LiveService';
import { VideoPlayer } from '../components/VideoPlayer';
import { useTVRemote } from '../hooks/useTVRemote';
import { useNavigate } from 'react-router-dom';

const LiveTVPage: React.FC = () => {
  const { channelId } = useParams<{ channelId: string }>();
  const navigate = useNavigate();
  const { setPlayerActive } = useLiveStore();

  const [streamUrl, setStreamUrl] = useState<string>('');
  const [channelName, setChannelName] = useState<string>('');

  useEffect(() => {
    if (channelId) {
      const id = parseInt(channelId, 10);
      setStreamUrl(LiveService.getStreamUrl(id));
      // In a real app, you'd fetch channel details here to get the name
      setChannelName(`Channel ${channelId}`);
      setPlayerActive(true);
    }
  }, [channelId, setPlayerActive]);

  useTVRemote({
    'Back': () => navigate(-1), // Go back to the previous page
  }, true);


  if (!streamUrl) {
    return (
        <div className="flex items-center justify-center h-screen bg-black text-white">
            <p>Loading...</p>
        </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black z-50">
      <VideoPlayer
        src={streamUrl}
        channelName={channelName}
        overlayVisible={true} // For now, always visible
        className="w-full h-full"
        onError={(e) => console.error("Video Error", e)}
      />
    </div>
  );
};

export default LiveTVPage;
