import {
  BadRequestException,
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
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
import { CreateAlbumDto } from './dto/create-album.dto';

@ApiTags('Albums')
@Controller('album')
export class AlbumController {
  constructor(
    @Inject('CATALOG_SERVICE') private readonly catalogClient: ClientProxy,
  ) {}

  @ApiOperation({
    summary:
      'Get a paginated list of albums, optionally filtered by search query',
  })
  @Get()
  async getAll(
    @Query('count', new DefaultValuePipe(10), ParseIntPipe) count: number,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
    @Query('query', new DefaultValuePipe('')) query: string,
  ) {
    return this.send('album.getAll', { query, count, offset });
  }

  @ApiOperation({ summary: 'Get a single album by id' })
  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.send('album.getOne', { id });
  }

  @ApiOperation({ summary: 'Create a new album with a picture' })
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth('bearerAuth')
  @Post()
  @UseGuards(JwtGuard)
  @UseInterceptors(FileFieldsInterceptor([{ name: 'picture', maxCount: 1 }]))
  async create(
    @UploadedFiles() files: { picture?: Express.Multer.File[] },
    @Body() dto: CreateAlbumDto,
  ) {
    const [picture] = files.picture ?? [];
    if (!picture) {
      throw new BadRequestException('picture is required');
    }

    return this.send('album.create', {
      dto,
      picture: toFilePayload(picture),
    });
  }

  @ApiOperation({
    summary:
      'Update an album by id (picture file is optional and replaces the old one only if provided)',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth('bearerAuth')
  @Put(':id')
  @UseGuards(JwtGuard)
  @UseInterceptors(FileFieldsInterceptor([{ name: 'picture', maxCount: 1 }]))
  async update(
    @Param('id') id: string,
    @UploadedFiles() files: { picture?: Express.Multer.File[] },
    @Body() dto: CreateAlbumDto,
  ) {
    const [picture] = files.picture ?? [];

    return this.send('album.update', {
      id,
      dto,
      picture: picture ? toFilePayload(picture) : undefined,
    });
  }

  @ApiOperation({ summary: 'Delete an album by id' })
  @ApiBearerAuth('bearerAuth')
  @Delete(':id')
  @UseGuards(JwtGuard)
  async delete(@Param('id') id: string) {
    return this.send('album.delete', { id });
  }

  private async send(pattern: string, payload: unknown) {
    try {
      return await firstValueFrom(this.catalogClient.send(pattern, payload));
    } catch (error) {
      throw toHttpException(error);
    }
  }
}
