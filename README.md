# FitPro 运动健身私教预约平台

FitPro 是一个前后端分离的全栈 Web 应用，连接学员、教练和管理员。学员可以浏览课程、预约私教课、取消预约、完成打卡和记录体测；教练可以发布课程、确认预约并查看课程安排；管理员可通过 RBAC 访问核心管理能力。

## 技术栈

- 前端：Vue 3、TypeScript、Vite、Element Plus、ECharts、Pinia、Vue Router
- 后端：Node.js、Express、TypeScript、Prisma、JWT、RBAC、bcryptjs、zod、dayjs
- 数据库：MySQL 8.0
- 部署：Docker Compose，项目名 `fitpro`

## 启动方式

1. 复制环境变量：

```bash
cp .env.example .env
```

2. 一键启动：

```bash
docker compose up -d
```

3. 访问：

- 前端：http://localhost:18414
- 后端健康检查：http://localhost:19414/health
- MySQL：localhost:3306

4. 关闭：

```bash
docker compose down
```

## 本地开发验证

```bash
cd backend && npm install && npm run build
cd frontend && npm install && npm run build
```

前端开发服务：

```bash
cd frontend
npm run dev
```

后端开发服务：

```bash
cd backend
npm run dev
```

## 目录结构

```text
frontend/src/
├── api/
├── stores/
├── types/
├── components/common/
├── hooks/
├── pages/
├── router/
├── utils/
└── constants/

backend/src/
├── routes/
├── controllers/
├── services/
├── models/
├── middlewares/
├── utils/
├── types/
├── constants/
├── config/
└── prisma/
```

## 核心实体贯穿

- User：`users` 表、Prisma `User`、后端 User model/service/controller/routes、前端 `authStore/userStore/profile`。
- Course：`courses` 表、Prisma `Course`、Course model/service/controller/routes、前端课程广场和首页推荐。
- Booking：`bookings` 表、Prisma `Booking`、Booking model/service/controller/routes、前端预约列表、状态徽章和打卡按钮。
- BodyMetric：`body_metrics` 表、Prisma `BodyMetric`、BodyMetric model/service/controller/routes、前端趋势图和历史记录。

## 横切关注点

- JWT + RBAC：数据库 `users.role`、`backend/src/middlewares/auth.ts`、`backend/src/middlewares/roleCheck.ts`、`backend/src/utils/jwt.ts`、实体路由权限、`frontend/src/router/guards.ts`、`frontend/src/components/common/RoleGuard.tsx`、`frontend/src/stores/authStore.ts`。
- 接口限流：`backend/src/config/rateLimit.ts`、`backend/src/middlewares/rateLimiter.ts`、登录/预约/通用接口路由。
- 全局错误处理：`backend/src/middlewares/errorHandler.ts`、`backend/src/utils/AppError.ts`、`frontend/src/utils/request.ts`。

## BookingStatus 枚举出现位置

- 前端定义：`frontend/src/constants/booking.ts`
- 后端定义：`backend/src/constants/booking.ts`
- Prisma schema：`backend/src/prisma/schema.prisma`
- 数据库初始化：`database/init.sql`
- 前端类型：`frontend/src/types/domain.ts`
- 后端类型：`backend/src/types/domain.ts`
- Booking 模型：`backend/src/models/Booking.ts`
- BookingService 状态机：`backend/src/services/bookingService.ts`
- BookingController：`backend/src/controllers/bookingController.ts`
- 前端预约 store：`frontend/src/stores/bookingStore.ts`
- 前端预约统计 hook：`frontend/src/hooks/useBookingStats.ts`
- 预约状态徽章：`frontend/src/components/common/BookingStatusBadge.vue`
- 预约列表按钮显隐：`frontend/src/pages/Bookings.vue`
- 首页预约筛选：`frontend/src/pages/Dashboard.vue`
- 错误码：`backend/src/constants/errorCodes.ts`、`frontend/src/constants/errorCodes.ts`
- 日志模板：`backend/src/constants/logTemplates.ts`
- 文案常量：`backend/src/constants/messages.ts`、`frontend/src/constants/messages.ts`
- 格式化工具：`backend/src/utils/formatters.ts`、`frontend/src/utils/formatters.ts`

## UserRole 枚举出现位置

- 前端定义：`frontend/src/constants/user.ts`
- 后端定义：`backend/src/constants/user.ts`
- Prisma schema：`backend/src/prisma/schema.prisma`
- 数据库初始化：`database/init.sql`
- 前端类型：`frontend/src/types/domain.ts`
- 后端类型：`backend/src/types/domain.ts`
- User 模型：`backend/src/models/User.ts`
- RBAC 中间件：`backend/src/middlewares/roleCheck.ts`
- JWT 载荷：`backend/src/utils/jwt.ts`
- 后端路由权限：`backend/src/routes/userRoutes.ts`、`backend/src/routes/courseRoutes.ts`、`backend/src/routes/bookingRoutes.ts`、`backend/src/routes/bodyMetricRoutes.ts`
- 业务服务：`backend/src/services/userService.ts`、`backend/src/services/courseService.ts`、`backend/src/services/bookingService.ts`、`backend/src/services/bodyMetricService.ts`
- 前端路由守卫：`frontend/src/router/guards.ts`、`frontend/src/router/index.ts`
- 前端登录态 store：`frontend/src/stores/authStore.ts`
- 前端按钮显隐：`frontend/src/components/common/RoleGuard.tsx`、`frontend/src/pages/Courses.vue`
- 教练头像/角色展示：`frontend/src/components/common/CoachAvatar.vue`
- 个人中心角色展示：`frontend/src/pages/Profile.vue`
- 错误码：`backend/src/constants/errorCodes.ts`、`frontend/src/constants/errorCodes.ts`
- 日志模板：`backend/src/constants/logTemplates.ts`
- 文案常量：`backend/src/constants/messages.ts`、`frontend/src/constants/messages.ts`
- 格式化工具：`backend/src/utils/formatters.ts`、`frontend/src/utils/formatters.ts`

## 低内聚高耦合设计说明

本项目按要求保留牵一发动全身的耦合点：

- 日志模块独立在 `backend/src/utils/logger.js`，controller、service、middleware 均引用；日志模板集中在 `backend/src/constants/logTemplates.ts`，超过 25 条。
- 错误码集中在 `backend/src/constants/errorCodes.ts` 和前端同名文件，但 service/controller 都手动包装错误消息，消息包含实体名、字段名、角色名。
- `utils/formatters.ts` 同时处理日期、价格、预约状态、角色、BMI 等级，修改文案会影响多处显示和日志。
- `constants/messages.ts` 同时包含前端提示、后端返回和日志相关文案。
- `BookingStatus` 状态流转在 Prisma、service 状态机、前端按钮显隐、日志模板、错误码、formatters 中重复定义。

## Docker Compose 要点

- `docker-compose.yml` 无 `version:` 字段，顶层 `name: fitpro`
- 容器名使用 `${COMPOSE_PROJECT_NAME:-fitpro}` 前缀
- 前端 Nginx 将 `/api/` 代理到 `http://backend:3000/`
- MySQL 使用命名卷 `fitpro_mysql_data`
- 数据库和后端均配置 healthcheck，后端等待数据库健康后启动

