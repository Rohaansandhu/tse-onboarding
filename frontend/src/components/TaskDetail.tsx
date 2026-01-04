import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Dialog } from "@tritonse/tse-constellation";

import { getTask, type Task } from "src/api/tasks";
import { Button, Page, TaskForm, UserTag } from "src/components";
import styles from "./TaskDetail.module.css";

export function TaskDetailItem() {
  const { id } = useParams<{ id: string }>();

  const [task, setTask] = useState<Task | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [errorModalMessage, setErrorModalMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    void getTask(id)
      .then((result) => {
        if (result.success) {
          setTask(result.data);
          document.title = `${result.data.title} | TSE Todos`;
        } else {
          setErrorModalMessage(result.error);
          document.title = "Task Not Found | TSE Todos";
        }
      })
      .catch((err) => {
        setErrorModalMessage(String(err));
        document.title = "Error | TSE Todos";
      });
  }, [id]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleFormSubmit = (updatedTask: Task) => {
    setTask(updatedTask);
    setIsEditing(false);
    document.title = `${updatedTask.title} | TSE Todos`;
  };

  if (!task && !errorModalMessage) {
    return (
      <Page>
        <div className={styles.container}>
          <p className={styles.loading}>Loading...</p>
        </div>
      </Page>
    );
  }

  return (
      <div className={styles.container}>
        <Link to="/" className={styles.backLink}>
          Back to home
        </Link>

        {task && !isEditing && (
          <>
            <div className={styles.headerRow}>
              <h1 className={styles.title}>{task.title}</h1>
              <Button kind="primary" label="Edit task" onClick={handleEditClick} />
            </div>

            {task.description && <p className={styles.description}>{task.description}</p>}

            <div className={styles.metaGrid}>
              <span className={styles.metaLabel}>Assignee</span>
              <UserTag user={task.assignee} />

              <span className={styles.metaLabel}>Status</span>
              <span className={styles.metaValue}>{task.isChecked ? "Done" : "Not done"}</span>

              <span className={styles.metaLabel}>Date created</span>
              <span className={styles.metaValue}>
                {new Intl.DateTimeFormat("en-US", {
                  dateStyle: "full",
                  timeStyle: "short",
                }).format(new Date(task.dateCreated))}
              </span>
            </div>
          </>
        )}

        {task && isEditing && <TaskForm mode="edit" task={task} onSubmit={handleFormSubmit} />}

        <Dialog
          styleVersion="styled"
          variant="error"
          title="An error occurred"
          content={<p className={styles.errorModalText}>{errorModalMessage}</p>}
          isOpen={errorModalMessage !== null}
          onClose={() => setErrorModalMessage(null)}
        />
      </div>
  );
}
