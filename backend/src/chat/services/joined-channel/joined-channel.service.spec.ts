import { Test, TestingModule } from '@nestjs/testing';
import { JoinedChannelService } from './joined-channel.service';

describe('JoinedChannelService', () => {
  let service: JoinedChannelService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JoinedChannelService],
    }).compile();

    service = module.get<JoinedChannelService>(JoinedChannelService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
