import React, { useState } from "react";
import { type Task, updateTask } from "src/api/tasks";
import { CheckButton } from "src/components";
import styles from "src/components/TaskItem.module.css";

export type TaskItemProps = {
  task: Task;
};

export function TaskItem({ task: initialTask }: TaskItemProps) {
  const [task, setTask] = useState<Task>(initialTask);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [errorModalMessage, setErrorModalMessage] = useState<string | null>(null);

  const handleToggleCheck = () => {
    // your code here
    setLoading(true);
    updateTask({
      ...task,
      isChecked: !task.isChecked,
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
        <span className={styles.title}>{task.title}</span>
        {task.description && <span className={styles.description}>{task.description}</span>}
      </div>
    </div>
  );
}
