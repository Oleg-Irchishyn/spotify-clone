import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  DefaultValuePipe,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ClientProxy } from '@nestjs/microservices';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { firstValueFrom } from 'rxjs';

import { toHttpException } from '../common/rpc-error.util';
import { toFilePayload } from '../common/to-file-payload.util';
import { JwtGuard } from '../guards/jwt.guard';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CreateTrackDto } from './dto/create-track.dto';

@ApiTags('Tracks')
@Controller('tracks')
export class TracksController {
  constructor(
    @Inject('CATALOG_SERVICE') private readonly catalogClient: ClientProxy,
  ) {}

  @ApiOperation({ summary: 'Create a new track with picture and audio files' })
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth('bearerAuth')
  @Post()
  @UseGuards(JwtGuard)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'picture', maxCount: 1 },
      { name: 'audio', maxCount: 1 },
    ]),
  )
  async create(
    @UploadedFiles()
    files: { picture?: Express.Multer.File[]; audio?: Express.Multer.File[] },
    @Body() dto: CreateTrackDto,
  ) {
    const [picture] = files.picture ?? [];
    const [audio] = files.audio ?? [];
    if (!picture || !audio) {
      throw new BadRequestException('picture and audio files are required');
    }

    return this.send('tracks.create', {
      dto,
      picture: toFilePayload(picture),
      audio: toFilePayload(audio),
    });
  }

  @ApiOperation({
    summary:
      'Update a track by id (picture/audio files are optional and replace the old ones only if provided)',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth('bearerAuth')
  @Put(':id')
  @UseGuards(JwtGuard)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'picture', maxCount: 1 },
      { name: 'audio', maxCount: 1 },
    ]),
  )
  async update(
    @Param('id') id: string,
    @UploadedFiles()
    files: { picture?: Express.Multer.File[]; audio?: Express.Multer.File[] },
    @Body() dto: CreateTrackDto,
  ) {
    const [picture] = files.picture ?? [];
    const [audio] = files.audio ?? [];

    return this.send('tracks.update', {
      id,
      dto,
      picture: picture ? toFilePayload(picture) : undefined,
      audio: audio ? toFilePayload(audio) : undefined,
    });
  }

  @ApiOperation({ summary: 'Get a paginated list of all tracks' })
  @Get()
  async getAll(
    @Query('count', new DefaultValuePipe(10), ParseIntPipe) count: number,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
    @Query('albumId') albumId?: string,
  ) {
    return this.send('tracks.getAll', { count, offset, albumId });
  }

  @ApiOperation({ summary: 'Search tracks by name, artist or text' })
  @Get('/search')
  async search(
    @Query('query', new DefaultValuePipe('')) query: string,
    @Query('count', new DefaultValuePipe(10), ParseIntPipe) count: number,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
    @Query('albumId') albumId?: string,
  ) {
    return this.send('tracks.search', { query, count, offset, albumId });
  }

  @ApiOperation({ summary: 'Get a single track by id, with populated comments' })
  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.send('tracks.getOne', { id });
  }

  @ApiOperation({ summary: 'Delete a track by id' })
  @ApiBearerAuth('bearerAuth')
  @Delete(':id')
  @UseGuards(JwtGuard)
  async delete(@Param('id') id: string) {
    return this.send('tracks.delete', { id });
  }

  @ApiOperation({ summary: 'Add a comment to a track' })
  @Post('/comment')
  async addComment(@Body() dto: CreateCommentDto) {
    return this.send('tracks.addComment', dto);
  }

  @ApiOperation({ summary: 'Increment the listens counter of a track' })
  @Post('/listen/:id')
  async listen(@Param('id') id: string) {
    return this.send('tracks.listen', { id });
  }

  private async send(pattern: string, payload: unknown) {
    try {
      return await firstValueFrom(this.catalogClient.send(pattern, payload));
    } catch (error) {
      throw toHttpException(error);
    }
  }
}
