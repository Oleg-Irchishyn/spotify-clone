import { Processor, WorkerHost } from '@nestjs/bullmq';
import { InjectModel } from '@nestjs/mongoose';
import { Job } from 'bullmq';
import { Model } from 'mongoose';

import { Track, TrackDocument } from './schemas/track.schema';

@Processor('track-listens')
export class ListensProcessor extends WorkerHost {
  constructor(
    @InjectModel(Track.name)
    private readonly trackModel: Model<TrackDocument>,
  ) {
    super();
  }

  async process(job: Job<{ id: string }>): Promise<void> {
    await this.trackModel.updateOne(
      { _id: job.data.id },
      { $inc: { listens: 1 } },
    );
  }
}
