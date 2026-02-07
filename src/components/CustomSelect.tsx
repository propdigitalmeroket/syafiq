import * as Select from '@radix-ui/react-select';
import { ChevronDown, Check } from 'lucide-react';

interface SelectOption {
  value: string;
  label: string;
}

interface CustomSelectProps {
  value: string | number;
  onValueChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export default function CustomSelect({
  value,
  onValueChange,
  options,
  placeholder = 'Select...',
  className = '',
  disabled = false,
}: CustomSelectProps) {
  return (
    <Select.Root value={String(value)} onValueChange={onValueChange} disabled={disabled}>
      <Select.Trigger
        className={`inline-flex items-center justify-between px-3 sm:px-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base ${className}`}
      >
        <Select.Value placeholder={placeholder} />
        <Select.Icon className="ml-2">
          <ChevronDown size={16} className="text-gray-500" />
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content
          className="overflow-hidden bg-white rounded-lg shadow-lg border border-gray-200 z-50"
          position="popper"
          side="bottom"
          sideOffset={4}
          align="start"
          avoidCollisions={true}
          collisionPadding={8}
        >
          <Select.Viewport className="p-1 max-h-[300px] overflow-y-auto">
            {options.map((option) => (
              <Select.Item
                key={option.value}
                value={option.value}
                className="relative flex items-center px-8 py-3 text-sm rounded cursor-pointer outline-none select-none hover:bg-blue-50 focus:bg-blue-50 data-[highlighted]:bg-blue-50 transition-colors min-h-[44px]"
              >
                <Select.ItemIndicator className="absolute left-2 inline-flex items-center">
                  <Check size={16} className="text-blue-600" />
                </Select.ItemIndicator>
                <Select.ItemText className="text-gray-900">
                  {option.label}
                </Select.ItemText>
              </Select.Item>
            ))}
          </Select.Viewport>
          <Select.ScrollDownButton className="flex items-center justify-center h-6 bg-white cursor-default">
            <ChevronDown size={16} className="text-gray-500" />
          </Select.ScrollDownButton>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}
