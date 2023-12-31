/* eslint-disable @typescript-eslint/no-explicit-any */
import { urlFor } from "./imageBuilder";

export const BlockContent = {
  types: {
    image: ({ value }: any) =>
      value?.asset ? (
        <img className="mapPointMainImage" src={urlFor(value)} />
      ) : (
        <></>
      ),
    callToAction: ({ value, isInline }: any) =>
      isInline ? (
        <a href={value.url}>{value.text}</a>
      ) : (
        <div className="callToAction">{value.text}</div>
      ),
  },

  marks: {
    link: ({ children, value }: any) => {
      const rel = !value.href.startsWith("/")
        ? "noreferrer noopener"
        : undefined;
      return (
        <a href={value.href} rel={rel}>
          {children}
        </a>
      );
    },
  },
};
