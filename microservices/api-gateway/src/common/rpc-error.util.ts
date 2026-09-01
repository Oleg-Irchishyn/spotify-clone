import { HttpException, HttpStatus } from '@nestjs/common';

interface RpcErrorShape {
  status?: number;
  message?: string;
}

// auth-service/catalog-service throw `new RpcException({ status, message })`;
// the ClientProxy observable errors out with exactly that object. This is
// the gateway's one place that turns an internal RPC failure into a proper
// HTTP response for the actual (external) caller.
export const toHttpException = (error: unknown): HttpException => {
  const shape = error as RpcErrorShape;
  const status =
    typeof shape?.status === 'number'
      ? shape.status
      : HttpStatus.INTERNAL_SERVER_ERROR;
  const message =
    typeof shape?.message === 'string' ? shape.message : 'Server error';

  return new HttpException(message, status);
};
