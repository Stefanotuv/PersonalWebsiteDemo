import React, { useState, useEffect, FormEvent } from 'react';
import { AdminAnnouncement, NewAdminAnnouncementData } from '../../../api.ts'; // Adjust path
import { availableIcons } from './iconConfig.ts'; // Adjust path

interface AnnouncementFormProps {
  onSubmit: (data: NewAdminAnnouncementData) => Promise<void>; // Make onSubmit async for handling loading
  initialData?: AdminAnnouncement | null;
  isLoading?: boolean;
}

const AnnouncementForm: React.FC<AnnouncementFormProps> = ({ onSubmit, initialData, isLoading }) => {
  const [message, setMessage] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [style, setStyle] = useState<'info' | 'success' | 'warning' | 'danger' | 'custom'>('info');
  const [iconClass, setIconClass] = useState<string | null>(availableIcons[0]?.value || null);
  const [customBgColor, setCustomBgColor] = useState('');
  const [customTextColor, setCustomTextColor] = useState('');
  const [startDatetimeStr, setStartDatetimeStr] = useState(''); // Store as string from input
  const [endDatetimeStr, setEndDatetimeStr] = useState('');     // Store as string from input

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setMessage(initialData.message || '');
      setIsActive(initialData.is_active || false);
      setStyle(initialData.style || 'info');
      setIconClass(initialData.icon_class || availableIcons[0]?.value || null);
      setCustomBgColor(initialData.custom_bg_color || '');
      setCustomTextColor(initialData.custom_text_color || '');
      setStartDatetimeStr(initialData.start_datetime ? new Date(initialData.start_datetime).toISOString().slice(0, 16) : '');
      setEndDatetimeStr(initialData.end_datetime ? new Date(initialData.end_datetime).toISOString().slice(0, 16) : '');
    } else {
      // Reset to defaults for a new form
      setMessage('');
      setIsActive(false);
      setStyle('info');
      setIconClass(availableIcons[0]?.value || null);
      setCustomBgColor('');
      setCustomTextColor('');
      setStartDatetimeStr('');
      setEndDatetimeStr('');
    }
  }, [initialData]);

  // Effect to clear custom colors if style is not 'custom'
  useEffect(() => {
    if (style !== 'custom') {
      setCustomBgColor('');
      setCustomTextColor('');
    }
  }, [style]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!message.trim()) {
      newErrors.message = 'Message is required.';
    }
    if (style === 'custom') {
      if (!customBgColor.trim()) {
        newErrors.custom_bg_color = 'Custom background color is required for custom style.';
      } else if (!/^#([0-9A-Fa-f]{3}){1,2}$/.test(customBgColor.trim())) {
        newErrors.custom_bg_color = 'Invalid hex color format (e.g., #RRGGBB or #RGB).';
      }
      if (!customTextColor.trim()) {
        newErrors.custom_text_color = 'Custom text color is required for custom style.';
      } else if (!/^#([0-9A-Fa-f]{3}){1,2}$/.test(customTextColor.trim())) {
        newErrors.custom_text_color = 'Invalid hex color format (e.g., #RRGGBB or #RGB).';
      }
    }
    // Basic validation for datetime-local input (not empty if not optional, could be more complex)
    if (startDatetimeStr && isNaN(new Date(startDatetimeStr).getTime())) {
        newErrors.start_datetime_str = 'Invalid start date/time format.';
    }
    if (endDatetimeStr && isNaN(new Date(endDatetimeStr).getTime())) {
        newErrors.end_datetime_str = 'Invalid end date/time format.';
    }
    if (startDatetimeStr && endDatetimeStr && new Date(startDatetimeStr) >= new Date(endDatetimeStr)) {
        newErrors.end_datetime_str = 'End date/time must be after start date/time.';
    }


    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateForm()) {
      return;
    }

    const finalData: NewAdminAnnouncementData = {
      message: message.trim(),
      is_active: isActive,
      style,
      icon_class: iconClass,
      custom_bg_color: style === 'custom' ? customBgColor.trim() : null,
      custom_text_color: style === 'custom' ? customTextColor.trim() : null,
      start_datetime: startDatetimeStr ? new Date(startDatetimeStr).toISOString() : null,
      end_datetime: endDatetimeStr ? new Date(endDatetimeStr).toISOString() : null,
    };
    await onSubmit(finalData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-4 bg-white shadow-md rounded-lg">
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
        <textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        {errors.message && <p className="mt-1 text-sm text-red-600">{errors.message}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="style" className="block text-sm font-medium text-gray-700">Style</label>
          <select
            id="style"
            value={style}
            onChange={(e) => setStyle(e.target.value as typeof style)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="info">Info (Blue)</option>
            <option value="success">Success (Green)</option>
            <option value="warning">Warning (Yellow)</option>
            <option value="danger">Danger (Red)</option>
            <option value="custom">Custom</option>
          </select>
        </div>
        <div>
          <label htmlFor="icon_class" className="block text-sm font-medium text-gray-700">Icon</label>
          <select
            id="icon_class"
            value={iconClass || ''}
            onChange={(e) => setIconClass(e.target.value || null)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            {availableIcons.map(icon => (
              <option key={icon.value} value={icon.value}>{icon.name}</option>
            ))}
             <option value="">No Icon / Default</option> {/* Option for no specific icon */}
          </select>
        </div>
      </div>

      {style === 'custom' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 border border-gray-200 rounded-md">
          <div>
            <label htmlFor="custom_bg_color" className="block text-sm font-medium text-gray-700">Custom Background Color</label>
            <div className="flex items-center mt-1">
                <input
                    type="text"
                    id="custom_bg_color_text"
                    value={customBgColor}
                    onChange={(e) => setCustomBgColor(e.target.value)}
                    placeholder="#RRGGBB"
                    className="block w-full rounded-l-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                <input
                    type="color"
                    id="custom_bg_color_picker"
                    value={customBgColor || '#ffffff'} // Picker needs a default valid color
                    onChange={(e) => setCustomBgColor(e.target.value)}
                    className="h-10 w-12 rounded-r-md border border-l-0 border-gray-300 cursor-pointer p-0"
                    title="Pick background color"
                />
            </div>
            {errors.custom_bg_color && <p className="mt-1 text-sm text-red-600">{errors.custom_bg_color}</p>}
          </div>
          <div>
            <label htmlFor="custom_text_color" className="block text-sm font-medium text-gray-700">Custom Text Color</label>
            <div className="flex items-center mt-1">
                <input
                    type="text"
                    id="custom_text_color_text"
                    value={customTextColor}
                    onChange={(e) => setCustomTextColor(e.target.value)}
                    placeholder="#RRGGBB"
                    className="block w-full rounded-l-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                <input
                    type="color"
                    id="custom_text_color_picker"
                    value={customTextColor || '#000000'} // Picker needs a default valid color
                    onChange={(e) => setCustomTextColor(e.target.value)}
                    className="h-10 w-12 rounded-r-md border border-l-0 border-gray-300 cursor-pointer p-0"
                    title="Pick text color"
                />
            </div>
            {errors.custom_text_color && <p className="mt-1 text-sm text-red-600">{errors.custom_text_color}</p>}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="start_datetime_str" className="block text-sm font-medium text-gray-700">Start Displaying At (Optional)</label>
          <input
            type="datetime-local"
            id="start_datetime_str"
            value={startDatetimeStr}
            onChange={(e) => setStartDatetimeStr(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
           {errors.start_datetime_str && <p className="mt-1 text-sm text-red-600">{errors.start_datetime_str}</p>}
        </div>
        <div>
          <label htmlFor="end_datetime_str" className="block text-sm font-medium text-gray-700">Stop Displaying At (Optional)</label>
          <input
            type="datetime-local"
            id="end_datetime_str"
            value={endDatetimeStr}
            onChange={(e) => setEndDatetimeStr(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
           {errors.end_datetime_str && <p className="mt-1 text-sm text-red-600">{errors.end_datetime_str}</p>}
        </div>
      </div>

      <div className="flex items-center">
        <input
          id="is_active"
          type="checkbox"
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
        />
        <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
          Set as Active Banner (this will deactivate any other active banner)
        </label>
      </div>

      <div>
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : (initialData ? 'Update Announcement' : 'Create Announcement')}
        </button>
      </div>
    </form>
  );
};

export default AnnouncementForm;