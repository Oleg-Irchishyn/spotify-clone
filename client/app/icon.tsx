import { ImageResponse } from 'next/og';

export const dynamic = 'force-static';
export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#1db954',
        borderRadius: '50%',
      }}
    >
      <div
        style={{
          display: 'flex',
          color: '#000000',
          fontSize: 20,
          fontWeight: 700,
          lineHeight: 1,
          marginTop: -8,
          transform: 'translate(0%, 4%)',
        }}
      >
        ♪
      </div>
    </div>,
    { ...size },
  );
}
