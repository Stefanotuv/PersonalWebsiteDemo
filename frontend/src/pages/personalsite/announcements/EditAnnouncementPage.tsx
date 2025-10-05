import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AnnouncementForm from './AnnouncementForm.tsx'; // Adjust path
import { AdminAnnouncement, NewAdminAnnouncementData, fetchAdminAnnouncementDetail, updateAdminAnnouncement } from '../../../api.ts'; // Adjust path

const EditAnnouncementPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [announcement, setAnnouncement] = useState<AdminAnnouncement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      setFormLoading(true);
      fetchAdminAnnouncementDetail(Number(id))
        .then(data => {
          setAnnouncement(data);
          setError(null);
        })
        .catch(err => {
          setError('Failed to fetch announcement details.');
          console.error(err);
        })
        .finally(() => setFormLoading(false));
    }
  }, [id]);

  const handleSubmit = async (data: NewAdminAnnouncementData) => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      await updateAdminAnnouncement(Number(id), data);
      // Add success toast/notification
      navigate('/announcements');
    } catch (err: any) {
      setError(err.message || 'Failed to update announcement.');
      // Add error toast/notification
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (formLoading) return <div className="p-6">Loading announcement details...</div>;
  if (error && !announcement) return <div className="p-6 text-red-500">Error: {error}</div>;
  if (!announcement) return <div className="p-6">Announcement not found.</div>;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto">
      <h1 className="text-xl font-semibold text-gray-900 mb-6">Edit Announcement</h1>
      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">{error}</div>}
      <AnnouncementForm onSubmit={handleSubmit} initialData={announcement} isLoading={isLoading} />
    </div>
  );
};

export default EditAnnouncementPage;