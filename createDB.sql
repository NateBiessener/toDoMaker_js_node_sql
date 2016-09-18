CREATE TABLE task (
  id SERIAL PRIMARY KEY,
  description VARCHAR(140),
  complete BOOLEAN,
  priority INT
);
