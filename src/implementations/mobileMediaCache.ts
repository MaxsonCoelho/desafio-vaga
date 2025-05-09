import Constants from "expo-constants";
import * as FileSystem from "expo-file-system";
import MediaCache from "student-front-commons/src/core/mediaCache";

export default class MobileMediaCache implements MediaCache {
  private buildCacheUrl = (url: string) => `${FileSystem.documentDirectory}cache/${url.replace(/\//g, "-")}`;

  constructor() {
    FileSystem.makeDirectoryAsync(this.buildCacheUrl(""));
  }

  getCacheKey({ url }: { url: string }): string {
    return this.buildCacheUrl(url);
  }

  async insert({ url }: { url: string }): Promise<string | null> {
    try {
      const { uri, status } = await FileSystem.downloadAsync(
        `${Constants.expoConfig?.extra?.assetsUrl}/${url}`,
        this.buildCacheUrl(url),
      );

      return status === 200 ? uri : null;
    } catch (error) {
      return null;
    }
  }

  async delete({ url }: { url: string }): Promise<void> {
    await FileSystem.deleteAsync(this.buildCacheUrl(url));
  }

  async isFileCached({ url }: { url: string }): Promise<boolean> {
    const status = await FileSystem.getInfoAsync(this.buildCacheUrl(url));
    return status.exists;
  }
}
