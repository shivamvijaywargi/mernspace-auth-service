# May not work for windows, but you can check the commands from this file and copy paste them in your terminal
pg-up:
	docker run --rm --name mern-postgres -e POSTGRES_USER=root -e POSTGRES_PASSWORD=root -v pgdata:/var/lib/postgresql/data -p 5432:5432 -d postgres