CREATE TABLE Usuario
(
	Id int IDENTITY(1,1) PRIMARY KEY,
	Nome varchar(100),
	Email varchar(200),
	Password varchar(100)
)

CREATE TABLE Task
(
	Id int IDENTITY(1,1) PRIMARY KEY,
	Descricao varchar(200),
	EstimateAt DateTime NULL,
	DoneAt DateTime null,
	UsuarioId int,
	Constraint Task_Usuario FOREIGN KEY (UsuarioId) REFERENCES Usuario
)

SELECT * FROM Usuario

INSERT INTO Usuario 
(Nome, Email)
VALUES
('Matheus Brito', 'maatheusbrito@hotmail.com')

delete from Usuario where nome <> 'Matheus'
