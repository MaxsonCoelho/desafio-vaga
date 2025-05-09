import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from "expo-av";
import RecordMedia from "student-front-commons/src/core/recordMedia";

export default class MobileRecordMedia implements RecordMedia {
  private recorderInstance: Audio.Recording | undefined;
  private _isRecording: boolean = false;

  async prepare(): Promise<void> {
    const { status } = await Audio.requestPermissionsAsync();

    if (status !== "granted") {
      throw new Error("Microphone permission not granted");
    }

    this.recorderInstance = new Audio.Recording();

    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      allowsRecordingIOS: true,
      staysActiveInBackground: false,
      interruptionModeIOS: InterruptionModeIOS.DoNotMix,
      shouldDuckAndroid: false,
      interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
      playThroughEarpieceAndroid: false,
    });

    await this.recorderInstance.prepareToRecordAsync({
      isMeteringEnabled: false,
      keepAudioActiveHint: true,
      android: {
        extension: ".m4a",
        outputFormat: Audio.AndroidOutputFormat.MPEG_4,
        audioEncoder: Audio.AndroidAudioEncoder.AAC,
        sampleRate: 32000,
        numberOfChannels: 1,
        bitRate: 64000,
      },
      ios: {
        extension: ".m4a",
        outputFormat: Audio.IOSOutputFormat.MPEG4AAC,
        audioQuality: Audio.IOSAudioQuality.MEDIUM,
        sampleRate: 32000,
        numberOfChannels: 1,
        bitRate: 64000,
      },
      web: {},
    });
  }

  async record(): Promise<void> {
    try {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        allowsRecordingIOS: true,
        staysActiveInBackground: false,
        interruptionModeIOS: InterruptionModeIOS.DoNotMix,
        shouldDuckAndroid: false,
        interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
        playThroughEarpieceAndroid: false,
      });
      await this.recorderInstance?.startAsync();
      this._isRecording = true;
    } catch (error) {
      if ((error as { code: string }).code === "E_MISSING_PERMISSION") {
        throw new Error("missing_permission");
      }
    }
  }

  async stop(): Promise<unknown | null> {
    if (!this.recorderInstance) {
      return null;
    }

    const recordStatus = await this.recorderInstance.getStatusAsync();
    if (recordStatus.canRecord || recordStatus.isRecording) {
      await this.recorderInstance.stopAndUnloadAsync();
    }

    this._isRecording = false;

    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      allowsRecordingIOS: false,
      staysActiveInBackground: false,
      interruptionModeIOS: InterruptionModeIOS.DoNotMix,
      shouldDuckAndroid: false,
      interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
      playThroughEarpieceAndroid: false,
    });

    const uri = this.recorderInstance.getURI();

    if (uri) {
      return {
        uri,
        type: `audio/${uri.split("/").pop()?.split(".").pop()}`,
        name: uri.split("/").pop(),
      };
    }

    return null;
  }

  get isRecording(): boolean {
    return this._isRecording;
  }
}
