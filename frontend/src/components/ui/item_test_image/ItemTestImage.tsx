import React from "react";

interface AvatarProps {
  className?: string;
  width?: number;
  height?: number;
}

const ItemTestImage: React.FC<AvatarProps> = ({
  className,
  width,
  height,
}) => {
  return (
    <img
      src="https://placehold.co/600x400"
      alt="Item"
      className={className}
      width={width}
      height={height}
    />
  );
};

export default ItemTestImage;