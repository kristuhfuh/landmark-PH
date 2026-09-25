import { forwardRef } from 'react'

/**
 * Drop-in replacement for <img> that also handles:
 *   - direct video files (.mp4 / .webm / .mov / .m4v / .ogv) → <video> tag
 *   - YouTube URLs (watch, youtu.be, shorts, embed) → <iframe> embed
 *   - everything else → <img>
 *
 * All three variants share the same className / style / ref / rest-prop
 * interface, so they slot into every existing image site without touching
 * layout or animations. The container className is preserved as-is; for
 * YouTube (which can't be object-fit-covered) the iframe uses
 * aspect-ratio + min-* to always cover its parent, matching the
 * "object-cover" behaviour of img/video.
 *
 * Video defaults are chosen so browsers actually allow autoplay:
 *   - muted + playsInline (required on iOS / mobile Safari)
 *   - autoPlay + loop for background-video feel
 *   - preload="metadata" so the browser only fetches enough to start
 *
 * YouTube defaults:
 *   - youtube-nocookie.com domain (no tracking cookies until interaction)
 *   - autoplay=1 + mute=1 + loop=1 + playlist=ID (loop trick required by YT)
 *   - controls / modestbranding / rel / showinfo / iv_load_policy trimmed
 *     to the minimum chrome YouTube allows
 *   - pointer-events: none on the iframe so the container acts as a
 *     background, not an interactive video player
 */

const VIDEO_RE = /\.(mp4|webm|mov|m4v|ogv)(?:$|[?#])/i
const YOUTUBE_RE =
  /(?:youtube\.com\/(?:watch\?(?:[^#]*&)?v=|embed\/|shorts\/|v\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/

export function isVideoSrc(src) {
  return typeof src === 'string' && VIDEO_RE.test(src)
}

export function extractYouTubeId(src) {
  if (typeof src !== 'string') return null
  const match = src.match(YOUTUBE_RE)
  return match ? match[1] : null
}

const Media = forwardRef(function Media(
  {
    src,
    alt = '',
    className = '',
    style,
    draggable,
    poster,
    onLoad,
    onError,
    ...rest
  },
  ref
) {
  // YouTube first — its URL never ends in a video extension.
  const ytId = extractYouTubeId(src)
  if (ytId) {
    const params = new URLSearchParams({
      autoplay: '1',
      mute: '1',
      loop: '1',
      playlist: ytId, // required for loop=1 to work
      controls: '0',
      modestbranding: '1',
      playsinline: '1',
      rel: '0',
      showinfo: '0',
      iv_load_policy: '3',
      disablekb: '1',
    })
    const embedUrl = `https://www.youtube-nocookie.com/embed/${ytId}?${params.toString()}`

    return (
      <div
        ref={ref}
        className={className}
        style={{ ...style, position: 'relative', overflow: 'hidden' }}
        {...rest}
      >
        <iframe
          src={embedUrl}
          title={alt || 'Embedded video'}
          allow="autoplay; encrypted-media; picture-in-picture"
          referrerPolicy="strict-origin-when-cross-origin"
          loading="lazy"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            aspectRatio: '16 / 9',
            minWidth: '100%',
            minHeight: '100%',
            transform: 'translate(-50%, -50%)',
            border: 0,
            pointerEvents: 'none',
          }}
        />
      </div>
    )
  }

  if (isVideoSrc(src)) {
    return (
      <video
        ref={ref}
        src={src}
        poster={poster}
        className={className}
        style={style}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={alt || undefined}
        onLoadedData={onLoad}
        onError={onError}
        {...rest}
      />
    )
  }

  return (
    <img
      ref={ref}
      src={src}
      alt={alt}
      className={className}
      style={style}
      draggable={draggable}
      onLoad={onLoad}
      onError={onError}
      {...rest}
    />
  )
})

export default Media
