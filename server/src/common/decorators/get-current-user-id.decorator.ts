import { ExecutionContext } from '@nestjs/common';
import { createParamDecorator } from '@nestjs/common/decorators/http/create-route-param-metadata.decorator';

export const GetCurrentUserId =
  createParamDecorator(
    (
      data: undefined,
      context: ExecutionContext,
    ) => {
      const request = context
        .switchToHttp()
        .getRequest();

      return request.user['sub'];
    },
  );
