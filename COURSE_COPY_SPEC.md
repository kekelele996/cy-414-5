# 课程复制功能单元说明文档

## 1. 功能概述

教练在发布同类课程时，无需反复填写相同的基础信息。系统支持将一门已发布的课程快速复制为新的草稿课程，复制后保留原课程的核心信息，教练只需微调即可重新发布。

## 2. 涉及文件

### 后端

| 文件 | 说明 |
|------|------|
| [constants/errorCodes.ts](file:///Users/gaobo/repositories/gitlab/评审项目/project/solo-0615-cy/cy-414-代码生成-5/cy-414-代码生成-5/backend/src/constants/errorCodes.ts) | 新增 `COURSE_COPY_NOT_OWNER`、`COURSE_COPY_INVALID_STATUS` 错误码 |
| [constants/messages.ts](file:///Users/gaobo/repositories/gitlab/评审项目/project/solo-0615-cy/cy-414-代码生成-5/cy-414-代码生成-5/backend/src/constants/messages.ts) | 新增 `COURSE_COPIED` 日志消息 |
| [services/courseService.ts](file:///Users/gaobo/repositories/gitlab/评审项目/project/solo-0615-cy/cy-414-代码生成-5/cy-414-代码生成-5/backend/src/services/courseService.ts) | 核心业务逻辑实现 |
| [controllers/courseController.ts](file:///Users/gaobo/repositories/gitlab/评审项目/project/solo-0615-cy/cy-414-代码生成-5/cy-414-代码生成-5/backend/src/controllers/courseController.ts) | HTTP 接口控制器 |
| [routes/courseRoutes.ts](file:///Users/gaobo/repositories/gitlab/评审项目/project/solo-0615-cy/cy-414-代码生成-5/cy-414-代码生成-5/backend/src/routes/courseRoutes.ts) | 路由注册 |

### 前端

| 文件 | 说明 |
|------|------|
| [api/course.ts](file:///Users/gaobo/repositories/gitlab/评审项目/project/solo-0615-cy/cy-414-代码生成-5/cy-414-代码生成-5/frontend/src/api/course.ts) | 复制 API 封装 |
| [stores/courseStore.ts](file:///Users/gaobo/repositories/gitlab/评审项目/project/solo-0615-cy/cy-414-代码生成-5/cy-414-代码生成-5/frontend/src/stores/courseStore.ts) | Pinia store action |
| [components/common/CourseCard.vue](file:///Users/gaobo/repositories/gitlab/评审项目/project/solo-0615-cy/cy-414-代码生成-5/cy-414-代码生成-5/frontend/src/components/common/CourseCard.vue) | 课程卡片组件（复制按钮、草稿标签） |
| [pages/Courses.vue](file:///Users/gaobo/repositories/gitlab/评审项目/project/solo-0615-cy/cy-414-代码生成-5/cy-414-代码生成-5/frontend/src/pages/Courses.vue) | 课程列表页面 |

## 3. API 接口

### POST /courses/:id/copy

**权限要求**：`coach` 或 `admin` 角色（通过 `roleCheck` 中间件校验）

**请求参数**：
- `id`（路径参数）：源课程 ID

**成功响应（201）**：
```json
{
  "id": 4,
  "coachId": 2,
  "title": "晨间力量唤醒",
  "description": "小班力量训练，聚焦核心激活与动作模式校准。",
  "duration": 60,
  "price": 188,
  "maxCapacity": 6,
  "schedule": ["2026-06-16T08:00:00+08:00", "2026-06-18T08:00:00+08:00"],
  "status": "draft",
  "createdAt": "2026-06-15T10:30:00.000Z",
  "coach": { ... }
}
```

**失败响应**：
| 状态码 | 错误码 | 触发条件 |
|--------|--------|----------|
| 403 | COURSE_COACH_REQUIRED | 用户角色不是 coach/admin |
| 404 | COURSE_NOT_FOUND | 源课程不存在 |
| 403 | COURSE_COPY_NOT_OWNER | 教练尝试复制他人的课程（admin 除外） |
| 400 | COURSE_COPY_INVALID_STATUS | 源课程状态不是 published |

## 4. 核心业务逻辑

### 4.1 复制流程（courseService.copy）

```
输入: sourceId, coachId, role
        │
        ▼
  权限校验：必须是 coach 或 admin
        │
        ▼
  查询源课程是否存在
        │
        ▼
  所有权校验：非 admin 必须是源课程的 coach
        │
        ▼
  状态校验：源课程必须是 published
        │
        ▼
  创建新课程（status=draft），保留：
  - title（标题）
  - description（描述）
  - duration（时长）
  - price（价格）
  - maxCapacity（容量）
  - schedule（排期模板）
  - coachId（复制者）
        │
        ▼
  返回新课程数据
```

### 4.2 课程列表可见性（courseService.list）

草稿课程的可见性规则：

| 用户角色 | 可见的草稿 | 可见的已发布课程 |
|----------|-----------|----------------|
| student  | 无        | 全部            |
| coach    | 自己的    | 全部            |
| admin    | 全部      | 全部            |

查询条件构造：
```
WHERE (
  status = 'published'
  OR (status = 'draft' AND coachId = <当前用户ID>)  -- 仅 coach/admin
)
[AND 关键词筛选]
[AND coachId = <筛选教练ID>]
ORDER BY status ASC, createdAt DESC
```

**排序规则**：草稿在前，相同状态下按创建时间倒序。

### 4.3 前端显示规则

- **草稿标签**：`status === 'draft'` 的课程显示灰色「草稿」徽章
- **复制按钮显示条件**（三者同时满足）：
  1. 当前用户是 `coach` 或 `admin`
  2. 课程状态是 `published`
  3. 非 admin 用户必须是该课程的教练
- **预约按钮**：仅 `status === 'published'` 且有排期时显示

## 5. 数据流

```
用户点击「复制」
    │
    ▼
CourseCard.emit('copy', course)
    │
    ▼
Courses.vue -> courseStore.copyCourse(id)
    │
    ▼
courseApi.copy(id) -> POST /courses/:id/copy
    │
    ▼
后端创建草稿课程成功
    │
    ▼
courseStore.loadCourses() 重新拉取列表
    │
    ▼
显示成功提示 + 列表更新（新草稿出现在顶部）
```

## 6. 校验说明

- ✅ TypeScript 类型检查通过（`npx tsc --noEmit`）
- ✅ 项目构建成功（`npm run build`）
- ✅ 无 VS Code 诊断错误（`GetDiagnostics`）
