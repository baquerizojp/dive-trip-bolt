import React from 'react';
import { Input } from '@/components/ui/input';
import { useMobile } from '@/hooks/useMobile';

interface MobileOptimizedInputProps extends React.ComponentProps<typeof Input> {
  onSubmit?: () => void;
}

const MobileOptimizedInput: React.FC<MobileOptimizedInputProps> = ({
  onSubmit,
  onKeyDown,
  onBlur,
  ...props
}) => {
  const { hideKeyboard } = useMobile();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      hideKeyboard();
      onSubmit?.();
    }
    onKeyDown?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    hideKeyboard();
    onBlur?.(e);
  };

  return (
    <Input
      {...props}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
      autoComplete="off"
      autoCorrect="off"
      autoCapitalize="off"
      spellCheck="false"
    />
  );
};

export default MobileOptimizedInput;