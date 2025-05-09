import { Audio, InterruptionModeAndroid, InterruptionModeIOS, AVPlaybackStatus } from "expo-av";
import AudioMedia, { AudioMediaProps } from "student-front-commons/src/core/audioMedia";

export default class MobileAudioMedia implements AudioMedia {
  private soundInstance: Audio.Sound | null = null;
  private _isPlaying = false;
  private _durationMillis = 0;
  private _positionMillis = 0;
  private _currentAudioUrl = "";

  get isPlaying(): boolean {
    return this._isPlaying;
  }

  get durationMillis(): number {
    return this._durationMillis;
  }

  get positionMillis(): number {
    return this._positionMillis;
  }

  get currentAudioUrl(): string {
    return this._currentAudioUrl;
  }

  newInstance(): AudioMedia {
    return new MobileAudioMedia();
  }

  async prepare(): Promise<void> {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      interruptionModeIOS: InterruptionModeIOS.DoNotMix,
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
      interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    });
  }

  async load({ fileUrl }: { fileUrl: string }): Promise<void> {
    await this.clear();
  
    const source = { uri: fileUrl };
  
    const { sound, status } = await Audio.Sound.createAsync(
      source,
      { shouldPlay: false }
    );
  
    this.soundInstance = sound;
    this._currentAudioUrl = fileUrl;
    this._isPlaying = false;
    this._durationMillis = (status as AVPlaybackStatus & { durationMillis?: number }).durationMillis ?? 0;
  
    this.soundInstance.setOnPlaybackStatusUpdate((status) => {
      if (!status.isLoaded) return;
      this._isPlaying = status.isPlaying ?? false;
      this._durationMillis = status.durationMillis ?? 0;
      this._positionMillis = status.positionMillis ?? 0;
    });
  }

  async play(props?: AudioMediaProps): Promise<void> {
    if (!this.soundInstance) {
      throw new Error("No audio loaded");
    }

    if (props?.isSlowPlayback) {
      await this.setSpeedRate(0.75); // exemplo de velocidade lenta
    }

    await this.soundInstance.playAsync();
  }

  async rewind(quantity: number = 10000): Promise<void> {
    if (!this.soundInstance) return;

    const status = await this.soundInstance.getStatusAsync();
    if (status.isLoaded) {
      const newPosition = Math.max(0, status.positionMillis - quantity);
      await this.soundInstance.setPositionAsync(newPosition);
    }
  }

  async setSpeedRate(speedRate: number): Promise<void> {
    if (this.soundInstance) {
      await this.soundInstance.setRateAsync(speedRate, true);
    }
  }

  async clear(): Promise<void> {
    if (this.soundInstance) {
      await this.soundInstance.unloadAsync();
      this.soundInstance.setOnPlaybackStatusUpdate(null);
      this.soundInstance = null;
    }

    this._isPlaying = false;
    this._positionMillis = 0;
    this._durationMillis = 0;
    this._currentAudioUrl = "";
  }
}
