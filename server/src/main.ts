import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as express from 'express';
import { AppModule } from '@/app.module';
import { HttpStatusInterceptor } from '@/interceptors/http-status.interceptor';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { Logger } from './logger/logger.service';
import { initializeTracing } from './tracing/tracing';

// Initialize OpenTelemetry tracing
initializeTracing();

function parsePort(): number {
  const args = process.argv.slice(2);
  const portIndex = args.indexOf('-p');
  if (portIndex !== -1 && args[portIndex + 1]) {
    const port = parseInt(args[portIndex + 1], 10);
    if (!Number.isNaN(port) && port > 0 && port < 65536) {
      return port;
    }
  }
  return 3000;
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new Logger(),
  });

  app.enableCors({
    origin: true,
    credentials: true,
  });
  app.setGlobalPrefix('api');
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // 全局异常过滤器
  app.useGlobalFilters(new HttpExceptionFilter());

  // 全局日志中间件
  app.use(new LoggerMiddleware().use.bind(new LoggerMiddleware()));

  // 全局拦截器：统一将 POST 请求的 201 状态码改为 200
  app.useGlobalInterceptors(new HttpStatusInterceptor());

  // 配置 Swagger
  const config = new DocumentBuilder()
    .setTitle('保洁服务小程序 API')
    .setDescription('提供保洁服务和局部改造服务的预约与管理功能')
    .setVersion('1.0')
    .addTag('auth', '认证相关接口')
    .addTag('users', '用户管理接口')
    .addTag('sms', '短信服务接口')
    .addTag('orders', '订单管理接口')
    .addTag('services', '服务管理接口')
    .addTag('staff', '服务人员管理接口')
    .addTag('roles', '角色权限管理接口')
    .addTag('statistics', '统计分析接口')
    .addTag('payment', '支付管理接口')
    .addTag('realtime', '实时通信接口')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: '请输入 JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
    customSiteTitle: '保洁服务小程序 API 文档',
  });

  // 开启优雅关闭 Hooks
  app.enableShutdownHooks();

  // 解析端口
  const port = parsePort();
  try {
    await app.listen(port);
    console.log(`Server running on http://localhost:${port}`);
    console.log(`Swagger UI available at http://localhost:${port}/api-docs`);
  } catch (err: any) {
    if (err.code === 'EADDRINUSE') {
      console.error(`❌ 端口 ${port} 被占用! 请运行 'npx kill-port ${port}' 然后重试。`);
      process.exit(1);
    } else {
      throw err;
    }
  }
}
bootstrap();
