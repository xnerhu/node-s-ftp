import { EventEmitter } from 'events';
import { Writable, Readable } from 'stream';

import {
  IFile,
  ITransferOptions,
  ITransferProgressListener,
  ITransferInfo,
  ITransferListener,
} from '~/common/interfaces';
import { Transferable } from '~/core/network/transferable';
import { ITransferableUpdater } from '~/core/interfaces';

export declare interface Strategy {
  on(event: 'connect', listener: () => void): this;
  on(event: 'disconnect', listener: () => void): this;
  on(event: 'progress', listener: ITransferProgressListener): this;

  once(event: 'connect', listener: () => void): this;
  once(event: 'disconnect', listener: () => void): this;
}

/**
 * An abstract class, which allows to create a custom protocol.
 */
export abstract class Strategy extends EventEmitter {
  public transferListener: ITransferListener;

  constructor(
    protected readonly config: any,
    protected readonly options?: any,
  ) {
    super();
  }

  public abstract connect(): Promise<void>;

  public abstract disconnect(): Promise<void>;

  public async abort() {
    await this.disconnect();
    await this.connect();
  }

  public abstract download: (
    dest: Writable,
    info: ITransferInfo,
    options?: ITransferOptions,
  ) => Promise<void>;

  public abstract upload: (
    source: Readable,
    info: ITransferInfo,
    options?: ITransferOptions,
  ) => Promise<void>;

  public abstract list(path?: string): Promise<IFile[]>;

  public abstract size(path: string): Promise<number>;

  public abstract exists(path: string): Promise<boolean>;

  public abstract move(source: string, dest: string): Promise<void>;

  public abstract removeFile(path: string): Promise<void>;

  public abstract removeEmptyFolder(path: string): Promise<void>;

  public abstract removeFolder(path: string): Promise<void>;

  public abstract createFolder(path: string): Promise<void>;

  public abstract createEmptyFile(path: string): Promise<void>;

  public abstract pwd(): Promise<string>;

  public abstract send(command: string): Promise<string>;
}