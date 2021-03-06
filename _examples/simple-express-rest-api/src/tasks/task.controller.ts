import { Uuid } from '@dandi/common';
import { Inject } from '@dandi/core';
import { Controller, HttpGet, HttpPatch, PathParam, RequestBody } from '@dandi/mvc';
import { AccessorResourceId, ResourceAccessor } from '@dandi/mvc-hal';

import { Task, TaskResource } from './task';
import { TaskManager } from './task.manager';

@Controller('/task')
export class TaskController {
  constructor(@Inject(TaskManager) private taskManager: TaskManager) {}

  @HttpGet(':taskId')
  @ResourceAccessor(TaskResource)
  public async getTask(
    @PathParam(Uuid)
    @AccessorResourceId()
    taskId: Uuid,
  ): Promise<TaskResource> {
    return new TaskResource(await this.taskManager.getTask(taskId));
  }

  @HttpPatch(':taskId')
  public async updateTask(@PathParam(Uuid) taskId, @RequestBody(Task) task): Promise<TaskResource> {
    if (taskId !== task.taskId) {
      throw new Error('taskId on path did not match taskId on model');
    }

    const existingTask = await this.taskManager.getTask(taskId);
    if (task.listId !== undefined && task.listId !== existingTask.listId) {
    }
    Object.assign(existingTask, task);

    return new TaskResource(existingTask);
  }
}
