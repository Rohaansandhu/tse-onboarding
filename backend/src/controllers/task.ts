/**
 * Functions that process task route requests.
 */

import { validationResult } from "express-validator";
import createHttpError from "http-errors";
import TaskModel from "src/models/task";
import validationErrorParser from "src/util/validationErrorParser";

import type { RequestHandler } from "express";

export const getTask: RequestHandler = async (req, res, next) => {
  const { id } = req.params;

  try {
    const task = await TaskModel.findById(id).populate("assignee");

    if (task === null) {
      throw createHttpError(404, "Task not found.");
    }

    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
};

type CreateTaskBody = {
  title: string;
  description?: string;
  isChecked?: boolean;
  assignee?: string;
};

export const createTask: RequestHandler = async (req, res, next) => {
  const errors = validationResult(req);
  const { title, description, isChecked, assignee } = req.body as CreateTaskBody;

  try {
    validationErrorParser(errors);

    const task = await TaskModel.create({
      title,
      description,
      isChecked,
      dateCreated: Date.now(),
      assignee: assignee || undefined,
    });

    const populatedTask = await task.populate("assignee");

    res.status(201).json(populatedTask);
  } catch (error) {
    next(error);
  }
};

export const removeTask: RequestHandler = async (req, res, next) => {
  const { id } = req.params;

  try {
    const result = await TaskModel.deleteOne({ _id: id });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

type UpdateTaskBody = {
  title: string;
  description?: string;
  isChecked?: boolean;
  assignee?: string;
  _id: string;
};

export const updateTask: RequestHandler = async (req, res, next) => {
  const errors = validationResult(req);
  const { title, description, isChecked, assignee, _id } = req.body as UpdateTaskBody;
  
  try {
    validationErrorParser(errors);

    if (req.params.id !== _id) {
      res.status(400);
      return;
    }

    const task = await TaskModel.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        isChecked,
        assignee: assignee || undefined,
      },
      { new: true } // Return the updated document
    ).populate("assignee");

    if (task === null) {
      throw createHttpError(404, "Task not found.");
    }

    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
};
