import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { TrackService } from './track.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Track } from './schemas/track.schema';
import { Comment } from './schemas/comment.schema';
import { ValidationErrorDto } from 'src/exceptions/dto/validation-error.dto';

@ApiTags('Tracks')
@Controller('tracks')
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

  @ApiOperation({ summary: 'Create a new track with picture and audio files' })
  @ApiConsumes('multipart/form-data')
  @ApiCreatedResponse({
    description: 'Track successfully created and saved to the database',
    type: Track,
  })
  @ApiBadRequestResponse({
    description: 'Validation error, or picture/audio file is missing',
    type: ValidationErrorDto,
  })
  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'picture', maxCount: 1 },
      { name: 'audio', maxCount: 1 },
    ]),
  )
  create(
    @UploadedFiles()
    files: { picture?: Express.Multer.File[]; audio?: Express.Multer.File[] },
    @Body() dto: CreateTrackDto,
  ) {
    const [picture] = files.picture ?? [];
    const [audio] = files.audio ?? [];
    if (!picture || !audio) {
      throw new BadRequestException('picture and audio files are required');
    }
    return this.trackService.create(dto, picture, audio);
  }

  @ApiOperation({
    summary:
      'Update a track by id (picture/audio files are optional and replace the old ones only if provided)',
  })
  @ApiConsumes('multipart/form-data')
  @ApiOkResponse({
    description: 'Track successfully updated',
    type: Track,
  })
  @ApiBadRequestResponse({
    description: 'Validation error',
    type: ValidationErrorDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Track with the given id was not found',
  })
  @Put(':id')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'picture', maxCount: 1 },
      { name: 'audio', maxCount: 1 },
    ]),
  )
  update(
    @Param('id') id: string,
    @UploadedFiles()
    files: { picture?: Express.Multer.File[]; audio?: Express.Multer.File[] },
    @Body() dto: CreateTrackDto,
  ) {
    const [picture] = files.picture ?? [];
    const [audio] = files.audio ?? [];
    return this.trackService.update(id, dto, picture, audio);
  }

  @ApiOperation({ summary: 'Get a paginated list of all tracks' })
  @ApiOkResponse({ description: 'List of tracks', type: [Track] })
  @Get()
  getAll(
    @Query('count', new DefaultValuePipe(10), ParseIntPipe) count: number,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
  ) {
    return this.trackService.getAll(count, offset);
  }

  @ApiOperation({ summary: 'Search tracks by name, artist or text' })
  @ApiOkResponse({ description: 'List of matching tracks', type: [Track] })
  @Get('/search')
  search(@Query('query', new DefaultValuePipe('')) query: string) {
    return this.trackService.search(query);
  }

  @ApiOperation({
    summary: 'Get a single track by id, with populated comments',
  })
  @ApiOkResponse({ description: 'Track found', type: Track })
  @ApiResponse({
    status: 404,
    description: 'Track with the given id was not found',
  })
  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.trackService.getOne(id);
  }

  @ApiOperation({ summary: 'Delete a track by id' })
  @ApiOkResponse({ description: 'Track successfully deleted' })
  @ApiResponse({
    status: 404,
    description: 'Track with the given id was not found',
  })
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.trackService.delete(id);
  }

  @ApiOperation({ summary: 'Add a comment to a track' })
  @ApiCreatedResponse({
    description: 'Comment successfully created',
    type: Comment,
  })
  @ApiBadRequestResponse({
    description: 'Validation error',
    type: ValidationErrorDto,
  })
  @Post('/comment')
  addComment(@Body() dto: CreateCommentDto) {
    return this.trackService.addComment(dto);
  }

  @ApiOperation({ summary: 'Increment the listens counter of a track' })
  @ApiOkResponse({ description: 'Listens counter incremented' })
  @Post('/listen/:id')
  listen(@Param('id') id: string) {
    return this.trackService.listen(id);
  }
}
