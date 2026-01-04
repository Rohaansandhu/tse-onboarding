import React, { useState } from "react";
import { Link } from "react-router-dom";
import { type Task, updateTask } from "src/api/tasks";
import { CheckButton, UserTag } from "src/components";
import styles from "src/components/TaskItem.module.css";

export type TaskItemProps = {
  task: Task;
};

export function TaskItem({ task: initialTask }: TaskItemProps) {
  const [task, setTask] = useState<Task>(initialTask);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [errorModalMessage, setErrorModalMessage] = useState<string | null>(null);

  // just to satisfy unused variable warning tbh
  console.log(errorModalMessage);

  const handleToggleCheck = () => {
    setLoading(true);
    updateTask({
      _id: task._id,
      title: task.title,
      description: task.description,
      isChecked: !task.isChecked,
      dateCreated: task.dateCreated,
      assignee: task.assignee?._id,
    })
      .then((result) => {
        if (result.success) {
          setTask(result.data);
        } else {
          setErrorModalMessage(result.error);
        }
      })
      .catch(setErrorModalMessage)
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className={styles.item}>
      <label>
        <CheckButton checked={task.isChecked} disabled={isLoading} onPress={handleToggleCheck} />
      </label>
      <div
        className={
          task.isChecked ? `${styles.textContainer} ${styles.checked}` : styles.textContainer
        }
      >
        <div className={styles.textContent}>
          <Link to={`/task/${task._id}`} className={styles.titleLink}>
            <span className={styles.title}>{task.title}</span>
          </Link>
          {task.description && <span className={styles.description}>{task.description}</span>}
        </div>
        <UserTag user={task.assignee} className={styles.userTag} />
      </div>
    </div>
  );
}
