import { getYoutubeVideoId } from '../get-youtube-video-id';

describe('getYoutubeVideoId', () => {
  it('extracts an id from youtube.com watch URLs', () => {
    expect(getYoutubeVideoId('https://www.youtube.com/watch?v=abc123&feature=share')).toBe('abc123');
  });

  it('extracts an id from youtu.be URLs', () => {
    expect(getYoutubeVideoId('https://youtu.be/xyz789')).toBe('xyz789');
  });

  it('returns undefined for unsupported URLs', () => {
    expect(getYoutubeVideoId('https://example.com/video')).toBeUndefined();
  });
});
