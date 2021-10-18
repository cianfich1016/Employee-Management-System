INSERT INTO department (department_name)
VALUES  ("Executive"),
        ("Sales"),
        ("Fitness");
      

INSERT INTO job_role (title, salary, department_id)
VALUES  ("Owner", 200000.00, 1),
        ("General Manager", 60000.00, 1),
        ("Sales Manager", 40000.00, 2),
        ("Lead Teacher", 35000.00, 3),
        ("Sales Representative", 25000.00, 2),
        ("Instructor", 20000.00, 3);

INSERT INTO employee (first_name, last_name, job_role_id, manager_id)
VALUES  ("Moana", "Toker", 1, NULL),
        ("Marshall", "Toker", 1, NULL),
        ("Rachel", "Cinfy", 2, 1),
        ("Mallory", "Berry", 4, 2),
        ("Alexandra", "Krane", 3, 2),
        ("Estefania", "House", 5, 3),
        ("Jameson", "Tilman", 5, 3),
        ("Jordan", "Andrews", 5, 3),
        ("Michele", "Lowers", 6, 4),
        ("Rebecca", "Donny", 6, 4),
        ("Jennifer", "Kettle", 6, 4),
        ("Mark", "Greene", 6, 4);

