interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger';
    isLoading?: boolean;
  }
  
  export default function Button({ 
    children, 
    variant = 'primary', 
    isLoading = false, 
    className = '', 
    disabled,
    ...props 
  }: ButtonProps) {
    const baseStyles = 'inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2';
    
    const variantStyles = {
      primary: 'text-white bg-purple-600 hover:bg-purple-700 focus:ring-purple-500',
      secondary: 'text-purple-700 bg-purple-100 hover:bg-purple-200 focus:ring-purple-500',
      danger: 'text-white bg-red-600 hover:bg-red-700 focus:ring-red-500'
    };
    
    const disabledStyles = 'opacity-50 cursor-not-allowed';
    
    return (
      <button
        className={`
          ${baseStyles} 
          ${variantStyles[variant]} 
          ${(disabled || isLoading) ? disabledStyles : ''}
          ${className}
        `}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
        {children}
      </button>
    );
  }