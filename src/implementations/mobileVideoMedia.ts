import VideoMedia from "@commons/core/videoMedia";
import { createVideoPlayer, VideoPlayer } from "expo-video";

export default class MobileVideoMedia implements VideoMedia<VideoPlayer> {
  private videoInstance: VideoPlayer | null = null;
  private _source: string | null = null;

  get source(): string | null {
    return this._source;
  }

  get isPlaying(): boolean {
    if (!this.videoInstance) {
      return false;
    }

    return this.videoInstance.playing;
  }

  get player(): VideoPlayer | null {
    return this.videoInstance;
  }

  load({ uri }: { uri: string }): VideoPlayer {
    this.videoInstance = createVideoPlayer({ uri });
    this.videoInstance.playbackRate = 1;
    this.videoInstance.timeUpdateEventInterval = 1;
    this.videoInstance.preservesPitch = true;
    this._source = uri;

    return this.videoInstance;
  }

  play(): Promise<void> {
    if (!this.videoInstance) {
      throw new Error("no_video_instance");
    }

    this.videoInstance.play();

    return new Promise((resolve) => {
      const playToEndListener = () => {
        this.videoInstance?.removeListener("playToEnd", playToEndListener);
        this.videoInstance?.replay();
        this.videoInstance?.pause();
        resolve();
      };

      this.videoInstance?.addListener("playToEnd", playToEndListener);
    });
  }

  setPlaybackRate(speed: number) {
    if (!this.videoInstance) {
      return;
    }
    this.videoInstance.playbackRate = speed;
  }

  rewindTenSeconds() {
    if (!this.videoInstance) {
      return;
    }
    const newTime = this.videoInstance.currentTime < 10 ? 0 : this.videoInstance.currentTime - 10;
    this.videoInstance.currentTime = newTime;
  }

  clear() {
    this.videoInstance?.pause();
    this.videoInstance?.release();
    this.videoInstance = null;
    this._source = null;
  }
}
