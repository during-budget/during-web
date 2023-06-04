import { Iamport } from './portone';
import { IChannelIO } from '../models/Channel';

declare global {
  interface Window {
    IMP?: Iamport;
    ChannelIO?: IChannelIO;
    ChannelIOInitialized?: boolean;
  }
}
