CREATE TABLE task (
  id SERIAL PRIMARY KEY,
  description VARCHAR(140),
  priority INT
);

CREATE TABLE list (
  id SERIAL PRIMARY KEY,
  title VARCHAR(140)
);

CREATE TABLE task_list (
  task_id INT REFERENCES task(id) ON DELETE CASCADE,
  list_id INT REFERENCES list(id) ON DELETE CASCADE,
  complete BOOLEAN
);
