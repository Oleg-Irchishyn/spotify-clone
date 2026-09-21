import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Job } from 'bullmq';

import { ListensProcessor } from '../listens.processor';
import { Track } from '../schemas/track.schema';

describe('ListensProcessor', () => {
  let processor: ListensProcessor;
  let trackModel: { updateOne: jest.Mock };

  beforeEach(async () => {
    trackModel = { updateOne: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListensProcessor,
        { provide: getModelToken(Track.name), useValue: trackModel },
      ],
    }).compile();

    processor = module.get<ListensProcessor>(ListensProcessor);
  });

  it('process() atomically increments the listens counter for the job track', async () => {
    const job = { data: { id: 'id1' } } as Job<{ id: string }>;

    await processor.process(job);

    expect(trackModel.updateOne).toHaveBeenCalledWith(
      { _id: 'id1' },
      { $inc: { listens: 1 } },
    );
  });
});
