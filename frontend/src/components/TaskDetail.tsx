import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Dialog } from "@tritonse/tse-constellation";

import { getTask, type Task } from "src/api/tasks";
import { Button } from "src/components";
import styles from "./TaskDetail.module.css";

export function TaskDetailItem() {
  const { id } = useParams<{ id: string }>();

  const [task, setTask] = useState<Task | null>(null);
  const [errorModalMessage, setErrorModalMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    void getTask(id)
      .then((result) => {
        if (result.success) {
          setTask(result.data);
          document.title = result.data.title;
        } else {
          setErrorModalMessage(result.error);
        }
      })
      .catch((err) => {
        setErrorModalMessage(String(err));
      });
  }, [id]);

  if (!task && !errorModalMessage) {
    return <p className={styles.loading}>Loading...</p>;
  }

  return (
    <div className={styles.container}>
      <Link to="/" className={styles.backLink}>
        Back to home
      </Link>

      {task && (
        <>
          <div className={styles.headerRow}>
            <h1 className={styles.title}>{task.title}</h1>
            <Button kind="primary" label="Edit task" />
          </div>

          {task.description && (
            <p className={styles.description}>{task.description}</p>
          )}

          <div className={styles.metaGrid}>
            <span className={styles.metaLabel}>Assignee</span>
            <span className={styles.metaValue}>
              {task.assignee?.name ?? "Not Assigned"}
            </span>

            <span className={styles.metaLabel}>Status</span>
            <span className={styles.metaValue}>
              {task.isChecked ? "Done" : "Not done"}
            </span>

            <span className={styles.metaLabel}>Date created</span>
            <span className={styles.metaValue}>
              {new Date(task.dateCreated).toLocaleString(undefined, {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
                hour: "numeric",
                minute: "2-digit",
              })}
            </span>
          </div>
        </>
      )}

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
