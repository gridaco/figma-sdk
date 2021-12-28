import { ImageRepository } from "./image-repository";

export abstract class BaseImageRepositories<T = Uint8Array> {
  repositories: Map<string, ImageRepository> = new Map<
    string,
    ImageRepository
  >();
  imageHashMap: Map<string, T> = new Map<string, T>();

  get(buildId: string): ImageRepository {
    const _exists = this.repositories[buildId];
    if (_exists) {
      return _exists;
    }
    throw new Error(`Image repository with buildId ${buildId} not found`);
  }

  /**
   * merges all images map under repositories this contains.
   * @returns
   */
  mergeAll(): { [key: string]: T } {
    let images = {};
    for (const k of Object.keys(this.repositories)) {
      images = {
        ...images,
        ...(this.repositories[k].images ?? {}),
      };
    }
    return images;
  }

  get empty(): boolean {
    if (this.repositories.size === 0) {
      return true;
    }
    if (Object.keys(this.mergeAll()).length === 0) {
      return true;
    }
    return false;
  }

  /**
   * finds ImageAsset under repositories by image key
   * @param key
   */
  find(key: string) {
    for (const k of Object.keys(this.repositories)) {
      const repository = this.repositories[k];
      const image = repository.images[key];
      if (image) {
        return image;
      }
    }
    return null;
  }

  clear() {
    this.repositories = new Map<string, ImageRepository>();
    this.imageHashMap = new Map<string, T>();
  }

  /**
   * registers new image repository
   * @param repository
   */
  register(repository: ImageRepository) {
    this.repositories[repository.buildId] = repository;
  }

  /**
   * removes image repository registration from image repositories by buildid
   * @param buildId
   */
  delete(buildId: string) {
    this.repositories.delete(buildId);
  }

  registerDataWithHash(hash: string, data: T) {
    this.imageHashMap[hash] = data;
  }

  async fetchDataByHash(hash: string): Promise<T> {
    if (this.isImageHashRegistered(hash)) {
      return this.imageHashMap[hash];
    }
    const imageData = await this._fetchDataByHash(hash);
    this.registerDataWithHash(hash, imageData);
    return imageData;
  }

  /**
   * platform specific data fetching
   * @param hash
   */
  abstract _fetchDataByHash(hash: string): T | Promise<T>;

  /**
   * platform specific methods
   * @param id image node's id
   */
  abstract fetchDataById(
    id: string,
    config?: { type: "original" }
  ): T | Promise<T>;

  abstract fetchAll(...id: string[]): Promise<any>;

  isImageHashRegistered(hash: string): boolean {
    return this.imageHashMap.has(hash);
  }
}
