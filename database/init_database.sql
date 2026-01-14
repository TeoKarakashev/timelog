CREATE OR REPLACE PROCEDURE init_database()
LANGUAGE plpgsql
AS $$
DECLARE
  firstNamesList TEXT[] := ARRAY[
    'John','Gringo','Mark','Lisa','Maria',
    'Sonya','Philip','Jose','Lorenzo','George','Justin'
  ];

  lastNamesList TEXT[] := ARRAY[
    'Johnson','Lamas','Jackson','Brown','Mason',
    'Rodriguez','Roberts','Thomas','Rose','McDonalds'
  ];

  domains TEXT[] := ARRAY['hotmail.com','gmail.com','live.com'];

  i INT;
  logsTarget INT;
  logsInserted INT;
  attempts INT;
  chosenDate DATE;
  chosenHours NUMERIC(4,2);
  dailyHours NUMERIC(4,2);

  firstName TEXT;
  lastName TEXT;
  email TEXT;
  userId INT;
  projectId INT;
BEGIN

  TRUNCATE TABLE time_logs, users, projects, collected_logs RESTART IDENTITY CASCADE;

  INSERT INTO projects (name)
  VALUES ('My own'), ('Free Time'), ('Work');

  FOR i IN 1..100 LOOP
    firstName := firstNamesList[1 + floor(random() * array_length(firstNamesList,1))];
    lastName := lastNamesList[1 + floor(random() * array_length(lastNamesList,1))];
    email := lower(firstName || '.' || lastName || i || '@' ||
      domains[1 + floor(random() * array_length(domains,1))]);

    INSERT INTO users (first_name, last_name, email)
    VALUES (firstName, lastName, email)
    RETURNING id INTO userId;

    logsTarget := 1 + floor(random() * 20);
    logsInserted := 0;

    WHILE logsInserted < logsTarget LOOP
      chosenDate := CURRENT_DATE - (floor(random() * 30))::INT;

      SELECT COALESCE(SUM(hours), 0)
      INTO dailyHours
      FROM time_logs
      WHERE user_id = userId AND work_date = chosenDate;

      chosenHours := round((random() * 7.75 + 0.25)::numeric, 2);

      IF dailyHours + chosenHours <= 8 THEN
        SELECT id INTO projectId FROM projects ORDER BY random() LIMIT 1;

        INSERT INTO time_logs (user_id, project_id, work_date, hours)
        VALUES (userId, projectId, chosenDate, chosenHours);
        logsInserted := logsInserted + 1;
      END IF;
    END LOOP;
  END LOOP;
END;
$$;
