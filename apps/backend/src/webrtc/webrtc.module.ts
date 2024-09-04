import { Module } from '@nestjs/common';
import { WebrtcService } from './webrtc.service';

@Module({
  providers: [WebrtcService],
  exports: [WebrtcService],
})
export class WebrtcModule {}
