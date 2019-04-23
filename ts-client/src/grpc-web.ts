import * as grpcWeb from 'grpc-web';
import { EchoRequest, EchoResponse } from '../../protoc-gen-grpc-web/echo_pb';
import { EchoServiceClient } from '../../protoc-gen-grpc-web/echo_grpc_web_pb';
import { setResult } from './common';
import { HealthCheckRequest, HealthCheckResponse } from '../../protoc-gen-grpc-web/health_pb';
import { HealthClient } from '../../protoc-gen-grpc-web/health_grpc_web_pb';

export namespace GrpcWeb {
  export const echoRun = (endpoint: string, id: string) => {
    setResult(id, '', '');

    const req = new EchoRequest();
    req.setText('grpc-web mode=grpcweb')

    const client = new EchoServiceClient(endpoint, {}, {});
    client.echo(
      req,
      {},
      (err: grpcWeb.Error, res: EchoResponse) => {
        if (err) {
          setResult(id, err.message, String(err.code));
        } else {
          setResult(id, res.getText(), '');
        }
      }
    );
  }

  export const healthCheckRun = (endpoint: string, id: string) => {
    setResult(id, '', '');

    const req = new HealthCheckRequest()
    const client = new HealthClient(endpoint, {}, {});
    client.check(
      req,
      {},
      (err: grpcWeb.Error, res: HealthCheckResponse) => {
        if (err) {
          setResult(id, err.message, String(err.code));
        } else {
          let statusString = "";
          switch (res.getStatus()) {
            case 0:
              statusString = "UNKNOWN"
              break;
            case 1:
              statusString = "SERVING"
              break;
            case 2:
              statusString = "NOT_SERVING"
              break;
            default:
              break;
          }
          setResult(id, statusString, '');
        }
      }
    );
  }
}