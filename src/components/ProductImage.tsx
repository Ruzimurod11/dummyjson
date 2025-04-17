import React from "react";

type Props = {
   src: string;
   alt: string;
   className?: string;
};

export const ProductImage = React.memo(({ src, alt, className }: Props) => {
   return <img src={src} alt={alt} className={className} loading="lazy" />;
});
