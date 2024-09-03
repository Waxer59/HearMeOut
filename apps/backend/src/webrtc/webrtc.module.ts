import { Module } from '@nestjs/common';
import { WebrtcService } from './webrtc.service';
import { CachingModule } from 'src/caching/caching.module';

@Module({
  providers: [WebrtcService],
  imports: [CachingModule],
  exports: [WebrtcService],
})
export class WebrtcModule {}
