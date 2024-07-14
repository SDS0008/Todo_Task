CREATE TABLE todo (id	INTEGER PRIMARY KEY UNIQUE,
todo	TEXT,
priority	TEXT,
status	TEXT,
category	TEXT,
dueDate	DATE);

SELECT * FROM todo;


SELECT * FROM todo WHERE todo LIKE "%Buy% ";


SELECT * FROM todo WHERE  status = '${status}' OR priority = '${priority}' OR category = '${category}';


SELECT * FROM todo WHERE ( priority = '${priority}' AND status = '${status}') OR (category = '${category}' AND status = '${status}') OR (category = '${category}' AND priority = '${priority}');