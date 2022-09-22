import { ExecutionContext } from '@nestjs/common';
import { createParamDecorator } from '@nestjs/common/decorators/http/create-route-param-metadata.decorator';

export const GetCurrentUser =
  createParamDecorator(
    (
      data: string | undefined,
      context: ExecutionContext,
    ) => {
      const request = context
        .switchToHttp()
        .getRequest();

      if (!data) {
        return request.user;
      }
      return request.user[data];
    },
  );
