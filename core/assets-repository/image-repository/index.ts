// hold images that target node holds
import { IImageRepository } from "@bridged.xyz/base-sdk";

/**
 * singleton reference holder class since BaseImageRepositories is abstract and gets override by platform
 */
export class MainImageRepository {
  private static _main: BaseImageRepositories;
  static set instance(instance: BaseImageRepositories) {
    this._main = instance;
  }

  static get instance(): BaseImageRepositories {
    if (!this._main) {
      throw "cannot get main ImageRepositories. set it via `MainImageRepository.set()` before calling this.";
    }
    return this._main;
  }
}

export abstract class BaseImageRepositories {
  repositories: Map<string, ImageRepository> = new Map<
    string,
    ImageRepository
  >();
  imageHashMap: Map<string, Uint8Array> = new Map<string, Uint8Array>();

  private _current: ImageRepository;
  get current(): ImageRepository {
    if (!this._current) {
      const buildId = `${Date.now()}`;
      console.info("initializing new image repository", buildId);
      this._current = new ImageRepository(buildId);
    }
    return this._current;
  }

  clear() {
    this.repositories = new Map<string, ImageRepository>();
    this.imageHashMap = new Map<string, Uint8Array>();
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

  registerDataWithHash(hash: string, data: Uint8Array) {
    this.imageHashMap[hash] = data;
  }

  async fetchDataByHash(hash: string): Promise<Uint8Array> {
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
  abstract _fetchDataByHash(hash: string): Uint8Array | Promise<Uint8Array>;

  /**
   * platform specific methods
   * @param id image node's id
   */
  abstract fetchDataById(id: string): Uint8Array | Promise<Uint8Array>;

  isImageHashRegistered(hash: string): boolean {
    return this.imageHashMap.has(hash);
  }
}

export abstract class TemporaryAsset<T> {
  data?: T;
  url: string;
  constructor(
    readonly key: string,
    args?: {
      url?: string;
      data?: T;
    }
  ) {
    this.url = args?.url;
    this.data = args?.data;
  }

  abstract fetchData(): T | Promise<T>;
}

export interface ImageAsset {
  data: Uint8Array;
  key: string;
  url: string;
}

export class TemporaryImageAsset extends TemporaryAsset<Uint8Array> {
  data?: Uint8Array;
  url: string;
  constructor(
    readonly key: string,
    readonly hash: string,
    args?: {
      data?: Uint8Array;
    }
  ) {
    super(key, args);
    this.url = this.makeUrl(key);
  }

  makeUrl(key: string): string {
    return buildTempImageAssetUrl(key);
  }

  async fetchData(): Promise<Uint8Array> {
    if (this.data) {
      // if data exists, return it.
      return this.data;
    }
    // return await ImageRepositories.fetchDataByHash(this.hash)
    return await MainImageRepository.instance.fetchDataById(this.key);
  }
}

// interface for sending this as ui.postmessage
export interface TransportableImageRepository {
  buildId: string;
  images: ReadonlyArray<ImageAsset>;
}

export class ImageRepository implements IImageRepository<TemporaryImageAsset> {
  images: Map<string, TemporaryImageAsset> = new Map<
    string,
    TemporaryImageAsset
  >();

  constructor(readonly buildId: string) {}

  exists(key: string): boolean {
    return this.images.has(key);
  }

  addImage(props: {
    key: string;
    hash?: string;
    data?: Uint8Array;
  }): TemporaryImageAsset {
    if (this.exists(props.key)) {
      console.warn(
        "image you are tring to register to current build repository is already registered.",
        props.hash
      );
      return this.images[props.key];
    } else {
      // register image to repository images
      const newImage = new TemporaryImageAsset(props.key, props.hash);
      this.images[props.key] = newImage;
      console.info(
        `registered image of key ${props.key} to image repository`,
        this.images
      );
      return newImage;
    }
  }

  async makeTransportable(): Promise<TransportableImageRepository> {
    const imageAssets: Array<ImageAsset> = [];
    const jobs: Array<Promise<Uint8Array>> = [];
    const keys = Object.keys(this.images);
    for (const key of keys) {
      const asset: TemporaryImageAsset = this.images[key];
      const job = asset.fetchData();
      jobs.push(job);
    }

    const rawImageDatas = await Promise.all(jobs);
    rawImageDatas.forEach((v, i, a) => {
      const key = keys[i];
      imageAssets.push({
        key: key,
        data: v,
        url: buildTempImageAssetUrl(key),
      });
    });

    return {
      buildId: this.buildId,
      images: imageAssets,
    };
  }
}

function buildTempImageAssetUrl(key: string): string {
  return `bridged://url-reservation/image-hosting/${key}`;
}
