'use client';

import { useTheme } from '@/contexts/ThemeContext';
import {
  RadioGroup,
  RadioGroupItem,
} from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();

  return (
    <RadioGroup
      value={theme}
      onValueChange={(val) => setTheme(val as 'modern' | 'minimal')}
      className="flex gap-4"
    >
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="modern" id="modern" />
        <Label htmlFor="modern">Modern</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="minimal" id="minimal" />
        <Label htmlFor="minimal">Minimal</Label>
      </div>
    </RadioGroup>
  );
};

export default ThemeSwitcher;
