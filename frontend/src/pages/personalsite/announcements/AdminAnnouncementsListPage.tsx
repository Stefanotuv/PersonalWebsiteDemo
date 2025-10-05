import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AdminAnnouncement, fetchAdminAnnouncements, deleteAdminAnnouncement, updateAdminAnnouncement } from '../../../api.ts'; // Adjust path
import { getIconComponent } from './iconConfig.ts'; // Adjust path
import { PlusIcon, PencilIcon, TrashIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

const AdminAnnouncementsListPage: React.FC = () => {
  const [announcements, setAnnouncements] = useState<AdminAnnouncement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const loadAnnouncements = async () => {
    setLoading(true);
    try {
      const data = await fetchAdminAnnouncements();
      setAnnouncements(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch announcements.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this announcement?')) {
      try {
        await deleteAdminAnnouncement(id);
        setAnnouncements(prev => prev.filter(ann => ann.id !== id));
        // Add a success toast/notification here
      } catch (err) {
        setError('Failed to delete announcement.');
        // Add an error toast/notification here
        console.error(err);
      }
    }
  };

  const toggleActive = async (announcement: AdminAnnouncement) => {
    try {
      await updateAdminAnnouncement(announcement.id, { is_active: !announcement.is_active });
      loadAnnouncements(); // Refresh the list to reflect changes (especially if others were deactivated)
      // Add a success toast/notification
    } catch (err) {
        setError(`Failed to ${announcement.is_active ? 'deactivate' : 'activate'} announcement.`);
        // Add an error toast/notification
        console.error(err);
    }
  };


  if (loading) return <div className="p-6">Loading announcements...</div>;
  if (error) return <div className="p-6 text-red-500">Error: {error}</div>;

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Manage Announcements</h1>
          <p className="mt-2 text-sm text-gray-700">
            Create, edit, and activate site-wide announcements. Only one announcement can be active at a time.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Link
            to="/announcements/new"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            New Announcement
          </Link>
        </div>
      </div>

      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Message</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Icon</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Style</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Active</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Schedule</th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6"><span className="sr-only">Actions</span></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {announcements.map((ann) => {
                    const IconComponent = getIconComponent(ann.icon_class);
                    return (
                      <tr key={ann.id} className={ann.is_active ? 'bg-green-50' : ''}>
                        <td className="whitespace-normal py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 max-w-xs break-words">
                            {ann.message.length > 100 ? `${ann.message.substring(0, 100)}...` : ann.message}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {IconComponent && <IconComponent className="h-5 w-5" />}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 capitalize">{ann.style}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <button
                            onClick={() => toggleActive(ann)}
                            title={ann.is_active ? "Deactivate" : "Activate"}
                            className={`p-1 rounded-full ${ann.is_active ? 'hover:bg-red-100' : 'hover:bg-green-100'}`}
                          >
                            {ann.is_active ? <CheckCircleIcon className="h-6 w-6 text-green-500" /> : <XCircleIcon className="h-6 w-6 text-gray-400" />}
                          </button>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {ann.start_datetime && <div>Start: {new Date(ann.start_datetime).toLocaleString()}</div>}
                          {ann.end_datetime && <div>End: {new Date(ann.end_datetime).toLocaleString()}</div>}
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <button onClick={() => navigate(`/announcements/edit/${ann.id}`)} className="text-indigo-600 hover:text-indigo-900 mr-3">
                            <PencilIcon className="h-5 w-5 inline-block" /> Edit
                          </button>
                          <button onClick={() => handleDelete(ann.id)} className="text-red-600 hover:text-red-900">
                            <TrashIcon className="h-5 w-5 inline-block" /> Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
             {announcements.length === 0 && <p className="text-center py-4 text-gray-500">No announcements found.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnnouncementsListPage;