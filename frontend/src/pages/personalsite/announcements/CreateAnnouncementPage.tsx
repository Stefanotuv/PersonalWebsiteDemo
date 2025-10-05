import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AnnouncementForm from './AnnouncementForm.tsx'; // Adjust path
import { NewAdminAnnouncementData, createAdminAnnouncement } from '../../../api.ts'; // Adjust path

const CreateAnnouncementPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: NewAdminAnnouncementData) => {
    setIsLoading(true);
    setError(null);
    try {
      await createAdminAnnouncement(data);
      // Add success toast/notification
      navigate('/announcements'); // Or wherever your list page is
    } catch (err: any) {
      setError(err.message || 'Failed to create announcement. Please check the details.');
      // Add error toast/notification
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto">
      <h1 className="text-xl font-semibold text-gray-900 mb-6">Create New Announcement</h1>
      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">{error}</div>}
      <AnnouncementForm onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
};

export default CreateAnnouncementPage;