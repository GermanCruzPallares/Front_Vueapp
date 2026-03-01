docker-compose build && docker compose up
docker-compose build ; docker compose up

### ¿Cómo se popula la base de datos?

`Program.cs
`context.Database.Migrate();`
Esto se encarga de crear la base de datos en el servidor de SQL Server en caso de que no exista, y a su vez corre todas las

**Migraciones de Entity Framework Core**.
`AppDbContext.cs` (`OnModelCreating`)

| **Admin** | `admin` | `admin123` |
| **Usuario** | `testuser` | `user123` |

http://localhost:8080/swagger/index.html
http://localhost:5173
