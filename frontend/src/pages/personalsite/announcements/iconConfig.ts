import {
  InformationCircleIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ShieldExclamationIcon,
  MegaphoneIcon,
  SparklesIcon,
  WrenchScrewdriverIcon,
} from '@heroicons/react/24/outline';

export interface IconDefinition {
  name: string; // User-friendly name for dropdown
  value: string; // The 'icon_class' value to store in DB (e.g., Heroicon component name)
  component: React.ElementType;
}

export const availableIcons: IconDefinition[] = [
  { name: 'Default (Megaphone)', value: 'MegaphoneIcon', component: MegaphoneIcon },
  { name: 'Info Circle', value: 'InformationCircleIcon', component: InformationCircleIcon },
  { name: 'Check Circle (Success)', value: 'CheckCircleIcon', component: CheckCircleIcon },
  { name: 'Warning Triangle', value: 'ExclamationTriangleIcon', component: ExclamationTriangleIcon },
  { name: 'Danger Shield', value: 'ShieldExclamationIcon', component: ShieldExclamationIcon },
  { name: 'Sparkles (New Feature)', value: 'SparklesIcon', component: SparklesIcon },
  { name: 'Maintenance (Wrench)', value: 'WrenchScrewdriverIcon', component: WrenchScrewdriverIcon },
];

// Helper to get component by value (icon_class)
export const getIconComponent = (iconValue?: string | null): React.ElementType | null => {
  if (!iconValue) return MegaphoneIcon; // Default if none provided
  const found = availableIcons.find(icon => icon.value === iconValue);
  return found ? found.component : MegaphoneIcon; // Default if not found
};