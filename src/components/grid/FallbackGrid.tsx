import gridConfig from "./config.ts";

const { dotSize, tileSize, getDotCoordinate } = gridConfig;
const dotOffset = getDotCoordinate(tileSize, dotSize);

export function FallbackGrid() {
  return (
    <svg aria-hidden="true" className="absolute w-full h-full top-0 left-0 z-0">
      <defs>
        <pattern
          id="dots-grid"
          x="0"
          y="0"
          width={tileSize}
          height={tileSize}
          patternUnits="userSpaceOnUse"
        >
          <path
            fill="currentColor"
            d={`M${dotOffset} ${dotOffset}h${dotSize}v${dotSize}h${-dotSize}z`}
            fillRule="evenodd"
            opacity="0.8"
          />
        </pattern>
      </defs>

      <rect
        x="0"
        y="0"
        width="100%"
        height="100%"
        fill="url(#dots-grid)"
      ></rect>
    </svg>
  );
}
