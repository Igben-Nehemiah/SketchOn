import { SetMetadata } from '@nestjs/common/decorators/core/set-metadata.decorator';

export const Public = () =>
  SetMetadata('isPublic', true);
