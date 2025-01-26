import React from 'react';
import { CSSProperties } from 'react';

// Assuming IconProps is defined somewhere
interface IconProps {
  style?: CSSProperties;
  className: string;
}

interface ExtendedIconProps extends IconProps {
  children?: React.ReactNode;
}

const ChevronLeftIcon = React.forwardRef<SVGSVGElement, ExtendedIconProps>((props, ref) => {
  const { style, className, children, ...rest } = props;
  return (
    <svg ref={ref} style={style} className={className} {...rest}>
      {children && children}
      {/* SVG Path Data or other elements */}
    </svg>
  );
});

const ChevronRightIcon = React.forwardRef<SVGSVGElement, ExtendedIconProps>((props, ref) => {
  const { style, className, children, ...rest } = props;
  return (
    <svg ref={ref} style={style} className={className} {...rest}>
      {children && children}
      {/* SVG Path Data or other elements */}
    </svg>
  );
});

// Usage example
const App = () => {
  return (
    <div>
      <ChevronLeftIcon className="icon-left">Left</ChevronLeftIcon>
      <ChevronRightIcon className="icon-right">Right</ChevronRightIcon>
    </div>
  );
};

export default App;
